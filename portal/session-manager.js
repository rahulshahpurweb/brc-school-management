import { AdminLocks } from './admin-locks.js';

export const SessionManager = {
  init() {
    this.renderDropdown();
    this.updateStats();
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

    // Check if locked
    if(AdminLocks.isLocked(targetSession)) {
      let pass = prompt(`Session ${targetSession} locked hai! Unlock karne ke liye BRC Admin Password darj karein:`);
      if(pass) {
        let success = AdminLocks.toggleLock(targetSession, pass);
        if(!success) {
          this.renderDropdown(); // reset select
          return;
        }
      } else {
        this.renderDropdown(); // reset select
        return;
      }
    }

    localStorage.setItem("brc_active_session", targetSession);
    this.renderDropdown();
    location.reload(); // Refresh to load that session's data safely
  },

  getData() {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    let dataKey = `brc_schools_data_${activeSession}`;
    let saved = localStorage.getItem(dataKey);
    
    if(!saved) {
      // Return default master data if not saved for this session yet
      return window.MASTER_SCHOOLS || [];
    }
    return JSON.parse(saved);
  },

  saveData(schoolsData) {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    let dataKey = `brc_schools_data_${activeSession}`;
    localStorage.setItem(dataKey, JSON.stringify(schoolsData));
  },

  updateStats() {
    let schools = this.getData();
    let totalSchools = schools.length;
    let totalEnroll = 0, boys = 0, girls = 0, filled = 0;

    schools.forEach(s => {
      let hasData = false;
      Object.values(s.classes || {}).forEach(c => {
        let sum = (c.scB||0)+(c.scG||0)+(c.stB||0)+(c.stG||0)+(c.obcB||0)+(c.obcG||0)+(c.genB||0)+(c.genG||0);
        if(sum > 0) hasData = true;
        boys += (c.scB||0)+(c.stB||0)+(c.obcB||0)+(c.genB||0);
        girls += (c.scG||0)+(c.stG||0)+(c.obcG||0)+(c.genG||0);
        totalEnroll += sum;
      });
      if(hasData) filled++;
    });

    if(document.getElementById("statSchools")) document.getElementById("statSchools").innerText = totalSchools;
    if(document.getElementById("statTotal")) document.getElementById("statTotal").innerText = totalEnroll;
    if(document.getElementById("statBoysGirls")) document.getElementById("statBoysGirls").innerText = `Boys: ${boys} | Girls: ${girls}`;
    if(document.getElementById("statFilled")) document.getElementById("statFilled").innerText = filled;
    if(document.getElementById("statPending")) document.getElementById("statPending").innerText = totalSchools - filled;
  }
};
