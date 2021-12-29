const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    if(req.url != "/login"){
        const token = req.header('x-auth-header');
        if (!token) 
            return res.status(401).send('Access Denied: No Token Provided!');
        try {
                const decoded = jwt.verify(token, process.env.SECRET);
                    req.user=decoded
                    next();
            }
        catch (ex) {
            res.status(401).send('Invalid Token')
    }

    }
    else
    {
        next()
    }

}