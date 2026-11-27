const lessons = ["Kvadratinė šaknis","Kubinė šaknis","Iracionalieji skaičiai","Šaknų palyginimas","Šaknų sudėtis ir atimtis","Šaknis iš sandaugos","Šaknis iš trupmenos","Dauginamojo iškėlimas ir įkėlimas","Skaitiniai reiškiniai su šaknimis","Raidiniai reiškiniai su šaknimis"];
const lesson = Number(new URLSearchParams(location.search).get('pamoka'));
if (Number.isInteger(lesson) && lesson >= 1 && lesson <= lessons.length && lesson !== 5) {
  document.getElementById('offer-title').textContent = 'Viena pamoka su testu';
  document.getElementById('offer-name').textContent = lessons[lesson - 1];
  document.getElementById('offer-price').textContent = '1 € · 72 val.';
}
