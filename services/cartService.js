const {addOrRemoveCartDB, allCartDB} = require('../models/cartModel'); 
const {StatusCodes} = require('http-status-codes');

const addCart = async (values,res)=> {

    let sql = ` INSERT INTO cartItems (book_id, quantity, user_id)
    VALUES (?,?,?)`;

    const result = await addOrRemoveCartDB(sql,values,res);

    if(result){
        res.status(StatusCodes.CREATED).json(result);
    }

}

const allCart = async (items,values,res)=>{
    let sql = ` SELECT cartItems.id, book_id,books.img, books.title, books.summary, quantity, books.price 
    FROM cartItems LEFT 
    JOIN books ON books.id = cartItems.book_id
    WHERE cartItems.user_id = ?`;

    if (items){
        console.log('체크된 표시만 담습니다.')
        items = items.toString();
        sql += ` AND cartItems.id IN (?)`;
        values.push(items.split(',')); 
    }  
    result = await allCartDB(sql,values,res);

    if(result){
        res.status(StatusCodes.CREATED).json(result);
    }
}

const removeCart = async(values,res)=>{

    let sql = `DELETE FROM cartItems WHERE id = ?`;

    result = await addOrRemoveCartDB(sql,values,res)

    if(result){
        if (result.affectedRows){
            res.status(StatusCodes.CREATED).json(result);
        } else {
            res.status(StatusCodes.NOT_FOUND).json(result);
        }
    }
}

module.exports = {addCart, allCart, removeCart};