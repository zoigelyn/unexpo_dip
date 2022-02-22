const passport = require('passport');//Se requiere el middleware passport, el cual se utliza para realizar la autentificación
const LocalStrategy = require('passport-local').Strategy;//Se requiere la estrategia local del modula  de passport, passport-local
const Usuarios = require('../models/usuarios');//Se requiere el modelo de sequelize para la tabla usuarios
const Estudiantes = require('../models/estudiantes');//Se requiere el modelo de sequelize para la tabla estudiantes
const Docentes = require('../models/docentes');//Se requiere el modelo de sequelize para la tabla docentes
const bcrypt = require('bcryptjs');//Se requiere el middleware bcrypt.js el cual nos permite la encriptación 
const Tipo_Suscripcion = require('../models/tipoSuscripcion');
const Suscripciones = require('../models/suscripciones');
function sumarDias(dia, fecha) {
    fecha.setDate(fecha.getDate()+dia);
    return fecha
  };

//se usa el middleware passport, y se crea una nueva estrategia de autentificación local, tal como describe la documentación oficial en npm
passport.use('registrarse', new LocalStrategy({// recibe un objeto y devuelve un callBack
    usernameField: 'correo',//Datos con los que se va a autentificar el usuario
    passwordField: 'clave',//correo y clave con el nombre name que tienen en el formulario
    passReqToCallback: true
},

async function(req, correo, clave, done) {//funcion asincrona para el uso del operador await, en donde la función recibe un req, correo, clave y devuelve un done
 
    const { tipo_u, cedula, apellidos, nombres, claveControl, tipoCarnet} = req.body;//Se requiere la información del formulario
   
   
    if (clave == claveControl) {//Se verifica si la clave y la comprobación de clave son las mismas
    var cifrarContraseña = function(clave) {//Se describe un metodo, que recibe la clave y la retorna cifrada

        return bcrypt.hashSync(clave, bcrypt.genSaltSync(10), null);//Se le dan 3 atributos, la clave o cadena a cifrar, la cantidad de veces que se desarrollara el algoritmo y null para error

    };

    const claveCifrada = cifrarContraseña(clave); //Uso el método para cifrar la clave y el resultado lo gusrdo en una const
    
    
    //utilizo el método de busqueda de sequelize que tiene como limite 1 para los resultados 
 const usuario = await Usuarios.findOne({
    attributes:[//los atributos que necesito de la busqueda
        'correo_u',
        'tipo_u'
    ],
    where:{//la condición de busqueda
         correo_u: correo.toLowerCase(),
},
});

//nueva busqueda pero ahora con la condición de la cédula
const usuarioCedula = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u'
    ],
    where:{
        
            cedula_u: cedula
         },
});
const estudianteC = await Estudiantes.findOne({
    attributes:[
        'nombres',
        'apellidos',
        'cedula'
    ],
    where: {
        cedula: cedula
        
         },
});


    const usuarioPasaporte = await Usuarios.findOne({
        attributes:[
            'correo_u',
            'tipo_u'
        ],
        where:{
            
                pasaporte_u: cedula
             },
    }); 
    const estudianteP = await Estudiantes.findOne({
        attributes:[
            'nombres',
            'apellidos',
            'pasaporte'
        ],
        where: {
            pasaporte: cedula
            
             },
    });

//Se realiza una busqueda en la tabla docentes con la cédula
const docente = await Docentes.findOne({
    attributes: [
        'nomdoc',
        'apedoc',
        'ceddoc'
    ],
    where: {
         ceddoc: cedula, 
    },
});
//Se busca con la condición de la cédula si el nuevo usuario se encuentra registrado en la tabla estudiantes
 //Si no existe un usuario registrado con esa cédula ni con ese correo y no existe un usuario registrado como docente con esa cédula y el usuario se encuentra en la tabla estudiante, entonces, se procede a devolver la respuesta con un done y a realizar la creación del nuevo usuario
if (!usuarioCedula && !usuarioPasaporte && !usuario && (estudianteC || estudianteP) && !docente) {
  let nuevoUsuario;
    let suscripcion = await Tipo_Suscripcion.findOne({
        where: {
            tipo_ts: 'estandar'
        }
    });

    let fecha = new Date();
    let diaV = sumarDias(suscripcion.vigencia, fecha); 
   if ( tipoCarnet.toLowerCase() === 'carnet de identidad') {
     nuevoUsuario = await Usuarios.create({//Se utliza el método de sequelize para crear un usuario, este recibe un objeto con los atributos correspondientes
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'estudiante',
        nombres_u: estudianteC.nombres,
        apellidos_u: estudianteC.apellidos,
        cedula_u: estudianteC.cedula,
        tipo_s: 'estandar',
        estado_s: 'vigente',
        fecha_s: diaV
    });
    if (nuevoUsuario) {
        const suscripciones = await Suscripciones.create({
        tipo: 'estandar',
        correo_s: correo.toLowerCase(),
        estado_s: 'vigente',
        fecha_c: diaV
    });
}
   } else {
         nuevoUsuario = await Usuarios.create({//Se utliza el método de sequelize para crear un usuario, este recibe un objeto con los atributos correspondientes
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'estudiante',
        nombres_u: estudianteP.nombres,
        apellidos_u: estudianteP.apellidos,
        pasaporte_u: estudianteP.pasaporte,
        tipo_s: 'estandar',
        estado_s: 'vigente',
        fecha_s: diaV
    });
   if (nuevoUsuario) {
        const suscripciones = await Suscripciones.create({
        tipo: 'estandar',
        correo_s: correo.toLowerCase(),
        estado_s: 'vigente',
        fecha_c: diaV
    }); 
     }
   
    }
    
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como estudiante exitosamente'));// retorna un done, con null para err
}////Si no existe un usuario registrado con esa cédula ni con ese correo y no existe un usuario registrado como docente  ni como estudiante con esa cédula y ha seleccionado el tipo de usuario lector, entonces, se procede a devolver la respuesta con un done y a realizar la creación del nuevo usuario
else if (!usuarioCedula && !usuarioPasaporte && !usuario && !estudianteC && !estudianteP && !docente){
    let nuevoUsuario;
     let suscripcion = await Tipo_Suscripcion.findOne({
        where: {
            tipo_ts: 'de prueba'
        }
    });
    let fecha = new Date();
    let diaV = sumarDias(suscripcion.vigencia, fecha);  
    if ( tipoCarnet.toLowerCase() === 'carnet de identidad') {
   
     nuevoUsuario = await Usuarios.create({
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'lector',
        nombres_u: nombres.toLowerCase(),
        apellidos_u: apellidos.toLowerCase(),
        cedula_u: cedula,
        tipo_s: 'de prueba',
        estado_s:'vigente',
        fecha_s: diaV
    });
  
    if (nuevoUsuario) {
         const suscripciones = await Suscripciones.create({
        tipo: 'de prueba',
        correo_s: correo.toLowerCase(),
        estado_s: 'vigente',
        fecha_c: diaV
    }); 
    }
    } else {
          nuevoUsuario = await Usuarios.create({
            correo_u: correo.toLowerCase(),
            clave_u: claveCifrada,
            tipo_u: 'lector',
            nombres_u: nombres.toLowerCase(),
            apellidos_u: apellidos.toLowerCase(),
            pasaporte_u: cedula,
            tipo_s: 'de prueba',
            estado_s:'vigente',
            fecha_s: diaV
        });
      
        if (nuevoUsuario) {
             const suscripciones = await Suscripciones.create({
            tipo: 'de prueba',
            correo_s: correo.toLowerCase(),
            estado_s: 'vigente',
            fecha_c: diaV
        }); 
        }
    }

  
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como lector exitosamente')); 
}////Si no existe un usuario registrado con esa cédula ni con ese correo y no existe un usuario registrado como estudiante con esa cédula y el usuario se encuentra en la tabla docente y ha seleccionado el tipo de usuario docente, entonces, se procede a devolver la respuesta con un done y a realizar la creación del nuevo usuario
else if (!usuarioCedula && !usuarioPasaporte && !usuario && !estudianteC && !estudianteP && docente){
     let suscripcion = await Tipo_Suscripcion.findOne({
        where: {
            tipo_ts: 'premium'
        }
    });
    let fecha = new Date();
    let diaV = sumarDias(suscripcion.vigencia, fecha); 
    
    const nuevoUsuario = await Usuarios.create({
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'docente',
        nombres_u: docente.nomdoc,
        apellidos_u: docente.apedoc,
        cedula_u: docente.ceddoc,
        tipo_s: 'premium',
        estado_s: 'vigente',
        fecha_s: diaV
    });
  
    if (nuevoUsuario) {
        const suscripciones = await Suscripciones.create({
        tipo: 'premium',
        correo_s: correo.toLowerCase(),
        estado_s: 'vigente',
        fecha_c: diaV
    }); 
    }
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como docente exitosamente'));
}////Si existe un usuario registrado con ese correo electrónico
else if (usuario){
    return done(null, false, req.flash('mensajeRegistro','su correo electronico ya esta registrado'));//false para usuario porque no se crea
}//Si existe un usuario registrado con esa cédula
else if (usuarioCedula){//Si existe un usuario con la misma cédula registrado
    return done(null, false, req.flash('mensajeRegistro','Su cedula ya se encuentra registrada. No puede registrarse con otro correo'));
}
else if (usuarioPasaporte){//Si existe un usuario con el mismo pasaporte registrado
    return done(null, false, req.flash('mensajeRegistro','Su pasaporte ya se encuentra registrada. No puede registrarse con otro correo'));
}//Si no existe un usuario registrado con esa cédula ni con ese correo y no existe un usuario registrado como docenteni como estudiante y ha seleccionado el tipo de usuario estudiante, entonces, se procede a devolver la respuesta con un done y un error
else if (!usuarioCedula && !usuarioPasaporte && !usuario && !estudianteC && !estudianteP && tipo_u.toLowerCase() == 'estudiante' ){
    return done(null, false, req.flash('mensajeRegistro','No puede registrarse como estudiante porque no se encuentra en la base de datos'));
}//Si no existe un usuario registrado con esa cédula ni con ese correo y no existe un usuario registrado como docenteni como estudiante y ha seleccionado el tipo de usuario docente, entonces, se procede a devolver la respuesta con un done y un error
else if (!usuarioCedula && !usuarioPasaporte && !usuario  && tipo_u.toLowerCase() == 'docente' && !docente){
    return done(null, false, req.flash('mensajeRegistro','No puede registrarse como docente porque no se encuentra en la base de datos'));
} else {
    return done(null, false, req.flash('mensajeRegistro','Ha ocurrido un error'));
}
}
else {//Si la contraseña y la comprobación de la contraseña son distintos
    return done(null, false, req.flash('mensajeRegistro','Su clave no coincide'));
}

  
}));

