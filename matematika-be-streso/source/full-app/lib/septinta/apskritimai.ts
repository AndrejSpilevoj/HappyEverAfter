import { lesson, lt, task } from './lesson';

export default {
  "apskritimai-1": lesson("Apskritimas, spindulys, styga ir skersmuo", "Kur baigiasi kelias nuo rato centro iki padangos?", "Apskritimas yra krašto linija. Nuo centro iki jos eina spindulys. Du krašto taškus jungianti atkarpa yra styga. Jei ji eina per centrą, tai skersmuo, kurį sudaro du spinduliai.", [
    (n) => task(`Rato spindulys ${lt(n)} cm. Koks skersmuo centimetrais?`, 2*n, "Skersmuo eina per centrą iki priešingo krašto.", `d = 2 · ${lt(n)} = `),
    (n) => task(`Apvalaus lango skersmuo ${lt(2*n+4)} cm. Koks spindulys centimetrais?`, n+2, "Nuo centro iki krašto – pusė skersmens.", `r = ${lt(2*n+4)} : 2 = `),
    (n) => task(`Vieno centro apskritimų skersmenys ${lt(4*n)} ir ${lt(2*n)} cm. Kiek centimetrų tarp jų kraštų einant tuo pačiu spinduliu?`, n, "Palygink spindulius.", `Spinduliai ${lt(2*n)} ir ${lt(n)} cm. Skirtumas: ${lt(2*n)} − ${lt(n)} = `),
  ]),
  "apskritimai-2": lesson("Apskritimo ilgis", "Kiek nurieda ratas per vieną apsisukimą?", "Pažymėk tašką ant padangos. Jam vėl palietus žemę ratas nuriedėjo visą krašto ilgį. Apskritimo ilgis C = πd = 2πr. Apytiksliam skaičiavimui imk užduotyje nurodytą π vertę.", [
    (n) => task(`Skersmuo ${lt(n)} cm. Įrašyk daugiklį formulėje C = □π cm.`, n, "Naudok C = πd.", `Daugiklis prie π lygus skersmeniui. Atsakymas – `),
    (n) => task(`Spindulys ${lt(n)} cm. Koks apskritimo ilgis centimetrais, jei π ≈ 3,14?`, 6.28*n, "Iš pradžių rask skersmenį.", `d = ${lt(2*n)} cm. Apskaičiuojame apytikslį ilgį: ${lt(2*n)} · 3,14 = `),
    (n) => task(`Rato spindulys ${lt(n)} cm. Kiek centimetrų jis nurieda per tris apsisukimus? Imk π ≈ 3,14.`, 18.84*n, "Vieno apsisukimo kelią patrigubink.", `Per apsisukimą apie ${lt(6.28*n)} cm. Per tris: ${lt(6.28*n)} · 3 = `),
  ]),
  "apskritimai-3": lesson("Apskritimo lankas ir jo ilgis", "Kiek rato krašto nueisi apsukęs ketvirtį rato?", "Lankas yra apskritimo dalis tarp dviejų taškų. Centro kampas pasako, kurią 360° posūkio dalį įveikei. Tokia pati dalis tenka ir apskritimo ilgiui.", [
    (n) => task(`Apskritimo ilgis ${lt(2*n)} cm. Koks puslankio ilgis centimetrais?`, n, "Pusei rato tenka pusė ilgio.", `${lt(2*n)} : 2 = `),
    (n) => task(`Apskritimo ilgis ${lt(8*n)} cm. Koks 90° lanko ilgis centimetrais?`, 2*n, "90° yra ketvirtadalis viso posūkio.", `${lt(8*n)} : 4 = `),
    (n) => task(`Iš ${lt(12*n)} cm ilgio apskritimo išskirtas ${lt(n)} cm lankas. Koks jo centro kampas laipsniais?`, 30, "Rask, kurią ilgio dalį sudaro lankas.", `Lankas sudaro 1/12 viso ilgio. Kampas: 360 : 12 = `),
  ]),
  "apskritimai-4": lesson("Skritulys ir jo dalių plotas", "Kuo skiriasi picos kraštas ir visa pica?", "Kraštas yra apskritimas, užpildyta sritis – skritulys. Jo plotas S = πr². Išpjova su 90° centro kampu užima ketvirtį ploto, nes keturios tokios dalys užpildo visą picą.", [
    (n) => task(`Spindulys ${lt(n)} cm. Įrašyk skritulio ploto daugiklį: S = □π cm².`, n*n, "Spindulį pakelk kvadratu.", `Daugiklis: ${lt(n)} · ${lt(n)} = `),
    (n) => task(`Skersmuo ${lt(2*n)} cm. Koks skritulio plotas cm², jei π ≈ 3,14?`, 3.14*n*n, "Pirmiausia rask spindulį.", `Spindulys ${lt(n)} cm. Plotas apytiksliai: 3,14 · ${lt(n*n)} = `),
    (n) => task(`Ketvirčio skritulio spindulys ${lt(2*n)} cm. Koks daugiklis prie π jo plote, išreikštame cm²?`, n*n, "Visą skritulio plotą dalyk iš keturių.", `Visas plotas ${lt(4*n*n)}π cm². Ketvirčio ploto daugiklis: ${lt(4*n*n)} : 4 = `),
  ]),
};
