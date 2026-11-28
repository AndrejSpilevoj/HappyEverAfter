import { lesson, lt, task } from './lesson';

export default {
  "nelygybes-1": lesson("4.1. Skaičių palyginimas", "Kur šilčiau, kai abiejose vietose šąla?", "Skaičių tiesėje didesnis skaičius yra dešiniau. Iš dviejų neigiamų temperatūrų didesnė ta, kuri arčiau nulio.", [
    (n) => task(`Kuris didesnis: −${lt(n)} ar ${lt(n+1)}?`, n+1, "Teigiamas skaičius yra dešiniau už nulį.", `−${lt(n)} < 0, todėl didesnis skaičius – `),
    (n) => task(`Kuris mažesnis: −${lt(n+3)} ar −${lt(n)}?`, -n-3, "Toliau į kairę reiškia mažiau.", `Trimis vienetais kairiau už −${lt(n)} yra skaičius – `),
    (n) => task(`Kiek sveikųjų skaičių yra griežtai tarp −${lt(n)} ir ${lt(n+2)}?`, 2*n+1, "Galų neskaičiuok.", `Atstumas tarp galų ${lt(2*n+2)}. Vidinių sveikųjų skaičius: ${lt(2*n+2)} − 1 = `),
  ]),
  "nelygybes-2": lesson("4.2. Skaičių intervalai", "Ar į intervalą įeina jo galas?", "Laužtinis skliaustas galą įtraukia, apvalus jį praleidžia. Tiesėje įtrauktą galą žymėk pilnu tašku, praleistą – tuščiu.", [
    (n) => task(`Koks mažiausias skaičius intervale [${lt(n)}; ${lt(n+6)})?`, n, "Kairysis galas uždaras.", `Į intervalą įeina kairysis galas – `),
    (n) => task(`Koks didžiausias sveikasis skaičius intervale (−${lt(n)}; ${lt(n+5)})?`, n+4, "Dešinysis galas neįeina.", `Paskutinis sveikasis: ${lt(n+5)} − 1 = `),
    (n) => task(`Kiek sveikųjų skaičių priklauso intervalui (−${lt(n)}; ${lt(n+4)}]?`, 2*n+4, "Pirmasis yra vienetu didesnis už kairįjį galą.", `Skaičiuojame nuo ${lt(1-n)} iki ${lt(n+4)} imtinai: ${lt(n+4)} − (${lt(1-n)}) + 1 = `),
  ]),
  "nelygybes-3": lesson("4.3. Prie abiejų nelygybės pusių pridedame arba iš jų atimame tą patį skaičių", "Kas nutinka dviem žmonėms užlipus ant vienodo aukščio laiptelio?", "Abu pakyla tiek pat. Jų ūgių skirtumas išlieka. Taip ir abiejose nelygybės pusėse pridėjus arba atėmus tą patį skaičių ženklas išlieka.", [
    (n) => task(`Prie abiejų pusių ${lt(n)} < ${lt(n+4)} pridėk 3. Koks naujas dešinysis skaičius?`, n+7, "Padidink ir dešinę pusę.", `${lt(n+4)} + 3 = `),
    (n) => task(`Iš abiejų pusių x + ${lt(n)} < ${lt(3*n)} atimk ${lt(n)}. Užbaik x < □.`, 2*n, "Kairėje priešingi dėmenys susiprastina.", `Dešinėje lieka ${lt(3*n)} − ${lt(n)} = `),
    (n) => task(`Iš x − ${lt(n)} ≥ ${lt(n+4)} gauk x ≥ □. Ką įrašysi?`, 2*n+4, "Pridėk tą patį skaičių abiejose pusėse.", `Dešinėje gauname ${lt(n+4)} + ${lt(n)} = `),
  ]),
  "nelygybes-4": lesson("4.4. Abi nelygybės puses dauginame arba dalijame iš to paties skaičiaus", "Kodėl dauginant iš minus vieneto apsiverčia ženklas?", "Priešingi skaičiai yra tarsi atspindžiai kitoje nulio pusėje. Kas buvo dešiniau, atsiduria kairiau. Dauginant ar dalijant iš teigiamo skaičiaus tvarka išlieka.", [
    (n) => task(`Padaugink abi puses 2 < ${lt(n+2)} iš 3. Koks naujas dešinysis skaičius?`, 3*(n+2), "Teigiamas daugiklis ženklo nekeičia.", `${lt(n+2)} · 3 = `),
    (n) => task(`Padalyk abi puses −2x < ${lt(2*n)} iš −2. Įrašyk ribą x > □.`, -n, "Dalijant iš neigiamo skaičiaus apversk ženklą.", `Dešinėje gauname ${lt(2*n)} : (−2) = `),
    (n) => task(`Koks didžiausias sveikasis sprendinys, jei −3x > −${lt(3*n)}?`, n-1, "Po dalybos patikrink, ar pati riba įeina.", `x < ${lt(n)}. Didžiausias sveikasis: ${lt(n)} − 1 = `),
  ]),
  "nelygybes-5": lesson("4.5. Nelygybės sprendinys", "Kaip patikrinti, ar skaičius tinka?", "Į raidės vietą įrašyk pasirinktą skaičių. Jei palyginimas teisingas, radai vieną nelygybės sprendinį.", [
    (n) => task(`Kuris iš skaičių ${lt(n)} ir ${lt(n+2)} tenkina x > ${lt(n+1)}?`, n+2, "Ieškok skaičiaus dešiniau ribos.", `${lt(n)} per mažas. Tinka – `),
    (n) => task(`Kuris iš skaičių ${lt(n-1)} ir ${lt(n+1)} tenkina 2x ≥ ${lt(2*n)}?`, n+1, "Abu kandidatus išbandyk padauginęs iš dviejų.", `Gauname ${lt(2*n-2)} ir ${lt(2*n+2)}. Tik antroji sandauga pasiekia ribą, todėl x – `),
    (n) => task(`Iš sveikųjų skaičių nuo 0 iki ${lt(2*n)} kiek tenkina x + 3 < ${lt(n+3)}?`, n, "Atimk 3 iš abiejų pusių.", `x < ${lt(n)}. Tinka nuo 0 iki ${lt(n-1)}. Jų skaičius: ${lt(n-1)} + 1 = `),
  ]),
  "nelygybes-6": lesson("4.6. Sprendžiame vieno žingsnio nelygybes", "Kiek daugiausia gali išleisti, jei dar reikia pinigų bilietui?", "Bilieto kainą atimk iš turimos sumos. Atvirkštinis veiksmas padeda ir nelygybėje: atlik jį abiejose pusėse, kad liktų vienas x.", [
    (n) => task(`x + 4 ≤ ${lt(n+4)}. Koks didžiausias leistinas x?`, n, "Atimk keturis.", `Didžiausia leidžiama reikšmė: ${lt(n+4)} − 4 = `),
    (n) => task(`3x > ${lt(3*n)}. Koks mažiausias sveikasis sprendinys?`, n+1, "Po dalybos riba išlieka griežta.", `x > ${lt(n)}. Pirmas sveikasis už ribos: ${lt(n)} + 1 = `),
    (n) => task(`−x ≥ ${lt(n)}. Koks didžiausias sveikasis sprendinys?`, -n, "Daugink abi puses iš −1.", `Gauname x ≤ −${lt(n)}. Įtraukta viršutinė riba – `),
  ]),
  "nelygybes-7": lesson("4.7. Sprendžiame paprastas nelygybes", "Kaip rasti prekės kainą, kai į sumą įskaičiuotas pristatymas?", "Pirmiausia atimk pristatymo mokestį. Likutį dalyk iš vienodų prekių skaičiaus. Nelygybėje tuos pačius veiksmus atlik abiejose pusėse.", [
    (n) => task(`2x + 3 ≤ ${lt(2*n+3)}. Koks didžiausias x?`, n, "Pirma atimk 3, tada dalyk iš 2.", `2x ≤ ${lt(2*n)}. Viršutinė riba: ${lt(2*n)} : 2 = `),
    (n) => task(`3x − 4 > ${lt(3*n-4)}. Koks mažiausias sveikasis x?`, n+1, "Pridėk 4 ir padalyk iš 3.", `Gauname x > ${lt(n)}. Pirmas sveikasis: ${lt(n)} + 1 = `),
    (n) => task(`5 − 2x < ${lt(5-2*n)}. Koks mažiausias sveikasis x?`, n+1, "Atimk 5, tada dalyk iš neigiamo skaičiaus.", `−2x < −${lt(2*n)}. Po dalybos x > ${lt(n)}. Mažiausias sveikasis: ${lt(n)} + 1 = `),
  ]),
  "nelygybes-8": lesson("4.8. Sprendžiame sudėtingesnes nelygybes", "Kaip palyginti du pasiūlymus, jei abu priklauso nuo kiekio?", "Išskleisk skliaustus. Tada iš abiejų pusių atimk tiek pat x, kad vienoje pusėje liktų vien skaičiai.", [
    (n) => task(`2(x + 1) ≤ ${lt(2*n+2)}. Kokia didžiausia x reikšmė?`, n, "Abi puses padalyk iš 2.", `x + 1 ≤ ${lt(n+1)}. Viršutinė riba: ${lt(n+1)} − 1 = `),
    (n) => task(`3x + 2 < x + ${lt(2*n+2)}. Koks didžiausias sveikasis x?`, n-1, "Atimk x ir 2 iš abiejų pusių.", `Lieka 2x < ${lt(2*n)}. Taigi x < ${lt(n)}. Didžiausias sveikasis: ${lt(n)} − 1 = `),
    (n) => task(`3(x − 2) ≥ x + ${lt(2*n-6)}. Koks mažiausias sveikasis x?`, n, "Tris kartus daugink abu dėmenis skliaustuose.", `3x − 6 ≥ x + ${lt(2*n-6)}. Lieka 2x ≥ ${lt(2*n)}. Mažiausias x: ${lt(2*n)} : 2 = `),
  ]),
  "nelygybes-9": lesson("4.9. Dviejų nelygybių su vienu nežinomuoju sistema", "Kas gali dalyvauti, jei reikia atitikti abi sąlygas?", "Įsivaizduok du filtrus. Skaičius turi praeiti pro abu. Sprendinių aibę sudaro abiejų sprendinių aibių bendroji dalis.", [
    (n) => task(`Reikia x ≥ ${lt(n)} ir x ≥ ${lt(n+4)}. Kokia mažiausia tinkama reikšmė?`, n+4, "Rinkis griežtesnę apatinę ribą.", `Mažesni skaičiai netenkina antros sąlygos. Pirmas tinkantis – `),
    (n) => task(`Reikia x > ${lt(n)} ir x ≤ ${lt(2*n)}. Kiek yra sveikųjų sprendinių?`, n, "Kairysis galas neįeina, dešinysis įeina.", `Nuo ${lt(n+1)} iki ${lt(2*n)} imtinai: ${lt(2*n)} − ${lt(n+1)} + 1 = `),
    (n) => task(`Reikia 2x ≥ ${lt(2*n)} ir x + 3 < ${lt(2*n+5)}. Kiek yra sveikųjų sprendinių?`, n+2, "Kiekvieną nelygybę išspręsk atskirai.", `x ≥ ${lt(n)} ir x < ${lt(2*n+2)}. Nuo ${lt(n)} iki ${lt(2*n+1)} yra ${lt(2*n+1)} − ${lt(n)} + 1 = `),
  ]),
  "nelygybes-10": lesson("4.10. Dvigubųjų nelygybių sprendimas", "Kaip vienu užrašu nurodyti dvi ribas?", "Užrašas 2 ≤ x < 5 sako, kad x bent 2 ir kartu mažesnis už 5. Keisdamas nelygybę tą patį veiksmą atlik visose trijose dalyse.", [
    (n) => task(`${lt(n)} ≤ x < ${lt(n+5)}. Koks mažiausias sveikasis x?`, n, "Ženklas ≤ leidžia lygybę.", `Kairysis galas tinka, tad mažiausias x – `),
    (n) => task(`${lt(n+2)} ≤ x + 2 < ${lt(2*n+2)}. Koks didžiausias sveikasis x?`, 2*n-1, "Iš visų trijų dalių atimk 2.", `${lt(n)} ≤ x < ${lt(2*n)}. Paskutinis tinkantis sveikasis: ${lt(2*n)} − 1 = `),
    (n) => task(`−${lt(4*n)} < −2x ≤ −${lt(2*n)}. Kiek sveikųjų x tinka?`, n, "Dalyba iš −2 apverčia abu ženklus.", `${lt(2*n)} > x ≥ ${lt(n)}. Tinka nuo ${lt(n)} iki ${lt(2*n-1)}. Jų skaičius: ${lt(2*n)} − ${lt(n)} = `),
  ]),
  "nelygybes-11": lesson("4.11. Sprendžiame tekstinius uždavinius", "Ar pinigų užteks dar vienam bilietui?", "Žodžiai „ne daugiau“ leidžia pasiekti ribą. „Mažiau“ jos pasiekti neleidžia. Kai skaičiuoji žmones ar daiktus, gale pasirink sveikąjį skaičių.", [
    (n) => task(`Turi ${lt(3*n+2)} €. Bilietas kainuoja 3 €. Kiek daugiausia bilietų gali nupirkti?`, n, "Likusiais dviem eurais bilieto nenupirksi.", `${lt(3*n+2)} = 3 · ${lt(n)} + 2. Bilietų skaičius – `),
    (n) => task(`Siuntimas kainuoja 4 €, sąsiuvinis 2 €. Kiek daugiausia sąsiuvinių gali užsakyti už ${lt(2*n+5)} €?`, n, "Pirma atidėk pinigų siuntimui.", `Lieka ${lt(2*n+1)} €. Nupirkus sąsiuvinius liks 1 €. Jų skaičius: ${lt(2*n)} : 2 = `),
    (n) => task(`Kiek mažiausiai 6 vietų automobilių reikia ${lt(6*n+1)} žmogui? Vairuotojai įskaičiuoti.`, n+1, "Patikrink, ar dalybos liekanai reikia dar vieno automobilio.", `${lt(n)} automobiliai sutalpintų ${lt(6*n)} žmonių. Dar vienam reikia vietos, tad automobilių: ${lt(n)} + 1 = `),
  ]),
};
