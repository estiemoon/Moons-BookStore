const {addLike, deleteLike} = require('../services/likeService');
const {StatusCodes} = require('http-status-codes');

const addLikeCon = (req,res) => {
    if(req.isAuthenticated){
        let authorization = req.user;
        let book_id = req.params.id;
        let values = [authorization.id, book_id];

        addLike(values,res)

    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }
};

const deleteLikeCon = (req,res) => {
    if(req.isAuthenticated){
        let authorization = req.user;
        let book_id = req.params.id;
        let values = [authorization.id, book_id];

        deleteLike(values,res);

    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }
};

module.exports = {addLikeCon, deleteLikeCon};