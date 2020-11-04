const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/usuarios');
const Estudiantes = require('../models/estudiantes');
const Docentes = require('../models/docentes');
const bcrypt = require('bcryptjs'); 
const { Op } = require("sequelize");


passport.use('registrarse', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {
   
    const { tipo_u, cedula, apellidos, nombres, claveControl} = req.body;
    console.log(cedula, tipo_u, apellidos, nombres);
    
    if (clave == claveControl) {
    var cifrarContraseña = function(clave) {

        return bcrypt.hashSync(clave, bcrypt.genSaltSync(10), null);

    };

    var claveCifrada = cifrarContraseña(clave);

    
    
 const usuario = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u'
    ],
    where:{
         correo_u: correo.toLowerCase(),
},
});

const usuarioCedula = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u'
    ],
    where:{
         cedula_u: cedula,
},
});

 const estudiante = await Estudiantes.findOne({
    attributes:[
        'nombres_e',
        'apellidos_e',
        'cedula_e'
    ],
    where: {
    cedula_e: cedula,
},
});

 const docente = await Docentes.findOne({
    attributes: [
        'nombres_d',
        'apellidos_d',
        'cedula_d'
    ],
    where: {
         cedula_d: cedula, 
    },
});

if (!usuarioCedula && !usuario&& estudiante && tipo_u.toLowerCase() == 'estudiante' && !docente){
    const nuevoUsuario = await Usuarios.create({
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'estudiante',
        nombres_u: estudiante.nombres_e,
        apellidos_u: estudiante.apellidos_e,
        cedula_u: estudiante.cedula_e,
    });
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como estudiante exitosamente'));
}
else if (!usuarioCedula && !usuario && !estudiante && tipo_u.toLowerCase() == 'lector' && !docente){
    const nuevoUsuario = await Usuarios.create({
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'lector',
        nombres_u: nombres.toLowerCase,
        apellidos_u: apellidos.toLowerCase(),
        cedula_u: cedula,
    });
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como lector exitosamente')); 
}
else if (!usuarioCedula && !usuario && !estudiante && tipo_u.toLowerCase() == 'docente' && docente){
    const nuevoUsuario = await Usuarios.create({
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'docente',
        nombres_u: docente.nombres_d,
        apellidos_u: docente.apellidos_d,
        cedula_u: docente.cedula_d,
    });
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como docente exitosamente'));
}
else if (usuario){
    return done(null, false, req.flash('mensajeRegistro','su correo electronico ya esta registrado'));
}
else if (usuarioCedula){
    return done(null, false, req.flash('mensajeRegistro','Su cedula ya se encuentra registrada. No puede registrarse con otro correo'));
}
else if (!usuarioCedula && !usuario && !estudiante && tipo_u == 'estudiante' ){
    return done(null, false, req.flash('mensajeRegistro','no puede registrarse como estudiante'));
}
else if (!usuarioCedula && !usuario  && tipo_u == 'docente' && !docente){
    return done(null, false, req.flash('mensajeRegistro','no puede registrarse como docente'));
}
}
else{
    return done(null, false, req.flash('mensajeRegistro','Su clave no coincide'));
}

}));

//serialize
passport.serializeUser(function(usuario, done) {

    done(null, usuario.correo_u);

});

// deserialize user 
passport.deserializeUser( function( correo_u, done) {

    Usuarios.findOne({correo_u: correo_u}).then(function(usuario) {

        if (usuario) {

            done(null, usuario.get());

        } else {

            done(usuario.errors, null);

        }

    });

});


passport.use('ingresar', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {


   
    var compararContraseña = function(usuario, clave) {

        var result = bcrypt.compareSync(clave, usuario.clave_u);
        return result;

    };

 const usuario = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u',
        'clave_u'
    ],
    where:{
        correo_u: correo.toLowerCase(),
},
});

    


if (!usuario){
    return done(null, false, req.flash('mensajeIngreso','el usuario no existe'));
}
else if (!compararContraseña(usuario, clave)){ 
    return done(null, false, req.flash('mensajeIngreso','su contraseña ha sido ingresada de manera erronea')); 
}
else { 
    return done(null, usuario, req.flash('mensajeIngreso','usuario logeado satisfactoriamente'));
}
  

}));

