// Feature, Module & Academic Session Permissions Control Module
const FeaturePermissions = {
  getDefaults() {
    return {
      // --- R2 Enrollment Module Features ---
      r2_jsk_upload_excel: false,
      r2_jsk_template_download: false,
      r2_jsk_school_list: true,
      
      // School / JSK Next Year Edit Permission (Feature Control se control hoga)
      school_can_edit_locked_session: false,
      jsk_can_edit_locked_session: false,

      // --- Academic Sessions Lock Control (True = Locked, False = Active) ---
      session_2026_27: false, // Active
      session_2027_28: true,  // Locked
      session_2028_29: true   // Locked
    };
  },

  getSettings() {
    let saved = localStorage.getItem("brc_feature_permissions");
    return saved ? JSON.parse(saved) : this.getDefaults();
  },

  saveSettings(settings) {
    localStorage.setItem("brc_feature_permissions", JSON.stringify(settings));
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
    return settings[key] !== undefined ? settings[key] : true;
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
      this.saveSettings(settings);
    }
    return this.getSessions();
  }
};

window.FeaturePermissions = FeaturePermissions;
window.AdminLocks = FeaturePermissions;
