const express = require('express');
const router = express.Router();
router.use(express.json());

const ensureAuth = require('../middlewares/auth');
const {addLikeCon, deleteLikeCon} = require('../controller/likeController');

//좋아요 누르기
router.post('/:id', ensureAuth, addLikeCon);

//좋아요 취소
router.delete('/:id',ensureAuth, deleteLikeCon);

module.exports = router; 