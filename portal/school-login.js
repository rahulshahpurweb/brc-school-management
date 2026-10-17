export const SchoolLogin = {
  init() {
    this.applyRestrictions();
  },

  getCurrentUser() {
    let userStr = localStorage.getItem("brc_logged_user");
    if (!userStr) return null;
    try { return JSON.parse(userStr); } catch(e) { return null; }
  },

  isSchoolUser() {
    let user = this.getCurrentUser();
    return user && user.role === 'school';
  },

  applyRestrictions() {
    let user = this.getCurrentUser();
    if (!user) return;

    if (user.role === 'school') {
      // 1. Template aur Upload buttons hide karna
      setTimeout(() => {
        document.querySelectorAll('.hide-for-school').forEach(el => el.style.display = 'none');
      }, 300);

      // 2. Session dropdown ko lock karna taaki sirf 2026-27 dikhe
      let sessionSelect = document.getElementById("sessionSelect");
      if (sessionSelect) {
        sessionSelect.innerHTML = `<option value="2026-27">2026-27 (Current School Session)</option>`;
        sessionSelect.disabled = true;
      }

      // 3. Data Entry mein sirf apni school lock karna
      let schoolSelect = document.getElementById("schoolSelect");
      if (schoolSelect) {
        // Thoda wait karke dropdown me sirf wahi school set kar denge
        setTimeout(() => {
          for (let opt of schoolSelect.options) {
            if (opt.value === String(user.udise) || opt.text.includes(user.udise)) {
              schoolSelect.value = opt.value;
              schoolSelect.disabled = true; // Doosra school select na kar paye
              break;
            }
          }
          // Agar select me nahi mila toh sirf wahi option dikhaye
          if (schoolSelect.value !== String(user.udise)) {
            schoolSelect.innerHTML = `<option value="${user.udise}">${user.name} (${user.udise})</option>`;
            schoolSelect.disabled = true;
          }
        }, 500);
      }
    }
  },

  logout() {
    localStorage.removeItem("brc_logged_user");
    sessionStorage.removeItem("brc_logged_in");
    location.href = "main.html";
  }
};

window.SchoolLogin = SchoolLogin;
