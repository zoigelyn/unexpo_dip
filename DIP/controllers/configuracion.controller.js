const Usuarios = require('../models/usuarios');
const Preguntas = require('../models/preguntas');
const ConfDiasLibros = require('../models/conf-dias-libros');
const Tipo_Usuario = require('../models/tipoUsuario');
const Tipo_Libro = require('../models/tipoLibro');
const Estado_Libro = require('../models/estadoLibro');
const Estado_Prestamo = require('../models/estadoPrestamo');
const Respuestas = require ('../models/respuestas');
const { render } = require('ejs');
const Tipo_Suscripcion = require('../models/tipoSuscripcion');
const Tipo_Nucleo = require('../models/tipoNucleo');
const Tipo_Categoria = require('../models/tipoCategoria');
const Libros = require('../models/libros');
const { Op } = require("sequelize");
//listo vista de configuracion dias de prestamos en solicitud ajax
module.exports.vistaDiasPrestamo = async function (req, res, next) {
  try {
    const objeto = await ConfDiasLibros.findOne();//Se consulta con un metodo sequelize para devolver al cliente los límites actualmente establecidos
     
    

    res.status(200).send({
      objeto: objeto
    });
  } catch (error) {
    res.status(500).json({
      message: 'ha ocurrido un error',
      data: {},
    });  
  }


};
// verifica unidad de nucleos
module.exports.unicidadNucleo = async function (req, res, next) {

  const dato = req.body.dato;
 try {
 const nucleo = await Tipo_Nucleo.findOne({
   where: {
     nucleo: dato
   }
 });
 if (nucleo){
   res.send('Núcleo ya registrado');
 
 }else if(dato == ' '){
 
   res.send('No se permiten registros vacíos');
 }else {
   res.send('');
 }
 }catch(error){
  res.status(500).json({
    message: 'ha ocurrido un error',
    data: {},
  });  
 }
 };

 // verifica unidad de categorias
module.exports.unicidadCategoria = async function (req, res, next) {

  const dato = req.body.dato;
 try {
 const categoria = await Tipo_Categoria.findOne({
   where: {
     categoria: dato
   }
 });
 if (categoria){
   res.send('Categoría ya registrado');
 
 }else if(dato == ' '){
 
   res.send('No se permiten registros vacíos');
 }else {
   res.send('');
 }
 }catch(error){
  res.status(500).json({
    message: 'ha ocurrido un error',
    data: {},
  });  
 }
 };