//metodo serialize
//Es un método que recibe un usuario y regresar un done, en este devuelve un id unico que el navegador va a almacenar con el fin de que no tenga que logearte en cada pagina
passport.serializeUser(function(usuario, done) {

    done(null, usuario.correo_u);//null para error
    //Es como decir una vez autenticado vamos a guardar el id, en este caso el correo y no un error

});

// deserialize user 
////Método en el cual se recibe un id, en este caso el correo electrónico y se devuelve un done con el usuario que se encuentra autentificado
passport.deserializeUser( function( correo_u, done) {

    Usuarios.findOne({correo_u: correo_u}).then(function(usuario) {//Se realiza una busqueda en la tabla usaurios con el correo electrónico

        if (usuario) {

            done(null, usuario.get());//Si existe se toma y se devuelve con null para error

        } else {

            done(usuario.errors, null);//Sino se devuelve un error y null para usuario

        }

    });

});

//se usa el middleware passport, y se crea una nueva estrategia de autentificación local, tal como describe la documentación oficial en npm
passport.use('ingresar', new LocalStrategy({//Esta nueva estrategia es para ingresar y recibe un objeto y un callBack
    usernameField: 'correo',//los atributos que se utilizaran para la autentificación, con los nombres que se encuentre descritos en el formulario
    passwordField: 'clave',
    passReqToCallback: true //Para recibir el req en la funcion callBack
},

async function(req, correo, clave, done) {

//Recibe la información de req
   
    var compararContraseña = function(usuario, clave) {//Método de bcrypt.js para comparar la contraseña introducida con la almacenada en la base de datos

        var result = bcrypt.compareSync(clave, usuario.clave_u);
        return result; //Devuelve un true ó false dependiendo del caso

    };

 const usuario = await Usuarios.findOne({//Busqueda con el método sequelize para obtener un solo resultado
    attributes:[
        'correo_u',
        'tipo_u',
        'clave_u'
    ],
    where:{
        correo_u: correo.toLowerCase(),//Condición de busqueda
},
});

    

//Si no existe el usuario
if (!usuario){
    return done(null, false, req.flash('mensajeIngreso','El usuario no existe'));
}//Si la contraseña no coincide
else if (!compararContraseña(usuario, clave)){ 
    return done(null, false, req.flash('mensajeIngreso','Su contraseña ha sido ingresada de manera erronea')); 

} else if (usuario && compararContraseña(usuario, clave)) { //En caso de que la solicitud sea exitosa, existe el usuario y la contraseña enviada sea correcta
    return done(null, usuario, req.flash('mensajeIngreso','Usuario logeado satisfactoriamente'));
} else {

    return done(null, false, req.flash('mensajeIngreso','Ha ocurrido un error'));
}
  

}));
//Estrategia para que ingrese el bibliotecario.
passport.use('ingresarB', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {

//metodo para comprar la contraseña
   
    var compararContraseña = function(usuario, clave) {

        var result = bcrypt.compareSync(clave, usuario.clave_u);
        return result;

    };

 const usuario = await Usuarios.findOne({//Se realiza una busqueda para saber si el usuario existe
    attributes:[
        'correo_u',
        'tipo_u',
        'clave_u'
    ],
    where:{
        correo_u: correo.toLowerCase()
},
});



    


if (!usuario){//Si el usuario no existe
    return done(null, false, req.flash('mensajeIngreso','El usuario no existe'));
}

else if(usuario && usuario.tipo_u != 'bibliotecario'){//si el usuario existe pero no tiene el tipo de usuario "bibliotecario"
    return done(null, false, req.flash('mensajeIngreso','Usted no esta registrado como bibliotecario')); 
}
else if (!compararContraseña(usuario, clave)){ //Si la contraseña esta errónea
    return done(null, false, req.flash('mensajeIngreso','su contraseña ha sido ingresada de manera erronea')); 
}
else if (usuario && compararContraseña(usuario, clave)) { //En caso exitoso
    return done(null, usuario, req.flash('mensajeIngreso','Usuario logeado satisfactoriamente'));
} else {

    return done(null, false, req.flash('mensajeIngreso','Ha ocurrido un error'));
}
  

}));

