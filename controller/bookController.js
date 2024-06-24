const {getBooks,detailBook} = require('../services/bookService');

const allBooks = (req,res)=> {
    let {category_id, news,limit,currentPage} = req.query;

    category_id = parseInt(category_id)
    news = news == 'true' ? true : false ;
    offset = limit * (currentPage-1);
    let val = {category_id, news, offset, limit, currentPage,};

    getBooks(val,res);
};

const eachBook = (req,res) => {  
    let book_id = req.params.id;

    detailBook(book_id,req,res)

};


module.exports = {
    allBooks,
    eachBook
};
 