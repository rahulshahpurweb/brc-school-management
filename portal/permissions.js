// Feature & Module Permissions Control Module
const FeaturePermissions = {
  // Sabhi modules aur unke features ki default settings
  getDefaults() {
    return {
      // R2 Enrollment Features
      r2_jsk_upload_excel: false,
      r2_jsk_template_download: false,
      r2_jsk_school_list: true,
      
      // R3 CWSN Features (Future modules ke liye bhi yhi pattern rahega)
      r3_jsk_upload_excel: false,
      r3_jsk_template_download: false,
      r3_jsk_cwsn_list: true
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
  }
};

window.FeaturePermissions = FeaturePermissions;
