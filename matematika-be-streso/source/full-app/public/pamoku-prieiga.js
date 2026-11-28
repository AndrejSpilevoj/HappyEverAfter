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
},
{
  "id": "procentai",
  "name": "Procentai ir palūkanos (7 klasė)",
  "lessons": [
    "Procentinis pokytis",
    "Vertė po procentinio pokyčio",
    "Paprastosios palūkanos",
    "Sudėtinės palūkanos",
    "Keli procentiniai pokyčiai"
  ]
},
{
  "id": "nelygybes",
  "name": "Nelygybės (7 klasė)",
  "lessons": [
    "Skaičių palyginimas",
    "Skaičių intervalai",
    "Vienodo skaičiaus pridėjimas ir atėmimas",
    "Daugyba ir dalyba nelygybėje",
    "Nelygybės sprendinys",
    "Vieno žingsnio nelygybės",
    "Dviejų žingsnių nelygybės",
    "Nelygybės su skliaustais ir x abiejose pusėse",
    "Dviejų nelygybių sistema",
    "Dvigubosios nelygybės",
    "Tekstiniai uždaviniai su nelygybėmis"
  ]
},
{
  "id": "priklausomybes",
  "name": "Atvirkštinis proporcingumas (7 klasė)",
  "lessons": [
    "Tarpusavyje susiję dydžiai",
    "Atvirkščiai proporcingi dydžiai",
    "Atvirkštinio proporcingumo grafikas",
    "Uždaviniai apie darbą, laiką ir greitį"
  ]
},
{
  "id": "tieses",
  "name": "Tiesės ir kampai (7 klasė)",
  "lessons": [
    "Taškas, tiesė ir atkarpa",
    "Susikertančios tiesės",
    "Lygiagrečios tiesės",
    "Dviejų tiesių lygiagretumo požymiai",
    "Kampai prie lygiagrečių tiesių ir kirstinės"
  ]
},
{
  "id": "daugiakampiai",
  "name": "Trikampiai ir keturkampiai (7 klasė)",
  "lessons": [
    "Trikampių rūšys",
    "Trikampio aukštinės",
    "Trikampio pusiaukraštinės",
    "Trikampio pusiaukampinės",
    "Lygiagretainis",
    "Stačiakampis",
    "Rombas",
    "Kvadratas",
    "Trapecija",
    "Lygiašonė ir stačioji trapecijos",
    "Daugiakampių postūmis koordinačių plokštumoje"
  ]
},
{
  "id": "plotai",
  "name": "Daugiakampių plotai (7 klasė)",
  "lessons": [
    "Stačiakampio, kvadrato ir stačiojo trikampio plotas",
    "Trikampio ploto formulė",
    "Lygiagretainio plotas",
    "Rombo plotas",
    "Trapecijos plotas"
  ]
},
{
  "id": "apskritimai",
  "name": "Apskritimas ir skritulys (7 klasė)",
  "lessons": [
    "Apskritimas, spindulys, styga ir skersmuo",
    "Apskritimo ilgis",
    "Apskritimo lankas ir jo ilgis",
    "Skritulys ir jo dalių plotas"
  ]
},
{
  "id": "briaunainiai",
  "name": "Prizmės ir piramidės (7 klasė)",
  "lessons": [
    "Tiesės ir plokštumos erdvėje",
    "Stačioji prizmė ir jos paviršius",
    "Stačiosios prizmės tūris",
    "Piramidė ir jos sandara",
    "Taisyklingoji piramidė"
  ]
},
{
  "id": "sukiniai",
  "name": "Ritinys ir kūgis (7 klasė)",
  "lessons": [
    "Ritinys",
    "Ritinio paviršiaus plotas ir tūris",
    "Kūgis",
    "Kūgio paviršiaus plotas ir tūris"
  ]
},
{
  "id": "statistika",
  "name": "Statistinis tyrimas (7 klasė)",
  "lessons": [
    "Populiacija ir tyrimo klausimas",
    "Imtis ir paprastoji atsitiktinė atranka",
    "Sisteminė ir sluoksninė atranka",
    "Statistinis kintamasis",
    "Skritulinė diagrama"
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
    item.value = !['saknu', 'aibiu'].includes(selectedTopic.id) ? '7' : '8';
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
