const {createUser,loginUser,toReset,resetPwd} = require('../services/userService');

const join = (req,res)=> {
    const {email, password} = req.body;
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
    const {email, password} = req.body; 
    resetPwd(email,password,res);
}

module.exports = {
    join,
    login,
    toRequestReset,
    requestReset
}
