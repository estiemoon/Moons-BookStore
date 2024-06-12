const express = require('express');
const {addLikeCon, deleteLikeCon} = require('../controller/likeController');
const ensureAuth = require('../auth');
const router = express.Router();

router.use(express.json());

//좋아요 누르기
router.post('/:id', ensureAuth, addLikeCon);

//좋아요 취소
router.delete('/:id',ensureAuth, deleteLikeCon);

module.exports = router;