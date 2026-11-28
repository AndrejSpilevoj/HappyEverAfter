import { lesson, lt, task } from './lesson';

export default {
  "daugiakampiai-1": lesson("Trikampių rūšys", "Ar trikampis gali būti ir statusis, ir lygiašonis?", "Taip. Vienas pavadinimas nusako kampus, kitas – kraštines. Lygiašonis turi dvi lygias kraštines, lygiakraštis – visas tris. Statusis turi 90° kampą, bukasis – didesnį už 90°, smailiojo visi kampai mažesni už 90°.", [
    (n) => task(`Lygiakraščio trikampio kraštinė ${lt(n)} cm. Koks perimetras centimetrais?`, 3*n, "Visos trys kraštinės lygios.", `${lt(n)} + ${lt(n)} + ${lt(n)} = `),
    (n) => task(`Stačiojo trikampio vienas smailusis kampas ${lt(30+n)}°. Koks kitas laipsniais?`, 60-n, "Abiem smailiesiems lieka 90°.", `90 − ${lt(30+n)} = `),
    (n) => task(`Lygiašonio trikampio kampas tarp lygių kraštinių yra ${lt(2*n)}°. Kiek laipsnių turi kampas prie pagrindo?`, 90-n, "Likusią sumą dalyk pusiau.", `Lieka ${lt(180-2*n)}°. Vienas iš lygių kampų: ${lt(180-2*n)} : 2 = `),
  ]),
  "daugiakampiai-2": lesson("Trikampio aukštinės", "Kaip pamatuoti palapinės aukštį, jei jos šonas pasviręs?", "Nuo viršūnės leisk statmenį į priešingos kraštinės tiesę. Tai trikampio aukštinė. Bukajame trikampyje statmens pėda gali atsidurti už kraštinės galo.", [
    (n) => task(`Pagrindas gulsčias, viršūnė ${lt(n)} cm tiesiai virš jo. Koks aukštinės ilgis centimetrais?`, n, "Ieškok statmeno atstumo.", `Vertikali atkarpa statmena gulsčiam pagrindui. Jos ilgis – `),
    (n) => task(`Stačiojo trikampio statiniai ${lt(n)} ir ${lt(n+4)} cm. Trumpesnis yra pagrindas. Kokia aukštinė centimetrais?`, n+4, "Statiniai sudaro statų kampą.", `Ilgesnysis statinis statmenas pagrindui. Aukštinės ilgis – `),
    (n) => task(`Pagrindas guli tiesėje y = −${lt(n)}, o viršūnės y = ${lt(n+3)}. Koks aukštinės ilgis vienetais?`, 2*n+3, "Vertikalus atstumas yra y koordinačių skirtumas.", `Nuo pagrindo iki nulio yra ${lt(n)}, toliau ${lt(n+3)}. Ilgis: ${lt(n)} + ${lt(n+3)} = `),
  ]),
  "daugiakampiai-3": lesson("Trikampio pusiaukraštinės", "Kur sujungti viršūnę su kraštine, kad pagrindas pasidalytų po lygiai?", "Sujunk viršūnę su priešingos kraštinės viduriu. Ši atkarpa – pusiaukraštinė. Visos trys susikerta taške, kuris kiekvieną padalija santykiu 2 su 1 nuo viršūnės.", [
    (n) => task(`Pusiaukraštinė dalija ${lt(2*n)} cm pagrindą. Kokio ilgio viena dalis centimetrais?`, n, "Abi pagrindo dalys lygios.", `${lt(2*n)} : 2 = `),
    (n) => task(`Pusiaukraštinė ${lt(3*n)} cm. Kiek centimetrų nuo viršūnės iki pusiaukraštinių susikirtimo?`, 2*n, "Nuo viršūnės tenka dvi iš trijų dalių.", `Viena dalis ${lt(n)} cm. Dvi dalys: 2 · ${lt(n)} = `),
    (n) => task(`Nuo viršūnės iki pusiaukraštinių susikirtimo yra ${lt(2*n)} cm. Kokia visa pusiaukraštinė centimetrais?`, 3*n, "Duotas dviejų vienodų dalių ilgis.", `Viena dalis ${lt(n)} cm. Visa atkarpa: 3 · ${lt(n)} = `),
  ]),
  "daugiakampiai-4": lesson("Trikampio pusiaukampinės", "Kaip sulenkti popierinį kampą lygiai pusiau?", "Suglausk abu kampo kraštus. Lenkimo linija dalija kampą į dvi lygias dalis. Nuo viršūnės iki priešingos kraštinės einanti šios linijos dalis vadinama trikampio pusiaukampine.", [
    (n) => task(`Pusiaukampinė dalija ${lt(2*n)}° kampą. Kiek laipsnių yra viena dalis?`, n, "Abi dalys lygios.", `${lt(2*n)} : 2 = `),
    (n) => task(`Po dalijimo pusiaukampine viena dalis yra ${lt(n+9)}°. Koks visas kampas laipsniais?`, 2*(n+9), "Sudėk dvi tokias dalis.", `${lt(n+9)} + ${lt(n+9)} = `),
    (n) => task(`Trikampio kampai A = ${lt(2*n)}°, B = 60°. Kiek laipsnių sudaro pusė kampo C?`, 60-n, "Pirma rask visą kampą C.", `C = 180° − 60° − ${lt(2*n)}° = ${lt(120-2*n)}°. Pusė: ${lt(120-2*n)} : 2 = `),
  ]),
  "daugiakampiai-5": lesson("Lygiagretainis", "Ką turi bendro stačiakampis ir į šoną pasviręs jo rėmas?", "Kai abi priešingų kraštinių poros lygiagrečios, figūra yra lygiagretainis. Priešingos kraštinės ir kampai lygūs, o gretimų kampų suma 180°. Įstrižainės dalija viena kitą pusiau.", [
    (n) => task(`Lygiagretainio kraštinė AB yra ${lt(n)} cm. Kiek centimetrų yra priešinga kraštinė CD?`, n, "Priešingos kraštinės lygios.", `CD ilgis sutampa su AB. Atsakymas – `),
    (n) => task(`Gretimos kraštinės ${lt(n)} ir ${lt(n+3)} cm. Koks lygiagretainio perimetras centimetrais?`, 4*n+6, "Abi kraštines apeidamas sutinki po du kartus.", `2 · (${lt(n)} + ${lt(n+3)}) = `),
    (n) => task(`Vienas lygiagretainio kampas ${lt(50+n)}°. Kokia abiejų jam gretimų kampų suma laipsniais?`, 2*(130-n), "Kiekvienas papildo duotą kampą iki 180°.", `Vienas gretimas kampas ${lt(130-n)}°. Abu: 2 · ${lt(130-n)} = `),
  ]),
  "daugiakampiai-6": lesson("Stačiakampis", "Kodėl meistras matuoja lango rėmo įstrižaines?", "Stačiakampio visi kampai statūs, priešingos kraštinės lygios, o įstrižainės vienodo ilgio ir dalija viena kitą pusiau. Taip gali rasti atstumus iki rėmo centro.", [
    (n) => task(`Viena stačiakampio įstrižainė ${lt(n+5)} cm. Kiek centimetrų yra kita?`, n+5, "Stačiakampio įstrižainės lygios.", `Kita tokio pat ilgio. Atsakymas – `),
    (n) => task(`Perimetras ${lt(4*n+6)} cm, ilgis ${lt(n+3)} cm. Koks stačiakampio plotis centimetrais?`, n, "Pusė perimetro yra ilgio ir pločio suma.", `Pusė perimetro ${lt(2*n+3)}. Plotis: ${lt(2*n+3)} − ${lt(n+3)} = `),
    (n) => task(`Nuo stačiakampio centro iki vienos viršūnės ${lt(n)} cm. Kokia abiejų įstrižainių ilgių suma centimetrais?`, 4*n, "Kiekvienoje įstrižainėje yra dvi tokios dalys.", `Viena įstrižainė ${lt(2*n)} cm. Abi kartu: 2 · ${lt(2*n)} = `),
  ]),
  "daugiakampiai-7": lesson("Rombas", "Ką gali sudėti iš keturių vienodo ilgio pagaliukų?", "Sudėjęs uždarą iškilą keturkampį gausi rombą. Jo įstrižainės kertasi statmenai, dalija viena kitą pusiau ir pusiau dalija viršūnių kampus.", [
    (n) => task(`Rombo kraštinė ${lt(n)} cm. Koks perimetras centimetrais?`, 4*n, "Keturios kraštinės lygios.", `4 · ${lt(n)} = `),
    (n) => task(`Rombo kampas ${lt(2*n+40)}°. Kiek laipsnių su kraštine sudaro iš tos viršūnės einanti įstrižainė?`, n+20, "Įstrižainė dalija kampą pusiau.", `${lt(2*n+40)} : 2 = `),
    (n) => task(`Nuo rombo centro iki dviejų gretimų viršūnių yra ${lt(n)} ir ${lt(n+3)} cm. Kokia įstrižainių ilgių suma centimetrais?`, 4*n+6, "Duoti dviejų skirtingų įstrižainių pusilgiai.", `Įstrižainės ${lt(2*n)} ir ${lt(2*n+6)} cm. Suma: ${lt(2*n)} + ${lt(2*n+6)} = `),
  ]),
  "daugiakampiai-8": lesson("Kvadratas", "Kas svarbu pjaunant kvadratinę plytelę?", "Jos keturios kraštinės lygios ir visi kampai statūs. Kvadratas turi ir rombo, ir stačiakampio savybių. Jo lygios įstrižainės kertasi statmenai savo vidurio taške.", [
    (n) => task(`Kvadrato perimetras ${lt(4*n)} cm. Kokia kraštinė centimetrais?`, n, "Keturios lygios kraštinės sudaro perimetrą.", `${lt(4*n)} : 4 = `),
    (n) => task(`Nuo kvadrato centro iki viršūnės ${lt(n)} cm. Kiek centimetrų yra įstrižainė?`, 2*n, "Centras dalija įstrižainę pusiau.", `${lt(n)} + ${lt(n)} = `),
    (n) => task(`Iš dviejų kvadratų, kurių kraštinės po ${lt(n)} cm, sudėtas stačiakampis. Koks jo perimetras centimetrais?`, 6*n, "Bendra kvadratų kraštinė yra viduje.", `Stačiakampio matmenys ${lt(2*n)} ir ${lt(n)} cm. Perimetras: 2 · (${lt(2*n)} + ${lt(n)}) = `),
  ]),
  "daugiakampiai-9": lesson("Trapecija", "Kaip vadinti keturkampį, kurio tik dvi priešingos kraštinės lygiagrečios?", "Tai trapecija. Lygiagrečios kraštinės – jos pagrindai, likusios dvi – šoninės kraštinės. Kampai prie tos pačios šoninės kraštinės kartu sudaro 180°.", [
    (n) => task(`Trapecijos pagrindai ${lt(n)} ir ${lt(n+4)} cm. Kokia jų suma centimetrais?`, 2*n+4, "Sudėk lygiagrečias kraštines.", `${lt(n)} + ${lt(n+4)} = `),
    (n) => task(`Pagrindai ${lt(n)} ir ${lt(n+3)} cm, šoninės kraštinės po 5 cm. Koks trapecijos perimetras centimetrais?`, 2*n+13, "Pereik visas keturias kraštines.", `${lt(n)} + ${lt(n+3)} + 5 + 5 = `),
    (n) => task(`Trapecijos kampas ${lt(55+n)}°. Koks kampas prie kito tos pačios šoninės kraštinės galo laipsniais?`, 125-n, "Šoninė kraštinė kerta lygiagrečius pagrindus.", `Vidaus vienašalių kampų suma 180°. Skaičiuojame: 180 − ${lt(55+n)} = `),
  ]),
  "daugiakampiai-10": lesson("Lygiašonė ir stačioji trapecijos", "Kaip atskirti dvi ypatingas trapecijas?", "Lygiašonės trapecijos šoninės kraštinės lygios, kaip ir kampai prie to paties pagrindo. Stačiojoje trapecijoje viena šoninė kraštinė statmena abiem pagrindams ir rodo aukštį.", [
    (n) => task(`Lygiašonės trapecijos viena šoninė kraštinė ${lt(n+2)} cm. Kiek centimetrų yra kita?`, n+2, "Žiūrėk į lygias šonines kraštines.", `Abi vienodo ilgio. Atsakymas – `),
    (n) => task(`Stačiosios trapecijos vienas nestatus kampas ${lt(40+n)}°. Koks kitas nestatus kampas laipsniais?`, 140-n, "Du statūs kampai kartu užima 180° iš 360°.", `Likusiems tenka 180°. Skaičiuojame: 180 − ${lt(40+n)} = `),
    (n) => task(`Lygiašonės trapecijos perimetras ${lt(4*n+6)} cm, pagrindai ${lt(n)} ir ${lt(n+6)} cm. Kiek centimetrų yra viena šoninė kraštinė?`, n, "Atimk abu pagrindus ir dalyk likutį pusiau.", `Abiem šoninėms lieka ${lt(2*n)} cm. Viena: ${lt(2*n)} : 2 = `),
  ]),
  "daugiakampiai-11": lesson("Daugiakampių postūmis koordinačių plokštumoje", "Kaip perkelti piešinį langeliais jo neiškreipiant?", "Visas viršūnes pastumk vienodai. Judant į dešinę didėja x, į viršų – y. Forma, kraštinių ilgiai ir kampai išlieka.", [
    (n) => task(`A(${lt(n)}; 2) pastumtas 3 vienetus į dešinę. Kokia nauja x koordinatė?`, n+3, "Horizontalus judesys keičia x.", `${lt(n)} + 3 = `),
    (n) => task(`B(4; −${lt(n)}) pastumtas 5 vienetus žemyn. Kokia nauja y koordinatė?`, -n-5, "Judant žemyn y mažėja.", `−${lt(n)} − 5 = `),
    (n) => task(`Po postūmio A(2; 1) tapo A′(${lt(n+2)}; 4). Taip pat perkelta B(−3; 2). Kokia nauja B taško x koordinatė?`, n-3, "Iš A koordinačių rask horizontalų poslinkį.", `Į dešinę paslinkta ${lt(n)} vienetų. Nauja x koordinatė: −3 + ${lt(n)} = `),
  ]),
};
