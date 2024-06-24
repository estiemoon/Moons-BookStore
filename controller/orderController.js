const {order, getOrder,getDetail} = require('../services/orderService');
const {StatusCodes} = require('http-status-codes');

const orderCon = async (req,res) =>{
    if(req.isAuthenticated){
        let {items, delivery, totalPrice, totalQuantity, bookTitle} = req.body;
        let authorization = req.user;
        let userId = authorization.id;

        let values = {items,delivery,totalPrice,totalQuantity,bookTitle,userId,};
        
        try{
            let result = await order(values,res); 
            return res.status(StatusCodes.CREATED).json(result);

        } catch(e){
            res.status(StatusCodes.BAD_REQUEST).end();
        }

    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }
};

const getOrderCon = async (req,res) =>{
    if (req.isAuthenticated){
        let authorization = req.user;
        let userId = authorization.id;

        try{
            let result = await getOrder(userId, res);
            return res.status(StatusCodes.OK).json(result);

        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }
    
};

const getDetailCon = async (req,res) =>{

    if(req.isAuthenticated){
        let {id} = req.params;

        try{
            let result = await getDetail(id, res);
            return res.status(StatusCodes.OK).json(result);

        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }



};

module.exports = {orderCon, getOrderCon, getDetailCon};