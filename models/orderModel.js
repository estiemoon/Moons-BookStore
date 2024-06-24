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
        return result

    } catch (err) {
        console.log("orderModel_Add",err)
        throw err;
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
        return result;

    } catch (err) {
        console.log("orderModel_deleteData",err);
        throw err;
    }
}

const getOrderDB = async(sql,userId,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    try{
        let [getorders,fields] = await conn.query(sql,userId); //execute??

        return getorders;
    } catch (err) {
        console.log("getOrderDb_Err", err.name);
        throw err;
    }
    
}

const getDetailDB = async(sql,id,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    try{
        let [getdetails,fields] = await conn.query(sql,id); //execute??
        return getdetails;
        
    } catch (err) {
        console.log("getDetail_Err", err.name);
        throw err;
    }


}

module.exports = {addData,deleteData,getOrderDB,getDetailDB} 