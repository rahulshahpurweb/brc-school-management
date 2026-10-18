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
    
    // Sirf saaf-saaf years rakhe hain, koi extra tags nahi
    let sessions = [
      { id: "2026-27", name: "2026-27" },
      { id: "2027-28", name: "2027-28" },
      { id: "2028-29", name: "2028-29" }
    ];

    let current = (typeof FeaturePermissions !== 'undefined' && FeaturePermissions.getActiveSession) ? 
                  FeaturePermissions.getActiveSession() : 
                  (localStorage.getItem("brc_active_session") || "2026-27");

    let currentUser = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    let isAdmin = (currentUser.role === 'admin');

    if(select && isAdmin) {
      select.innerHTML = "";
      sessions.forEach(s => {
        let opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.name; // Sirf year ka naam dikhega
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
    let targetSession = select.value;

    if (typeof FeaturePermissions !== 'undefined' && FeaturePermissions.setActiveSession) {
      FeaturePermissions.setActiveSession(targetSession);
    } else {
      localStorage.setItem("brc_active_session", targetSession);
    }
    
    this.renderDropdown();
    location.reload(); 
  },

  getData() {
    let activeSession = (typeof FeaturePermissions !== 'undefined' && FeaturePermissions.getActiveSession) ? 
                        FeaturePermissions.getActiveSession() : 
                        (localStorage.getItem("brc_active_session") || "2026-27");
                        
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
    let activeSession = (typeof FeaturePermissions !== 'undefined' && FeaturePermissions.getActiveSession) ? 
                        FeaturePermissions.getActiveSession() : 
                        (localStorage.getItem("brc_active_session") || "2026-27");
                        
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
    let activeSession = (typeof FeaturePermissions !== 'undefined' && FeaturePermissions.getActiveSession) ? 
                        FeaturePermissions.getActiveSession() : 
                        (localStorage.getItem("brc_active_session") || "2026-27");
    
    let currentUser = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    let isAdmin = (currentUser.role === 'admin');

    let sessions = [];
    try {
      if (typeof AdminLocks !== 'undefined' && AdminLocks.getSessions) {
        sessions = AdminLocks.getSessions();
      }
    } catch(e) {}

    let currentSessionObj = sessions.find(s => s.id === activeSession);
    let settings = FeaturePermissions.getSettings();
    let hasSpecialPermission = (currentUser.role === 'school' && settings.school_can_edit_locked_session) || 
                               (currentUser.role === 'jsk' && settings.jsk_can_edit_locked_session);
    
    // Agar session locked hai aur permission nahi hai toh rok do
    if (currentSessionObj && currentSessionObj.locked && !isAdmin && !hasSpecialPermission) {
      alert("⚠️ Yeh academic session locked hai! Admin ne isme entry ki permission nahi di hai.");
      return;
    }

    let dataKey = `brc_schools_data_${activeSession}`;
    
    // 1. Pehle local storage mein poori tarah se data update aur save karo
    let allSchools = this.getData(); // Current session ka data uthao
    
    // Agar schoolsData mein sirf ek school ka data hai ya poora array hai, toh use merge/update karo
    if (Array.isArray(schoolsData)) {
      localStorage.setItem(dataKey, JSON.stringify(schoolsData));
    } else {
      // Agar single school update hai, toh usko existing array mein update karo
      let index = allSchools.findIndex(s => s.udise === schoolsData.udise || s.id === schoolsData.id);
      if (index !== -1) {
        allSchools[index] = schoolsData;
      }
      localStorage.setItem(dataKey, JSON.stringify(allSchools));
    }

    this.updateStats();
    alert("School ka data safaltapurvak save aur freeze ho gaya hai!");

    // 2. Phir background mein cloud par bhejo
    let payload = {
      session: activeSession,
      data: Array.isArray(schoolsData) ? schoolsData : allSchools
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log(`Data (${activeSession}) successfully synced to cloud!`);
    }).catch(err => {
      console.error("Cloud Save Error:", err);
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
