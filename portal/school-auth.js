import { SessionManager } from './session-manager.js';

// UDISE Based School Authentication & Password Management
export const SchoolAuth = {
  // Get stored passwords dictionary { "UDISE_CODE": "password" }
  getCredentials() {
    let saved = localStorage.getItem("brc_school_credentials");
    return saved ? JSON.parse(saved) : {};
  },

  saveCredentials(creds) {
    localStorage.setItem("brc_school_credentials", JSON.stringify(creds));
  },

  // Check if school has set a password
  hasPassword(udise) {
    let creds = this.getCredentials();
    return !!creds[udise];
  },

  // Register or Set Password (First time)
  setPassword(udise, newPass) {
    let creds = this.getCredentials();
    creds[udise] = newPass;
    this.saveCredentials(creds);
    return true;
  },

  // Verify School Login
  login(udise, pass) {
    let creds = this.getCredentials();
    
    // School data se naam nikalne ke liye
    let schools = SessionManager.getData();
    let schoolObj = schools.find(s => String(s.udise) === String(udise));
    let schoolName = schoolObj ? schoolObj.name : "School";

    // 1. Agar custom password set hai aur match ho gaya
    if(creds[udise] && creds[udise] === pass) {
      localStorage.setItem("logged_school_udise", udise);
      localStorage.setItem("brc_logged_user", JSON.stringify({
        role: 'school',
        udise: udise,
        name: schoolName
      }));
      return true;
    }

    // 2. Default fallback: Agar password set nahi hai, toh "12345" ya UDISE code se login allow kar do
    if (!creds[udise]) {
      if (schoolObj && (pass === "12345" || pass === udise)) {
        localStorage.setItem("logged_school_udise", udise);
        localStorage.setItem("brc_logged_user", JSON.stringify({
          role: 'school',
          udise: udise,
          name: schoolName
        }));
        return true;
      }
    }

    return false;
  },

  // Logout School
  logout() {
    localStorage.removeItem("logged_school_udise");
    localStorage.removeItem("brc_logged_user");
  },

  // Get currently logged-in school UDISE
  getCurrentSchoolUdise() {
    return localStorage.getItem("logged_school_udise");
  }
};