//Estrategia para que ingrese el administrador.
passport.use('ingresarA', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {

//metodo para comprar la contraseña
   
    var compararContraseña = function(usuario, clave) {

        var result = bcrypt.compareSync(clave, usuario.clave_u);
        return result;

    };

 const usuario = await Usuarios.findOne({//Se realiza una busqueda para saber si el usuario existe
    attributes:[
        'correo_u',
        'tipo_u',
        'clave_u'
    ],
    where:{
        correo_u: correo.toLowerCase()
},
});


if (!usuario){//Si el usuario no existe
    return done(null, false, req.flash('mensajeIngreso','El usuario no existe'));
}

else if(usuario && usuario.tipo_u != 'administrador'){//si el usuario existe pero no tiene el tipo de usuario "administrador"
    return done(null, false, req.flash('mensajeIngreso','Usted no esta registrado como administrador')); 
}
else if (!compararContraseña(usuario, clave)){ //Si la contraseña esta errónea
    return done(null, false, req.flash('mensajeIngreso','su contraseña ha sido ingresada de manera errónea')); 
}
else if (usuario && compararContraseña(usuario, clave)) { //En caso exitoso
    return done(null, usuario, req.flash('mensajeIngreso','Usuario logeado satisfactoriamente'));
} else {

    return done(null, false, req.flash('mensajeIngreso','Ha ocurrido un error'));
}
  

}));

  //Estrategia para el registro del bibliotecario, solo se permite el registro de un usuario con este tipo de usuario
