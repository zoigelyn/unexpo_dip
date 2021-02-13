const Usuarios = require('../models/usuarios');
const Preguntas = require('../models/preguntas');
const ConfDiasLibros = require('../models/conf-dias-libros');
const Tipo_Usuario = require('../models/tipoUsuario');
const Tipo_Libro = require('../models/tipoLibro');
const Estado_Libro = require('../models/estadoLibro');
const Estado_Prestamo = require('../models/estadoPrestamo');
const { render } = require('ejs');
//listo vista de configuracion dias de prestamos en solicitud ajax
module.exports.vistaDiasPrestamo = async function (req, res, next) {
  try {
    const objeto = await ConfDiasLibros.findOne({//Se consulta con un metodo sequelize para devolver al cliente los límites actualmente establecidos
      where: {
        id_c: 1
      }
    });

    res.status(200).send({
      objeto: objeto
    });
  } catch (error) {
    res.status(500);
  }


};
//modifica dias de prestamo y limite de libros
module.exports.guardarConfDias = async function (req, res, next) {

  try {
    
    const { dias, libros } = req.body;
    
    const configurado = await ConfDiasLibros.update({//actualiza con método sequelize los límites establecidos
     dias_prestamo: dias,
      cantidad_libros: libros,
     }, {
       where: {
      id_c: 1
     } 
    });
  

     
    if (configurado) {
      res.status(200).send('guardado con exito');
    } else {
      res.send('');
    }
  } catch (error) {
    res.status(500);
  }
};
//guardar dias de prestamo y limite de libros
module.exports.guardarConf = async function (req, res, next) {

  try {
    const { dias, cantidad, unidad, multa } = req.body;
    const configurado = await ConfDiasLibros.create({// Crea en la base de datos los límites para el préstamo de libros
      dias_prestamo: dias,
      cantidad_libros: cantidad,
      multa: multa,
      unidad: unidad
      
    });

    if (configurado) {
      res.render('tarea', {//Se renderiza, en nuestro caso se usa el motor de plantillas ejs
        titulo: 'Configuracion',
        mensaje: 'Configuración completada satisfactoriamente',
        tarea: 'correcta'
      });
    } 
  } catch (error) {
    next(error);
  }
};


//función que verifica si el usuario que intenta acceder a la ruta esta autenticado y tiene como tipo de usuario "bibliotecario" sino lo redirecciona al login de configacion
module.exports.isAuthenticatedAdmin = async function (req, res, next) {
  try {
    if (req.isAuthenticated()) {//Método que me proporciona el middleware passport.js para validar si un usuario está ó no autenticado
      let bibliotecario = await Usuarios.findOne({
        where: {
          correo_u: req.session.passport.user,
          tipo_u: 'bibliotecario'
        }
      });
      if (bibliotecario) {//Si esta autenticado y tiene como tipo de usuario "bibliotecario", entonces procede
        return next();
      } else {
        res.redirect('/loginConfig');//Si no es el bibliotecario redireccionar al inicio
      }

    }
    res.redirect('/loginConfig');//Sino esta autenticado redirecciona al inicio

  } catch (error) {
    next(error);
  }
};

