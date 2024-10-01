module.exports = {
  port: process.env.PORT || 5000,
  ip: process.env.HOST || "0.0.0.0",
  mongo: {
    uri: process.env.MONGO_URL || "mongodb://127.0.0.1:27018/vg_dhanbarse_whc",
  },
  TOTAL_TRANSACTION_COUNT: 106,
  NORMAL_POINTS:100,
  TRANSACTION_INTERVAL:50,
 
 SPECIAL_POINTS_DETAILS:{
    "7": '2000',
    "14": '200',
    "21": '200',
    "35": '150',
    "42": '150'
  },
  jwtSecret: process.env.JWT_SECRET || "jkl!±@£!@ghj1237",
  MAX_VALUE: 3,
  VOUCH_WALLET: process.env.NODE_ENV === 'production' ? process.env.VOUCH_WALLET : "test-01",
  UPI_VERIFY_URL:
    process.env.UPI_VERIFY_URI ||
    "https://kyc-api.surepass.io/api/v1/bank-verification/upi-verification",
  UPI_TOKEN:
    process.env.UPI_KEY ||
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2NTgxMjkwOCwianRpIjoiMjgwOWRkYzYtNWI4MS00MTYzLWFjMTYtY2U0YzVjY2FiNGEzIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmV2b2x2ZWJyYW5kc0BzdXJlcGFzcy5pbyIsIm5iZiI6MTY2NTgxMjkwOCwiZXhwIjoxOTgxMTcyOTA4LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsid2FsbGV0Il19fQ.ecaAhtlc0VOq0incDjvUHymvQZqEU46_R051i46N51A",
  VOUCH_KEY:
    process.env.VOUCH_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJhNzZkNDM2My1hODg0LTQ3ZDktOGY0My0zN2Y1ZTI2Y2QyOTkiLCJuYW1lIjoiRVZPTFZFIEJSQU5EUyBQVlQgTFREIiwicmVnIjoiWmFsUFFNOW44NmxlcXRtZWs1TzYiLCJjb25maWciOiJFdm9sdmVCcmFuZHMiLCJlbnYiOiJzYW5kYm94IiwiaWF0IjoxNjkwODY5MDcwfQ.kxP7ZY5nN2F9AhWuvi6eibzXGqqWJ5eLE1kpCTmDJ3M",
  SMS_API_KEY:
    process.env.SMS_API_KEY || "bMesPZDmVSM-YBk7AJ9Y2DTvxhTRSyr6VHolj1DTkD",
  SMS_API_KEY2:
    process.env.SMS_API_KEY2 || "bMesPZDmVSM-YBk7AJ9Y2DTvxhTRSyr6VHolj1DTkD",
  VOUCH_URI: process.env.NODE_ENV === 'production' ? process.env.VOUCH_URI : 'https://sim.iamvouched.com'
};
