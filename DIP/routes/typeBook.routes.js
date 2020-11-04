//'use strict';

const express = require('express');
const router = express.Router();

const { insertTypeBook, searchTypeBooks, searchOneTypeBook, updateTypeBook, deleteTypeBook } = require('../controllers/typeBook.controller');
/*

router.post('/', insertTypeBook);
router.get('/typeBooks', searchTypeBooks);
router.get('/oneTypeBook?', searchOneTypeBook);
router.put('/updateTypeBook?', updateTypeBook);
router.delete('/deleteTypeBook?', deleteTypeBook);

module.exports = router;*/