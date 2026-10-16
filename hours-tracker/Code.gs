/**
 * Valandų apskaita – backend (Google Apps Script bound to the Google Sheet).
 * Tabs: "Asmenys" (lookup) and "Log" (one row per submission).
 * 1) Set TOKEN below.  2) Run setup() once.  3) Deploy > Web app (Execute as: Me, Access: Anyone).
 */
const TOKEN = "CHANGE-ME";           // the PIN people type once on the page
const PEOPLE_TAB = "Asmenys";
const LOG_TAB = "Log";

function setup() {
  const ss = SpreadsheetApp.getActive();

  let p = ss.getSheetByName(PEOPLE_TAB) || ss.insertSheet(PEOPLE_TAB);
  if (p.getLastRow() === 0) {
    p.getRange(1, 1, 1, 4).setValues([["ID", "Vardas Pavardė", "Vaidmuo", "PĮP veiksmo numeris"]]);
    p.getRange(2, 1, 6, 4).setValues([
      ["irina_admin",   "Irina Burkauskienė",    "Admin",   "1.4.3"],
      ["irina_koord",   "Irina Burkauskienė",    "Koord.",  "1.2.1"],
      ["danguole",      "Danguolė Juškevičienė", "",        "1.3.2"],
      ["kristina_club", "Kristina Ulianskienė",  "Club LT", "1.1.4"],
      ["kristina_soc",  "Kristina Ulianskienė",  "Soc.",    "1.1.1"],
      ["savanoriai",    "Savanoriai",            "",        ""]
    ]);
    p.getRange(2, 1, 200, 4).setNumberFormat("@");   // keep "1.1.4" as text
    p.setFrozenRows(1);
  }

  let l = ss.getSheetByName(LOG_TAB) || ss.insertSheet(LOG_TAB);
  if (l.getLastRow() === 0) {
    l.getRange(1, 1, 1, 6).setValues([["Įrašyta", "Asmuo (ID)", "Data", "Nuo", "Iki", "Minutės"]]);
    l.getRange(2, 1, 5000, 5).setNumberFormat("@");  // dates/times stay plain text
    l.setFrozenRows(1);
  }
}

function doGet(e) { return out_(handle_(e.parameter || {})); }

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return out_({ ok: false, error: "bad request" }); }
  return out_(handle_(body));
}

function handle_(p) {
  if (p.token !== TOKEN) return { ok: false, error: "PIN" };
  if (p.action === "data") return readAll_();
  if (p.action === "add") return add_(p);
  return { ok: false, error: "unknown action" };
}

function readAll_() {
  const ss = SpreadsheetApp.getActive();
  const ps = ss.getSheetByName(PEOPLE_TAB), ls = ss.getSheetByName(LOG_TAB);
  const people = ps.getLastRow() < 2 ? [] :
    ps.getRange(2, 1, ps.getLastRow() - 1, 4).getDisplayValues()
      .filter(r => r[0])
      .map(r => ({ id: r[0], name: r[1], role: r[2], code: r[3] }));
  const log = ls.getLastRow() < 2 ? [] :
    ls.getRange(2, 1, ls.getLastRow() - 1, 6).getDisplayValues()
      .filter(r => r[1])
      .map(r => ({ person: r[1], date: r[2], from: r[3], to: r[4], min: Number(r[5]) || 0 }));
  return { ok: true, people: people, log: log };
}

function add_(p) {
  const time = /^([01]?\d|2[0-3]):[0-5]\d$/, date = /^\d{4}-\d{2}-\d{2}$/;
  if (!date.test(p.date) || !time.test(p.from) || !time.test(p.to)) return { ok: false, error: "bad values" };
  const toMin = s => { const a = s.split(":"); return +a[0] * 60 + +a[1]; };
  const mins = toMin(p.to) - toMin(p.from);
  if (mins <= 0) return { ok: false, error: "Iki turi būti vėlesnis nei Nuo" };

  const ids = readAll_().people.map(x => x.id);
  if (ids.indexOf(p.person) < 0) return { ok: false, error: "unknown person" };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(LOG_TAB);
    const row = sh.getLastRow() + 1;
    const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    sh.getRange(row, 1, 1, 5).setNumberFormat("@");
    sh.getRange(row, 1, 1, 6).setValues([[stamp, p.person, p.date, p.from, p.to, mins]]);
  } finally { lock.releaseLock(); }
  return { ok: true, min: mins };
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
