// Feature, Module & Academic Session Permissions Control Module (100% npoint.io Cloud Sync)
const FeaturePermissions = {
  // Aapki npoint.io ki live cloud sync link yahan set ho gayi hai
  cloudApiUrl: "https://api.npoint.io/b6f7fc30b23ec0e8aefb",

  getDefaults() {
    return {
      jsk_dash_view: true,
      jsk_records_view: true,
      jsk_compilation_view: true,
      jsk_upload_excel: false,
      jsk_template_download: false,
      jsk_school_list: true,

      school_dash_view: true,
      school_records_view: true,
      school_entry_view: true,
      school_can_edit_locked_session: false,

      cwsn_module_access: true,
      sna_account_check_access: true,

      global_active_session: "2026-27",

      session_2026_27: false,
      session_2027_28: true,
      session_2028_29: true
    };
  },

  getSettings() {
    let saved = localStorage.getItem("brc_feature_permissions");
    return saved ? JSON.parse(saved) : this.getDefaults();
  },

  async fetchCloudSettings() {
    try {
      if (this.cloudApiUrl.includes("YOUR_BIN_ID")) return;
      let response = await fetch(this.cloudApiUrl);
      if (response.ok) {
        let remoteSettings = await response.json();
        if (remoteSettings) {
          localStorage.setItem("brc_feature_permissions", JSON.stringify(remoteSettings));
          if (remoteSettings.global_active_session) {
            localStorage.setItem("brc_active_session", remoteSettings.global_active_session);
          }
          if (typeof this.enforceUI === 'function') {
            this.enforceUI();
          }
        }
      }
    } catch (e) {
      console.error("Cloud fetch error, using local storage fallback.", e);
    }
  },

  async saveSettings(settings) {
    localStorage.setItem("brc_feature_permissions", JSON.stringify(settings));
    if (settings.global_active_session) {
      localStorage.setItem("brc_active_session", settings.global_active_session);
    }

    try {
      if (!this.cloudApiUrl.includes("YOUR_BIN_ID")) {
        await fetch(this.cloudApiUrl, {
          method: "POST", // npoint.io updates ke liye POST use karta hai
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(settings)
        });
        console.log("Settings successfully pushed to npoint Cloud!");
      }
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
    if (settings[key] !== undefined) {
      settings[key] = !settings[key];
    } else {
      settings[key] = true;
    }
    this.saveSettings(settings);
    return this.getSessions();
  },

  enforceUI() {
    let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    if (user.role === 'admin') return;

    let dashBtn = document.querySelector("button[onclick*=\"showTab('dash')\"]");
    let recordsBtn = document.getElementById("navRecordsBtn");
    let entryBtn = document.getElementById("navEntryBtn");
    let compilationBtn = document.querySelector("button[onclick*=\"showTab('compilation')\"]");
    let uploadBtn = document.getElementById("uploadLabelBtn");
    let templateBtn = document.getElementById("templateBtn");

    if (user.role === 'jsk') {
      if (dashBtn) dashBtn.style.display = this.isAllowed('jsk_dash_view') ? 'flex' : 'none';
      if (recordsBtn) recordsBtn.style.display = this.isAllowed('jsk_records_view') ? 'flex' : 'none';
      if (compilationBtn) compilationBtn.style.display = this.isAllowed('jsk_compilation_view') ? 'flex' : 'none';
      if (entryBtn) entryBtn.style.display = 'none'; 
      
      if (uploadBtn) uploadBtn.style.display = this.isAllowed('jsk_upload_excel') ? 'flex' : 'none';
      if (templateBtn) templateBtn.style.display = this.isAllowed('jsk_template_download') ? 'flex' : 'none';
    }

    if (user.role === 'school') {
      if (dashBtn) dashBtn.style.display = this.isAllowed('school_dash_view') ? 'flex' : 'none';
      if (recordsBtn) recordsBtn.style.display = this.isAllowed('school_records_view') ? 'flex' : 'none';
      if (entryBtn) entryBtn.style.display = this.isAllowed('school_entry_view') ? 'flex' : 'none';
      if (compilationBtn) compilationBtn.style.display = 'none'; 
      
      if (uploadBtn) uploadBtn.style.display = 'none';
      if (templateBtn) templateBtn.style.display = 'none';

      let activeSess = this.getActiveSession();
      let locked = this.isSessionLocked(activeSess);
      if (locked) {
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
  setTimeout(() => {
    FeaturePermissions.enforceUI();
  }, 300);
});
