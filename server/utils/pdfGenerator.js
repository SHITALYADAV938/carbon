const PDFDocument = require("pdfkit");

function generateCertificate(userName, totalCarbon, res){
    const doc = new PDFDocument();
    res.setHeader("Content-Type","application/pdf");
    res.setHeader("Content-Disposition",`attachment; filename=${userName}_certificate.pdf`);
    doc.text(`Carbon Footprint Certificate`);
    doc.text(`Name: ${userName}`);
    doc.text(`Total Carbon Emission: ${totalCarbon.toFixed(2)} kg CO₂`);
    doc.end();
    doc.pipe(res);
}

module.exports = generateCertificate;
