import { AdminLocks } from './admin-locks.js';
import { MASTER_SCHOOLS } from './schools-data.js';

export const SessionManager = {
  init() {
    this.renderDropdown();
    this.updateStats();
    
    // Listen for storage changes across tabs/devices if synced
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.includes('brc_schools_data')) {
        this.updateStats();
        if(typeof SchoolRecords !== 'undefined' && SchoolRecords.render) SchoolRecords.render();
        if(typeof CompilationModule !== 'undefined' && CompilationModule.render) CompilationModule.render();
      }
    });
  },

  renderDropdown() {
    let select = document.getElementById("sessionSelect");
    if(!select) return;
    let sessions = AdminLocks.getSessions();
    let current = localStorage.getItem("brc_active_session") || "2026-27";

    select.innerHTML = "";
    sessions.forEach(s => {
      let opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.locked ? `🔒 ${s.name} (Locked)` : `🔓 ${s.name}`;
      if(s.id === current) opt.selected = true;
      select.appendChild(opt);
    });
  },

  changeSession() {
    let select = document.getElementById("sessionSelect");
    if(!select) return;
    let targetSession = select.value;
    localStorage.setItem("brc_active_session", targetSession);
    this.renderDropdown();
    location.reload(); 
  },

  getData() {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    let dataKey = `brc_schools_data_${activeSession}`;
    let saved = localStorage.getItem(dataKey);

    if (!saved) {
      return window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];
    }
  },

  saveData(schoolsData) {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    let dataKey = `brc_schools_data_${activeSession}`;
    localStorage.setItem(dataKey, JSON.stringify(schoolsData));
    
    // Force trigger update stats instantly
    this.updateStats();
  },

  updateStats() {
    let schools = this.getData();
    let totalSchools = schools.length;
    let totalEnroll = 0, boys = 0, girls = 0, filled = 0;

    schools.forEach(s => {
      let hasData = false;
      Object.values(s.classes || {}).forEach(c => {
        let sum = (c.scB||0)+(c.scG||0)+(c.stB||0)+(c.stG||0)+(c.obcB||0)+(c.obcG||0)+(c.genB||0)+(c.genG||0);
        if (sum > 0) hasData = true;
        boys += (c.scB||0) + (c.stB||0) + (c.obcB||0) + (c.genB||0);
        girls += (c.scG||0) + (c.stG||0) + (c.obcG||0) + (c.genG||0);
        totalEnroll += sum;
      });
      if (hasData) filled++;
    });

    let statSchools = document.getElementById("statSchools");
    let statTotal = document.getElementById("statTotal");
    let statBoysGirls = document.getElementById("statBoysGirls");
    let statFilled = document.getElementById("statFilled");
    let statPending = document.getElementById("statPending");

    if(statSchools) statSchools.innerText = totalSchools;
    if(statTotal) statTotal.innerText = totalEnroll;
    if(statBoysGirls) statBoysGirls.innerText = `Boys: ${boys} | Girls: ${girls}`;
    if(statFilled) statFilled.innerText = filled;
    if(statPending) statPending.innerText = totalSchools - filled;
  }
};
