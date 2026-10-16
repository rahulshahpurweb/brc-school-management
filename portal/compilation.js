import { MASTER_SCHOOLS } from './schools-data.js';
import { SessionManager } from './session-manager.js';

export const CompilationModule = {
  render() {
    let schools = SessionManager.getData();
    if (!schools || schools.length === 0) schools = MASTER_SCHOOLS;

    let jskFilter = document.getElementById("compJskFilter")?.value || "ALL";
    let viewMode = document.getElementById("compViewMode")?.value || "format1"; 
    let table = document.getElementById("compileTable");
    if(!table) return;

    let html = '';

    if (viewMode === "format1") {
      // --- FORMAT 1: JSK-Wise And Category-wise No. Of Schools ---
      html += `<thead>
        <tr>
          <th rowspan="2" style="background:#1e3a8a;color:#fff;vertical-align:middle;">JSK</th>
          <th style="background:#0284c7;color:#fff;">Primary School (Class 1 to 5)</th>
          <th style="background:#0284c7;color:#fff;">Middle School (Class 6 to 8)</th>
          <th style="background:#0284c7;color:#fff;">Primary with Middle School (Class 1 to 8)</th>
          <th style="background:#0284c7;color:#fff;">Middle to High School (Class 6 to 10)</th>
          <th style="background:#0284c7;color:#fff;">Middle to Higher Sec. School (Class 6 to 12)</th>
          <th style="background:#0284c7;color:#fff;">Primary to High School (Class 1 to 10)</th>
          <th style="background:#0284c7;color:#fff;">Primary to Higher Sec. School (Class 1 to 12)</th>
          <th style="background:#15803d;color:#fff;">Grand Total</th>
        </tr>
      </thead><tbody>`;

      let jskList = ["Bhoura", "Bijadehi", "Dhodhramau", "Kesiya", "Kundi", "Shahpur", "Tara"];
      let totals = { p:0, m:0, pm:0, mh:0, mhs:0, ph:0, phs:0, grand:0 };

      jskList.forEach(jsk => {
        let jskSchools = schools.filter(s => s.jsk === jsk);
        let c1=0, c2=0, c3=0, c4=0, c5=0, c6=0, c7=0;

        jskSchools.forEach(s => {
          let cat = (s.category || "").toLowerCase();
          if (cat.includes("primary") && !cat.includes("middle") && !cat.includes("high")) c1++;
          else if (cat.includes("middle") && !cat.includes("primary")) c2++;
          else if (cat.includes("primary") && cat.includes("middle")) c3++;
          else c3++;
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
        <td style="text-align:center;">${totals.p}</td><td style="text-align:center;">${totals.m}</td>
        <td style="text-align:center;">${totals.pm}</td><td style="text-align:center;">${totals.mh}</td>
        <td style="text-align:center;">${totals.mhs}</td><td style="text-align:center;">${totals.ph}</td>
        <td style="text-align:center;">${totals.phs}</td><td style="text-align:center;background:#15803d;">${totals.grand}</td>
      </tr>`;

    } else if (viewMode === "format2") {
      // --- FORMAT 2: JSK-Wise, Class-Wise And Cast-Wise Enrollment ---
      html += `<thead>
        <tr>
          <th rowspan="2" style="background:#1e3a8a;color:#fff;vertical-align:middle;">JSK: ${jskFilter}</th>
          <th colspan="2" style="background:#0284c7;color:#fff;">SC</th>
          <th colspan="2" style="background:#0284c7;color:#fff;">ST</th>
          <th colspan="2" style="background:#0284c7;color:#fff;">OBC</th>
          <th colspan="2" style="background:#0284c7;color:#fff;">GEN</th>
          <th colspan="3" style="background:#15803d;color:#fff;">Total</th>
        </tr>
        <tr>
          <th style="background:#e0f2fe;color:#0369a1;">Boy</th><th style="background:#e0f2fe;color:#0369a1;">Girl</th>
          <th style="background:#e0f2fe;color:#0369a1;">Boy</th><th style="background:#e0f2fe;color:#0369a1;">Girl</th>
          <th style="background:#e0f2fe;color:#0369a1;">Boy</th><th style="background:#e0f2fe;color:#0369a1;">Girl</th>
          <th style="background:#e0f2fe;color:#0369a1;">Boy</th><th style="background:#e0f2fe;color:#0369a1;">Girl</th>
          <th style="background:#dcfce7;color:#166534;">Boy</th><th style="background:#dcfce7;color:#166534;">Girl</th><th style="background:#dcfce7;color:#166534;">Total</th>
        </tr>
      </thead><tbody>`;

      let filteredSchools = jskFilter === "ALL" ? schools : schools.filter(s => s.jsk === jskFilter);
      let classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
      let gTot = { scB:0, scG:0, stB:0, stG:0, obcB:0, obcG:0, genB:0, genG:0, totB:0, totG:0, final:0 };

      classes.forEach(cName => {
        let cData = { scB:0, scG:0, stB:0, stG:0, obcB:0, obcG:0, genB:0, genG:0 };
        filteredSchools.forEach(s => {
          let cl = s.classes && s.classes[cName] ? s.classes[cName] : {};
          cData.scB += cl.scB || 0; cData.scG += cl.scG || 0;
          cData.stB += cl.stB || 0; cData.stG += cl.stG || 0;
          cData.obcB += cl.obcB || 0; cData.obcG += cl.obcG || 0;
          cData.genB += cl.genB || 0; cData.genG += cl.genG || 0;
        });

        let rowB = cData.scB + cData.stB + cData.obcB + cData.genB;
        let rowG = cData.scG + cData.stG + cData.obcG + cData.genG;
        let rowT = rowB + rowG;

        gTot.scB += cData.scB; gTot.scG += cData.scG; gTot.stB += cData.stB; gTot.stG += cData.stG;
        gTot.obcB += cData.obcB; gTot.obcG += cData.obcG; gTot.genB += cData.genB; gTot.genG += cData.genG;
        gTot.totB += rowB; gTot.totG += rowG; gTot.final += rowT;

        html += `<tr>
          <td style="font-weight:bold;background:#f8fafc;">${cName}</td>
          <td style="text-align:center;">${cData.scB}</td><td style="text-align:center;">${cData.scG}</td>
          <td style="text-align:center;">${cData.stB}</td><td style="text-align:center;">${cData.stG}</td>
          <td style="text-align:center;">${cData.obcB}</td><td style="text-align:center;">${cData.obcG}</td>
          <td style="text-align:center;">${cData.genB}</td><td style="text-align:center;">${cData.genG}</td>
          <td style="text-align:center;font-weight:bold;color:#166534;">${rowB}</td>
          <td style="text-align:center;font-weight:bold;color:#166534;">${rowG}</td>
          <td style="text-align:center;font-weight:bold;background:#dcfce7;color:#14532d;">${rowT}</td>
        </tr>`;
      });

      html += `<tr style="background:#1e3a8a;color:#fff;font-weight:bold;">
        <td>Total</td>
        <td style="text-align:center;">${gTot.scB}</td><td style="text-align:center;">${gTot.scG}</td>
        <td style="text-align:center;">${gTot.stB}</td><td style="text-align:center;">${gTot.stG}</td>
        <td style="text-align:center;">${gTot.obcB}</td><td style="text-align:center;">${gTot.obcG}</td>
        <td style="text-align:center;">${gTot.genB}</td><td style="text-align:center;">${gTot.genG}</td>
        <td style="text-align:center;">${gTot.totB}</td><td style="text-align:center;">${gTot.totG}</td>
        <td style="text-align:center;background:#15803d;">${gTot.final}</td>
      </tr>`;

    } else if (viewMode === "format3") {
      // --- FORMAT 3: JSK-Wise & Class-Wise Enrollment (Class 1 to 8 + Totals) ---
      html += `<thead>
        <tr>
          <th style="background:#1e3a8a;color:#fff;">JSK</th>
          <th style="background:#0284c7;color:#fff;">Class-1</th>
          <th style="background:#0284c7;color:#fff;">Class-2</th>
          <th style="background:#0284c7;color:#fff;">Class-3</th>
          <th style="background:#0284c7;color:#fff;">Class-4</th>
          <th style="background:#0284c7;color:#fff;">Class-5</th>
          <th style="background:#15803d;color:#fff;">1 to 5 Total</th>
          <th style="background:#0284c7;color:#fff;">Class-6</th>
          <th style="background:#0284c7;color:#fff;">Class-7</th>
          <th style="background:#0284c7;color:#fff;">Class-8</th>
          <th style="background:#15803d;color:#fff;">6 to 8 Total</th>
          <th style="background:#15803d;color:#fff;">1 to 8 Total</th>
        </tr>
      </thead><tbody>`;

      let jskList = ["Bhoura", "Bijadehi", "Dhodhramau", "Kesiya", "Kundi", "Shahpur", "Tara"];
      let gSum = { c1:0, c2:0, c3:0, c4:0, c5:0, t1_5:0, c6:0, c7:0, c8:0, t6_8:0, grand:0 };

      jskList.forEach(jsk => {
        let jskSchools = schools.filter(s => s.jsk === jsk);
        let t = { c1:0, c2:0, c3:0, c4:0, c5:0, c6:0, c7:0, c8:0 };

        jskSchools.forEach(s => {
          ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach((c, idx) => {
            let cl = s.classes && s.classes[c] ? s.classes[c] : {};
            let sum = (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0);
            if(idx === 0) t.c1 += sum;
            if(idx === 1) t.c2 += sum;
            if(idx === 2) t.c3 += sum;
            if(idx === 3) t.c4 += sum;
            if(idx === 4) t.c5 += sum;
            if(idx === 5) t.c6 += sum;
            if(idx === 6) t.c7 += sum;
            if(idx === 7) t.c8 += sum;
          });
        });

        let sub1_5 = t.c1 + t.c2 + t.c3 + t.c4 + t.c5;
        let sub6_8 = t.c6 + t.c7 + t.c8;
        let rowTotal = sub1_5 + sub6_8;

        gSum.c1 += t.c1; gSum.c2 += t.c2; gSum.c3 += t.c3; gSum.c4 += t.c4; gSum.c5 += t.c5;
        gSum.t1_5 += sub1_5; gSum.c6 += t.c6; gSum.c7 += t.c7; gSum.c8 += t.c8; gSum.t6_8 += sub6_8; gSum.grand += rowTotal;

        html += `<tr style="background:#f8fafc;">
          <td style="font-weight:bold;color:#1e3a8a;">${jsk}</td>
          <td style="text-align:center;">${t.c1}</td><td style="text-align:center;">${t.c2}</td>
          <td style="text-align:center;">${t.c3}</td><td style="text-align:center;">${t.c4}</td>
          <td style="text-align:center;">${t.c5}</td>
          <td style="text-align:center;font-weight:bold;background:#eef2ff;">${sub1_5}</td>
          <td style="text-align:center;">${t.c6}</td><td style="text-align:center;">${t.c7}</td>
          <td style="text-align:center;">${t.c8}</td>
          <td style="text-align:center;font-weight:bold;background:#eef2ff;">${sub6_8}</td>
          <td style="text-align:center;font-weight:bold;background:#dcfce7;color:#14532d;">${rowTotal}</td>
        </tr>`;
      });

      html += `<tr style="background:#1e3a8a;color:#fff;font-weight:bold;">
        <td>Grand Total</td>
        <td style="text-align:center;">${gSum.c1}</td><td style="text-align:center;">${gSum.c2}</td>
        <td style="text-align:center;">${gSum.c3}</td><td style="text-align:center;">${gSum.c4}</td>
        <td style="text-align:center;">${gSum.c5}</td>
        <td style="text-align:center;background:#15803d;">${gSum.t1_5}</td>
        <td style="text-align:center;">${gSum.c6}</td><td style="text-align:center;">${gSum.c7}</td>
        <td style="text-align:center;">${gSum.c8}</td>
        <td style="text-align:center;background:#15803d;">${gSum.t6_8}</td>
        <td style="text-align:center;background:#15803d;">${gSum.grand}</td>
      </tr>`;

    } else if (viewMode === "format4") {
      // --- FORMAT 4: School-wise enrollment class 1 to 8 ---
      html += `<thead>
        <tr>
          <th>S.No.</th>
          <th>SCHOOL NAME</th>
          <th>School Code (UDISE)</th>
          <th>School Category</th>
          <th>JSK</th>
          <th>Class-1</th><th>Class-2</th><th>Class-3</th><th>Class-4</th><th>Class-5</th>
          <th>Class-6</th><th>Class-7</th><th>Class-8</th>
          <th style="background:#15803d;color:#fff;">Total</th>
        </tr>
      </thead><tbody>`;

      let filteredSchools = jskFilter === "ALL" ? schools : schools.filter(s => s.jsk === jskFilter);
      filteredSchools.forEach((s, idx) => {
        let t1=0,t2=0,t3=0,t4=0,t5=0,t6=0,t7=0,t8=0;
        if(s.classes) {
          let getSum = (cl) => cl ? (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0) : 0;
          t1 = getSum(s.classes["Class 1"]); t2 = getSum(s.classes["Class 2"]);
          t3 = getSum(s.classes["Class 3"]); t4 = getSum(s.classes["Class 4"]);
          t5 = getSum(s.classes["Class 5"]); t6 = getSum(s.classes["Class 6"]);
          t7 = getSum(s.classes["Class 7"]); t8 = getSum(s.classes["Class 8"]);
        }
        let rowTot = t1+t2+t3+t4+t5+t6+t7+t8;

        html += `<tr>
          <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
          <td style="font-weight:600;">${s.name}</td>
          <td>${s.udise}</td>
          <td>${s.category || 'Primary with Middle'}</td>
          <td style="text-align:center;">${s.jsk}</td>
          <td style="text-align:center;">${t1||''}</td><td style="text-align:center;">${t2||''}</td>
          <td style="text-align:center;">${t3||''}</td><td style="text-align:center;">${t4||''}</td>
          <td style="text-align:center;">${t5||''}</td><td style="text-align:center;">${t6||''}</td>
          <td style="text-align:center;">${t7||''}</td><td style="text-align:center;">${t8||''}</td>
          <td style="text-align:center;font-weight:bold;background:#dcfce7;color:#14532d;">${rowTot}</td>
        </tr>`;
      });

    } else if (viewMode === "format5") {
      // --- FORMAT 5: Master Overall Report (Class 1 to 8 with SC, ST, OBC, GEN Boy/Girl/Total) ---
      html += `<thead>
        <tr>
          <th rowspan="2" style="background:#1e3a8a;color:#fff;">S.No.</th>
          <th rowspan="2" style="background:#1e3a8a;color:#fff;">SCHOOL NAME</th>
          <th rowspan="2" style="background:#1e3a8a;color:#fff;">School Code</th>
          <th rowspan="2" style="background:#1e3a8a;color:#fff;">Category</th>
          <th rowspan="2" style="background:#1e3a8a;color:#fff;">JSK</th>
          <th colspan="9" style="background:#0284c7;color:#fff;">Class-1</th>
          <th colspan="9" style="background:#0284c7;color:#fff;">Class-2</th>
          <th colspan="9" style="background:#0284c7;color:#fff;">Class-3</th>
          <th colspan="9" style="background:#0284c7;color:#fff;">Class-4</th>
          <th colspan="9" style="background:#0284c7;color:#fff;">Class-5</th>
          <th colspan="9" style="background:#0284c7;color:#fff;">Class-6</th>
          <th colspan="9" style="background:#0284c7;color:#fff;">Class-7</th>
          <th colspan="9" style="background:#0284c7;color:#fff;">Class-8</th>
        </tr>
        <tr>`;
        
      for(let i=1; i<=8; i++) {
        html += `<th style="background:#e0f2fe;color:#0369a1;font-size:10px;">SC-B</th><th style="background:#e0f2fe;color:#0369a1;font-size:10px;">SC-G</th>
                 <th style="background:#e0f2fe;color:#0369a1;font-size:10px;">ST-B</th><th style="background:#e0f2fe;color:#0369a1;font-size:10px;">ST-G</th>
                 <th style="background:#e0f2fe;color:#0369a1;font-size:10px;">OBC-B</th><th style="background:#e0f2fe;color:#0369a1;font-size:10px;">OBC-G</th>
                 <th style="background:#e0f2fe;color:#0369a1;font-size:10px;">GEN-B</th><th style="background:#e0f2fe;color:#0369a1;font-size:10px;">GEN-G</th>
                 <th style="background:#dcfce7;color:#166534;font-size:10px;">Total</th>`;
      }
      html += `</tr></thead><tbody>`;

      let filteredSchools = jskFilter === "ALL" ? schools : schools.filter(s => s.jsk === jskFilter);
      filteredSchools.forEach((s, idx) => {
        html += `<tr>
          <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
          <td>${s.name}</td><td>${s.udise}</td><td>${s.category || ''}</td><td>${s.jsk}</td>`;

        ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
          let cl = s.classes && s.classes[c] ? s.classes[c] : {scB:0,scG:0,stB:0,stG:0,obcB:0,obcG:0,genB:0,genG:0};
          let cTot = (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0);
          
          html += `<td style="text-align:center;">${cl.scB||''}</td><td style="text-align:center;">${cl.scG||''}</td>
                   <td style="text-align:center;">${cl.stB||''}</td><td style="text-align:center;">${cl.stG||''}</td>
                   <td style="text-align:center;">${cl.obcB||''}</td><td style="text-align:center;">${cl.obcG||''}</td>
                   <td style="text-align:center;">${cl.genB||''}</td><td style="text-align:center;">${cl.genG||''}</td>
                   <td style="text-align:center;font-weight:bold;background:#f0fdf4;">${cTot||''}</td>`;
        });
        html += `</tr>`;
      });

    } else {
      // --- DEFAULT DETAILED VIEW ---
      html += `<thead><tr><th>S.No.</th><th>School Name</th><th>JSK</th><th>Total Enrollment</th></tr></thead><tbody>`;
      schools.forEach((s, idx) => {
        html += `<tr><td>${idx+1}</td><td>${s.name}</td><td>${s.jsk}</td><td>-</td></tr>`;
      });
    }

    html += `</tbody>`;
    table.innerHTML = html;
  }
};
