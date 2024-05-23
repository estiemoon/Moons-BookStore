const conn = require('../mariadb');
const { StatusCodes} = require('http-status-codes');


const allBooks = (req,res)=> {

    let {category_id} = req.query

    if (category_id){
        category_id = parseInt(category_id)

        let sql  = 'SELECT * FROM books WHERE category_id = ?'
        conn.query(sql,category_id,
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
    } else {
        let sql = 'SELECT * FROM books';
        conn.query(sql,
            (err,result)=>{
                if(err){
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
    
                return res.status(StatusCodes.OK).json(result);
    
        })
    }
};

const eachBook = (req,res) => {
    let {id} = req.params;
    id = parseInt(id);
    
    let sql = 'SELECT * FROM books WHERE id = ?';
    conn.query(sql,id,
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
