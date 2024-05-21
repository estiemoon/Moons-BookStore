const express = require('express');
const router = express.Router();

router.use(express.json());

//join
router.post('/join',(req,res)=> {
    res.json('회원가입');
});

//login
router.post('/login',(req,res)=> {
    res.send('로그인')
});

//to reset
router.post('/reset',(req,res)=> {
    res.send('비밀번호 초기화 요청')
});

//reset
router.put('/reset',(req,res)=> {
    res.send('비밀번호 초기화')
});


module.exports = router;