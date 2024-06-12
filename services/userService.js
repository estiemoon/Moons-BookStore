const {saveUser, getUser, getResetUser,updatePwd} = require('../models/userModel');

const crypto = require('crypto');
const {StatusCodes} = require('http-status-codes');
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
    console.log(result)
    let user = result[0]
    const currentPwd = crypto.pbkdf2Sync(password, user.salt,10000,10,'sha512').toString('base64');

    if(user && currentPwd == user.password) { 
        const token = jwt.sign(
                        {email: email,
                        user_id : user.id
                        }, 
                        process.env.PRIVATE_KEY,
                        {expiresIn : "10 mins",
                        issuer : "moon"})
        res
            .cookie('token', token, {httpOnly : true})
        res
            .status(StatusCodes.OK)
            .json(result)
    }      
}

const toReset = async (email,res)=>{
    const result = await getResetUser(email,res);
    //user존재하는지 확인하는 로직!!!!!
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