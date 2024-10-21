const blockFeatureMiddleware = (req, res, next) => {
    return res.json({
        code:503,
        message:"Service unavailable"

    });
}

module.exports = {
    blockFeatureMiddleware
}