const express = require('express');
const {addLike, deleteLike} = require('../controller/likeController');
const router = express.Router();

router.use(express.json());

//좋아요 누르기
router.post('/:id', addLike);

//좋아요 취소
router.delete('/:id', deleteLike);




module.exports = router;