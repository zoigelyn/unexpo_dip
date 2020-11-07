const Usuarios = require('../models/usuarios');
const Estudiantes = require('../models/estudiantes');
const Preguntas = require('../models/preguntas');
const Respuestas = require('../models/respuestas');

module.exports.existeCorreo = async function (req, res, next){
  console.log(req.body);
const correo = req.body.correo.toLowerCase();
const usuario = await Usuarios.findOne({
  where: {
    correo_u: correo
  }
});
if (!usuario) {
  res.send(false);  
}else{
res.send(true);
}

};

module.exports.isAuthenticated = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/index');
};

module.exports.isAuthenticatedAjax = function (req, res, next) {
  
  if (req.isAuthenticated()) {
    return next();
  }else{
  
  }
};

module.exports.existeUsuario = async function (req, res, next){
  
  console.log(req.body);
  const { correo } = req.body.correo;
  const usuario = await Usuarios.findOne({
    where: {
      correo_u: correo.toLowerCase()
    }
  });
  if (!usuario) {
    //res.text('su correo no existe');
    res.html(`<a>Su correo no esta registrado</a>`);  
  }
};

module.exports.isNotAuthenticated = function isNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/role');
};

module.exports.searchUsers = async function searchUsers(req, res) {
    try {
      const books = await Usuarios.findAll({
        atributes: [
          "cota",
          "tipo_libro_bd",
          "autor",
          "tutor",
          "editorial",
          "titulo",
          "año",
          "volumen",
        ],
      });
      res.json({
        data: books,
      });
    } catch (error) {
      console.log(error);
      res.json({
        data: {},
        message: "ha ocurrido un error",
      });
    }
  };
  
  module.exports.entrar = async function entrar(request, response) {
    
    try {
      const fichaEliminada = await Fichas.destroy({
        where: busqueda
      });
      if (fichaEliminada) {            
        response.render('card',{
          titulo: 'ficha eliminada',
          texto: 'reservada se ha eliminado',
          bandera: 3
         });
      }
    } catch (error) {
      console.log(error);
      response.json({
        message: "ha fallado la eliminacion",
      });
    }
  };

  module.exports.seguridad = async function seguridad(req, res, next) {

    
    try {
    const respuestas = await Respuestas.findAll({
      where:{
        correo_r: req.session.passport.user
      },
    });
    if (respuestas.length < 10 && respuestas.length > 0){
      res.redirect('/respuesta');
    }
    else if (respuestas.length == 0) {
      res.redirect('/seguridad');
    }
    else if (respuestas.length == 10) {
      next();
    }
  }catch(error){
    console.log(error);
  }
};

module.exports.respuestas = async function respuestas(req, res, next) {
  try{
  const preguntas = await Preguntas.findAll();
  res.render('respuestas', {
    titulo: 'Preguntas',
    preguntas: preguntas
  });

  }catch(error){
    console.log(error);
  }
  
};
module.exports.resSeguridad = async function resSeguridad(req, res, next) {
  const {r_1, r_2, r_3,r_4, r_5,r_6, r_7, r_8, r_9, r_10} = req.body;
  const correo = req.session.passport.user;
  
  const preguntas = await Preguntas.findAll();
  
  const resp = await Respuestas.bulkCreate([
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

  if (resp) {
    res.render('tarea-c',{
      titulo: 'Configuracion',
      mensaje: 'Su respuestas fueron guardadas satisfactoriamente'
    });
  }
};

module.exports.recuperar = async function recuperar(req, res, next) {
  try {
    var matriz = {};
    var m1, m2, m3, m4, m5 = 0;

     m1 = Math.floor(Math.random()*(9+1))+0;
    matriz[0] = m1;

     m2 = Math.floor(Math.random()*(9+1))+0
    while (m2 == m1){
     m2 = Math.floor(Math.random()*(9+1))+0
    }
    matriz[1] = m2;

    m3 = Math.floor(Math.random()*(9+1))+0
    while (m2 == m1 || m3 == m1 || m3 == m2){
      m3 = Math.floor(Math.random()*(9+1))+0
    }
    matriz[2] = m3;

    m4 = Math.floor(Math.random()*(9+1))+0
    while (m2 == m1 || m3 == m1 || m3 == m2 || m4 == m1 || m4 == m2 || m4 == m3){
      m4 = Math.floor(Math.random()*(9+1))+0
    }
    matriz[3] = m4;

    m5 = Math.floor(Math.random()*(9+1))+0
    while (m2 == m1 || m3 == m1 || m3 == m2 || m4 == m1 || m4 == m2 || m4 == m3 || m5 == m1 || m5 == m2 || m5 == m3 || m5 == m4){
      m5 = Math.floor(Math.random()*(9+1))+0
    }
    matriz[4] = m5;
    
  
    const preguntas = await Preguntas.findAll();
    if (res.locals.confirmacion) {
      var confirmacion = res.locals.confirmacion;
    }
    else {
      var confirmacion = 1;
    }
    
    console.log(confirmacion);
    if (preguntas) {
    res.render('recuperarC', {
      titulo: 'Recuperar',
      matriz: matriz,
      preguntas: preguntas,
      conf: confirmacion,
      correo: res.locals.correo
    });
    }
    
  }catch(error){
console.log(error);
  }
};

module.exports.comprobarU = async function (req, res, next) {
try {
  
  var correo = req.body.correo;

  const usuario = await Usuarios.findOne({
    where: {
      correo_u: correo.toLowerCase()
      
    }
  });

  const resp = await Respuestas.findOne({
    where:{
      correo_r: correo.toLowerCase()
    }
  });
  if (usuario && resp) {
    res.locals.correo = correo;
    res.locals.confirmacion = 2;
    next();
  }
  else if (!usuario){
    res.render('tarea', {
      titulo: 'Tarea fallida',
      mensaje: 'Usted no esta registrado',
      tarea: 'fallida'
    });
  }
  else if (usuario && !resp) {
    res.render('tarea', {
      titulo: 'Tarea fallida',
      mensaje: 'Usted no registro sus preguntas de seguridad',
      tarea: 'fallida'
    });
  }
}catch(error){
  console.log(error);
}
};

module.exports.comprobarResp = async function (req, res, next) {

try {
  const { r_1, r_2, r_3, r_4, r_5} = req.body;
  const {id_1, id_2, id_3, id_4, id_5, correo} = req.query;

  
  

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
  console.log(r1, r2, r3, r4, r5);

  if (r1 && r2 && r3 && r4 && r5) {
    res.render('recuperarC',{
      titulo: 'Cambio de contraseña',
      conf: 3,
     correo: correo 
    });
  }
  else {
   res.render('tarea', {
     titulo: 'Culminación fallida',
     mensaje: 'Has respondido de manera errónea',
     tarea: 'fallida'
   });
    
  }
}catch(error) {
  console.log(error);
}
};
