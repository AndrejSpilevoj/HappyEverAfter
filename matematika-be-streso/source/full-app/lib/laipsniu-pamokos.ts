import lesson1 from './laipsniai/kvadratas-ir-kubas.json';
import lesson2 from './laipsniai/laipsnio-pagrindas.json';
import lesson3 from './laipsniai/laipsniu-daugyba.json';
import lesson4 from './laipsniai/laipsniu-dalyba.json';
import lesson5 from './laipsniai/laipsnio-kelimas.json';
import lesson6 from './laipsniai/nulinis-neigiamas-rodiklis.json';
import lesson7 from './laipsniai/sveikieji-rodikliai.json';
import lesson8 from './laipsniai/standartine-israiska.json';

export const powersLessons = {
  'kvadratas-ir-kubas': lesson1,
  'laipsnio-pagrindas': lesson2,
  'laipsniu-daugyba': lesson3,
  'laipsniu-dalyba': lesson4,
  'laipsnio-kelimas': lesson5,
  'nulinis-neigiamas-rodiklis': lesson6,
  'sveikieji-rodikliai': lesson7,
  'standartine-israiska': lesson8,
};

export function renderPowersLesson(slug: keyof typeof powersLessons) {
  const lesson = powersLessons[slug];
  const grid = '<div class="diagram" role="img" aria-label="Trys eilės po tris plyteles"><span class="grid" style="--n:3;--size:108px">' + '<i></i>'.repeat(9) + '</span></div>';
  const sections = lesson.blocks.map((text, index) => {
    const heading = index % 2 === 0;
    const tag = heading ? 'h2' : 'p';
    const visual = slug === 'kvadratas-ir-kubas' && index === 1 ? grid : '';
    return (heading ? '<section>' : '') + `<${tag} data-lesson-text="${index+1}">${text}</${tag}>` + visual + (heading ? '' : '</section>');
  }).join('\n');
  return `<!doctype html>
<html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${lesson.title} · Matematika be streso</title>
<link rel="stylesheet" href="/bandymai/temu-pamokos.css"><link rel="stylesheet" href="/bandymai/lesson-navigation.css"></head>
<body><header class="lesson-site-header"><nav aria-label="Pagrindinė navigacija"><a class="lesson-brand" href="/"><img src="/logo.webp" alt="Matematika be streso"></a><a href="/pamokos">Pamokos ir testai</a><a href="/prieiga#kodas">Įvesti kodą</a><a href="/?area=teacher" data-teacher-link hidden>Mokytojo erdvė</a></nav></header><main><header><a href="/laipsniu-tema">← Laipsniai</a><p><small>7 klasė · Laipsniai</small></p><h1>${lesson.title}</h1></header>
${sections}<button id="start" class="primary">PASITIKRINK</button>
<div id="history"></div><section id="quiz" hidden><h2 id="heading" tabindex="-1"></h2><div id="exercise"><p id="prompt"></p><p class="math" id="expression"></p><form id="form"><label for="answer">Tavo atsakymas</label><span class="answer-box"><input id="answer" type="text" required autocomplete="off" maxlength="32"><span id="confetti" aria-hidden="true"></span></span> <button class="primary" id="check">Tikrinti</button></form></div><div id="attempts"></div><p id="feedback" role="status"></p><div class="actions"><button id="solution" hidden>Rodyti sprendimą</button><button id="next" hidden>Toliau</button><button id="retry" hidden>Pakartoti klaidas</button><button id="again" hidden>Naujas testas</button></div></section></main><script type="application/json" id="questions">${JSON.stringify(lesson.questions).replaceAll('<','\\u003c')}</script><script src="/bandymai/temu-testas.js" defer></script><script src="/lesson-preview.js" defer></script><script src="/lesson-editor.js" data-lesson="${slug}" defer></script></body></html>`;
}
