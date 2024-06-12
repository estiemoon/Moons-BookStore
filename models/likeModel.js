const {StatusCodes} = require('http-status-codes');
const mysql = require('mysql2/promise');

const updateDB = async (sql,values,res)=>{
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    try{
        let [result] = await conn.query(sql,values);
        return result;

    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end(); 
    }
    
}


module.exports = {updateDB};