// Feature & Module Permissions Control Module (100% Google Sheet Cloud-Synced + ID-Based UI Enforcement + Auto-Polling)
const FeaturePermissions = {
  // Aapka Google Apps Script (GAS) Web App URL
  cloudApiUrl: "https://script.google.com/macros/s/AKfycbwjZYYhrYb_f9C6I4eK5j4DHzBJ4ZoglrRnEum0CJkQ_RkImrnzCW7wMsJakbaenT-gfQ/exec", 

  getDefaults() {
    return {
      jsk_dash_view: true,
      jsk_school_list: true,
      jsk_compilation_view: true,
      jsk_entry_view: false,
      jsk_upload_excel: false,
      jsk_template_download: false,
      school_dash_view: true,
      school_school_list: true,
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

    // Permissions nikalna
    let canDash = user.role === 'jsk' ? this.isAllowed('jsk_dash_view') : this.isAllowed('school_dash_view');
    let canList = user.role === 'jsk' ? this.isAllowed('jsk_school_list') : this.isAllowed('school_school_list');
    let canComp = user.role === 'jsk' ? this.isAllowed('jsk_compilation_view') : false;
    let canEntry = user.role === 'jsk' ? this.isAllowed('jsk_entry_view') : this.isAllowed('school_entry_view');
    let canExcel = user.role === 'jsk' ? this.isAllowed('jsk_upload_excel') : false;
    let canTemplate = user.role === 'jsk' ? this.isAllowed('jsk_template_download') : false;

    // ID-based elements check karna
    let dashBtn = document.getElementById("menuDashBtn");
    let listBtn = document.getElementById("menuSchoolListBtn");
    let compBtn = document.getElementById("menuCompilationBtn");
    let entryBtn = document.getElementById("menuEntryBtn");
    let excelBtn = document.getElementById("menuExcelBtn");
    let templateBtn = document.getElementById("menuTemplateBtn");

    if (dashBtn) dashBtn.style.display = canDash ? '' : 'none';
    if (listBtn) listBtn.style.display = canList ? '' : 'none';
    if (compBtn) compBtn.style.display = canComp ? '' : 'none';
    if (entryBtn) entryBtn.style.display = canEntry ? '' : 'none';
    if (excelBtn) excelBtn.style.display = canExcel ? '' : 'none';
    if (templateBtn) templateBtn.style.display = canTemplate ? '' : 'none';

    // Universal Text & Attribute Backup: Agar kisi button par ID nahi bhi lagi hai, toh text se pakad kar hide kar dega!
    document.querySelectorAll("button, a, .menu-item, div").forEach(el => {
      let text = (el.innerText || "").toLowerCase();
      let onclickAttr = (el.getAttribute("onclick") || "").toLowerCase();

      // Agar Excel upload allowed nahi hai, toh use kahin bhi dikhne mat do
      if (!canExcel && (text.includes("upload") || text.includes("excel") || onclickAttr.includes("upload") || onclickAttr.includes("excel"))) {
        // Master header ke top buttons ko chhod kar menu items ko hide karein
        if (!el.classList.contains('master-header') && !el.closest('.master-header') && !el.classList.contains('nav-top')) {
          el.style.display = 'none';
        }
      }

      // Agar Compilation allowed nahi hai
      if (!canComp && (text.includes("compilation") || onclickAttr.includes("compilation"))) {
        el.style.display = 'none';
      }

      // Agar Template allowed nahi hai
      if (!canTemplate && (text.includes("template") || onclickAttr.includes("template"))) {
        el.style.display = 'none';
      }
    });

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

  // Background Auto-Polling: Har 15 seconds mein Google Sheet se live sync karega bina cache clear kiye
  setInterval(() => {
    FeaturePermissions.fetchCloudSettings();
  }, 15000);
});

window.addEventListener("focus", () => { 
  FeaturePermissions.fetchCloudSettings(); 
});
