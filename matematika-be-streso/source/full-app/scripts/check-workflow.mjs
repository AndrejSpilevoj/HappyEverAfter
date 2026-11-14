import {readFileSync,writeFileSync,mkdtempSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
import ts from 'typescript';
const sqlite=new DatabaseSync(':memory:');
for(const file of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync('drizzle/'+file,'utf8'));
class Statement {constructor(sql,args=[]){this.sql=sql;this.args=args;}bind(...args){return new Statement(this.sql,args);}async first(){return sqlite.prepare(this.sql).get(...this.args)||null;}async all(){return {results:sqlite.prepare(this.sql).all(...this.args)};}async run(){return sqlite.prepare(this.sql).run(...this.args);}}
const bucket=new Map();globalThis.__testBindings={DB:{prepare:s=>new Statement(s),batch:async list=>{sqlite.exec('BEGIN');try{const out=[];for(const s of list)out.push(await s.run());sqlite.exec('COMMIT');return out;}catch(e){sqlite.exec('ROLLBACK');throw e;}}},BUCKET:{put:async(id,b)=>bucket.set(id,b),get:async id=>bucket.has(id)?{body:bucket.get(id)}:null,delete:async id=>bucket.delete(id)}};
const source=readFileSync('lib/server.ts','utf8').replace("import { env } from 'cloudflare:workers';","const env = globalThis.__testBindings;").replace("from './google'","from './google.mjs'");const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;const dir=mkdtempSync(join(tmpdir(),'math-test-'));writeFileSync(join(dir,'server.mjs'),compiled);writeFileSync(join(dir,'google.mjs'),ts.transpileModule(readFileSync('lib/google.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);const {api}=await import(pathToFileURL(join(dir,'server.mjs')));
const origin='https://math.test';const teacher={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'andrej.spilevoj@gmail.com'};
async function call(path,method='GET',body,headers={},expected=200){const h={...headers};if(method!=='GET')h.origin=origin;if(body&&!(body instanceof FormData))h['Content-Type']='application/json';const r=await api(new Request(origin+'/api/'+path,{method,headers:h,body:body instanceof FormData?body:body?JSON.stringify(body):undefined}),path.split('?')[0].split('/'));assert.equal(r.status,expected,await r.clone().text());return r;}
async function data(...args){return (await call(...args)).json();}
const A=await data('students','POST',{name:'A',email:'a@example.test'},teacher),B=await data('students','POST',{name:'B'},teacher),C=await data('students','POST',{name:'C'},teacher);
async function login(code){const r=await call('login','POST',{code});assert.match(r.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Lax/);return {cookie:r.headers.get('set-cookie').split(';')[0]};}
const a=await login(A.code),b=await login(B.code),c=await login(C.code);
await call('students','GET',null,a,403);await call('tasks','GET',null,{},401);
const f=new FormData();f.set('title','Angles');f.set('body','Find x');f.append('students',A.id);f.append('students',B.id);f.append('files',new File([new Uint8Array([137,80,78,71,13,10,26,10])],'angles.png',{type:'image/png'}));const task=await data('tasks','POST',f,teacher);assert.equal(task.queued,1);
assert.equal((await data('tasks','GET',null,a)).length,1);assert.equal((await data('tasks','GET',null,c)).length,0);
await call('tasks/'+task.id,'GET',null,c,404);
const detail=await data('tasks/'+task.id,'GET',null,a);const file=detail.files[0].id;await call('files/'+file,'GET',null,a);await call('files/'+file,'GET',null,c,404);
const reply=new FormData();reply.set('task',task.id);reply.set('student',B.id);reply.set('body','x=70');reply.append('files',new File([new Uint8Array([137,80,78,71,13,10,26,10])],'solution.png',{type:'image/png'}));await data('messages','POST',reply,a);
const da=await data('tasks/'+task.id,'GET',null,a),db=await data('tasks/'+task.id,'GET',null,b);assert.equal(da.messages.length,1);assert.equal(db.messages.length,0);assert.equal(da.studentId,A.id,'Student cannot impersonate requested recipient');await call('files/'+da.files.find(f=>f.message_id).id,'GET',null,b,403);
const bad=new FormData();bad.set('task',task.id);bad.append('files',new File(['<svg onload=alert(1)>'],'bad.svg',{type:'image/svg+xml'}));await call('messages','POST',bad,a,400);
const cross=new Request(origin+'/api/students',{method:'POST',headers:{...teacher,origin:'https://evil.test','Content-Type':'application/json'},body:'{"name":"bad"}'});assert.equal((await api(cross,['students'])).status,403);
const question=new FormData();question.set('body','Kaip spręsti kitą uždavinį?');const q=await data('questions','POST',question,a);assert.equal((await data('tasks/'+q.id,'GET',null,a)).task.kind,'question');await call('tasks/'+q.id,'GET',null,b,404);assert.equal((await data('notifications','GET',null,teacher)).pending.count,3);
const updated=await data('students/'+A.id,'PATCH',{rotate:true},teacher);await call('tasks','GET',null,a,401);await call('login','POST',{code:A.code},{},401);const newA=await login(updated.code);await data('students/'+A.id,'PATCH',{active:false},teacher);await call('tasks','GET',null,newA,401);
console.log('PASS: creation, remembered sessions, multi-recipient tasks, image uploads, private replies/files, role checks, CSRF, queued email, code rotation and deactivation.');
