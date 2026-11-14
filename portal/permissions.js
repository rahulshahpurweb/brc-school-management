// Feature, Module & Academic Session Permissions Control Module (100% Cloud-Synced + Anti-Cache Live Sync)
const FeaturePermissions = {
  // Aapki npoint.io ki live cloud sync link
  cloudApiUrl: "https://api.npoint.io/7c280aaadade1e14b43f", 

  getDefaults() {
    return {
      // --- JSK Specific Module View & Feature Permissions ---
      jsk_dash_view: true,
      jsk_records_view: true,
      jsk_compilation_view: true,
      jsk_entry_view: false, // JSK Data Entry By Default Off (Admin on kar sakta hai)
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
    let defaults = this.getDefaults();
    if (saved) {
      try {
        let remote = JSON.parse(saved);
        // Defaults ke sath merge karega taaki koi bhi key miss na ho
        return Object.assign({}, defaults, remote);
      } catch (e) {
        return defaults;
      }
    }
    return defaults;
  },


  async fetchCloudSettings() {
    try {
      // ?t=... lagane se browser cache bypass hota hai aur live npoint data turant milta hai
      let response = await fetch(this.cloudApiUrl + "?t=" + new Date().getTime());
      if (response.ok) {
        let remoteSettings = await response.json();
        if (remoteSettings && typeof remoteSettings === 'object') {
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
      console.error("Cloud fetch error, falling back to local cache.", e);
    }
  },

  async saveSettings(settings) {
    localStorage.setItem("brc_feature_permissions", JSON.stringify(settings));
    if (settings.global_active_session) {
      localStorage.setItem("brc_active_session", settings.global_active_session);
    }

    try {
      await fetch(this.cloudApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      console.log("Settings successfully updated on npoint Cloud!");
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
      if (entryBtn) entryBtn.style.display = this.isAllowed('jsk_entry_view') ? 'flex' : 'none'; // JSK Data Entry Control
      
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

// Page load hote hi cloud se latest data fetch karega
document.addEventListener("DOMContentLoaded", () => {
  FeaturePermissions.fetchCloudSettings();
  setTimeout(() => {
    FeaturePermissions.enforceUI();
  }, 300);
});

// Jab bhi user doosre tab se wapas is tab par aaye, turant cloud se sync kare
window.addEventListener("focus", () => {
  FeaturePermissions.fetchCloudSettings();
});

// Ek hi browser ke do alag tabs mein agar data change ho toh turant UI update ho jaye
window.addEventListener("storage", (event) => {
  if (event.key === "brc_feature_permissions" || event.key === "brc_active_session") {
    FeaturePermissions.enforceUI();
    if (typeof SessionManager !== 'undefined' && SessionManager.renderDropdown) {
      SessionManager.renderDropdown();
    }
  }
});
