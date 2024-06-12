const express = require('express');
const {orderCon,getOrder,getDetail} = require('../controller/orderController');
const router = express.Router();

router.use(express.json());
const ensureAuth = require('../auth');

router.post('/', ensureAuth, orderCon);

router.get('/', ensureAuth, getOrder);

router.get('/:id',ensureAuth, getDetail);



module.exports = router;