const express = require('express');
const {order,getOrder,getDetail} = require('../controller/orderController');
const router = express.Router();

router.use(express.json());


router.post('/', order);

router.get('/',getOrder);

router.get('/:id', getDetail);


module.exports = router;