let totalCount = 106;
const specialPointsDetails = {
    "7": '2000',
    "14": '200',
    "21": '200',
    "35": '150',
    "42": '150'
}
let range = 50
let comingReq = totalCount + 1
let NORMAL_POINTS = 100

let points = 100

let quotient = Math.floor(totalCount / range);

let deductingValue = quotient * range;

let currentTransactionRequest = comingReq - deductingValue;

let isSpecial = false
for (let i in specialPointsDetails) {
    
console.log(currentTransactionRequest,i,"adcdcda")
    if (currentTransactionRequest == i) {
        points = specialPointsDetails[i];
        isSpecial = true;
        break;
    }
}
if (isSpecial) {
    console.log("Special points eraned", points)
} else {
    console.log("Normal points eraned", points)
}




// for (const key in obj) {
//     console.log(`${key}: ${obj[key]}`);
// }
