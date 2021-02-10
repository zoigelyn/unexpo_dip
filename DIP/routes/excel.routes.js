//Se require el middleware express y el metodo router
const express = require('express');
const router = express.Router();
const { upload, insertarBaseE, insertarBaseD } = require('../controllers/excel.controller.js');// se requieren las funciones necesarias

const { isAuthenticatedBAjax } = require('../controllers/usuarios.controllers'); //funciones para autentificar

router.post('/bibliotecario/nuevaBaseE', isAuthenticatedBAjax, upload.single('excel'), insertarBaseE);//ruta post para actualizar la tabla estudiantes
router.post('/bibliotecario/nuevaBaseD', isAuthenticatedBAjax, upload.single('excel'), insertarBaseD);//ruta post para actualizar la tabla docentes

module.exports = router;// se exportan las rutas