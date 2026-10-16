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
    if(creds[udise] && creds[udise] === pass) {
      localStorage.setItem("logged_school_udise", udise);
      return true;
    }
    return false;
  },

  // Logout School
  logout() {
    localStorage.removeItem("logged_school_udise");
  },

  // Get currently logged-in school UDISE
  getCurrentSchoolUdise() {
    return localStorage.getItem("logged_school_udise");
  }
};
