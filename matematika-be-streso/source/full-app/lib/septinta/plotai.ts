import { lesson, lt, task } from './lesson';

export default {
  "plotai-1": lesson("Stačiakampio, kvadrato ir stačiojo trikampio plotas", "Kiek kvadratinių plytelių reikia grindims?", "Vienos eilės plytelių skaičių padaugink iš eilių skaičiaus. Todėl stačiakampio plotas yra ilgis kart plotis. Įstrižainė padalija jį į du vienodo ploto stačiuosius trikampius.", [
    (n) => task(`Stačiakampyje yra 3 eilės po ${lt(n)} vienetinių kvadratų. Koks plotas kvadratiniais vienetais?`, 3*n, "Kiekvienos eilės plotas vienodas.", `3 · ${lt(n)} = `),
    (n) => task(`Kvadrato kraštinė ${lt(n)} cm. Koks plotas cm²?`, n*n, "Kvadrato ilgis ir plotis lygūs.", `${lt(n)} · ${lt(n)} = `),
    (n) => task(`Stačiojo trikampio statiniai ${lt(2*n)} ir 5 cm. Koks plotas cm²?`, 5*n, "Papildyk trikampį iki stačiakampio.", `Stačiakampio plotas ${lt(10*n)} cm². Trikampio: ${lt(10*n)} : 2 = `),
  ]),
  "plotai-2": lesson("Trikampio ploto formulė", "Kodėl skirtingos formos trikampiai gali užimti tiek pat vietos?", "Prie trikampio pridėjus jo apverstą kopiją susidaro lygiagretainis. Vienam trikampiui tenka pusė jo ploto: S = a · h / 2. Aukštinė turi būti statmena pasirinktam pagrindui.", [
    (n) => task(`Pagrindas ${lt(2*n)} cm, aukštinė į jį 3 cm. Koks trikampio plotas cm²?`, 3*n, "Pagrindo ir aukštinės sandaugą dalyk pusiau.", `${lt(2*n)} · 3 : 2 = `),
    (n) => task(`Trikampio plotas ${lt(4*n)} cm², pagrindas 8 cm. Kokia aukštinė centimetrais?`, n, "Padvigubink plotą ir dalyk iš pagrindo.", `h = 2 · ${lt(4*n)} : 8 = `),
    (n) => task(`Du trikampiai turi po 6 cm aukštinę. Jų pagrindai ${lt(2*n)} ir ${lt(n)} cm. Kiek cm² didesnis pirmojo plotas?`, 3*n, "Rask abiejų plotus su ta pačia aukštine.", `Pirmojo plotas ${lt(6*n)}, antrojo ${lt(3*n)} cm². Skirtumas: ${lt(6*n)} − ${lt(3*n)} = `),
  ]),
  "plotai-3": lesson("Lygiagretainio plotas", "Kaip pasvirusią figūrą paversti stačiakampiu?", "Nukirpk trikampį nuo vieno lygiagretainio krašto ir perkelk prie kito. Plotas išliks. Stačiakampis turi tą patį pagrindą ir statmeną aukštinę, todėl S = a · h.", [
    (n) => task(`Pagrindas ${lt(n)} cm, aukštinė 4 cm. Koks lygiagretainio plotas cm²?`, 4*n, "Daugink iš statmenos aukštinės.", `${lt(n)} · 4 = `),
    (n) => task(`Lygiagretainio plotas ${lt(6*n)} cm², pagrindas 6 cm. Kokia aukštinė centimetrais?`, n, "Iš sandaugos rask antrą daugiklį.", `h = ${lt(6*n)} : 6 = `),
    (n) => task(`Lygiagretainio pagrindas ${lt(3*n)} cm, aukštinė 4 cm. Kitas pagrindas ${lt(2*n)} cm. Kokia aukštinė į jį centimetrais?`, 6, "Abiem būdais plotas tas pats.", `S = ${lt(12*n)} cm². Kita aukštinė: ${lt(12*n)} : ${lt(2*n)} = `),
  ]),
  "plotai-4": lesson("Rombo plotas", "Kaip rasti rombo plotą pagal dvi įstrižaines?", "Viena įstrižainė padalija rombą į du trikampius. Jų aukštinės kartu sudaro kitą įstrižainę, nes įstrižainės statmenos. Todėl plotas lygus pusei įstrižainių sandaugos.", [
    (n) => task(`Rombo kraštinė ${lt(n)} cm, į ją nubrėžta 2 cm aukštinė. Koks plotas cm²?`, 2*n, "Tinka lygiagretainio formulė.", `${lt(n)} · 2 = `),
    (n) => task(`Rombo įstrižainės ${lt(2*n)} ir 7 cm. Koks plotas cm²?`, 7*n, "Sandaugą dalyk pusiau.", `${lt(2*n)} · 7 : 2 = `),
    (n) => task(`Rombo plotas ${lt(5*n)} cm², viena įstrižainė 10 cm. Kokia kita centimetrais?`, n, "Pirmiausia padvigubink plotą.", `Įstrižainių sandauga ${lt(10*n)}. Antroji įstrižainė: ${lt(10*n)} : 10 = `),
  ]),
  "plotai-5": lesson("Trapecijos plotas", "Kodėl matuojant trapeciją reikia abiejų pagrindų?", "Sudėjus dvi vienodas trapecijas, vieną apvertus, gaunamas lygiagretainis. Jo pagrindas yra abiejų senųjų pagrindų suma. Vienos trapecijos plotas yra pagrindų vidurkis kart aukštinė.", [
    (n) => task(`Trapecijos pagrindai ${lt(n)} ir ${lt(n+4)} cm. Koks jų vidurkis centimetrais?`, n+2, "Sudėk ilgius ir dalyk iš dviejų.", `(${lt(n)} + ${lt(n+4)}) : 2 = `),
    (n) => task(`Pagrindai ${lt(n)} ir ${lt(n+6)} cm, aukštinė 4 cm. Koks trapecijos plotas cm²?`, 4*(n+3), "Rask vidutinį pagrindo ilgį.", `Vidurkis ${lt(n+3)} cm. Plotas: ${lt(n+3)} · 4 = `),
    (n) => task(`Trapecijos plotas ${lt(6*n+12)} cm², aukštinė 6 cm, trumpesnis pagrindas ${lt(n)} cm. Koks ilgesnis pagrindas centimetrais?`, n+4, "Iš ploto ir aukštinės rask pagrindų vidurkį.", `Vidurkis ${lt(n+2)} cm, suma ${lt(2*n+4)} cm. Ilgesnis pagrindas: ${lt(2*n+4)} − ${lt(n)} = `),
  ]),
};
