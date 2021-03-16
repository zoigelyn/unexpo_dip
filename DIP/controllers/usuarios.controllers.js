const Usuarios = require('../models/usuarios');
const Preguntas = require('../models/preguntas');
const Respuestas = require('../models/respuestas');
//funcion con la que se realiza una consulta al momento del usuario ingresar el correo electronico, esto con el fin de consultar si existe en la base de datos
module.exports.existeCorreo = async function (req, res, next){
 
const correo = req.body.correo.toLowerCase();//Se requiere del body y se convierne en minúsculas
try {
  const usuario = await Usuarios.findOne({//Se realiza una busqueda con un limite de resultado de uno y se almacena en una constante
    where: {
      correo_u: correo//con el correo recibido como condición
    }
  });
  if (!usuario) {//si no existe se devuelve un false y el codigo de estatus 200
    res.status(200).send(false);  
  }else{
  res.status(200).send(true);// sino se devuelve un true y el mismo codigo de estatus
  }
} catch (error) {//en caso de error
 next(error);//no se envia mensaje porque ya se tiene configurado en la respuesta fallida de la solicitud ajax
}

};
//función que redirecciona al inicio de bliotecario o al inicio de usuario según sea el caso
module.exports.roles =  async function (req, res, next) {

 try {
  const usuarioLogeado = await Usuarios.findOne({where: {correo_u: req.session.passport.user}});//consulto la información del usuario logeado
  
  req.session.usuarioL = usuarioLogeado; //almaceno la información del usuario logeado en la sesión gracias al objeto req.session que me proporciona el middleware express-session.js
  
if (usuarioLogeado.tipo_u == 'lector' || usuarioLogeado.tipo_u == 'estudiante' || usuarioLogeado.tipo_u == 'docente')//Si el usuario es tipo de usuario "lector", "docente" y "estudiante"
{ 
  res.redirect('/usuario');
}
else if (usuarioLogeado.tipo_u == 'bibliotecario'){//Si el usuario es tipo de usuario "bibliotecario"
   
  res.redirect('/bibliotecario');
  
}
 } catch (error) {
   next(error);
 }
};
//función que renderiza la ruta a la plantillas admin.ejs
module.exports.vistaB = function (req, res, next) {
 try {
  if (req.session.usuarioL.tipo_u === 'bibliotecario') {//Si el tipo de usuario es "bibliotecario"
  res.render('admin', {//nombre de la plantilla, estoy usando el motor de plantilla
      titulo: 'Inicio',
      usuarioL: req.session.usuarioL
  });
}
 } catch (error) {
   next(error);
 }
};
//función que renderiza al inicio de usuario, plantilla inicioUsuario.ejs
module.exports.vistaU = function (req, res, next) {
  try {
    res.render('inicioUsuario',{
      titulo: 'Inicio',
      usuarioL: req.session.usuarioL
     });
    
  } catch (error) {
    next(error);
  }
};
//Función que verifica que el usuario este autenticado
module.exports.isAuthenticated = function isAuthenticated(req, res, next) {
 try {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
 } catch (error) {
   next(error);
 }
};
//función que verifica si el usuario que intenta acceder a la ruta esta autenticado y tiene como tipo de usuario "bibliotecario"
module.exports.isAuthenticatedB = async function(req, res, next) {
 try {
  if (req.isAuthenticated()) {//Método que me proporciona el middleware passport.js para validar si un usuario está ó no autenticado
    let bibliotecario = await Usuarios.findOne({
      where: {
        correo_u: req.session.passport.user,
        tipo_u: 'bibliotecario'
      }
    });
    if (bibliotecario){//Si esta autenticado y tiene como tipo de usuario "bibliotecario", entonces procede
      return next();
    } else {
      res.redirect('/');//Si no es el bibliotecario redireccionar al inicio
    }
    
  }
  res.redirect('/');//Sino esta autenticado redirecciona al inicio

 } catch (error) {
   next(error);
 } 
 };
//función que verifica si el usuario que intenta acceder a la ruta esta autenticado y tiene como tipo de usuario "bibliotecario" pero para solicitudes ajax
module.exports.isAuthenticatedBAjax = async function(req, res, next) {
  let bibliotecario = null;
  if (req.isAuthenticated()) {
     bibliotecario = await Usuarios.findOne({
      where: {
        correo_u: req.session.passport.user,
        tipo_u: 'bibliotecario'
      }
    });
  }
    if (bibliotecario && req.isAuthenticated()){
      return next();
    } else if (req.isAuthenticated() && !bibliotecario) {
      res.status(401).send({
        message: "Solo tiene acceso el bibliotecario."
      });
    } else {
      res.status(403).send({
        message: "Debes ingresar en tu cuenta."
      });
    }
    
  
  res.redirect('/');
};
//Función que verifica que el usuario este autenticado
module.exports.isAuthenticatedAjax = function (req, res, next) {
  
  if (req.isAuthenticated()) {
    return next();
  }else{
  res.status(403).send({
    message: "Debes volver a logearte."
  })
  }
};
//Función que verifica que no exista usuario autenticado
module.exports.isNotAuthenticated = function (req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return next();
    } else {
     res.redirect('/role'); 
    }
    
  } catch (error) {
  next(error);  
  }
};
//Función que renderiza a la plantilla recuperarC.ejs para el restablecimiento de contraseña
module.exports.vistaR = function (req, res, next) {
 try {
  res.render('recuperarC', {
    titulo: 'Recuperacion',
    conf: 1
});
 } catch (error) {
   next(error);
 }
};

