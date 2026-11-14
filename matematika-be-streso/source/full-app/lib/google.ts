// Server-only Google OAuth and private Drive storage. Never return provider tokens or URLs.
export type GoogleEnv = {
 DB?: D1Database; GOOGLE_CLIENT_ID?: string; GOOGLE_CLIENT_SECRET?: string;
 TEACHER_EMAIL?: string; PUBLIC_ORIGIN?: string; DEPLOYMENT_TARGET?: string;
};
const DEFAULT_ORIGIN = 'https://matematika-be-streso.andrej-spilevoj.workers.dev';
const OWNER = 'andrej.spilevoj@gmail.com';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.send';
const enc = new TextEncoder();
const bytes64 = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const from64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4-s.length%4)%4)), c=>c.charCodeAt(0));
const random = () => bytes64(crypto.getRandomValues(new Uint8Array(32)));
export const digest = async (s: string) => bytes64(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))));
const db = (e: GoogleEnv) => { if(!e.DB) throw new Error('Database unavailable'); return e.DB; };
const origin = (e: GoogleEnv) => e.PUBLIC_ORIGIN || DEFAULT_ORIGIN;
const owner = (e: GoogleEnv) => (e.TEACHER_EMAIL || OWNER).toLowerCase();
const cookie = (r: Request,n: string) => r.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(n+'='))?.slice(n.length+1);
const cookieValue = (n: string,v: string,age: number) => n+'='+v+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+age;
const config = (e: GoogleEnv) => Boolean(e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET && e.DB);
function failure(message: string,status=503): never { throw Object.assign(new Error(message),{status}); }
const response = (message: string,status=400) => new Response(message,{status,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
async function settings(e: GoogleEnv,key: string) {return db(e).prepare('SELECT value FROM app_settings WHERE key=?').bind(key).first<{value:string}>();}
async function save(e: GoogleEnv,key: string,value: string){await db(e).prepare('INSERT INTO app_settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key,value).run();}
async function secretKey(e: GoogleEnv) {
 if(!e.GOOGLE_CLIENT_SECRET)failure('Google prisijungimas dar nesukonfigūruotas.');
 return crypto.subtle.importKey('raw',await crypto.subtle.digest('SHA-256',enc.encode(e.GOOGLE_CLIENT_SECRET!)),{name:'AES-GCM'},false,['encrypt','decrypt']);
}
export async function seal(e: GoogleEnv,value: string) {
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const data=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode('math-drive-v1')},await secretKey(e),enc.encode(value));
 return bytes64(iv)+'.'+bytes64(new Uint8Array(data));
}
export async function unseal(e: GoogleEnv,value: string) {
 const [iv,data]=value.split('.');
 return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(iv),additionalData:enc.encode('math-drive-v1')},await secretKey(e),from64(data)));
}
let certCache: {expires:number;keys:(JsonWebKey & {kid?:string})[]}|undefined;
export async function verifyGoogleIdToken(jwt: string,e: GoogleEnv,nonce: string) {
 const parts=jwt.split('.');if(parts.length!==3)throw new Error('Invalid Google identity');
 const header=JSON.parse(new TextDecoder().decode(from64(parts[0])));
 if(header.alg!=='RS256'||typeof header.kid!=='string')throw new Error('Invalid Google signature');
 if(!certCache || certCache.expires<Date.now() || !certCache.keys.some(k=>k.kid===header.kid)){
  const r=await fetch('https://www.googleapis.com/oauth2/v3/certs',{redirect:'manual'});
  if(!r.ok)throw new Error('Google identity unavailable');
  const data=await r.json() as {keys:(JsonWebKey & {kid?:string})[]};
  certCache={keys:data.keys,expires:Date.now()+300000};
 }
 const jwk=certCache.keys.find(k=>k.kid===header.kid);if(!jwk)throw new Error('Unknown Google key');
 const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,from64(parts[2]),enc.encode(parts[0]+'.'+parts[1])))throw new Error('Invalid Google signature');
 const p=JSON.parse(new TextDecoder().decode(from64(parts[1])));
 const now=Date.now()/1000;
 if(!['https://accounts.google.com','accounts.google.com'].includes(p.iss)||p.aud!==e.GOOGLE_CLIENT_ID||!Number.isFinite(p.exp)||p.exp<=now||!Number.isFinite(p.iat)||p.iat>now+60||p.nonce!==nonce||p.email_verified!==true||typeof p.sub!=='string'||!p.sub||typeof p.email!=='string'||p.email.toLowerCase()!==owner(e))throw new Error('Owner identity required');
 return p as {sub:string;email:string};
}
export async function googleTeacher(req: Request,e: GoogleEnv) {
 const value=cookie(req,'__Host-math_teacher');
 if(!value||!/^[A-Za-z0-9_-]{43}$/.test(value))return null;
 const s=await db(e).prepare('SELECT email FROM teacher_sessions WHERE hash=? AND expires>?').bind(await digest(value),Date.now()).first<{email:string}>();
 return s?.email.toLowerCase()===owner(e)?{role:'teacher' as const,name:'Andrius'}:null;
}
export async function googleLogout(req: Request,e: GoogleEnv) {
 const t=cookie(req,'__Host-math_teacher');
 if(t)await db(e).prepare('DELETE FROM teacher_sessions WHERE hash=?').bind(await digest(t)).run();
 return cookieValue('__Host-math_teacher','',0);
}
type Connection={refresh:string;folder:string;sub:string};
async function connection(e: GoogleEnv):Promise<Connection|null>{
 const s=await settings(e,'google_drive');return s?JSON.parse(await unseal(e,s.value)):null;
}
let cached: {connection:string;token:string;expires:number}|undefined;
async function accessToken(e: GoogleEnv,setting='google_drive') {
 if(!config(e))failure('Google Drive dar neprijungtas.');
 const s=await settings(e,setting);if(!s)failure('Mokytojas turi prijungti Google paslaugą.');
 if(cached?.connection===s.value && cached.expires>Date.now())return cached.token;
 const c=JSON.parse(await unseal(e,s.value)) as Connection;
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',redirect:'manual',body:new URLSearchParams({client_id:e.GOOGLE_CLIENT_ID!,client_secret:e.GOOGLE_CLIENT_SECRET!,grant_type:'refresh_token',refresh_token:c.refresh})});
 if(!r.ok)failure('Reikia iš naujo prijungti mokytojo Google Drive.');
 const data=await r.json() as {access_token:string;expires_in:number};
 if(!data.access_token)failure('Google Drive laikinai nepasiekiamas.');
 cached={connection:s.value,token:data.access_token,expires:Date.now()+Math.min(Math.max((Number(data.expires_in)||300)-60,30),3300)*1000};return data.access_token;
}
async function googleFetch(e: GoogleEnv,url: string,init: RequestInit={}) {
 const h=new Headers(init.headers);h.set('Authorization','Bearer '+await accessToken(e));
 return fetch(url,{...init,headers:h,redirect:'manual'});
}
export async function driveReady(e: GoogleEnv) {return config(e)&&Boolean(await settings(e,'google_drive'));}
export async function drivePut(e: GoogleEnv,f: {id:string;name:string;mime:string;size:number;bytes:Uint8Array}) {
 const c=await connection(e);if(!c)failure('Google Drive dar neprijungtas.');
 const start=await googleFetch(e,'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id',{
  method:'POST',headers:{'Content-Type':'application/json','X-Upload-Content-Type':f.mime,'X-Upload-Content-Length':String(f.size)},
  body:JSON.stringify({name:f.name,parents:[c!.folder],appProperties:{application:'matematika-be-streso',storageId:f.id}})
 });
 if(!start.ok)failure('Nepavyko pradėti failo įkėlimo į Google Drive.');
 const location=start.headers.get('Location');if(!location)failure('Google Drive negrąžino įkėlimo adreso.');
 const session=new URL(location);
 if(session.origin!=='https://www.googleapis.com'||!session.pathname.startsWith('/upload/drive/'))failure('Neteisingas įkėlimo adresas.');
 const uploaded=await googleFetch(e,session.href,{method:'PUT',headers:{'Content-Type':f.mime},body:new Blob([f.bytes as Uint8Array<ArrayBuffer>])});
 if(!uploaded.ok)failure('Nepavyko įkelti failo į Google Drive.');
 const file=await uploaded.json() as {id:string};if(!file.id)failure('Failo įkėlimas nepatvirtintas.');
 try{await db(e).prepare('INSERT INTO drive_objects(key,drive_id) VALUES(?,?)').bind(f.id,file.id).run();}
 catch(err){await googleFetch(e,'https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(file.id),{method:'PATCH',headers:{'Content-Type':'application/json'},body:'{"trashed":true}'}).catch(()=>{});throw err;}
}
export async function driveGet(e: GoogleEnv,key: string,range?:string|null){
 const f=await db(e).prepare('SELECT drive_id FROM drive_objects WHERE key=?').bind(key).first<{drive_id:string}>();
 if(!f)return null;
 const r=await googleFetch(e,'https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(f.drive_id)+'?alt=media',{headers:range?{Range:range}:{}});
 if(r.status===404)return null;
 if(!r.ok && r.status!==416)failure('Google Drive failas laikinai nepasiekiamas.');
 return {body:r.body,status:r.status,headers:r.headers};
}
export async function driveTrash(e: GoogleEnv,key: string){
 const f=await db(e).prepare('SELECT drive_id FROM drive_objects WHERE key=?').bind(key).first<{drive_id:string}>();if(!f)return;
 const r=await googleFetch(e,'https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(f.drive_id),{method:'PATCH',headers:{'Content-Type':'application/json'},body:'{"trashed":true}'});
 if(!r.ok&&r.status!==404)failure('Nepavyko pašalinti nebaigto įkėlimo.');
 await db(e).prepare('DELETE FROM drive_objects WHERE key=?').bind(key).run();
}

export async function gmailReady(e: GoogleEnv) {return config(e)&&Boolean(await settings(e,'google_gmail'));}
// Only this fixed Gmail send endpoint is used; inbox access is never requested.
export async function gmailSend(e: GoogleEnv,n: {id:string;recipient:string;subject:string;body:string}) {
 if(!/^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/.test(n.recipient)||/[\r\n]/.test(n.recipient)||!/^[a-zA-Z0-9-]+$/.test(n.id))throw new Error('Invalid email envelope');
 const base64=(text:string)=>btoa(String.fromCharCode(...enc.encode(text)));
 // Fold encoded words to meet MIME header limits while preserving Lithuanian text.
 const subject=Array.from(n.subject).reduce<string[]>((parts,c)=>{
  if(!parts.length||enc.encode(parts[parts.length-1]+c).length>42)parts.push(c);
  else parts[parts.length-1]+=c;return parts;
 },[]).map(s=>'=?UTF-8?B?'+base64(s)+'?=').join('\r\n ');
 const body=base64(n.body).match(/.{1,76}/g)?.join('\r\n')||'';
 const raw=['From: Matematika be streso <'+owner(e)+'>','To: '+n.recipient,'Subject: '+subject,
  'Message-ID: <'+n.id+'@matematika-be-streso.andrej-spilevoj.workers.dev>','MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64','',''+body].join('\r\n');
 const token=await accessToken(e,'google_gmail');
 let r:Response;
 try{r=await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{method:'POST',redirect:'manual',
  headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({raw:bytes64(enc.encode(raw))})});}
 catch{throw Object.assign(new Error('Gmail delivery outcome unknown'),{uncertain:true});}
 if(!r.ok){
  console.error('Gmail send rejected with HTTP',r.status);
  if(r.status===401)cached=undefined;
  return false;
 }
 return true;
}

export async function googleRoute(req: Request,path: string,e: GoogleEnv):Promise<Response|null>{
 if(!['google/start','google/email/start','google/callback'].includes(path))return null;
 if(req.method!=='GET')return response('Method not allowed',405);
 if(!config(e))return response('Google prisijungimas dar nesukonfigūruotas.',503);
 const url=new URL(req.url);
 if(url.origin!==origin(e))return response('Neteisingas svetainės adresas.',403);
 const callback=origin(e)+'/api/google/callback';
 if(path==='google/start'||path==='google/email/start'){
  const mail=path==='google/email/start';
  if(mail&&!await googleTeacher(req,e))return response('Reikia mokytojo prisijungimo.',403);
  const ip=await digest('google:'+ (req.headers.get('cf-connecting-ip')||'local'));
  const stamp=Date.now();
  const attempt=await db(e).prepare('INSERT INTO auth_attempts(key,count,reset) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset<? THEN 1 ELSE count+1 END,reset=CASE WHEN reset<? THEN excluded.reset ELSE reset END RETURNING count').bind(ip,stamp+900000,stamp,stamp).first<{count:number}>();
  if((attempt?.count||0)>20)return response('Pabandyk po 15 minučių.',429);
  await db(e).batch([db(e).prepare('DELETE FROM oauth_states WHERE expires<?').bind(stamp),db(e).prepare('DELETE FROM teacher_sessions WHERE expires<?').bind(stamp)]);
  const state=random(),verifier=random(),nonce=(mail?'mail:':'')+random();
  await db(e).prepare('INSERT INTO oauth_states(hash,verifier,nonce,expires) VALUES(?,?,?,?)').bind(await digest(state),verifier,nonce,stamp+600000).run();
  const params=new URLSearchParams({client_id:e.GOOGLE_CLIENT_ID!,redirect_uri:callback,response_type:'code',scope:'openid email '+(mail?GMAIL_SCOPE:DRIVE_SCOPE),access_type:'offline',state,nonce,code_challenge:await digest(verifier),code_challenge_method:'S256',login_hint:owner(e)});
  if(mail||!await settings(e,'google_drive'))params.set('prompt','consent');
  return new Response(null,{status:302,headers:{Location:'https://accounts.google.com/o/oauth2/v2/auth?'+params,'Set-Cookie':cookieValue('__Host-math_oauth',state,600),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
 }
 const state=url.searchParams.get('state'),browserState=cookie(req,'__Host-math_oauth');
 if(!state||!browserState||state!==browserState||!/^[A-Za-z0-9_-]{43}$/.test(state))return response('Prisijungimas nepatvirtintas. Bandyk dar kartą.',400);
 const attempt=await db(e).prepare('DELETE FROM oauth_states WHERE hash=? RETURNING verifier,nonce,expires').bind(await digest(state)).first<{verifier:string;nonce:string;expires:number}>();
 if(!attempt||attempt.expires<Date.now())return response('Prisijungimo laikas baigėsi. Bandyk dar kartą.',400);
 let stage='authorization';
 try{
  const code=url.searchParams.get('code');if(!code||url.searchParams.has('error'))throw new Error('Authorization declined');
  stage='token_exchange';
  const exchange=await fetch('https://oauth2.googleapis.com/token',{method:'POST',redirect:'manual',body:new URLSearchParams({client_id:e.GOOGLE_CLIENT_ID!,client_secret:e.GOOGLE_CLIENT_SECRET!,redirect_uri:callback,grant_type:'authorization_code',code,code_verifier:attempt.verifier})});
  if(!exchange.ok){
   const error=await exchange.json().catch(()=>({})) as {error?:string};
   stage=['invalid_client','invalid_grant','unauthorized_client'].includes(error.error||'')?'token_'+error.error:'token_http_'+exchange.status;
   throw new Error('Google authorization failed');
  }
  const tokens=await exchange.json() as {id_token:string;access_token:string;refresh_token?:string;scope:string};
  stage='identity';
  const identity=await verifyGoogleIdToken(tokens.id_token,e,attempt.nonce);
  if(attempt.nonce.startsWith('mail:')){
   stage='gmail_scope';
   if(!tokens.scope?.split(' ').includes(GMAIL_SCOPE))throw new Error('Send-only permission required');
   stage='gmail_offline_access';
   if(!tokens.refresh_token)throw new Error('Offline Gmail authorization required');
   await save(e,'google_gmail',await seal(e,JSON.stringify({refresh:tokens.refresh_token,sub:identity.sub})));
   cached=undefined;
   return new Response(null,{status:303,headers:{Location:origin(e)+'/?area=teacher','Set-Cookie':cookieValue('__Host-math_oauth','',0),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
  }
  stage='drive_scope';
  if(!tokens.scope?.split(' ').includes(DRIVE_SCOPE))throw new Error('Drive permission required');
  stage='stored_connection';
  const existing=await connection(e);
  if(existing&&existing.sub!==identity.sub)throw new Error('Owner account changed');
  stage='offline_access';
  const refresh=tokens.refresh_token||existing?.refresh;if(!refresh)throw new Error('Offline Drive authorization required');
  let folder=existing?.folder;
  if(!folder){
   stage='drive_folder';
   const r=await fetch('https://www.googleapis.com/drive/v3/files?fields=id',{method:'POST',redirect:'manual',headers:{Authorization:'Bearer '+tokens.access_token,'Content-Type':'application/json'},body:JSON.stringify({name:'Matematika be streso – private uploads',mimeType:'application/vnd.google-apps.folder'})});
   if(!r.ok){stage='drive_folder_http_'+r.status;throw new Error('Drive folder creation failed');}
   folder=(await r.json() as {id:string}).id;if(!folder)throw new Error('Folder unavailable');
  }
  stage='save_connection';
  await save(e,'google_drive',await seal(e,JSON.stringify({refresh,folder,sub:identity.sub})));
  cached=undefined;
  stage='teacher_session';
  const session=random();
  await db(e).prepare('INSERT INTO teacher_sessions(hash,email,expires) VALUES(?,?,?)').bind(await digest(session),identity.email.toLowerCase(),Date.now()+7*86400000).run();
  const headers=new Headers({Location:origin(e)+'/?area=teacher','Cache-Control':'no-store','Referrer-Policy':'no-referrer'});
  headers.append('Set-Cookie',cookieValue('__Host-math_teacher',session,604800));
  headers.append('Set-Cookie',cookieValue('__Host-math_oauth','',0));
  return new Response(null,{status:303,headers});
 }catch{
  // Report only a fixed setup stage; provider bodies and credentials stay private.
  console.error('Google setup failed at',stage);
  return response('Nepavyko prisijungti. Pasirink mokytojo Google paskyrą ir suteik leidimą svetainės failams. Jei reikia, prijunk Google Drive iš naujo. ['+stage+']',403);
 }
}
