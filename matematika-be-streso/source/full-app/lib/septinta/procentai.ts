import { lesson, lt, task } from './lesson';

export default {
  "procentai-1": lesson("3.1. Ieškome, kiek procentų pakito dydis", "Ar 5 eurų nuolaida visada vienodai didelė?", "Jei kaina buvo 10 €, sutaupei pusę. Jei 100 € – tik penkias šimtąsias. Pokytį lygink su pradine verte: skirtumą padalyk iš jos ir padaugink iš 100.", [
    (n) => task(`Kaina pakilo nuo 100 iki ${lt(100+n)} €. Kiek procentų ji pakilo?`, n, "Pirma rask skirtumą.", `(${lt(100+n)} − 100) : 100 · 100 = `),
    (n) => task(`Buvo 200 lankytojų, liko ${lt(200-2*n)}. Kiek procentų sumažėjo jų skaičius?`, n, "Išėjusių skaičių lygink su 200.", `Išėjo ${lt(2*n)}. Procentinis sumažėjimas: ${lt(2*n)} : 200 · 100 = `),
    (n) => task(`Kaina pakilo nuo ${lt(4*n)} iki ${lt(5*n)} €. Kiek procentų ji pakilo?`, 25, "Dalydamas pokytį imk senąją kainą.", `Skirtumas ${lt(n)} €. Skaičiuojame ${lt(n)} : ${lt(4*n)} · 100 = `),
  ]),
  "procentai-2": lesson("3.2. Ieškome dydžio, kai žinoma jo pradinė vertė ir pokytis procentais", "Kiek mokėsi prie kasos?", "Po 20 % nuolaidos iš kiekvieno euro lieka mokėti 80 centų. Vadinasi, seną kainą gali dauginti iš 0,8. Pabrangus 20 %, daugintum iš 1,2.", [
    (n) => task(`Knyga kainuoja ${lt(10*n)} €. Kiek eurų sudaro 10 % nuolaida?`, n, "Rask dešimtadalį.", `${lt(10*n)} : 10 = `),
    (n) => task(`Kuprinė kainavo ${lt(5*n)} €. Kiek eurų mokėsi po 20 % nuolaidos?`, 4*n, "Lieka 80 % kainos.", `${lt(5*n)} · 0,8 = `),
    (n) => task(`Po 25 % pabrangimo bilietas kainuoja ${lt(5*n)} €. Kiek eurų jis kainavo anksčiau?`, 4*n, "Naujoji kaina yra 1,25 senosios kainos.", `Pradinė kaina: ${lt(5*n)} : 1,25 = `),
  ]),
  "procentai-3": lesson("3.3. Paprastosios palūkanos", "Kodėl indėlis kasmet uždirba tiek pat?", "Skaičiuojant paprastąsias palūkanas kiekvienų metų atskaitos taškas yra pradinis indėlis. Vienų metų prieaugį padaugink iš metų skaičiaus.", [
    (n) => task(`Indėlis ${lt(100*n)} €, metinė norma 2 %. Kiek eurų palūkanų gausi per metus?`, 2*n, "Du procentai yra dvi šimtosios.", `${lt(100*n)} · 0,02 = `),
    (n) => task(`Padėjai ${lt(100*n)} € už 3 % paprastųjų metinių palūkanų. Kiek eurų uždirbsi per 4 metus?`, 12*n, "Kiekvienais metais prieaugis vienodas.", `Per metus gauni ${lt(3*n)} €. Per ketverius: ${lt(3*n)} · 4 = `),
    (n) => task(`Po 2 metų su 5 % paprastosiomis metinėmis palūkanomis turi ${lt(110*n)} €. Kiek eurų padėjai?`, 100*n, "Per dvejus metus suma padidėjo 10 %.", `Galutinė suma lygi 110 % pradinės. Dalijame: ${lt(110*n)} : 1,1 = `),
  ]),
  "procentai-4": lesson("3.4. Sudėtinės palūkanos", "Kas nutinka palikus uždirbtas palūkanas sąskaitoje?", "Kitais metais ir jos uždirba palūkanų. Kai norma 10 %, kiekvienų metų pradžioje turimą sumą daugink iš 1,1.", [
    (n) => task(`Metų pradžioje turi ${lt(100*n)} €. Kiek eurų turėsi po metų su 10 % palūkanomis?`, 110*n, "Pridėk dešimtadalį.", `${lt(100*n)} + ${lt(10*n)} = `),
    (n) => task(`Indėlis ${lt(100*n)} €, metinės sudėtinės palūkanos 10 %. Kiek eurų bus po dvejų metų?`, 121*n, "Antrais metais imk jau padidėjusią sumą.", `Po metų yra ${lt(110*n)} €. Po dvejų: ${lt(110*n)} · 1,1 = `),
    (n) => task(`Indėlis ${lt(100*n)} €. Kiek eurų daugiau per 2 metus duos 10 % sudėtinės palūkanos už tokios pat normos paprastąsias?`, n, "Palygink galutines sumas.", `Su sudėtinėmis turi ${lt(121*n)} €, su paprastosiomis ${lt(120*n)} €. Skirtumas: ${lt(121*n)} − ${lt(120*n)} = `),
  ]),
  "procentai-5": lesson("3.5. Sudėtiniai procentai", "Ar du kartus pritaikius 10 % nuolaidą sutaupysi 20 %?", "Antroji nuolaida skaičiuojama nuo jau sumažėjusios kainos. Po kiekvieno žingsnio užsirašyk naują sumą. Ji tampa kito žingsnio pradžia.", [
    (n) => task(`Prekė kainuoja ${lt(4*n)} €. Kiek eurų ji kainuos po pirmos 25 % nuolaidos?`, 3*n, "Lieka trys ketvirtadaliai kainos.", `${lt(4*n)} : 4 · 3 = `),
    (n) => task(`Kaina ${lt(100*n)} €. Ji pakilo 10 %, paskui krito 10 %. Kokia galutinė kaina eurais?`, 99*n, "Pirmas daugiklis 1,1, antras 0,9.", `Po pabrangimo ${lt(110*n)} €. Po nuolaidos: ${lt(110*n)} · 0,9 = `),
    (n) => task(`Po dviejų nuolaidų, 20 % ir 25 %, lentyna kainuoja ${lt(6*n)} €. Kiek eurų ji kainavo pradžioje?`, 10*n, "Skaičiuok atgal: dalyk iš 0,75, paskui iš 0,8.", `Prieš antrą nuolaidą buvo ${lt(8*n)} €. Prieš pirmą: ${lt(8*n)} : 0,8 = `),
  ]),
};
