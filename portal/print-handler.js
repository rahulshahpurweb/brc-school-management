// Print and PDF Export Handler
export const PrintHandler = {
  // Direct full page print
  printPage() {
    window.print();
  },
  
  // Specific table/section print or PDF download view
  printSection(sectionId, reportTitle = "BRC Shahpur Report") {
    let sectionElement = document.getElementById(sectionId);
    if(!sectionElement) {
      window.print();
      return;
    }

    let printWindow = window.open('', '', 'height=700,width=1000');
    printWindow.document.write('<html><head><title>' + reportTitle + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; color: #172033; }');
    printWindow.document.write('h2 { text-align: center; color: #1d4ed8; margin-bottom: 5px; }');
    printWindow.document.write('p { text-align: center; color: #64748b; font-size: 13px; margin-bottom: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-size: 11px; }');
    printWindow.document.write('th { background: #eef2ff; color: #1e3a8a; }');
    printWindow.document.write('.total-row { background: #f1f5f9; font-weight: bold; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Janpad Shiksha Kendra Shahpur</h2>');
    printWindow.document.write('<p>' + reportTitle + '</p>');
    printWindow.document.write(sectionElement.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);
  }
};

window.PrintHandler = PrintHandler;
