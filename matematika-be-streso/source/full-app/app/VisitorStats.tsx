'use client';
import {useEffect,useState} from 'react';
import {BarChart3,Download,RefreshCw,Smartphone,Monitor,Users,RotateCcw,Eye} from 'lucide-react';
type Summary={visits:number;uniqueVisitors:number;returningVisitors:number};
type Row={name:string;visitors:number;visits:number};
type Stats={days:number;since:string;today:string;started:string;summary:Summary;daily:{day:string;visits:number;visitors:number}[];devices:Row[];cities:Row[];countries:Row[];sources:Row[]};
async function postStats(body:unknown){const r=await fetch('/api/visitor-stats',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('Statistika nepasiekiama.');return r.json();}
const consentKey='math_stats_consent',idKey='math_stats_visitor',sessionKey='math_stats_session';
export function VisitorCounting({ready}:{ready:boolean;role?:string}){
 const [choice,setChoice]=useState('loading');
 useEffect(()=>{
  if(!ready)return;
  try{
   const saved=localStorage.getItem(consentKey);
   if(saved==='excluded'){localStorage.removeItem(consentKey);localStorage.removeItem(idKey);localStorage.removeItem(sessionKey);}
   setChoice(saved==='excluded'?'ask':saved||'ask');
  }catch{setChoice('unavailable');}
 },[ready]);
 useEffect(()=>{
  if(!ready||choice!=='allowed')return;
  let stopped=false;
  const visit=async()=>{
   try{
    if(document.visibilityState!=='visible'||localStorage.getItem(consentKey)!=='allowed')return;
    let id=localStorage.getItem(idKey);if(!id){id=crypto.randomUUID();localStorage.setItem(idKey,id);}
    const stamp=Date.now();let session:{id:string;last:number}|null=null;try{session=JSON.parse(localStorage.getItem(sessionKey)||'null');}catch{}
    if(!session||!session.id||stamp-session.last>30*60000)session={id:crypto.randomUUID(),last:stamp};
    session.last=stamp;localStorage.setItem(sessionKey,JSON.stringify(session));
    const result=await postStats({visitor:id,session:session.id,referrer:document.referrer});
    if(!stopped&&result.excluded){localStorage.setItem(consentKey,'denied');setChoice('denied');}
   }catch{/* Statistics must never interrupt a lesson or login. */}
  };
  let lastActivity=0;
  const activity=()=>{if(Date.now()-lastActivity>120000){lastActivity=Date.now();void visit();}};
  void visit();window.addEventListener('focus',activity);document.addEventListener('visibilitychange',activity);window.addEventListener('pointerdown',activity);
  return()=>{stopped=true;window.removeEventListener('focus',activity);document.removeEventListener('visibilitychange',activity);window.removeEventListener('pointerdown',activity);};
 },[ready,choice]);
 async function choose(value:string){
  try{if(value==='denied'){const id=localStorage.getItem(idKey);if(id)await postStats({visitor:id,exclude:true});localStorage.removeItem(idKey);localStorage.removeItem(sessionKey);}localStorage.setItem(consentKey,value);setChoice(value);}catch{setChoice('unavailable');}
 }
 if(!ready||['loading','unavailable'].includes(choice))return null;
 return choice==='ask'?<aside className="analytics-choice" aria-label="Lankomumo statistika"><p>Ar leidi lankomumo statistiką? Ji padeda suprasti, kiek žmonių atranda pamokas. Saugomas atsitiktinis naršyklės kodas, įrenginio tipas ir apytikslis miestas. IP adresai nesaugomi. <a href="/privacy" target="_blank" rel="noreferrer">Privatumas</a></p><div><button onClick={()=>choose('allowed')}>Leisti statistiką</button><button onClick={()=>choose('denied')}>Neleisti</button></div></aside>:<button className="analytics-preference" onClick={()=>setChoice('ask')}>Statistikos pasirinkimas</button>;
}
const fmt=(n=0)=>new Intl.NumberFormat('lt-LT').format(n);
const deviceLabel=(name:string)=>({phone:'Telefonai',desktop:'Kompiuteriai',tablet:'Planšetės'}[name]||name);
function Breakdown({title,rows,device=false}:{title:string;rows:Row[];device?:boolean}){
 const max=Math.max(1,...rows.map(r=>r.visitors));
 return <section className="glass stats-panel"><h2>{title}</h2><p className="stats-caption">Unikalios naršyklės</p>{!rows.length?<p className="stats-empty">Duomenų dar nėra.</p>:rows.map(r=><div className="stats-breakdown-row" key={r.name}><div><span>{device?deviceLabel(r.name):r.name==='XX'?'Nežinoma':r.name}</span><strong>{fmt(r.visitors)}</strong></div><div className="stats-bar-track"><span style={{width:Math.max(2,r.visitors/max*100)+'%'}}/></div></div>)}</section>;
}
export default function VisitorStats(){
 const [days,setDays]=useState(30),[data,setData]=useState<Stats|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 async function load(){setLoading(true);setError('');try{const r=await fetch('/api/visitor-stats?days='+days);const result=await r.json();if(!r.ok)throw new Error(result.error||'Nepavyko įkelti statistikos.');setData(result);}catch(e:any){setError(e.message);}finally{setLoading(false);}}
 useEffect(()=>{void load();},[days]);
 function csv(){
  if(!data)return;const rows=[['Laikotarpis',data.since,data.today],['Rodiklis','Reikšmė'],['Unikalios naršyklės',data.summary.uniqueVisitors],['Apsilankymai',data.summary.visits],['Sugrįžusios naršyklės',data.summary.returningVisitors],[],['Data','Unikalios naršyklės','Apsilankymai'],...data.daily.map(r=>[r.day,r.visitors,r.visits]),...([['Įrenginiai',data.devices],['Miestai',data.cities],['Šalys',data.countries],['Šaltiniai',data.sources]] as const).flatMap(([title,values])=>[[],[title,'Unikalios naršyklės','Apsilankymai'],...values.map(r=>[r.name,r.visitors,r.visits])])];
  const safe=(x:unknown)=>{const value=String(x??'');return '"'+(/^[=+@-]/.test(value)?"'"+value:value).replace(/"/g,'""')+'"';};
  const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(safe).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='lankomumas-'+data.since+'-'+data.today+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 const s=data?.summary;
 const daily=data?Array.from({length:days},(_,i)=>{const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Vilnius',year:'numeric',month:'2-digit',day:'2-digit'}).format(Date.now()-(days-1-i)*86400000);return data.daily.find(d=>d.day===day)||{day,visits:0,visitors:0};}):[];
 const max=Math.max(1,...daily.map(d=>d.visitors));
 return <div className="visitor-statistics"><div className="stats-heading"><div><span className="eyebrow">TIK MOKYTOJUI</span><h2>Svetainės lankomumas</h2><p>Žmonės, kurie atranda tavo pamokas.</p></div><div className="stats-actions"><label>Laikotarpis<select value={days} onChange={e=>setDays(Number(e.target.value))}><option value={7}>7 dienos</option><option value={30}>30 dienų</option><option value={90}>90 dienų</option><option value={365}>365 dienos</option></select></label><button className="button glass-button" disabled={loading} onClick={load}><RefreshCw size={18}/>Atnaujinti</button><button className="button glass-button" disabled={!data||loading} onClick={csv}><Download size={18}/>CSV</button></div></div>
 {error&&<p className="notice error" role="alert">{error}</p>}
 {loading?<p className="notice" role="status">Krauname statistiką…</p>:s&&<>
 <div className="stats-metrics">{[[Users,'Unikalūs lankytojai',s.uniqueVisitors,'Skirtingos naršyklės per laikotarpį'],[Eye,'Apsilankymai',s.visits,'Naujas apsilankymas po 30 min. pertraukos'],[RotateCcw,'Sugrįžę lankytojai',s.returningVisitors,'Naršyklės, apsilankiusios pakartotinai'],[BarChart3,'Sugrįžimo dalis',(s.uniqueVisitors?Math.round(s.returningVisitors/s.uniqueVisitors*100):0)+'%','Sugrįžę iš visų unikalių lankytojų']].map(([Icon,label,value,note]:any)=><section className="glass stats-metric" key={label}><Icon size={23}/><span>{label}</span><strong>{typeof value==='number'?fmt(value):value}</strong><p>{note}</p></section>)}</div>
 <section className="glass stats-panel stats-trend"><div className="stats-heading"><div><h2>Lankytojų augimas</h2><p>Unikalios naršyklės kiekvieną dieną</p></div><strong>{data!.since} – {data!.today}</strong></div>{!s.visits?<p className="stats-empty">Statistika pradedama rinkti dabar. Čia atsiras pirmųjų lankytojų duomenys.</p>:<><div className="stats-chart" role="img" aria-label="Kasdienio lankomumo diagrama">{daily.map(d=><div className="stats-chart-column" key={d.day} title={d.day+': '+d.visitors+' unikalūs, '+d.visits+' apsilankymų'}><span style={{height:(d.visitors?Math.max(3,d.visitors/max*100):0)+'%'}}/></div>)}</div><div className="stats-chart-dates"><span>{data!.since}</span><span>{data!.today}</span></div></>}</section>
 <div className="stats-grid"><Breakdown title="Įrenginiai" rows={data!.devices} device/><Breakdown title="Iš kur ateina lankytojai" rows={data!.sources}/><Breakdown title="Miestai · apytikslė vieta" rows={data!.cities}/><Breakdown title="Šalys" rows={data!.countries}/></div>
 <details className="glass stats-panel stats-daily"><summary>Kasdieniai skaičiai</summary><div className="stats-table-scroll"><table><thead><tr><th>Data</th><th>Unikalūs</th><th>Apsilankymai</th></tr></thead><tbody>{daily.slice().reverse().map(d=><tr key={d.day}><td>{d.day}</td><td>{fmt(d.visitors)}</td><td>{fmt(d.visits)}</td></tr>)}</tbody></table></div></details>
 <section className="stats-explanation"><h3>Kaip skaičiuojama?</h3><p>Skaičiuojami tik statistiką leidę lankytojai. Įtraukiami visi statistiką leidę lankytojai, taip pat mokytojas ir mokiniai. Prisijungimas skaičiavimo nekeičia. Kitas įrenginys ar išvalyta naršyklė gali būti suskaičiuoti iš naujo.</p><p>Miestai nustatomi apytiksliai pagal interneto ryšį. VPN ar mobilusis ryšys gali rodyti kitą miestą. Viena naršyklė gali patekti į kelias įrenginių, miestų ar šaltinių grupes. Dienų unikalių skaičių suma nėra viso laikotarpio unikalių skaičius.</p><p>Laikas: Lietuva. Duomenys saugomi iki 365 dienų. Rinkimo pradžia: {data?.started?new Date(data.started).toLocaleDateString('lt-LT'):'šiandien'}. Ankstesnių apsilankymų atkurti negalima.</p></section>
 </>}
 </div>;
}
