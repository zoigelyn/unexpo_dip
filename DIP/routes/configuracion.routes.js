const express = require('express');
const router = express.Router();//Se requiere el método router de express.js
const passport = require('passport');//Se requiere el middleware passport.js


const {existeP, ingresoPreguntas, mostrarPreguntas, isAuthenticatedAdmin,isNotAuthenticatedAdmin, eliminarPregunta, unaPregunta, vistaRegistroB, vistaRegistroP, vistaIngresoB, vistaPreguntaUnica, vistaTareaCompleta, guardarConf, vistaConfDias, crearEstadoL, crearTipoL, crearTipoU, crearEstadoP} = require('../controllers/configuracion.controller');


//Ruta delete en la que se elimina una pregunta en la plantilla preguntasCreadas.ejs
router.delete('/preguntas?', isAuthenticatedAdmin, eliminarPregunta);
//Se registran las preguntas y se muentran en la plantilla preguntasCreadas.ejs
router.post('/preguntas', isAuthenticatedAdmin, ingresoPreguntas, mostrarPreguntas);
//Si no se esta autentificado con esta ruta se accede al formulario de registro del bibliotecario, unicamente para el registro del bibliotecario
router.get('/e-b-245-43',isNotAuthenticatedAdmin, crearEstadoL, crearEstadoP, crearTipoL, crearTipoU, vistaRegistroB);
//Vista del login unicamnete para ingreso del bibliotecario
router.get('/loginConfig', isNotAuthenticatedAdmin, vistaIngresoB);
//Estrategia creada con el middleware passport.js en el que si es exitosa la autentificación se redirecciona a "/existenP" sino se redirecciona a "/loginConfig" y se accede al objeto req desde la función Callback
router.post('/loginConfig', passport.authenticate('ingresarB',{

    successRedirect: '/existenP',
    failureRedirect: '/loginConfig',
    passReqToCallback: true

}));
//ruta post  para registro del bibliotecario con eso uno del middelware passport con la estrategia creada en local-auth.js
router.post('/signupConfig', passport.authenticate('registrarB',{
    successRedirect:'/existenP',
    failureRedirect: '/e-b-245-43',
    passReqToCallback: true
}));
//Se verifica que existan las preguntas de seguridad registradas
router.get('/existenP', isAuthenticatedAdmin, existeP);

//Vista de registro de preguntas, se realiza con el uso de un motor de plantillas, ejs
router.get('/preguntas', vistaRegistroP);

//Vista de preguntas creadas, con uso del motor de plantillas ejs. Se muestran las preguntas creadas con opción a eliminarlas
router.get('/preguntasCreadas', isAuthenticatedAdmin, mostrarPreguntas );

//Ruta pos en la que se almacena una pregunta faltante a las preguntas de configuración, y luego se verifica la cantidad de preguntas almacenadas
router.post('/unaPregunta', isAuthenticatedAdmin, unaPregunta, existeP);

//Vista de formulario para añadir una pregunta faltante a las preguntas de configuración
router.get('/unaPregunta', isAuthenticatedAdmin, vistaPreguntaUnica);

//Se configuan los días y cantidad de libros límite para ser préstados
router.get('/conf-dias', isAuthenticatedAdmin, vistaConfDias);
//Se almacenan en la base de datos las configuración para días de préstamo y límite de libros
router.post('/conf-dias', isAuthenticatedAdmin, guardarConf);
//Vista de configuración completada, se renderiza a tarea.ejs
router.get('/prueba-c', isAuthenticatedAdmin, vistaTareaCompleta);
module.exports = router;