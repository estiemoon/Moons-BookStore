const conn = require('../mariadb');
const { StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const join = (req,res)=> {
    let {email, password} = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password,salt,10000,10,'sha512').toString('base64');

    const sql = `INSERT INTO users (email, password, salt) VALUES (?,?,?)`;
    let values = [email, hashPwd,salt];
    conn.query(sql,values,
    (err,result) => {
        if (err) {
            console.log(err);
            return res
                    .status(StatusCodes.BAD_REQUEST)
                    .end();  
        } 
        res
            .status(StatusCodes.CREATED)
            .json(result);
        
    })
}

const login = (req,res)=> {
    const {email,password} = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    const values = email;

    conn.query(
        sql,values
        ,(err,result) => {
            if(err){
                console.log(err);
                res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    message : '아이디나 비밀번호를 확인해주세요.'
                });
            } 
            let user = result[0]
            const currentPwd = crypto.pbkdf2Sync(password, user.salt,10000,10,'sha512').toString('base64');

            if(user && currentPwd == user.password) { 
                const token = jwt.sign(
                                {email: email}, 
                                process.env.PRIVATE_KEY,
                                {expiresIn : "2 days",
                                issuer : "moon"})
                res
                    .cookie('token', token, {httpOnly : true})
                res
                    .status(StatusCodes.OK)
                    .json(result)
            } else {
                res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({
                        message : '아이디나 비밀번호를 확인해주세요.'
                    });
            }
    })
}

const toRequestReset = (req,res)=> {

    const {email} = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    const values = email;

    conn.query(sql,values,
        (err,result) => {
            //비밀번호 초기화 이메일 보내주기
            if(err){
                console.log(err);
                res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    message : '이메일을 확인해주세요.'
                });
            }
            
            const user = result[0];
            if(user) { //result vs user console.log로 확인해보기 -> result는 배열안에 결과들이 객체로 저장, 따라서 user은 객체
                res
                    .status(StatusCodes.OK)
                    .json({
                        email : email
                    })
            } else {
                res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({
                        message : '이메일을 확인해주세요.'
                    });
            }
        }
    )
}

const requestReset = (req,res)=> {
    const {email, password} = req.body; //사용자가 입력한 이메일은 아님, 위에서 보내준 이메일임

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password, salt, 10000, 10,'sha512').toString('base64');

    const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
    const values = [hashPwd, salt, email];

    conn.query(sql, values,
        (err,result) => {
            if(err){
                console.log(err);
                res
                .status(StatusCodes.BAD_REQUEST)
                .end();
            }

            if(result.affectedRows) { 
                res
                    .status(StatusCodes.OK)
                    .json(result);
            } else {
                res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({
                        message : '뭔가 잘못되었습니다.'
                    });
            }
        }
    )


}

module.exports = {
    join,
    login,
    toRequestReset,
    requestReset
}