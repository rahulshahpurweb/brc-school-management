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
    const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
    
    classes.forEach(c => {
      if(!s.classes) s.classes = {};
      if(!s.classes[c]) {
        s.classes[c] = {scB:0, scG:0, stB:0, stG:0, obcB:0, obcG:0, genB:0, genG:0};
      }
      
      let cl = s.classes[c];
      let rId = c.replace(" ", "_");
      
      let totB = (cl.scB||0) + (cl.stB||0) + (cl.obcB||0) + (cl.genB||0);
      let totG = (cl.scG||0) + (cl.stG||0) + (cl.obcG||0) + (cl.genG||0);
      let totalT = totB + totG;

      tbody.innerHTML += `<tr>
        <td style="font-weight:bold;background:#f8fafc;vertical-align:middle;">${c}</td>
        <td><input type="number" min="0" class="entry-input" data-rid="${rId}" data-field="scB" value="${cl.scB || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" data-rid="${rId}" data-field="scG" value="${cl.scG || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" data-rid="${rId}" data-field="stB" value="${cl.stB || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" data-rid="${rId}" data-field="stG" value="${cl.stG || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" data-rid="${rId}" data-field="obcB" value="${cl.obcB || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" data-rid="${rId}" data-field="obcG" value="${cl.obcG || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" data-rid="${rId}" data-field="genB" value="${cl.genB || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td><input type="number" min="0" class="entry-input" data-rid="${rId}" data-field="genG" value="${cl.genG || 0}" style="width:100%;border:1px solid #cbd5e1;padding:4px;text-align:center;"></td>
        <td id="${rId}_totB" style="text-align:center;font-weight:bold;">${totB}</td>
        <td id="${rId}_totG" style="text-align:center;font-weight:bold;">${totG}</td>
        <td id="${rId}_T" style="text-align:center;font-weight:bold;background:#eef2ff;">${totalT}</td>
      </tr>`;
    });
    
    // Turant saari classes ke liye calc run kar do taaki totals show ho jayein
    classes.forEach(c => {
      this.calc(c.replace(" ", "_"));
    });

    this.attachListeners();
  },

  attachListeners() {
    let inputs = document.querySelectorAll(".entry-input");
    inputs.forEach(input => {
      input.addEventListener("input", (e) => {
        let rId = e.target.getAttribute("data-rid");
        this.calc(rId);
      });
    });
  },

  calc(rId) {
    let scB = parseInt(document.getElementById(`${rId}_scB`)?.value) || 0;
    let scG = parseInt(document.getElementById(`${rId}_scG`)?.value) || 0;
    let stB = parseInt(document.getElementById(`${rId}_stB`)?.value) || 0;
    let stG = parseInt(document.getElementById(`${rId}_stG`)?.value) || 0;
    let obcB = parseInt(document.getElementById(`${rId}_obcB`)?.value) || 0;
    let obcG = parseInt(document.getElementById(`${rId}_obcG`)?.value) || 0;
    let genB = parseInt(document.getElementById(`${rId}_genB`)?.value) || 0;
    let genG = parseInt(document.getElementById(`${rId}_genG`)?.value) || 0;

    let totBNode = document.getElementById(`${rId}_totB`);
    let totGNode = document.getElementById(`${rId}_totG`);
    let tNode = document.getElementById(`${rId}_T`);

    if(totBNode) totBNode.innerText = scB + stB + obcB + genB;
    if(totGNode) totGNode.innerText = scG + stG + obcG + genG;
    if(tNode) tNode.innerText = scB + scG + stB + stG + obcB + obcG + genB + genG;
    
    this.addTotalRow();
  },

  addTotalRow() {
    let sB=0, sG=0, stB=0, stG=0, oB=0, oG=0, gB=0, gG=0;
    ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
      let rId = c.replace(" ", "_");
      sB += parseInt(document.getElementById(`${rId}_scB`)?.value || 0); 
      sG += parseInt(document.getElementById(`${rId}_scG`)?.value || 0);
      stB += parseInt(document.getElementById(`${rId}_stB`)?.value || 0); 
      stG += parseInt(document.getElementById(`${rId}_stG`)?.value || 0);
      oB += parseInt(document.getElementById(`${rId}_obcB`)?.value || 0); 
      oG += parseInt(document.getElementById(`${rId}_obcG`)?.value || 0);
      gB += parseInt(document.getElementById(`${rId}_genB`)?.value || 0); 
      gG += parseInt(document.getElementById(`${rId}_genG`)?.value || 0);
    });
    
    let tb = sB + stB + oB + gB;
    let tg = sG + stG + oG + gG;
    let tbody = document.getElementById("entryTableBody");
    if(!tbody) return;
    
    document.getElementById("entryTotalRow")?.remove();
    tbody.innerHTML += `<tr id="entryTotalRow" style="background:#f1f5f9;font-weight:bold;">
      <td style="text-align:center;">Total</td>
      <td style="text-align:center;">${sB}</td><td style="text-align:center;">${sG}</td>
      <td style="text-align:center;">${stB}</td><td style="text-align:center;">${stG}</td>
      <td style="text-align:center;">${oB}</td><td style="text-align:center;">${oG}</td>
      <td style="text-align:center;">${gB}</td><td style="text-align:center;">${gG}</td>
      <td style="text-align:center;">${tb}</td><td style="text-align:center;">${tg}</td>
      <td style="text-align:center;background:#dcfce7;color:#14532d;">${tb + tg}</td>
    </tr>`;
  },

  saveData() {
    let sel = document.getElementById("schoolSelect");
    if(!sel || sel.value === "") {
      alert("Kripya pehle school chunein!");
      return;
    }
    
    let schools = SessionManager.getData();
    let s = schools[sel.value];
    if(!s) return;

    if(!s.classes) s.classes = {};

    ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
      let rId = c.replace(" ", "_");
      s.classes[c] = {
        scB: parseInt(document.getElementById(`${rId}_scB`)?.value) || 0, 
        scG: parseInt(document.getElementById(`${rId}_scG`)?.value) || 0,
        stB: parseInt(document.getElementById(`${rId}_stB`)?.value) || 0, 
        stG: parseInt(document.getElementById(`${rId}_stG`)?.value) || 0,
        obcB: parseInt(document.getElementById(`${rId}_obcB`)?.value) || 0, 
        obcG: parseInt(document.getElementById(`${rId}_obcG`)?.value) || 0,
        genB: parseInt(document.getElementById(`${rId}_genB`)?.value) || 0, 
        genG: parseInt(document.getElementById(`${rId}_genG`)?.value) || 0
      };
    });

    SessionManager.saveData(schools);
    SessionManager.updateStats();
    SchoolRecords.render();
    CompilationModule.render();
    alert("School ka data safaltapurvak save aur cloud par sync ho gaya hai!");
  }
};

window.EntryModule = EntryModule;
