// Feature, Module & Academic Session Permissions Control Module (Complete Sub-Modules Edition)
const FeaturePermissions = {
  getDefaults() {
    return {
      // --- Module & Sub-Module View Permissions ---
      r2_dash_view: true,           // Summary Dashboard
      r2_records_view: true,        // School List & Filters
      r2_entry_view: true,          // School Data Entry Form
      r2_compilation_view: true,    // JSK Compilation Report
      
      // --- JSK Specific Permissions ---
      r2_jsk_upload_excel: false,   // Excel Upload Permission
      r2_jsk_template_download: false,// Template Download Permission
      r2_jsk_school_list: true,     // School List View Permission

      // --- Other Portal Modules Access ---
      cwsn_module_access: true,     // CWSN Module (R3) Access
      sna_account_check_access: true, // SNA Account Check Access

      // --- Session Locking & Editing Permissions ---
      school_can_edit_locked_session: false,
      jsk_can_edit_locked_session: false,

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

  saveSettings(settings) {
    localStorage.setItem("brc_feature_permissions", JSON.stringify(settings));
    if (settings.global_active_session) {
      localStorage.setItem("brc_active_session", settings.global_active_session);
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

  // Real-time UI Enforcement Logic strictly driven by Feature Control panel
  enforceUI() {
    let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    if (user.role === 'admin') return; // Admin has full access

    // 1. Sub-Modules Visibility Enforcement based on Feature Settings
    let dashBtn = document.querySelector("button[onclick*=\"showTab('dash')\"]");
    let recordsBtn = document.getElementById("navRecordsBtn");
    let entryBtn = document.getElementById("navEntryBtn");
    let compilationBtn = document.querySelector("button[onclick*=\"showTab('compilation')\"]");

    if (dashBtn) dashBtn.style.display = this.isAllowed('r2_dash_view') ? 'flex' : 'none';
    if (recordsBtn) recordsBtn.style.display = this.isAllowed('r2_records_view') ? 'flex' : 'none';
    if (entryBtn) entryBtn.style.display = this.isAllowed('r2_entry_view') ? 'flex' : 'none';
    if (compilationBtn) compilationBtn.style.display = this.isAllowed('r2_compilation_view') ? 'flex' : 'none';

    // 2. JSK Specific Feature Restrictions
    let uploadBtn = document.getElementById("uploadLabelBtn");
    let templateBtn = document.getElementById("templateBtn");

    if (uploadBtn) {
      uploadBtn.style.display = this.isAllowed('r2_jsk_upload_excel') ? 'flex' : 'none';
    }
    if (templateBtn) {
      templateBtn.style.display = this.isAllowed('r2_jsk_template_download') ? 'flex' : 'none';
    }
  }
};

window.FeaturePermissions = FeaturePermissions;
window.AdminLocks = FeaturePermissions;

// Auto-enforce permissions when the page loads
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    FeaturePermissions.enforceUI();
  }, 300);
});
