const express = require('express');
const { allCategories } = require('../controller/categoryController')
const router = express.Router();

router.use(express.json());

router.get('/', allCategories);


module.exports = router;