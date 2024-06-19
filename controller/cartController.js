const {addCart,allCart,removeCart} = require('../services/cartService');

const {StatusCodes} = require('http-status-codes');


const addCartCon = (req,res) => {
    if(req.isAuthenticated){
        let {book_id, quantity} = req.body;
        let authorization = req.user;
        let values = [book_id, quantity, authorization.user_id];
    
        addCart(values,res);

    } else {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

};
 
const allCartsCon = (req,res) => { 
    if(req.isAuthenticated){
        let authorization = req.user;
        values = [authorization.user_id];
        let {items} = req.body;
    
        allCart(items,values,res)

    } else {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }
};

const deleteCartItemCon = (req,res) => {
    if(req.isAuthenticated){
    let cartItemId = req.params.id;

    removeCart(cartItemId,res)

    } else {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }
};


module.exports = {addCartCon, allCartsCon, deleteCartItemCon};