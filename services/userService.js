const {saveUser, getUser, getResetUser,updatePwd} = require('../models/userModel');
const {sign,refresh} = require('../jwt-utils');
const crypto = require('crypto');
const {StatusCodes} = require('http-status-codes');
const redis = require('redis');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const createUser = (email,password,res) => {

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password,salt,10000,10,'sha512').toString('base64');
    const values = [email, hashPwd,salt];

    saveUser(values,res);

}

const loginUser = async (email,password,res) => {
    let result = await getUser(email,res);
    let user = result[0];
    const currentPwd = crypto.pbkdf2Sync(password, user.salt,10000,10,'sha512').toString('base64');

    if(user && currentPwd == user.password) { 
        
        const token = sign(user);
        console.log("accesstoken", token);
        const refreshToken = refresh();
        console.log("refreshtoken", refreshToken);

        const redisClient = redis.createClient(process.env.REDIS_PORT);
        await redisClient.connect();
        redisClient.set(toString(user.id), refreshToken);

        res
            .cookie('token', {token: token, refreshToken: refreshToken}, {httpOnly : true})
        res
            .status(StatusCodes.OK)
            .json(result)
    }      
}

const toReset = async (email,res)=>{
    const result = await getResetUser(email,res);
    let user = result[0];

    if(user){
        res.status(StatusCodes.CREATED).json(result);
    } else {
        res.status(StatusCodes.NOT_FOUND).end();
    }

} 

const resetPwd = async (email,password,res) => {

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password, salt, 10000, 10,'sha512').toString('base64');

    const values = [hashPwd,salt,email];
    let result = await updatePwd(values,res);

    if(result.affectedRows) { 
        res.status(StatusCodes.OK).json(result);
    } else {
        res.status(StatusCodes.UNAUTHORIZED)
            .json({
                message : '뭔가 잘못되었습니다.'
            });
    }
}


module.exports = {createUser,loginUser,toReset,resetPwd};