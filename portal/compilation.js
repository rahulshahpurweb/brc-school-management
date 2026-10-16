import { MASTER_SCHOOLS } from './schools-data.js';
import { SessionManager } from './session-manager.js';

export const CompilationModule = {
  render() {
    let schools = SessionManager.getData();
    if (!schools || schools.length === 0) schools = MASTER_SCHOOLS;

    let jskFilter = document.getElementById("compJskFilter")?.value || "ALL";
    let classFilter = document.getElementById("compClassFilter")?.value || "ALL";
    let table = document.getElementById("compileTable");
    if(!table) return;

    let filteredSchools = jskFilter === "ALL" ? schools : schools.filter(s => s.jsk === jskFilter);

    let html = `<thead>
      <tr>
        <th rowspan="2" style="background:#1e3a8a;color:#fff;vertical-align:middle;">S.No.</th>
        <th rowspan="2" style="background:#1e3a8a;color:#fff;vertical-align:middle;">School Name & UDISE</th>
        <th rowspan="2" style="background:#1e3a8a;color:#fff;vertical-align:middle;">JSK</th>
        <th colspan="2" style="background:#0284c7;color:#fff;">SC</th>
        <th colspan="2" style="background:#0284c7;color:#fff;">ST</th>
        <th colspan="2" style="background:#0284c7;color:#fff;">OBC</th>
        <th colspan="2" style="background:#0284c7;color:#fff;">GEN</th>
        <th colspan="3" style="background:#15803d;color:#fff;">Total</th>
        <th rowspan="2" style="background:#475569;color:#fff;vertical-align:middle;">Status</th>
      </tr>
      <tr>
        <th style="background:#e0f2fe;color:#0369a1;">B</th><th style="background:#e0f2fe;color:#0369a1;">G</th>
        <th style="background:#e0f2fe;color:#0369a1;">B</th><th style="background:#e0f2fe;color:#0369a1;">G</th>
        <th style="background:#e0f2fe;color:#0369a1;">B</th><th style="background:#e0f2fe;color:#0369a1;">G</th>
        <th style="background:#e0f2fe;color:#0369a1;">B</th><th style="background:#e0f2fe;color:#0369a1;">G</th>
        <th style="background:#dcfce7;color:#166534;">B</th><th style="background:#dcfce7;color:#166534;">G</th><th style="background:#dcfce7;color:#166534;">T</th>
      </tr>
    </thead><tbody>`;

    let totals = { scB:0, scG:0, stB:0, stG:0, obcB:0, obcG:0, genB:0, genG:0, totB:0, totG:0, grandTotal:0 };

    filteredSchools.forEach((s, idx) => {
      let sScB=0, sScG=0, sStB=0, sStG=0, sObcB=0, sObcG=0, sGenB=0, sGenG=0, sTotB=0, sTotG=0, sGTotal=0;
      let isFilled = false;

      let classesToLoop = classFilter === "ALL" ? ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"] : [classFilter];

      classesToLoop.forEach(c => {
        let cl = s.classes && s.classes[c] ? s.classes[c] : {};
        let b = (cl.scB||0)+(cl.stB||0)+(cl.obcB||0)+(cl.genB||0);
        let g = (cl.scG||0)+(cl.stG||0)+(cl.obcG||0)+(cl.genG||0);
        let t = b + g;
        if(t > 0) isFilled = true;

        sScB += cl.scB||0; sScG += cl.scG||0;
        sStB += cl.stB||0; sStG += cl.stG||0;
        sObcB += cl.obcB||0; sObcG += cl.obcG||0;
        sGenB += cl.genB||0; sGenG += cl.genG||0;
        sTotB += b; sTotG += g; sGTotal += t;
      });

      totals.scB += sScB; totals.scG += sScG;
      totals.stB += sStB; totals.stG += sStG;
      totals.obcB += sObcB; totals.obcG += sObcG;
      totals.genB += sGenB; totals.genG += sGenG;
      totals.totB += sTotB; totals.totG += sTotG;
      totals.grandTotal += sGTotal;

      let rowBg = isFilled ? "#f0fdf4" : "#fefce8";
      let statusBadge = isFilled 
        ? `<span style="background:#dcfce7;color:#166534;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:bold;">✅ Feeded</span>` 
        : `<span style="background:#fef9c3;color:#854d0e;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:bold;">⏳ Pending</span>`;

      html += `<tr style="background:${rowBg};">
        <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
        <td style="text-align:left;font-weight:600;padding-left:8px;">${s.name}<br><small style="color:#64748b;">UDISE: ${s.udise}</small></td>
        <td style="text-align:center;font-size:11px;">${s.jsk}</td>
        <td style="text-align:center;">${sScB}</td><td style="text-align:center;">${sScG}</td>
        <td style="text-align:center;">${sStB}</td><td style="text-align:center;">${sStG}</td>
        <td style="text-align:center;">${sObcB}</td><td style="text-align:center;">${sObcG}</td>
        <td style="text-align:center;">${sGenB}</td><td style="text-align:center;">${sGenG}</td>
        <td style="text-align:center;font-weight:bold;color:#166534;">${sTotB}</td>
        <td style="text-align:center;font-weight:bold;color:#166534;">${sTotG}</td>
        <td style="text-align:center;font-weight:bold;background:#dcfce7;color:#14532d;">${sGTotal}</td>
        <td style="text-align:center;">${statusBadge}</td>
      </tr>`;
    });

    html += `<tr style="background:#1e3a8a;color:#fff;font-weight:bold;">
      <td colspan="3" style="text-align:right;padding-right:10px;">Grand Total (${classFilter}):</td>
      <td style="text-align:center;">${totals.scB}</td><td style="text-align:center;">${totals.scG}</td>
      <td style="text-align:center;">${totals.stB}</td><td style="text-align:center;">${totals.stG}</td>
      <td style="text-align:center;">${totals.obcB}</td><td style="text-align:center;">${totals.obcG}</td>
      <td style="text-align:center;">${totals.genB}</td><td style="text-align:center;">${totals.genG}</td>
      <td style="text-align:center;">${totals.totB}</td><td style="text-align:center;">${totals.totG}</td>
      <td style="text-align:center;background:#15803d;">${totals.grandTotal}</td>
      <td style="text-align:center;">-</td>
    </tr>`;

    html += `</tbody>`;
    table.innerHTML = html;
  }
};