passport.use('ingresarB', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {


   
    var compararContraseña = function(usuario, clave) {

        var result = bcrypt.compareSync(clave, usuario.clave_u);
        return result;

    };

 const usuario = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u',
        'clave_u'
    ],
    where:{
        correo_u: correo.toLowerCase()
},
});



    


if (!usuario){
    return done(null, false, req.flash('mensajeIngreso','el usuario no existe'));
}

else if(usuario && usuario.tipo_u != 'bibliotecario'){
    return done(null, false, req.flash('mensajeIngreso','usted no esta registrado como bibliotecario')); 
}
else if (!compararContraseña(usuario, clave)){ 
    return done(null, false, req.flash('mensajeIngreso','su contraseña ha sido ingresada de manera erronea')); 
}
else { 
    return done(null, usuario, req.flash('mensajeIngreso','usuario logeado satisfactoriamente'));
}
  

}));

  
passport.use('registrarB', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {
   
    const { tipo_u, cedula, apellidos, nombres, claveControl} = req.body;
    console.log(cedula, tipo_u, apellidos, nombres);

    if (clave == claveControl) {

    var cifrarContraseña = function(clave) {

        return bcrypt.hashSync(clave, bcrypt.genSaltSync(10), null);

    };

    var claveCifrada = cifrarContraseña(clave);

    
    
 const usuario = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u'
    ],
    where:{
         correo_u: correo.toLowerCase(),
},
});

const usuarioCedula = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u'
    ],
    where:{
         cedula_u: cedula,
},
});



 const estudiante = await Estudiantes.findOne({
    attributes:[
        'nombres_e',
        'apellidos_e',
        'cedula_e'
    ],
    where: {
    cedula_e: cedula,
},
});


if (!usuarioCedula && !usuario  && estudiante){
    return done(null, false, req.flash('mensajeRegistro','usted no puede ser el administrador por ser estudiante'));
}
else if (!usuarioCedula && !usuario  && !estudiante){
    const nuevoUsuario = await Usuarios.create({
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'bibliotecario',
        nombres_u: nombres.toLowerCase(),
        apellidos_u: apellidos.toLowerCase(),
        cedula_u: cedula,
    });
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como bibliotecario exitosamente')); 
}
else if (usuario){
    return done(null, false, req.flash('mensajeRegistro','su correo electronico ya esta registrado'));
}
else if (usuarioCedula){
    return done(null, false, req.flash('mensajeRegistro','Su cédula ya se encuentra registrada. No puede registrarse con otro correo'));
}


}
else {
        return done(null, false, req.flash('mensajeRegistro','Su clave no coincide'));
}
}));

passport.use('cambioClave', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {
   
    const claveControl = req.body.claveControl;
    //const correoU = req.query.correo;
   

    if (clave == claveControl) {

    var cifrarContraseña = function(clave) {

        return bcrypt.hashSync(clave, bcrypt.genSaltSync(10), null);

    };

    var claveCifrada = cifrarContraseña(clave);

    const usuario = await Usuarios.findOne({
     
        where: {
             correo_u: correo.toLowerCase()
    },
});
console.log('-----------------------------------------------');
console.log(usuario.length);

//if (correoU.toLowerCase() === correo.toLowerCase()){
    if (usuario) {

   console.log('||||||||||||||||||||||||||||||||||||||');
       const actualizado = await Usuarios.update({
            clave_u: claveCifrada
    },{
        where: {
            correo_u: correo.toLowerCase()
        }
        });


const nuevoUsuario = await Usuarios.findOne({
    where: {
        correo_u: correo.toLowerCase()   
} 
});

    return done(null, nuevoUsuario, req.flash('mensajeRecuperacion','usuario creado como bibliotecario exitosamente'));
}

else {
    return done(null, false, req.flash('mensajeRecuperacion','Su correo no corresponde a las respuestas de seguridad que suministro'));
}


    }
else {
        return done(null, false, req.flash('mensajeRecuperacion','Su clave no coincide'));
}
}));
  