// Feature & Module Permissions Control Module (100% Google Sheet Cloud-Synced + Cloud Priority + Auto-Polling + Dynamic UI Enforcement)
const FeaturePermissions = {
  // Aapka Google Apps Script (GAS) Web App URL
  cloudApiUrl: "https://script.google.com/macros/s/AKfycbwjZYYhrYb_f9C6I4eK5j4DHzBJ4ZoglrRnEum0CJkQ_RkImrnzCW7wMsJakbaenT-gfQ/exec", 

  getDefaults() {
    return {
      jsk_dash_view: true,
      jsk_records_view: true,
      jsk_compilation_view: true,
      jsk_entry_view: false, // JSK Data Entry Permission
      jsk_upload_excel: false,
      jsk_template_download: false,
      jsk_school_list: true,
      school_dash_view: true,
      school_records_view: true,
      school_entry_view: true,
      school_can_edit_locked_session: false,
      r2_enrollment_access: true,
      r3_cwsn_access: true,
      r4_teacher_access: true,
      sna_account_check_access: true,
      portal_maintenance: false,
      global_active_session: "2026-27",
      session_2026_27: false,
      session_2027_28: true,
      session_2028_29: true
    };
  },

  getSettings() {
    let saved = localStorage.getItem("brc_feature_permissions");
    let defaults = this.getDefaults();
    if (saved) {
      try {
        let remote = JSON.parse(saved);
        return Object.assign({}, defaults, remote);
      } catch (e) {
        return defaults;
      }
    }
    return defaults;
  },

  async fetchCloudSettings() {
    try {
      let response = await fetch(this.cloudApiUrl + "?action=getPermissions&t=" + new Date().getTime());
      if (response.ok) {
        let remoteSettings = await response.json();
        if (remoteSettings && typeof remoteSettings === 'object' && Object.keys(remoteSettings).length > 0) {
          
          // Cloud Priority: Purana local cache ignore karke seedha Google Sheet ka naya data set karein
          let defaults = this.getDefaults();
          let mergedRemote = Object.assign({}, defaults, remoteSettings);
          localStorage.setItem("brc_feature_permissions", JSON.stringify(mergedRemote));
          
          if (mergedRemote.global_active_session) {
            localStorage.setItem("brc_active_session", mergedRemote.global_active_session);
          }
          if (mergedRemote.portal_maintenance !== undefined) {
            localStorage.setItem("brc_maintenance_mode", mergedRemote.portal_maintenance ? "true" : "false");
          }
          
          if (typeof this.enforceUI === 'function') {
            this.enforceUI();
          }
        }
      }
    } catch (e) {
      console.error("Cloud fetch error, falling back to local cache.", e);
    }
  },

  async saveSettings(settings) {
    localStorage.setItem("brc_feature_permissions", JSON.stringify(settings));
    if (settings.global_active_session) {
      localStorage.setItem("brc_active_session", settings.global_active_session);
    }
    if (settings.portal_maintenance !== undefined) {
      localStorage.setItem("brc_maintenance_mode", settings.portal_maintenance ? "true" : "false");
    }

    try {
      // CORS block se bachne ke liye 'no-cors' mode ka use kiya gaya hai taaki request seedha Google Sheet tak jaye
      await fetch(this.cloudApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "savePermissions",
          settings: JSON.stringify(settings)
        })
      });
      console.log("Settings successfully sent to Google Sheet Cloud!");
    } catch (e) {
      console.error("Cloud save failed.", e);
    }
  },

  getActiveSession() {
    let settings = this.getSettings();
    return settings.global_active_session || localStorage.getItem("brc_active_session") || "2026-27";
  },

  setActiveSession(sessionId) {
    let settings = this.getSettings();
    settings.global_active_session = sessionId;
    this.saveSettings(settings);
    localStorage.setItem("brc_active_session", sessionId);
  },

  isAllowed(featureKey) {
    let settings = this.getSettings();
    let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    if (user.role === 'admin') return true;
    return settings[featureKey] !== undefined ? settings[featureKey] : true;
  },

  isSessionLocked(sessionId) {
    let settings = this.getSettings();
    let key = "session_" + sessionId.replace("-", "_");
    return settings[key] !== undefined ? settings[key] : false;
  },

  getSessions() {
    let settings = this.getSettings();
    return [
      { id: "2026-27", name: "2026-27", locked: !!settings.session_2026_27 },
      { id: "2027-28", name: "2027-28", locked: !!settings.session_2027_28 },
      { id: "2028-29", name: "2028-29", locked: !!settings.session_2028_29 }
    ];
  },

  toggleSessionLock(sessionId) {
    let settings = this.getSettings();
    let key = "session_" + sessionId.replace("-", "_");
    settings[key] = !settings[key];
    this.saveSettings(settings);
    return this.getSessions();
  },

  enforceUI() {
    let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    if (user.role === 'admin') return;

    if (user.role === 'jsk') {
      let canDash = this.isAllowed('jsk_dash_view');
      let canList = this.isAllowed('jsk_school_list');
      let canComp = this.isAllowed('jsk_compilation_view');
      let canEntry = this.isAllowed('jsk_entry_view');
      let canExcel = this.isAllowed('jsk_upload_excel');
      let canTemplate = this.isAllowed('jsk_template_download');

      // Buttons aur menu items ko text aur onclick attributes ke aadhar par dynamically hide/show karna
      document.querySelectorAll("button, a, .menu-item").forEach(el => {
        let text = el.innerText || "";
        let onclickAttr = el.getAttribute("onclick") || "";

        if (text.includes("Summary Dashboard") || onclickAttr.includes("dash")) {
          el.style.display = canDash ? '' : 'none';
        }
        if (text.includes("School List") || onclickAttr.includes("school")) {
          el.style.display = canList ? '' : 'none';
        }
        if (text.includes("Compilation Report") || onclickAttr.includes("compilation")) {
          el.style.display = canComp ? '' : 'none';
        }
        if (text.includes("Data Entry") || onclickAttr.includes("entry")) {
          el.style.display = canEntry ? '' : 'none';
        }
        if (text.includes("Excel") || onclickAttr.includes("upload")) {
          el.style.display = canExcel ? '' : 'none';
        }
        if (text.includes("Template") || onclickAttr.includes("template")) {
          el.style.display = canTemplate ? '' : 'none';
        }
      });
    }

    if (user.role === 'school') {
      let activeSess = this.getActiveSession();
      if (this.isSessionLocked(activeSess)) {
        let canEditLocked = this.isAllowed('school_can_edit_locked_session');
        let editBtn = document.getElementById("editToggleBtn");
        if (editBtn) editBtn.style.display = canEditLocked ? 'inline-block' : 'none';
      }
    }
  }
};

window.FeaturePermissions = FeaturePermissions;
window.AdminLocks = FeaturePermissions;

document.addEventListener("DOMContentLoaded", () => {
  FeaturePermissions.fetchCloudSettings();
  setTimeout(() => { FeaturePermissions.enforceUI(); }, 300);

  // Background Auto-Polling: Har 15 seconds mein Google Sheet se latest settings check karega bina cache clear kiye
  setInterval(() => {
    FeaturePermissions.fetchCloudSettings();
  }, 15000);
});

window.addEventListener("focus", () => { 
  FeaturePermissions.fetchCloudSettings(); 
});
