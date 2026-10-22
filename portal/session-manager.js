import { AdminLocks } from './admin-locks.js';
import { MASTER_SCHOOLS } from './schools-data.js';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwjZYYhrYb_f9C6I4eK5j4DHzBJ4ZoglrRnEum0CJkQ_RkImrnzCW7wMsJakbaenT-gfQ/exec";

// In-Memory store (No LocalStorage for school data)
window._cloudSchoolsData = [];
window._activeCloudSession = "2026-27";

export const SessionManager = {
  getActiveSession() {
    return window._activeCloudSession;
  },

  setActiveSession(sessionName) {
    window._activeCloudSession = sessionName;
    let payload = { action: "setSession", session: sessionName };

    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(() => {
      location.reload();
    });
  },

  async init() {
    // Session aur Cloud se live data turant fetch karo
    await this.fetchActiveSessionFromCloud();
    await this.fetchCloudData();
    
    this.renderDropdown();
    this.updateStats();
    this.applyRoleAccess();

    if(typeof SchoolRecords !== 'undefined' && SchoolRecords.render) SchoolRecords.render();
    if(typeof CompilationModule !== 'undefined' && CompilationModule.render) CompilationModule.render();
  },

  async fetchActiveSessionFromCloud() {
    try {
      let response = await fetch(WEB_APP_URL + "?action=getSession");
      let res = await response.json();
      if (res && res.activeSession) {
        window._activeCloudSession = res.activeSession;
      }
    } catch (e) {
      console.error("Session Fetch Error:", e);
    }
  },

  async fetchCloudData() {
    let activeSession = this.getActiveSession();
    try {
      let response = await fetch(`${WEB_APP_URL}?session=${activeSession}`);
      let cloudData = await response.json();
      if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
        window._cloudSchoolsData = cloudData;
        return;
      }
    } catch (err) {
      console.error("Cloud Data Fetch Error:", err);
    }

    // Fallback agar cloud data na mile toh master schools ka structure load kar do
    let baseSchools = window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];
    let freshSchools = JSON.parse(JSON.stringify(baseSchools));
    freshSchools.forEach(s => {
      if (s.classes) {
        Object.keys(s.classes).forEach(cName => {
          let c = s.classes[cName];
          Object.keys(c).forEach(k => c[k] = 0);
        });
      }
    });
    window._cloudSchoolsData = freshSchools;
  },

  renderDropdown() {
    let select = document.getElementById("sessionSelect");
    let sessions = [
      { id: "2026-27", name: "2026-27" },
      { id: "2027-28", name: "2027-28" },
      { id: "2028-29", name: "2028-29" }
    ];

    let current = this.getActiveSession();
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

  // Synchronous data return from memory (No LocalStorage)
  getData() {
    if (!window._cloudSchoolsData || window._cloudSchoolsData.length === 0) {
      return window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];
    }
    return window._cloudSchoolsData;
  },

  // Data save seedhe Google Sheet par cloud POST request ke zariye
  async saveData(schoolsData) {
    let activeSession = this.getActiveSession();
    let allSchools = this.getData();

    if (Array.isArray(schoolsData)) {
      allSchools = schoolsData;
    } else if (schoolsData && schoolsData.udise) {
      let index = allSchools.findIndex(s => String(s.udise) === String(schoolsData.udise));
      if (index !== -1) allSchools[index] = schoolsData;
      else allSchools.push(schoolsData);
    }

    window._cloudSchoolsData = allSchools;
    this.updateStats();
    alert("Data cloud par save ho raha hai...");

    let payload = { session: activeSession, data: allSchools };
    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      alert("Data safaltapurvak Google Sheet par save ho gaya!");
    } catch (err) {
      console.error("Cloud Save Error:", err);
      alert("Cloud par save karne mein error aayi!");
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
    let session = localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user");
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
