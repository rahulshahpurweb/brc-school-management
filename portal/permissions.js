// Feature, Module & Academic Session Permissions Control Module
const FeaturePermissions = {
  getDefaults() {
    return {
      // --- R2 Enrollment Module Features ---
      r2_jsk_upload_excel: false,
      r2_jsk_template_download: false,
      r2_jsk_school_list: true,
      
      // School / JSK Next Year Edit Permission
      school_can_edit_locked_session: false,
      jsk_can_edit_locked_session: false,

      // --- Academic Sessions Lock Control (True = Locked, False = Active) ---
      session_2026_27: false, // Default Active
      session_2027_28: true,  // Default Locked
      session_2028_29: true   // Default Locked
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
    // Agar setting maujud hai toh wahi return karo, nahi toh default false (active) rakho
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
    
    // Agar key pehle se defined hai toh uska ulta (true/false) kar do, nahi toh true kar do
    if (settings[key] !== undefined) {
      settings[key] = !settings[key];
    } else {
      settings[key] = true;
    }
    
    this.saveSettings(settings);
    return this.getSessions();
  }
};

window.FeaturePermissions = FeaturePermissions;
window.AdminLocks = FeaturePermissions;
