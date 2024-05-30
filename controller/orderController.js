const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

//방법1 --> req.body에서 firstBookTitle 받아오기 (프론트엔드가 보내줌)
//방법2 --> select로 firstBookTitle(book_title) 가져옴 (이걸로 해보겠음)


const order = async (req,res) =>{
    let {items, delivery, totalPrice, totalQuantity, userId} = req.body;

    try{
        let sql1 = `INSERT INTO delivery (address, recipient, phoneNum) 
                    VALUES(? ,?, ?)`;
        let delivery_id;
        let val1 = [delivery.address, delivery.recipient, delivery.phoneNum];
        let promise1 = await new Promise( (resolve, reject) => {
            conn.query(sql1, val1, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                delivery_id = result.insertId;
                resolve(delivery_id);
            })
        })
    } catch(error) {
        console.log(error);
    }
    
    try{
        let sql4  = `SELECT title FROM books WHERE id = ?`
        let bookTitle;

        let promise4 = await new Promise( (resolve, reject) => {
            conn.query(sql4, items[0].book_id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                bookTitle = result[0].title;
                console.log(result[0].title);
                resolve(bookTitle);
            })
        })
    } catch(error) {
        console.log(error);
    }

    try{
        let sql2 = `INSERT INTO orders(book_title, total_quantity, total_price, deliver_id, user_id)
        VALUES (?,?,?,?,?)`;
        let order_id;
        let val2 = [bookTitle ,totalQuantity, totalPrice, delivery_id, userId];

        const promise2 = await new Promise( (resolve, reject) => {
            conn.query(sql2, val2, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                order_id = result.insertId;
                resolve(order_id);
            })
        })
    } catch(error) {
        console.log(error);
    }
    
    try{
        let sql3 = `INSERT INTO orderedBook (order_id, book_id, quantity)
        VALUES ?`;
        let val3 = [];
        items.forEach((item) => {
            val3.push([order_id, item.book_id, item.quantity])
        })

        let promise3 = await new Promise( (resolve, reject) => {
            conn.query(sql3, [val3], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                res
                .status(StatusCodes.CREATED)
                .json(result);
            })
        })
    } catch(error){
        console.log(error);
    }
};



const getOrder = (req,res) =>{
    res.send('getorder');
};

const getDetail = (req,res) =>{
    res.send('getdetailorder');
};

module.exports = {order, getOrder, getDetail};