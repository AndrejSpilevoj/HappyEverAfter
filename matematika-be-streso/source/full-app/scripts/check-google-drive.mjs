import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';
const sql=new DatabaseSync(':memory:');
for(const file of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+file,'utf8'));
class Statement{
 constructor(query,args=[]){this.query=query;this.args=args;}
 bind(...args){return new Statement(this.query,args);}
 async first(){return sql.prepare(this.query).get(...this.args)||null;}
 async run(){return sql.prepare(this.query).run(...this.args);}
 async all(){return {results:sql.prepare(this.query).all(...this.args)};}
}
const env={GOOGLE_CLIENT_ID:'client-test',GOOGLE_CLIENT_SECRET:'test-only-not-a-real-credential',DEPLOYMENT_TARGET:'cloudflare',PUBLIC_ORIGIN:'https://math.test',DB:{prepare:s=>new Statement(s),batch:async rows=>{sql.exec('BEGIN');try{const r=[];for(const x of rows)r.push(await x.run());sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}}};
const dir=mkdtempSync(join(tmpdir(),'drive-test-'));
const compile=s=>ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
writeFileSync(join(dir,'google.mjs'),compile(readFileSync('lib/google.ts','utf8')));
const g=await import(pathToFileURL(join(dir,'google.mjs')));
const kp=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk=await crypto.subtle.exportKey('jwk',kp.publicKey);jwk.kid='test-key';
const b64=s=>Buffer.from(s).toString('base64url');
async function idToken(nonce,overrides={}){
 const h=b64(JSON.stringify({alg:'RS256',kid:'test-key'}));
 const p=b64(JSON.stringify({iss:'https://accounts.google.com',aud:env.GOOGLE_CLIENT_ID,iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+300,nonce,email:'andrej.spilevoj@gmail.com',email_verified:true,sub:'owner-sub',...overrides}));
 const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',kp.privateKey,new TextEncoder().encode(h+'.'+p));
 return h+'.'+p+'.'+b64(Buffer.from(sig));
}
let identityOverrides={},scope='openid email https://www.googleapis.com/auth/drive.file',uploadFail=false,evilLocation=false,driveCalls=[],nonce,refreshes=0;
const json=(v,status=200,headers={})=>Response.json(v,{status,headers});
globalThis.fetch=async (url,init={})=>{
 url=String(url);driveCalls.push({url,init});
 if(url.endsWith('/oauth2/v3/certs'))return json({keys:[jwk]});
 if(url==='https://oauth2.googleapis.com/token'){
  const p=new URLSearchParams(init.body);
  assert.equal(p.get('client_secret'),env.GOOGLE_CLIENT_SECRET);
  if(p.get('grant_type')==='refresh_token'){refreshes++;return json({access_token:'test-access',expires_in:3600});}
  assert.ok(p.get('code_verifier'));return json({id_token:await idToken(nonce,identityOverrides),access_token:'test-access',refresh_token:'test-refresh',scope});
 }
 if(url.includes('uploadType=resumable')){
  assert.equal(init.headers.get('Authorization'),'Bearer test-access');
  assert.equal(JSON.parse(init.body).parents[0],'private-folder');
  assert.equal(JSON.parse(init.body).permissions,undefined);
  return new Response(null,{status:200,headers:{Location:evilLocation?'https://evil.test/steal':'https://www.googleapis.com/upload/drive/v3/files?upload_id=test'}});
 }
 if(url.includes('upload_id=test'))return uploadFail?json({error:'quota'},403):json({id:'private-file'});
 if(url.includes('alt=media'))return new Response(new Uint8Array([80,78,71]),{status:206,headers:{'Content-Range':'bytes 0-2/8','Accept-Ranges':'bytes'}});
 if(url.endsWith('/private-file')&&init.method==='PATCH'){assert.equal(JSON.parse(init.body).trashed,true);return json({trashed:true});}
 if(url.includes('/drive/v3/files?fields=id')){
  assert.equal(JSON.parse(init.body).mimeType,'application/vnd.google-apps.folder');
  assert.equal(JSON.parse(init.body).permissions,undefined);return json({id:'private-folder'});
 }
 throw new Error('Unexpected network call '+url);
};
const req=(path,cookie)=>new Request(env.PUBLIC_ORIGIN+'/api/'+path,{headers:cookie?{cookie}:{}});
async function start(){
 const r=await g.googleRoute(req('google/start'),'google/start',env);assert.equal(r.status,302);
 const u=new URL(r.headers.get('location'));nonce=u.searchParams.get('nonce');
 assert.equal(u.origin,'https://accounts.google.com');
 assert.equal(u.searchParams.get('code_challenge_method'),'S256');
 assert.equal(u.searchParams.get('access_type'),'offline');
 assert.equal(u.searchParams.get('scope'),'openid email https://www.googleapis.com/auth/drive.file');
 const cookie=r.headers.get('set-cookie').split(';')[0];
 assert.match(r.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Lax/);
 return {state:u.searchParams.get('state'),cookie};
}
assert.equal((await g.googleRoute(req('google/start'),'google/start',{})).status,503);
let s=await start();let network=driveCalls.length;
assert.equal((await g.googleRoute(req('google/callback?state='+s.state+'&code=test'),'google/callback',env)).status,400);
assert.equal(driveCalls.length,network,'CSRF failure must not contact provider');
identityOverrides={email:'intruder@example.test'};
assert.equal((await g.googleRoute(req('google/callback?state='+s.state+'&code=test',s.cookie),'google/callback',env)).status,403);
assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM teacher_sessions').get().n,0);
assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM app_settings').get().n,0);
identityOverrides={};s=await start();
scope='openid email';
assert.equal((await g.googleRoute(req('google/callback?state='+s.state+'&code=test',s.cookie),'google/callback',env)).status,403);
scope='openid email https://www.googleapis.com/auth/drive.file';
s=await start();
const callback=await g.googleRoute(req('google/callback?state='+s.state+'&code=test',s.cookie),'google/callback',env);
assert.equal(callback.status,303);
const teacherCookie=callback.headers.getSetCookie().find(x=>x.startsWith('__Host-math_teacher=')).split(';')[0];
assert.equal((await g.googleTeacher(req('me',teacherCookie),env)).role,'teacher');
assert.equal(await g.googleTeacher(req('me','__Host-math_teacher=forged'),env),null);
assert.equal((await g.googleRoute(req('google/callback?state='+s.state+'&code=test',s.cookie),'google/callback',env)).status,400,'Callback cannot be replayed');
const stored=sql.prepare("SELECT value FROM app_settings WHERE key='google_drive'").get().value;
assert.ok(!stored.includes('test-refresh'),'Refresh token encrypted at rest');
assert.equal(JSON.parse(await g.unseal(env,stored)).folder,'private-folder');
await assert.rejects(()=>g.unseal({...env,GOOGLE_CLIENT_SECRET:'different'},stored));
for(const overrides of [{email_verified:false},{aud:'wrong-client'},{iss:'https://evil.test'},{exp:1},{nonce:'wrong-nonce'}]){
 await assert.rejects(()=>idToken('expected',overrides).then(t=>g.verifyGoogleIdToken(t,env,'expected')));
}
let valid=await idToken('expected');valid=valid.slice(0,-10)+'AAAAAAAAAA';
await assert.rejects(()=>g.verifyGoogleIdToken(valid,env,'expected'));
const f={id:'object-1',name:'solution.png',mime:'image/png',size:3,bytes:new Uint8Array([80,78,71])};
await g.drivePut(env,f);
assert.equal(sql.prepare('SELECT drive_id FROM drive_objects WHERE key=?').get(f.id).drive_id,'private-file');
const file=await g.driveGet(env,f.id,'bytes=0-2');assert.equal(file.status,206);assert.equal(file.headers.get('content-range'),'bytes 0-2/8');
assert.equal(await g.driveGet(env,'unknown'),null);
await g.driveTrash(env,f.id);
assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM drive_objects').get().n,0);
uploadFail=true;await assert.rejects(()=>g.drivePut(env,{...f,id:'failed'}));uploadFail=false;
evilLocation=true;network=driveCalls.length;await assert.rejects(()=>g.drivePut(env,{...f,id:'evil'}));
assert.ok(!driveCalls.slice(network).some(x=>x.url.startsWith('https://evil.test')));
evilLocation=false;
assert.equal(refreshes,1,'Access tokens cached server-side');
const expiredCookie='z'.repeat(43);
sql.prepare('INSERT INTO teacher_sessions(hash,email,expires) VALUES(?,?,?)').run(await g.digest(expiredCookie),'andrej.spilevoj@gmail.com',Date.now()-1);
assert.equal(await g.googleTeacher(req('me','__Host-math_teacher='+expiredCookie),env),null);

// Exercise the real API using Drive, including student isolation before any provider call.
globalThis.__googleEnv=env;
writeFileSync(join(dir,'server.mjs'),compile(readFileSync('lib/server.ts','utf8').replace("import { env } from 'cloudflare:workers';","const env=globalThis.__googleEnv;").replace("from './google'","from './google.mjs'")));
const {api}=await import(pathToFileURL(join(dir,'server.mjs')));
async function apiCall(path,method='GET',body,headers={}){
 const h={...headers};if(method!=='GET')h.origin=env.PUBLIC_ORIGIN;
 if(body && !(body instanceof FormData))h['content-type']='application/json';
 return api(new Request(env.PUBLIC_ORIGIN+'/api/'+path,{method,headers:h,body:body instanceof FormData?body:body?JSON.stringify(body):undefined}),path.split('/'));
}
assert.equal((await apiCall('students','POST',{name:'forged'},{'oai-authenticated-user-id':'fake','oai-authenticated-user-email':'andrej.spilevoj@gmail.com'})).status,401);
const person=await (await apiCall('students','POST',{name:'Student A'},{cookie:teacherCookie})).json();
const other=await (await apiCall('students','POST',{name:'Student B'},{cookie:teacherCookie})).json();
async function studentCookie(code){const r=await apiCall('login','POST',{code});assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0];}
const studentA=await studentCookie(person.code),studentB=await studentCookie(other.code);
const assignment=new FormData();assignment.set('title','Drive test');assignment.set('body','Solve this');assignment.append('students',person.id);
assignment.append('files',new File([new Uint8Array([137,80,78,71,13,10,26,10])],'task.png',{type:'image/png'}));
const assigned=await apiCall('tasks','POST',assignment,{cookie:teacherCookie});assert.equal(assigned.status,200,await assigned.clone().text());
const task=await assigned.json();
const detail=await (await apiCall('tasks/'+task.id,'GET',undefined,{cookie:studentA})).json();
const attachment=detail.files[0].id;
network=driveCalls.length;
assert.equal((await apiCall('files/'+attachment,'GET')).status,401);
assert.equal((await apiCall('files/'+attachment,'GET',undefined,{cookie:studentB})).status,404);
assert.equal(driveCalls.length,network,'Unauthorized download must not access Drive');
const download=await apiCall('files/'+attachment,'GET',undefined,{cookie:studentA,Range:'bytes=0-2'});
assert.equal(download.status,206);assert.equal(download.headers.get('cache-control'),'private, no-store');
assert.equal(download.headers.get('content-range'),'bytes 0-2/8');
assert.deepEqual(new Uint8Array(await download.arrayBuffer()),new Uint8Array([80,78,71]));
assert.ok(!(await (await apiCall('tasks/'+task.id,'GET',undefined,{cookie:studentA})).text()).includes('private-file'),'Provider IDs remain server-only');

await g.googleLogout(req('logout',teacherCookie),env);
assert.equal(await g.googleTeacher(req('me',teacherCookie),env),null);
assert.ok(!JSON.stringify([...callback.headers]).includes('test-refresh'));
console.log('Google integration passed: owner identity, signatures, CSRF, replay, encryption, private upload/download, ranges, token refresh, logout and failure handling.');
