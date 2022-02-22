const express = require('express');
const router = express.Router();//Se requiere el método router de express.js
const passport = require('passport');//Se requiere el middleware passport.js


const {existeP, ingresoPreguntas, mostrarPreguntas, isAuthenticatedAdmin,isNotAuthenticatedAdmin, eliminarPregunta, unaPregunta, vistaRegistroB, vistaRegistroP, vistaIngresoB, vistaPreguntaUnica, vistaTareaCompleta, guardarConf, vistaConfDias, crearEstadoL, crearTipoL, crearTipoU, crearTipoS, crearEstadoP, existeBibliotecario, guardarNucleos, vistaConfNucleos, unicidadNucleo, unicidadCategoria, insertarCategoria, insertarNucleo, todosNucleos, todasCategorias, eliminarCategoria, eliminarNucleo, editarCategoria, actualizarC, editarNucleo, actualizarN, misRespuestasS, vistaRegistroA, solicitarDatos} = require('../controllers/configuracion.controller');
const {  isAuthenticatedAjax, isAuthenticatedBAjax, isAuthenticatedB, isNotAuthenticated} = require('../controllers/usuarios.controllers');
const { upload } = require('../controllers/noticias.controller');


//datos bancariod
router.get('/datosBancarios', isAuthenticatedAjax, solicitarDatos);

//Ruta delete en la que se elimina una pregunta en la plantilla preguntasCreadas.ejs
router.delete('/preguntas?', isAuthenticatedAdmin, eliminarPregunta);
//Se registran las preguntas y se muentran en la plantilla preguntasCreadas.ejs
router.post('/preguntas', isAuthenticatedAdmin, ingresoPreguntas, mostrarPreguntas);
//Si no se esta autentificado con esta ruta se accede al formulario de registro del bibliotecario, unicamente para el registro del bibliotecario
router.get('/e-b-245-43/administrador',isNotAuthenticatedAdmin,crearEstadoL, crearEstadoP, crearTipoL,  crearTipoU,  crearTipoS, existeBibliotecario, vistaRegistroA);
//Si no se esta autentificado con esta ruta se accede al formulario de registro del bibliotecario, unicamente para el registro del bibliotecario
router.get('/e-b-245-43/bibliotecario',isNotAuthenticated, vistaRegistroB);

//Vista del login unicamnete para ingreso del bibliotecario
router.get('/loginConfig', isNotAuthenticatedAdmin, vistaIngresoB);
//Estrategia creada con el middleware passport.js en el que si es exitosa la autentificación se redirecciona a "/existenP" sino se redirecciona a "/loginConfig" y se accede al objeto req desde la función Callback
router.post('/loginConfig', passport.authenticate('ingresarA',{

    successRedirect: '/existenP',
    failureRedirect: '/loginConfig',
    passReqToCallback: true

}));
//ruta post  para registro del bibliotecario con eso uno del middelware passport con la estrategia creada en local-auth.js
router.post('/signupConfig', passport.authenticate('registrarA',{
    successRedirect:'/existenP',
    failureRedirect: '/e-b-245-43/administrador',
    passReqToCallback: true
}));

//ruta post  para registro del bibliotecario con eso uno del middelware passport con la estrategia creada en local-auth.js
router.post('/signupConfigB', passport.authenticate('registrarB',{
    successRedirect:'/role',
    failureRedirect: '/e-b-245-43/bibliotecario',
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
router.post('/conf-dias', isAuthenticatedAdmin, upload.single('img'),  guardarConf);
//Vista de configuración completada, se renderiza a tarea.ejs
router.get('/prueba-c', isAuthenticatedAdmin, vistaTareaCompleta);
//
router.post('/conf-nucleos', isAuthenticatedAdmin, guardarNucleos);
//
router.get('/conf-nucleos', isAuthenticatedAdmin, vistaConfNucleos);
//
router.post('/bibliotecario/nucleo', isAuthenticatedBAjax, unicidadNucleo);
//
router.post('/bibliotecario/categoria', isAuthenticatedBAjax, unicidadCategoria);
///
router.post('/conf-nuevos', isAuthenticatedBAjax, insertarNucleo);
//
router.post('/conf-categorias', isAuthenticatedBAjax, insertarCategoria);
//
router.get('/bibliotecario/nucleos', isAuthenticatedBAjax, todosNucleos);
//
router.get('/categorias', isAuthenticatedAjax, todasCategorias);



//Ruta para eliminar categoria
router.delete('/bibliotecario/eliminarCategoria?', isAuthenticatedBAjax, eliminarCategoria);
//Ruta para eliminar nucleo
router.delete('/bibliotecario/eliminarNucleo?', isAuthenticatedBAjax, eliminarNucleo);
// se us para saber si se puede editar una categoria
router.post('/bibliotecario/editarCategoria?', isAuthenticatedBAjax, editarCategoria);
// se us para saber si se puede editar un nucleo
router.post('/bibliotecario/editarNucleo?', isAuthenticatedBAjax, editarNucleo);
/// se actualiza una categoria
router.put('/bibliotecario/actualizarCategoria', isAuthenticatedBAjax, actualizarC);
/// se actualiza una categoria
router.put('/bibliotecario/actualizarNucleo', isAuthenticatedBAjax, actualizarN);
//funcion que consulta las preguntas creadas por el usuario
router.get('/mis-preguntas', isAuthenticatedAjax, misRespuestasS);
module.exports = router;