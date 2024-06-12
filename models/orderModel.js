const {StatusCodes} = require('http-status-codes');
const mysql = require('mysql2/promise');


const addData = async(sql,val,res) => {

    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })
    try{
        let [result] = await conn.execute(sql,val);
        console.log(result)
        return

    } catch (err) {
        console.log("order model Error")
        throw new Error;
    }
}


const deleteData = async(sql,val,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })
    try{
        let [result] = await conn.query(sql,[val]);
        console.log(result)
        return result;

    } catch (err) {
        console.log(err);
        throw new Error;
    }
}

const getOrder = () => {
    
}

const getDetail = () => {

}

module.exports = {addData,deleteData}