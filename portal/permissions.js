// Feature, Module & Academic Session Permissions Control Module
const FeaturePermissions = {
  // Sabhi modules, features aur academic sessions ki default settings
  getDefaults() {
    return {
      // --- R2 Enrollment Module Features ---
      r2_jsk_upload_excel: false,
      r2_jsk_template_download: false,
      r2_jsk_school_list: true,
      r2_school_can_edit: true,

      // --- R3 CWSN Module Features ---
      r3_jsk_upload_excel: false,
      r3_jsk_template_download: false,
      r3_jsk_cwsn_list: true,
      r3_school_can_edit: true,

      // --- Academic Sessions Lock Control (True = Locked, False = Active) ---
      session_2026_27: false, // Default Active (Current)
      session_2027_28: true,  // Default Locked (Future)
      session_2028_29: true   // Default Locked (Future)
    };
  },

  getSettings() {
    let saved = localStorage.getItem("brc_feature_permissions");
    return saved ? JSON.parse(saved) : this.getDefaults();
  },

  saveSettings(settings) {
    localStorage.setItem("brc_feature_permissions", JSON.stringify(settings));
  },

  // Check karna ki current user ke liye koi feature allowed hai ya nahi
  isAllowed(featureKey) {
    let settings = this.getSettings();
    let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    
    // Admin ke liye sab kuch hamesha allowed rahega
    if (user.role === 'admin') return true;
    
    return settings[featureKey] !== undefined ? settings[featureKey] : true;
  },

  // Session locked hai ya nahi check karne ke liye
  isSessionLocked(sessionId) {
    let settings = this.getSettings();
    let key = "session_" + sessionId.replace("-", "_");
    return settings[key] !== undefined ? settings[key] : false;
  },

  // Teeno sessions ki list return karega
  getSessions() {
    let settings = this.getSettings();
    return [
      { id: "2026-27", name: "2026-27 (Current)", locked: !!settings.session_2026_27 },
      { id: "2027-28", name: "2027-28 (Future)", locked: !!settings.session_2027_28 },
      { id: "2028-29", name: "2028-29 (Future)", locked: !!settings.session_2028_29 }
    ];
  },

  // Session lock status toggle karne ke liye
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
