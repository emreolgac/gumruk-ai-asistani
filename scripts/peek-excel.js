const XLSX = require('xlsx');

try {
    const filePath = 'C:\\Users\\monster\\Downloads\\123.xlsx';
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log("Sheet Name:", sheetName);
    console.log("\nFirst 10 rows:");
    data.slice(0, 10).forEach((row, i) => {
        console.log(`Row ${i}:`, JSON.stringify(row));
    });
} catch (e) {
    console.error("Error:", e.message);
}
