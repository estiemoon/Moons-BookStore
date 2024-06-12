const {addLike, deleteLike} = require('../services/likeService');

const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const ensureAuth = require('../auth');
const {StatusCodes} = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

const addLikeCon = (req,res) => {
    if(req.isAuthenticated){
        let authorization = req.user;
        let book_id = req.params.id;
        let values = [authorization.user_id, book_id];

        addLike(values,res)

    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }

};

const deleteLikeCon = (req,res) => {
    if(req.isAuthenticated){
        let authorization = req.user;
        let book_id = req.params.id;
        let values = [authorization.user_id, book_id];

        deleteLike(values,res);

    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }

};


module.exports = {addLikeCon, deleteLikeCon};