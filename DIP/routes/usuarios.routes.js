const express = require('express');
const router = express.Router();
const passport = require('passport');;

const { isNotAuthenticated, isAuthenticated, seguridad, respuestas, resSeguridad, recuperar, comprobarResp, comprobarU, existeCorreo, roles, vistaB, vistaU, isAuthenticatedB, vistaR} = require('../controllers/usuarios.controllers');

//ruta solicitada desde ajax para comprobar si el correo ingresado se encuentra en la base de datos, antes de enviar los datos al logearse
router.post('/ingresar/existe-c', existeCorreo);
//ruta que consulta las preguntas que deben ser configuradas por cada usuario
router.get('/seguridad', isAuthenticated, respuestas);
//Ruta que recibe las respuestas a las preguntas de seguridad
router.post('/respuestas', isAuthenticated, resSeguridad);
//ruta get para registrarse, envia la informacion al motor de plantilla para que este muestre el formulario y demas
router.get('/signup', isNotAuthenticated, (req, res, next) => {
    res.render('registrarse',{
        titulo: 'Registro'
       });
});

//ruta para ingresar a la cuenta
router.get('/login', isNotAuthenticated, (req, res, next) => {
    res.render('ingresar',{
        titulo: 'Ingreso'
       });
     
});

//función que redirecciona al usuario sino ha configurado sus preguntas de seguridad y si ya las configuró lo redirecciona al inicio correspondiente de ser el bibliotecario o un usuario común
router.get('/role', isAuthenticated, seguridad, roles);
//Ruta especifica para el bibliotecario, inicio.
router.get('/bibliotecario', isAuthenticatedB, vistaB);
//Ruta que renderiza el usuario al inicio correspondiente
router.get('/usuario', isAuthenticated, vistaU);
//Ruta que recibe los datos del registro y usa la estrategia local especificada, donde de ser exitosa se redirecciona a "/role" y de fallar redirecciona a "/signup"
router.post('/signup', passport.authenticate('registrarse',{
    successRedirect: '/role',
    failureRedirect: '/signup',
    passReqToCallback: true

}));
//Ruta que recibe los datos al ingresar y usa la estrategia local para autetificación que lleva por nombre ingresar y de ser exitosa redirecciona a "/role" y de fallar redirecciona a "/login"
router.post('/login', passport.authenticate('ingresar',{

    successRedirect: '/role',
    failureRedirect: '/login',
    passReqToCallback: true

}));
//Ruta para el deslogeo
router.get('/logout', (req, res, next) => {
    req.session.destroy();//Elimina la sessión
    req.logout();//Elimina la autenticación
    res.redirect('/');//Redireciona al inicio común
});
//ruta que renderiza a la vista para restablecer la contraseña
router.get('/recuperacion', isNotAuthenticated, vistaR);
//Ruta que recibe la informacion al momento del restablecimiento de contraseña, comprueba si el usuario existe y de ser asi lanza las preguntas de seguridad
router.post('/recuperacion', isNotAuthenticated, comprobarU, recuperar );
//Función que recibe como parametros querys las respuestas
router.post('/recuperar?', isNotAuthenticated, comprobarResp);
//Función que utiliza la autentificación por passport para restablecer la contraseña, si se realiza exitosamente se redirecciona a "/role" sino se redirecciona a "/recuperación"
router.post('/recuperar/cambio_clave?',isNotAuthenticated, passport.authenticate('cambioClave',{
    successRedirect: '/role',
    failureRedirect: '/recuperacion',
    passReqToCallback: true

})); 


module.exports = router;