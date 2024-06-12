const {createUser,loginUser,toReset,resetPwd} = require('../services/userService');

const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const join = (req,res)=> {
    let {email, password} = req.body;
    createUser(email,password,res);
}

const login = (req,res)=> {
    const {email, password} = req.body;
    loginUser(email,password,res);
}

const toRequestReset = (req,res)=> {
    const {email} = req.body;
    toReset(email,res);    
}

const requestReset = (req,res)=> {
    const {email, password} = req.body; //사용자가 입력한 이메일은 아님, 위에서 보내준 이메일임
    resetPwd(email,password,res);
}

module.exports = {
    join,
    login,
    toRequestReset,
    requestReset
}