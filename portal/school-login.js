export const SchoolLogin = {
  init() {
    let userStr = localStorage.getItem("brc_logged_user");
    if (!userStr) return;
    
    try {
      let user = JSON.parse(userStr);
      if (user && user.role === 'school') {
        console.log("Applying School Restrictions from separate file...");

        // 1. Template aur Upload buttons hide karna
        setTimeout(() => {
          document.querySelectorAll('.hide-for-school').forEach(el => el.style.display = 'none');
        }, 300);

        // 2. Academic Session ko sirf 2026-27 par lock karna
        let sessionSelect = document.getElementById("sessionSelect");
        if (sessionSelect) {
          sessionSelect.innerHTML = `<option value="2026-27">2026-27 (Current)</option>`;
          sessionSelect.disabled = true;
        }

        // 3. Data Entry dropdown mein sirf apni school lock karna
        let checkInterval = setInterval(() => {
          let schoolSelect = document.getElementById("schoolSelect");
          if (schoolSelect && schoolSelect.options.length > 1) {
            for (let opt of schoolSelect.options) {
              if (String(opt.value).trim() === String(user.udise).trim() || opt.text.includes(user.udise)) {
                schoolSelect.value = opt.value;
                break;
              }
            }
            if (schoolSelect.value !== String(user.udise)) {
              schoolSelect.innerHTML = `<option value="${user.udise}">${user.name || 'My School'} (${user.udise})</option>`;
              schoolSelect.value = user.udise;
            }
            schoolSelect.disabled = true;
            clearInterval(checkInterval);
          }
        }, 400);
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

// Automatically run on load if imported
document.addEventListener("DOMContentLoaded", () => {
  SchoolLogin.init();
});
