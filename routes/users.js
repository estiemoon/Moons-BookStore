const {join,login,toRequestReset,requestReset} = require('../controller/userController');
const {validFunc} = require('../validator');
const excRefresh = require('../refresh');

const express = require('express');
const {body, validationResult} = require('express-validator');

const router = express.Router();
router.use(express.json());
const cp = require('cookie-parser');
router.use(cp());

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

//refresh
router.get('/refresh', excRefresh );

module.exports = router;