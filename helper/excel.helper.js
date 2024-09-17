const XLSX = require('xlsx');
let json = [
    {
        "name": "Karthik",
        "email": "karthik.anand@xuriti.com",
        "mobile": "8740712153",
        "dateOfpuchase": "2023-12-14T18:30:00.000Z",
        "model": "instant",
        "purchasePrice": "500",
        "scratchCode": "TEST05",
        "comment": "Don't know ",
        "ip": "49.43.242.102"
    },
    {
        "name": "Tester",
        "email": "Test@gmail.com",
        "mobile": "9606862430",
        "dateOfpuchase": "2023-12-14T18:30:00.000Z",
        "model": "instant",
        "purchasePrice": "1000",
        "scratchCode": "TEST09",
        "comment": "testing",
        "ip": "49.43.242.102"
    },
    {
        "name": "Sinchan",
        "email": "doraemon@evolvebrands.com",
        "mobile": "9643034369",
        "dateOfpuchase": "2023-12-13T18:30:00.000Z",
        "model": "instant",
        "purchasePrice": "1200.14",
        "scratchCode": "TEST01",
        "comment": "Nahi Bataunga",
        "ip": "152.58.232.87"
    }
]


let data = async (jsonData) => {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const outputPath = 'output.xlsx';
    XLSX.writeFile(wb, outputPath);
}
// async function generateExcel(data) {
//     const workbook = new Excel.Workbook();
//     const worksheet = workbook.addWorksheet('Customers');

//     // Define columns in the worksheet, these columns are identified using a key.
//     worksheet.columns = [
//         { header: 'id', key: 'CUSNUM', width: 10 },
//         { header: 'Last Name', key: 'LSTNAM', width: 10 },
//         { header: 'Balance Due', key: 'BALDUE', width: 11 },
//         { header: 'Credit Limit', key: 'CDTLMT', width: 10 }
//     ];

//     // Add rows from database to worksheet 
//     for (const row of results) {
//         worksheet.addRow(row);
//     }

//     // Add auto-filter on each column
//     worksheet.autoFilter = 'A1:D1';

//     // Process each row for calculations and beautification 
//     worksheet.eachRow((row, rowNumber) => {

//         row.eachCell((cell, colNumber) => {
//             if (rowNumber == 1) {
//                 // First set the background of header row
//                 cell.fill = {
//                     type: 'pattern',
//                     pattern: 'solid',
//                     fgColor: { argb: 'f5b914' }
//                 };
//             };
//             // Set border of each cell 
//             cell.border = {
//                 top: { style: 'thin' },
//                 left: { style: 'thin' },
//                 bottom: { style: 'thin' },
//                 right: { style: 'thin' }
//             };
//         })
//         //Commit the changed row to the stream
//         row.commit();
//     });

//     //Process 'Balance Due' column for conditioning 
//     const balDue = worksheet.getColumn('BALDUE')
//     // Iterate over all current cells in this column
//     balDue.eachCell((cell, rowNumber) => {
//         // If the balance due is 400 or more, highlight it with gradient color 
//         if (cell.value >= 400) {
//             cell.fill = {
//                 type: 'gradient',
//                 gradient: 'angle',
//                 degree: 0,
//                 stops: [
//                     { position: 0, color: { argb: 'ffffff' } },
//                     { position: 0.5, color: { argb: 'cc8188' } },
//                     { position: 1, color: { argb: 'fa071e' } }
//                 ]
//             };
//         };
//     });

//     // Write the final Excel file in the folder from where we are running the code. 
//     await workbook.xlsx.writeFile('Customers.xlsx');
// }
data(json)