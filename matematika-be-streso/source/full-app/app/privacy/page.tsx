export const metadata = { title: 'Privatumas | Matematika be streso' };

export default function PrivacyPage() {
 return <main style={{maxWidth:760,margin:'48px auto',padding:'32px',background:'rgba(255,255,255,.9)',borderRadius:24,lineHeight:1.7,color:'#18314b'}}>
  <a href="/">← Matematika be streso</a>
  <h1>Privatumo informacija</h1>
  <p>Ši svetainė skirta vaizdo pamokoms ir privačiam mokinio bendravimui su mokytoju. Kontaktas dėl duomenų: <a href="mailto:andrej.spilevoj@gmail.com">andrej.spilevoj@gmail.com</a>.</p>
  <h2>Mokinio erdvė</h2>
  <p>Mokytojas įrašo mokinio vardą ir, jei pateikiamas, mokinio arba vieno iš tėvų el. pašto adresą. Svetainė saugo paskirtas užduotis, žinutes, atsakymus ir įkeltų failų informaciją. Kiekvienas mokinys gali pasiekti tik jam priskirtas užduotis ir savo pokalbius.</p>
  <h2>Kur laikomi failai</h2>
  <p>Nuotraukos, garso ir vaizdo įrašai laikomi privačiame mokytojo Google Drive aplanke. Įkeliant ir atidarant failus, duomenys perduodami per svetainės Cloudflare serverį. Svetainė nesukuria viešų Google Drive nuorodų. Mokiniui nereikia Google paskyros.</p>
  <h2>Mokytojo Google prisijungimas</h2>
  <p>Google prisijungimas naudojamas mokytojo tapatybei patikrinti ir svetainės failų saugyklai prijungti. Svetainė prašo tik prieigos prie konkrečių Google Drive failų, naudojamų su šia programa. Ilgalaikis Google prieigos raktas saugomas užšifruotas serveryje ir nėra perduodamas mokiniams ar jų naršyklėms. Prieigą galima atšaukti Google paskyros nustatymuose; tuomet failų įkėlimą reikės prijungti iš naujo.</p>
  <h2>Prisijungimo slapukai</h2>
  <p>Mokinio prisijungimas prisimenamas iki 90 dienų, mokytojo – iki 7 dienų. Google prisijungimo patvirtinimo slapukas galioja iki 10 minučių. Šie slapukai reikalingi prisijungimui; jie nenaudojami reklamai. Viešame ar bendrame įrenginyje baigę darbą atsijunkite.</p>
  <h2>El. paštas ir vaizdo pamokos</h2>
  <p>Jei pranešimų siuntimas įjungtas, apie naują užduotį ar atsakymą gali būti pranešta pateiktu el. pašto adresu per mokytojo Gmail paskyrą. Pranešimų siuntimui mokytojas atskirai suteikia Gmail leidimą siųsti laiškus; svetainė neskaito ir netrina pašto dėžutės laiškų. Siuntimo prieigos raktas serveryje laikomas užšifruotas. Prisijungimo kodai ir sprendimų failai el. laiškuose nesiunčiami. Pamokų vaizdo įrašus teikia YouTube; paleidus įrašą duomenis taip pat tvarko Google / YouTube pagal savo privatumo taisykles.</p>
  <h2>Duomenų tvarkymas</h2>
  <p>Užduočių ir pokalbių duomenys naudojami mokymui bei svetainės veikimui. Jie neparduodami ir nenaudojami reklamai. Cloudflare gali saugoti techninius užklausų žurnalus. Dėl duomenų peržiūros, patikslinimo ar pašalinimo parašykite mokytojui aukščiau nurodytu adresu.</p>
  <p style={{fontSize:14}}>Atnaujinta 2026-11-14.</p>
 </main>;
}
