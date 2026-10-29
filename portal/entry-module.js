import { SessionManager } from './session-manager.js';
import { SchoolRecords } from './school-records.js';
import { CompilationModule } from './compilation.js';

export const EntryModule = {
  populateDropdown() {
    let schools = SessionManager.getData();
    let sel = document.getElementById("schoolSelect");
    if(!sel) return;
    
    let currentVal = sel.value;
    sel.innerHTML = "";
    
    schools.forEach((s, idx) => {
      let opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `${s.name} (UDISE: ${s.udise} | JSK: ${s.jsk})`;
      sel.appendChild(opt);
    });

    if(currentVal !== "" && schools[currentVal]) {
      sel.value = currentVal;
    }
    
    this.loadForm();
  },

  // Exact class range based on your precise rules
  getClassesForSchool(category) {
    let cat = (category || "").toUpperCase().trim();
    
    // Agar school category 6 se shuru hoti hai (jaise 6 to 12, 6 to 10, 6 to 8)
    if (cat.includes("6 TO") || cat.includes("6-")) {
      return ["Class 6", "Class 7", "Class 8"];
    }
    
    // Agar school category 1 se shuru hoti hai aur badi hai (1 to 12, 1 to 10, 1 to 8)
    if (cat.includes("1 TO 12") || cat.includes("1 TO 10") || cat.includes("1 TO 8") || cat.includes("1-12") || cat.includes("1-10") || cat.includes("1-8")) {
      return ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
    }
    
    // Default Primary School (1 to 5)
    return ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
  },

  loadForm() {
    let sel = document.getElementById("schoolSelect");
    let tbody = document.getElementById("entryTableBody");
    if(!tbody) return;
    
    if(!sel || sel.value === "" || sel.value === undefined) {
      sel.value = 0;
    }

    let schools = SessionManager.getData();
    let s = schools[sel.value];
    if(!s) return;

    tbody.innerHTML = "";
    
    const applicableClasses = this.getClassesForSchool(s.category);
    
    applicableClasses.forEach(c => {
      if(!s.classes) s.classes = {};
      if(!s.classes[c]) {
        s.classes[c] = {scB:0, scG:0, stB:0, stG:0, obcB:0, obcG:0, genB:0, genG:0};
      }
      
      let cl = s.classes[c];

      tbody.innerHTML += `<tr>
        <td style="font-weight:bold;background:#f8fafc;vertical-align:middle;">${c}</td>
        <td><input type="number" min="0" class="entry-input" value="${cl.scB || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" value="${cl.scG || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" value="${cl.stB || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" value="${cl.stG || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" value="${cl.obcB || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" value="${cl.obcG || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" value="${cl.genB || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" value="${cl.genG || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td class="row-totB" style="text-align:center;font-weight:bold;">0</td>
        <td class="row-totG" style="text-align:center;font-weight:bold;">0</td>
        <td class="row-totalT" style="text-align:center;font-weight:bold;background:#eef2ff;">0</td>
      </tr>`;
    });

    this.attachListeners();
    this.calculateAllRows();

    // Data remains frozen/locked by default
    if (s.isFrozen === undefined) {
      s.isFrozen = true; 
    }
    this.setFormLockStatus(s.isFrozen);
  },

  attachListeners() {
    let inputs = document.querySelectorAll(".entry-input");
    inputs.forEach(input => {
      input.addEventListener("input", (e) => {
        let row = e.target.closest("tr");
        this.calcRow(row);
      });
    });
  },

  calcRow(row) {
    if(!row) return;
    let inputs = row.querySelectorAll("input");
    if(inputs.length < 8) return;

    let scB = parseInt(inputs[0].value) || 0;
    let scG = parseInt(inputs[1].value) || 0;
    let stB = parseInt(inputs[2].value) || 0;
    let stG = parseInt(inputs[3].value) || 0;
    let obcB = parseInt(inputs[4].value) || 0;
    let obcG = parseInt(inputs[5].value) || 0;
    let genB = parseInt(inputs[6].value) || 0;
    let genG = parseInt(inputs[7].value) || 0;

    let totB = scB + stB + obcB + genB;
    let totG = scG + stG + obcG + genG;
    let totalT = totB + totG;

    let cells = row.querySelectorAll("td");
    if(cells.length >= 12) {
      cells[9].innerText = totB;
      cells[10].innerText = totG;
      cells[11].innerText = totalT;
    }

    this.addTotalRow();
  },

  calculateAllRows() {
    let rows = document.querySelectorAll("#entryTableBody tr");
    rows.forEach(row => {
      if(!row.id.includes("entryTotalRow")) {
        this.calcRow(row);
      }
    });
  },

  addTotalRow() {
    let sB=0, sG=0, stB=0, stG=0, oB=0, oG=0, gB=0, gG=0;
    let rows = document.querySelectorAll("#entryTableBody tr");
    
    rows.forEach(row => {
      if(!row.id.includes("entryTotalRow")) {
        let inputs = row.querySelectorAll("input");
        if(inputs.length >= 8) {
          sB += parseInt(inputs[0].value) || 0;
          sG += parseInt(inputs[1].value) || 0;
          stB += parseInt(inputs[2].value) || 0;
          stG += parseInt(inputs[3].value) || 0;
          oB += parseInt(inputs[4].value) || 0;
          oG += parseInt(inputs[5].value) || 0;
          gB += parseInt(inputs[6].value) || 0;
          gG += parseInt(inputs[7].value) || 0;
        }
      }
    });
    
    let tb = sB + stB + oB + gB;
    let tg = sG + stG + oG + gG;
    let tbody = document.getElementById("entryTableBody");
    if(!tbody) return;
    
    document.getElementById("entryTotalRow")?.remove();
    tbody.insertAdjacentHTML('beforeend', `<tr id="entryTotalRow" style="background:#f1f5f9;font-weight:bold;">
      <td style="text-align:center;">Total</td>
      <td style="text-align:center;">${sB}</td><td style="text-align:center;">${sG}</td>
      <td style="text-align:center;">${stB}</td><td style="text-align:center;">${stG}</td>
      <td style="text-align:center;">${oB}</td><td style="text-align:center;">${oG}</td>
      <td style="text-align:center;">${gB}</td><td style="text-align:center;">${gG}</td>
      <td style="text-align:center;">${tb}</td><td style="text-align:center;">${tg}</td>
      <td style="text-align:center;background:#dcfce7;color:#14532d;">${tb + tg}</td>
    </tr>`);
  },

  setFormLockStatus(isFrozen) {
    let inputs = document.querySelectorAll("#entryTableBody input");
    inputs.forEach(input => {
      input.disabled = isFrozen;
      if (isFrozen) {
        input.style.background = "#e2e8f0";
        input.style.color = "#475569";
      } else {
        input.style.background = "#ffffff";
        input.style.color = "#000000";
      }
    });

    let editBtn = document.getElementById("editToggleBtn");
    if(editBtn) {
      if(isFrozen) {
        editBtn.innerHTML = "🔓 Unlock to Edit";
        editBtn.style.background = "#1d4ed8";
      } else {
        editBtn.innerHTML = "🔒 Lock / Editing Active";
        editBtn.style.background = "#dc2626";
      }
    }
  },

  toggleEdit() {
    let sel = document.getElementById("schoolSelect");
    if(!sel || sel.value === "") return;

    let schools = SessionManager.getData();
    let s = schools[sel.value];
    if(!s) return;

    s.isFrozen = !s.isFrozen;
    SessionManager.saveData(schools);

    this.setFormLockStatus(s.isFrozen);
    alert(s.isFrozen ? "Data has been locked successfully!" : "Data is now unlocked. You can edit the entries.");
  },

  saveData() {
    let sel = document.getElementById("schoolSelect");
    if(!sel || sel.value === "") {
      alert("Please select a school first!");
      return;
    }
    
    let schools = SessionManager.getData();
    let s = schools[sel.value];
    if(!s) return;

    if(!s.classes) s.classes = {};

    let rows = document.querySelectorAll("#entryTableBody tr");
    const applicableClasses = this.getClassesForSchool(s.category);
    
    rows.forEach((row, idx) => {
      if(idx < applicableClasses.length) {
        let cName = applicableClasses[idx];
        let inputs = row.querySelectorAll("input");
        if(inputs.length >= 8) {
          s.classes[cName] = {
            scB: parseInt(inputs[0].value) || 0,
            scG: parseInt(inputs[1].value) || 0,
            stB: parseInt(inputs[2].value) || 0,
            stG: parseInt(inputs[3].value) || 0,
            obcB: parseInt(inputs[4].value) || 0,
            obcG: parseInt(inputs[5].value) || 0,
            genB: parseInt(inputs[6].value) || 0,
            genG: parseInt(inputs[7].value) || 0
          };
        }
      }
    });

    // Automatically freeze data upon saving
    s.isFrozen = true;

    SessionManager.saveData(schools);
    SessionManager.updateStats();
    SchoolRecords.render();
    CompilationModule.render();

    this.setFormLockStatus(true);
    alert("School data has been saved and frozen successfully!");
  }
};

window.EntryModule = EntryModule;
