'use strict';
const bank = JSON.parse(document.getElementById('questions').textContent);
function shuffle(items){
 const result=[...items];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
}
function round() {
 const selected = Array.from({length: 10}, (_, skill) => {
  const variants = bank.filter((_, position) => position % 10 === skill);
  return shuffle(variants)[0];
 });
 return selected;
}
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
function celebrateAnswer() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  advance();
  return;
 }
 const layer = el('confetti');
 const colors = ['#ff427c', '#00adbe', '#ffbc00', '#8653e8', '#17aa68', '#ff6740'];
 el('answer').readOnly = true;
 el('check').disabled = true;
 el('solution').hidden = true;
 for (let index = 0; index < 32; index++) {
  const piece = document.createElement('i');
  piece.className = ['confetti-star', 'confetti-dot', 'confetti-ribbon'][index % 3];
  piece.style.backgroundColor = colors[index % colors.length];
  piece.style.setProperty('--x', ((index % 8 - 3.5) * layer.clientWidth / 8) + 'px');
  piece.style.setProperty('--y', ((Math.floor(index / 8) - 1.5) * layer.clientHeight / 4) + 'px');
  piece.style.setProperty('--spin', (index * 41) + 'deg');
  layer.append(piece);
 }
 window.setTimeout(() => {
  layer.replaceChildren();
  el('answer').readOnly = false;
  el('check').disabled = false;
  advance();
 }, 1550);
}
function normalize(value) {
 return value.trim().toLowerCase().replaceAll('−', '-').replaceAll(',', '.').replace(/\s*\/\s*/g, '/');
}
function rational(value) {
 const parts = value.split('/');
 if (parts.length > 2 || !parts.every(part => /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(part))) return null;
 function decimal(part) {
  const places = (part.split('.')[1] || '').length;
  return [BigInt(part.replace('.', '')), 10n ** BigInt(places)];
 }
 const [n, d] = decimal(parts[0]);
 const [p, t] = decimal(parts[1] || '1');
 return p === 0n ? null : [n * t, d * p];
}
el('form').onsubmit = event => {
 event.preventDefault();
 if (el('check').disabled || el('answer').disabled) return;
 const q = questions[index];
 const raw = el('answer').value.trim();
 const value = normalize(raw);
 const expected = normalize(q.answer);
 const target = rational(expected);
 const entered = rational(value);
 if (!raw || (target && !entered)) {
  el('feedback').textContent = 'Įrašyk skaičių. Trupmeną gali rašyti su pasviruoju brūkšniu, pavyzdžiui, 3/5.';
  return;
 }
 const correct = target ? entered[0] * target[1] === target[0] * entered[1] : value === expected;
 recordAnswer(raw, correct);
 if (correct) {
  el('feedback').textContent = 'Teisingai! ' + q.solution;
  celebrateAnswer();
 } else {
  if (!missed.includes(q)) {
   missed.push(q);
   el('attempts').append(line('p', 'Patarimas: ' + q.hint));
  }
  el('feedback').textContent = q.hint;
  el('solution').hidden = false;
  el('answer').select();
 }
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
el('start').onclick=el('again').onclick=()=>begin(round());el('retry').onclick=()=>begin(missed);