//modifica dias de prestamo y limite de libros
module.exports.guardarConfDias = async function (req, res, next) {

  try {
    
    const { dias, libros, multa, unidad} = req.body;
    let d, l, m, u;
    let ruta;
    
 const conf = await ConfDiasLibros.findOne();
 if (req.file) {//si existe req.file es porque se cargo en el servidor el archivo
      let nombre = req.file.filename;
       ruta = "/uploads/imgs/" + nombre;
    } else {
      ruta = conf.datos
    }
  
 if (dias) {
   d = parseInt(dias)
 } else {
   d = conf.dias_prestamo 
 }
 if (libros) {
   l = parseInt(libros)
 } else {
   l = conf.cantidad_libros
 }
 if (multa) {
   m = parseInt(multa)
 } else {
   m = conf.multa
 }
 if (unidad) {
   u = unidad
 } else {
   u = conf.unidad
 }
 
 let unDato = await ConfDiasLibros.findOne();
    const configurado = await ConfDiasLibros.update({//actualiza con método sequelize los límites establecidos
     dias_prestamo: d ,
      cantidad_libros: l,
      multa: m,
      unidad: u,
      datos: ruta,
     }, {
       where: {
      id_c: unDato.id_c
     } 
    });
  

     
    if (configurado) {
      res.status(200).send('guardado con exito');
    } else {
      res.send('');
    }
  } catch (error) {
    res.status(500).json({
      message: 'ha ocurrido un error',
      data: {},
    });  
  }
};
//guardar dias de prestamo y limite de libros
module.exports.guardarConf = async function (req, res, next) {

  try {
    const { dias, cantidad, unidad, multa} = req.body;
    let ruta;
    if (req.file) {//si existe req.file es porque se cargo en el servidor el archivo
      console.log(req.file);
      let nombre = req.file.filename;
       ruta = "/uploads/imgs/" + nombre;
    }
    let configurado;
    const configuracion = await ConfDiasLibros.findAll();
   
    if (configuracion.length != 0)
    {
      let unDato = await ConfDiasLibros.findOne();
       configurado = await ConfDiasLibros.update({
        dias_prestamo: parseInt(dias),
        cantidad_libros: parseInt(cantidad),
        multa: parseInt(multa),
        unidad: unidad.toLowerCase(),
        datos: ruta
        }, {
          where: {
         id_c: unDato.id_c
        } 
       }); 
    
    } else {
      configurado = await ConfDiasLibros.create({// Crea en la base de datos los límites para el préstamo de libros
      dias_prestamo: parseInt(dias),
      cantidad_libros: parseInt(cantidad),
      multa: parseInt(multa),
      unidad: unidad.toLowerCase(),
      datos: ruta
      
    }); 
    }
    
 const conf = await ConfDiasLibros.findOne();
    if (configurado) {
     res.redirect('/preguntasCreadas');
     
    } 
  } catch (error) {
    next(error);
  }
};
///
module.exports.solicitarDatos = async function (req, res, next) {
  try {
    let existe = await ConfDiasLibros.findOne();
    if (existe) {
    res.status(200).send(existe.datos);
      }
   } catch (error) {
     res.status(500).json({
       message: 'ha ocurrido un error',
       data: {},
     }); 
}
};
//
module.exports.vistaConfNucleos = async function (req, res, next) {
  try {
    res.render('confDias', {
      titulo: 'Configuración',
      mensaje: 'Configuración de núcleos'
    });
  } catch (error) {
    next(error);
  }
    
 
};

