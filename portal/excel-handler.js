import { SessionManager } from './session-manager.js';
import { SchoolRecords } from './school-records.js';
import { CompilationModule } from './compilation.js';

export const ExcelHandler = {
  downloadTemplate() {
    try {
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
      alert("Enrollment Template download shuru ho gaya hai!");
    } catch (err) {
      console.error("Template Download Error:", err);
      alert("Template download karne mein error aayi.");
    }
  },

  uploadExcel(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
      try {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        let firstSheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[firstSheetName];
        
        let rows = XLSX.utils.sheet_to_json(worksheet, { defval: 0 });
        if (!rows || rows.length === 0) {
          alert("Excel file khali hai!");
          return;
        }

        let schools = SessionManager.getData();
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
                
                // Ensure classes object exists
                if (!targetSchool.classes) {
                  targetSchool.classes = {};
                }

                const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
                
                classes.forEach(c => {
                  let scB = parseInt(r[`${c} SC Boys`] ?? r[`${c}_scB`] ?? 0) || 0;
                  let scG = parseInt(r[`${c} SC Girls`] ?? r[`${c}_scG`] ?? 0) || 0;
                  let stB = parseInt(r[`${c} ST Boys`] ?? r[`${c}_stB`] ?? 0) || 0;
                  let stG = parseInt(r[`${c} ST Girls`] ?? r[`${c}_stG`] ?? 0) || 0;
                  let obcB = parseInt(r[`${c} OBC Boys`] ?? r[`${c}_obcB`] ?? 0) || 0;
                  let obcG = parseInt(r[`${c} OBC Girls`] ?? r[`${c}_obcG`] ?? 0) || 0;
                  let genB = parseInt(r[`${c} Gen Boys`] ?? r[`${c}_genB`] ?? 0) || 0;
                  let genG = parseInt(r[`${c} Gen Girls`] ?? r[`${c}_genG`] ?? 0) || 0;

                  targetSchool.classes[c] = { scB, scG, stB, stG, obcB, obcG, genB, genG };
                });
              }
            }
          } catch (rowErr) {
            console.error("Row processing error:", rowErr);
          }
        });

        if (updatedCount === 0) {
          alert("Excel file mein koi bhi match karta hua UDISE Code nahi mila!");
          return;
        }

        SessionManager.saveData(schools);
        SessionManager.updateStats();

        alert(`Excel file se ${updatedCount} schools ka data safaltapurvak feed aur cloud par sync ho gaya hai!`);
        
        // Auto reload page to show updated dashboard stats instantly
        location.reload();
      } catch (err) {
        console.error("Excel Upload Error:", err);
        alert("Excel file read karne mein error aayi.");
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
      alert("Excel report download shuru ho gayi hai!");
    } catch (err) {
      alert("Excel export karne mein error aayi.");
    }
  }
};

window.ExcelHandler = ExcelHandler;
