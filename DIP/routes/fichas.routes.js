
const express = require('express');
const router = express.Router();

const { eliminarReserva, eliminarFichaE,  aprobarFicha, reservarLibro, misReservas, existeConfigDias, recibirLibro, prestamosVVAjax, prestamosAjax, prestamosPAjax, misPrestamos, miFicha, miFichaE} = require('../controllers/fichas.controller');

const { isAuthenticatedAjax, isAuthenticatedB, isAuthenticatedBAjax} = require('../controllers/usuarios.controllers');

const {vistaDiasPrestamo, guardarConfDias} = require('../controllers/configuracion.controller');



//ruta que consulta los prestamos entregados
router.get('/bibliotecario/prestamosAjax', isAuthenticatedBAjax, existeConfigDias, prestamosAjax);

//ruta que consulta los préstamos pendientes
router.get('/bibliotecario/prestamosPAjax', isAuthenticatedBAjax, existeConfigDias, prestamosPAjax);

//ruta que consulta los prestamos vigente
router.get('/bibliotecario/prestamosVVAjax', isAuthenticatedBAjax, existeConfigDias, prestamosVVAjax);

//Consulta los días de préstamos y limite de libros
router.get('/bibliotecario/conf-dias', isAuthenticatedB, vistaDiasPrestamo);

//Guarda configuración de días de préstamos y limite de libros
router.post('/bibliotecario/conf-dias', isAuthenticatedBAjax, guardarConfDias);

//eliminación de una ficha reservada
router.delete('/usuario/eliminarFicha?', isAuthenticatedAjax, eliminarReserva);

//Reservar un libro y actualizar estado del libro
router.post('/usuario/reservar', reservarLibro);

//ruta post que aprueba una reservación
router.post('/bibliotecario/aprobar', isAuthenticatedBAjax, aprobarFicha);

//ruta post para recibir un libro
router.post('/bibliotecario/recibir', isAuthenticatedBAjax, recibirLibro);

//Ruta que envia al usuario, docente o estudiante las reservaciones que tiene activas
router.get('/usuario/mis-reservas',isAuthenticatedAjax, misReservas);

//ruta que envia al usuario los préstamos que tiene activos
router.get('/usuario/mis-prestamos',isAuthenticatedAjax, misPrestamos);

//Envia al cliente la información sobre una ficha entregada
router.post('/ver_ficha_e?', isAuthenticatedAjax, miFichaE);

//Envia al cliente la información sobre una ficha vigente, pendiente o vencida
router.post('/ver_ficha?', isAuthenticatedAjax, miFicha);



//Elimina una reserva y actualiza el estado del libro
//router.delete('/eliminarReserva',isAuthenticatedBAjax, eliminarReserva);

//ruta tipo delete que elimina una ficha almacenada en fichas entregadas
router.delete('/bibliotecario/eliminarFichaEntregada?',isAuthenticatedBAjax, eliminarFichaE);





module.exports = router;
