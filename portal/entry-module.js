const EntryModule = {
  init() {
    this.populateDropdown();
  },
  populateDropdown() {
    let schools = SessionManager.getData();
    let sel = document.getElementById("schoolSelect");
    if(!sel) return;
    sel.innerHTML = "";
    schools.forEach((s, idx) => {
      let opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `${s.name} (UDISE: ${s.udise} | JSK: ${s.jsk})`;
      sel.appendChild(opt);
    });
    this.loadForm();
  },
  loadForm() {
    let sel = document.getElementById("schoolSelect");
    if(!sel || sel.value === "") return;
    let schools = SessionManager.getData();
    let s = schools[sel.value];
    let tbody = document.getElementById("entryTableBody");
    tbody.innerHTML = "";

    const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
    classes.forEach(c => {
      if(!s.classes[c]) s.classes[c] = {scB:0,scG:0,stB:0,stG:0,obcB:0,obcG:0,genB:0,genG:0};
      let cl = s.classes[c];
      let rId = c.replace(" ", "_");
      tbody.innerHTML += `<tr>
        <td style="font-weight:bold;background:#f8fafc;">${c}</td>
        <td><input type="number" id="${rId}_scB" value="${cl.scB}" oninput="EntryModule.calc('${rId}')" style="width:100%;border:0;text-align:center;"></td>
        <td><input type="number" id="${rId}_scG" value="${cl.scG}" oninput="EntryModule.calc('${rId}')" style="width:100%;border:0;text-align:center;"></td>
        <td><input type="number" id="${rId}_stB" value="${cl.stB}" oninput="EntryModule.calc('${rId}')" style="width:100%;border:0;text-align:center;"></td>
        <td><input type="number" id="${rId}_stG" value="${cl.stG}" oninput="EntryModule.calc('${rId}')" style="width:100%;border:0;text-align:center;"></td>
        <td><input type="number" id="${rId}_obcB" value="${cl.obcB}" oninput="EntryModule.calc('${rId}')" style="width:100%;border:0;text-align:center;"></td>
        <td><input type="number" id="${rId}_obcG" value="${cl.obcG}" oninput="EntryModule.calc('${rId}')" style="width:100%;border:0;text-align:center;"></td>
        <td><input type="number" id="${rId}_genB" value="${cl.genB}" oninput="EntryModule.calc('${rId}')" style="width:100%;border:0;text-align:center;"></td>
        <td><input type="number" id="${rId}_genG" value="${cl.genG}" oninput="EntryModule.calc('${rId}')" style="width:100%;border:0;text-align:center;"></td>
        <td id="${rId}_totB">${cl.scB+cl.stB+cl.obcB+cl.genB}</td>
        <td id="${rId}_totG">${cl.scG+cl.stG+cl.obcG+cl.genG}</td>
        <td id="${rId}_T" style="font-weight:bold;background:#eef2ff;">${cl.scB+cl.scG+cl.stB+cl.stG+cl.obcB+cl.obcG+cl.genB+cl.genG}</td>
      </tr>`;
    });
  },
  calc(rId) {
    let scB = parseInt(document.getElementById(`${rId}_scB`).value)||0;
    let scG = parseInt(document.getElementById(`${rId}_scG`).value)||0;
    let stB = parseInt(document.getElementById(`${rId}_stB`).value)||0;
    let stG = parseInt(document.getElementById(`${rId}_stG`).value)||0;
    let obcB = parseInt(document.getElementById(`${rId}_obcB`).value)||0;
    let obcG = parseInt(document.getElementById(`${rId}_obcG`).value)||0;
    let genB = parseInt(document.getElementById(`${rId}_genB`).value)||0;
    let genG = parseInt(document.getElementById(`${rId}_genG`).value)||0;

    document.getElementById(`${rId}_totB`).innerText = scB+stB+obcB+genB;
    document.getElementById(`${rId}_totG`).innerText = scG+stG+obcG+genG;
    document.getElementById(`${rId}_T`).innerText = scB+scG+stB+stG+obcB+obcG+genB+genG;
  },
  saveData() {
    let sel = document.getElementById("schoolSelect");
    if(!sel || sel.value === "") return;
    let schools = SessionManager.getData();
    let s = schools[sel.value];

    ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
      let rId = c.replace(" ", "_");
      s.classes[c] = {
        scB: parseInt(document.getElementById(`${rId}_scB`).value)||0,
        scG: parseInt(document.getElementById(`${rId}_scG`).value)||0,
        stB: parseInt(document.getElementById(`${rId}_stB`).value)||0,
        stG: parseInt(document.getElementById(`${rId}_stG`).value)||0,
        obcB: parseInt(document.getElementById(`${rId}_obcB`).value)||0,
        obcG: parseInt(document.getElementById(`${rId}_obcG`).value)||0,
        genB: parseInt(document.getElementById(`${rId}_genB`).value)||0,
        genG: parseInt(document.getElementById(`${rId}_genG`).value)||0,
      };
    });
    SessionManager.saveData(schools);
    Dashboard.update();
    alert("Data safaltapurvak save ho gaya hai!");
  }
};
