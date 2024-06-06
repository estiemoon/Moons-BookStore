const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const ensureAuth = require('../auth');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//카테고리별 Or 신간별 전체도서조회
const allBooks = (req,res)=> {
    let allBooksRes = {};

    let {category_id, news,limit,currentPage} = req.query;
    category_id = parseInt(category_id)
    news = news == 'true' ? true : false ;
    let offset = limit * (currentPage-1);

    let sql = `SELECT SQL_CALC_FOUND_ROWS *,(SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes FROM books`; 
    let values = [];
 
    if (category_id && news) {
        sql += ` WHERE category_id = ? AND datediff(curdate(), pub_date) < 31`;
        values.push(category_id);
    }else if (category_id) {
        sql += ` WHERE category_id = ?`;
        values.push(category_id);
    }else if (news) {
        sql += ` WHERE datediff(curdate(), pub_date) < 31`;
    }
    sql += ' LIMIT ? OFFSET ?'
    values.push(parseInt(limit), offset);

    conn.query(sql,values,
        (err,result)=>{
            if(err) {
                console.log(err);
            }
            if(result.length) {
                allBooksRes.books = result;
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    })

    sql = 'SELECT found_rows()'

    conn.query(sql,
        (err,result)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            let totalCount = result[0]["found_rows()"];
            let pagination = {
                currentPage : parseInt(currentPage),
                totalCount : totalCount
            }  
            allBooksRes.pagination = pagination;

        return res.status(StatusCodes.OK).json(allBooksRes);
    })


};

const eachBook = (req,res) => {
    
    let book_id = req.params.id;
    let authorization = ensureAuth(req,res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "로그인 세션 만료. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : "잘못된 토큰입니다."
        })
    } else if(authorization instanceof ReferenceError) {
        let sql = ` SELECT *,
        (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes
        FROM books LEFT 
        JOIN categories ON categories.category_id = books.category_id 
        WHERE books.id = ?`;
        let values = [book_id];

        conn.query(sql,values,
        (err,result)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (result[0]){
                return res.status(StatusCodes.OK).json(result[0]);
            } else{
                return res.status(StatusCodes.NOT_FOUND).end();
            }

        })
    }
    else {

        let sql = ` SELECT *,
        (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes,
        (SELECT count(*) FROM likes WHERE user_id = ? AND liked_book_id = ?) AS liked
        FROM books LEFT 
        JOIN categories ON categories.category_id = books.category_id 
        WHERE books.id = ?`;
        let values = [authorization.user_id, book_id, book_id];

        conn.query(sql,values,
        (err,result)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (result[0]){
                return res.status(StatusCodes.OK).json(result[0]);
            } else{
                return res.status(StatusCodes.NOT_FOUND).end();
            }

        })

    }
};


module.exports = {
    allBooks,
    eachBook
};
