const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
router.use(express.json());

const {join,login,toRequestReset,requestReset} = require('../controller/userController');
const {validFunc} = require('../middlewares/validator');
const excRefresh = require('../middlewares/refresh');

const validateEmailAndPwd = [ 
                        body('email').notEmpty().isString().withMessage('이메일 필요'),
                        body('password').notEmpty().isString().withMessage('비밀번호 필요'),
                        validFunc]

router.post('/join',validateEmailAndPwd,join);

router.post('/login',validateEmailAndPwd,login );

router.post('/reset', 
        [body('email').notEmpty().isString().withMessage('이메일 필요'), validFunc],
        toRequestReset);

router.put('/reset',validateEmailAndPwd,requestReset);

router.get('/refresh', excRefresh );

module.exports = router;