//función que verifica si el usuario que intenta acceder a la ruta esta autenticado y tiene como tipo de usuario "bibliotecario" sino lo redirecciona al login de configacion
module.exports.isAuthenticatedAdmin = async function (req, res, next) {
  try {
    if (req.isAuthenticated()) {//Método que me proporciona el middleware passport.js para validar si un usuario está ó no autenticado
      let administrador = await Usuarios.findOne({
        where: {
          correo_u: req.session.passport.user,
          tipo_u: 'administrador'
        }
      });
      if (administrador) {//Si esta autenticado y tiene como tipo de usuario "administrador", entonces procede
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
     res.redirect('/existenP');//Sino esta autenticado redirecciona al inicio del área del configuración
  }
 
 } catch (error) {
   next(error);
 }
};
//Función que existe en la base de datos un usuario con el tipo de usuario bibliotecario
module.exports.existeBibliotecario = async function (req, res, next) {
try {
  const usuario = await Usuarios.findOne({
    where: {
      tipo_u: 'bibliotecario'
    }
  })
  if (usuario) {
    res.redirect('/existenP');
  }
  next();
} catch (error) {
  next(error);
}
  
};
//Verifica que el exista en la base de datos las preguntas de configuraciónn que serán usadas para el restablecimiento de contraseña
module.exports.existeP = async function (req, res, next) {
  try {
    const usuarioLogeado = await Usuarios.findOne({ where: { correo_u: req.session.passport.user } });


    const existePregunta = await Preguntas.findAll();

    if (usuarioLogeado.tipo_u == 'administrador' && existePregunta.length == 0) {
      res.redirect('/preguntas');
    }
    else if (usuarioLogeado.tipo_u == 'administrador' && existePregunta.length == 10) {
      res.redirect('/preguntasCreadas');
    }
    else if (usuarioLogeado.tipo_u != 'administrador') {
      res.redirect('/');
    }
    else if (usuarioLogeado.tipo_u == 'administrador' && existePregunta.length < 10 && existePregunta.length > 0) {
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
  
try {
  let pregunta = await Preguntas.findAll();
  let confDias = await ConfDiasLibros.findOne();
  let tipoNucleo = await Tipo_Nucleo.findOne();
  if (confDias && tipoNucleo && pregunta.length===10) {
    res.redirect('/prueba-c');
   } else if (confDias && tipoNucleo && 0<pregunta.length<10) {
    res.render('preguntasCreadas', {
      titulo: 'Preguntas',
      preguntas: pregunta
      });
    } else if (!confDias) {
    res.redirect('/conf-dias');
    } else if (confDias && !tipoNucleo) {
    res.redirect('/conf-nucleos');
  }  
} catch (error) {
  next(error);
}
 

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
//Se renderiza al registro del administrador
module.exports.vistaRegistroA = function (req, res, next) {
try {
 
  res.render('Administrador', {
    titulo: 'Registro'
  }); 
} catch (error) {
  next(error);
}

};
//Se renderiza al registro del bibliotecario
module.exports.vistaRegistroB = function (req, res, next) {
  try {
   
    res.render('bibliotecario', {
      titulo: 'Registro'
    }); 
  } catch (error) {
    next(error);
  }
  
  };
//Se renderiza al registro de preguntas
module.exports.vistaRegistroP = function (req, res, next) {
 try {
   res.render('preguntas', {
    titulo: 'Preguntas'
  });
 } catch (error) {
   next(error);
 } 
};
//Se renderiza a la vista para el ingreso del bibliotecario
module.exports.vistaIngresoB = function (req, res, next) {
 try {
   
  res.render('ingresarConfig', {
    titulo: 'Configuración'
  });
 } catch (error) {
   next(error);
 }
};
//Se renderiza a la plantilla unaPregunta.ejs
module.exports.vistaPreguntaUnica = function (req, res, next) {
 try {
   
  res.render('unaPregunta', {
    titulo: 'Pregunta',
    preguntaEliminada: ''
  });
 } catch (error) {
   next(error);
 }
};
//Se renderiza a la plantilla tarea.ejs
module.exports.vistaTareaCompleta = function (req, res, next) {
 
 try {
   
  res.render('tarea', {
    titulo: 'Configuracion completa',
    mensaje: 'Configuración completada satisfactoriamente',
    tarea: 'correcta'
  });
 } catch (error) {
   next(error)
 }
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
    },
    {
      tipo_tu: 'administrador',
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
     next(error);
  }
};
//Crea en la base de datos los tipos de usuarios permitidos
module.exports.crearTipoS = async function (req, res, next) {

  try {
    let existe = await Tipo_Suscripcion.findAll();
    if (existe.length == 0) {
      let creado = await Tipo_Suscripcion.bulkCreate([{
        tipo_ts: 'de prueba',
        descripcion_ts: 'Suscripción para lectores',
        costo: 0,
        vigencia: 90
      },{
      tipo_ts: 'basica',
      descripcion_ts: 'Suscripción para visualización de material básico',
      costo: 0,
      vigencia: 90
    },
    {
      tipo_ts: 'estandar',
      descripcion_ts: 'Suscripción para visualización de material estándar',
      costo: 0,
      vigencia: 90
    },
    {
      tipo_ts: 'premium',
      descripcion_ts: 'Suscripción para visualización de material premium',
      costo: 0,
      vigencia: 90
    }]);


    if (creado) {
      console.log('Cargada la información inicial TS');
      next();
    }
    } else {
     
      next();
    }
    
  } catch (error) {
   
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

  try {
     res.render('confDias', {
    titulo: 'Configuración',
    mensaje: 'Configuración de días'
  });
  } catch (error) {
   next(error);
  }

 
};
//
 module.exports.guardarNucleos = async function (req, res, next) { 

   try {
     var datos = req.body;
     function nucleos(i){
     let varia = "datos.nucleo_"+i;
     varia = eval(varia);
     return varia;
      }
      var crear=[];
    let nNucleos = {};
    let coma = '';
    let nucleo;
    if (datos.nucleos >= 1){
      
      let ej = datos.nucleos;
      for(var i=1; i<=ej;i++){
       
        nucleo = nucleos(i).toLowerCase();
       crear.push( {
          nucleo: nucleo
        });
       
      }
    

      nNucleos = await Tipo_Nucleo.bulkCreate(crear);
      if (nNucleos) {
        res.redirect('/preguntasCreadas');
      }
 }  
 } catch (error) {
      next(error);
   }
  };

  //
 module.exports.insertarNucleo = async function (req, res, next) {
    const datos = req.body;
    function nucleos(i){
         let varia = "datos.nucleo_"+i;
         varia = eval(varia);
         return varia;
    }
      try {
        var crear=[];
        let nNucleo = {};
        let nucleo;
        if (datos.nucleos > 1){
          
          let ej = datos.nucleos;
          for(var i=1; i<=ej;i++){
          
            nucleo = nucleos(i);
           crear.push( {
             nucleo: nucleo
            });
           
           
          }
        
    
          nNucleo = await Tipo_Nucleo.bulkCreate(crear);
    
        }else{
           nNucleo = await Tipo_Nucleo.create({
            nucleo: datos.nucleo_1
        });
        }
    
        if (nNucleo) {
        res.status(200).send('Carga satisfactoria');
         
        }
        
      } catch (error) {
          res.status(500).json({
            message: 'ha ocurrido un error',
            data: {},
          });
      }
    };

///
module.exports.insertarCategoria = async function (req, res, next) {
  
  const datos = req.body;
  function categorias(i){
       let varia = "datos.categoria_"+i;
       varia = eval(varia);
       return varia;
  }
    try {
      var crear=[];
      let nCategoria = {};
      let categoria;
      if (datos.categorias > 1){
        let ej = datos.categorias;
        for(var i=1; i<=ej;i++){
          categoria = categorias(i);
         crear.push( {
           categoria: categoria
          });
         
         
        }
        nCategoria = await Tipo_Categoria.bulkCreate(crear);
  
      }else{
         nCategoria = await Tipo_Categoria.create({
          categoria: datos.categoria_1
      });
      }
  
      if (nCategoria) {
      res.status(200).send('Carga satisfactoria');
       
      }
      
    } catch (error) {
      
        res.status(500).json({
          message: 'ha ocurrido un error',
          data: {},
        });
    }
  };
  ///
  module.exports.todosNucleos = async function (req, res, next) {
   
   try {
    let nucleos = await Tipo_Nucleo.findAll();
   if (nucleos) {
     res.status(200).json({
       nucleos: nucleos
     });
   }
   } catch (error) {
    res.status(500).json({
      message: 'ha ocurrido un error',
      data: {},
    }); 
   }
  };
    ///
   module.exports.todasCategorias = async function (req, res, next) {
   
      try {
       let categorias = await Tipo_Categoria.findAll();
      if (categorias) {
        res.status(200).json({
          categorias: categorias
        });
      }
      } catch (error) {
        res.status(500).json({
          message: 'ha ocurrido un error',
          data: {},
        });   
      }
     };

   
  //función para eliminar una categoría
 module.exports.eliminarCategoria = async function (req, res, next) {
   let categoria=req.query.c;
    try {
     let existe = await Libros.findOne({
      where:{
        type: categoria
      }
     });
     if (existe) {
      res.status(200).send('No se puede eliminar porque esta asociada al registro de un libro')
     }else {
       let eliminacion = await Tipo_Categoria.destroy({
         where: {
           categoria: categoria
       }
      });
       if (eliminacion) {
         res.status(200).send('Se ha eliminado con éxito');
     
       }
      }
   
    
    } catch (error) {
      res.status(500).json({
        message: 'ha ocurrido un error',
        data: {},
      });   
    }
   };

   //funcion para eliminar un nucleo
module.exports.eliminarNucleo = async function (req, res, next) {
    let nucleo=req.query.n;
     try {
      let existe = await Libros.findOne({
       where:{
         core: nucleo
       }
      });
    ;
      if (existe) {
       res.status(200).send('No se puede eliminar porque esta asociada al registro de un libro')
      }else {
        let eliminacion = await Tipo_Nucleo.destroy({
          where: {
            nucleo: nucleo
        }
       });
        if (eliminacion) {
          res.status(200).send('Se ha eliminado con éxito');
      
        }
       }
    
     
     } catch (error) {
       res.status(500).json({
         message: 'ha ocurrido un error',
         data: {},
       });   
     }
};
//funcion para editar categoria
module.exports.editarCategoria = async function (req, res, next) {
    let categoria=req.query.c;
     try {
      let existe = await Libros.findOne({
       where:{
         type: categoria
       }
      });
      if (existe) {
       res.status(200).send('No se puede eliminar porque esta asociada al registro de un libro')
      }else {
       res.status(200).send('ok');
        }
       
    
     
     } catch (error) {
       res.status(500).json({
         message: 'ha ocurrido un error',
         data: {},
       });   
     }
  
  };
 // funcion que actualiza una categoria
 module.exports.actualizarC = async function (req, res, next) {
  let categoriaV=req.body.categoriaV;
  let categoria=req.body.categoria;
  
   try {
    let existe = await Tipo_Categoria.update({
      categoria:categoria
    },{
     where:{
       categoria: categoriaV
     }
    });
    if (existe) {
    res.status(200).send('Actualizada con éxito');
      }
     
  
   
   } catch (error) {
     res.status(500).json({
       message: 'ha ocurrido un error',
       data: {},
     });   
   }

};
//funcion para editar nucleo
module.exports.editarNucleo = async function (req, res, next) {
  let nucleo=req.query.n;
   try {
    let existe = await Libros.findOne({
     where:{
       core: nucleo
     }
    });
    if (existe) {
     res.status(200).send('No se puede eliminar porque esta asociada al registro de un libro')
    }else {
     res.status(200).send('ok');
      }
     
  
   
   } catch (error) {
     res.status(500).json({
       message: 'ha ocurrido un error',
       data: {},
     });   
   }

};
 // funcion que actualiza un Nucleo
 module.exports.actualizarN = async function (req, res, next) {
  let nucleoV=req.body.nucleoV;
  let nucleo=req.body.nucleo;
  
   try {
    let existe = await Tipo_Nucleo.update({
      nucleo:nucleo
    },{
     where:{
       nucleo: nucleoV
     }
    });
    if (existe) {
    res.status(200).send('Actualizada con éxito');
      }
     
  
   
   } catch (error) {
     res.status(500).json({
       message: 'ha ocurrido un error',
       data: {},
     });   
   }

};
///consultas las respuesta de seguridad
module.exports.misRespuestasS = async function (req, res, next) {
console.log('ejecutando');
  try {
    let obj=[];
    let id;
    let pregunta;
   let respuestas = await Respuestas.findAll({ 
     where:
       { correo_r: req.session.passport.user }
       });

   for (var i=0; i<respuestas.length; i++) {

    id = respuestas[i].id_pr;
      pregunta = await Preguntas.findOne({
       where: {
         id_p: id
       }
     });
      obj.push({
         pregunta: pregunta.pregunta,
         respuesta: respuestas[i].respuesta
         });
        
       }
if (obj) {
  res.status(200).json(obj);
}
   
 
    
  }catch (error) {
    console.log(error);
res.status(500).json({
  message: 'Ha ocurrido un error',
  data: {}
});
  }
};
