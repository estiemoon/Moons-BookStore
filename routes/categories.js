const express = require('express');
const router = express.Router();
router.use(express.json());

const { allCategories } = require('../controller/categoryController')

router.get('/', allCategories);

module.exports = router;