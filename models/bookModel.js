//const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const mysql = require('mysql2/promise');

const getAllBooks = async (sql,values,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    });

    try{
        const [result] = await conn.query(sql,values)

        if (result.length) {
            return result;
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.NOT_FOUND).end();
    }
}

const getPagination = async (sql,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    });

    try {
        const [result] = await conn.query(sql);
        return result;
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
}

const getDetail = async (res,sql,values) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    });

    try{
        const [result] = await conn.query(sql,values)
        return result;

    } catch(err) {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}


module.exports = {getAllBooks, getPagination,getDetail};