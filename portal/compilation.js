import { SessionManager } from './session-manager.js';

export const CompilationModule = {
  render() {
    let jskFilter = document.getElementById("compJskFilter")?.value || "ALL";
    let schools = SessionManager.getData();
    let tbody = document.getElementById("compileTableBody");
    if(!tbody) return;
    tbody.innerHTML = "";
    const jsks = ["Bhoura", "Bijadehi", "Dhodhramau", "Kesiya", "Kundi", "Shahpur", "Tara"];
    const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
    
    jsks.forEach(jsk => {
      if(jskFilter !== "ALL" && jskFilter !== jsk) return;
      tbody.innerHTML += `<tr><td colspan="13" class="jsk-header">${jsk}</td></tr>`;
      let jTot = {scB:0,scG:0,stB:0,stG:0,obcB:0,obcG:0,genB:0,genG:0};
      
      classes.forEach(c => {
        let scB=0,scG=0,stB=0,stG=0,obcB=0,obcG=0,genB=0,genG=0;
        schools.forEach(s => {
          if(s.jsk.toLowerCase() === jsk.toLowerCase()){
            let cl = s.classes[c] || {};
            scB += cl.scB||0; scG += cl.scG||0; stB += cl.stB||0; stG += cl.stG||0;
            obcB += cl.obcB||0; obcG += cl.obcG||0; genB += cl.genB||0; genG += cl.genG||0;
          }
        });
        jTot.scB+=scB; jTot.scG+=scG; jTot.stB+=stB; jTot.stG+=stG;
        jTot.obcB+=obcB; jTot.obcG+=obcG; jTot.genB+=genB; jTot.genG+=genG;
        let tb = scB+stB+obcB+genB, tg = scG+stG+obcG+genG;
        tbody.innerHTML += `<tr><td></td><td style="text-align:left;font-weight:bold;">${c}</td><td>${scB}</td><td>${scG}</td><td>${stB}</td><td>${stG}</td><td>${obcB}</td><td>${obcG}</td><td>${genB}</td><td>${genG}</td><td>${tb}</td><td>${tg}</td><td style="font-weight:bold;background:#f8fafc;">${tb+tg}</td></tr>`;
      });
      let totB = jTot.scB+jTot.stB+jTot.obcB+jTot.genB, totG = jTot.scG+jTot.stG+jTot.obcG+jTot.genG;
      tbody.innerHTML += `<tr class="total-row"><td>Total</td><td style="text-align:left;">Total</td><td>${jTot.scB}</td><td>${jTot.scG}</td><td>${jTot.stB}</td><td>${jTot.stG}</td><td>${jTot.obcB}</td><td>${jTot.obcG}</td><td>${jTot.genB}</td><td>${jTot.genG}</td><td>${totB}</td><td>${totG}</td><td>${totB+totG}</td></tr>`;
    });
  }
};
