// Admin Session Lock & Unlock Management
export const AdminLocks = {
  // Default allowed sessions
  getDefaultSessions() {
    return [
      { id: "2026-27", name: "2026-27 (Current)", locked: false },
      { id: "2027-28", name: "2027-28 (Future)", locked: true },
      { id: "2028-29", name: "2028-29 (Future)", locked: true }
    ];
  },

  // Get session status from localStorage or default
  getSessions() {
    let saved = localStorage.getItem("brc_academic_sessions");
    if(!saved) {
      let def = this.getDefaultSessions();
      localStorage.setItem("brc_academic_sessions", JSON.stringify(def));
      return def;
    }
    return JSON.parse(saved);
  },

  // Check if a session is locked
  isLocked(sessionId) {
    let sessions = this.getSessions();
    let s = sessions.find(x => x.id === sessionId);
    return s ? s.locked : true;
  },

  // Admin can unlock/lock a session
  toggleLock(sessionId, adminPassword) {
    // Simple verification for admin action
    if(adminPassword !== "brc@shahpur") {
      alert("Galat Admin Password! Session lock status nahi badla ja sakta.");
      return false;
    }
    let sessions = this.getSessions();
    sessions.forEach(s => {
      if(s.id === sessionId) {
        s.locked = !s.locked;
      }
    });
    localStorage.setItem("brc_academic_sessions", JSON.stringify(sessions));
    alert(`Session ${sessionId} ka lock status update ho gaya hai!`);
    return true;
  }
};
