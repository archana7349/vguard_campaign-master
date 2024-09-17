const validCouponCode = (coupon) => {
  const pattern = /^\d{16}$/;
  return pattern.test(coupon);
};

const validPincode = (input) => {
  const regex = /^\d{6}$/;
  return regex.test(input);
};

const validEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

module.exports = {
  validCouponCode,
  validPincode,
  validEmail,
};
