const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    let token;
    if (req.headers.Authorization) {
        token = req.headers.Authorization;
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err)
                return res.status(403).json(err)
            req.auth = decoded;
            next();
        })
    } else
        return res.status(401).json({ msg: "Unauthorized" })
}