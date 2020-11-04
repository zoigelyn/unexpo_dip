const express = require('express');
const router = express.Router();
const passport = require('passport');


const {  existeBibliotecario, existeP, ingresoPreguntas, mostrarPreguntas, isAuthenticatedAdmin,isNotAuthenticatedAdmin, eliminarPregunta, unaPregunta, unaPreguntaR, vistaRegistroB, vistaRegistroP, vistaIngresoB, vistaPreguntaUnica, vistaTareaCompleta, logoutConfig} = require('../controllers/configuracion.controller');


router.delete('/preguntas?', isAuthenticatedAdmin, eliminarPregunta);
router.post('/preguntas', isAuthenticatedAdmin, ingresoPreguntas, mostrarPreguntas);
router.get('/e-b-245-43',isNotAuthenticatedAdmin, vistaRegistroB);
router.get('/loginConfig', isNotAuthenticatedAdmin, vistaIngresoB);
router.post('/loginConfig', passport.authenticate('ingresarB',{

    successRedirect: '/existenP',
    failureRedirect: '/loginConfig',
    passReqToCallback: true

}));
router.post('/signupConfig', passport.authenticate('registrarB',{
    successRedirect:'/existenP',
    failureRedirect: '/e-b-245-43',
    passReqToCallback: true
}));
router.get('/existenP', isAuthenticatedAdmin, existeP);
router.get('/prueba', isNotAuthenticatedAdmin, existeBibliotecario);
router.get('/preguntas', vistaRegistroP);
router.get('/preguntasCreadas', isAuthenticatedAdmin, mostrarPreguntas );
router.post('/unaPregunta', isAuthenticatedAdmin, unaPregunta, existeP);
router.get('/unaPregunta', isAuthenticatedAdmin, vistaPreguntaUnica);
router.get('/logoutConfig', isAuthenticatedAdmin, logoutConfig);
router.get('/prueba-c', isAuthenticatedAdmin, vistaTareaCompleta);
module.exports = router;