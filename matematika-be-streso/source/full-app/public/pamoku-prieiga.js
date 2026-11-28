const topics = [
  {
    "id": "saknu",
    "name": "Kvadratinės ir kubinės šaknys",
    "lessons": [
      "Kvadratinė šaknis",
      "Kubinė šaknis",
      "Iracionalieji skaičiai",
      "Šaknų palyginimas",
      "Šaknų sudėtis ir atimtis",
      "Šaknis iš sandaugos",
      "Šaknis iš trupmenos",
      "Dauginamojo iškėlimas ir įkėlimas",
      "Skaitiniai reiškiniai su šaknimis",
      "Raidiniai reiškiniai su šaknimis"
    ]
  },
  {
    "id": "aibiu",
    "name": "Skaičių aibės",
    "lessons": [
      "Skaičių aibės",
      "Skaičių aibės poaibis",
      "Realieji skaičiai",
      "Veiksmai su realiaisiais skaičiais"
    ]
  },
{
  "id": "laipsniu",
  "name": "Laipsniai (7 klasė)",
  "lessons": [
    "Skaičiaus kvadratas ir kubas",
    "Laipsnis su natūraliuoju rodikliu",
    "Laipsnių su vienodais pagrindais daugyba",
    "Laipsnių su vienodais pagrindais dalyba",
    "Laipsnio, sandaugos ir trupmenos kėlimas laipsniu",
    "Nulinis ir neigiamas laipsnio rodiklis",
    "Veiksmai su laipsniais, kurių rodikliai sveikieji",
    "Standartinė skaičiaus išraiška"
  ]
}
];
const params = new URLSearchParams(location.search);
const selectedTopic = topics.find(topic => topic.id === params.get('tema')) || topics[0];
const item = document.getElementById('item');
const terms = document.getElementById('terms');
function showPlan(plan) {
  document.getElementById('selection').hidden = false;
  item.replaceChildren();
  document.getElementById('item-label').textContent = ['Pasirink pamoką','Pasirink temą','Pasirink klasę'][plan];
  if (plan === 0) {
    for (const topic of topics) {
      const group = document.createElement('optgroup');
      group.label = topic.name;
      topic.lessons.forEach((lesson,index) => {
        if (topic.id !== 'saknu' || index !== 4) group.append(new Option(lesson, topic.id + '-' + (index+1)));
      });
      item.append(group);
    }
    item.value = selectedTopic.id + '-1';
  } else if (plan === 1) {
    for (const topic of topics) item.add(new Option(topic.name,topic.id));
    item.value = selectedTopic.id;
  } else {
    item.add(new Option('7 klasė','7'));
    item.add(new Option('8 klasė','8'));
    item.value = selectedTopic.id === 'laipsniu' ? '7' : '8';
  }
  function showTerms() {
    terms.textContent = plan === 0 ? '1 € · 72 val.' : plan === 1 ? '5 € · 7 dienos' : '20 € / 3 mėn.';
  }
  item.onchange = showTerms;
  showTerms();
}
const plans = [...document.querySelectorAll('[name="plan"]')];
plans.forEach((radio,index) => radio.addEventListener('change', () => showPlan(index)));
const legacy = Number(params.get('pamoka'));
if (Number.isInteger(legacy) && legacy >= 1 && legacy <= selectedTopic.lessons.length && (selectedTopic.id !== 'saknu' || legacy !== 5)) {
  plans[0].checked = true;
  showPlan(0);
  item.value = selectedTopic.id + '-' + legacy;
}

if (params.get('planas') === 'tema') {
  plans[1].checked = true;
  showPlan(1);
}