//funcion que tiene la finalidad de redirecionar si no se encuentran configuradas las preguntas de seguridad para el restablecimiento de contraseña en caso de olvido
  module.exports.seguridad = async function (req, res, next) {//función asincrona para hacer uso del operador await

    try {
    const respuestas = await Respuestas.findAll({//se buscan todas las respuestan que se encuentre asociadas al correo electronico
      where:{
        correo_r: req.session.passport.user//La autentificación me brinda un objeto en el que se almacena el correo del usuario debido a que es este el que se encuentra configurado en el middleware de autentificación
      },
    });
   
     if (respuestas.length == 0) {// Si no existe ninguna pregunta configurada
      res.redirect('/seguridad');
    }
    else if (respuestas.length == 10) {//Si se encuentran todas las preguntas configuradas
      next();
    }
  } catch(error) {//En caso de error
    
    next(error);
  }
};
//función que consulta las preguntas configuradas por el bibliotecario para ser respondidas por seguridad
module.exports.respuestas = async function (req, res, next) {
  try{
  const preguntas = await Preguntas.findAll();//Se consultan las preguntas que configuro anteriormente el bibliotecario
  res.render('respuestas', {//se envia la respuesta a una motor de plantilla
    titulo: 'Preguntas',
    preguntas: preguntas
  });

  }catch(error){// en caso de error
  error.mensaje = "Error al consultar";
  next(error);
  }
  
};
//función donde se almacenan en la base de datos las respuestas a las preguntas de seguridad
module.exports.resSeguridad = async function (req, res, next) {
  const {r_1, r_2, r_3,r_4, r_5,r_6, r_7, r_8, r_9, r_10} = req.body;//se requiere del body las respuestas a la preguntas de seguridad
  const correo = req.session.passport.user;// el correo del usuario que tiene sesión iniciada
  try {
    
  const preguntas = await Preguntas.findAll(); //Preguntas de seguridad configuradas por el bibliotecario, se utiliza el metodo de consulta de sequelize y el resultado es almacenada.
  
  const resp = await Respuestas.bulkCreate([//Se crea por lote, en la tabla resouestas la respuesta a cada pregunta con el correo del usuario que las configuro
    {id_pr: preguntas[0].id_p,
    respuesta: r_1.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[1].id_p,
    respuesta: r_2.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[2].id_p,
    respuesta: r_3.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[3].id_p,
    respuesta: r_4.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[4].id_p,
    respuesta: r_5.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[5].id_p,
    respuesta: r_6.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[6].id_p,
    respuesta: r_7.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[7].id_p,
    respuesta: r_8.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[8].id_p,
    respuesta: r_9.toLowerCase(),
  correo_r: correo },
  {id_pr: preguntas[9].id_p,
    respuesta: r_10.toLowerCase(),
  correo_r: correo },
  ]);

  if (resp) {//Si se crea por lote exitosamente
    res.render('tarea',{//la respuesta se envia al motor de plantillas ejs
      titulo: 'Configuracion',
      mensaje: 'Su respuestas fueron guardadas satisfactoriamente',
      tarea: "correcta"
    });
  }
  } catch (error) {
  error.mensaje = "";
  next(error);  
  }
  
};
//Función que genera una matriz de valores unicos y renderiza la matriz y las preguntas para el restablecimiento de la contraseña
module.exports.recuperar = async function (req, res, next) {
  try {
    var matriz = {};
    var m1, m2, m3, m4, m5 = 0;
    let confirmacion;

     m1 = Math.floor(Math.random()*(9+1)); //floor y random son métodos del objeto Math
    matriz[0] = m1;

     m2 = Math.floor(Math.random()*(9+1));
    while (m2 == m1){
     m2 = Math.floor(Math.random()*(9+1));
    }
    matriz[1] = m2;

    m3 = Math.floor(Math.random()*(9+1));
    while (m2 == m1 || m3 == m1 || m3 == m2){
      m3 = Math.floor(Math.random()*(9+1));
    }
    matriz[2] = m3;

    m4 = Math.floor(Math.random()*(9+1));
    while (m2 == m1 || m3 == m1 || m3 == m2 || m4 == m1 || m4 == m2 || m4 == m3){
      m4 = Math.floor(Math.random()*(9+1));
    }
    matriz[3] = m4;

    m5 = Math.floor(Math.random()*(9+1));
    while (m2 == m1 || m3 == m1 || m3 == m2 || m4 == m1 || m4 == m2 || m4 == m3 || m5 == m1 || m5 == m2 || m5 == m3 || m5 == m4){
      m5 = Math.floor(Math.random()*(9+1));
    }
    matriz[4] = m5;
    
  
    const preguntas = await Preguntas.findAll();//Se consultan las preguntas
    if (res.locals.confirmacion) {
       confirmacion = res.locals.confirmacion;//Variable que me indica en que parte del restablecimiento me encuentro
       //se utiliza res.locals el cual es un objeto que tiene vigencia solo en la ruta utlizada
    }
    else {
       confirmacion = 1;
    }
    
    if (preguntas) {//Si se ejecutó la consulta con éxito
    res.render('recuperarC', {
      titulo: 'Recuperar',
      matriz: matriz,
      preguntas: preguntas,
      conf: confirmacion,
      correo: res.locals.correo
    });
    }
    
  }catch(error){
error.mensaje = "Error consultando las preguntas";
next(error);
  }
};
//Función que comprueba que el usuario existe y tenga las preguntas de seguridad configuradas
module.exports.comprobarU = async function (req, res, next) {
 
  const correo = req.body.correo;
  try {

  const usuario = await Usuarios.findOne({//Se consulta si el correo ingresado pertenece a un usuario
    where: {
      correo_u: correo.toLowerCase()
      
    }
  });

  const resp = await Respuestas.findOne({//Se consulta si el usuario tiene configuradas las preguntas de seguridad
    where:{
      correo_r: correo.toLowerCase()
    }
  });
  if (usuario && resp) {//Si el usuaario existe y tiene configuradas las preguntas de seguridad, procede a la siguiente función
    res.locals.correo = correo; //res.locals es un objeto que puede almacenar variables que perduran unicamente en la ruta que se ejecuta.
    res.locals.confirmacion = 2;
    next();
  }
  else if (!usuario) {//Si no se encuentra registrado, se renderiza a tarea.ejs
    res.render('tarea', {
      titulo: 'Tarea fallida',
      mensaje: 'Usted no esta registrado',
      tarea: 'fallida'
    });
  }
  else if (usuario && !resp) {//Si existe el usuario pero no tiene configuradas las preguntas de seguridad
    res.render('tarea', {
      titulo: 'Tarea fallida',
      mensaje: 'Usted no registro sus preguntas de seguridad',
      tarea: 'fallida'
    });
  }
}catch(error){//En caso de error
  error.mensaje = "Error al comprobar si el usuario existe"
next(error);
}
};
//Función que comprueba que las respuestas son correctas
module.exports.comprobarResp = async function (req, res, next) {

try {
  const { r_1, r_2, r_3, r_4, r_5} = req.body;
  const {id_1, id_2, id_3, id_4, id_5, correo} = req.query;
//Se consulta cada respuesta con su pregunta relacionada
  const r1 = await Respuestas.findOne({
    where: {
      correo_r: correo.toLowerCase(),
      id_pr: id_1,
      respuesta: r_1.toLowerCase() 
    }
  });
  const r2 = await Respuestas.findOne({
    where: {
      correo_r: correo.toLowerCase(),
      id_pr: id_2,
      respuesta: r_2.toLowerCase()
    }
  });
  const r3 = await Respuestas.findOne({
    where: {
      correo_r: correo.toLowerCase(),
      id_pr: id_3,
      respuesta: r_3.toLowerCase() 
    }
  });
  const r4 = await Respuestas.findOne({
    where: {
      correo_r: correo.toLowerCase(),
      id_pr: id_4,
      respuesta: r_4.toLowerCase() 
    }
  });
  const r5 = await Respuestas.findOne({
    where: {
      correo_r: correo.toLowerCase(),
      id_pr: id_5,
      respuesta: r_5.toLowerCase() 
    }
  });

//Si existe cada consulta entonces cada respuesta es correcta
  if (r1 && r2 && r3 && r4 && r5) {
    res.render('recuperarC',{//Se renderiza a la plantilla recuperarC.ejs
      titulo: 'Cambio de contraseña',
      conf: 3,
     correo: correo 
    });
  }
  else {
   res.render('tarea', {//Se renderiza a la plantilla tarea.ejs
     titulo: 'Culminación fallida',
     mensaje: 'Has respondido de manera errónea',
     tarea: 'fallida'
   });
    
  }
}catch(error) {
 error.mensaje = "Error al consultar las respuestas"
 next(error);
}
};
