//const conn = require('../mariadb');
const mysql = require('mysql2/promise');
const ensureAuth = require('../auth');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//방법1 --> req.body에서 firstBookTitle 받아오기 (프론트엔드가 보내줌)
//방법2 --> select로 firstBookTitle(book_title) 가져옴 (이걸로 해보겠음)

const order = async (req,res) =>{

    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    let {items, delivery, totalPrice, totalQuantity, bookTitle} = req.body;
    let authorization = ensureAuth(req,res);
    let userId = authorization.user_id
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "로그인 세션 만료. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : "잘못된 토큰입니다."
        })
    } else {
        let delivery_id;
        let order_id;

        try{
            let sql1 = `INSERT INTO delivery (address, recipient, phoneNum) 
            VALUES(? ,?, ?)`;
            let val1 = [delivery.address, delivery.recipient, delivery.phoneNum];
            let [result1] = await conn.execute(sql1,val1);
            delivery_id = result1.insertId;

        } catch(e) {
            console.log('error1: ', e);
        }

        // try{
        //     let sql4  = `SELECT title FROM books WHERE id = ?`
        //     let [rows, fields] = await conn.execute(sql4, [items[0].book_id])
        //     var bookTitle = rows[0].title;
        // } catch(e) {
        //     console.log('error4: ', e);
        // }

        try{
            let sql2 = `INSERT INTO orders(book_title, total_quantity, total_price, deliver_id, user_id)
            VALUES (?,?,?,?,?)`;
            let val2 = [bookTitle ,totalQuantity, totalPrice, delivery_id, userId];

            let [result2] = await conn.execute(sql2, val2);
            order_id = result2.insertId;
        } catch(e) {
            console.log('error2: ', e);
        }

        try{ //items = [1,2,3] 주문하는 도서 장바구니 cart 아이디
            let val3;
            let result3;
            items.forEach(async (item) => {
                let sql3 = `INSERT INTO orderedbooks (order_id, book_id, quantity) 
                VALUES (?, 
                (SELECT book_id FROM cartItems WHERE id = ?),
                (SELECT quantity FROM cartItems WHERE id = ?));`;
                val3 = [order_id,item,item];

                await conn.execute(sql3, val3);
            });

        } catch(e){
            console.log('error3: ', e);
        }

        result = await deleteCartITem(conn,items); //나머지도 모듈로 빼기

        res.status(StatusCodes.CREATED).json(result);
    };

};

const deleteCartITem = async (conn,items) => {
    
    try{
        let sql5 = `DELETE FROM cartItems WHERE id IN (?)`;
        var [result5] = await conn.query(sql5, [items]);
        console.log('result5: ', result5);

    } catch(e){
        console.log('error5: ', e);
    }

    return result5

}

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

module.exports = {order, getOrder, getDetail};