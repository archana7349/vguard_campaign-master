const { CallbackModel } = require("../../database/index.model");

async function callback(req, res, next) {
    const callback = new CallbackModel({ callback: req.body, event_type: "vouch_callback" });
    await callback.save();
    return res.send('Callback recieved')
}

module.exports = { callback }
