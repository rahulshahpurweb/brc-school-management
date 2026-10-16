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
        let jsonRows = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonRows || jsonRows.length === 0) {
          alert("Excel file khali hai!");
          return;
        }

        let schools = SessionManager.getData();
        let updatedCount = 0;

        jsonRows.forEach(row => {
          // Normalize keys to lowercase for flexible matching
          let normalizedRow = {};
          Object.keys(row).forEach(k => {
            normalizedRow[k.trim().toLowerCase()] = row[k];
          });

          let udise = normalizedRow["udise"] || normalizedRow["udise code"] || normalizedRow["school code"] || normalizedRow["code"] || normalizedRow["udise_code"];
          
          if (udise) {
            let targetSchool = schools.find(s => String(s.udise).trim() === String(udise).trim());
            if (targetSchool) {
              updatedCount++;
              
              if (normalizedRow["name"] || normalizedRow["school name"]) {
                targetSchool.name = normalizedRow["name"] || normalizedRow["school name"];
              }

              // Map Class 1 to 8 dynamically from various possible column names
              ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(cName => {
                let cleanName = cName.toLowerCase();
                let altName = cleanName.replace("class ", "c");
                let altName2 = cleanName.replace("class ", "class-");
                
                let val = normalizedRow[cleanName] || normalizedRow[altName] || normalizedRow[altName2] || normalizedRow[cName];
                
                if (val !== undefined && val !== "" && !isNaN(val)) {
                  let num = parseInt(val) || 0;
                  if (!targetSchool.classes[cName]) {
                    targetSchool.classes[cName] = {scB:0, scG:0, stB:0, stG:0, obcB:0, obcG:0, genB:num, genG:0};
                  } else {
                    targetSchool.classes[cName].genB = num;
                  }
                }
              });
            }
          }
        });

        SessionManager.saveData(schools);
        SessionManager.updateStats();
        SchoolRecords.render();
        CompilationModule.render();

        alert(`Excel file se ${updatedCount} schools ka data safaltapurvak feed aur sync ho gaya hai!`);
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
