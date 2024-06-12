const { addData,deleteData } = require('../models/orderModel');

const {StatusCodes} = require('http-status-codes');

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
        throw new Error;
    }

    try{
        let sql2 = `INSERT INTO orders(book_title, total_quantity, total_price, deliver_id, user_id)
        VALUES (?,?,?,?,?)`;
        let val2 = [bookTitle ,totalQuantity, totalPrice, delivery_id, userId];

        let result2 = await addData(sql2,val2,res);
        order_id = result2.insertId;
    } catch(e) {
        console.log("Sql2 Error")
        throw new Error;
    }

    try{ //items = [1,2,3] 주문하는 도서 장바구니 cart 아이디
        let val3;
        items.forEach(async (item) => {
            let sql3 = `INSERT INTO orderedbooks (order_id, book_id, quantity) 
            VALUES (?, 
            (SELECT book_id FROM cartItems WHERE id = ?),
            (SELECT quantity FROM cartItems WHERE id = ?));`;
            val3 = [order_id,item,item];

            let result3 = await addData(sql3,val3,res)
            console.log(result3)
        });

    } catch(e) {
        console.log("Sql3 Error")
        throw new Error;
    }

    result = await deleteCartITem(items,res); //나머지도 모듈로 빼기
    if (result instanceof Error){
        throw new Error;
    }

    return result
}

const deleteCartITem = async(items,res) =>{
    let result5;
    try{
        let sql5 = `DELETE FROM cartItems WHERE id IN (?)`;
        result5 = await deleteData(sql5,items,res);
        console.log('result5: ', result5);

        return result5

    } catch(e) {
        console.log("Sql5 Error")
        console.log(e)
        throw new Error;
    }
}

const getOrder = () => {

}

const getDetail = () => {

}


module.exports = {order}