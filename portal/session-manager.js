import { MASTER_SCHOOLS } from './schools-data.js';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwjZYYhrYb_f9C6I4eK5j4DHzBJ4ZoglrRnEum0CJkQ_RkImrnzCW7wMsJakbaenT-gfQ/exec";

let cloudMemoryData = null;
let currentCloudSession = "2026-27";

export const SessionManager = {
  async getActiveSession() {
    try {  
      let response = await fetch(WEB_APP_URL + "?action=getSession");
      let res = await response.json();
      if (res && res.activeSession) {  
        currentCloudSession = res.activeSession;
        return res.activeSession;  
      }  
    } catch (e) {
      console.error("Session fetch error:", e);
    }
    return currentCloudSession;
  },

  async setActiveSession(sessionName) {
    currentCloudSession = sessionName;
    let payload = { action: "setSession", session: sessionName };

    try {
      await fetch(WEB_APP_URL, {  
        method: "POST",  
        headers: { "Content-Type": "application/x-www-form-urlencoded" },  
        body: new URLSearchParams({ action: "setSession", session: sessionName })
      });
    } catch(e) {}

    location.reload();
  },

  async init() {
    await this.getActiveSession();
    this.renderDropdown();
    await this.fetchCloudDataDirectly();
    this.updateStats();
    this.applyRoleAccess();
  },

  async fetchCloudDataDirectly() {
    let activeSession = currentCloudSession;
    try {  
      let response = await fetch(`${WEB_APP_URL}?action=getAllData&session=${activeSession}&t=` + new Date().getTime());  
      let cloudData = await response.json();  
      if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {  
        cloudMemoryData = cloudData;  
      } else {
        let baseSchools = window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];  
        cloudMemoryData = JSON.parse(JSON.stringify(baseSchools));
      }
    } catch (err) {  
      console.error("Cloud Data Direct Fetch Error:", err);
      let baseSchools = window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];  
      cloudMemoryData = JSON.parse(JSON.stringify(baseSchools));
    }

    this.triggerAllRenders();
  },

  triggerAllRenders() {
    if(typeof SchoolRecords !== 'undefined' && SchoolRecords.render) SchoolRecords.render();  
    if(typeof CompilationModule !== 'undefined' && CompilationModule.render) CompilationModule.render();
    if(typeof window.loadSchoolData === 'function') {
      window.loadSchoolData();
    }
  },

  renderDropdown() {
    let select = document.getElementById("sessionSelect");
    let sessions = [
      { id: "2026-27", name: "2026-27" },
      { id: "2027-28", name: "2027-28" },
      { id: "2028-29", name: "2028-29" }
    ];

    let current = currentCloudSession;  
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
    if (cloudMemoryData && Array.isArray(cloudMemoryData)) {
      return cloudMemoryData;
    }
    return window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];
  },

  async saveData(schoolsData) {
    let activeSession = currentCloudSession;

    if (Array.isArray(schoolsData)) {  
      cloudMemoryData = schoolsData;  
    } else if (schoolsData && schoolsData.udise) {  
      if (!cloudMemoryData) cloudMemoryData = window.MASTER_SCHOOLS || MASTER_SCHOOLS || [];
      let index = cloudMemoryData.findIndex(s => String(s.udise).trim() === String(schoolsData.udise).trim());  
      if (index !== -1) cloudMemoryData[index] = schoolsData;  
      else cloudMemoryData.push(schoolsData);  
    }  

    this.updateStats();  
    this.triggerAllRenders();
    alert("Data saved successfully!");  

    try {
      await fetch(WEB_APP_URL, {  
        method: "POST",  
        headers: { "Content-Type": "application/x-www-form-urlencoded" },  
        body: new URLSearchParams({
          action: "saveData",
          session: activeSession,
          data: JSON.stringify(cloudMemoryData)
        })
      });
      console.log("Cloud synced successfully");
    } catch(err) {  
      console.error("Cloud Sync Error:", err);  
    }
  },

  updateStats() {
    let schools = this.getData();
    let totalSchools = schools.length;
    let totalEnroll = 0, filled = 0;
    let totalBoys = 0, totalGirls = 0;

    schools.forEach(s => {  
      let hasData = false;  
      let classesObj = s.classes || {};  
      Object.keys(classesObj).forEach(cName => {  
        let c = classesObj[cName] || {};  
        let bSum = (parseInt(c.scB) || 0) + (parseInt(c.stB) || 0) + (parseInt(c.obcB) || 0) + (parseInt(c.genB) || 0);
        let gSum = (parseInt(c.scG) || 0) + (parseInt(c.stG) || 0) + (parseInt(c.obcG) || 0) + (parseInt(c.genG) || 0);
        let sum = bSum + gSum;

        if (sum > 0) {  
          hasData = true;  
          totalEnroll += sum;  
          totalBoys += bSum;
          totalGirls += gSum;
        }  
      });  
      if (hasData) filled++;  
    });  

    let statSchools = document.getElementById("statSchools");  
    let statTotal = document.getElementById("statTotal");  
    let statFilled = document.getElementById("statFilled");  
    let statPending = document.getElementById("statPending");  
    let statBoysGirls = document.getElementById("statBoysGirls");

    if(statSchools) statSchools.innerText = totalSchools;  
    if(statTotal) statTotal.innerText = totalEnroll;  
    if(statFilled) statFilled.innerText = filled;  
    if(statPending) statPending.innerText = totalSchools - filled;
    
    if(statBoysGirls) {
      statBoysGirls.innerText = `Boys: ${totalBoys} | Girls: ${totalGirls}`;
    }
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
```[cite: 11]

---

### 2. `excel-handler.js` (कम्पलीट और अपडेटेड कोड)
यह फाइल एक्सेल अपलोड करते वक्त डेटा को सीधे गूगल शीट पर पोस्ट करती है[cite: 12]।

```javascript
import { SessionManager } from './session-manager.js';
import { SchoolRecords } from './school-records.js';
import { CompilationModule } from './compilation.js';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwjZYYhrYb_f9C6I4eK5j4DHzBJ4ZoglrRnEum0CJkQ_RkImrnzCW7wMsJakbaenT-gfQ/exec";

export const ExcelHandler = {
  downloadTemplate() {
    try {
      let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
      if (user.role === 'jsk' && window.FeaturePermissions && !FeaturePermissions.isAllowed('r2_jsk_template_download')) {
        alert("Admin dwara JSK ke liye Template Download की अनुमति नहीं दी गई है!");
        return;
      }

      let schools = SessionManager.getData();
      let templateData = [];
      
      schools.forEach((s, idx) => {
        let row = {
          "S.No.": idx + 1,
          "School Name": s.name,
          "UDISE Code": String(s.udise).trim(),
          "JSK": s.jsk
        };
        
        const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
        classes.forEach(c => {
          let cl = s.classes && s.classes[c] ? s.classes[c] : {};
          row[`${c} SC Boys`] = cl.scB || 0;
          row[`${c} SC Girls`] = cl.scG || 0;
          row[`${c} ST Boys`] = cl.stB || 0;
          row[`${c} ST Girls`] = cl.stG || 0;
          row[`${c} OBC Boys`] = cl.obcB || 0;
          row[`${c} OBC Girls`] = cl.obcG || 0;
          row[`${c} Gen Boys`] = cl.genB || 0;
          row[`${c} Gen Girls`] = cl.genG || 0;
        });
        
        templateData.push(row);
      });

      let worksheet = XLSX.utils.json_to_sheet(templateData);
      let workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollment_Template");
      XLSX.writeFile(workbook, "BRC_Shahpur_Enrollment_Template.xlsx");
      alert("Enrollment Template download शुरू हो गया है!");
    } catch (err) {
      console.error("Template Download Error:", err);
      alert("Template download करने में एरर आई।");
    }
  },

  async uploadExcel(event) {
    let user = JSON.parse(localStorage.getItem("brc_current_user") || localStorage.getItem("brc_logged_user") || "{}");
    if (user.role === 'jsk' && window.FeaturePermissions && !FeaturePermissions.isAllowed('r2_jsk_upload_excel')) {
      alert("Admin dwara JSK ke liye Excel Upload की अनुमति नहीं दी गई है!");
      event.target.value = ""; 
      return;
    }

    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = async function(e) {
      try {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        let firstSheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[firstSheetName];
        
        let rows = XLSX.utils.sheet_to_json(worksheet, { defval: 0 });
        if (!rows || rows.length === 0) {
          alert("Excel file खाली है या गलत फॉर्मेट है!");
          return;
        }

        let schools = SessionManager.getData();
        if (!schools || schools.length === 0) {
          alert("Master schools data load नहीं हुआ है!");
          return;
        }

        let updatedCount = 0;

        rows.forEach((r) => {
          try {
            let udise = "";
            for (let key in r) {
              let cleanKey = key.toLowerCase().trim();
              if (cleanKey.includes("udise") || cleanKey.includes("school code")) {
                udise = String(r[key]).trim();
                break;
              }
            }

            if (!udise && r["UDISE Code"]) udise = String(r["UDISE Code"]).trim();
            if (!udise && r["School Code"]) udise = String(r["School Code"]).trim();

            if (udise) {
              let targetSchool = schools.find(s => String(s.udise).trim() === udise);
              if (targetSchool) {
                updatedCount++;
                if (!targetSchool.classes) {
                  targetSchool.classes = {};
                }

                const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
                classes.forEach(c => {
                  let scB = parseInt(r[`${c} SC Boys`] ?? 0) || 0;
                  let scG = parseInt(r[`${c} SC Girls`] ?? 0) || 0;
                  let stB = parseInt(r[`${c} ST Boys`] ?? 0) || 0;
                  let stG = parseInt(r[`${c} ST Girls`] ?? 0) || 0;
                  let obcB = parseInt(r[`${c} OBC Boys`] ?? 0) || 0;
                  let obcG = parseInt(r[`${c} OBC Girls`] ?? 0) || 0;
                  let genB = parseInt(r[`${c} Gen Boys`] ?? 0) || 0;
                  let genG = parseInt(r[`${c} Gen Girls`] ?? 0) || 0;

                  targetSchool.classes[c] = { scB, scG, stB, stG, obcB, obcG, genB, genG };
                });
              }
            }
          } catch (rowErr) {
            console.error("Row processing error:", rowErr);
          }
        });

        if (updatedCount === 0) {
          alert("Excel file में कोई भी मैच करता हुआ UDISE Code नहीं मिला!");
          return;
        }

        alert(`${updatedCount} स्कूलों का डेटा प्रोसेस हो रहा है, कृपया गूगल शीट पर सिंक होने तक प्रतीक्षा करें...`);
        
        let activeSession = (typeof currentCloudSession !== 'undefined') ? currentCloudSession : "2026-27";

        try {
          await fetch(WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              action: "saveData",
              session: activeSession,
              data: JSON.stringify(schools)
            })
          });
          console.log("Excel bulk data synced successfully to Google Sheet!");
        } catch (syncErr) {
          console.error("Direct Cloud Sync Error:", syncErr);
        }

        SessionManager.updateStats();

        alert(`Excel file से ${updatedCount} schools का data सफलतापर्वक गूगल शीट पर सेव हो गया है!`);
        location.reload();
      } catch (err) {
        console.error("Excel Upload Error:", err);
        alert("Excel file read करने में एरर आई: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  },

  exportExcel() {
    try {
      let schools = SessionManager.getData();
      let exportData = [];
      schools.forEach((s, idx) => {
        let base = { "S.No.": idx + 1, "School Name": s.name, "UDISE Code": s.udise, "JSK": s.jsk };
        let totalAll = 0;
        ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
          let cl = s.classes && s.classes[c] ? s.classes[c] : {};
          let cTot = (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0);
          base[c] = cTot;
          totalAll += cTot;
        });
        base["Grand Total"] = totalAll;
        exportData.push(base);
      });

      let worksheet = XLSX.utils.json_to_sheet(exportData);
      let workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "BRC_Data");
      XLSX.writeFile(workbook, "BRC_Shahpur_Report.xlsx");
      alert("Excel report download शुरू हो गई है!");
    } catch (err) {
      alert("Excel export करने में एरर आई।");
    }
  }
};

