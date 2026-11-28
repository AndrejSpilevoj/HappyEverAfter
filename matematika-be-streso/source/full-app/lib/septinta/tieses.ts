import { lesson, lt, task } from './lesson';

export default {
  "tieses-1": lesson("Taškas, tiesė ir atkarpa", "Ką galima išmatuoti ant liniuotės?", "Atkarpa turi du galus, todėl turi ilgį. Tiesę įsivaizduok pratęstą į abi puses be galo. Jei taškas yra tarp abiejų galų, dviejų dalių ilgiai sudaro visą atkarpą.", [
    (n) => task(`B yra tarp A ir C. AB = ${lt(n)} cm, BC = 4 cm. Kiek centimetrų yra AC?`, n+4, "Sudėk gretimas dalis.", `AC = ${lt(n)} + 4 = `),
    (n) => task(`M yra atkarpos AB vidurys. AB = ${lt(2*n)} cm. Kiek centimetrų yra MB?`, n, "Vidurys dalija atkarpą pusiau.", `MB = ${lt(2*n)} : 2 = `),
    (n) => task(`Tiesėje A yra ties −${lt(n)}, B ties ${lt(n+6)}. Ties kokiu skaičiumi yra AB vidurys?`, 3, "Nuo kairiojo galo nueik pusę atstumo.", `Ilgis ${lt(2*n+6)}, pusė ${lt(n+3)}. Vidurys: −${lt(n)} + ${lt(n+3)} = `),
  ]),
  "tieses-2": lesson("Susikertančios tiesės", "Ką pastebi žiūrėdamas į prasivėrusias žirkles?", "Priešingi kampai tiesių sankirtoje vadinami kryžminiais ir yra lygūs. Gretutiniai kampai sudaro ištiestinį kampą, todėl jų suma 180°.", [
    (n) => task(`Dvi tiesės kertasi. Vienas kampas ${lt(40+n)}°. Kiek laipsnių turi jo kryžminis kampas?`, 40+n, "Žiūrėk į kampą priešais.", `Kryžminiai kampai lygūs. Atsakymas – `),
    (n) => task(`Vienas gretutinis kampas ${lt(50+n)}°. Kiek laipsnių turi kitas?`, 130-n, "Abu sudaro pusę apsisukimo.", `180 − ${lt(50+n)} = `),
    (n) => task(`Dviejų kryžminių kampų suma ${lt(4*n)}°. Kiek laipsnių turi vieno jų gretutinis kampas?`, 180-2*n, "Pirma padalyk sumą pusiau.", `Vienas kryžminis kampas ${lt(2*n)}°. Gretutinis: 180 − ${lt(2*n)} = `),
  ]),
  "tieses-3": lesson("Lygiagrečios tiesės", "Kodėl sąsiuvinio eilutės nesusitinka?", "Vienoje plokštumoje lygiagrečios tiesės nesikerta. Statmenas atstumas tarp jų visur vienodas. Tiesė, statmena vienai iš dviejų lygiagrečių tiesių, statmena ir kitai.", [
    (n) => task(`Lygiagrečių linijų statmenas atstumas vienoje vietoje ${lt(n)} mm. Koks jis milimetrais kitoje vietoje?`, n, "Atstumą matuok statmenai.", `Statmens ilgis visur vienodas. Atsakymas – `),
    (n) => task(`Trys lygiagrečios linijos eina iš eilės. Gretimų linijų atstumai ${lt(n)} cm ir 4 cm. Kiek centimetrų skiria kraštines linijas?`, n+4, "Įsivaizduok vieną statmenį per visas linijas.", `Statmens dalys susideda: ${lt(n)} + 4 = `),
    (n) => task(`Lape nubrėžta ${lt(n+1)} lygiagrečių linijų. Tarp gretimų linijų po 3 mm. Kiek milimetrų skiria pirmą ir paskutinę?`, 3*n, "Tarpų vienu mažiau nei linijų.", `Yra ${lt(n)} tarpų. Atstumas: ${lt(n)} · 3 = `),
  ]),
  "tieses-4": lesson("Dviejų tiesių lygiagretumo požymiai", "Kaip patikrinti lygiagretumą nepratęsiant linijų?", "Nubrėžk jas kertančią tiesę – kirstinę. Jei atitinkamieji kampai lygūs, tiesės lygiagrečios. Tą patį įrodo lygūs vidaus priešiniai kampai arba 180° sudarantys vidaus vienašaliai kampai.", [
    (n) => task(`Vienas atitinkamasis kampas ${lt(45+n)}°. Kokio dydžio turi būti kitas, kad tiesės būtų lygiagrečios? Rašyk laipsniais.`, 45+n, "Atitinkamieji kampai turi sutapti.", `Reikia tokio pat dydžio. Atsakymas – `),
    (n) => task(`Vienas vidaus vienašalis kampas ${lt(60+n)}°. Kiek laipsnių turėtų būti kitas, kad tiesės būtų lygiagrečios?`, 120-n, "Ieškok papildinio iki 180°.", `180 − ${lt(60+n)} = `),
    (n) => task(`Vidaus priešiniai kampai yra (2x + 4)° ir ${lt(2*n+4)}°. Koks x užtikrina lygiagretumą?`, n, "Sulygink kampų dydžius.", `2x + 4 = ${lt(2*n+4)}. Todėl x = ${lt(2*n)} : 2 = `),
  ]),
  "tieses-5": lesson("Kampai prie lygiagrečių tiesių ir kirstinės", "Kur kitoje sankryžoje pasikartoja pirmasis kampas?", "Kirstinė yra tarsi kelias per dvi lygiagrečias gatves. Abiejose sankryžose tokią pat padėtį užimantys kampai lygūs. Gretimo kampo dydį gausi atėmęs iš 180°.", [
    (n) => task(`Kirstinė kerta lygiagretes. Vienas kampas ${lt(30+n)}°. Kiek laipsnių turi jo atitinkamasis kampas?`, 30+n, "Rask tą pačią padėtį antroje sankirtoje.", `Atitinkamieji kampai lygūs. Atsakymas – `),
    (n) => task(`Vienas vidaus vienašalis kampas ${lt(100+n)}°. Kiek laipsnių turi kitas?`, 80-n, "Abu kartu sudaro 180°.", `180 − ${lt(100+n)} = `),
    (n) => task(`Iš aštuonių kampų vienas smailusis yra ${lt(40+n)}°. Kokia dviejų bukųjų kampų suma laipsniais?`, 2*(140-n), "Pirma rask vieną bukąjį kampą.", `Vienas bukasis ${lt(140-n)}°. Du kartu: 2 · ${lt(140-n)} = `),
  ]),
};
