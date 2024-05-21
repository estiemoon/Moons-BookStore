const express = require('express');
const router = express.Router();

router.use(express.json());
//장바구니 담기
router.post('/', (req,res) => {

});

//장바구니 목록 조회
router.get('/', (req,res) => {

});

//장바구니 제거
router.delete('/:id', (req,res) => {

});

//장바구니에서 선택한 상품 목록 노출 = 주문 예상 상품
//!! URL 고려 필요
router.get('/', (req,res) => {
    
});

module.exports = router;