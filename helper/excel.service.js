const Excel = require('excel4node');

const dictonary = [
    { oldKey: 'name', newKey: 'Name' },
    { oldKey: 'email', newKey: 'Email' },
    { oldKey: 'mobile', newKey: 'Mobile' },
    { oldKey: 'dateOfpuchase', newKey: 'Date of Purchase' },
    { oldKey: 'purchasePrice', newKey: 'Purchase price' },
    { oldKey: 'scratchCode', newKey: 'Scratch Code' },
    { oldKey: 'comment', newKey: 'Comment' },
    { oldKey: 'ip', newKey: 'IP Address' },
    { oldKey: 'series', newKey: 'SL No.' },
    { oldKey: 'value', newKey: 'Value' },
    { oldKey: 'coupon', newKey: 'Scratch Code' },
    { oldKey: 'model', newKey: 'Product Purchased' },
    { oldKey: 'claimed', newKey: 'Claim Status' },
    { oldKey: 'claimedBy', newKey: 'Claimed By' },
    { oldKey: 'claimedOn', newKey: 'Claimed On' },
    { oldKey: 'amount', newKey: 'Amount' },
    { oldKey: 'status', newKey: 'Status' },
    { oldKey: 'transactedOn', newKey: 'Payment Date' },
    { oldKey: 'createdAt', newKey: 'Created At' },
    { oldKey: 'point_redeemed', newKey: 'Points redeemed' },
    { oldKey: 'points_earned', newKey: 'Points earned' },
    { oldKey: 'updatedAt', newKey: 'Updated on' },
    { oldKey: 'points_balance', newKey: 'Points balance' },
    { oldKey: '_id', newKey: 'Reference ID' },
    { oldKey: 'otp', newKey: 'OTP' },
    { oldKey: '_id', newKey: 'Reference ID' },
    { oldKey: 'seriesOfCoupon', newKey: 'Booklet Series No' },
    { oldKey: 'branchOfCoupon', newKey: 'District' },
    { oldKey: 'outletOfCoupon', newKey: 'Distributor Name' },
    { oldKey: 'valueOfCoupon', newKey: 'Coupon Value' },
    { oldKey: 'bonus', newKey: 'Bonus' },
    { oldKey: 'role', newKey: 'User role' },
    { oldKey: 'partNumber', newKey: 'Product Code' },
    { oldKey: 'couponCode', newKey: 'Coupon Code' },
    { oldKey: 'upiId', newKey: 'UPI ID' },

];

const keyMap = dictonary.reduce((map, entry) => {
    map[entry.oldKey] = entry.newKey;
    return map;
}, {});

async function replaceKeysInJSON(jsonArray, keyMap) {
    return jsonArray.map(item => {
        const newItem = {};
        for (const [oldKey, newKey] of Object.entries(keyMap)) {
            if (item.hasOwnProperty(oldKey) && item[oldKey] !== null) {
                newItem[newKey] = item[oldKey];
            }
        }
        return newItem;
    });
}


const createxlsx = async (title, data) => {
    try {
        data = JSON.parse(JSON.stringify(data));
        console.log(data)

        let modifiedJSON = await replaceKeysInJSON(data, keyMap);
        const headers = [...Object.keys(modifiedJSON[0])];

        const arrayOfArrays = modifiedJSON.map(obj => Object.values(obj));

        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet(title);

        // Add orange fill color to the header (data[0])
        const headerStyle = wb.createStyle({
            font: { color: '#FFFFFF' },
            fill: { type: 'pattern', patternType: 'solid', bgColor: '#FFA500', fgColor: '#FFA500' },
            alignment: { horizontal: 'center' },
            border: { left: { style: 'thin', color: '#000000' }, right: { style: 'thin', color: '#000000' }, top: { style: 'thin', color: '#000000' }, bottom: { style: 'thin', color: '#000000' } },
        });

        headers.forEach((header, index) => {
            ws.cell(1, index + 1).string(header).style(headerStyle);
        });

        // Add data to the worksheet
        arrayOfArrays.forEach((row, rowIndex) => {
            row.forEach((value, columnIndex) => {
                ws.cell(rowIndex + 2, columnIndex + 1).string(String(value));
            });
        });

        // Set column width
        headers.forEach((header, index) => {
            const columnWidth = Math.max(header.length, ...arrayOfArrays.map(row => String(row[index]).length));
            ws.column(index + 1).setWidth(columnWidth + 2); // Add some padding
        });

        // Save the workbook to a buffer
        const buffer = await wb.writeToBuffer();

        return buffer;
    } catch (e) {
        console.log(e);
        throw new Error("Unable to process your request. Please try later");
    }
};

module.exports = createxlsx;