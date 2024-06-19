const { StatusCodes } = require('http-status-codes');
const {sign, verify, refresh, refreshVerify} = require('./jwt-utils');
const jwt = require('jsonwebtoken');


const excRefresh = async (req,res) => {
    const accessToken = req.headers.authorization;
    const refreshToken = req.headers.refresh;

    if(accessToken && refreshToken){
        
        accessResult = verify(accessToken);
        const user = accessResult
        refreshResult = await refreshVerify(refreshToken, user.id);
        console.log(refreshResult)
        console.log("accessToken", accessResult)
        //access 만료시
        if(!accessResult.ok) {
            if(!refreshResult.ok){
                //로그인 요청
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message : "로그인 다시"
                })
            } else {
                //새로 발급
                const newToken = sign(user)
                res
                .cookie('token', {token: newToken, refreshToken: refreshToken}, {httpOnly : true})

                res
                .status(StatusCodes.OK)
                .json({message : "새로운 토큰 발급 완료"})
            }
        } else {
            //access not expired
            res.status(StatusCodes.BAD_REQUEST).json({message : "access Token이 만료되지 않았습니다."})
        }
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({
            message : "No Access Token and Refresh Token"
        })
    }

}



module.exports = excRefresh;