import { AdminLocks } from './admin-locks.js';
import { MASTER_SCHOOLS } from './schools-data.js';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwc86P21oguytplVIndZSiNIJI4grgT9fjhEfWozm6R8S4l-FGHkE6AJDi7SECT2LWkCQ/exec";

export const SessionManager = {
  async init() {
    this.renderDropdown();
    await this.loadCloudData();
    this.updateStats();
    this.applyRoleAccess();
    
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
    
    let sessions = [
      { id: "2026-27", name: "2026-27", locked: false },
      { id: "2027-28", name: "2027-28", locked: true },
      { id: "2028-29", name: "2028-29", locked: true }
    ];

    try {
      if (typeof AdminLocks !== 'undefined' && AdminLocks.getSessions) {
        sessions = AdminLocks.getSessions();
      } else if (typeof FeaturePermissions !== 'undefined' && FeaturePermissions.getSessions) {
        sessions = FeaturePermissions.getSessions();
      }
    } catch(e) {}

    let current = localStorage.getItem("brc_active_session") || "2026-27";

    select.innerHTML = "";
    sessions.forEach(s => {
      let opt = document.createElement("option");
      opt.value = s.id;
      // Ab yahan sirf clean format dikhega, locked par lock icon ke sath
      opt.textContent = s.locked ? `${s.name} 🔒 (Locked)` : `${s.name} 🔓 (Active)`;
      if(s.id === current) opt.selected = true;
      select.appendChild(opt);
    });
  },

  changeSession() {
    let select = document.getElementById("sessionSelect");
    if(!select) return;
    let targetSession = select.value;

    // Sabhi users dropdown se koi bhi session select karke purana data dekh sakte hain (Read-Only)
    localStorage.setItem("brc_active_session", targetSession);
    this.renderDropdown();
    location.reload(); 
  },

  getData() {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    let dataKey = `brc_schools_data_${activeSession}`;
    let saved = localStorage.getItem(dataKey);

    if (!saved) {
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

      localStorage.setItem(dataKey, JSON.stringify(freshSchools));
      return freshSchools;
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
      let response = await fetch(`${WEB_APP_URL}?session=${activeSession}`);
      let cloudData = await response.json();
      
      if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
        localStorage.setItem(dataKey, JSON.stringify(cloudData));
        this.updateStats();
        if(typeof SchoolRecords !== 'undefined' && SchoolRecords.render) SchoolRecords.render();
        if(typeof CompilationModule !== 'undefined' && CompilationModule.render) CompilationModule.render();
      }
    } catch (err) {
      console.error("Cloud Load Error:", err);
    }
    this.updateStats();
  },

  saveData(schoolsData) {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    
    let currentUser = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    let isAdmin = (currentUser.role === 'admin');

    let sessions = [];
    try {
      if (typeof AdminLocks !== 'undefined' && AdminLocks.getSessions) {
        sessions = AdminLocks.getSessions();
      } else if (typeof FeaturePermissions !== 'undefined' && FeaturePermissions.getSessions) {
        sessions = FeaturePermissions.getSessions();
      }
    } catch(e) {}

    let currentSessionObj = sessions.find(s => s.id === activeSession);
    
    // 🛑 Yahan check hoga: Agar session locked hai aur user Admin nahi hai, toh save bilkul nahi hoga!
    if (currentSessionObj && currentSessionObj.locked && !isAdmin) {
      alert("⚠️ Yeh academic session locked (freeze) hai! Aap is purane session mein naya data save ya edit nahi kar sakte, yeh sirf dekhne ke liye hai.");
      return;
    }

    let dataKey = `brc_schools_data_${activeSession}`;
    localStorage.setItem(dataKey, schoolsData ? JSON.stringify(schoolsData) : JSON.stringify([]));
    this.updateStats();

    let payload = {
      session: activeSession,
      data: schoolsData
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log(`Data (${activeSession}) saved!`);
    }).catch(err => {
      console.error("Save Error:", err);
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
    let statBoysGirls = document.getElementById("statBoysGirls");
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
