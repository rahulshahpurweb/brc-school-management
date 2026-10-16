// Safe Excel Upload Handler Example
export const ExcelHandler = {
  uploadExcel(event) {
    let file = event.target.files[0];
    if(!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
      try {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        let firstSheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[firstSheetName];
        let jsonRows = XLSX.utils.sheet_to_json(worksheet);

        // Process data safely here
        console.log("Parsed Excel Data:", jsonRows);
        alert("Excel file safaltapurvak upload ho gayi hai!");
      } catch (err) {
        console.error("Excel Parse Error:", err);
        alert("Excel file parse karne mein error aayi! Kripya sahi format wali file upload karein.");
      }
    };
    reader.readAsArrayBuffer(file);
  },

  exportExcel() {
    // Export logic
    alert("Excel export suvidha active hai.");
  }
};
