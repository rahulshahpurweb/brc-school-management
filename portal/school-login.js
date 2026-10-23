import { SessionManager } from './session-manager.js';

export const SchoolLogin = {
  init() {
    let userStr = localStorage.getItem("brc_logged_user");
    if (!userStr) return;
    
    try {
      let user = JSON.parse(userStr);
      
      // 1. Agar School logged-in hai
      if (user && user.role === 'school') {
        console.log("Applying School Restrictions and auto-loading school data...");

        // Template aur Upload buttons hide karna
        setTimeout(() => {
          document.querySelectorAll('.hide-for-school').forEach(el => el.style.display = 'none');
        }, 300);

        // Academic Session ko lock karna
        let currentSess = SessionManager.getActiveSession ? SessionManager.getActiveSession() : "2026-27";
        let sessionSelect = document.getElementById("sessionSelect");
        if (sessionSelect) {
          sessionSelect.innerHTML = `<option value="${currentSess}">${currentSess} (Current)</option>`;
          sessionSelect.disabled = true;
        }

        // School dropdown mein sirf apni school lock karna aur data load karna
        let attempts = 0;
        let checkInterval = setInterval(() => {
          attempts++;
          let schoolSelect = document.getElementById("schoolSelect");
          
          if (schoolSelect && schoolSelect.options.length > 1) {
            let found = false;
            for (let opt of schoolSelect.options) {
              if (String(opt.value).trim() === String(user.udise).trim() || opt.text.includes(user.udise)) {
                schoolSelect.value = opt.value;
                found = true;
                break;
              }
            }
            if (!found) {
              schoolSelect.innerHTML = `<option value="${user.udise}">${user.name || 'My School'} (${user.udise})</option>`;
              schoolSelect.value = user.udise;
            }
            schoolSelect.disabled = true;

            // Data automatically load karne ke liye change event trigger karna
            schoolSelect.dispatchEvent(new Event('change'));
            if (typeof window.loadSchoolData === 'function') {
              window.loadSchoolData();
            }

            clearInterval(checkInterval);
          } else if (attempts > 25) { // Agar options load hone mein time lage
            clearInterval(checkInterval);
          }
        }, 300);
      } 
      
      // 2. Agar Admin ya JSK logged-in hai (Auto-select first school for Admin)
      else {
        let attempts = 0;
        let adminCheckInterval = setInterval(() => {
          attempts++;
          let schoolSelect = document.getElementById("schoolSelect");
          if (schoolSelect && schoolSelect.options.length > 1) {
            // Agar koi school pehle se select nahi hai, toh pehli school select karke data load kar do
            if (!schoolSelect.value || schoolSelect.value === "") {
              schoolSelect.selectedIndex = 1; // Pehli real school
            }
            schoolSelect.dispatchEvent(new Event('change'));
            if (typeof window.loadSchoolData === 'function') {
              window.loadSchoolData();
            }
            clearInterval(adminCheckInterval);
          } else if (attempts > 25) {
            clearInterval(adminCheckInterval);
          }
        }, 300);
      }

    } catch(e) {
      console.error("School Login Script Error:", e);
    }
  },

  logout() {
    localStorage.removeItem("brc_logged_user");
    sessionStorage.removeItem("brc_logged_in");
    location.href = "main.html";
  }
};

window.SchoolLogin = SchoolLogin;

document.addEventListener("DOMContentLoaded", () => {
  SchoolLogin.init();
});
