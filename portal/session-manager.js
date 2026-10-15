const SessionManager = {
  currentSession: "2026-27",
  init() {
    let sel = document.getElementById("sessionSelect");
    sel.innerHTML = `
      <option value="2026-27">2026-27</option>
      <option value="2027-28">2027-28</option>
      <option value="2028-29">2028-29</option>
      <option value="2029-30">2029-30</option>
    `;
    this.loadSessionData();
  },
  changeSession() {
    this.currentSession = document.getElementById("sessionSelect").value;
    document.getElementById("dashTitle").innerText = `📊 BRC Shahpur Overall Summary (Session: ${this.currentSession})`;
    this.loadSessionData();
  },
  getStorageKey() {
    return "brc_modular_session_" + this.currentSession;
  },
  getData() {
    let data = localStorage.getItem(this.getStorageKey());
    if(!data){
      let fresh = JSON.parse(JSON.stringify(MASTER_SCHOOLS));
      fresh.forEach(s => {
        s.classes = {};
        ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"].forEach(c => {
          s.classes[c] = {scB:0, scG:0, stB:0, stG:0, obcB:0, obcG:0, genB:0, genG:0};
        });
      });
      return fresh;
    }
    return JSON.parse(data);
  },
  saveData(data) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
  },
  loadSessionData() {
    SchoolRecords.render();
    EntryModule.populateDropdown();
    CompilationModule.render();
    Dashboard.update();
  }
};

const Dashboard = {
  update() {
    let schools = SessionManager.getData();
    let totalSchools = schools.length;
    let b=0, g=0, filled=0, pending=0;
    schools.forEach(s => {
      let sb=0, sg=0;
      for(let c in s.classes){
        let cl = s.classes[c];
        sb += (cl.scB||0) + (cl.stB||0) + (cl.obcB||0) + (cl.genB||0);
        sg += (cl.scG||0) + (cl.stG||0) + (cl.obcG||0) + (cl.genG||0);
      }
      b += sb; g += sg;
      if((sb+sg) > 0) filled++; else pending++;
    });
    document.getElementById("statSchools").innerText = totalSchools;
    document.getElementById("statTotal").innerText = (b+g).toLocaleString();
    document.getElementById("statBoysGirls").innerText = `Boys: ${b.toLocaleString()} | Girls: ${g.toLocaleString()}`;
    document.getElementById("statFilled").innerText = filled;
    document.getElementById("statPending").innerText = pending;
  }
};
