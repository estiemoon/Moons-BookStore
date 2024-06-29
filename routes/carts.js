const express = require('express');
const router = express.Router();
router.use(express.json());

const ensureAuth = require('../middlewares/auth');
const {validFunc} = require('../middlewares/validator');
const {body} = require('express-validator');
const {addCartCon, allCartsCon, deleteCartItemCon} = require('../controller/cartController');

router.post('/', 
            ensureAuth,
            [
            body('book_id').notEmpty().isInt().withMessage('책 아이디 필요'),
            body('quantity').notEmpty().isInt().withMessage('책 수량 필요'),
            validFunc
            ]        
            ,addCartCon);

router.get('/', ensureAuth, allCartsCon);

router.delete('/:id', ensureAuth, deleteCartItemCon);


module.exports = router; 