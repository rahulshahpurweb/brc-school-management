// Feature, Module & Academic Session Permissions Control Module
const FeaturePermissions = {
  // Sabhi modules, features aur academic sessions ki default settings
  getDefaults() {
    return {
      // R2 Enrollment Features (JSK)
      r2_jsk_upload_excel: false,
      r2_jsk_template_download: false,
      r2_jsk_school_list: true,
      
      // R3 CWSN Features (JSK)
      r3_jsk_upload_excel: false,
      r3_jsk_template_download: false,
      r3_jsk_cwsn_list: true,

      // Academic Sessions Lock Control (True = Locked, False = Active/Unlocked)
      session_2026_27: false, // Default active
      session_2027_28: true   // Default locked
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
    
    // Admin ke liye sab kuch hamesha allowed rahega
    if (user.role === 'admin') return true;
    
    return settings[featureKey] !== undefined ? settings[featureKey] : true;
  },

  // Session locked hai ya nahi check karne ke liye helper function
  isSessionLocked(sessionId) {
    let settings = this.getSettings();
    let key = "session_" + sessionId.replace("-", "_");
    return settings[key] !== undefined ? settings[key] : false;
  },

  // AdminLocks ke sath compatibility ke liye getSessions()
  getSessions() {
    let settings = this.getSettings();
    return [
      { id: "2026-27", name: "2026-27 (Current)", locked: !!settings.session_2026_27 },
      { id: "2027-28", name: "2027-28 (Future)", locked: !!settings.session_2027_28 }
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
// Backward compatibility ke liye AdminLocks ko bhi isse jod diya hai
window.AdminLocks = FeaturePermissions;
