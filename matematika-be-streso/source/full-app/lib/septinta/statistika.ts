import { lesson, lt, task } from './lesson';

export default {
  "statistika-1": lesson("Populiacija ir tyrimo klausimas", "Kieno atsakymų reikia, kad sužinotum, kaip septintokai keliauja į mokyklą?", "Pirma įvardyk grupę, apie kurią nori ką nors sužinoti. Ji vadinama populiacija. Jos dydis yra grupės narių skaičius. Klausimas turi aiškiai nusakyti, ką apie kiekvieną narį sužinosi.", [
    (n) => task(`Tiriama visa klasė, kurioje ${lt(n+10)} mokinių. Koks populiacijos dydis?`, n+10, "Įtrauk visus klasės mokinius.", `Tiriama visa klasė. Jos narių skaičius – `),
    (n) => task(`Tiriamos dvi septintos klasės. Vienoje ${lt(n+8)}, kitoje ${lt(n+10)} mokinių. Koks populiacijos dydis?`, 2*n+18, "Įtrauk abi nesikertančias grupes.", `${lt(n+8)} + ${lt(n+10)} = `),
    (n) => task(`Tyrimo tikslas – sužinoti visų mokyklos septintokų miego trukmę. Mokykloje ${lt(5*n+60)} mokinių, iš jų ${lt(4*n+40)} kitų klasių. Atsakė tik 10 septintokų. Koks populiacijos dydis?`, n+20, "Skaičiuok visus septintokus, net jei atsakė tik dalis.", `Iš visų mokinių atimk kitų klasių mokinius: ${lt(5*n+60)} − ${lt(4*n+40)} = `),
  ]),
  "statistika-2": lesson("Imtis ir paprastoji atsitiktinė atranka", "Kaip apklausti dalį mokinių suteikiant kiekvienam vienodą galimybę?", "Sunumeruok mokinius ir atsitiktinai ištrauk skirtingus numerius. Atrinktoji grupė yra imtis. Paprastojoje atsitiktinėje atrankoje kiekviena tokio pat dydžio grupė turi vienodą galimybę patekti į tyrimą.", [
    (n) => task(`Iš 100 mokinių burtų keliu atrinkta ${lt(n)} mokinių. Koks imties dydis?`, n, "Skaičiuok atrinktus mokinius.", `Imtį sudaro tik ištrauktų numerių savininkai. Atsakymas – `),
    (n) => task(`Iš ${lt(5*n)} mokinių apklaustas kas penktas pagal sąrašą. Koks gautos imties dydis?`, n, "Imama penktadalis grupės.", `${lt(5*n)} : 5 = `),
    (n) => task(`Iš ${lt(10*n)} mokinių paprastąja atsitiktine atranka parenkama ${lt(2*n)} skirtingų mokinių. Kiek procentų populiacijos sudaro imtis?`, 20, "Imties dydį dalyk iš populiacijos dydžio.", `${lt(2*n)} : ${lt(10*n)} · 100 = `),
  ]),
  "statistika-3": lesson("Sisteminė ir sluoksninė atranka", "Kaip iš ilgo sąrašo atrinkti žmones nepraleidžiant mažos grupės?", "Sisteminei atrankai pasirink atsitiktinę pradžią ir toliau imk kas kelintą narį tuo pačiu žingsniu. Sluoksninei atrankai padalyk žmones į grupes ir iš kiekvienos atskirai atsitiktinai atrink dalį žmonių.", [
    (n) => task(`Atrenkamas kas ketvirtas mokinys. Pasirinktas numeris ${lt(n)}. Koks bus kitas numeris?`, n+4, "Atrankos žingsnis yra 4.", `${lt(n)} + 4 = `),
    (n) => task(`Iš ${lt(6*n)} sąrašo narių norima atrinkti ${lt(n)} vienodais tarpais. Koks atrankos žingsnis?`, 6, "Visą sąrašo ilgį dalyk iš imties dydžio.", `${lt(6*n)} : ${lt(n)} = `),
    (n) => task(`Dviejuose sluoksniuose yra ${lt(4*n)} ir ${lt(6*n)} žmonių. Iš kiekvieno atsitiktinai atrenkama pusė. Kiek žmonių bus visoje imtyje?`, 5*n, "Suskaičiuok atrinktus kiekviename sluoksnyje.", `Iš pirmo atrenkama ${lt(2*n)}, iš antro ${lt(3*n)}. Suma: ${lt(2*n)} + ${lt(3*n)} = `),
  ]),
  "statistika-4": lesson("Statistinis kintamasis", "Kuo skiriasi atsakymai „mėlyna“ ir „12 minučių“?", "Kintamasis yra savybė, kurią stebi. Spalva ar transporto rūšis nusako kategoriją – tai kokybinis kintamasis. Trukmė ar daiktų skaičius išreiškia kiekį – tai kiekybinis kintamasis. Dažnis parodo, kiek kartų užfiksuota reikšmė.", [
    (n) => task(`Apklausoje ${lt(n)} mokinių atsakė „pėsčiomis“, 3 atsakė „autobusu“. Koks kategorijos „pėsčiomis“ dažnis?`, n, "Dažnis – vienos kategorijos atsakymų skaičius.", `Atsakymą „pėsčiomis“ pasirinko tiek mokinių. Dažnis – `),
    (n) => task(`Užrašyta kelionės trukmė: ${lt(n)}, ${lt(n+4)} ir ${lt(n+8)} min. Kiek minučių skiriasi didžiausia ir mažiausia reikšmės?`, 8, "Trukmė yra kiekybinis kintamasis. Palygink kraštines reikšmes.", `${lt(n+8)} − ${lt(n)} = `),
    (n) => task(`Tyrime dalyvavo ${lt(4*n)} mokinių. Dviračiu atvažiavo ${lt(n)}, likusieji atėjo pėsčiomis. Koks santykinis kategorijos „pėsčiomis“ dažnis procentais?`, 75, "Šios kategorijos dažnį dalyk iš visų atsakymų skaičiaus.", `Pėsčiomis atėjo ${lt(3*n)}. Santykinis dažnis procentais: ${lt(3*n)} : ${lt(4*n)} · 100 = `),
  ]),
  "statistika-5": lesson("Skritulinė diagrama", "Kaip picos skiltelė gali parodyti apklausos atsakymus?", "Visas skritulys vaizduoja visus atsakymus, t. y. 100 % ir 360°. Pusė atsakymų užima pusę skritulio – 180°. Bet kurios grupės dalį padaugink iš 360° ir gausi jos išpjovos kampą.", [
    (n) => task(`Diagramoje pusė iš ${lt(2*n)} atsakymų skirta plaukimui. Kiek mokinių pasirinko plaukimą?`, n, "Pusė reiškia dvi vienodas dalis.", `${lt(2*n)} : 2 = `),
    (n) => task(`Iš 100 mokinių muziką pasirinko ${lt(5*n)}. Kokio dydžio jų išpjovos kampas laipsniais?`, 18*n, "Visą 360° kampą daugink iš mokinių dalies.", `360 · ${lt(5*n)} : 100 = `),
    (n) => task(`Iš ${lt(8*n)} apklaustųjų vienos grupės išpjova sudaro 135°. Kiek žmonių toje grupėje?`, 3*n, "Palygink 135° su 360°.", `135 : 360 = 3/8. Grupės dydis: ${lt(8*n)} · 3 : 8 = `),
  ]),
};
