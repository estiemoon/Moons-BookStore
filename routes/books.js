const express = require('express');
const router = express.Router();

router.use(express.json());

//도서 전체 상품 조회
router.get('/', (req,res)=> {

});

//도서 개별 상품 조회
router.get('/:id', (req,res)=> {
    
});

//카테고리별 신간 안내 
router.get('/', (req,res) => {

});

module.exports = router;