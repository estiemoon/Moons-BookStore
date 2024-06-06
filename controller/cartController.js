const conn = require('../mariadb');
const ensureAuth = require('../auth');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const addCart = (req,res) => {
    
    let {book_id, quantity} = req.body;
    let authorization = ensureAuth(req,res);
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "로그인 세션 만료. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : "잘못된 토큰입니다."
        })
    } else {
    
        let sql = ` INSERT INTO cartItems (book_id, quantity, user_id)
                    VALUES (?,?,?)`;
        let values = [book_id, quantity, authorization.user_id];
        conn.query(sql, values, 
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
            }
        )
    }
};

const allCarts = (req,res) => { 
    let authorization = ensureAuth(req,res);
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "로그인 세션 만료. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : "잘못된 토큰입니다."
        })
    } else {
        let {items} = req.body;

        var sql = ` SELECT cartItems.id, book_id,books.img, books.title, books.summary, quantity, books.price 
                    FROM cartItems LEFT 
                    JOIN books ON books.id = cartItems.book_id
                    WHERE cartItems.user_id = ?`;
        var values = [authorization.user_id];
    
        if (items){
            items = items.toString();
            sql += ` AND cartItems.id IN (?)`;
            values.push(items); //배열 그자체로 넣어도 됨 
        } 

        conn.query(sql, values,
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
            }
        )
    }


};

const deleteCartItem = (req,res) => {
    let authorization = ensureAuth(req,res);
    let cartItemId = req.params.id;

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "로그인 세션 만료. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : "잘못된 토큰입니다."
        })
    } else {
        let sql = `DELETE FROM cartItems WHERE id = ?`;
        conn.query(sql,cartItemId,
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
            }
        )
    };
};


module.exports = {addCart, allCarts, deleteCartItem};