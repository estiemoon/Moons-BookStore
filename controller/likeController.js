const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');

const addLike = (req,res) => {
    let {user_id} = req.body;
    // const token = req.headers.cookie;
    // const payload = token.split('.')[1]; // token 중 payload 부분 가져오기
    // let basePayload = Buffer.from(payload, 'base64'); //payload 디코딩?
    // basePayload = JSON.parse(basePayload.toString()); //email, iat, exp,iss 결과나옴

    let {id} = req.params;
    //parseInt?
    //!! user_id jwt에서 가져와야함
    
    let sql = `INSERT INTO likes (user_id, liked_book_id)
                VALUES (?,?)`;
    let values = [user_id, id];

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

const deleteLike = (req,res) => {
    let {user_id} = req.body;
    let {id} = req.params;
    
    let sql = 'DELETE FROM likes where user_id = ? AND liked_book_id = ?';
    let values = [user_id, id];

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


module.exports = {addLike, deleteLike};