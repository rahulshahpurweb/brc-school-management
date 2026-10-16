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

    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "10px";
    
    let cellStyle = "border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-size: 13px;";
    let headerStyle = "border: 1px solid #94a3b8; padding: 10px; text-align: center; font-weight: bold; color: #fff;";

    let html = '';

    if (viewMode === "format1") {
      html += `<thead>
        <tr>
          <th rowspan="2" style="${headerStyle} background:#1e3a8a;">JSK</th>
          <th style="${headerStyle} background:#0284c7;">Primary School (Class 1 to 5)</th>
          <th style="${headerStyle} background:#0284c7;">Middle School (Class 6 to 8)</th>
          <th style="${headerStyle} background:#0284c7;">Primary with Middle School (Class 1 to 8)</th>
          <th style="${headerStyle} background:#0284c7;">Middle to High School (Class 6 to 10)</th>
          <th style="${headerStyle} background:#0284c7;">Middle to Higher Sec. (Class 6 to 12)</th>
          <th style="${headerStyle} background:#0284c7;">Primary to High School (Class 1 to 10)</th>
          <th style="${headerStyle} background:#0284c7;">Primary to Higher Sec. (Class 1 to 12)</th>
          <th style="${headerStyle} background:#15803d;">Grand Total</th>
        </tr>
      </thead><tbody>`;

      let jskList = ["Bhoura", "Bijadehi", "Dhodhramau", "Kesiya", "Kundi", "Shahpur", "Tara"];
      let totals = { p:0, m:0, pm:0, mh:0, mhs:0, ph:0, phs:0, grand:0 };

      jskList.forEach(jsk => {
        let jskSchools = schools.filter(s => s.jsk === jsk);
        let c1=0, c2=0, c3=0, c4=0, c5=0, c6=0, c7=0;

        jskSchools.forEach(s => {
          let cat = (s.category || "").toLowerCase();
          let classesObj = s.classes || {};
          let has1_5 = false, has6_8 = false, has9_10 = false, has11_12 = false;

          Object.keys(classesObj).forEach(cName => {
            let cl = classesObj[cName] || {};
            let sum = (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0);
            if (sum > 0) {
              if (["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"].includes(cName)) has1_5 = true;
              if (["Class 6", "Class 7", "Class 8"].includes(cName)) has6_8 = true;
              if (["Class 9", "Class 10"].includes(cName)) has9_10 = true;
              if (["Class 11", "Class 12"].includes(cName)) has11_12 = true;
            }
          });

          if ((has11_12 || cat.includes("12") || cat.includes("higher secondary")) && has1_5) c7++;
          else if ((has9_10 || cat.includes("10") || cat.includes("high school")) && has1_5) c6++;
          else if ((has11_12 || cat.includes("12") || cat.includes("higher secondary")) && has6_8) c5++;
          else if ((has9_10 || cat.includes("10") || cat.includes("high school")) && has6_8) c4++;
          else if ((has1_5 && has6_8) || (cat.includes("primary") && cat.includes("middle"))) c3++;
          else if (has6_8 || cat.includes("middle")) c2++;
          else c1++;
        });

        let rowTotal = c1 + c2 + c3 + c4 + c5 + c6 + c7;
        totals.p += c1; totals.m += c2; totals.pm += c3; totals.mh += c4;
        totals.mhs += c5; totals.ph += c6; totals.phs += c7; totals.grand += rowTotal;

        html += `<tr>
          <td style="${cellStyle} font-weight:bold; color:#1e3a8a; text-align:left;">${jsk}</td>
          <td style="${cellStyle}">${c1 || ''}</td>
          <td style="${cellStyle}">${c2 || ''}</td>
          <td style="${cellStyle}">${c3 || ''}</td>
          <td style="${cellStyle}">${c4 || ''}</td>
          <td style="${cellStyle}">${c5 || ''}</td>
          <td style="${cellStyle}">${c6 || ''}</td>
          <td style="${cellStyle}">${c7 || ''}</td>
          <td style="${cellStyle} font-weight:bold; background:#dcfce7; color:#14532d;">${rowTotal}</td>
        </tr>`;
      });

      html += `<tr style="background:#1e3a8a; color:#fff; font-weight:bold;">
        <td style="${cellStyle} color:#fff; text-align:left;">Grand Total</td>
        <td style="${cellStyle}">${totals.p}</td><td style="${cellStyle}">${totals.m}</td>
        <td style="${cellStyle}">${totals.pm}</td><td style="${cellStyle}">${totals.mh}</td>
        <td style="${cellStyle}">${totals.mhs}</td><td style="${cellStyle}">${totals.ph}</td>
        <td style="${cellStyle}">${totals.phs}</td><td style="${cellStyle} background:#15803d; color:#fff;">${totals.grand}</td>
      </tr>`;

    } else if (viewMode === "format2") {
      html += `<thead>
        <tr>
          <th rowspan="2" style="${headerStyle} background:#1e3a8a;">JSK: ${jskFilter}</th>
          <th colspan="2" style="${headerStyle} background:#0284c7;">SC</th>
          <th colspan="2" style="${headerStyle} background:#0284c7;">ST</th>
          <th colspan="2" style="${headerStyle} background:#0284c7;">OBC</th>
          <th colspan="2" style="${headerStyle} background:#0284c7;">GEN</th>
          <th colspan="3" style="${headerStyle} background:#15803d;">Total</th>
        </tr>
        <tr>
          <th style="${headerStyle} background:#e0f2fe; color:#0369a1;">Boy</th><th style="${headerStyle} background:#e0f2fe; color:#0369a1;">Girl</th>
          <th style="${headerStyle} background:#e0f2fe; color:#0369a1;">Boy</th><th style="${headerStyle} background:#e0f2fe; color:#0369a1;">Girl</th>
          <th style="${headerStyle} background:#e0f2fe; color:#0369a1;">Boy</th><th style="${headerStyle} background:#e0f2fe; color:#0369a1;">Girl</th>
          <th style="${headerStyle} background:#e0f2fe; color:#0369a1;">Boy</th><th style="${headerStyle} background:#e0f2fe; color:#0369a1;">Girl</th>
          <th style="${headerStyle} background:#dcfce7; color:#166534;">Boy</th><th style="${headerStyle} background:#dcfce7; color:#166534;">Girl</th><th style="${headerStyle} background:#dcfce7; color:#166534;">Total</th>
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
          <td style="${cellStyle} font-weight:bold; text-align:left;">${cName}</td>
          <td style="${cellStyle}">${cData.scB}</td><td style="${cellStyle}">${cData.scG}</td>
          <td style="${cellStyle}">${cData.stB}</td><td style="${cellStyle}">${cData.stG}</td>
          <td style="${cellStyle}">${cData.obcB}</td><td style="${cellStyle}">${cData.obcG}</td>
          <td style="${cellStyle}">${cData.genB}</td><td style="${cellStyle}">${cData.genG}</td>
          <td style="${cellStyle} font-weight:bold; color:#166534;">${rowB}</td>
          <td style="${cellStyle} font-weight:bold; color:#166534;">${rowG}</td>
          <td style="${cellStyle} font-weight:bold; background:#dcfce7; color:#14532d;">${rowT}</td>
        </tr>`;
      });

    } else if (viewMode === "format3") {
      html += `<thead>
        <tr>
          <th style="${headerStyle} background:#1e3a8a;">JSK</th>
          <th style="${headerStyle} background:#0284c7;">Class-1</th>
          <th style="${headerStyle} background:#0284c7;">Class-2</th>
          <th style="${headerStyle} background:#0284c7;">Class-3</th>
          <th style="${headerStyle} background:#0284c7;">Class-4</th>
          <th style="${headerStyle} background:#0284c7;">Class-5</th>
          <th style="${headerStyle} background:#15803d;">1 to 5 Total</th>
          <th style="${headerStyle} background:#0284c7;">Class-6</th>
          <th style="${headerStyle} background:#0284c7;">Class-7</th>
          <th style="${headerStyle} background:#0284c7;">Class-8</th>
          <th style="${headerStyle} background:#15803d;">6 to 8 Total</th>
          <th style="${headerStyle} background:#15803d;">1 to 8 Total</th>
        </tr>
      </thead><tbody>`;

      let jskList = ["Bhoura", "Bijadehi", "Dhodhramau", "Kesiya", "Kundi", "Shahpur", "Tara"];
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

        html += `<tr>
          <td style="${cellStyle} font-weight:bold; color:#1e3a8a; text-align:left;">${jsk}</td>
          <td style="${cellStyle}">${t.c1}</td><td style="${cellStyle}">${t.c2}</td>
          <td style="${cellStyle}">${t.c3}</td><td style="${cellStyle}">${t.c4}</td>
          <td style="${cellStyle}">${t.c5}</td>
          <td style="${cellStyle} font-weight:bold; background:#eef2ff;">${sub1_5}</td>
          <td style="${cellStyle}">${t.c6}</td><td style="${cellStyle}">${t.c7}</td>
          <td style="${cellStyle}">${t.c8}</td>
          <td style="${cellStyle} font-weight:bold; background:#eef2ff;">${sub6_8}</td>
          <td style="${cellStyle} font-weight:bold; background:#dcfce7; color:#14532d;">${rowTotal}</td>
        </tr>`;
      });

    } else if (viewMode === "format4") {
      html += `<thead>
        <tr>
          <th style="${headerStyle} background:#1e3a8a;">S.No.</th>
          <th style="${headerStyle} background:#1e3a8a;">SCHOOL NAME</th>
          <th style="${headerStyle} background:#1e3a8a;">School Code (UDISE)</th>
          <th style="${headerStyle} background:#1e3a8a;">School Category</th>
          <th style="${headerStyle} background:#1e3a8a;">JSK</th>
          <th style="${headerStyle} background:#0284c7;">Class-1</th>
          <th style="${headerStyle} background:#0284c7;">Class-2</th>
          <th style="${headerStyle} background:#0284c7;">Class-3</th>
          <th style="${headerStyle} background:#0284c7;">Class-4</th>
          <th style="${headerStyle} background:#0284c7;">Class-5</th>
          <th style="${headerStyle} background:#0284c7;">Class-6</th>
          <th style="${headerStyle} background:#0284c7;">Class-7</th>
          <th style="${headerStyle} background:#0284c7;">Class-8</th>
          <th style="${headerStyle} background:#15803d;">Total</th>
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
          <td style="${cellStyle} font-weight:bold;">${idx + 1}</td>
          <td style="${cellStyle} font-weight:600; text-align:left;">${s.name}</td>
          <td style="${cellStyle}">${s.udise}</td>
          <td style="${cellStyle}">${s.category || 'Primary with Middle'}</td>
          <td style="${cellStyle}">${s.jsk}</td>
          <td style="${cellStyle}">${t1||''}</td><td style="${cellStyle}">${t2||''}</td>
          <td style="${cellStyle}">${t3||''}</td><td style="${cellStyle}">${t4||''}</td>
          <td style="${cellStyle}">${t5||''}</td><td style="${cellStyle}">${t6||''}</td>
          <td style="${cellStyle}">${t7||''}</td><td style="${cellStyle}">${t8||''}</td>
          <td style="${cellStyle} font-weight:bold; background:#dcfce7; color:#14532d;">${rowTot}</td>
        </tr>`;
      });

    } else if (viewMode === "format5") {
      html += `<thead>
        <tr>
          <th rowspan="2" style="${headerStyle} background:#1e3a8a;">S.No.</th>
          <th rowspan="2" style="${headerStyle} background:#1e3a8a;">SCHOOL NAME</th>
          <th rowspan="2" style="${headerStyle} background:#1e3a8a;">School Code</th>
          <th rowspan="2" style="${headerStyle} background:#1e3a8a;">Category</th>
          <th rowspan="2" style="${headerStyle} background:#1e3a8a;">JSK</th>`;
          
      for(let i=1; i<=8; i++) {
        html += `<th colspan="9" style="${headerStyle} background:#0284c7;">Class-${i}</th>`;
      }
      html += `</tr><tr>`;
      
      for(let i=1; i<=8; i++) {
        html += `<th style="${cellStyle} background:#e0f2fe; color:#0369a1; font-size:10px;">SC-B</th>
                 <th style="${cellStyle} background:#e0f2fe; color:#0369a1; font-size:10px;">SC-G</th>
                 <th style="${cellStyle} background:#e0f2fe; color:#0369a1; font-size:10px;">ST-B</th>
                 <th style="${cellStyle} background:#e0f2fe; color:#0369a1; font-size:10px;">ST-G</th>
                 <th style="${cellStyle} background:#e0f2fe; color:#0369a1; font-size:10px;">OBC-B</th>
                 <th style="${cellStyle} background:#e0f2fe; color:#0369a1; font-size:10px;">OBC-G</th>
                 <th style="${cellStyle} background:#e0f2fe; color:#0369a1; font-size:10px;">GEN-B</th>
                 <th style="${cellStyle} background:#e0f2fe; color:#0369a1; font-size:10px;">GEN-G</th>
                 <th style="${cellStyle} background:#dcfce7; color:#166534; font-size:10px;">Total</th>`;
      }
      html += `</tr></thead><tbody>`;

      let filteredSchools = jskFilter === "ALL" ? schools : schools.filter(s => s.jsk === jskFilter);
      filteredSchools.forEach((s, idx) => {
        html += `<tr>
          <td style="${cellStyle} font-weight:bold;">${idx + 1}</td>
          <td style="${cellStyle} text-align:left;">${s.name}</td>
          <td style="${cellStyle}">${s.udise}</td>
          <td style="${cellStyle}">${s.category || ''}</td>
          <td style="${cellStyle}">${s.jsk}</td>`;

        ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
          let cl = s.classes && s.classes[c] ? s.classes[c] : {scB:0,scG:0,stB:0,stG:0,obcB:0,obcG:0,genB:0,genG:0};
          let cTot = (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0);
          
          html += `<td style="${cellStyle}">${cl.scB||''}</td><td style="${cellStyle}">${cl.scG||''}</td>
                   <td style="${cellStyle}">${cl.stB||''}</td><td style="${cellStyle}">${cl.stG||''}</td>
                   <td style="${cellStyle}">${cl.obcB||''}</td><td style="${cellStyle}">${cl.obcG||''}</td>
                   <td style="${cellStyle}">${cl.genB||''}</td><td style="${cellStyle}">${cl.genG||''}</td>
                   <td style="${cellStyle} font-weight:bold; background:#f0fdf4;">${cTot||''}</td>`;
        });
        html += `</tr>`;
      });
    }

    html += `</tbody>`;
    table.innerHTML = html;
  }
};
