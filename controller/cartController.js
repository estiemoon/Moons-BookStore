const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addCart = (req,res) => {
    let {book_id, quantity, user_id} = req.body;
    
    let sql = ` INSERT INTO cartItems (book_id, quantity, user_id)
                VALUES (?,?,?)`;
    let values = [book_id, quantity, user_id];
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
};

const allCarts = (req,res) => { 
    let {items, user_id} = req.body;

    var sql = ` SELECT cartItems.id, book_id,books.img, books.title, books.summary, quantity, books.price FROM cartItems LEFT JOIN books ON books.id = cartItems.book_id`;

    if (items){
        items = items.toString();
        sql += ` WHERE cartItems.id IN (?) AND cartItems.user_id = ?`;
        var values = [items.split(','), user_id]; //배열 그자체로 넣어도 됨 
    } else{
        sql += ` WHERE cartItems.user_id = ?`;
        var values = [user_id];
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
};

const deleteCartItem = (req,res) => {
    let {id} = req.params;

    let sql = `DELETE FROM cartItems WHERE id = ?`;
    conn.query(sql,id,
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


module.exports = {addCart, allCarts, deleteCartItem};