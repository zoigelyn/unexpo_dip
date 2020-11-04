
const express = require('express');
const router = express.Router();

const { insertarFicha, busquedaGeneral, busquedaEspecifica, eliminacionFicha, actualizarFicha, actualizarUnaFicha, fichasPendientes, satisfactorio, entregarFicha, FichasEntregadas, eliminarReserva, eliminarFicha, fichasReservadas, aprobarFicha, vencimiento, reservarLibro, misReservas} = require('../controllers/fichas.controller');
//const consultaBooks = require('../controllers/digitalLibrary.controller');
//const consultaBooksOne = require('../controllers/digitalLibrary.controller');

router.post('/insert', insertarFicha);
router.post('/aprobar', aprobarFicha);//lista
router.get('/fichas', FichasEntregadas);
router.get('/pruebaPiloto', vencimiento);

router.delete('/eliminarReserva', eliminarReserva);//lista
router.delete('/eliminar', eliminarFicha);//lista
router.get('/pending', fichasPendientes); //lista
router.get('/reservas', fichasReservadas);
router.get('/cardOne?', busquedaEspecifica);
router.delete('/entregar', entregarFicha);//lista
router.get('/cards', busquedaGeneral);
router.delete('/deleteCard?', eliminacionFicha);
router.put('/updatedCard?', actualizarFicha);
router.put('/updatedCardOne?', actualizarUnaFicha);

router.post('/usuario/libros/reservar?', reservarLibro);
router.get('/usuario/mis-reservas', misReservas);


module.exports = router;
