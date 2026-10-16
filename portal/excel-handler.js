import { SessionManager } from './session-manager.js';
import { SchoolRecords } from './school-records.js';
import { CompilationModule } from './compilation.js';

export const ExcelHandler = {
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
        
        let rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!rows || rows.length === 0) {
          alert("Excel file khali hai!");
          return;
        }

        let schools = SessionManager.getData();
        let updatedCount = 0;

        // Har row ko check karein jisme UDISE/School Code (column 2 ya similar) ho
        rows.forEach((r) => {
          if (!r || r.length < 3) return;
          
          // UDISE code usually column index 2 par hota hai, ya fir kisi bhi column mein 11 digit ka number ho
          let udise = null;
          let schoolName = "";

          for (let colIdx = 0; colIdx < r.length; colIdx++) {
            let val = String(r[colIdx] || "").trim();
            // UDISE code is generally 11 digits
            if (/^\d{11}$/.test(val)) {
              udise = val;
              schoolName = String(r[colIdx - 1] || r[1] || "").trim();
              break;
            }
          }

          if (!udise && r[2] && String(r[2]).length >= 5) {
            udise = String(r[2]).trim();
            schoolName = String(r[1] || "").trim();
          }

          if (udise) {
            let targetSchool = schools.find(s => String(s.udise).trim() === udise);
            if (targetSchool) {
              updatedCount++;
              if (schoolName && schoolName !== "SCHOOL" && schoolName !== "School Code") {
                targetSchool.name = schoolName;
              }

              // Classes 1 to 8 mapping dynamically
              const classNames = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
              
              classNames.forEach((cName, idx) => {
                let baseCol = 5 + (idx * 14);
                
                let scB = parseInt(r[baseCol + 0]) || 0;
                let scG = parseInt(r[baseCol + 1]) || 0;
                let stB = parseInt(r[baseCol + 2]) || 0;
                let stG = parseInt(r[baseCol + 3]) || 0;
                let obcB = parseInt(r[baseCol + 4]) || 0;
                let obcG = parseInt(r[baseCol + 5]) || 0;
                let genB = parseInt(r[baseCol + 6]) || 0;
                let genG = parseInt(r[baseCol + 7]) || 0;

                targetSchool.classes[cName] = { scB, scG, stB, stG, obcB, obcG, genB, genG };
              });
            }
          }
        });

        SessionManager.saveData(schools);
        SessionManager.updateStats();
        SchoolRecords.render();
        CompilationModule.render();

        alert(`Excel file se ${updatedCount} schools ka data safaltapurvak feed aur cloud par sync ho gaya hai!`);
      } catch (err) {
        console.error("Excel Upload Error:", err);
        alert("Excel file read karne mein error aayi. Kripya sahi format upload karein.");
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
