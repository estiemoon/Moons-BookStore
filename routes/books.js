const express = require('express');
const router = express.Router();
router.use(express.json());

const {allBooks, eachBook} = require('../controller/bookController')
const ensureAuth = require('../middlewares/auth');
const {validFunc} = require('../middlewares/validator');
const {param} = require('express-validator');

router.get('/',allBooks); 

router.get('/:id',
            ensureAuth,
            [param('id').notEmpty().withMessage('param 필요'), validFunc]
            ,eachBook);

module.exports = router;