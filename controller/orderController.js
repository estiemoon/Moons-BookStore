const {order} = require('../services/orderService');

const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');
const { Result } = require('express-validator');

//방법1 --> req.body에서 firstBookTitle 받아오기 (프론트엔드가 보내줌)
//방법2 --> select로 firstBookTitle(book_title) 가져옴 (이걸로 해보겠음)


const orderCon = async (req,res) =>{
    if(req.isAuthenticated){
        let {items, delivery, totalPrice, totalQuantity, bookTitle} = req.body;
        let authorization = req.user;
        let userId = authorization.user_id

        let values = {
            items,delivery,totalPrice,totalQuantity,bookTitle,userId,
        }

        let result = await order(values,res)
        console.log(result);
        if (result instanceof Error) {
            return res.status(StatusCodes.BAD_REQUEST).end();

        } else {
            res.status(StatusCodes.CREATED).json(result);

        }

    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }

};



const getOrder = async (req,res) =>{
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    let authorization = ensureAuth(req,res);
    let userId = authorization.user_id;
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "로그인 세션 만료. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : "잘못된 토큰입니다."
        })
    } else {
        try{
            let sql = `SELECT orders.id, created_at, delivery.address, delivery.recipient, delivery.phoneNum, book_title,total_quantity,total_price
                        FROM orders LEFT
                        JOIN delivery
                        ON orders.deliver_id = delivery.id
                        WHERE orders.user_id = ?`;

            var [getorders,fields] = await conn.query(sql,userId); //execute??

        }catch(e){
            console.log('getOrder Error', e);
        }

        res.status(StatusCodes.OK).json(getorders);
    }
};

const getDetail = async (req,res) =>{
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })
    let {id} = req.params;
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
        try{
            let sql = `SELECT book_id, title,author,price,quantity
                        FROM orderedbooks LEFT JOIN books
                        ON orderedbooks.book_id = books.id
                        WHERE order_id = ?`;

            var [getdetails,fields] = await conn.query(sql,id ); //execute??

        }catch(e){
            console.log('getDetail Error', e);
        }

        res.status(StatusCodes.OK).json(getdetails);
    };
};

module.exports = {orderCon, getOrder, getDetail};