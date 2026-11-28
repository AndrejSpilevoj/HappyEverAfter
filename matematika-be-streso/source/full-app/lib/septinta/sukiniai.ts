import { lesson, lt, task } from './lesson';

export default {
  "sukiniai-1": lesson("Ritinys", "Ką nubrėžtų durys, jei apsisuktų aplink vyrį visą ratą?", "Stačiakampiui sukantis apie jo kraštinę susidaro ritinys. Kraštinė prie sukimosi ašies tampa aukščiu. Atstumas nuo ašies iki priešingo krašto tampa pagrindo spinduliu.", [
    (n) => task(`Stačiakampis yra ${lt(n)} cm pločio ir 4 cm aukščio. Sukame apie vertikalią kraštinę. Koks ritinio spindulys centimetrais?`, n, "Matuok nuo ašies skersai stačiakampio.", `Nuo ašies iki tolimo krašto yra visas plotis. Atsakymas – `),
    (n) => task(`Stačiakampis sukamas apie ${lt(n+2)} cm kraštinę. Kita kraštinė ${lt(n)} cm. Koks ritinio skersmuo centimetrais?`, 2*n, "Kita kraštinė tampa spinduliu.", `r = ${lt(n)} cm. Skersmuo: 2 · ${lt(n)} = `),
    (n) => task(`Stačiakampio kraštinės ${lt(n)} ir ${lt(2*n)} cm. Sukimosi ašį pakeitus iš ilgosios kraštinės į trumpąją, kiek centimetrų padidėja skersmuo?`, 2*n, "Abiem atvejais rask atstumą iki ašies.", `Pirmas skersmuo ${lt(2*n)}, antras ${lt(4*n)} cm. Skirtumas: ${lt(4*n)} − ${lt(2*n)} = `),
  ]),
  "sukiniai-2": lesson("Ritinio paviršiaus plotas ir tūris", "Kiek popieriaus reikia skardinės etiketei?", "Nuimta etiketė išsitiesia į stačiakampį. Jo ilgis yra pagrindo apskritimo ilgis, plotis – ritinio aukštis. Visam paviršiui dar pridėk abu skritulius. Tūriui pagrindo plotą daugink iš aukščio.", [
    (n) => task(`Ritinio pagrindo plotas ${lt(n)} cm², aukštis 5 cm. Koks tūris cm³?`, 5*n, "Daugink pagrindo plotą iš aukščio.", `${lt(n)} · 5 = `),
    (n) => task(`Spindulys ${lt(n)} cm, aukštis 3 cm. Koks daugiklis prie π ritinio šoninio paviršiaus plote cm²?`, 6*n, "Etiketės ilgis yra 2πr.", `Šoninis plotas 2π · ${lt(n)} · 3. Daugiklis: 2 · ${lt(n)} · 3 = `),
    (n) => task(`Ritinio spindulys ${lt(n)} cm, aukštis 4 cm. Koks daugiklis prie π viso paviršiaus plote cm²?`, 2*n*n+8*n, "Sudėk dviejų pagrindų ir etiketės plotus.", `Pagrindai sudaro ${lt(2*n*n)}π, šonas ${lt(8*n)}π cm². Daugiklių suma: ${lt(2*n*n)} + ${lt(8*n)} = `),
  ]),
  "sukiniai-3": lesson("Kūgis", "Ką nubrėžtų besisukantis statusis trikampis?", "Sukant apie vieną statinį susidaro kūgis. Tas statinis tampa aukštine, kitas – pagrindo spinduliu. Įžambinė brėžia šoninį paviršių ir vadinama kūgio sudaromąja.", [
    (n) => task(`Trikampis sukamas apie 5 cm statinį. Kitas statinis ${lt(n)} cm. Koks kūgio spindulys centimetrais?`, n, "Spindulys eina nuo ašies iki pagrindo krašto.", `Kitas statinis yra atstumas nuo ašies iki krašto. Atsakymas – `),
    (n) => task(`Kūgio ašinio pjūvio trikampio pagrindas ${lt(2*n)} cm. Koks kūgio spindulys centimetrais?`, n, "Pjūvis per ašį apima visą skersmenį.", `r = ${lt(2*n)} : 2 = `),
    (n) => task(`Kūgio ašinio pjūvio lygiašonio trikampio perimetras ${lt(8*n)} cm, pagrindo skersmuo ${lt(2*n)} cm. Kokia sudaromoji centimetrais?`, 3*n, "Pjūvio šoninės kraštinės – dvi vienodos sudaromosios.", `Joms lieka ${lt(8*n)} − ${lt(2*n)} = ${lt(6*n)} cm. Viena: ${lt(6*n)} : 2 = `),
  ]),
  "sukiniai-4": lesson("Kūgio paviršiaus plotas ir tūris", "Kiek telpa į kūgį, palyginti su tokio pat aukščio ir pagrindo ritiniu?", "Trimis tokiais kūgiais vandens pripildytum ritinį. Todėl V = πr²h / 3. Šono išklotinė yra skritulio išpjova, kurios plotas πrl. Čia l – sudaromoji. Uždaram kūgiui dar reikia pagrindo.", [
    (n) => task(`Kūgio pagrindo plotas ${lt(3*n)} cm², aukštis 3 cm. Koks tūris cm³?`, 3*n, "Sandaugą padalyk iš trijų.", `${lt(3*n)} · 3 : 3 = `),
    (n) => task(`Kūgio spindulys ${lt(n)} cm, sudaromoji ${lt(n+4)} cm. Koks daugiklis prie π šoninio paviršiaus plote cm²?`, n*(n+4), "Šonui naudok πrl.", `Daugiklis: ${lt(n)} · ${lt(n+4)} = `),
    (n) => task(`Kūgio spindulys ${lt(n)} cm, sudaromoji ${lt(2*n)} cm. Koks daugiklis prie π viso paviršiaus plote cm²?`, 3*n*n, "Pridėk pagrindą prie šoninio ploto.", `Pagrindas ${lt(n*n)}π, šonas ${lt(2*n*n)}π cm². Daugiklių suma: ${lt(n*n)} + ${lt(2*n*n)} = `),
  ]),
};
