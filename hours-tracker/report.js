// Helpers + report builder. Works in the browser (window.Tracker) and in Node (require).
(function (root) {
  const MONTHS_LT = ["sausis","vasaris","kovas","balandis","gegužė","birželis",
                     "liepa","rugpjūtis","rugsėjis","spalis","lapkritis","gruodis"];
  const pad = n => String(n).padStart(2, "0");

  const toMin = s => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(s || "");
    return m ? +m[1] * 60 + +m[2] : NaN;
  };
  const fmt = min => Math.floor(min / 60) + ":" + pad(min % 60);
  const monthLabel = k => { const [y, m] = k.split("-"); return y + " " + MONTHS_LT[+m - 1]; };

  // last n month keys ("YYYY-MM"), oldest first, ending with the month of `now`
  function lastMonths(n, now) {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push(d.getFullYear() + "-" + pad(d.getMonth() + 1));
    }
    return out;
  }

  // -> { personId: { monthKey: minutes } }
  function summarize(people, log, months) {
    const res = {};
    people.forEach(p => { res[p.id] = {}; months.forEach(m => (res[p.id][m] = 0)); });
    log.forEach(e => {
      const m = e.date.slice(0, 7);
      if (res[e.person] && m in res[e.person]) res[e.person][m] += e.min;
    });
    return res;
  }

  function rowsFor(log, personId, month) {
    return log
      .filter(e => e.person === personId && e.date.startsWith(month))
      .sort((a, b) => (a.date + a.from).localeCompare(b.date + b.from));
  }

  const fileName = (p, month) =>
    p.name + (p.role ? " (" + p.role + ")" : "") + " " + month + ".xlsx";

  // ---- report from Template.xlsx (ExcelJS keeps the template's styles and merges) ----
  const FIRST = 23, LAST = 39, TOTAL = 40, COLS = 18;   // data rows 23..39, total row 40

  function cloneStyle(from, to) {
    for (let c = 1; c <= COLS; c++) {
      const s = from.getCell(c).style;
      to.getCell(c).style = JSON.parse(JSON.stringify(s));
    }
    to.height = from.height;
  }

  async function buildReport(ExcelJS, templateBuf, person, month, rows) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(templateBuf);
    const ws = wb.worksheets[0];

    ws.getCell("D17").value = monthLabel(month);

    const capacity = LAST - FIRST + 1;                       // 17
    const extra = Math.max(0, rows.length - capacity);
    let totalRow = TOTAL;

    if (extra > 0) {
      const totalStyleRow = ws.getRow(TOTAL);
      const saved = {};
      for (let c = 1; c <= COLS; c++) saved[c] = JSON.parse(JSON.stringify(totalStyleRow.getCell(c).style));
      const savedH = totalStyleRow.height;
      ws.unMergeCells("B" + TOTAL + ":I" + TOTAL);
      ws.getCell("B" + TOTAL).value = null;
      const src = ws.getRow(LAST);
      for (let r = TOTAL; r < TOTAL + extra; r++) {
        cloneStyle(src, ws.getRow(r));
        ws.mergeCells("H" + r + ":I" + r);
      }
      totalRow = TOTAL + extra;
      const tr = ws.getRow(totalRow);
      for (let c = 1; c <= COLS; c++) tr.getCell(c).style = saved[c];
      tr.height = savedH;
      ws.mergeCells("B" + totalRow + ":I" + totalRow);
      ws.getCell("B" + totalRow).value = "Iš viso:";
    }

    let sum = 0;
    rows.forEach((e, i) => {
      const r = FIRST + i;
      const [y, m, d] = e.date.split("-");
      const from = toMin(e.from), to = toMin(e.to), dur = to - from;
      sum += dur;
      ws.getCell("B" + r).value = (i + 1) + ".";
      ws.getCell("C" + r).value = y + "." + m + "." + d;
      ws.getCell("D" + r).value = person.name;
      ws.getCell("E" + r).value = from / 1440;  ws.getCell("E" + r).numFmt = "h:mm";
      ws.getCell("F" + r).value = to / 1440;    ws.getCell("F" + r).numFmt = "h:mm";
      ws.getCell("G" + r).value = person.code || null;
      ws.getCell("J" + r).value = dur / 1440;   ws.getCell("J" + r).numFmt = "[h]:mm";
    });

    const lastData = Math.max(LAST, totalRow - 1);
    ws.getCell("J" + totalRow).value = { formula: "SUM(J" + FIRST + ":J" + lastData + ")", result: sum / 1440 };
    ws.getCell("J" + totalRow).numFmt = "[h]:mm";

    return wb.xlsx.writeBuffer();
  }

  const api = { MONTHS_LT, toMin, fmt, monthLabel, lastMonths, summarize, rowsFor, fileName, buildReport };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Tracker = api;
})(typeof self !== "undefined" ? self : this);
