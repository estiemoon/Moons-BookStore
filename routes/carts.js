const express = require('express');
const {addCartCon, allCartsCon, deleteCartItemCon} = require('../controller/cartController');
const router = express.Router();

router.use(express.json());
const ensureAuth = require('../auth');
 
//장바구니 담기
router.post('/', ensureAuth, addCartCon);

//장바구니 목록 조회, 선택한 목록 조회
router.get('/', ensureAuth, allCartsCon);

//장바구니 제거
router.delete('/:id', ensureAuth, deleteCartItemCon);


module.exports = router;