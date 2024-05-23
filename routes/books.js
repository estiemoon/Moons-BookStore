const express = require('express');
const { allBooks, eachBook} = require('../controller/bookController')
const router = express.Router();

router.use(express.json());

router.get('/', allBooks);
router.get('/:id', eachBook);



module.exports = router;