const Usuarios = require('../models/usuarios');
const Preguntas = require('../models/preguntas');
const { render } = require('ejs');

module.exports.prueba = function prueba(req, res, next){
    
    res.render('tarea',{
        titulo: 'Bibliotecario',
        mensaje: 'Se ha registrado correctamente como bibliotecario',
        tarea: 'correcta'
       });

};



module.exports.isAuthenticatedAdmin = function isAuthenticatedAdmin(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/conf/loginConfig');
  };
 module.exports.isNotAuthenticatedAdmin = function isNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/conf/preguntas');
  };

module.exports.existeBibliotecario = async function existeBibliotecario(req, res, next) {

    const usuario = await Usuarios.findOne({
      where: {
        tipo_u: 'bibliotecario'
      }
    })
    if (usuario) {
      res.redirect('/conf/existenP');
    }
    res.redirect('/conf/e-b-245-43');
  };

module.exports.existeP = async function existeP(req, res, next){
  try {
  const usuarioLogeado = await Usuarios.findOne({where: {correo_u: req.session.passport.user}});

  
  const existePregunta = await Preguntas.findAll();
if (usuarioLogeado.tipo_u == 'bibliotecario' && existePregunta.length == 0){
      res.redirect('/conf/preguntas');
  }
  else if(usuarioLogeado.tipo_u == 'bibliotecario' && existePregunta.length == 10)
  {
      res.redirect('/conf/preguntasCreadas');
  }
  else if(usuarioLogeado.tipo_u != 'bibliotecario')
  {
      res.redirect('/index/');
  }  
  else if(usuarioLogeado.tipo_u == 'bibliotecario' && existePregunta.length < 10 && existePregunta.length > 0)
  {
      res.redirect('/conf/unaPregunta');
  }
} catch(error){
console.log(error);
}
};

module.exports.ingresoPreguntas = async function ingresoPreguntas(req, res, next) {
  const {pregunta_1, pregunta_2, pregunta_3, pregunta_4, pregunta_5, pregunta_6, pregunta_7, pregunta_8, pregunta_9, pregunta_10} = req.body;
try{
  const preguntasCreadas = await Preguntas.bulkCreate([
    {pregunta: '¿ ' + pregunta_1.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_2.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_3.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_4.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_5.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_6.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_7.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_8.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_9.toLowerCase() + ' ?'},
    {pregunta: '¿ ' + pregunta_10.toLowerCase() + ' ?'},
  ])
  if (preguntasCreadas) {
   
    next();
  }
}catch(error){
  console.log(error);
}
};

module.exports.unaPregunta = async function unaPregunta(req, res, next) {
  const {pregunta_1} = req.body;
try{
  const preguntasCreadas = await Preguntas.create(
    {pregunta: '¿ ' + pregunta_1.toLowerCase() + ' ?'}
  );
  if (preguntasCreadas) {
   
    next();
  }
}catch(error){
  console.log(error);
}
};

module.exports.mostrarPreguntas = async function mostrarPreguntas(req, res, next){
  const preguntas = await Preguntas.findAll();
  console.log(preguntas.length);
  res.render('preguntasCreadas',{
    titulo: 'Preguntas',
    preguntas: preguntas
  });
};

module.exports.eliminarPregunta = async function eliminarPregunta(req, res, next){

  const {id} = req.query;
  try{
  const preguntaEliminada = await Preguntas.destroy({
    where: {
      id_p: id
    },
  });
  if (preguntaEliminada){
    res.render('unaPregunta', {
      titulo: 'Pregunta',
      preguntaEliminada: preguntaEliminada
    });
    
    };
  
}catch(error){
  console.log(error);
}
};

module.exports.vistaRegistroB = function (req, res, next) {

    res.render('bibliotecario',{
        titulo: 'Registro'
       });

};
module.exports.vistaRegistroP = function (req, res, next) {
  res.render('preguntas', {
    titulo: 'Preguntas'
});
};
module.exports.vistaIngresoB = function (req, res, next) {
  res.render('ingresarConfig',{
    titulo: 'Configuración'
});
};
module.exports.vistaPreguntaUnica = function (req, res, next) {
  res.render('unaPregunta', {
    titulo: 'Pregunta',
    preguntaEliminada:''
  });
};
module.exports.vistaTareaCompleta = function (req, res, next) {
  res.render('tarea', {
    titulo: 'Configuracion completa',
    mensaje: 'Configuracion completada satisfactoriamente',
    tarea: 'correcta'
});
};
module.exports.logoutConfig = function (req, res, next) {
  req.logout();
    res.redirect('/conf/prueba-c');
};



