Import { AdminLocks } from './admin-locks.js';
import { MASTER_SCHOOLS } from './schools-data.js';

const WEB_APP_URL = "Https://script.google.com/macros/s/AKfycbyRbPEcNgjpFXFGnqVVtVBdTsjlo_mMEy23SS3DggMAk2BRuy_M324DohO9JpYDPhoh_w/exec";

export const SessionManager = {
getActiveSession() {
// 1. Pehle local storage se turant uthao taaki speed fast rahe
let cached = localStorage.getItem("brc_active_session");
if (cached) return cached;

// 2. Agar local mein na ho, tabhi cloud se mango (fallback)  
try {  
  let xhr = new XMLHttpRequest();  
  xhr.open("GET", WEB_APP_URL + "?action=getSession", false);  
  xhr.send();  
  if (xhr.status === 200) {  
    let res = JSON.parse(xhr.responseText);  
    if (res && res.activeSession) {  
      localStorage.setItem("brc_active_session", res.activeSession);  
      return res.activeSession;  
    }  
  }  
} catch (e) {}  
return "2026-27";

},

setActiveSession(sessionName) {
localStorage.setItem("brc_active_session", sessionName);
let payload = { action: "setSession", session: sessionName };

fetch(WEB_APP_URL, {  
  method: "POST",  
  mode: "no-cors",  
  headers: { "Content-Type": "text/plain;charset=utf-8" },  
  body: JSON.stringify(payload)  
}).then(() => {  
  location.reload();  
});

},

async init() {
this.renderDropdown();
this.updateStats();
// Background mein cloud se data fetch karke update karega taaki speed fast rahe
this.loadCloudDataInBackground();
this.applyRoleAccess();
},

renderDropdown() {
let select = document.getElementById("sessionSelect");
let sessions = [
{ id: "2026-27", name: "2026-27" },
{ id: "2027-28", name: "2027-28" },
{ id: "2028-29", name: "2028-29" }
];

let current = this.getActiveSession();  
let currentUser = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");  
let isAdmin = (currentUser.role === 'admin');  

if(select && isAdmin) {  
  select.innerHTML = "";  
  sessions.forEach(s => {  
    let opt = document.createElement("option");  
    opt.value = s.id;  
    opt.textContent = s.name;  
    if(s.id === current) opt.selected = true;  
    select.appendChild(opt);  
  });  
  select.disabled = false;  
} else if (select && !isAdmin) {  
  select.style.display = 'none';  
}  

let sessionBadge = document.getElementById("sessionBadge");  
if (sessionBadge) {  
  sessionBadge.innerText = current;  
  sessionBadge.style.display = 'inline-block';  
}

},

changeSession() {
let select = document.getElementById("sessionSelect");
if(!select) return;
this.setActiveSession(select.value);
},

getData() {
let activeSession = this.getActiveSession();
let dataKey = brc_schools_data_${activeSession};
let saved = localStorage.getItem(dataKey);

if (!saved) {  
  let baseSchools = window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];  
  let freshSchools = JSON.parse(JSON.stringify(baseSchools));  
  freshSchools.forEach(s => {  
    if (s.classes) {  
      Object.keys(s.classes).forEach(cName => {  
        let c = s.classes[cName];  
        Object.keys(c).forEach(k => c[k] = 0);  
      });  
    }  
  });  
  localStorage.setItem(dataKey, JSON.stringify(freshSchools));  
  return freshSchools;  
}  
try {  
  return JSON.parse(saved);  
} catch (e) {  
  return window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];  
}

},

async loadCloudDataInBackground() {
let activeSession = this.getActiveSession();
let dataKey = brc_schools_data_${activeSession};

try {  
  let response = await fetch(`${WEB_APP_URL}?session=${activeSession}`);  
  let cloudData = await response.json();  
  if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {  
    localStorage.setItem(dataKey, JSON.stringify(cloudData));  
    this.updateStats();  
    if(typeof SchoolRecords !== 'undefined' && SchoolRecords.render) SchoolRecords.render();  
    if(typeof CompilationModule !== 'undefined' && CompilationModule.render) CompilationModule.render();  
  }  
} catch (err) {  
  console.error("Background Sync Error:", err);  
}

},

saveData(schoolsData) {
let activeSession = this.getActiveSession();
let dataKey = brc_schools_data_${activeSession};

// Local storage mein turant save karo taaki ekdum instant response mile  
let allSchools = this.getData();  
if (Array.isArray(schoolsData)) {  
  allSchools = schoolsData;  
} else if (schoolsData && schoolsData.udise) {  
  let index = allSchools.findIndex(s => s.udise === schoolsData.udise);  
  if (index !== -1) allSchools[index] = schoolsData;  
  else allSchools.push(schoolsData);  
}  

localStorage.setItem(dataKey, JSON.stringify(allSchools));  
this.updateStats();  
alert("Data safaltapurvak save ho gaya!");  

// Background mein Google Sheet par sync kar do  
let payload = { session: activeSession, data: allSchools };  
fetch(WEB_APP_URL, {  
  method: "POST",  
  mode: "no-cors",  
  headers: { "Content-Type": "text/plain;charset=utf-8" },  
  body: JSON.stringify(payload)  
}).then(() => {  
  console.log("Cloud synced successfully");  
}).catch(err => {  
  console.error("Cloud Sync Error:", err);  
});

},

updateStats() {
let schools = this.getData();
let totalSchools = schools.length;
let totalEnroll = 0, filled = 0;

schools.forEach(s => {  
  let hasData = false;  
  let classesObj = s.classes || {};  
  Object.keys(classesObj).forEach(cName => {  
    let c = classesObj[cName] || {};  
    let sum = Object.values(c).reduce((a, b) => a + (parseInt(b) || 0), 0);  
    if (sum > 0) {  
      hasData = true;  
      totalEnroll += sum;  
    }  
  });  
  if (hasData) filled++;  
});  

let statSchools = document.getElementById("statSchools");  
let statTotal = document.getElementById("statTotal");  
let statFilled = document.getElementById("statFilled");  
let statPending = document.getElementById("statPending");  

if(statSchools) statSchools.innerText = totalSchools;  
if(statTotal) statTotal.innerText = totalEnroll;  
if(statFilled) statFilled.innerText = filled;  
if(statPending) statPending.innerText = totalSchools - filled;

},

getCurrentUser() {
let session = localStorage.getItem("brc_current_user");
return session ? JSON.parse(session) : null;
},

applyRoleAccess() {
let currentUser = this.getCurrentUser();
if(!currentUser) return;
let role = currentUser.role;

if(role === "jsk") {  
  let dataEntryTab = document.querySelector("[data-target='entry']") || document.getElementById("entrySection");  
  let schoolListTab = document.querySelector("[data-target='records']") || document.getElementById("recordsSection");  
  if(dataEntryTab) dataEntryTab.style.display = "none";  
  if(schoolListTab) schoolListTab.style.display = "none";  
}  
else if(role === "school") {  
  let compilationTab = document.querySelector("[data-target='compilation']") || document.getElementById("compilationSection");  
  if(compilationTab) compilationTab.style.display = "none";  
}

}
};

window.SessionManager = SessionManager;