passport.use('registrarB', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {
   
    const { cedula, apellidos, nombres, claveControl} = req.body;

    if (clave == claveControl) {//en caso de que la clave y la comporbación de clave sean iguales

    var cifrarContraseña = function(clave) {//Método bcrypt.js para encriptar la clave

        return bcrypt.hashSync(clave, bcrypt.genSaltSync(10), null);//EL algoritmo de encriptamiento se realiza 10 veces a el string (clave) y se retorno con error null

    };

    const claveCifrada = cifrarContraseña(clave); //Se encripta la clave

    
    
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

const usuarioPas = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u'
    ],
    where:{
         pasaporte_u: cedula,
},
});


 const estudianteC = await Estudiantes.findOne({
    attributes:[
        'nombres',
        'apellidos',
        'cedula'
    ],
    where: {
    cedula: cedula,
},
});

const estudianteP = await Estudiantes.findOne({
    attributes:[
        'nombres',
        'apellidos',
        'pasaporte'
    ],
    where: {
    pasaporte: cedula,
},
});

//si no exite el usaurio registrado por correo electrónico o cédula pero esta registrado en la tabla estudiante
if (estudianteP || estudianteC){
    return done(null, false, req.flash('mensajeRegistro','Usted no puede ser el administrador por ser estudiante'));
}//Si el usuario no se encuentra en la base de datos como usuario ni por cedula ni por correo ni en la tabla estudiantes, entonces, se procede a la creación
else if (!usuarioCedula && !usuario  && !estudianteC && !estudianteP){
     let suscripcion = await Tipo_Suscripcion.findOne({
        where: {
            tipo_ts: 'premium'
        }
    });
    let fecha = new Date();
    let diaV = sumarDias(suscripcion.vigencia, fecha);
    const nuevoUsuario = await Usuarios.create({
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'bibliotecario',
        nombres_u: nombres.toLowerCase(),
        apellidos_u: apellidos.toLowerCase(),
        cedula_u: cedula,
        tipo_s: 'premium',
        estado_s: 'vigente',
        fecha_s: diaV
    });
  
    if (nuevoUsuario) {
        const suscripciones = await Suscripciones.create({
        tipo: 'premium',
        correo_s: correo.toLowerCase(),
        estado_s: 'vigente',
        fecha_c: diaV
    });
    } 
    
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como bibliotecario exitosamente')); 
}
else if (usuario){//Si el usuario se encuentra registrado por el mismo correo
    return done(null, false, req.flash('mensajeRegistro','Su correo electronico ya esta registrado'));
}
else if (usuarioCedula){//Si el usuario ya se encuentra registrado por la cédula
    return done(null, false, req.flash('mensajeRegistro','Su cédula ya se encuentra registrada. No puede registrarse con otro correo'));
} else if (usuarioPas){//Si el usuario ya se encuentra registrado por la cédula
    return done(null, false, req.flash('mensajeRegistro','Su pasaporte ya se encuentra registrada. No puede registrarse con otro correo'));
}
else {

    return done(null, false, req.flash('mensajeIngreso','Ha ocurrido un error'));
}


}
else {//Si la clave y la comprobación de clave no coinciden
        return done(null, false, req.flash('mensajeRegistro','Su clave no coincide'));
}
}));

  //Estrategia para el registro del administrador, solo se permite el registro de un usuario con este tipo de usuario
  passport.use('registrarA', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {
   
    const { cedula, apellidos, nombres, claveControl} = req.body;

    if (clave == claveControl) {//en caso de que la clave y la comporbación de clave sean iguales

    var cifrarContraseña = function(clave) {//Método bcrypt.js para encriptar la clave

        return bcrypt.hashSync(clave, bcrypt.genSaltSync(10), null);//EL algoritmo de encriptamiento se realiza 10 veces a el string (clave) y se retorno con error null

    };

    const claveCifrada = cifrarContraseña(clave); //Se encripta la clave

    
    
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

const usuarioPas = await Usuarios.findOne({
    attributes:[
        'correo_u',
        'tipo_u'
    ],
    where:{
         pasaporte_u: cedula,
},
});


 const estudianteC = await Estudiantes.findOne({
    attributes:[
        'nombres',
        'apellidos',
        'cedula'
    ],
    where: {
    cedula: cedula,
},
});

const estudianteP = await Estudiantes.findOne({
    attributes:[
        'nombres',
        'apellidos',
        'pasaporte'
    ],
    where: {
    pasaporte: cedula,
},
});

//si no exite el usaurio registrado por correo electrónico o cédula pero esta registrado en la tabla estudiante
if (estudianteP || estudianteC){
    return done(null, false, req.flash('mensajeRegistro','Usted no puede ser el administrador por ser estudiante'));
}//Si el usuario no se encuentra en la base de datos como usuario ni por cedula ni por correo ni en la tabla estudiantes, entonces, se procede a la creación
else if (!usuarioCedula && !usuario  && !estudianteC && !estudianteP){
     let suscripcion = await Tipo_Suscripcion.findOne({
        where: {
            tipo_ts: 'premium'
        }
    });
    let fecha = new Date();
    let diaV = sumarDias(suscripcion.vigencia, fecha);
    const nuevoUsuario = await Usuarios.create({
        correo_u: correo.toLowerCase(),
        clave_u: claveCifrada,
        tipo_u: 'administrador',
        nombres_u: nombres.toLowerCase(),
        apellidos_u: apellidos.toLowerCase(),
        cedula_u: cedula,
        tipo_s: 'premium',
        estado_s: 'vigente',
        fecha_s: diaV
    });
  
    if (nuevoUsuario) {
        const suscripciones = await Suscripciones.create({
        tipo: 'premium',
        correo_s: correo.toLowerCase(),
        estado_s: 'vigente',
        fecha_c: diaV
    });
    } 
    
    return done(null, nuevoUsuario, req.flash('mensajeRegistro','usuario creado como administrador exitosamente')); 
}
else if (usuario){//Si el usuario se encuentra registrado por el mismo correo
    return done(null, false, req.flash('mensajeRegistro','Su correo electronico ya esta registrado'));
}
else if (usuarioCedula){//Si el usuario ya se encuentra registrado por la cédula
    return done(null, false, req.flash('mensajeRegistro','Su cédula ya se encuentra registrada. No puede registrarse con otro correo'));
} else if (usuarioPas){//Si el usuario ya se encuentra registrado por la cédula
    return done(null, false, req.flash('mensajeRegistro','Su pasaporte ya se encuentra registrada. No puede registrarse con otro correo'));
}
else {

    return done(null, false, req.flash('mensajeIngreso','Ha ocurrido un error'));
}


}
else {//Si la clave y la comprobación de clave no coinciden
        return done(null, false, req.flash('mensajeRegistro','Su clave no coincide'));
}
}));
//Estrategia para el cambio de clave en caso de olvidó o perdida
passport.use('cambioClave', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave',
    passReqToCallback: true
},

