const { addData,deleteData,getOrderDB,getDetailDB } = require('../models/orderModel');

const order = async (values,res) => {
    let delivery_id;
    let order_id;

    let {items, delivery, totalPrice, totalQuantity, bookTitle,userId} = values;
    try{
        let sql1 = `INSERT INTO delivery (address, recipient, phoneNum) 
        VALUES(? ,?, ?)`;
        let val1 = [delivery.address, delivery.recipient, delivery.phoneNum];
        let result1 = await addData(sql1,val1,res);

        delivery_id = result1.insertId;

    } catch(e) {
        console.log("sql1 error: ", e);
        throw e;
    }

    try{
        let sql2 = `INSERT INTO orders(book_title, total_quantity, total_price, deliver_id, user_id)
        VALUES (?,?,?,?,?)`;
        let val2 = [bookTitle ,totalQuantity, totalPrice, delivery_id, userId];
        let result2 = await addData(sql2,val2,res);
        
        if (!result2){
            throw new Error;
        };
        order_id = result2.insertId;
    } catch(e) {
        console.log("sql2 error: ", e);
        throw e;
    }

    try{ 
        let val3;
        let result3;
        for (const item of items) {
            let sql3 = `INSERT INTO orderedbooks (order_id, book_id, quantity) 
            VALUES (?, 
            (SELECT book_id FROM cartItems WHERE id = ?),
            (SELECT quantity FROM cartItems WHERE id = ?));`;
            val3 = [order_id,item,item];
            result3 = await addData(sql3,val3,res);
        };
    } catch(e) {
        console.log("sql3 error: ", e);
        throw e;
    }

    let result;
    try{
        result = await deleteCartITem(items,res); 

    } catch (e) {
        console.log('삭제에러', e);
        throw e;
    }
    
    return result;

}

const deleteCartITem = async(items,res) =>{
    let result5;
    try{
        let sql5 = `DELETE FROM cartItems WHERE id IN (?)`;
        result5 = await deleteData(sql5,items,res);
    } catch(e) {
        console.log("sql5 error: ", e);
        throw e;
    }
    return result5;
}

const getOrder = async(userId, res) => {
    let sql = `SELECT orders.id, created_at, delivery.address, delivery.recipient, delivery.phoneNum, book_title,total_quantity,total_price
    FROM orders LEFT
    JOIN delivery
    ON orders.deliver_id = delivery.id
    WHERE orders.user_id = ?`;

    try {
        let result = await getOrderDB(sql,userId,res);
        return result;
    } catch (err) {
        console.log("getOrder Err",err.name);
        throw err;
    }
}

const getDetail = async(id,res) => {

    let sql = `SELECT book_id, title,author,price,quantity
    FROM orderedbooks LEFT JOIN books
    ON orderedbooks.book_id = books.id
    WHERE order_id = ?`;

    try{
        let result = await getDetailDB(sql,id,res);
        return result;
    } catch (err) {
        throw err;
    }

}


module.exports = {order, getOrder,getDetail} 