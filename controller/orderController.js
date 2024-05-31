//const conn = require('../mariadb');
const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

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

    let {items, delivery, totalPrice, totalQuantity, userId} = req.body;

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

    try{
        let sql4  = `SELECT title FROM books WHERE id = ?`
        let [rows, fields] = await conn.execute(sql4, [items[0].book_id])
        var bookTitle = rows[0].title;
    } catch(e) {
        console.log('error4: ', e);
    }

    try{
        let sql2 = `INSERT INTO orders(book_title, total_quantity, total_price, deliver_id, user_id)
        VALUES (?,?,?,?,?)`;
        let val2 = [bookTitle ,totalQuantity, totalPrice, delivery_id, userId];

        let [result2] = await conn.execute(sql2, val2);
        order_id = result2.insertId;
    } catch(e) {
        console.log('error2: ', e);
    }
    
    try{
        let sql3 = `INSERT INTO orderedbooks (order_id, book_id, quantity) VALUES ?`;
        let val3 = [];
        items.forEach((item) => {
            val3.push([order_id, item.book_id, item.quantity])
        })

        let [result3] = await conn.query(sql3, [val3]);
        console.log('INSERT 결과', result3);

    } catch(e){
        console.log('error3: ', e);
    }

    await deleteCartITem(conn,items);

    res.status(StatusCodes.CREATED).end();

};

const deleteCartITem = async (conn,items) => {
    try{
        let sql5 = `DELETE FROM cartItems WHERE id IN (?)`;
        let val5 = [];
        items.forEach((item) => {
            val5.push(item.cart_item);
        })

        var [result5] = await conn.query(sql5, [val5]);
        console.log('result5: ', result5);

    } catch(e){
        console.log('error5: ', e);
    }

    return result5
}

const getOrder = (req,res) =>{
    res.send('getorder');
};

const getDetail = (req,res) =>{
    res.send('getdetailorder');
};

module.exports = {order, getOrder, getDetail};