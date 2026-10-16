import { SessionManager } from './session-manager.js';
import { SchoolRecords } from './school-records.js';
import { CompilationModule } from './compilation.js';

export const EntryModule = {
  populateDropdown() {
    let schools = SessionManager.getData();
    let sel = document.getElementById("schoolSelect");
    if(!sel) return;
    sel.innerHTML = "";
    schools.forEach((s, idx) => {
      let opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `${s.name} (UDISE: ${s.udise} | JSK: ${s.jsk})`;
      sel.appendChild(opt);
    });
    this.loadForm();
  },

  loadForm() {
    let sel = document.getElementById("schoolSelect");
    if(!sel || sel.value === "") return;
    let schools = SessionManager.getData();
    let s = schools[sel.value];
    let tbody = document.getElementById("entryTableBody");
    if(!tbody) return;
    tbody.innerHTML = "";

    const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
    classes.forEach(c => {
      if(!s.classes[c]) s.classes[c] = {scB:0,scG:0,stB:0,stG:0,obcB:0,obcG:0,genB:0,genG:0};
      let cl = s.classes[c], rId = c.replace(" ", "_");
      
      // By default inputs are disabled (Frozen) for safety
      tbody.innerHTML += `<tr>
        <td style="font-weight:bold;background:#f8fafc;">${c}</td>
        <td><input type="number" id="${rId}_scB" value="${cl.scB}" oninput="EntryModule.calc('${rId}')" disabled style="width:100%;border:0;text-align:center;background:#f1f5f9;"></td>
        <td><input type="number" id="${rId}_scG" value="${cl.scG}" oninput="EntryModule.calc('${rId}')" disabled style="width:100%;border:0;text-align:center;background:#f1f5f9;"></td>
        <td><input type="number" id="${rId}_stB" value="${cl.stB}" oninput="EntryModule.calc('${rId}')" disabled style="width:100%;border:0;text-align:center;background:#f1f5f9;"></td>
        <td><input type="number" id="${rId}_stG" value="${cl.stG}" oninput="EntryModule.calc('${rId}')" disabled style="width:100%;border:0;text-align:center;background:#f1f5f9;"></td>
        <td><input type="number" id="${rId}_obcB" value="${cl.obcB}" oninput="EntryModule.calc('${rId}')" disabled style="width:100%;border:0;text-align:center;background:#f1f5f9;"></td>
        <td><input type="number" id="${rId}_obcG" value="${cl.obcG}" oninput="EntryModule.calc('${rId}')" disabled style="width:100%;border:0;text-align:center;background:#f1f5f9;"></td>
        <td><input type="number" id="${rId}_genB" value="${cl.genB}" oninput="EntryModule.calc('${rId}')" disabled style="width:100%;border:0;text-align:center;background:#f1f5f9;"></td>
        <td><input type="number" id="${rId}_genG" value="${cl.genG}" oninput="EntryModule.calc('${rId}')" disabled style="width:100%;border:0;text-align:center;background:#f1f5f9;"></td>
        <td id="${rId}_totB">${cl.scB+cl.stB+cl.obcB+cl.genB}</td>
        <td id="${rId}_totG">${cl.scG+cl.stG+cl.obcG+cl.genG}</td>
        <td id="${rId}_T" style="font-weight:bold;background:#eef2ff;">${cl.scB+cl.scG+cl.stB+cl.stG+cl.obcB+cl.obcG+cl.genB+cl.genG}</td>
      </tr>`;
    });
    this.addTotalRow();

    let editBtn = document.getElementById("editToggleBtn");
    if(editBtn) {
      editBtn.innerHTML = "🔓 Unlock to Edit (डेटा एडिट करें)";
      editBtn.style.background = "#1d4ed8";
    }
  },

  toggleEdit() {
    let inputs = document.querySelectorAll("#entryTableBody input[type='number']");
    let editBtn = document.getElementById("editToggleBtn");
    if(inputs.length === 0) return;
    
    let isLocked = inputs[0].disabled;
    if(isLocked) {
      inputs.forEach(inp => {
        inp.disabled = false;
        inp.style.background = "#fff"; 
      });
      editBtn.innerHTML = "🔒 Lock Mode (Editing Active)";
      editBtn.style.background = "#d97706";
    } else {
      inputs.forEach(inp => {
        inp.disabled = true;
        inp.style.background = "#f1f5f9"; 
      });
      editBtn.innerHTML = "🔓 Unlock to Edit (डेटा एडिट करें)";
      editBtn.style.background = "#1d4ed8";
    }
  },

  calc(rId) {
    let scB = parseInt(document.getElementById(`${rId}_scB`).value)||0, scG = parseInt(document.getElementById(`${rId}_scG`).value)||0;
    let stB = parseInt(document.getElementById(`${rId}_stB`).value)||0, stG = parseInt(document.getElementById(`${rId}_stG`).value)||0;
    let obcB = parseInt(document.getElementById(`${rId}_obcB`).value)||0, obcG = parseInt(document.getElementById(`${rId}_obcG`).value)||0;
    let genB = parseInt(document.getElementById(`${rId}_genB`).value)||0, genG = parseInt(document.getElementById(`${rId}_genG`).value)||0;
    document.getElementById(`${rId}_totB`).innerText = scB+stB+obcB+genB;
    document.getElementById(`${rId}_totG`).innerText = scG+stG+obcG+genG;
    document.getElementById(`${rId}_T`).innerText = scB+scG+stB+stG+obcB+obcG+genB+genG;
    this.addTotalRow();
  },

  addTotalRow() {
    let sB=0, sG=0, stB=0, stG=0, oB=0, oG=0, gB=0, gG=0;
    ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
      let rId = c.replace(" ", "_");
      sB += parseInt(document.getElementById(`${rId}_scB`)?.value||0); sG += parseInt(document.getElementById(`${rId}_scG`)?.value||0);
      stB += parseInt(document.getElementById(`${rId}_stB`)?.value||0); stG += parseInt(document.getElementById(`${rId}_stG`)?.value||0);
      oB += parseInt(document.getElementById(`${rId}_obcB`)?.value||0); oG += parseInt(document.getElementById(`${rId}_obcG`)?.value||0);
      gB += parseInt(document.getElementById(`${rId}_genB`)?.value||0); gG += parseInt(document.getElementById(`${rId}_genG`)?.value||0);
    });
    let tb = sB+stB+oB+gB, tg = sG+stG+oG+gG;
    let tbody = document.getElementById("entryTableBody");
    if(!tbody) return;
    document.getElementById("entryTotalRow")?.remove();
    tbody.innerHTML += `<tr id="entryTotalRow" class="total-row"><td>Total</td><td>${sB}</td><td>${sG}</td><td>${stB}</td><td>${stG}</td><td>${oB}</td><td>${oG}</td><td>${gB}</td><td>${gG}</td><td>${tb}</td><td>${tg}</td><td>${tb+tg}</td></tr>`;
  },

  saveData() {
    let sel = document.getElementById("schoolSelect");
    if(!sel || sel.value === "") return;
    let schools = SessionManager.getData();
    let s = schools[sel.value];
    ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
      let rId = c.replace(" ", "_");
      s.classes[c] = {
        scB: parseInt(document.getElementById(`${rId}_scB`).value)||0, scG: parseInt(document.getElementById(`${rId}_scG`).value)||0,
        stB: parseInt(document.getElementById(`${rId}_stB`).value)||0, stG: parseInt(document.getElementById(`${rId}_stG`).value)||0,
        obcB: parseInt(document.getElementById(`${rId}_obcB`).value)||0, obcG: parseInt(document.getElementById(`${rId}_obcG`).value)||0,
        genB: parseInt(document.getElementById(`${rId}_genB`).value)||0, genG: parseInt(document.getElementById(`${rId}_genG`).value)||0
      };
    });
    SessionManager.saveData(schools);
    SessionManager.updateStats();
    SchoolRecords.render();
    CompilationModule.render();
    
    // Save ke turant baad inputs ko wapas freeze (lock) kar dein
    let inputs = document.querySelectorAll("#entryTableBody input[type='number']");
    inputs.forEach(inp => {
      inp.disabled = true;
      inp.style.background = "#f1f5f9";
    });
    let editBtn = document.getElementById("editToggleBtn");
    if(editBtn) {
      editBtn.innerHTML = "🔓 Unlock to Edit (डेटा एडिट करें)";
      editBtn.style.background = "#1d4ed8";
    }

    alert("School ka data safaltapurvak save aur freeze ho gaya hai!");
  }
};
