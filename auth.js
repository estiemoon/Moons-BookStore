const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {StatusCodes} = require('http-status-codes');
const secret = process.env.PRIVATE_KEY;
const {sign, verify} = require('./jwt-utils');


dotenv.config();

const ensureAuth = (req,res,next) => {

    try {
        let receivedJwt = req.headers.authorization;

        if (receivedJwt){
            //let decodedJwt = verify(receivedJwt); //return ok, id, email
            let decodedJwt = jwt.verify(receivedJwt, secret);
            req.isAuthenticated = true;
            req.user = decodedJwt;
            next();

        } else {
            throw new ReferenceError("jwt must be provided")
        }

    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message : "로그인 세션 만료. 다시 로그인 하세요."
            })
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message : "잘못된 토큰입니다."
            })
        } else if(err instanceof ReferenceError) {
            req.isAuthenticated = false;
            next();
        }
    }
};

module.exports = ensureAuth;