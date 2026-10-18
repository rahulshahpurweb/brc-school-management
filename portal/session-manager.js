import { AdminLocks } from './admin-locks.js';
import { MASTER_SCHOOLS } from './schools-data.js';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyRbPEcNgjpFXFGnqVVtVBdTsjlo_mMEy23SS3DggMAk2BRuy_M324DohO9JpYDPhoh_w/exec";

export const SessionManager = {
  // Cloud se active session mangwayein
  getActiveSession() {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", WEB_APP_URL + "?action=getSession", false);
      xhr.send();
      if (xhr.status === 200) {
        let res = JSON.parse(xhr.responseText);
        if (res && res.activeSession) {
          return res.activeSession;
        }
      }
    } catch (e) {
      console.error("Cloud Session Error:", e);
    }
    return "2026-27";
  },

  // Cloud par active session update karein
  setActiveSession(sessionName) {
    let payload = {
      action: "setSession",
      session: sessionName
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log("Cloud session changed to:", sessionName);
      location.reload();
    }).catch(err => {
      console.error("Session Update Error:", err);
    });
  },

  async init() {
    this.renderDropdown();
    await this.loadCloudData();
    this.updateStats();
    this.applyRoleAccess();
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
    let targetSession = select.value;
    this.setActiveSession(targetSession);
  },

  // 100% Cloud se data fetch karega, koi local storage nahi
  getData() {
    let activeSession = this.getActiveSession();
    try {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", WEB_APP_URL + "?session=" + activeSession, false);
      xhr.send();
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {
      console.error("Data Fetch Error:", e);
    }

    // Agar cloud par data na ho toh fresh master schools return karega
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
    return freshSchools;
  },

  async loadCloudData() {
    this.updateStats();
  },

  // Data seedha Google Sheet (Cloud) par bhejega
  saveData(schoolsData) {
    let activeSession = this.getActiveSession();
    let currentUser = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    let isAdmin = (currentUser.role === 'admin');

    let sessions = [];
    try {
      if (typeof AdminLocks !== 'undefined' && AdminLocks.getSessions) {
        sessions = AdminLocks.getSessions();
      }
    } catch(e) {}

    let currentSessionObj = sessions.find(s => s.id === activeSession);
    let settings = (typeof FeaturePermissions !== 'undefined' && FeaturePermissions.getSettings) ? FeaturePermissions.getSettings() : {};
    let hasSpecialPermission = (currentUser.role === 'school' && settings.school_can_edit_locked_session) || 
                               (currentUser.role === 'jsk' && settings.jsk_can_edit_locked_session);
    
    if (currentSessionObj && currentSessionObj.locked && !isAdmin && !hasSpecialPermission) {
      alert("⚠️ Yeh academic session locked hai! Admin ne isme entry ki permission nahi di hai.");
      return;
    }

    // Pehle ka saara data laakar update karo
    let allSchools = this.getData();

    if (Array.isArray(schoolsData)) {
      allSchools = schoolsData;
    } else if (schoolsData && schoolsData.udise) {
      let index = allSchools.findIndex(s => s.udise === schoolsData.udise);
      if (index !== -1) {
        allSchools[index] = schoolsData;
      } else {
        allSchools.push(schoolsData);
      }
    }

    alert("Data cloud par save ho raha hai, kripya pratiksha karein...");

    let payload = {
      session: activeSession,
      data: allSchools
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(() => {
      alert("Data safaltapurvak cloud par save ho gaya!");
      location.reload();
    }).catch(err => {
      console.error("Cloud Save Error:", err);
      alert("Data save karne mein samasya aayi.");
    });
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
