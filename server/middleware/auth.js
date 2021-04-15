const jwt = require("jsonwebtoken");

function auth(req, res, next){
    try{
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({errMessage : "Unauthorized."});
        }

        const validateUser = jwt.verify(token, process.env.JWT_SIGN_TOKEN);
        req.user = validateUser.id;

       next();
    }catch(err){
        return res.status(401).json({errMessage : "Unauthorized."});
    }
}

module.exports = auth;