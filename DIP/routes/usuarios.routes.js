const app = require ('../app');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Usuarios = require('../models/usuarios');
const Tipo_Usuario = require('../models/tipoUsuario');

const { insertUser, searchUsers, prueba, isNotAuthenticated, isAuthenticated, existeBibliotecario, existeP, ingresoPreguntas, mostrarPreguntas, seguridad, respuestas, resSeguridad, recuperar, comprobarResp, comprobarU, existeUsuario} = require('../controllers/usuarios.controllers');

router.get('/seguridad', isAuthenticated, respuestas);
router.post('/respuestas', isAuthenticated, resSeguridad);

router.get('/signup', isNotAuthenticated, (req, res, next) => {
    res.render('registrarse',{
        titulo: 'Registro'
       });
});


router.get('/login', isNotAuthenticated, (req, res, next) => {
    res.render('ingresar',{
        titulo: 'Ingreso'
       });
     
});

router.get('/inicioUsuario', isAuthenticated, (req, res, next) => {
    res.render('inicioUsuario',{
        titulo: 'Inicio'
       });
});

router.get('/role', isAuthenticated, seguridad, async (req, res, next) => {

        var usuarioLogeado = await Usuarios.findOne({where: {correo_u: req.session.passport.user}});
        
        req.session.usuarioL = usuarioLogeado; 
        
       
        
   
    if (usuarioLogeado.tipo_u == 'lector' || usuarioLogeado.tipo_u == 'estudiante' || usuarioLogeado.tipo_u == 'docente')
    {
        
        res.redirect('/usuario');
    }
    
    
    else if (usuarioLogeado.tipo_u == 'bibliotecario'){
         
        res.redirect('/bibliotecario');
        
    }
}
);

router.get('/bibliotecario', isAuthenticated, (req, res, next) => {
    if (req.session.usuarioL.tipo_u === 'bibliotecario') {
    res.render('admin', {
        titulo: 'Inicio',
        usuarioL: req.session.usuarioL
    });
}
});


router.get('/usuario', isAuthenticated, (req, res, next) => {
    res.render('inicioUsuario',{
        titulo: 'Inicio',
        usuarioL: req.session.usuarioL
       });
       
});

router.post('/signup', passport.authenticate('registrarse',{
    successRedirect: '/role',
    failureRedirect: '/signup',
    passReqToCallback: true

}));
router.post('/login', passport.authenticate('ingresar',{

    successRedirect: '/role',
    failureRedirect: '/login',
    passReqToCallback: true

}));
router.post('/login-exist', existeUsuario);

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    req.logout();
    res.redirect('/index');
});
router.get('/recuperacion', isNotAuthenticated, (req, res, next) => {
    res.render('recuperarC', {
        titulo: 'Recuperacion',
        conf: 1
    });
});

router.post('/recuperacion', isNotAuthenticated, comprobarU, recuperar );
router.post('/recuperar?', isNotAuthenticated, comprobarResp);
router.post('/recuperar/cambio_clave?',isNotAuthenticated, passport.authenticate('cambioClave',{
    successRedirect: '/user/role',
    failureRedirect: '/user/recuperacion',
    passReqToCallback: true

})); 

router.get('/', searchUsers);
//router.get('/login', entrar);
//router.get('/oneBook?', booksTitle);
//router.put('/updateBook?', updateBook);
//router.delete('/deleteBook?', deleteBook);

module.exports = router;