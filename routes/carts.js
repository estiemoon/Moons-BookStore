const express = require('express');
const {addCart, allCarts, deleteCartItem} = require('../controller/cartController');
const router = express.Router();

router.use(express.json());


//장바구니 담기
router.post('/',addCart );

//장바구니 목록 조회, 선택한 목록 조회
router.get('/', allCarts);

//장바구니 제거
router.delete('/:id', deleteCartItem);



module.exports = router;