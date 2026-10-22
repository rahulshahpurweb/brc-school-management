
import { AdminLocks } from './admin-locks.js';
import { MASTER_SCHOOLS } from './schools-data.js';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwjZYYhrYb_f9C6I4eK5j4DHzBJ4ZoglrRnEum0CJkQ_RkImrnzCW7wMsJakbaenT-gfQ/exec";

window._cloudSchoolsData = [];
window._activeCloudSession = "2026-27";
window._cloudDataLoaded = false;

export const SessionManager = {
  getActiveSession() {
    return window._activeCloudSession;
  },

  async postCloud(payload) {
    // Apps Script ko simple text POST bhejte hain.
    // no-cors response ko directly read nahi kiya ja sakta.
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
  },

  async setActiveSession(sessionName) {
    const allowedSessions = ["2026-27", "2027-28", "2028-29"];

    if (!allowedSessions.includes(sessionName)) {
      alert("Invalid academic session.");
      return false;
    }

    try {
      await this.postCloud({
        action: "setSession",
        session: sessionName
      });

      // Server se session dobara padhkar verify karein.
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await fetch(
        WEB_APP_URL + "?action=getSession&_=" + Date.now()
      );
      const result = await response.json();

      if (!result || result.activeSession !== sessionName) {
        throw new Error("Session change verify nahi hua.");
      }

      window._activeCloudSession = sessionName;
      await this.fetchCloudData();

      if (window._cloudDataLoaded) {
        location.reload();
        return true;
      }

      alert("Session badla hai, lekin uska data load nahi hua. Dobara jaanch karein.");
      return false;

    } catch (error) {
      console.error("Session Update Error:", error);
      alert("Session change verify nahi ho saka. Internet aur Apps Script deployment check karein.");
      return false;
    }
  },

  async init() {
    await this.fetchActiveSessionFromCloud();

    const loaded = await this.fetchCloudData();

    this.renderDropdown();
    this.updateStats();

    if (loaded) {
      this.applyRoleAccess();

      if (
        typeof SchoolRecords !== "undefined" &&
        SchoolRecords.render
      ) {
        SchoolRecords.render();
      }

      if (
        typeof CompilationModule !== "undefined" &&
        CompilationModule.render
      ) {
        CompilationModule.render();
      }
    }
  },

  async fetchActiveSessionFromCloud() {
    try {
      const response = await fetch(
        WEB_APP_URL + "?action=getSession&_=" + Date.now()
      );

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const result = await response.json();

      if (
        result &&
        ["2026-27", "2027-28", "2028-29"].includes(result.activeSession)
      ) {
        window._activeCloudSession = result.activeSession;
      }
    } catch (error) {
      console.error("Session Fetch Error:", error);
    }
  },

  async fetchCloudData() {
    const session = this.getActiveSession();

    try {
      const response = await fetch(
        WEB_APP_URL +
        "?session=" + encodeURIComponent(session) +
        "&_=" + Date.now()
      );

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const cloudData = await response.json();

      if (!Array.isArray(cloudData)) {
        throw new Error(
          cloudData && cloudData.error
            ? cloudData.error
            : "Cloud data ka format galat hai."
        );
      }

      window._cloudSchoolsData = cloudData;
      window._cloudDataLoaded = true;

      return true;

    } catch (error) {
      console.error("Cloud Data Fetch Error:", error);

      // IMPORTANT:
      // Cloud fail hone par MASTER_SCHOOLS se zero data banakar
      // original cloud data ko overwrite nahi karna hai.
      window._cloudDataLoaded = false;

      alert(
        "Cloud se data load nahi hua. Purane data ko zero nahi kiya gaya hai. Internet aur Google Apps Script deployment check karein."
      );

      return false;
    }
  },

  renderDropdown() {
    const select = document.getElementById("sessionSelect");

    const sessions = [
      { id: "2026-27", name: "2026-27" },
      { id: "2027-28", name: "2027-28" },
      { id: "2028-29", name: "2028-29" }
    ];

    const current = this.getActiveSession();
    const currentUser = this.getCurrentUser();
    const isAdmin = currentUser && currentUser.role === "admin";

    if (select && isAdmin) {
      select.innerHTML = "";

      sessions.forEach(session => {
        const option = document.createElement("option");
        option.value = session.id;
        option.textContent = session.name;
        option.selected = session.id === current;
        select.appendChild(option);
      });

      select.disabled = false;
      select.style.display = "";
    } else if (select) {
      select.style.display = "none";
    }

    const badge = document.getElementById("sessionBadge");

    if (badge) {
      badge.innerText = current;
      badge.style.display = "inline-block";
    }
  },

  async changeSession() {
    const select = document.getElementById("sessionSelect");

    if (!select) return;

    const currentUser = this.getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      alert("Session badalne ki permission nahi hai.");
      this.renderDropdown();
      return;
    }

    await this.setActiveSession(select.value);
  },

  getData() {
    // Cloud load fail hua ho to fake/zero data return nahi karna.
    if (!window._cloudDataLoaded) {
      return [];
    }

    return window._cloudSchoolsData;
  },

  async saveData(schoolsData) {
    if (!window._cloudDataLoaded) {
      alert("Cloud data load nahi hua. Save rok diya gaya hai taaki data galti se overwrite na ho.");
      return false;
    }

    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      alert("Login session nahi mila. Dobara login karein.");
      return false;
    }

    let allSchools = window._cloudSchoolsData;

    if (Array.isArray(schoolsData)) {
      allSchools = schoolsData;
    } else if (schoolsData && schoolsData.udise != null) {
      const index = allSchools.findIndex(
        school => String(school.udise) === String(schoolsData.udise)
      );

      if (index !== -1) {
        allSchools = [...allSchools];
        allSchools[index] = schoolsData;
      } else {
        allSchools = [...allSchools, schoolsData];
      }
    } else {
      alert("Save karne ke liye valid school data nahi mila.");
      return false;
    }

    const payload = {
      session: this.getActiveSession(),
      data: allSchools
    };

    try {
      await this.postCloud(payload);

      // no-cors POST ka response opaque hota hai.
      // Isliye GET se saved data verify karne ki koshish karte hain.
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch(
        WEB_APP_URL +
        "?session=" + encodeURIComponent(payload.session) +
        "&_=" + Date.now()
      );

      if (!response.ok) {
        throw new Error("Save verification HTTP " + response.status);
      }

      const savedData = await response.json();

      if (
        !Array.isArray(savedData) ||
        JSON.stringify(savedData) !== JSON.stringify(allSchools)
      ) {
        throw new Error("Server data aur submitted data match nahi hue.");
      }

      window._cloudSchoolsData = savedData;
      window._cloudDataLoaded = true;

      this.updateStats();

      alert("Google Sheets par data save aur verify ho gaya.");
      return true;

    } catch (error) {
      console.error("Cloud Save Verification Error:", error);

      // Local memory ko server-confirmed data ke roop mein na dikhayein.
      alert(
        "Cloud save ki pushti nahi ho saki. Data dobara load karke jaanch karein. Is message ka matlab zaroori nahi ki server par save fail hua ho."
      );

      return false;
    }
  },

  updateStats() {
    const schools = this.getData();

    const totalSchools = schools.length;
    let totalEnroll = 0;
    let filled = 0;

    schools.forEach(school => {
      let hasData = false;
      const classes = school.classes || {};

      Object.keys(classes).forEach(className => {
        const classData = classes[className] || {};

        const sum = Object.values(classData).reduce(
          (total, value) => total + (parseInt(value, 10) || 0),
          0
        );

        if (sum > 0) {
          hasData = true;
          totalEnroll += sum;
        }
      });

      if (hasData) filled++;
    });

    const statSchools = document.getElementById("statSchools");
    const statTotal = document.getElementById("statTotal");
    const statFilled = document.getElementById("statFilled");
    const statPending = document.getElementById("statPending");

    if (statSchools) statSchools.innerText = totalSchools;
    if (statTotal) statTotal.innerText = totalEnroll;
    if (statFilled) statFilled.innerText = filled;
    if (statPending) statPending.innerText = totalSchools - filled;
  },

  getCurrentUser() {
    try {
      const storedUser =
        localStorage.getItem("brc_current_user") ||
        localStorage.getItem("brc_logged_user");

      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Current User Read Error:", error);
      return null;
    }
  },

  applyRoleAccess() {
    const currentUser = this.getCurrentUser();

    if (!currentUser) return;

    const role = currentUser.role;

    if (role === "jsk") {
      const entryTab =
        document.querySelector("[data-target='entry']") ||
        document.getElementById("entrySection");

      const recordsTab =
        document.querySelector("[data-target='records']") ||
        document.getElementById("recordsSection");

      if (entryTab) entryTab.style.display = "none";
      if (recordsTab) recordsTab.style.display = "none";
    } else if (role === "school") {
      const compilationTab =
        document.querySelector("[data-target='compilation']") ||
        document.getElementById("compilationSection");

      if (compilationTab) compilationTab.style.display = "none";
    }
  }
};

window.SessionManager = SessionManager;
