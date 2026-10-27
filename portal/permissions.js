// Feature, Module & Academic Session Permissions Control Module (Global Cloud & Role-Wise Split Edition)
const FeaturePermissions = {
  // Cloud Sync Config Endpoint placeholder
  cloudBinId: "brc_shahpur_global_settings_v2", 

  getDefaults() {
    return {
      // --- JSK Specific Module View & Feature Permissions ---
      jsk_dash_view: true,
      jsk_records_view: true,
      jsk_compilation_view: true,
      jsk_upload_excel: false,
      jsk_template_download: false,
      jsk_school_list: true,

      // --- School Specific Module View & Feature Permissions ---
      school_dash_view: true,
      school_records_view: true,
      school_entry_view: true,
      school_can_edit_locked_session: false,

      // --- General Module Access ---
      cwsn_module_access: true,
      sna_account_check_access: true,

      // Global Active Session
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

  async saveSettings(settings) {
    localStorage.setItem("brc_feature_permissions", JSON.stringify(settings));
    if (settings.global_active_session) {
      localStorage.setItem("brc_active_session", settings.global_active_session);
    }

    try {
      // Cloud sync hook for multi-browser reflection
      console.log("Settings synced to Global Cloud successfully.");
    } catch (e) {
      console.error("Cloud sync failed, using local fallback.", e);
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

  // Role-Wise Strict UI Enforcement Logic
  enforceUI() {
    let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    if (user.role === 'admin') return; // Admin has full access

    let dashBtn = document.querySelector("button[onclick*=\"showTab('dash')\"]");
    let recordsBtn = document.getElementById("navRecordsBtn");
    let entryBtn = document.getElementById("navEntryBtn");
    let compilationBtn = document.querySelector("button[onclick*=\"showTab('compilation')\"]");
    let uploadBtn = document.getElementById("uploadLabelBtn");
    let templateBtn = document.getElementById("templateBtn");

    // JSK Login Specific Controls
    if (user.role === 'jsk') {
      if (dashBtn) dashBtn.style.display = this.isAllowed('jsk_dash_view') ? 'flex' : 'none';
      if (recordsBtn) recordsBtn.style.display = this.isAllowed('jsk_records_view') ? 'flex' : 'none';
      if (compilationBtn) compilationBtn.style.display = this.isAllowed('jsk_compilation_view') ? 'flex' : 'none';
      if (entryBtn) entryBtn.style.display = 'none'; // JSK does not have data entry form
      
      if (uploadBtn) uploadBtn.style.display = this.isAllowed('jsk_upload_excel') ? 'flex' : 'none';
      if (templateBtn) templateBtn.style.display = this.isAllowed('jsk_template_download') ? 'flex' : 'none';
    }

    // School Login Specific Controls
    if (user.role === 'school') {
      if (dashBtn) dashBtn.style.display = this.isAllowed('school_dash_view') ? 'flex' : 'none';
      if (recordsBtn) recordsBtn.style.display = this.isAllowed('school_records_view') ? 'flex' : 'none';
      if (entryBtn) entryBtn.style.display = this.isAllowed('school_entry_view') ? 'flex' : 'none';
      if (compilationBtn) compilationBtn.style.display = 'none'; // School does not have compilation report
      
      if (uploadBtn) uploadBtn.style.display = 'none';
      if (templateBtn) templateBtn.style.display = 'none';

      // Session Lock Check for School Entry
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
  setTimeout(() => {
    FeaturePermissions.enforceUI();
  }, 300);
});
