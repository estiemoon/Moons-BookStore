const { check } = require('express-validator');
//const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const mysql = require('mysql2/promise');

const saveUser = async (values,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })
    const sql = `INSERT INTO users (email, password, salt) VALUES (?,?,?)`;

    try{
        const [result] = await conn.query(sql,values);
        res.status(StatusCodes.CREATED).json(result);
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).json(err);  
    }
}

const getUser = async (email,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })
    const sql = `SELECT * FROM users WHERE email = ?`;
    
    try{
        const [result] = await conn.query(sql,email);

        return result;
    } catch(err) {
        console.log(err.name);
        return res.status(StatusCodes.BAD_REQUEST).json(err.name);  
    }
}

const getResetUser = async (email,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    const sql = `SELECT * FROM users WHERE email = ?`;
    try{
        const [result] = await conn.query(sql,email);
        return result;
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).json(err.name);  
    }
}

const updatePwd = async (values,res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookstore',
        password: 'root',
        dateStrings: true
    })

    const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
    try{
        const [result] = await conn.query(sql,values)
        return result;
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).json(err);
    }
}


module.exports = {saveUser,getUser,getResetUser,updatePwd};