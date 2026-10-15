import { SessionManager } from './session-manager.js';

export const SchoolRecords = {
  render() {
    let jsk = document.getElementById("jskFilter")?.value || "ALL";
    let query = document.getElementById("searchBox")?.value.toLowerCase() || "";
    let schools = SessionManager.getData();
    let tbody = document.getElementById("schoolTableBody");
    if(!tbody) return;
    tbody.innerHTML = "";

    let filtered = schools.filter(s => {
      return (jsk === "ALL" || s.jsk.toLowerCase() === jsk.toLowerCase()) && (s.name.toLowerCase().includes(query) || s.udise.includes(query));
    });

    filtered.forEach((s, idx) => {
      let tot = 0;
      for(let c in s.classes){
        let cl = s.classes[c];
        tot += (cl.scB||0)+(cl.scG||0)+(cl.stB||0)+(cl.stG||0)+(cl.obcB||0)+(cl.obcG||0)+(cl.genB||0)+(cl.genG||0);
      }
      let badge = tot > 0 ? `<span class="tag-green">Filled</span>` : `<span class="tag-red">Pending</span>`;
      tbody.innerHTML += `<tr><td>${idx+1}</td><td style="text-align:left"><strong>${s.name}</strong></td><td>${s.udise}</td><td>${s.category}</td><td>${s.jsk}</td><td><strong>${tot}</strong></td><td>${badge}</td></tr>`;
    });
  }
};
