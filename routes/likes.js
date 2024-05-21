const express = require('express');
const router = express.Router();

router.use(express.json());

//좋아요 누르기
router.post('/:id', (req,res => {

}));

//좋아요 취소
router.delete('/:id', (req,res => {

}));




module.exports = router;