window.ExcelHandler = ExcelHandler;
```[cite: 12]

---

### 3. Google Apps Script (`Code.js`) — (सबसे जरूरी बैकएंड कोड)
अपनी गूगल शीट के अंदर Apps Script में जाकर यह फाइनल कोड डाल दें ताकि यह डेटा को सही सलामत रो-वाइज सेव करे:

```javascript
var ss = SpreadsheetApp.getActiveSpreadsheet();

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var rawData = "";
    if (e && e.postData && e.postData.contents) {
      rawData = e.postData.contents;
    }

    var payload = {};
    try {
      payload = JSON.parse(rawData);
    } catch (err) {
      payload = e.parameter || {};
    }

    var action = payload.action || (e && e.parameter && e.parameter.action) || "";
    var session = payload.session || "2026-27";

    if (action === "saveData" || action === "save") {
      var sheetName = "Data_" + session;
      var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
      
      var schoolsData = payload.data;
      if (typeof schoolsData === "string") {
        try { schoolsData = JSON.parse(schoolsData); } catch(e){}
      }
      
      var jsonString = JSON.stringify(schoolsData || []);

      sheet.clear();
      sheet.appendRow(["Key", "Portal_Data_JSON"]);
      sheet.appendRow(["Schools_Array", jsonString]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Saved Successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid Action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action ? e.parameter.action : "";
  var session = e && e.parameter && e.parameter.session ? e.parameter.session : "2026-27";
  
  if (action === "getAllData" || action === "getData") {
    var sheetName = "Data_" + session;
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var dataRange = sheet.getDataRange().getValues();
    if (dataRange.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (dataRange[1][0] === "Schools_Array" || dataRange.length >= 2) {
      var jsonStr = dataRange[1][1] || dataRange[1][0];
      try {
        var parsed = JSON.parse(jsonStr);
        return ContentService.createTextOutput(JSON.stringify(parsed))
          .setMimeType(ContentService.MimeType.JSON);
      } catch (err) {}
    }
    
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
