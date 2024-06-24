const {StatusCodes} = require('http-status-codes');
const mysql = require('mysql2/promise');

const executeQuery = async (sql,values,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    try{
        const [result] = await conn.query(sql,values);
        return result;
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).json(err.name);
    }
}
 
const saveUser = async (sql,values,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    try{
        const [result] = await conn.query(sql,values);
        res.status(StatusCodes.CREATED).json(result);
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).json(err);  
    }
}


module.exports = {saveUser,executeQuery}; 