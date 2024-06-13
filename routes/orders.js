const express = require('express');
const {orderCon,getOrderCon,getDetailCon} = require('../controller/orderController');
const router = express.Router();

router.use(express.json());
const ensureAuth = require('../auth');

router.post('/', ensureAuth, orderCon);

router.get('/', ensureAuth, getOrderCon);

router.get('/:id',ensureAuth, getDetailCon);



module.exports = router;