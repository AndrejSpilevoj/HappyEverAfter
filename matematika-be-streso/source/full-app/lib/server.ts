import { env } from 'cloudflare:workers';
const OWNER = 'andrej.spilevoj@gmail.com';
type Bindings = Cloudflare.Env & { RESEND_API_KEY?:string; EMAIL_FROM?:string; TEACHER_EMAIL?:string };
type Actor = {role:'teacher';name:string} | {role:'student';id:string;name:string};
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
async function actor(req:Request):Promise<Actor|null>{
 const email=req.headers.get('oai-authenticated-user-email');
 if(req.headers.get('oai-authenticated-user-id') && email?.toLowerCase()===(e.TEACHER_EMAIL||OWNER).toLowerCase())return {role:'teacher',name:'Andrius'};
 const cookie=req.headers.get('cookie')?.match(/(?:^|;\s*)math_session=([a-f0-9]{48})(?:;|$)/)?.[1];
 if(!cookie)return null;
 const s=await db().prepare('SELECT s.id,s.name FROM sessions x JOIN students s ON s.id=x.student_id WHERE x.hash=? AND x.expires>? AND s.active=1').bind(await hash(cookie),Date.now()).first<{id:string;name:string}>();
 return s?{role:'student',...s}:null;
}
function teacher(a:Actor|null){if(a?.role!=='teacher')fail('Reikia mokytojo prisijungimo.',403);}
async function assigned(a:Actor,task:string,sid:string){
 if(a.role==='student' && a.id!==sid)fail('Ši užduotis tau nepriskirta.',403);
 if(!await db().prepare('SELECT 1 FROM assignments WHERE task_id=? AND student_id=?').bind(task,sid).first())fail('Užduotis nerasta.',404);
}
const emailReady=()=>Boolean(e.RESEND_API_KEY&&e.EMAIL_FROM);
async function deliver(n:any){
 if(!emailReady())return false;
 try{
 const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${e.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':n.id},body:JSON.stringify({from:e.EMAIL_FROM,to:[n.recipient],subject:n.subject,text:n.body})});
 await db().prepare('UPDATE notifications SET status=?,attempts=attempts+1 WHERE id=?').bind(res.ok?'sent':'failed',n.id).run();return res.ok;
 }catch {await db().prepare("UPDATE notifications SET status='failed',attempts=attempts+1 WHERE id=?").bind(n.id).run();return false;}
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
async function upload(items:any[]){if(!items.length)return;if(!e.BUCKET)fail('Failų saugykla dar neprijungta.',503);for(const f of items)await e.BUCKET!.put(f.id,f.bytes,{httpMetadata:{contentType:f.mime}});}
async function cleanup(items:any[]){if(e.BUCKET)await Promise.all(items.map(f=>e.BUCKET!.delete(f.id)));}
function fileInsert(f:any,task:string,msg:string|null,sid:string|null){return db().prepare('INSERT INTO files(id,task_id,message_id,student_id,name,mime,size) VALUES(?,?,?,?,?,?,?)').bind(f.id,task,msg,sid,f.name,f.mime,f.size);}
async function listTasks(a:Actor){
 const q=a.role==='teacher'?db().prepare(`SELECT t.*,COUNT(DISTINCT a.student_id) AS recipients,(SELECT COUNT(DISTINCT student_id) FROM messages m WHERE m.task_id=t.id AND m.author='student') AS replies,(SELECT author FROM messages m WHERE m.task_id=t.id ORDER BY m.created DESC LIMIT 1) AS last_author FROM tasks t JOIN assignments a ON a.task_id=t.id GROUP BY t.id ORDER BY t.created DESC`):db().prepare(`SELECT t.*,a.seen,(SELECT COUNT(*) FROM messages m WHERE m.task_id=t.id AND m.student_id=? AND m.author='student') AS replies,(SELECT author FROM messages m WHERE m.task_id=t.id AND m.student_id=? ORDER BY m.created DESC LIMIT 1) AS last_author FROM tasks t JOIN assignments a ON a.task_id=t.id WHERE a.student_id=? ORDER BY t.created DESC`).bind(a.id,a.id,a.id);
 return (await q.all()).results;
}
export async function api(req:Request,path:string[]):Promise<Response>{
 try{
 const url=new URL(req.url); const method=req.method; const key=path.join('/');
 if(!['GET','HEAD'].includes(method)){
  if(req.headers.get('origin')!==url.origin || req.headers.get('sec-fetch-site')==='cross-site')fail('Neteisinga užklausos kilmė.',403);
  if(Number(req.headers.get('content-length')||0)>27*1024*1024)fail('Failai per dideli.',413);
 }
 if(key==='login'&&method==='POST'){
  const data:any=await req.json(); const val=clean(data.code,40).replace(/[\s-]/g,'').toUpperCase();
  const ip=await hash(req.headers.get('cf-connecting-ip')||'local');const stamp=Date.now();
  const limit=await db().prepare('INSERT INTO auth_attempts(key,count,reset) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset<? THEN 1 ELSE count+1 END,reset=CASE WHEN reset<? THEN excluded.reset ELSE reset END RETURNING count').bind(ip,stamp+900000,stamp,stamp).first<{count:number}>();
  if((limit?.count||0)>20)fail('Per daug bandymų. Pabandyk po 15 minučių.',429);
  const s=await db().prepare('SELECT id FROM students WHERE code_hash=? AND active=1').bind(await hash(val)).first<{id:string}>();
  if(!s)fail('Kodas netinka. Patikrink jį arba parašyk mokytojui.',401);
  const t=token();await db().batch([db().prepare('DELETE FROM sessions WHERE expires<?').bind(stamp),db().prepare('INSERT INTO sessions(hash,student_id,expires) VALUES(?,?,?)').bind(await hash(t),s.id,stamp+90*86400000)]);
  return json({ok:true},200,{'Set-Cookie':`math_session=${t}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=7776000`});
 }
 if(key==='logout'&&method==='POST'){
  const t=req.headers.get('cookie')?.match(/(?:^|;\s*)math_session=([a-f0-9]{48})(?:;|$)/)?.[1];if(t)await db().prepare('DELETE FROM sessions WHERE hash=?').bind(await hash(t)).run();
  return json({ok:true},200,{'Set-Cookie':'math_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'});
 }
 const a=await actor(req);
 if(key==='me')return json({user:a,emailReady:a?.role==='teacher'?emailReady():undefined});
 if(!a)fail('Prisijunk, kad atidarytum savo erdvę.',401);
 if(key==='tasks'&&method==='GET')return json(await listTasks(a));
 if(key==='students'&&method==='GET'){teacher(a);return json((await db().prepare('SELECT id,name,email,active,created FROM students ORDER BY name COLLATE NOCASE').all()).results);}
 if(key==='students'&&method==='POST'){
  teacher(a);const data:any=await req.json();const name=clean(data.name,80),email=clean(data.email,254).toLowerCase();
  if(!name)fail('Įrašyk mokinio vardą.');if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail('Patikrink el. pašto adresą.');
  const c=code(),id=uid();await db().prepare('INSERT INTO students(id,name,email,code_hash,created) VALUES(?,?,?,?,?)').bind(id,name,email||null,await hash(c),now()).run();return json({id,code:c});
 }
 if(path[0]==='students'&&path.length===2&&method==='PATCH'){
  teacher(a);const data:any=await req.json();const id=path[1];if(!await db().prepare('SELECT id FROM students WHERE id=?').bind(id).first())fail('Mokinys nerastas.',404);
  if(data.rotate){const c=code();await db().batch([db().prepare('UPDATE students SET code_hash=? WHERE id=?').bind(await hash(c),id),db().prepare('DELETE FROM sessions WHERE student_id=?').bind(id)]);return json({code:c});}
  if(typeof data.active==='boolean'){await db().batch([db().prepare('UPDATE students SET active=? WHERE id=?').bind(data.active?1:0,id),db().prepare('DELETE FROM sessions WHERE student_id=?').bind(id)]);return json({ok:true});}
  const name=clean(data.name,80),email=clean(data.email,254).toLowerCase();if(!name||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail('Patikrink vardą ir el. pašto adresą.');
  await db().prepare('UPDATE students SET name=?,email=? WHERE id=?').bind(name,email||null,id).run();return json({ok:true});
 }
 if(key==='questions'&&method==='POST'){
  if(a.role!=='student')fail('Ši forma skirta mokiniams.',403);
  const f=await req.formData(),body=clean(f.get('body')),items=await collectFiles(f,false);
  if(!body&&!items.length)fail('Parašyk klausimą arba pridėk uždavinio nuotrauką.');
  const id=uid(),title=clean(f.get('title'),120)||'Klausimas mokytojui';await upload(items);
  try{await db().batch([db().prepare("INSERT INTO tasks(id,title,body,kind,created) VALUES(?,?,?,'question',?)").bind(id,title,body,now()),db().prepare('INSERT INTO assignments(task_id,student_id) VALUES(?,?)').bind(id,a.id),...items.map(x=>fileInsert(x,id,null,a.id))]);}catch(err){await cleanup(items);throw err;}
  const sent=await notify(OWNER,`${a.name} uždavė klausimą`,`${a.name} atsiuntė klausimą: ${title}.\n\nAtidaryti: ${url.origin}/?area=teacher&task=${id}&student=${a.id}\n\nMatematika be streso`);
  return json({id,queued:sent?0:1});
 }
 if(key==='tasks'&&method==='POST'){
  teacher(a);const f=await req.formData();const body=clean(f.get('body'));const items=await collectFiles(f,false);if(!body&&!items.length)fail('Parašyk užduotį arba pridėk nuotrauką.');
  const ids=[...new Set(f.getAll('students').map(String))];if(!ids.length||ids.length>200)fail('Pasirink bent vieną mokinį (iki 200).');
  const people=await db().prepare(`SELECT id,name,email FROM students WHERE active=1 AND id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).all<any>();
  if(people.results.length!==ids.length)fail('Atnaujink mokinių sąrašą ir pasirink dar kartą.');
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
  return json({task:t,students:people,studentId:student,messages:msgs,files:fs});
 }
 if(key==='messages'&&method==='POST'){
  const f=await req.formData(),task=clean(f.get('task'),40),sid=a.role==='student'?a.id:clean(f.get('student'),40);await assigned(a,task,sid);
  const body=clean(f.get('body'));const items=await collectFiles(f,a.role==='teacher');if(!body&&!items.length)fail('Parašyk žinutę arba pridėk failą.');
  const id=uid();await upload(items);try{await db().batch([db().prepare('INSERT INTO messages(id,task_id,student_id,author,body,created) VALUES(?,?,?,?,?,?)').bind(id,task,sid,a.role,body,now()),...items.map(x=>fileInsert(x,task,id,sid))]);}catch(err){await cleanup(items);throw err;}
  const t=await db().prepare('SELECT title FROM tasks WHERE id=?').bind(task).first<any>();
  const s=await db().prepare('SELECT name,email FROM students WHERE id=?').bind(sid).first<any>();let queued=0;
  const recipient=a.role==='student'?OWNER:s?.email;
  if(recipient){const title=a.role==='student'?`${s.name} pateikė sprendimą`:'Mokytojas atsakė į tavo užduotį';const ok=await notify(recipient,title,`${title}.\nUžduotis: ${t.title}\n\nAtidaryti: ${url.origin}/?area=${a.role==='student'?'teacher':'student'}&task=${task}${a.role==='student'?'&student='+sid:''}\n\nMatematika be streso`);if(!ok)queued++;}
  return json({ok:true,queued});
 }
 if(path[0]==='files'&&path.length===2&&method==='GET'){
  const f=await db().prepare('SELECT * FROM files WHERE id=?').bind(path[1]).first<any>();if(!f)fail('Failas nerastas.',404);
  if(a.role==='student'){if(f.student_id && f.student_id!==a.id)fail('Failas nepasiekiamas.',403);await assigned(a,f.task_id,a.id);}
  const object=await e.BUCKET?.get(f.id);if(!object)fail('Failas nerastas.',404);
  return new Response(object.body,{headers:{'Content-Type':f.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`inline; filename*=UTF-8''${encodeURIComponent(f.name)}`}});
 }
 if(key==='notifications'&&method==='GET'){teacher(a);return json({ready:emailReady(),pending:await db().prepare("SELECT COUNT(*) AS count FROM notifications WHERE status!='sent'").first()});}
 if(key==='notifications/retry'&&method==='POST'){
  teacher(a);if(!emailReady())fail('Pirmiausia prijunk el. pašto siuntimo paslaugą.');const rows=(await db().prepare("SELECT * FROM notifications WHERE status!='sent' AND attempts<5 ORDER BY created LIMIT 20").all()).results;let sent=0;for(const n of rows)if(await deliver(n))sent++;return json({sent});
 }
 return json({error:'Nerasta.'},404);
 }catch(err:any){const status=err.status||500;if(status===500)console.error('Math API failed:',err.message);return json({error:status===500?'Nepavyko atlikti veiksmo. Bandyk dar kartą.':err.message},status);}
}
