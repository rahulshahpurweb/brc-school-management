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
    let sessions = AdminLocks.getSessions();
    let current = localStorage.getItem("brc_active_session") || "2026-27";

    select.innerHTML = "";
    sessions.forEach(s => {
      let opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.locked ? `🔒 ${s.name} (Locked)` : `🔓 ${s.name} (Active)`;
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
      console.log(`Google Sheet se ${activeSession} ka data laya ja raha hai...`);
      let response = await fetch(`${WEB_APP_URL}?session=${activeSession}`);
      let cloudData = await response.json();
      
      if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
        localStorage.setItem(dataKey, JSON.stringify(cloudData));
        console.log("Cloud data successfully load ho gaya!");
        this.updateStats();
        if(typeof SchoolRecords !== 'undefined' && SchoolRecords.render) SchoolRecords.render();
        if(typeof CompilationModule !== 'undefined' && CompilationModule.render) CompilationModule.render();
      }
    } catch (err) {
      console.error("Cloud Load Error, local storage use ho raha hai:", err);
    }
    this.updateStats();
  },

  saveData(schoolsData) {
    let activeSession = localStorage.getItem("brc_active_session") || "2026-27";
    
    let sessions = AdminLocks.getSessions();
    let currentSessionObj = sessions.find(s => s.id === activeSession);
    if (currentSessionObj && currentSessionObj.locked) {
      alert("⚠️ Yeh academic session locked (freeze) hai! Isme naya data save nahi kiya ja sakta.");
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
      console.log(`Data (${activeSession}) Google Sheet par safaltapurvak save ho gaya!`);
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
  },

  getCurrentUser() {
    let session = localStorage.getItem("brc_current_user");
    return session ? JSON.parse(session) : null;
  },

  login(username, password) {
    let users = this.getUsers();
    let user = users.find(u => u.username === username && u.password === password);
    
    if(user) {
      localStorage.setItem("brc_current_user", JSON.stringify(user));
      return { success: true, role: user.role, name: user.name };
    }
    return { success: false, message: "Galat Username ya Password!" };
  },

  logout() {
    localStorage.removeItem("brc_current_user");
    window.location.reload();
  },

  getUsers() {
    let storedUsers = localStorage.getItem("brc_users");
    if(storedUsers) {
      return JSON.parse(storedUsers);
    }
    let defaultUsers = [
      { username: "admin", password: "adminpassword", role: "admin", name: "BRC Admin" },
      { username: "jsk_login", password: "jskpassword", role: "jsk", name: "JSK Coordinator" },
      { username: "school", password: "schoolpassword", role: "school", name: "School Login" }
    ];
    localStorage.setItem("brc_users", JSON.stringify(defaultUsers));
    return defaultUsers;
  },

  changePassword(username, oldPassword, newPassword) {
    let users = this.getUsers();
    let user = users.find(u => u.username === username);
    
    if(!user) return { success: false, message: "User nahi mila!" };
    if(user.password !== oldPassword) return { success: false, message: "Purana password galat hai!" };
    
    user.password = newPassword;
    localStorage.setItem("brc_users", JSON.stringify(users));
    return { success: true, message: "Password safaltapurvak badal diya gaya hai!" };
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
