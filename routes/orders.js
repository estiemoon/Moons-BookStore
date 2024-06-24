const express = require('express');
const {orderCon,getOrderCon,getDetailCon} = require('../controller/orderController');
const router = express.Router();
router.use(express.json());

const ensureAuth = require('../middlewares/auth');
const {validFunc} = require('../middlewares/validator');
const {body} = require('express-validator');

router.post('/', 
            ensureAuth,
            [
            body('items').notEmpty().isArray().withMessage("장바구니 아이템 필요"),
            body('delivery').notEmpty().isObject().withMessage("배달 정보 필요"),
            body('totalPrice').notEmpty().isInt().withMessage("총 금액 필요"),
            body('totalQuantity').notEmpty().isInt().withMessage("총 수량 필요"),
            body('bookTitle').notEmpty().isString().withMessage("대표 책 타이틀 필요"),
            validFunc
            ]
            ,orderCon);

router.get('/', ensureAuth, getOrderCon);

router.get('/:id',ensureAuth, getDetailCon);



module.exports = router; 