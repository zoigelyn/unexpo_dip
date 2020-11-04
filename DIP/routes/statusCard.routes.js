'use strict';

const express = require('express');
const router = express.Router();

const { insertBook, searchBooks, booksTitle, deleteBook, updateBook } = require('../controllers/digitalLibrary.controller');
//const consultaBooks = require('../controllers/digitalLibrary.controller');
//const consultaBooksOne = require('../controllers/digitalLibrary.controller');

router.post('/', insertBook);
router.get('/books', searchBooks);
router.get('/oneBook?', booksTitle);
router.put('/updateBook?', updateBook);
router.delete('/deleteBook?', deleteBook);

module.exports = router;