async function(req, correo, clave, done) {
   //Se requiere del body unicamente la clave de comprobación 
    const claveControl = req.body.claveControl;
    
   

    if (clave == claveControl) {//Si la clave y la comprobación de clave son iguales

    var cifrarContraseña = function(clave) {//Método de bcrypt.js para encriptar la clave

        return bcrypt.hashSync(clave, bcrypt.genSaltSync(10), null);//Recibe string a encriptar, número de veces que se realizara la encriptación y null para error

    };

    const claveCifrada = cifrarContraseña(clave);//Se encripta la clave

    const usuario = await Usuarios.findOne({
     
        where: {
             correo_u: correo.toLowerCase()
    },
});
 if (usuario) {
       const actualizado = await Usuarios.update({//Método de sequelize para realizar una actualización en algún registro
            clave_u: claveCifrada
    },{
        where: {
            correo_u: correo.toLowerCase()
        }
        });


const nuevoUsuario = await Usuarios.findOne({//Se realiza la busqueda del usuario editado
    where: {
        correo_u: correo.toLowerCase()   
} 
});
//Se retorna el usuario y el mensaje a traves del middleware connect-flash.js
    return done(null, nuevoUsuario, req.flash('mensajeRecuperacion','Clave cambiada exitosamente'));
}

else {//
    return done(null, false, req.flash('mensajeRecuperacion','Su correo no corresponde a las respuestas de seguridad que suministro'));
}


    }
else {
        return done(null, false, req.flash('mensajeRecuperacion','Su clave no coincide'));
}
}));
  