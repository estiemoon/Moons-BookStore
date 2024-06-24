const {saveUser, executeQuery} = require('../models/userModel');
const {sign,refresh} = require('../middlewares/jwt-utils');
const crypto = require('crypto');
const {StatusCodes} = require('http-status-codes');
const {createClient} = require('redis');
const dotenv = require('dotenv');
dotenv.config();


const createUser = (email,password,res) => {

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password,salt,10000,10,'sha512').toString('base64');

    const values = [email, hashPwd,salt];
    const sql = `INSERT INTO users (email, password, salt) VALUES (?,?,?)`;
    saveUser(sql, values, res);

}
 
const loginUser = async (email, password,res) => {
    const sql = `SELECT * FROM users WHERE email = ?`;

    const result = await executeQuery(sql, email, res);
    const user = result[0];
    const currentPwd = crypto.pbkdf2Sync(password, user.salt,10000,10,'sha512').toString('base64');

    if(user && currentPwd == user.password) { 
        
        const token = sign(user);
        const refreshToken = refresh();

        console.log("accesstoken : ", token);
        console.log("refreshtoken : ", refreshToken);

        const redisClient = createClient(process.env.REDIS_PORT);
        await redisClient.connect();
        await redisClient.set(toString(user.id), refreshToken);
        res.cookie('token', {token: token, refreshToken: refreshToken}, {httpOnly : true})
        res.status(StatusCodes.OK).json(result)
    }      
}

const toReset = async (email,res)=>{
    const sql = `SELECT * FROM users WHERE email = ?`;
    const result = await executeQuery(sql,email,res);
    const user = result[0];

    if(user){
        res.status(StatusCodes.CREATED).json(result);
    } else {
        res.status(StatusCodes.NOT_FOUND).end();
    }

} 

const resetPwd = async (email,password,res) => {

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password, salt, 10000, 10,'sha512').toString('base64');

    const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
    const values = [hashPwd,salt,email];
    const result = await executeQuery(sql, values,res);

    if(result.affectedRows) { 
        res.status(StatusCodes.OK).json(result);
    } else {
        res.status(StatusCodes.UNAUTHORIZED)
            .json({
                message : '업데이트 되지 않았습니다.'
            });
    }
}


module.exports = {createUser,loginUser,toReset,resetPwd};