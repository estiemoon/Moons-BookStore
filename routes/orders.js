const express = require('express');
const router = express.Router();

router.use(express.json());

//주문하기
router.post('/', (req,res) =>{

});

//주문목록 조회
router.get('/',(req,res) => {

});

//주문상품 상세 정보 조회
router.get('/:id', (req,res) => {

});


module.exports = router;