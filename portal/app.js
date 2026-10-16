import { MASTER_SCHOOLS } from './schools-data.js';
import { SessionManager } from './session-manager.js';
import { SchoolRecords } from './school-records.js';
import { EntryModule } from './entry-module.js';
import { CompilationModule } from './compilation.js';
import { ExcelHandler } from './excel-handler.js';
import { PrintHandler } from './print-handler.js';

window.SessionManager = SessionManager;
window.SchoolRecords = SchoolRecords;
window.EntryModule = EntryModule;
window.CompilationModule = CompilationModule;
window.ExcelHandler = ExcelHandler;
window.PrintHandler = PrintHandler;

window.onload = function() {
  SessionManager.init();
  SchoolRecords.render();
  EntryModule.populateDropdown();
  CompilationModule.render();
};

window.showTab = function(id) {
  document.querySelectorAll("main section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  
  if(id === 'entry') {
    EntryModule.populateDropdown();
  } else if(id === 'compilation') {
    CompilationModule.render();
  } else if(id === 'dash' || id === 'records') {
    SessionManager.updateStats();
    SchoolRecords.render();
  }
}
