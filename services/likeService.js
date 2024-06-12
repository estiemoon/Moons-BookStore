const {updateDB} = require('../models/likeModel');
const {StatusCodes} = require('http-status-codes');


const addLike = async (values,res)=>{
    let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?,?)`;
    let result = await updateDB(sql,values,res);

    if(result){
        res.status(StatusCodes.CREATED).json(result);
    }
}

const deleteLike = async (values,res)=> {
    let sql = 'DELETE FROM likes where user_id = ? AND liked_book_id = ?';
    let result = await updateDB(sql,values,res);

    if(result){
        res.status(StatusCodes.CREATED).json(result);
    }
}

module.exports={addLike, deleteLike};