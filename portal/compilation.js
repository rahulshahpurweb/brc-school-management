import { MASTER_SCHOOLS } from './schools-data.js';
import { SessionManager } from './session-manager.js';

export const CompilationModule = {
  render() {
    let schools = SessionManager.getData();
    if (!schools || schools.length === 0) schools = MASTER_SCHOOLS;

    let viewMode = document.getElementById("compViewMode")?.value || "format1"; 
    let table = document.getElementById("compileTable");
    if(!table) return;

    let html = '';

    if (viewMode === "format1" || viewMode === "summary") {
      // --- FORMAT 1: JSK-Wise And Category-wise No. Of Schools ---
      html += `<thead>
        <tr>
          <th rowspan="2" style="background:#1e3a8a;color:#fff;vertical-align:middle;">JSK</th>
          <th style="background:#0284c7;color:#fff;">Primary School (Class 1 to 5)</th>
          <th style="background:#0284c7;color:#fff;">Middle School (Class 6 to 8)</th>
          <th style="background:#0284c7;color:#fff;">Primary with Middle School (Class 1 to 8)</th>
          <th style="background:#0284c7;color:#fff;">Middle to High School (Class 6 to 10)</th>
          <th style="background:#0284c7;color:#fff;">Middle to Higher Secondary School (Class 6 to 12)</th>
          <th style="background:#0284c7;color:#fff;">Primary to High School (Class 1 to 10)</th>
          <th style="background:#0284c7;color:#fff;">Primary to Higher Secondary School (Class 1 to 12)</th>
          <th style="background:#15803d;color:#fff;">Grand Total</th>
        </tr>
      </thead><tbody>`;

      let jskList = ["Bhoura", "Bijadehi", "Dhodhramau", "Kesiya", "Kundi", "Shahpur", "Tara"];
      let totals = { p:0, m:0, pm:0, mh:0, mhs:0, ph:0, phs:0, grand:0 };

      jskList.forEach(jsk => {
        let jskSchools = schools.filter(s => s.jsk === jsk);
        
        let c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0, c7 = 0;

        jskSchools.forEach(s => {
          let cat = (s.category || "").toLowerCase();
          if (cat.includes("primary") && !cat.includes("middle") && !cat.includes("high")) c1++;
          else if (cat.includes("middle") && !cat.includes("primary") && !cat.includes("high") && !cat.includes("higher")) c2++;
          else if (cat.includes("primary") && cat.includes("middle") && !cat.includes("high")) c3++;
          else if (cat.includes("middle") && cat.includes("high") && !cat.includes("primary")) c4++;
          else if (cat.includes("middle") && cat.includes("higher")) c5++;
          else if (cat.includes("primary") && cat.includes("high") && !cat.includes("higher")) c6++;
          else if (cat.includes("primary") && cat.includes("higher")) c7++;
          else c1++; // Default fallback
        });

        let rowTotal = c1 + c2 + c3 + c4 + c5 + c6 + c7;
        totals.p += c1; totals.m += c2; totals.pm += c3; totals.mh += c4;
        totals.mhs += c5; totals.ph += c6; totals.phs += c7; totals.grand += rowTotal;

        html += `<tr style="background:#f8fafc;">
          <td style="font-weight:bold;color:#1e3a8a;">${jsk}</td>
          <td style="text-align:center;">${c1 || ''}</td>
          <td style="text-align:center;">${c2 || ''}</td>
          <td style="text-align:center;">${c3 || ''}</td>
          <td style="text-align:center;">${c4 || ''}</td>
          <td style="text-align:center;">${c5 || ''}</td>
          <td style="text-align:center;">${c6 || ''}</td>
          <td style="text-align:center;">${c7 || ''}</td>
          <td style="text-align:center;font-weight:bold;background:#dcfce7;color:#14532d;">${rowTotal}</td>
        </tr>`;
      });

      html += `<tr style="background:#1e3a8a;color:#fff;font-weight:bold;">
        <td>Grand Total</td>
        <td style="text-align:center;">${totals.p}</td>
        <td style="text-align:center;">${totals.m}</td>
        <td style="text-align:center;">${totals.pm}</td>
        <td style="text-align:center;">${totals.mh}</td>
        <td style="text-align:center;">${totals.mhs}</td>
        <td style="text-align:center;">${totals.ph}</td>
        <td style="text-align:center;">${totals.phs}</td>
        <td style="text-align:center;background:#15803d;">${totals.grand}</td>
      </tr>`;

    } else {
      // --- DETAILED SCHOOL-WISE VIEW ---
      html += `<thead>
        <tr>
          <th style="background:#1e3a8a;color:#fff;">S.No.</th>
          <th style="background:#1e3a8a;color:#fff;">School Name & UDISE</th>
          <th style="background:#1e3a8a;color:#fff;">JSK</th>
          <th style="background:#0284c7;color:#fff;">Category</th>
          <th style="background:#15803d;color:#fff;">Total Enrollment</th>
        </tr>
      </thead><tbody>`;

      schools.forEach((s, idx) => {
        let t = 0;
        Object.values(s.classes || {}).forEach(cl => {
          t += (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0);
        });

        html += `<tr>
          <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
          <td>${s.name}<br><small>UDISE: ${s.udise}</small></td>
          <td style="text-align:center;">${s.jsk}</td>
          <td>${s.category || 'Primary with Middle'}</td>
          <td style="text-align:center;font-weight:bold;color:#166534;">${t}</td>
        </tr>`;
      });
    }

    html += `</tbody>`;
    table.innerHTML = html;
  }
};
