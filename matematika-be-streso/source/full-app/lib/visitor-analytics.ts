import {digest} from './google';
type Env={DB?:D1Database;GOOGLE_CLIENT_SECRET?:string};
let setup:Promise<unknown>|undefined;
async function ready(e:Env){
 if(!e.DB)throw new Error('Database unavailable');
 if(!setup)setup=e.DB.batch([
  e.DB.prepare("CREATE TABLE IF NOT EXISTS visitor_sessions (id TEXT PRIMARY KEY, visitor TEXT NOT NULL, day TEXT NOT NULL, created INTEGER NOT NULL, device TEXT NOT NULL, city TEXT NOT NULL, country TEXT NOT NULL, source TEXT NOT NULL)"),
  e.DB.prepare("CREATE INDEX IF NOT EXISTS visitor_sessions_day ON visitor_sessions(day)"),
  e.DB.prepare("CREATE INDEX IF NOT EXISTS visitor_sessions_visitor ON visitor_sessions(visitor,created)"),
  e.DB.prepare("CREATE TABLE IF NOT EXISTS visitor_exclusions (visitor TEXT PRIMARY KEY)"),
  e.DB.prepare("INSERT INTO app_settings(key,value) VALUES('visitor_stats_started',?) ON CONFLICT(key) DO NOTHING").bind(new Date().toISOString())
 ]).catch(err=>{setup=undefined;throw err;});
 await setup;return e.DB;
}
const day=(time:number)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Vilnius',year:'numeric',month:'2-digit',day:'2-digit'}).format(time);
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
const valid=(s:unknown):s is string=>typeof s==='string'&&/^[a-zA-Z0-9-]{32,64}$/.test(s);
export async function visitorAnalytics(req:Request,e:Env,role?:string){
 const db=await ready(e);const url=new URL(req.url);
 if(req.method==='POST'){
  if(Number(req.headers.get('content-length')||0)>2048)return reply({error:'Per didelė užklausa.'},413);
  const data=await req.json() as {visitor?:string;session?:string;referrer?:string;exclude?:boolean};
  if(!valid(data.visitor))return reply({error:'Neteisingi duomenys.'},400);
  const visitor=await digest('visitor:'+ (e.GOOGLE_CLIENT_SECRET||'math-stats')+':'+data.visitor);
  if(data.exclude===true){
   await db.prepare('DELETE FROM visitor_sessions WHERE visitor=?').bind(visitor).run();
   return reply({excluded:true});
  }
  if(!valid(data.session))return reply({error:'Neteisingi duomenys.'},400);
  // Obvious crawlers do not become visits; no IP or full user agent is stored.
  const ua=req.headers.get('user-agent')||'';
  if(/bot|crawl|spider|facebookexternalhit|preview|headless/i.test(ua))return reply({ignored:true});
  const device=/ipad|tablet|android(?!.*mobile)/i.test(ua)?'tablet':/mobile|iphone|ipod|android/i.test(ua)?'phone':'desktop';
  let source='Tiesiogiai / nežinoma';
  if(typeof data.referrer==='string'&&data.referrer.length<1200){try{
   const host=new URL(data.referrer).hostname.toLowerCase().replace(/^www\./,'');
   if(!['matematikabestreso.lt','matematika-be-streso.andrej-spilevoj.workers.dev'].includes(host)){
    source=/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(host)?'Facebook':/(^|\.)instagram\.com$/.test(host)?'Instagram':/(^|\.)google\.[a-z.]+$/.test(host)?'Google':host.slice(0,100);
   }
  }catch{}}
  const stamp=Date.now();
  let city='Nežinoma';try{city=decodeURIComponent(req.headers.get('x-math-geo-city')||'').slice(0,100)||'Nežinoma';}catch{}
  const country=(req.headers.get('x-math-geo-country')||'XX').slice(0,2);
  await db.batch([
   db.prepare('INSERT INTO visitor_sessions(id,visitor,day,created,device,city,country,source) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(await digest(visitor+':'+data.session),visitor,day(stamp),stamp,device,city,country,source),
   db.prepare('DELETE FROM visitor_sessions WHERE created<?').bind(stamp-365*86400000)
  ]);
  return reply({ok:true});
 }
 if(req.method!=='GET')return reply({error:'Neleidžiama.'},405);
 if(role!=='teacher')return reply({error:'Reikia mokytojo prisijungimo.'},403);
 const days=Number(url.searchParams.get('days')||30);
 if(![7,30,90,365].includes(days))return reply({error:'Neteisingas laikotarpis.'},400);
 const today=day(Date.now()),since=day(Date.now()-(days-1)*86400000);
 const summary=await db.prepare(`SELECT COUNT(*) AS visits,COUNT(DISTINCT visitor) AS uniqueVisitors,COUNT(DISTINCT CASE WHEN EXISTS(SELECT 1 FROM visitor_sessions previous WHERE previous.visitor=v.visitor AND previous.created<v.created) THEN visitor END) AS returningVisitors FROM visitor_sessions v WHERE day>=?`).bind(since).first();
 const daily=(await db.prepare('SELECT day,COUNT(*) AS visits,COUNT(DISTINCT visitor) AS visitors FROM visitor_sessions WHERE day>=? GROUP BY day ORDER BY day').bind(since).all()).results;
 const breakdown=async(field:string,limit=15)=>(await db.prepare('SELECT '+field+' AS name,COUNT(DISTINCT visitor) AS visitors,COUNT(*) AS visits FROM visitor_sessions WHERE day>=? GROUP BY '+field+' ORDER BY visitors DESC,visits DESC LIMIT '+limit).bind(since).all()).results;
 const started=await db.prepare("SELECT value FROM app_settings WHERE key='visitor_stats_started'").first<{value:string}>();
 const [devices,cities,countries,sources]=await Promise.all([breakdown('device',3),breakdown("city || ' · ' || country"),breakdown('country'),breakdown('source')]);
 return reply({days,since,today,started:started?.value,summary,daily,devices,cities,countries,sources});
}
