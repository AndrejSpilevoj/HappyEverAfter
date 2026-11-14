import { env } from 'cloudflare:workers';
import { googleRoute, googleTeacher, googleLogout, drivePut, driveGet, driveTrash, gmailReady, gmailSend, digest } from './google';
import type { GoogleEnv } from './google';
const OWNER = 'andrej.spilevoj@gmail.com';
type Bindings = Cloudflare.Env & GoogleEnv & { RESEND_API_KEY?:string; EMAIL_FROM?:string; TEACHER_EMAIL?:string };
type Actor = {role:'teacher';name:string} | {role:'student';id:string;name:string;student_group:'regular'|'remote';service_plan:'homework'|'topics'|null;credits_used:number};
const e = env as Bindings;
const db = () => { if(!e.DB) throw new Error('Duomenų bazė dar neprijungta.'); return e.DB; };
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
export const hash = async (s:string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,'0')).join('');
const token = () => Array.from(crypto.getRandomValues(new Uint8Array(24))).map(b=>b.toString(16).padStart(2,'0')).join('');
function code(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>a[b%32]).join('');}
function fail(message:string,status=400):never {throw Object.assign(new Error(message),{status});}
const json = (data:unknown,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff',...headers}});
const clean = (s:unknown,max=5000)=> typeof s==='string'?s.trim().slice(0,max):'';
const username = (v:unknown)=>clean(v,80).normalize('NFKC').toLowerCase();
const creditSQL = `(SELECT COALESCE(SUM(CASE t.kind WHEN 'homework' THEN 1 WHEN 'topic' THEN 2 ELSE 0 END),0) FROM assignments ca JOIN tasks t ON t.id=ca.task_id WHERE ca.student_id=s.id)`;
export const creditProgress=(total:number)=>total>0?(total-1)%4+1:0;
const b64=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes));
const bytes=(s:string)=>Uint8Array.from(atob(s),x=>x.charCodeAt(0));
async function passwordBits(password:string,salt:Uint8Array){
 const enc=new TextEncoder();
 const pepper=e.GOOGLE_CLIENT_SECRET;
 let input:Uint8Array<ArrayBuffer>=enc.encode(password);
 if(pepper){const key=await crypto.subtle.importKey('raw',enc.encode(pepper),{name:'HMAC',hash:'SHA-256'},false,['sign']);input=new Uint8Array(await crypto.subtle.sign('HMAC',key,input));}
 const key=await crypto.subtle.importKey('raw',input,'PBKDF2',false,['deriveBits']);
 return new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:salt as Uint8Array<ArrayBuffer>,iterations:100000,hash:'SHA-256'},key,256));
}
export async function passwordHash(password:string){const salt=crypto.getRandomValues(new Uint8Array(16));return 'pbkdf2-sha256:100000:'+b64(salt)+':'+b64(await passwordBits(password,salt));}
let dummyHash:Promise<string>|undefined;
async function passwordMatches(password:unknown,encoded?:string|null){
 if(typeof password!=='string'||password.length>128)return false;
 const stored=encoded||await (dummyHash??=passwordHash('unused-dummy-password'));
 const parts=stored.split(':');if(parts.length!==4||parts[0]!=='pbkdf2-sha256'||parts[1]!=='100000')return false;
 const actual=await passwordBits(password,bytes(parts[2])),expected=bytes(parts[3]);
 let diff=actual.length^expected.length;for(let i=0;i<actual.length;i++)diff|=actual[i]^(expected[i]||0);
 return Boolean(encoded)&&diff===0;
}
function validPassword(value:unknown,teacherAccount=false):asserts value is string {if(typeof value!=='string'||value.length<(teacherAccount?12:8)||value.length>128)fail(teacherAccount?'Slaptažodis turi būti 12–128 simbolių.':'Slaptažodis turi būti 8–128 simbolių.');}
async function loginLimit(req:Request,name:string){
 const stamp=Date.now();for(const [key,max] of [['ip:'+ (req.headers.get('cf-connecting-ip')||'local'),25],['account:'+name,12]] as const){
  const row=await db().prepare('INSERT INTO auth_attempts(key,count,reset) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset<? THEN 1 ELSE count+1 END,reset=CASE WHEN reset<? THEN excluded.reset ELSE reset END RETURNING count').bind(await hash(key),stamp+900000,stamp,stamp).first<{count:number}>();
  if((row?.count||0)>max)fail('Per daug bandymų. Pabandyk po 15 minučių.',429);
 }
}
async function credentials(data:any,id?:string){
 const name=username(data.username);if(!/^[\p{L}\p{N}][\p{L}\p{N}._-]{2,31}$/u.test(name))fail('Prisijungimo vardas: 3–32 raidės, skaitmenys, taškas, brūkšnelis arba pabraukimas.');
 const taken=await db().prepare('SELECT id FROM students WHERE username=? AND id!=?').bind(name,id||'').first();if(taken)fail('Šis prisijungimo vardas jau naudojamas.');
 let password:string|null=null;if(data.password!==undefined&&data.password!==''){validPassword(data.password);password=await passwordHash(data.password);}
 return {name,password};
}
async function teacherSession(){
 const value=b64(crypto.getRandomValues(new Uint8Array(32))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 await db().prepare('INSERT INTO teacher_sessions(hash,email,expires) VALUES(?,?,?)').bind(await digest(value),(e.TEACHER_EMAIL||OWNER).toLowerCase(),Date.now()+7*86400000).run();
 return json({ok:true},200,{'Set-Cookie':`__Host-math_teacher=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`});
}
async function actor(req:Request):Promise<Actor|null>{
 if(e.DEPLOYMENT_TARGET==='cloudflare'){
  const owner=await googleTeacher(req,e);if(owner)return owner;
 }
 const email=req.headers.get('oai-authenticated-user-email');
 if(e.DEPLOYMENT_TARGET!=='cloudflare' && req.headers.get('oai-authenticated-user-id') && email?.toLowerCase()===(e.TEACHER_EMAIL||OWNER).toLowerCase())return {role:'teacher',name:'Andrius'};
 const cookie=req.headers.get('cookie')?.match(/(?:^|;\s*)math_session=([a-f0-9]{48})(?:;|$)/)?.[1];
 if(!cookie)return null;
 const s=await db().prepare(`SELECT s.id,s.name,s.student_group,s.service_plan,${creditSQL} AS credits_used FROM sessions x JOIN students s ON s.id=x.student_id WHERE x.hash=? AND x.expires>? AND s.active=1`).bind(await hash(cookie),Date.now()).first<{id:string;name:string;student_group:'regular'|'remote';service_plan:'homework'|'topics'|null;credits_used:number}>();
 return s?{role:'student',...s}:null;
}
function teacher(a:Actor|null){if(a?.role!=='teacher')fail('Reikia mokytojo prisijungimo.',403);}
async function assigned(a:Actor,task:string,sid:string){
 if(a.role==='student' && a.id!==sid)fail('Ši užduotis tau nepriskirta.',403);
 if(!await db().prepare('SELECT 1 FROM assignments WHERE task_id=? AND student_id=?').bind(task,sid).first())fail('Užduotis nerasta.',404);
}
const emailReady=()=>e.DEPLOYMENT_TARGET==='cloudflare'?gmailReady(e):Promise.resolve(Boolean(e.RESEND_API_KEY&&e.EMAIL_FROM));
async function deliver(n:any){
 if(!await emailReady())return false;
 // Atomically claim a queued message so simultaneous retries cannot send it twice.
 const claimed=await db().prepare("UPDATE notifications SET status='sending',attempts=attempts+1 WHERE id=? AND status IN ('pending','failed') AND attempts<5 RETURNING id").bind(n.id).first();
 if(!claimed)return false;
 let ok=false;
 try{
  if(e.DEPLOYMENT_TARGET==='cloudflare')ok=await gmailSend(e,n);
  else{
   const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${e.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':n.id},body:JSON.stringify({from:e.EMAIL_FROM,to:[n.recipient],subject:n.subject,text:n.body})});ok=res.ok;
  }
 }catch(err:any){
  await db().prepare('UPDATE notifications SET status=? WHERE id=?').bind(err.uncertain?'unknown':'failed',n.id).run();
  return false;
 }
 await db().prepare('UPDATE notifications SET status=? WHERE id=?').bind(ok?'sent':'failed',n.id).run();return ok;
}
async function notify(to:string,subject:string,body:string){
 const n={id:uid(),recipient:to,subject,body,status:'pending',created:now()};
 await db().prepare('INSERT INTO notifications(id,recipient,subject,body,status,created) VALUES(?,?,?,?,?,?)').bind(n.id,to,subject,body,n.status,n.created).run();
 return deliver(n);
}
async function collectFiles(form:FormData,media:boolean){
 const items=form.getAll('files').filter(x=>x instanceof File && x.size>0) as File[];
 if(items.length>5)fail('Vienu kartu galima pridėti iki 5 failų.');
 if(items.reduce((s,f)=>s+f.size,0)>25*1024*1024)fail('Bendras failų dydis turi būti iki 25 MB.');
 const result=[];
 for(const f of items){
  if(f.size>(media?25:10)*1024*1024)fail(media?'Vieno failo dydis turi būti iki 25 MB.':'Vienos nuotraukos dydis turi būti iki 10 MB.');
  const bytes=new Uint8Array(await f.arrayBuffer());
  const sig=String.fromCharCode(...bytes.slice(0,12)); let mime='';
  if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)mime='image/jpeg';
  else if(bytes[0]===137&&sig.slice(1,4)==='PNG')mime='image/png';
  else if(sig.startsWith('RIFF')&&sig.slice(8,12)==='WEBP')mime='image/webp';
  else if(sig.startsWith('GIF8'))mime='image/gif';
  else if(media&&bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3)mime=f.type.startsWith('audio/')?'audio/webm':'video/webm';
  else if(media&&sig.startsWith('OggS'))mime='audio/ogg';
  else if(media&&sig.slice(4,8)==='ftyp')mime=f.type.startsWith('audio/')?'audio/mp4':'video/mp4';
  else if(media&&(sig.startsWith('ID3')||(bytes[0]===255&&(bytes[1]&0xe0)===0xe0)))mime='audio/mpeg';
  else fail('Tinka JPG, PNG, WebP ar GIF nuotraukos. Mokytojas gali pridėti ir MP4, WebM, MP3 ar M4A įrašą. HEIC nuotrauką pirmiausia išsaugok kaip JPG.');
  result.push({id:uid(),name:f.name.replace(/[\x00-\x1f]/g,'').slice(0,180),mime,size:f.size,bytes});
 }
 return result;
}
async function upload(items:any[]){
 if(!items.length)return;
 try{
  for(const f of items){
   if(e.DEPLOYMENT_TARGET==='cloudflare')await drivePut(e,f);
   else {if(!e.BUCKET)fail('Failų saugykla dar neprijungta.',503);await e.BUCKET!.put(f.id,f.bytes,{httpMetadata:{contentType:f.mime}});}
  }
 }catch(err){await cleanup(items).catch(()=>{});throw err;}
}
async function cleanup(items:any[]){
 const results=await Promise.allSettled(items.map(f=>e.DEPLOYMENT_TARGET==='cloudflare'?driveTrash(e,f.id):e.BUCKET?.delete(f.id)));
 if(results.some(r=>r.status==='rejected'))console.error('Failed to clean up an incomplete attachment upload');
}
function fileInsert(f:any,task:string,msg:string|null,sid:string|null){return db().prepare('INSERT INTO files(id,task_id,message_id,student_id,name,mime,size) VALUES(?,?,?,?,?,?,?)').bind(f.id,task,msg,sid,f.name,f.mime,f.size);}
async function listTasks(a:Actor){
 const q=a.role==='teacher'?db().prepare(`SELECT t.*,MIN(a.student_id) AS student_id,MIN(s.name) AS student_name,MIN(s.student_group) AS student_group,COUNT(DISTINCT a.student_id) AS recipients,(SELECT COUNT(DISTINCT student_id) FROM messages m WHERE m.task_id=t.id AND m.author='student') AS replies,(SELECT author FROM messages m WHERE m.task_id=t.id ORDER BY m.created DESC LIMIT 1) AS last_author FROM tasks t JOIN assignments a ON a.task_id=t.id JOIN students s ON s.id=a.student_id GROUP BY t.id ORDER BY t.created DESC`):db().prepare(`SELECT t.*,a.seen,(SELECT COUNT(*) FROM messages m WHERE m.task_id=t.id AND m.student_id=? AND m.author='student') AS replies,(SELECT author FROM messages m WHERE m.task_id=t.id AND m.student_id=? ORDER BY m.created DESC LIMIT 1) AS last_author FROM tasks t JOIN assignments a ON a.task_id=t.id WHERE a.student_id=? ORDER BY t.created DESC`).bind(a.id,a.id,a.id);
 return (await q.all()).results;
}
export async function api(req:Request,path:string[]):Promise<Response>{
 try{
 const url=new URL(req.url); const method=req.method; const key=path.join('/');
 if(e.DEPLOYMENT_TARGET==='cloudflare'){
  const google=await googleRoute(req,key,e);if(google)return google;
 }
 if(!['GET','HEAD'].includes(method)){
  if(req.headers.get('origin')!==url.origin || req.headers.get('sec-fetch-site')==='cross-site')fail('Neteisinga užklausos kilmė.',403);
  if(Number(req.headers.get('content-length')||0)>27*1024*1024)fail('Failai per dideli.',413);
 }
 if(key==='login/options'&&method==='GET')return json({teacherPasswordReady:Boolean(await db().prepare("SELECT 1 FROM app_settings WHERE key='teacher_password'").first())});
 if(key==='teacher/login'&&method==='POST'){
  const data:any=await req.json();const email=clean(data.email,254).toLowerCase();await loginLimit(req,'teacher:'+email);
  const stored=await db().prepare("SELECT value FROM app_settings WHERE key='teacher_password'").first<{value:string}>();
  const valid=await passwordMatches(data.password,stored?.value);
  if(email!==(e.TEACHER_EMAIL||OWNER).toLowerCase()||!valid)fail('Patikrink el. paštą ir slaptažodį.',401);
  return teacherSession();
 }
 if(key==='login'&&method==='POST'){
  const data:any=await req.json(),name=username(data.username);await loginLimit(req,name||'legacy');const stamp=Date.now();
  let student:{id:string;password_hash?:string|null}|null=null;
  if(name){
   student=await db().prepare('SELECT id,password_hash FROM students WHERE username=? AND active=1').bind(name).first();
   if(!await passwordMatches(data.password,student?.password_hash))fail('Patikrink prisijungimo vardą ir slaptažodį.',401);
  }else{
   // Transitional compatibility for existing accounts until the teacher sets their new credentials.
   const val=clean(data.code,40).replace(/[\s-]/g,'').toUpperCase();
   student=await db().prepare('SELECT id FROM students WHERE code_hash=? AND password_hash IS NULL AND active=1').bind(await hash(val)).first();
   if(!student)fail('Patikrink prisijungimo duomenis arba parašyk mokytojui.',401);
  }
  if(!student)fail('Patikrink prisijungimo duomenis.',401);
  const t=token();await db().batch([db().prepare('DELETE FROM sessions WHERE expires<?').bind(stamp),db().prepare('INSERT INTO sessions(hash,student_id,expires) VALUES(?,?,?)').bind(await hash(t),student.id,stamp+90*86400000)]);
  return json({ok:true},200,{'Set-Cookie':`math_session=${t}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=7776000`});
 }
 if(key==='logout'&&method==='POST'){
  const teacherCookie=e.DEPLOYMENT_TARGET==='cloudflare'?await googleLogout(req,e):null;
  const t=req.headers.get('cookie')?.match(/(?:^|;\s*)math_session=([a-f0-9]{48})(?:;|$)/)?.[1];if(t)await db().prepare('DELETE FROM sessions WHERE hash=?').bind(await hash(t)).run();
  const result=json({ok:true},200,{'Set-Cookie':'math_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'});
  if(teacherCookie)result.headers.append('Set-Cookie',teacherCookie);
  return result;
 }
 const a=await actor(req);
 if(key==='me')return json({user:a,emailReady:a?.role==='teacher'?await emailReady():undefined,teacherPasswordReady:a?.role==='teacher'?Boolean(await db().prepare("SELECT 1 FROM app_settings WHERE key='teacher_password'").first()):undefined});
 if(!a)fail('Prisijunk, kad atidarytum savo erdvę.',401);
 if(key==='teacher/password'&&method==='POST'){
  teacher(a);const data:any=await req.json();await loginLimit(req,'teacher-password-change');
  const stored=await db().prepare("SELECT value FROM app_settings WHERE key='teacher_password'").first<{value:string}>();
  if(stored&&!await passwordMatches(data.currentPassword,stored.value))fail('Dabartinis slaptažodis netinka.',403);
  validPassword(data.password,true);const encoded=await passwordHash(data.password);
  // Compare-and-swap also prevents two first-time setup requests from overwriting each other.
  if(stored){const changed=await db().prepare("UPDATE app_settings SET value=? WHERE key='teacher_password' AND value=? RETURNING key").bind(encoded,stored.value).first();if(!changed)fail('Slaptažodis jau pakeistas. Bandyk dar kartą.',409);}
  else{const created=await db().prepare("INSERT INTO app_settings(key,value) VALUES('teacher_password',?) ON CONFLICT(key) DO NOTHING RETURNING key").bind(encoded).first();if(!created)fail('Slaptažodis jau nustatytas.',409);}
  await db().prepare('DELETE FROM teacher_sessions').run();return teacherSession();
 }
 if(key==='tasks'&&method==='GET')return json(await listTasks(a));
 if(key==='students'&&method==='GET'){teacher(a);return json((await db().prepare(`SELECT s.id,s.name,s.email,s.active,s.created,s.student_group,s.username,s.service_plan,${creditSQL} AS credits_used FROM students s ORDER BY s.name COLLATE NOCASE`).all()).results);}
 if(key==='students'&&method==='POST'){
  teacher(a);const data:any=await req.json();const name=clean(data.name,80),email=clean(data.email,254).toLowerCase();
  if(!name)fail('Įrašyk mokinio vardą.');if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail('Patikrink el. pašto adresą.');
  const group=data.student_group||'regular';
  if(!['regular','remote'].includes(group))fail('Pasirink mokinių grupę.');
  const plan=group==='remote'?(data.service_plan||'homework'):null;
  if(group==='remote'&&(!email||!['homework','topics'].includes(plan)))fail('Nuotolinei pagalbai reikia el. pašto ir pasirinkto paketo.');
  const login=data.username?await credentials(data):null;if(login&&!login.password)fail('Įrašyk slaptažodį.');
  const c=code(),id=uid();await db().prepare('INSERT INTO students(id,name,email,code_hash,created,student_group,service_plan,username,password_hash) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,name,email||null,await hash(c),now(),group,plan,login?.name||null,login?.password||null).run();return json(login?{id,username:login.name}:{id,code:c});
 }
 if(path[0]==='students'&&path.length===2&&method==='PATCH'){
  teacher(a);const data:any=await req.json();const id=path[1];const existing=await db().prepare('SELECT id,student_group,service_plan,username,password_hash FROM students WHERE id=?').bind(id).first<any>();if(!existing)fail('Mokinys nerastas.',404);
  if(data.rotate){const c=code();await db().batch([db().prepare('UPDATE students SET code_hash=? WHERE id=?').bind(await hash(c),id),db().prepare('DELETE FROM sessions WHERE student_id=?').bind(id)]);return json({code:c});}
  if(typeof data.active==='boolean'){await db().batch([db().prepare('UPDATE students SET active=? WHERE id=?').bind(data.active?1:0,id),db().prepare('DELETE FROM sessions WHERE student_id=?').bind(id)]);return json({ok:true});}
  const name=clean(data.name,80),email=clean(data.email,254).toLowerCase();if(!name||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail('Patikrink vardą ir el. pašto adresą.');
  if(data.student_group&&data.student_group!==existing.student_group)fail('Mokinio grupė parenkama kuriant prieigą.');
  const plan=existing.student_group==='remote'?(data.service_plan||existing.service_plan):null;
  if(existing.student_group==='remote'&&(!email||!['homework','topics'].includes(plan)))fail('Nuotolinei pagalbai reikia el. pašto ir pasirinkto paketo.');
  const login=data.username!==undefined?await credentials(data,id):null;
  if(login&&!existing.password_hash&&!login.password)fail('Įrašyk slaptažodį.');
  await db().batch([db().prepare('UPDATE students SET name=?,email=?,service_plan=?,username=?,password_hash=? WHERE id=?').bind(name,email||null,plan,login?.name||existing.username||null,login?.password||existing.password_hash||null,id),...(login&&(login.password||login.name!==existing.username)?[db().prepare('DELETE FROM sessions WHERE student_id=?').bind(id)]:[])]);return json({ok:true});
 }
 if(key==='questions'&&method==='POST'){
  if(a.role!=='student')fail('Ši forma skirta mokiniams.',403);
  const f=await req.formData(),body=clean(f.get('body')),items=await collectFiles(f,false);
  if(!body&&!items.length)fail('Parašyk klausimą arba pridėk uždavinio nuotrauką.');
  const helpType=clean(f.get('help_type'));if(a.student_group==='remote'&&helpType&&!['homework','topic'].includes(helpType))fail('Pasirink pagalbos tipą.');
  const kind=a.student_group==='remote'?(helpType||(a.service_plan==='topics'?'topic':'homework')):'question';
  const id=uid(),title=clean(f.get('title'),120)||(kind==='homework'?'Namų darbo patikra':kind==='topic'?'Temos paaiškinimas':'Klausimas mokytojui');await upload(items);
  try{await db().batch([db().prepare('INSERT INTO tasks(id,title,body,kind,created) VALUES(?,?,?,?,?)').bind(id,title,body,kind,now()),db().prepare('INSERT INTO assignments(task_id,student_id) VALUES(?,?)').bind(id,a.id),...items.map(x=>fileInsert(x,id,null,a.id))]);}catch(err){await cleanup(items);throw err;}
  const sent=await notify(OWNER,`${a.student_group==='remote'?'Nuotolinė pagalba: ':''}${a.name} uždavė klausimą`,`${a.name} atsiuntė klausimą: ${title}.\n\nAtidaryti: ${url.origin}/?area=teacher&task=${id}&student=${a.id}\n\nMatematika be streso`);
  return json({id,queued:sent?0:1});
 }
 if(key==='tasks'&&method==='POST'){
  teacher(a);const f=await req.formData();const body=clean(f.get('body'));const items=await collectFiles(f,false);if(!body&&!items.length)fail('Parašyk užduotį arba pridėk nuotrauką.');
  const ids=[...new Set(f.getAll('students').map(String))];if(!ids.length||ids.length>200)fail('Pasirink bent vieną mokinį (iki 200).');
  const people=await db().prepare(`SELECT id,name,email,student_group FROM students WHERE active=1 AND id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).all<any>();
  if(people.results.length!==ids.length)fail('Atnaujink mokinių sąrašą ir pasirink dar kartą.');
  if(people.results.some(s=>s.student_group==='remote'))fail('Nuotolinės pagalbos mokinys pats pateikia užklausą. Atsakyk jo pokalbyje.');
  const id=uid(),title=clean(f.get('title'),120)||body.slice(0,70)||'Užduotis nuotraukoje';
  await upload(items);
  try{await db().batch([db().prepare('INSERT INTO tasks(id,title,body,created) VALUES(?,?,?,?)').bind(id,title,body,now()),...ids.map(sid=>db().prepare('INSERT INTO assignments(task_id,student_id) VALUES(?,?)').bind(id,sid)),...items.map(x=>fileInsert(x,id,null,null))]);}catch(err){await cleanup(items);throw err;}
  let sent=0,queued=0;
  for(const s of people.results){if(s.email){const ok=await notify(s.email,'Nauja matematikos užduotis',`Labas, ${s.name}!\n\nTau paskirta nauja užduotis: ${title}.\nAtidaryk savo mokinio erdvę: ${url.origin}/?area=student&task=${id}\n\nMatematika be streso`);ok?sent++:queued++;}}
  return json({id,sent,queued});
 }
 if(path[0]==='tasks'&&path.length===2&&method==='GET'){
  const id=path[1];const sid=a.role==='student'?a.id:url.searchParams.get('student');
  const t=await db().prepare('SELECT * FROM tasks WHERE id=?').bind(id).first();if(!t)fail('Užduotis nerasta.',404);
  let people:any[]=[];
  if(a.role==='teacher')people=(await db().prepare(`SELECT s.id,s.name,(SELECT COUNT(*) FROM messages m WHERE m.task_id=? AND m.student_id=s.id AND m.author='student') AS replies FROM assignments a JOIN students s ON s.id=a.student_id WHERE a.task_id=? ORDER BY s.name`).bind(id,id).all()).results;
  const student=sid||people[0]?.id;if(!student)fail('Pasirink mokinį.');await assigned(a,id,student);
  if(a.role==='student')await db().prepare('UPDATE assignments SET seen=1 WHERE task_id=? AND student_id=?').bind(id,student).run();
  const msgs=(await db().prepare('SELECT * FROM messages WHERE task_id=? AND student_id=? ORDER BY created,id').bind(id,student).all()).results;
  const fs=(await db().prepare('SELECT id,message_id,name,mime,size FROM files WHERE task_id=? AND (message_id IS NULL OR student_id=?)').bind(id,student).all()).results;
  const person=await db().prepare('SELECT student_group FROM students WHERE id=?').bind(student).first<any>();
  return json({task:t,students:people,studentId:student,studentGroup:person?.student_group||'regular',messages:msgs,files:fs});
 }
 if(key==='messages'&&method==='POST'){
  const f=await req.formData(),task=clean(f.get('task'),40),sid=a.role==='student'?a.id:clean(f.get('student'),40);await assigned(a,task,sid);
  const body=clean(f.get('body'));const items=await collectFiles(f,a.role==='teacher');if(!body&&!items.length)fail('Parašyk žinutę arba pridėk failą.');
  const id=uid();await upload(items);try{await db().batch([db().prepare('INSERT INTO messages(id,task_id,student_id,author,body,created) VALUES(?,?,?,?,?,?)').bind(id,task,sid,a.role,body,now()),...items.map(x=>fileInsert(x,task,id,sid))]);}catch(err){await cleanup(items);throw err;}
  const t=await db().prepare('SELECT title FROM tasks WHERE id=?').bind(task).first<any>();
  const s=await db().prepare('SELECT name,email,student_group FROM students WHERE id=?').bind(sid).first<any>();let queued=0;
  const recipient=a.role==='student'?OWNER:s?.email;
  if(recipient){const title=a.role==='student'?`${s.student_group==='remote'?'Nuotolinė pagalba: ':''}${s.name} pateikė sprendimą`:'Mokytojas atsakė į tavo užduotį';const ok=await notify(recipient,title,`${title}.\nUžduotis: ${t.title}\n\nAtidaryti: ${url.origin}/?area=${a.role==='student'?'teacher':'student'}&task=${task}${a.role==='student'?'&student='+sid:''}\n\nMatematika be streso`);if(!ok)queued++;}
  return json({ok:true,queued});
 }
 if(path[0]==='files'&&path.length===2&&method==='GET'){
  const f=await db().prepare('SELECT * FROM files WHERE id=?').bind(path[1]).first<any>();if(!f)fail('Failas nerastas.',404);
  if(a.role==='student'){if(f.student_id && f.student_id!==a.id)fail('Failas nepasiekiamas.',403);await assigned(a,f.task_id,a.id);}
  const object=e.DEPLOYMENT_TARGET==='cloudflare'?await driveGet(e,f.id,req.headers.get('range')):await e.BUCKET?.get(f.id);if(!object)fail('Failas nerastas.',404);
  const rangeHeaders:Record<string,string>={};
  if('headers' in object){for(const name of ['content-range','content-length','accept-ranges']){const v=object.headers.get(name);if(v)rangeHeaders[name]=v;}}
  return new Response(object.body,{status:'status' in object?object.status:200,headers:{...rangeHeaders,'Content-Type':f.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`inline; filename*=UTF-8''${encodeURIComponent(f.name)}`}});
 }
 if(key==='notifications'&&method==='GET'){teacher(a);return json({ready:await emailReady(),pending:await db().prepare("SELECT COUNT(*) AS count FROM notifications WHERE status!='sent'").first()});}
 if(key==='notifications/retry'&&method==='POST'){
  teacher(a);if(!await emailReady())fail('Pirmiausia prijunk el. pašto siuntimo paslaugą.');const rows=(await db().prepare("SELECT * FROM notifications WHERE status IN ('pending','failed') AND attempts<5 ORDER BY created LIMIT 20").all()).results;let sent=0;for(const n of rows)if(await deliver(n))sent++;return json({sent});
 }
 return json({error:'Nerasta.'},404);
 }catch(err:any){const status=err.status||500;if(status===500)console.error('Math API failed:',err.message);return json({error:status===500?'Nepavyko atlikti veiksmo. Bandyk dar kartą.':err.message},status);}
}
