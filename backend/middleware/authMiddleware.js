const jwt = require('jsonwebtoken');
const { userRepo } = require('../app_server/repositories/userRepo');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res
                    .status(401)
                    .json({
                        success: false,
                        error: 'Authorization Error: No token provided',
                    });
        }

        const token = authHeader.split(" ")[1];
        if(!token) {
            return res
                    .status(401)
                    .json({
                        success: false,
                        error: 'Authorization Error: Invalid Token',
                    });
        }

        // JWT_SECRET crypto random generated hex using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))""`
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            user_id: decoded.user_id,
        };

        next();
    } catch (e){
        return res
            .status(401)
            .json({
                success: false,
                error: `Authorization Error: ${e}`
            });
    }
}

module.exports = {
    authMiddleware
}