const { verifyToken } = require("../helper");

const adminAuth = (req, res, next) => {
    const apiKey = req.headers.authorization;
    if(verifyToken(apiKey)){
        next()
    }else{
        res.send({
            msg : "Unauthorized",
            status : 0
        })
    }
}

module.exports = adminAuth