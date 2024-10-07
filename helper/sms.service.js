const axios = require("axios")
const { VendorApiModel } = require('../database/index.model')
const sendSMS = async (mobile, otp) => {
  let uri = 'https://api.textlocal.in/'
  let message = `Please use this OTP: ${otp} to login into Dhan Barse 2024 by V-Guard. Team V-Guard!`
  var URL = `${uri}/send/?apiKey=${process.env.SMS_API_KEY}&sender=VGUARD&numbers=${mobile}&message=${message}`

  let data = new VendorApiModel({ request: URL, vendor: uri })

  return await axios.get(URL).then(async (response) => {
    data.response = response.data
    data.success = Boolean(response.data.status) || false;
    await data.save();
    return response.data
  }).catch(async (error) => {
    if (error?.response) {
      data.response = error.response
      await data.save();
      throw error.response?.data || new Error("Axios error")
    } else if (error?.request) {
      data.response = error.request
      await data.save();
      throw error.request
    } else {
      data.response = error.message
      await data.save();
      throw error
    }
  })
}

const formSMS = async (mobile, value) => {
  let uri = 'https://api.textlocal.in/'
  let message = `Thank you for participating in Onam2024 Scratchnwin by V-Guard. Please visit https://onam2024scratchnwin.vguard.in to claim your cashback. Thank you for your love and affection for V-Guard. Stay Tuned, Team V-Guard.`
  var URL = `${uri}/send/?apiKey=${process.env.SMS_API_KEY2}&sender=VGUARD&numbers=${mobile}&message=${message}`

  let data = new VendorApiModel({ request: URL, vendor: uri })

  return await axios.get(URL).then(async (response) => {
    data.response = response.data
    data.success = Boolean(response.data.status) || false;
    await data.save();
    return response.data
  }).catch(async (error) => {
    if (error?.response) {
      data.response = error.response
      await data.save();
      return true
    } else if (error?.request) {
      data.response = error.request
      await data.save();
      return true
    } else {
      data.response = error.message
      await data.save();
      return true
    }
  })
}

const upiSMS = async (mobile, amount) => {
  let uri = 'https://api.textlocal.in/'
  let message = `Your UPI transfer request for the amount ${amount} has been successfully placed in our system. Cashback will be processed to bank account within 24 hours. Team V-Guard!`
  var URL = `${uri}/send/?apiKey=${process.env.SMS_API_KEY2}&sender=VGUARD&numbers=${mobile}&message=${message}`

  let data = new VendorApiModel({ request: URL, vendor: uri })

  return await axios.get(URL).then(async (response) => {
    data.response = response.data
    data.success = Boolean(response.data.status) || false;
    await data.save();
    return response.data
  }).catch(async (error) => {
    if (error?.response) {
      data.response = error.response
      await data.save();
      return true
    } else if (error?.request) {
      data.response = error.request
      await data.save();
      return true
    } else {
      data.response = error.message
      await data.save();
      return true
    }
  })
}
module.exports = { sendSMS, upiSMS, formSMS }