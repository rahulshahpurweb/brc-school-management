import { AdminLocks } from './admin-locks.js';
import { MASTER_SCHOOLS } from './schools-data.js';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwc86P21oguytplVIndZSiNIJI4grgT9fjhEfWozm6R8S4l-FGHkE6AJDi7SECT2LWkCQ/exec";

export const SessionManager = {
  async init() {
    this.renderDropdown();
    await this.loadCloudData();
    this.updateStats();
    
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

  async loadCloudData() {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    let dataKey = `brc_schools_data_${activeSession}`;
    
    try {
      console.log("Google Sheet Cloud se data laya ja raha hai...");
      let response = await fetch(WEB_APP_URL);
      let cloudData = await response.json();
      
      if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
        localStorage.setItem(dataKey, JSON.stringify(cloudData));
        console.log("Cloud data successfully load ho gaya!");
      }
    } catch (err) {
      console.error("Cloud Load Error, local storage use ho raha hai:", err);
    }
    this.updateStats();
  },

  saveData(schoolsData) {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    let dataKey = `brc_schools_data_${activeSession}`;
    
    // 1. LocalStorage par turant save karo taaki UI fast chale
    localStorage.setItem(dataKey, JSON.stringify(schoolsData));
    this.updateStats();

    // 2. Background mein Google Sheet par data bhejo (POST)
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(schoolsData)
    }).then(() => {
      console.log("Data Google Sheet par safaltapurvak save ho gaya!");
    }).catch(err => {
      console.error("Google Sheet Save Error:", err);
    });
  },

  updateStats() {
    let schools = this.getData();
    let totalSchools = schools.length;
    let totalEnroll = 0, boys = 0, girls = 0, filled = 0;

    schools.forEach(s => {
      let hasData = false;
      let classesObj = s.classes || {};
      
      Object.keys(classesObj).forEach(cName => {
        let c = classesObj[cName] || {};
        let scB = parseInt(c.scB) || 0;
        let scG = parseInt(c.scG) || 0;
        let stB = parseInt(c.stB) || 0;
        let stG = parseInt(c.stG) || 0;
        let obcB = parseInt(c.obcB) || 0;
        let obcG = parseInt(c.obcG) || parseInt(c.obg) || 0;
        let genB = parseInt(c.genB) || 0;
        let genG = parseInt(c.genG) || parseInt(c.geng) || 0;

        let sum = scB + scG + stB + stG + obcB + obcG + genB + genG;
        
        if (sum > 0) {
          hasData = true;
          totalEnroll += sum;
          boys += (scB + stB + obcB + genB);
          girls += (scG + stG + obcG + genG);
        }
      });
      
      if (hasData) {
        filled++;
      }
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

window.SessionManager = SessionManager;
