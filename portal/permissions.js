// Feature, Module & Academic Session Permissions Control Module
const FeaturePermissions = {
  getDefaults() {
    return {
      r2_jsk_upload_excel: false,
      r2_jsk_template_download: false,
      r2_jsk_school_list: true,
      
      school_can_edit_locked_session: false,
      jsk_can_edit_locked_session: false,

      // Global Active Session jo kabhi apne aap reset nahi hoga
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

  // Real-time UI Enforcement Logic (Makes checkboxes actually work)
  enforceUI() {
    let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    if (user.role === 'admin') return; // Admin has full access

    // 1. JSK Role Restrictions Enforcement
    if (user.role === 'jsk') {
      let uploadBtn = document.getElementById("uploadLabelBtn");
      let templateBtn = document.getElementById("templateBtn");
      let recordsBtn = document.getElementById("navRecordsBtn");

      if (uploadBtn) {
        uploadBtn.style.display = this.isAllowed('r2_jsk_upload_excel') ? 'flex' : 'none';
      }
      if (templateBtn) {
        templateBtn.style.display = this.isAllowed('r2_jsk_template_download') ? 'flex' : 'none';
      }
      if (recordsBtn) {
        recordsBtn.style.display = this.isAllowed('r2_jsk_school_list') ? 'flex' : 'none';
      }
    }

    // 2. School Locked Session Enforcement
    if (user.role === 'school') {
      let activeSess = this.getActiveSession();
      let locked = this.isSessionLocked(activeSess);
      if (locked) {
        let canEditLocked = this.isAllowed('school_can_edit_locked_session');
        if (!canEditLocked) {
          let editBtn = document.getElementById("editToggleBtn");
          if (editBtn) editBtn.style.display = 'none';
        }
      }
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
