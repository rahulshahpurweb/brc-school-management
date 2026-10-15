const ExcelHandler = {
  exportExcel() {
    let table = document.getElementById("compileTable");
    let html = table.outerHTML;
    let blob = new Blob(['\ufeff' + html], {type: 'application/vnd.ms-excel'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `BRC_Shahpur_Report_${SessionManager.currentSession}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
  uploadExcel(event) {
    let file = event.target.files[0];
    if(!file) return;
    let reader = new FileReader();
    reader.onload = function(e){
      try {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let json = XLSX.utils.sheet_to_json(sheet, {header: 1});

        let parsed = [];
        for(let i=4; i<json.length; i++){
          let r = json[i];
          if(!r || !r[1] || !r[2]) continue;
          let classesObj = {};
          let classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
          classes.forEach((c, idx) => {
            let cs = 5 + (idx * 11);
            classesObj[c] = {
              scB: parseInt(r[cs]||0), scG: parseInt(r[cs+1]||0),
              stB: parseInt(r[cs+2]||0), stG: parseInt(r[cs+3]||0),
              obcB: parseInt(r[cs+4]||0), obcG: parseInt(r[cs+5]||0),
              genB: parseInt(r[cs+6]||0), genG: parseInt(r[cs+7]||0)
            };
          });
          parsed.push({name: String(r[1]).trim(), udise: String(r[2]).trim(), category: String(r[3]||"").trim(), jsk: String(r[4]||"").trim(), classes: classesObj});
        }
        if(parsed.length > 0){
          SessionManager.saveData(parsed);
          SessionManager.loadSessionData();
          alert(`Safaltapurvak ${parsed.length} schools ka data import ho gaya hai!`);
        } else {
          alert("Excel file format match nahi ho raha hai.");
        }
      } catch(err) {
        alert("File read karne mein error aayi.");
      }
    };
    reader.readAsArrayBuffer(file);
  }
};
