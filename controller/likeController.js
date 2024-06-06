const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const ensureAuth = require('../auth');
const {StatusCodes} = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

const addLike = (req,res) => {
    let authorization = ensureAuth(req,res) 
    let book_id = req.params.id;

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "로그인 세션 만료. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : "잘못된 토큰입니다."
        })
    } else {
        let sql = `INSERT INTO likes (user_id, liked_book_id)
                    VALUES (?,?)`;
        let values = [authorization.user_id, book_id];

        conn.query(sql, values, 
            (err,result) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();  
                } 
                res.status(StatusCodes.CREATED).json(result);
            }
        )
    }

};

const deleteLike = (req,res) => {
    let authorization = ensureAuth(req);
    let book_id = req.params.id;

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "로그인 세션 만료. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : "잘못된 토큰입니다."
        })
    } else {
    
        let sql = 'DELETE FROM likes where user_id = ? AND liked_book_id = ?';
        let values = [authorization.user_id, book_id];

        conn.query(sql, values, 
            (err,result) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();  
                } 
                res.status(StatusCodes.CREATED).json(result);
            }
        )
    };
};


module.exports = {addLike, deleteLike};