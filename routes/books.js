const express = require('express');

const {allBooks, eachBook} = require('../controller/bookController')
const ensureAuth = require('../auth');
const router = express.Router();

router.use(express.json());

router.get('/', allBooks); //ensureAuth(req,res,next)
router.get('/:id',ensureAuth, eachBook);

module.exports = router;