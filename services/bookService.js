const {getAllBooks,getPagination,getDetail} = require('../models/bookModel');
const {StatusCodes} = require('http-status-codes');

const getBooks = async (val,res)=> {
    let allBooksRes = {};
    let {category_id,news,offset,limit,currentPage} = val

    let sql = ` SELECT SQL_CALC_FOUND_ROWS *,
                (SELECT count(*) FROM likes WHERE books.id = liked_book_id)
                AS likes FROM books`; 
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

    let result = await getAllBooks(sql,values,res);
    allBooksRes.books = result;

    sql = 'SELECT found_rows()'
    result = await getPagination(sql,res)

    let totalCount = result[0]["found_rows()"];
    let pagination = {
        currentPage : parseInt(currentPage),
        totalCount : totalCount
    }  
    allBooksRes.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooksRes);
}

const detailBook = async (book_id,req,res) => {
    console.log(req.isAuthenticated)
    
    if (req.isAuthenticated) {      
        let authorization = req.user;

        let sql = ` SELECT *,
        (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes,
        (SELECT count(*) FROM likes WHERE user_id = ? AND liked_book_id = ?) AS liked
        FROM books LEFT 
        JOIN categories ON categories.category_id = books.category_id 
        WHERE books.id = ?`;

        let values = [authorization.user_id, book_id, book_id];
        let result = await getDetail(res,sql,values);
        if (result[0]){
            return res.status(StatusCodes.OK).json(result[0]);
        } else{
            return res.status(StatusCodes.NOT_FOUND).end();
        } //servicce or model? +모듈?

    } else {

        let sql = ` SELECT *,
        (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes
        FROM books LEFT 
        JOIN categories ON categories.category_id = books.category_id 
        WHERE books.id = ?`;
        let values = [book_id];
        let result = await getDetail(res,sql,values);
        if (result[0]){
            return res.status(StatusCodes.OK).json(result[0]);
        } else{
            return res.status(StatusCodes.NOT_FOUND).end();
        } //servicce or model?
    }
}


module.exports = {getBooks, detailBook}; 