//Función que verifica que el usuario no este autentificado
module.exports.isNotAuthenticatedAdmin = async function (req, res, next) {
 try {
  if (!req.isAuthenticated()) {//Método que me proporciona el middleware passport.js para validar si un usuario está ó no autenticado
    return next();

   

  } else {
     res.redirect('/loginConfig');//Sino esta autenticado redirecciona al inicio del área del configuración
  }
 
 } catch (error) {
   next(error);
 }
};
//Función que existe en la base de datos un usuario con el tipo de usuario bibliotecario
module.exports.existeBibliotecario = async function (req, res, next) {

  const usuario = await Usuarios.findOne({
    where: {
      tipo_u: 'bibliotecario'
    }
  })
  if (usuario) {
    res.redirect('/existenP');
  }
  res.redirect('/e-b-245-43');
};
//Verifica que el exista en la base de datos las preguntas de configuraciónn que serán usadas para el restablecimiento de contraseña
module.exports.existeP = async function (req, res, next) {
  try {
    const usuarioLogeado = await Usuarios.findOne({ where: { correo_u: req.session.passport.user } });


    const existePregunta = await Preguntas.findAll();

    if (usuarioLogeado.tipo_u == 'bibliotecario' && existePregunta.length == 0) {
      res.redirect('/preguntas');
    }
    else if (usuarioLogeado.tipo_u == 'bibliotecario' && existePregunta.length == 10) {
      res.redirect('/preguntasCreadas');
    }
    else if (usuarioLogeado.tipo_u != 'bibliotecario') {
      res.redirect('/');
    }
    else if (usuarioLogeado.tipo_u == 'bibliotecario' && existePregunta.length < 10 && existePregunta.length > 0) {
      res.redirect('/unaPregunta');
    }
  } catch (error) {
    next(error);
  }
};
//Función en la que se almacenan las preguntas de seguridad en la base de datos
module.exports.ingresoPreguntas = async function (req, res, next) {
  const { pregunta_1, pregunta_2, pregunta_3, pregunta_4, pregunta_5, pregunta_6, pregunta_7, pregunta_8, pregunta_9, pregunta_10 } = req.body;
  try {
    const preguntasCreadas = await Preguntas.bulkCreate([
      { pregunta: '¿ ' + pregunta_1.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_2.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_3.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_4.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_5.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_6.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_7.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_8.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_9.toLowerCase() + ' ?' },
      { pregunta: '¿ ' + pregunta_10.toLowerCase() + ' ?' },
    ])
    if (preguntasCreadas) {

      next();
    }
  } catch (error) {
    next(error);
  }
};
//Función en la que se almacena una pregunta faltante en la base de datos
module.exports.unaPregunta = async function (req, res, next) {
  const { pregunta_1 } = req.body;
  try {
    const preguntasCreadas = await Preguntas.create(
      { pregunta: '¿ ' + pregunta_1.toLowerCase() + ' ?' }
    );
    if (preguntasCreadas) {

      next();
    }
  } catch (error) {
    next(error);
  }
};
//Se renderiza a preguntasCreadas.ejs
module.exports.mostrarPreguntas = async function (req, res, next) {
  const preguntas = await Preguntas.findAll();

  res.render('preguntasCreadas', {
    titulo: 'Preguntas',
    preguntas: preguntas
  });
};
//Se elimina una pregunta y inmediatamente se renderiza para almacenar en la base de datos la pregunta faltante
module.exports.eliminarPregunta = async function (req, res, next) {

  const { id } = req.query;
  try {
    const preguntaEliminada = await Preguntas.destroy({
      where: {
        id_p: id
      },
    });
    if (preguntaEliminada) {
      res.render('unaPregunta', {
        titulo: 'Pregunta',
        preguntaEliminada: preguntaEliminada
      });

    };

  } catch (error) {
    next(error);
  }
};
//Se renderiza al registro del bibliotecario
module.exports.vistaRegistroB = function (req, res, next) {

  res.render('bibliotecario', {
    titulo: 'Registro'
  });

};
//Se renderiza al registro de preguntas
module.exports.vistaRegistroP = function (req, res, next) {
  res.render('preguntas', {
    titulo: 'Preguntas'
  });
};
//Se renderiza a la vista para el ingreso del bibliotecario
module.exports.vistaIngresoB = function (req, res, next) {
  res.render('ingresarConfig', {
    titulo: 'Configuración'
  });
};
//Se renderiza a la plantilla unaPregunta.ejs
module.exports.vistaPreguntaUnica = function (req, res, next) {
  res.render('unaPregunta', {
    titulo: 'Pregunta',
    preguntaEliminada: ''
  });
};
//Se renderiza a la plantilla tarea.ejs
module.exports.vistaTareaCompleta = function (req, res, next) {
  res.render('tarea', {
    titulo: 'Configuracion completa',
    mensaje: 'Configuracion completada satisfactoriamente',
    tarea: 'correcta'
  });
};
//Crea en la base de datos los tipos de usuarios permitidos
module.exports.crearTipoU = async function (req, res, next) {

  try {
    let existe = await Tipo_Usuario.findAll();
    if (existe.length == 0) {
      const creado = await Tipo_Usuario.bulkCreate([{
      tipo_tu: 'docente',
      descripcion_tu: 'Docente que se encuentra actualmente activo'
    },
    {
      tipo_tu: 'estudiante',
      descripcion_tu: 'Estudiante que se encuentra actualmente activo'
    },
    {
      tipo_tu: 'lector',
      descripcion_tu: 'Cualquier usuario'
    },
    {
      tipo_tu: 'bibliotecario',
      descripcion_tu: 'administrador de la aplicación'
    }]);


    if (creado) {
      console.log('Cargada la información inicial TU');
      next();
    }
    } else {
      next();
    }
    
  } catch (error) {
    // console.log(error)
    
     next(error);
  }
};
//Crea en la base de datos los tipos de libros permitidos 
module.exports.crearTipoL = async function (req, res, next) {

  try {
let existe = await Tipo_Libro.findAll();
if (existe.length == 0) {
  const creadoB = await Tipo_Libro.bulkCreate([{
      tipo_tl: 'libro',
      descripcion_tl: 'libro'
    }, {
      tipo_tl: 'revista',
      descripcion_tl: 'revista'
    },
    {
      tipo_tl: 'trabajo de grado',
      descripcion_tl: 'trabajo de grado'
    }]);

    if (creadoB) {
      console.log('Cargada la información inicial TL');
      next();

    }
} else {
  next();
}
    
  } catch (error) {
    //  console.log(error)
    
    next(error);
  }
};
//Crea en la base de datos los estados de libro permitidos
module.exports.crearEstadoL = async function (req, res, next) {

  try {
let existe = await Estado_Libro.findAll();

if (existe.length == 0) {
 const creadoC = await Estado_Libro.bulkCreate([{
      estado_el: 'disponible',
      descripcion_el: 'Libro que se encuentra en préstamo ni reservado'
    },
    {
      estado_el: 'no disponible',
      descripcion_el: 'Libro que no se encuentra en préstamo ni reservado'
    }]);


    if (creadoC) {
      console.log('Cargada la información inicial EL');
      next();
    }
  
} else {
  next();
}
   } catch (error) {
     next(error);
    //console.log(error)
  }
};
//Crea en la base de datos los estados de préstamos perimitidos
module.exports.crearEstadoP = async function (req, res, next) {

  try {
let existe = await Estado_Prestamo.findAll();
if ( existe.length == 0) {
   const creadoD = await Estado_Prestamo.bulkCreate([{
      estado_ep: 'vigente',
      descripcion_ep: 'préstamo que se encuentra activo y a tiempo'
    }, {
      estado_ep: 'vencido',
      descripcion_ep: 'préstamo que no se encuentra activo y a tiempo'
    }, {
      estado_ep: 'pendiente',
      descripcion_ep: 'reservación que se encuentra activo y a tiempo'
    }, {
      estado_ep: 'entregado',
      descripcion_ep: 'préstamo terminado'
    }]);


    if (creadoD) {
      console.log('Cargada la información inicial EP');
      next();

    }
} else {
  next();
}
   
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
//Vista del formulario para configurar los dias de préstamos y la cantidad límite de libros para retirar
module.exports.vistaConfDias = async function (req, res, next) {
  res.render('confDias', {
    titulo: 'Configuración'
  });
};


