const {join,login,toRequestReset,requestReset} = require('../controller/userController');
const {validFunc} = require('../validator');

const express = require('express');
const {body, validationResult} = require('express-validator');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');


const router = express.Router();

router.use(express.json());

//join
router
    .post('/join',    
    [   
    body('email').notEmpty().isString().withMessage('이메일 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 필요'),
    validFunc
    ],join);

//login
router.post('/login',
    [   
    body('email').notEmpty().isString().withMessage('이메일 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 필요'),
    validFunc
    ],login );

//to reset
router.post('/reset',toRequestReset);

//reset
router.put('/reset',requestReset);


module.exports = router;