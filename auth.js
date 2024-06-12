const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {StatusCodes} = require('http-status-codes');

dotenv.config();

const ensureAuth = (req,res,next) => {
    console.log("인가 모듈이 실행되는 중입니다..")
    try {
        let receivedJwt = req.headers.authorization;

        if (receivedJwt){
            let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
            req.isAuthenticated = true;
            req.user = decodedJwt;
            console.log(decodedJwt);
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