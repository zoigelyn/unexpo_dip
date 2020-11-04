
const express = require('express');
const router = express.Router();

const { insertarPregunta } = require('../controllers/preguntas.controller');
//const consultaBooks = require('../controllers/digitalLibrary.controller');
//const consultaBooksOne = require('../controllers/digitalLibrary.controller');

router.post('/insert', insertarPregunta);
//router.get('/', totalLibros);
//router.get('/oneBook?', busquedaEspecifica);
//router.get('/books?', busquedaGeneral)
//router.put('/updatedBook?', actualizarLibro);
//router.put('/updatedBookOne?', actualizarUnLibro)
//router.delete('/deleteBook?', eliminarLibro);

module.exports = router;