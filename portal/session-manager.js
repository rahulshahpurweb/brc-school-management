import { AdminLocks } from './admin-locks.js';
import { MASTER_SCHOOLS } from './schools-data.js';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwjZYYhrYb_f9C6I4eK5j4DHzBJ4ZoglrRnEum0CJkQ_RkImrnzCW7wMsJakbaenT-gfQ/exec";

let cloudMemoryData = null;
let currentCloudSession = "2026-27";

export const SessionManager = {
  async getActiveSession() {
    try {  
      let response = await fetch(WEB_APP_URL + "?action=getSession");
      let res = await response.json();
      if (res && res.activeSession) {  
        currentCloudSession = res.activeSession;
        return res.activeSession;  
      }  
    } catch (e) {
      console.error("Session fetch error:", e);
    }
    return currentCloudSession;
  },

  async setActiveSession(sessionName) {
    currentCloudSession = sessionName;
    let payload = { action: "setSession", session: sessionName };

    try {
      await fetch(WEB_APP_URL, {  
        method: "POST",  
        mode: "no-cors",  
        headers: { "Content-Type": "text/plain;charset=utf-8" },  
        body: JSON.stringify(payload)  
      });
    } catch(e) {}

    location.reload();
  },

  async init() {
    await this.getActiveSession();
    this.renderDropdown();
    
    // Fetch live data directly from the cloud
    await this.fetchCloudDataDirectly();
    this.updateStats();
    this.applyRoleAccess();
  },

  async fetchCloudDataDirectly() {
    let activeSession = currentCloudSession;
    try {  
      let response = await fetch(`${WEB_APP_URL}?session=${activeSession}`);  
      let cloudData = await response.json();  
      if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {  
        cloudMemoryData = cloudData;  
      } else {
        let baseSchools = window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];  
        cloudMemoryData = JSON.parse(JSON.stringify(baseSchools));
      }
    } catch (err) {  
      console.error("Cloud Data Direct Fetch Error:", err);
      let baseSchools = window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];  
      cloudMemoryData = JSON.parse(JSON.stringify(baseSchools));
    }

    // Instantly update and refresh all UI renders and forms
    this.triggerAllRenders();
  },

  triggerAllRenders() {
    if(typeof SchoolRecords !== 'undefined' && SchoolRecords.render) SchoolRecords.render();  
    if(typeof CompilationModule !== 'undefined' && CompilationModule.render) CompilationModule.render();
    
    // Refresh the data entry form or school dropdown if present on the page
    if(typeof window.loadSchoolData === 'function') {
      window.loadSchoolData();
    }
  },

  renderDropdown() {
    let select = document.getElementById("sessionSelect");
    let sessions = [
      { id: "2026-27", name: "2026-27" },
      { id: "2027-28", name: "2027-28" },
      { id: "2028-29", name: "2028-29" }
    ];

    let current = currentCloudSession;  
    let currentUser = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");  
    let isAdmin = (currentUser.role === 'admin');  

    if(select && isAdmin) {  
      select.innerHTML = "";  
      sessions.forEach(s => {  
        let opt = document.createElement("option");  
        opt.value = s.id;  
        opt.textContent = s.name;  
        if(s.id === current) opt.selected = true;  
        select.appendChild(opt);  
      });  
      select.disabled = false;  
    } else if (select && !isAdmin) {  
      select.style.display = 'none';  
    }  

    let sessionBadge = document.getElementById("sessionBadge");  
    if (sessionBadge) {  
      sessionBadge.innerText = current;  
      sessionBadge.style.display = 'inline-block';  
    }
  },

  changeSession() {
    let select = document.getElementById("sessionSelect");
    if(!select) return;
    this.setActiveSession(select.value);
  },

  getData() {
    if (cloudMemoryData && Array.isArray(cloudMemoryData)) {
      return cloudMemoryData;
    }
    return window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];
  },

  async saveData(schoolsData) {
    let activeSession = currentCloudSession;

    if (Array.isArray(schoolsData)) {  
      cloudMemoryData = schoolsData;  
    } else if (schoolsData && schoolsData.udise) {  
      if (!cloudMemoryData) cloudMemoryData = window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];
      let index = cloudMemoryData.findIndex(s => String(s.udise).trim() === String(schoolsData.udise).trim());  
      if (index !== -1) cloudMemoryData[index] = schoolsData;  
      else cloudMemoryData.push(schoolsData);  
    }  

    this.updateStats();  
    this.triggerAllRenders();
    alert("Data saved successfully!");  

    let payload = { session: activeSession, data: cloudMemoryData };  
    try {
      await fetch(WEB_APP_URL, {  
        method: "POST",  
        mode: "no-cors",  
        headers: { "Content-Type": "text/plain;charset=utf-8" },  
        body: JSON.stringify(payload)  
      });
      console.log("Cloud synced successfully");
    } catch(err) {  
      console.error("Cloud Sync Error:", err);  
    }
  },

  updateStats() {
    let schools = this.getData();
    let totalSchools = schools.length;
    let totalEnroll = 0, filled = 0;

    schools.forEach(s => {  
      let hasData = false;  
      let classesObj = s.classes || {};  
      Object.keys(classesObj).forEach(cName => {  
        let c = classesObj[cName] || {};  
        let sum = Object.values(c).reduce((a, b) => a + (parseInt(b) || 0), 0);  
        if (sum > 0) {  
          hasData = true;  
          totalEnroll += sum;  
        }  
      });  
      if (hasData) filled++;  
    });  

    let statSchools = document.getElementById("statSchools");  
    let statTotal = document.getElementById("statTotal");  
    let statFilled = document.getElementById("statFilled");  
    let statPending = document.getElementById("statPending");  

    if(statSchools) statSchools.innerText = totalSchools;  
    if(statTotal) statTotal.innerText = totalEnroll;  
    if(statFilled) statFilled.innerText = filled;  
    if(statPending) statPending.innerText = totalSchools - filled;
  },

  getCurrentUser() {
    let session = localStorage.getItem("brc_current_user");
    return session ? JSON.parse(session) : null;
  },

  applyRoleAccess() {
    let currentUser = this.getCurrentUser();
    if(!currentUser) return;
    let role = currentUser.role;

    if(role === "jsk") {  
      let dataEntryTab = document.querySelector("[data-target='entry']") || document.getElementById("entrySection");  
      let schoolListTab = document.querySelector("[data-target='records']") || document.getElementById("recordsSection");  
      if(dataEntryTab) dataEntryTab.style.display = "none";  
      if(schoolListTab) schoolListTab.style.display = "none";  
    }  
    else if(role === "school") {  
      let compilationTab = document.querySelector("[data-target='compilation']") || document.getElementById("compilationSection");  
      if(compilationTab) compilationTab.style.display = "none";  
    }
  }
};

window.SessionManager = SessionManager;
