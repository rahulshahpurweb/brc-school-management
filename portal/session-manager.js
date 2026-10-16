updateStats() {
    let schools = this.getData();
    let totalSchools = schools.length;
    let totalEnroll = 0, boys = 0, girls = 0, filled = 0;

    schools.forEach(s => {
      let hasData = false;
      let classesObj = s.classes || {};
      
      Object.keys(classesObj).forEach(cName => {
        let c = classesObj[cName] || {};
        let sum = (parseInt(c.scB)||0) + (parseInt(c.scG)||0) + 
                  (parseInt(c.stB)||0) + (parseInt(c.stG)||0) + 
                  (parseInt(c.obcB)||0) + (parseInt(c.obcG||0) || parseInt(c.obg)||0) + 
                  (parseInt(c.genB)||0) + (parseInt(c.genG||0) || parseInt(c.geng)||0);
        
        if (sum > 0) {
          hasData = true;
          totalEnroll += sum;
          boys += (parseInt(c.scB)||0) + (parseInt(c.stB)||0) + (parseInt(c.obcB)||0) + (parseInt(c.genB)||0);
          girls += (parseInt(c.scG)||0) + (parseInt(c.stG||0) + (parseInt(c.obcG)||0) + (parseInt(c.genG)||0));
        }
      });
      
      if (hasData) {
        filled++;
      }
    });

    let statSchools = document.getElementById("statSchools");
    let statTotal = document.getElementById("statTotal");
    let statBoysGirls = document.getElementById("statBoysGirls");
    let statFilled = document.getElementById("statFilled");
    let statPending = document.getElementById("statPending");

    if(statSchools) statSchools.innerText = totalSchools;
    if(statTotal) statTotal.innerText = totalEnroll;
    if(statBoysGirls) statBoysGirls.innerText = `Boys: ${boys} | Girls: ${girls}`;
    if(statFilled) statFilled.innerText = filled;
    if(statPending) statPending.innerText = totalSchools - filled;
  }
