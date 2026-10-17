export const SchoolLogin = {
  init() {
    this.checkLoginStatus();
  },

  getCurrentUser() {
    let userStr = localStorage.getItem("brc_logged_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch(e) {
      return null;
    }
  },

  isSchoolUser() {
    let user = this.getCurrentUser();
    return user && user.role === 'school';
  },

  isAdminUser() {
    let user = this.getCurrentUser();
    return !user || user.role === 'admin';
  },

  login(username, password) {
    // Admin Master Login check
    if (username === "admin" && password === "brc2026") {
      localStorage.setItem("brc_logged_user", JSON.stringify({ role: 'admin', name: 'BRC Admin' }));
      return { success: true, role: 'admin' };
    }

    // School UDISE Code & Password check (Password by default UDISE code ya koi secure password ho sakta hai)
    // Yahan hum master schools data se UDISE match karenge
    let schools = JSON.parse(localStorage.getItem("brc_schools_data_2026-27") || "[]");
    let foundSchool = schools.find(s => String(s.udise).trim() === String(username).trim());

    if (foundSchool) {
      // School ke liye default password ya custom logic (jaise password me udise ya alag password)
      let pass = password.trim();
      if (pass === "12345" || pass === String(foundSchool.udise).trim()) {
        localStorage.setItem("brc_logged_user", JSON.stringify({ 
          role: 'school', 
          udise: foundSchool.udise, 
          name: foundSchool.name 
        }));
        return { success: true, role: 'school' };
      }
    }

    return { success: false, message: "Galat UDISE Code ya Password!" };
  },

  logout() {
    localStorage.removeItem("brc_logged_user");
    location.reload();
  },

  checkLoginStatus() {
    let user = this.getCurrentUser();
    let loginModal = document.getElementById("loginModalOverlay");
    
    if (!user) {
      if (loginModal) loginModal.style.display = "flex";
      this.renderLoginScreen();
    } else {
      if (loginModal) loginModal.style.display = "none";
      this.applyRoleRestrictions();
    }
  },

  renderLoginScreen() {
    let container = document.getElementById("loginModalOverlay");
    if (!container) {
      container = document.createElement("div");
      container.id = "loginModalOverlay";
      container.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; justify-content:center; align-items:center;";
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div style="background:white; padding:30px; border-radius:10px; width:90%; max-width:400px; box-shadow:0 4px 15px rgba(0,0,0,0.3);">
        <h3 style="margin-top:0; color:#1a73e8; text-align:center;">BRC Shahpur Portal Login</h3>
        <p style="font-size:13px; color:#666; text-align:center;">Admin ya apne School ka UDISE Code dalein</p>
        <div style="margin-bottom:15px;">
          <label style="font-size:12px; font-weight:bold;">Username / UDISE Code</label>
          <input type="text" id="loginUser" placeholder="Jaise: admin ya UDISE code" style="width:100%; padding:10px; margin-top:5px; border:1px solid #ccc; border-radius:5px; box-sizing:border-box;">
        </div>
        <div style="margin-bottom:20px;">
          <label style="font-size:12px; font-weight:bold;">Password</label>
          <input type="password" id="loginPass" placeholder="Password dalein" style="width:100%; padding:10px; margin-top:5px; border:1px solid #ccc; border-radius:5px; box-sizing:border-box;">
        </div>
        <button id="btnLoginSubmit" style="width:100%; background:#1a73e8; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer;">Login Karein</button>
      </div>
    `;

    document.getElementById("btnLoginSubmit").onclick = () => {
      let u = document.getElementById("loginUser").value;
      let p = document.getElementById("loginPass").value;
      let res = this.login(u, p);
      if (res.success) {
        location.reload();
      } else {
        alert(res.message);
      }
    };
  },

  applyRoleRestrictions() {
    if (this.isSchoolUser()) {
      // School user ke liye Template download aur Upload buttons ko hide kar dena
      setTimeout(() => {
        let hideButtons = document.querySelectorAll('.hide-for-school');
        hideButtons.forEach(btn => btn.style.display = 'none');
      }, 500);
    }
  }
};

window.SchoolLogin = SchoolLogin;
