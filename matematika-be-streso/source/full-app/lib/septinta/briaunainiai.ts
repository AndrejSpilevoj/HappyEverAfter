import { lesson, lt, task } from './lesson';

export default {
  "briaunainiai-1": lesson("Tiesės ir plokštumos erdvėje", "Koks trumpiausias kelias nuo lempos iki grindų?", "Grindis įsivaizduok kaip plokštumą. Atstumą iki jos matuojame statmenai. Dvi tiesės erdvėje gali susikirsti, būti lygiagrečios arba būti prasilenkiančios – nesikirsti ir negulėti vienoje plokštumoje.", [
    (n) => task(`Lempa yra ${lt(n)} dm statmenai virš grindų. Koks atstumas iki grindų decimetrais?`, n, "Imk statmens ilgį.", `Trumpiausias kelias eina statmenai. Atsakymas – `),
    (n) => task(`Grindų ir lubų plokštumas skiria ${lt(n+4)} dm. Lentyna yra ${lt(n)} dm virš grindų. Koks atstumas iki lubų decimetrais?`, 4, "Atimk lentynos aukštį.", `${lt(n+4)} − ${lt(n)} = `),
    (n) => task(`Dėžės aukštis ${lt(n)} cm. Skruzdėlė kyla statmena briauna, nueina 5 cm viršutine siena ir nusileidžia kita statmena briauna. Kiek centimetrų įveikia?`, 2*n+5, "Abi vertikalios briaunos jungia tas pačias lygiagrečias plokštumas.", `Kelias: ${lt(n)} + 5 + ${lt(n)} = `),
  ]),
  "briaunainiai-2": lesson("Stačioji prizmė ir jos paviršius", "Ką iškirptum norėdamas sulankstyti dėžutę?", "Stačioji prizmė turi du vienodus daugiakampius pagrindus. Prie kiekvienos pagrindo kraštinės jungiasi stačiakampė šoninė siena. Išskleistų šonų bendras plotis lygus pagrindo perimetrui.", [
    (n) => task(`Prizmės pagrindas turi ${lt(n+2)} kraštines. Kiek ji turi šoninių sienų?`, n+2, "Kiekvienai pagrindo kraštinei tenka viena siena.", `Šoninių sienų tiek pat, kiek kraštinių. Atsakymas – `),
    (n) => task(`Stačiosios prizmės pagrindo perimetras ${lt(3*n)} cm, aukštis 4 cm. Koks šoninio paviršiaus plotas cm²?`, 12*n, "Išklotinės bendras plotis yra pagrindo perimetras.", `${lt(3*n)} · 4 = `),
    (n) => task(`Stačiosios prizmės pagrindas yra ${lt(n)} cm ir 3 cm kraštinių stačiakampis. Aukštis 5 cm. Koks viso paviršiaus plotas cm²?`, 16*n+30, "Prie šoninio ploto pridėk du pagrindus.", `Du pagrindai užima ${lt(6*n)} cm². Šonai 2 · (${lt(n)} + 3) · 5 = ${lt(10*n+30)} cm². Suma: ${lt(6*n)} + ${lt(10*n+30)} = `),
  ]),
  "briaunainiai-3": lesson("Stačiosios prizmės tūris", "Kiek sluoksnių telpa dėžėje?", "Pagrindo plotas pasako, kiek vienetinių kubelių telpa pirmame sluoksnyje. Aukštis parodo tokių sluoksnių skaičių. Tūris V = pagrindo plotas · aukštis.", [
    (n) => task(`Pagrindo plotas ${lt(n)} cm², prizmės aukštis 4 cm. Koks tūris cm³?`, 4*n, "Daugink sluoksnio plotą iš aukščio.", `${lt(n)} · 4 = `),
    (n) => task(`Prizmės tūris ${lt(6*n)} cm³, pagrindo plotas 6 cm². Koks aukštis centimetrais?`, n, "Tūrį dalyk iš pagrindo ploto.", `${lt(6*n)} : 6 = `),
    (n) => task(`Prizmės pagrindas – statusis trikampis, kurio statiniai 4 ir ${lt(n)} cm. Prizmės aukštis 3 cm. Koks tūris cm³?`, 6*n, "Pirma rask trikampio plotą.", `Pagrindo plotas 4 · ${lt(n)} : 2 = ${lt(2*n)} cm². Tūris: ${lt(2*n)} · 3 = `),
  ]),
  "briaunainiai-4": lesson("Piramidė ir jos sandara", "Kuo palapinė su viena viršūne skiriasi nuo dėžės?", "Piramidė turi vieną daugiakampį pagrindą. Kiekviena pagrindo kraštinė su viršūne sudaro trikampę šoninę sieną. Aukštinė leidžiasi nuo viršūnės statmenai į pagrindo plokštumą.", [
    (n) => task(`Piramidės pagrindas turi ${lt(n+2)} kraštines. Kiek yra šoninių trikampių?`, n+2, "Kiekviena pagrindo kraštinė priklauso vienai šoninei sienai.", `Šoninių trikampių tiek pat, kiek pagrindo kraštinių. Atsakymas – `),
    (n) => task(`Piramidės pagrindas turi ${lt(n+2)} viršūnes. Kiek briaunų turi visa piramidė?`, 2*(n+2), "Įskaičiuok pagrindo briaunas ir briaunas iki viršūnės.", `Pagrinde yra ${lt(n+2)} briaunos, į viršūnę eina dar tiek pat. Suma: 2 · ${lt(n+2)} = `),
    (n) => task(`Piramidė turi ${lt(n+4)} sienas, įskaitant pagrindą. Kiek iš viso jos briaunų?`, 2*(n+3), "Atimk vieną pagrindą.", `Lieka ${lt(n+3)} šoninės sienos. Tiek briaunų yra pagrinde ir tiek šonuose. Iš viso: 2 · ${lt(n+3)} = `),
  ]),
  "briaunainiai-5": lesson("Taisyklingoji piramidė", "Kaip simetriškai uždengti kvadratinį pagrindą keturiais trikampiais?", "Taisyklingosios piramidės pagrindas yra taisyklingasis daugiakampis, šoninės sienos – lygūs lygiašoniai trikampiai. Šoninės sienos aukštinė vadinama apotema. Ji eina siena iki pagrindo kraštinės vidurio. Piramidės aukštinė eina viduje iki pagrindo centro.", [
    (n) => task(`Kvadratinės taisyklingosios piramidės vienos šoninės sienos plotas ${lt(n)} cm². Koks keturių šonų plotas cm²?`, 4*n, "Visi keturi trikampiai vienodi.", `4 · ${lt(n)} = `),
    (n) => task(`Taisyklingosios keturkampės piramidės pagrindo kraštinė ${lt(2*n)} cm, apotema ${lt(2*n+1)} cm. Koks vienos šoninės sienos plotas cm²?`, n*(2*n+1), "Apotema yra šoninio trikampio aukštinė.", `${lt(2*n)} · ${lt(2*n+1)} : 2 = `),
    (n) => task(`Kvadratinės taisyklingosios piramidės pagrindo kraštinė ir apotema po ${lt(2*n)} cm. Koks viso paviršiaus plotas cm²?`, 12*n*n, "Prie keturių trikampių pridėk kvadratą.", `Pagrindas užima ${lt(4*n*n)} cm². Keturi trikampiai užima ${lt(8*n*n)} cm². Suma: ${lt(4*n*n)} + ${lt(8*n*n)} = `),
  ]),
};
