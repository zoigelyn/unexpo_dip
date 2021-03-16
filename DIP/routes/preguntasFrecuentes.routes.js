const express = require('express');
const router = express.Router();
var path = require('path');
const { insertarPregunta, mostrarPreguntasF, eliminarUnaPregunta, unaPregunta, actualizarPregunta} = require('../controllers/preguntasFrecuentes.controller.js');

const { isAuthenticatedAjax, isAuthenticatedBAjax} = require('../controllers/usuarios.controllers');

router.post('/bibliotecario/nueva-p-f', isAuthenticatedAjax, insertarPregunta);
//ruta que consulta las preguntas almacenadas en preguntas frecuentes para ser mostradas a todos los roles
router.get('/preguntas-frecuentes', mostrarPreguntasF);
//ruta especifica para el bibliotecario
router.delete('/bibliotecario/eliminar/p_f?', isAuthenticatedBAjax, eliminarUnaPregunta);
//ruta de acceso a todos los roles todos los roles
router.post('/pregunta?', unaPregunta);
//Se actualiza una pregunta, solo para el bibliotecario
router.put('/bibliotecario/editar-pregunta', isAuthenticatedAjax, actualizarPregunta);

module.exports = router;