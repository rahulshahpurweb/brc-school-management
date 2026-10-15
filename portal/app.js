import { MASTER_SCHOOLS } from './schools-data.js';
import { SessionManager } from './session-manager.js';
import { SchoolRecords } from './school-records.js';
import { EntryModule } from './entry-module.js';
import { CompilationModule } from './compilation.js';
import { ExcelHandler } from './excel-handler.js';

// Make modules globally accessible for HTML onclick events
window.SessionManager = SessionManager;
window.SchoolRecords = SchoolRecords;
window.EntryModule = EntryModule;
window.CompilationModule = CompilationModule;
window.ExcelHandler = ExcelHandler;

window.onload = function() {
    SessionManager.init();
};
