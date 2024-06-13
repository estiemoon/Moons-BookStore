const {order, getOrder,getDetail} = require('../services/orderService');

const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');
const { Result } = require('express-validator');

//방법1 --> req.body에서 firstBookTitle 받아오기 (프론트엔드가 보내줌)
//방법2 --> select로 firstBookTitle(book_title) 가져옴 (이걸로 해보겠음)


const orderCon = async (req,res) =>{
    if(req.isAuthenticated){
        let {items, delivery, totalPrice, totalQuantity, bookTitle} = req.body;
        let authorization = req.user;
        let userId = authorization.user_id

        let values = {
            items,delivery,totalPrice,totalQuantity,bookTitle,userId,
        }

        try{
            let result = await order(values,res) 
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
        let userId = authorization.user_id;

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