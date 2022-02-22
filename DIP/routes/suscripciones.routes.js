const express = require('express');
const router = express.Router();
const { suscripcionesP, todasSuscripciones, verSuscripion, actualizarS, misSuscripciones, suscripcionesV, infSuscripcion, eliminarSusV, cargarComprobante, upload, eliminarSusP, aprobarSolicitud, solicitudUnica } = require('../controllers/suscripciones.controller');
const { isAuthenticatedB, isAuthenticatedBAjax, isAuthenticatedAjax } = require('../controllers/usuarios.controllers');
const { route } = require('./configuracion.routes');

router.get('/bibliotecario/suscripcionesP', isAuthenticatedBAjax, suscripcionesP);
//
router.get('/bibliotecario/suscripcionesV', isAuthenticatedBAjax, suscripcionesV);
//usuario registrado
router.get('/suscripciones', isAuthenticatedAjax, todasSuscripciones);
//usuario no registrado
router.get('/suscripciones/no_registrado', todasSuscripciones);
/// editar una suscripción
router.post('/bibliotecario/editarSuscripcion?', isAuthenticatedBAjax, verSuscripion);
//Ruta para lograr la aprobación de una solicitud de suscripción
router.post('/bibliotecario/aprobarS?', isAuthenticatedBAjax, aprobarSolicitud);
//actualizar el costo y/o vigencia de una suscripcion
router.put('/bibliotecario/actualizarSus', isAuthenticatedBAjax, actualizarS);
//
router.get('/mi-solicitud', isAuthenticatedAjax, misSuscripciones);
//
router.post('/ver_inf?', isAuthenticatedAjax, infSuscripcion);
////ruta para eliminar una suscripcion
router.delete('/bibliotecario/eliminarSus?', isAuthenticatedBAjax, eliminarSusV);
///
router.delete('/bibliotecario/eliminarSusP?', isAuthenticatedBAjax, eliminarSusP);
//
router.post('/usuario/solicitarS', isAuthenticatedAjax, solicitudUnica, upload.single('comprobante'), cargarComprobante);
module.exports = router;