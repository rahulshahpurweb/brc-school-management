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
        jsonRows.forEach(row => {
          let udise = row.UDISE || row.udise || row["UDISE Code"] || row["Udise Code"];
          if(udise) {
            let targetSchool = schools.find(s => String(s.udise) === String(udise));
            if(targetSchool) {
              if(row.Name || row["School Name"]) targetSchool.name = row.Name || row["School Name"];
            }
          }
        });

        SessionManager.saveData(schools);
        SessionManager.updateStats();
        SchoolRecords.render();
        CompilationModule.render();

        alert("Excel file safaltapurvak upload aur sync ho gayi hai!");
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
