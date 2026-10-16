import { SessionManager } from './session-manager.js';

export const ExcelHandler = {
  // ... upload function waisa hi rahega ...

  exportExcel() {
    try {
      let schools = SessionManager.getData();
      if (!schools || schools.length === 0) {
        alert("Export karne ke liye koi data available nahi hai!");
        return;
      }

      let exportData = [];
      schools.forEach((s, idx) => {
        let base = { "S.No.": idx + 1, "School Name": s.name, "UDISE Code": s.udise, "JSK": s.jsk };
        
        let totalAll = 0;
        ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
          let cl = s.classes && s.classes[c] ? s.classes[c] : {scB:0,scG:0,stB:0,stG:0,obcB:0,obcG:0,genB:0,genG:0};
          let cTot = (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0);
          base[c] = cTot;
          totalAll += cTot;
        });
        base["Grand Total"] = totalAll;
        exportData.push(base);
      });

      let worksheet = XLSX.utils.json_to_sheet(exportData);
      let workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "BRC_Compilation");
      XLSX.writeFile(workbook, "BRC_Shahpur_Compilation_Report.xlsx");
      
      alert("Excel report safaltapurvak download ho gayi hai!");
    } catch (err) {
      console.error("Excel Export Error:", err);
      alert("Excel export karne mein error aayi. Kripya check karein ki XLSX library loaded hai.");
    }
  }
};
