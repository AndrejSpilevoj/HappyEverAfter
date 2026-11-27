'use strict';
const bank=[];
const term=(n,r)=>n===0?'0':(n<0?'−':'')+(Math.abs(n)===1?'':Math.abs(n))+r;
for(let i=0;i<10;i++){
 const n=[2,3,5,6,7,10,11,13,15,17][i],a=2+i,b=1+i%4,c=2+i%3;
 const square='√'+n,cube='∛'+n;
 function add(expression,answer,root,calculation,hint){
  bank.push({expression,answer,hint,solution:calculation+' Taigi □ = '+answer+'.',root});
 }
 add(term(a,square)+' + '+term(b,square)+' = □'+square,a+b,square,a+' + '+b+' = '+(a+b)+'.','Pošakniai vienodi. Sudėk skaičius prieš šaknies ženklą.');
 add(term(b,cube)+' − '+term(a+1,cube)+' = □'+cube,b-a-1,cube,b+' − '+(a+1)+' = '+(b-a-1)+'.','Pradėk nuo pirmojo skaičiaus. Jei atimi didesnį skaičių, atsakymas bus neigiamas.');
 add(term(-a,square)+' − ('+term(-b,square)+') = □'+square,b-a,square,'−'+a+' − (−'+b+') = −'+a+' + '+b+' = '+(b-a)+'.','Pažiūrėk į minusą prieš skliaustus ir minusą jų viduje. Pavyzdžiui, 6 − (−2) = 6 + 2.');
 add(term(c,cube)+' − ('+term(a,cube)+' − '+term(b,cube)+') = □'+cube,c-a+b,cube,c+' − ('+a+' − '+b+') = '+(c-a+b)+'.','Pirmiausia rask skliaustuose užrašytų skaičių skirtumą.');
 add('□'+square+' + '+term(b,square)+' = '+term(a+c,square),a+c-b,square,'Ieškome skaičiaus, kurį reikia įrašyti į langelį: '+(a+c)+' − '+b+' = '+(a+c-b)+'.','Žinai sumą. Iš skaičiaus prieš šaknį dešinėje atimk skaičių prieš šaknį kairėje.');
}
function shuffle(items){
 const result=[...items];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
}
function round(){return shuffle(Array.from({length:5},(_,type)=>shuffle(bank.filter((_,i)=>i%5===type)).slice(0,2)).flat());}
const el=id=>document.getElementById(id);
let questions=[],index=0,missed=[];
function line(tag,text){
 const node=document.createElement(tag);
 node.textContent=text;
 return node;
}
function recordAnswer(value,correct){
 el('attempts').append(line('p','Tavo atsakymas: '+value+(correct?' ✓ Teisingai.':' – pabandyk dar kartą.')));
}
function keepQuestion(){
 const card=document.createElement('section');
 const expression=line('p',questions[index].expression);
 expression.className='math';
 card.append(line('h2',el('heading').textContent),expression,...Array.from(el('attempts').children),line('p',el('feedback').textContent));
 el('history').append(card);
}
function show(){
 const q=questions[index];
 el('heading').textContent='Užduotis '+(index+1)+' iš '+questions.length;
 el('expression').textContent=q.expression;
 el('answer').value='';el('answer').disabled=false;el('check').hidden=false;
 el('next').hidden=true;el('solution').hidden=true;el('feedback').textContent='';
 el('answer').focus({preventScroll:true});
 el('quiz').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
function begin(items){
 if(questions.length){
  const summary=document.createElement('section');
  summary.append(line('h2','Testas baigtas'),line('p',el('feedback').textContent));
  el('history').append(summary);
 }
 questions=items;index=0;missed=[];el('quiz').hidden=false;el('start').hidden=true;
 el('exercise').hidden=false;el('again').hidden=true;el('retry').hidden=true;show();
}
function finishQuestion(){el('answer').disabled=true;el('check').hidden=true;el('solution').hidden=true;el('next').hidden=false;el('next').focus();}
function celebrateAnswer(){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){advance();return;}
 const layer=el('confetti'),colors=['#ff427c','#00adbe','#ffbc00','#8653e8','#17aa68','#ff6740'];
 el('answer').readOnly=true;el('check').disabled=true;el('solution').hidden=true;
 for(let i=0;i<21;i++){
  const piece=document.createElement('i'),angle=(18+(i*73)%145)*Math.PI/180;
  const radius=44+(i*17)%41;
  piece.className=['star','dot','ribbon'][i%3];
  if(piece.className==='ribbon')piece.textContent='∿';
  piece.style.color=colors[i%colors.length];
  piece.style.setProperty('--x',Math.cos(angle)*radius+'px');
  piece.style.setProperty('--y',(-Math.sin(angle)*radius-18)+'px');
  piece.style.setProperty('--spin',i*41+'deg');
  layer.append(piece);
 }
 window.setTimeout(()=>{
  layer.replaceChildren();el('answer').readOnly=false;el('check').disabled=false;advance();
 },1200);
}
el('form').onsubmit=event=>{
 event.preventDefault();if(el('check').disabled)return;const q=questions[index],value=el('answer').value.trim().replace('−','-');
 if(!/^[+-]?\d+$/.test(value)){el('feedback').textContent='Įrašyk sveikąjį skaičių.';return;}
 recordAnswer(value,Number(value)===q.answer);
 if(Number(value)===q.answer){el('feedback').textContent='Teisingai! '+q.solution;celebrateAnswer();}
 else{if(!missed.includes(q)){missed.push(q);el('attempts').append(line('p','Patarimas: '+q.hint));}el('feedback').textContent='Dar kartą pagalvok. '+q.hint;el('solution').hidden=false;el('answer').select();}
};
el('solution').onclick=()=>{el('feedback').textContent='Peržiūrėtas sprendimas. '+questions[index].solution;finishQuestion();};
function advance(){
 keepQuestion();
 if(++index<questions.length){show();return;}
 el('solution').hidden=true;el('heading').textContent='Testas baigtas';el('exercise').hidden=true;el('next').hidden=true;
 el('feedback').textContent='Iš pirmo karto teisingai atlikta užduočių: '+(questions.length-missed.length)+' iš '+questions.length+'.';
 el('again').hidden=false;el('retry').hidden=!missed.length;el('heading').focus();
}
el('next').onclick=advance;
el('start').onclick=el('again').onclick=()=>begin(round());el('retry').onclick=()=>begin(shuffle(missed));