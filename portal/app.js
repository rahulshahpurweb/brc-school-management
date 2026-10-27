import { MASTER_SCHOOLS } from './schools-data.js';
import { SessionManager } from './session-manager.js';
import { SchoolRecords } from './school-records.js';
import { EntryModule } from './entry-module.js';
import { CompilationModule } from './compilation.js';
import { ExcelHandler } from './excel-handler.js';
import { PrintHandler } from './print-handler.js';

window.SessionManager = SessionManager;
window.SchoolRecords = SchoolRecords;
window.EntryModule = EntryModule;
window.CompilationModule = CompilationModule;
window.ExcelHandler = ExcelHandler;
window.PrintHandler = PrintHandler;

window.addEventListener('DOMContentLoaded', () => {
  let isMaintenance = localStorage.getItem("brc_maintenance_mode") === "true";
  let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");

  if (isMaintenance && user.role !== "admin") {
    let overlay = document.getElementById("maintenanceOverlay");
    if (overlay) overlay.style.display = "flex";
    document.body.style.visibility = 'visible';
    return;
  }

  // 1. Initialize Session & Basic Modules
  SessionManager.init();
  SchoolRecords.render();
  CompilationModule.render();

  // 2. Populate Dropdown first so options are available
  EntryModule.populateDropdown();

  let schoolSelect = document.getElementById("schoolSelect");
  let sessionSelect = document.getElementById("sessionSelect");
  let sessionBadge = document.getElementById("sessionBadge");
  let activeSess = localStorage.getItem("brc_active_session") || "2026-27";

  if (sessionSelect) {
    sessionSelect.value = activeSess;
  }

  if (user && user.role) {
    // Admin Role Handling
    if (user.role === 'admin') {
      let adminBtn = document.getElementById("adminControlBtn");
      if (adminBtn) adminBtn.style.display = "inline-block";

      if (schoolSelect && schoolSelect.options.length > 1) {
        if (!schoolSelect.value || schoolSelect.value === "") {
          schoolSelect.selectedIndex = 1;
        }
        schoolSelect.dispatchEvent(new Event('change', { bubbles: true }));
        if (typeof EntryModule.loadForm === 'function') {
          EntryModule.loadForm();
        }
      }
    } else {
      if (sessionSelect) sessionSelect.style.display = 'none';
      if (sessionBadge) {
        sessionBadge.innerText = activeSess;
        sessionBadge.style.display = 'inline-block';
      }
    }

    // School Role Handling (Using correct index value matching so data appears instantly)
    if (user.role === 'school') {
      if (schoolSelect && schoolSelect.options.length > 0) {
        let foundIndexValue = "";
        for (let i = 0; i < schoolSelect.options.length; i++) {
          let opt = schoolSelect.options[i];
          if (opt.text.includes(user.udise) || opt.value === String(user.udise)) {
            foundIndexValue = opt.value;
            break;
          }
        }

        if (foundIndexValue !== "") {
          schoolSelect.value = foundIndexValue;
        } else {
          schoolSelect.selectedIndex = 0;
        }

        schoolSelect.disabled = true;
        schoolSelect.dispatchEvent(new Event('change', { bubbles: true }));
        if (typeof EntryModule.loadForm === 'function') {
          EntryModule.loadForm();
        }
      }
    } 
    // JSK Role Handling (Default view opens compilation report, visibility is fully managed by Feature Control panel)
    else if (user.role === 'jsk') {
      window.showTab('compilation');
      CompilationModule.render();
    }
  }

  // 3. Enforce Master Feature Control settings live across UI
  if (typeof FeaturePermissions !== 'undefined' && typeof FeaturePermissions.enforceUI === 'function') {
    FeaturePermissions.enforceUI();
  }

  // 4. Anti-Flicker Release: Show page cleanly in one go without double-reflection
  document.body.style.visibility = 'visible';
});

window.showTab = function(id) {
  document.querySelectorAll("main section").forEach(s => s.classList.remove("active"));
  let target = document.getElementById(id);
  if (target) target.classList.add("active");
  
  if (id === 'entry') {
    EntryModule.populateDropdown();
  } else if (id === 'compilation') {
    CompilationModule.render();
  } else if (id === 'dash' || id === 'records') {
    SessionManager.updateStats();
    SchoolRecords.render();
  }
};
