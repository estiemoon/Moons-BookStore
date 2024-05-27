const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');


//카테고리별 Or 신간별 전체도서조회
const allBooks = (req,res)=> {
    let {category_id, news,limit,currentPage} = req.query;
    category_id = parseInt(category_id)
    news = news == 'true' ? true : false ;
    let offset = limit * (currentPage-1)
    
    let sql = `SELECT *,(SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes FROM books`; 
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
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (result.length){
                return res.status(StatusCodes.OK).json(result);
            } else{
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    })
};

const eachBook = (req,res) => {
    let {user_id} = req.body;
    let {id} = req.params;
    id = parseInt(id);

    
    let sql = ` SELECT *,
                (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes,
                (SELECT count(*) FROM likes WHERE user_id = ? AND liked_book_id = ?) AS liked
                FROM books LEFT 
                JOIN categories ON categories.category_id = books.category_id 
                WHERE books.id = ?`;
    let values = [user_id,id,id];
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
};


module.exports = {
    allBooks,
    eachBook
};
