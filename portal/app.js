import { SessionManager } from './session-manager.js';
import { EntryModule } from './entry-module.js';
import { SchoolRecords } from './school-records.js';
import { CompilationModule } from './compilation.js';

document.addEventListener("DOMContentLoaded", () => {
  if (typeof SessionManager.init === 'function') {
    SessionManager.init();
  } else if (typeof SessionManager.getData === 'function' && !SessionManager.getData()) {
    // Fallback init
  }
  
  if (typeof EntryModule.populateDropdown === 'function') {
    EntryModule.populateDropdown();
  }
  if (typeof SchoolRecords.render === 'function') {
    SchoolRecords.render();
  }
  if (typeof CompilationModule.render === 'function') {
    CompilationModule.render();
  }
});
