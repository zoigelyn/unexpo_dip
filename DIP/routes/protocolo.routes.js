//Se require el middleware express y el metodo router
const express = require('express');
const router = express.Router();

const {enviarInf} = require('../controllers/protocolo.controller');

router.get('/oai?', enviarInf);

module.exports = router;// se exportan las rutas