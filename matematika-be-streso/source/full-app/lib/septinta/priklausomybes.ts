import { lesson, lt, task } from './lesson';

export default {
  "priklausomybes-1": lesson("5.1. Tarpusavyje susiję dydžiai", "Ką rodo kasa įdėjus dar vieną tokį pat pirkinį?", "Jei vienetas kainuoja tiek pat, padvigubinęs kiekį padvigubini kainą. Tai tiesioginis proporcingumas. Pridėjus pastovų pristatymo mokestį suma vis dar priklauso nuo kiekio, bet dvigubas kiekis nebūtinai reiškia dvigubą sumą.", [
    (n) => task(`Kiek eurų kainuoja ${lt(n)} rinkinių po 4 €?`, 4*n, "Daugink iš vieneto kainos.", `4 · ${lt(n)} = `),
    (n) => task(`Už ${lt(n)} ritinėlių sumokėta ${lt(3*n)} €. Kiek eurų kainuotų ${lt(n+2)} ritinėliai?`, 3*(n+2), "Pirma rask vieneto kainą.", `Vienas kainuoja ${lt(3*n)} : ${lt(n)} = 3 €. Visa suma: ${lt(n+2)} · 3 = `),
    (n) => task(`Kelionė kainuoja 3 € ir dar 2 € už kilometrą. Kiek kilometrų nuvažiuota už ${lt(2*n+3)} €?`, n, "Pradinis mokestis nuo kilometrų nepriklauso.", `Už kilometrus sumokėta ${lt(2*n)} €. Atstumas: ${lt(2*n)} : 2 = `),
  ]),
  "priklausomybes-2": lesson("5.2. Atvirkščiai proporcingi dydžiai", "Kas nutiks porcijai, jei picą dalysis dvigubai daugiau draugų?", "Kiekvienam teks perpus mažiau. Žmonių skaičius kart porcijos dydis duoda tą patį bendrą kiekį. Tokie dydžiai atvirkščiai proporcingi.", [
    (n) => task(`${lt(2*n)} obuolių dalijama dviem po lygiai. Kiek gauna vienas?`, n, "Visą kiekį dalyk iš žmonių skaičiaus.", `${lt(2*n)} : 2 = `),
    (n) => task(`Dalijant pieštukus trims tenka po ${lt(2*n)}. Po kiek tektų šešiems?`, n, "Dvigubai daugiau žmonių gauna perpus mažiau.", `Iš viso ${lt(6*n)}. Vienam teks ${lt(6*n)} : 6 = `),
    (n) => task(`Keturi dažytojai darbą baigia per ${lt(3*n)} val. Per kiek valandų jį baigtų šeši tokiu pačiu pastoviu tempu?`, 2*n, "Darbo kiekį matuok žmogaus darbo valandomis.", `Reikia 4 · ${lt(3*n)} = ${lt(12*n)} žmogaus darbo valandų. Laikas: ${lt(12*n)} : 6 = `),
  ]),
  "priklausomybes-3": lesson("5.3. Atvirkščiai proporcingų dydžių priklausomybės grafikas", "Kodėl taškai leidžiasi, kai judame į dešinę?", "Kai x ir y teigiami, o jų sandauga pastovi, didesniam x tenka mažesnis y. Grafike pirmiausia rask x horizontalioje ašyje, tada pakilk iki y. Taškai priklauso kreivei, vadinamai hiperbole.", [
    (n) => task(`Grafiko taisyklė y = ${lt(2*n)}/x. Koks y, kai x = 2?`, n, "Vietoj x rašyk 2.", `y = ${lt(2*n)} : 2 = `),
    (n) => task(`Taškas (3; ${lt(n)}) yra grafike y = k/x. Koks k?`, 3*n, "Padaugink koordinates.", `k = x · y = 3 · ${lt(n)} = `),
    (n) => task(`Grafikas y = k/x eina per (4; ${lt(3*n)}). Kokia kito taško x koordinatė, jei y = 6?`, 2*n, "Abiejų taškų koordinačių sandauga vienoda.", `k = 4 · ${lt(3*n)} = ${lt(12*n)}. Tada x = ${lt(12*n)} : 6 = `),
  ]),
  "priklausomybes-4": lesson("5.4. Tekstinių uždavinių sprendimas", "Kodėl tuo pačiu keliu dviratininkas užtrunka trumpiau?", "Kai atstumas tas pats, greičio ir laiko sandauga nesikeičia. Pirma rask, kas uždavinyje lieka vienoda. Tada patikrink matavimo vienetus.", [
    (n) => task(`Dviratininkas važiuoja 12 km/h greičiu ${lt(n)} val. Kokį atstumą kilometrais įveikia?`, 12*n, "Kiekvieną valandą prisideda 12 km.", `12 · ${lt(n)} = `),
    (n) => task(`Autobusas kelią įveikė per ${lt(n)} val. važiuodamas 60 km/h. Kiek valandų važiuotų 30 km/h greičiu?`, 2*n, "Pirma rask kelią.", `Kelias ${lt(60*n)} km. Laikas: ${lt(60*n)} : 30 = `),
    (n) => task(`Trys vienodi siurbliai baseiną ištuština per ${lt(2*n)} val. Po ${lt(n)} valandų vienas sustojo. Kiek dar valandų dirbs likę du?`, 1.5*n, "Pirma rask likusį darbą vieno siurblio darbo valandomis.", `Visas darbas ${lt(6*n)}, atlikta ${lt(3*n)}. Likutį dalijame dviem: ${lt(3*n)} : 2 = `),
  ]),
};
