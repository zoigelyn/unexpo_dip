const sequelize = require('../database/database');
//const Sequelize = require ('sequelize');
const Fichas = require('../models/fichas');
const Libros = require('../models/libros');
const fichasEntregadas = require('../models/fichasEntregadas');
const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");

const nodemailer = require('nodemailer');

module.exports.vencimiento = async function vencimiento(req, res, next) {
   const fechaHoy = new Date();
  console.log(fechaHoy);
  function sumarDias(dia, fecha_emision) {
    var dias = Number(dia);
    var fecha = fecha_emision;
    var nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() - dias);
    var numeroD = new Date(nuevaFecha);
    return numeroD
  };
  var diaCero = sumarDias(10, fechaHoy);
  try {
    
   const fichasNot = await Fichas.findAll({
        where:{
          fecha_d: {
            [Op.lte]: fechaHoy
          },
          estado_f: 'vigente'
        }
      });
      const fichas = await Fichas.findAll({
        where:{
          fecha_d: {
            [Op.lte]: fechaHoy
          }
        }
      });
      if (fichasNot.length > 0) {
        fichas.forEach(async (fichas) => {
           await Fichas.update({
           
            estado_f: 'vencido'
            
          },
          { where:{
            fecha_d: {
              [Op.lte]: fechaHoy
            }
          }
        });
        });
      };
      if (fichas.length > 0) {
        
        var transporter = nodemailer.createTransport({
          host:'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'jesusjosediaznadal@gmail.com',
            pass: '19284138'
          }
            
        });
        var mailOptions = {
          from: 'Biblioteca Unexpo <jesusjosediaznadal@gmail.com',
          to: 'zoigelyn@gmail.com',
          subject: 'Lista de prestamos vencidos',
          html: '<p>se ha enviado un mensaje</p>'
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.send('error');
          }else {
            console.log('mensaje enviado: '+info.response);
            console.log(info);
            res.send('enviado');
          }
        });
       
      };
    
  } catch(error){
    console.log(error);
  }

};

module.exports.insertarFicha = async function insertarFicha(req, res, next) {
  const {cota_f, correo_f,fecha_e, fecha_d} = request.body;
const dia = 5;
  var mensaje = "";
  var bandera = 0;
  function sumarDias(dia, fecha_emision) {
    var dias = Number(dia);
    var fecha = fecha_emision;
    var nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    var numeroD = new Date(nuevaFecha);
    var diaSemana = numeroD.getDay();

    if (diaSemana == 0 || diaSemana == 6) {
      mensaje = "Debes seleccionar un dia entre lunes y viernes";
      bandera = 1;
   }
    console.log(diaSemana);

    return numeroD;
  }

  if (fecha_e) {
    var fecha_emision = fecha_e;
  } else {
    var fecha_emision = new Date();
  }

  var nd = sumarDias(dia, fecha_emision);
  if (!fecha_d){
    var fecha_devolucion = nd;
  }
  else {
   var fecha_devolucion = fecha_d;
  }


  try {
    let nFicha = {};
   let nuevaFicha = {};
 if (bandera === 0){
       nFicha = await Fichas.create({
        cota_f: cota_f.toLowerCase(),
        correo_f: correo_f.toLowerCase(),
        fecha_e: fecha_emision,
        fecha_d: fecha_devolucion,
        estado_f: 'pendiente',
      });

      nuevaFicha = await Fichas.findAll({
        attributes: [
          ['n_solicitud', 'numero de solicitud'],
          ['cota_f', 'cota'],
          ['correo_f', 'correo'],
          ['fecha_e', 'fecha de emision'],
          ['fecha_d', 'fecha de devolucion'],
          ['created_at','fecha de registro'],
          ],
        where: {
          cota_f: cota_f.toLowerCase(),
        },
      });
    }

    if (nFicha && bandera !== 1) {
      return response.json({
        message: 'creado safisfactoriamente',
        data: nuevaFicha,
      });
    }
   if (bandera === 1) {
      return response.json({
        message: mensaje,
        data: nuevaFicha
      });
    }

  } catch (error) {
    console.log(error);
      response.status(500).json({
        message: 'ha ocurrido un error' ,
        data: {},
      });
  }
};

module.exports.reservarLibro = async function (req, res, next) {
  const {cota, fecha_e, fecha_d, dia_p} = req.query;
  var dia = 0;
  if (dia_p) {
    dia = dia_p;
  }else {
    dia = 3;
  }

 
  function sumarDias(dia, fecha_emision) {
 var diaSemana = 0;
    while (diaSemana == 0 || diaSemana == 6) {
    var dias = Number(dia);
    var fecha = fecha_emision;
    var nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    var numeroD = new Date(nuevaFecha);
    var diaSemana = numeroD.getDay();

   }
    console.log(diaSemana);

    return numeroD;
  }

  if (fecha_e) {
    var fecha_emision = fecha_e;
  } else {
    var fecha_emision = new Date();
  }

  var nd = sumarDias(dia, fecha_emision);

  if (!fecha_d){
    var fecha_devolucion = nd;
  }
  else {
   var fecha_devolucion = fecha_d;
  }


  try {
    let nFicha = {};
   
   let  actualizadoL = {};
   

       nFicha = await Fichas.create({
        cota_f: cota.toLowerCase(),
        correo_f: req.session.usuarioL.correo_u,
        fecha_e: fecha_emision,
        fecha_d: fecha_devolucion,
        estado_f: 'pendiente',
      });
    if (nFicha) {
      actualizadoL = await Libros.update({
        estado_l: 'no disponible'
      },{
      where: {
        cota: cota
      }
      });
    }
     
    

    if (nFicha && actualizadoL) {
     res.redirect('/usuario/mis-reservas');
    };

  } catch (error) {
    console.log(error);
      res.status(500).json({
        message: 'ha ocurrido un error' ,
        data: {},
      });
  }
};

module.exports.misReservas = async function misReservas(req, res, next) {

  try{
    let  fichas = await Fichas.findAll({
      attributes: [
        'n_solicitud',
        'cota_f',
        'correo_f',
        'fecha_e',
        'fecha_d', 
        'created_at'
        ],
      where: {
        correo_f: req.session.usuarioL.correo_u,
      },
    });
 let libros = await Libros.findAll(/*{
   where: {
     [Op.or]: [
       {cota: fichas.cota_f}
      ]
   }
 }*/);
 res.render('misReservas', {
  titulo: 'Mis reservas',
  usuarioL: req.session.usuarioL,
  fichas: fichas,
  libros: libros
 });
  }catch{
    console.log(error);
      res.status(500).json({
        message: 'ha ocurrido un error' ,
        data: {},
      });
  }
};

module.exports.aprobarFicha = async function aprobarFicha(request, response) {
 
 var {cota_f, correo_f,fecha_e, fecha_d} = request.query;


  if (cota_f){
    cota_f = cota_f.toLowerCase();
  }
  if (correo_f){
   correo_f = correo_f.toLowerCase();
  }

  if (fecha_e) {
    var fecha_emision = fecha_e;
  } else {
    var fecha_emision = new Date();
  }

  
   var fecha_devolucion = fecha_d;
  


  try {
   var nFicha = {};
   var nuevaFicha = {};

  nFicha = await Fichas.update({
    fecha_e: fecha_emision,
    fecha_d: fecha_devolucion,
    estado_f: 'vigente',
  },{
    where: {
      cota_f: cota_f,
      correo_f: correo_f,
    }
  });
     
    if (nFicha) {            
      response.render('card',{
        titulo: 'ficha aprobada',
        texto: 'se ha marcado como aprobada',
        bandera: 3
       });
    }


  } catch (error) {
    console.log(error);
      response.status(500).json({
        message: 'ha ocurrido un error' ,
        data: {},
      });
  }
}



module.exports.FichasEntregadas = async function FichasEntregadas(req, res) {
  try {
    fichas = await fichasEntregadas.findAll({
      attributes: [
        'n_solicitud',
        'cota_f',
        'correo_f',
        'estado_f',
        'fecha_e',
        'fecha_c',
        'created_at',
        'updated_at',
        ]
    });
    if (fichas){
      res.render('loan',{
        titulo: 'fichas entregadas' ,
        fichas: fichas,
        usuarioL: req.session.usuarioL
       }); 
    }
   
  } catch (error) {
    console.log(error);
    res.json({
      data: {},
      message: "ha ocurrido un error",
    });
  }
};


module.exports.busquedaEspecifica = async function busquedaEspecifica(request, response) {
  const ficha = request.query;
  const busqueda = {};
if (ficha.cota_f){
  busqueda.cota_f = ficha.cota_f.toLowerCase();
}
if (ficha.correo_f){
  busqueda.correo_f = ficha.correo_f.toLowerCase();
}
if (ficha.estado_f){
  busqueda.estado_f = ficha.estado_f.toLowerCase();
}
if (ficha.fecha_e){
  busqueda.fecha_e = ficha.fecha_e;
}
if (ficha.fecha_d){
  busqueda.fecha_d = ficha.fecha_d;
}
if (ficha.fecha_c){
  busqueda.fecha_c = ficha.fecha_c;
}
  try {
    const fichas = await Fichas.findAll({
      attributes: [
        ['cota_f', 'cota'],
        ['correo_f', 'correo'],
        ['estado_f', 'estado del prestamo'],
        ['fecha_e', 'fecha de emision'],
        ['fecha_d', 'fecha de devolucion'],
        ['fecha_c', 'fecha de culminacion'],
        ['created_at', 'fecha de registro'],
        ['updated_at', 'fecha de ultima actualizacion'],
      ],
      where: busqueda,
    });

    response.json({
      data: fichas,
      message: 'Busqueda exitosa ',
      resultados: fichas.length + ' resultados',
    });
  } catch (error) {
    response.json({
      data: {},
      message: "Ha ocurrido un error",
    });
  }
};

module.exports.busquedaGeneral = async function busquedaGeneral(request, response) {
  const busqueda = request.query;
  try {
    var libros;
    if (busqueda.cota_f){
    const cota_f = '%' + busqueda.cota_f + '%';
    libros =  await sequelize.query(
      'SELECT cota_f AS "cota", correo_f AS "correo", fecha_e AS "fecha de emision", fecha_d AS "fecha de devolucion", fecha_c AS "fecha de culminacion", estado_f AS "estado del prestamo, created_at AS "fecha de creacion", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE cota ILIKE :busq',
      {
        replacements: {busq: cota_f},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.correo_f){
      const correo_f = '%' + busqueda.correo_f + '%';
   libros = await sequelize.query(
    'SELECT cota_f AS "cota", correo_f AS "correo", fecha_e AS "fecha de emision", fecha_d AS "fecha de devolucion", fecha_c AS "fecha de culminacion", estado_f AS "estado del prestamo, created_at AS "fecha de creacion", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE cota ILIKE :busq',
      {
        replacements: {busq: correo_f},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.fecha_e){
      const fecha_e =  busqueda.fecha_e + '%';
   libros = await sequelize.query(
    'SELECT cota_f AS "cota", correo_f AS "correo", fecha_e AS "fecha de emision", fecha_d AS "fecha de devolucion", fecha_c AS "fecha de culminacion", estado_f AS "estado del prestamo, created_at AS "fecha de creacion", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE cota ILIKE :busq',
      {
        replacements: {busq: fecha_e},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.fecha_d){
      const fecha_d =  busqueda.fecha_d + '%';
   libros = await sequelize.query(
    'SELECT cota_f AS "cota", correo_f AS "correo", fecha_e AS "fecha de emision", fecha_d AS "fecha de devolucion", fecha_c AS "fecha de culminacion", estado_f AS "estado del prestamo, created_at AS "fecha de creacion", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE cota ILIKE :busq',
      {
        replacements: {busq: fecha_d},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.fecha_c){
      const fecha_c = busqueda.fecha_c + '%';
   libros = await sequelize.query(
    'SELECT cota_f AS "cota", correo_f AS "correo", fecha_e AS "fecha de emision", fecha_d AS "fecha de devolucion", fecha_c AS "fecha de culminacion", estado_f AS "estado del prestamo, created_at AS "fecha de creacion", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE cota ILIKE :busq',
      {
        replacements: {busq: fecha_c},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.estado_f){
      const estado_f = '%' + busqueda.estado_f + '%';
   libros = await sequelize.query(
    'SELECT cota_f AS "cota", correo_f AS "correo", fecha_e AS "fecha de emision", fecha_d AS "fecha de devolucion", fecha_c AS "fecha de culminacion", estado_f AS "estado del prestamo, created_at AS "fecha de creacion", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE cota ILIKE :busq',
      {
        replacements: {busq: estado_f},
        type: QueryTypes.SELECT
      }
    );
    }
    response.json({
      data: libros,
      message: 'Busqueda exitosa',
      resultados: libros.length,
    });
  } catch (error) {
    console.log(error);
    response.json({
      data: {},
      message: 'Ha ocurrido un error',
    });
  }
};

module.exports.eliminacionFicha = async function eliminacionFicha(request, response) {
  const { cota_f, estado_f, correo_f } = request.query;
  const busqueda = {};
  if(cota_f){
    busqueda.cota_f = cota_f.toLowerCase();
  }
  if (correo_f){
    busqueda.correo_f = correo_f.toLowerCase();
  }
  if (estado_f.toLowerCase() == 'entregado'){
  try {
    const fichaliminada = await Fichas.destroy({
      where: busqueda
    });
    response.json({
      message: "se han afectado " + fichaliminada + " filas",
    });
  } catch (error) {
    console.log(error);
    response.json({
      message: "ha fallado la eliminacion",
    });
  }
};
};

module.exports.eliminarReserva = async function eliminarReversa(request, response) {
  const { cota_f, correo_f } = request.query;
  const busqueda = {};
  if(cota_f){
    busqueda.cota_f = cota_f.toLowerCase();
  }
  if (correo_f){
    busqueda.correo_f = correo_f.toLowerCase();
  }
  
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



module.exports.actualizarFicha = async function actualizarFicha(request, response) {
  const { correo_f , cota_f, estado_f, fecha_e, fecha_c, fecha_d} = request.query;
  const { correo_fb, estado_fb, fecha_eb, fecha_cb, fecha_db} = request.body;
  const nuevaFicha ={};
  const ficha = {};

if (correo_f){
  ficha.correo_f = correo_f.toLowerCase();
}
if (cota_f){
  ficha.cota_f = cota_f.toLowerCase();
}
if (estado_f){
  ficha.estado_f = estado_f.toLowerCase();
}
if (fecha_e){
  ficha.fecha_e = fecha_e;
}
if (fecha_d){
  ficha.fecha_d = fecha_d;
}
if (fecha_c){
  ficha.fecha_c = fecha_c;
}

    
if (correo_fb) {
  nuevaFicha.correo_f = correo_fb.toLowerCase();
}
if (fecha_eb) {
  nuevaFicha.fecha_e = fecha_eb;
}
if (fecha_db) {
  nuevaFicha.fecha_d = fecha_db;
}
if (fecha_cb){
  nuevaFicha.fecha_c =  fecha_cb;
}
if (estado_fb) {
  nuevaFicha.estado_f = estado_fb.toLowerCase();
}

      
  
  try {
    const fichas = await Fichas.findAll({
      attributes: [
        ['cota_f', 'cota'],
        ['correo_f', 'correo'],
        ['estado_f', 'estado del prestamo'],
        ['fecha_e', 'fecha de emision'],
        ['fecha_d', 'fecha de devolucion'],
        ['fecha_c', 'fecha de culminacion'],
        ['created_at', 'fecha de registro'],
        ['updated_at', 'fecha de ultima actualizacion']
      ],
      where: ficha,
    });
    if (fichas.length > 0) {
      fichas.forEach(async (fichas) => {
         await Fichas.update({
          correo_f: nuevaFicha.correo_f,
          estado_f: nuevaFicha.estado_f,
          fecha_e: nuevaFicha.fecha_e,
          fecha_d: nuevaFicha.fecha_d,
          fecha_c: nuevaFicha.fecha_c,
        },{
          where: ficha
        });
      });
    };
      const nuevasFichas = await Fichas.findAll({
        attributes: [
          ['cota_f', 'cota'],
          ['correo_f', 'correo'],
          ['estado_f', 'estado del prestamo'],
          ['fecha_e', 'fecha de emision'],
          ['fecha_d', 'fecha de devolucion'],
          ['fecha_c', 'fecha de culminacion'],
          ['created_at', 'fecha de registro'],
          ['updated_at', 'fecha de ultima actualizacion']
        ],
        where: ficha,
      });
      return response.json({
        message: "fichas actualizados",
        data: nuevasFichas,
      });
    
  } catch (error) {
    console.log(error);
    response.json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
};


module.exports.actualizarUnaFicha = async function actualizarUnaFicha(request, response) {
 
  const { correo_f , cota_f, estado_f, fecha_e, fecha_c, fecha_d} = request.query;
  const {correo_fb, estado_fb,fecha_eb, fecha_cb, fecha_db} = request.body;
  const nuevaFicha ={};
  const ficha = {};

if (correo_f){
  ficha.correo_f = correo_f.toLowerCase();
}
if (cota_f){
  ficha.cota_f = cota_f.toLowerCase();
}
if (estado_f){
  ficha.estado_f = estado_f.toLowerCase();
}
if (fecha_e){
  ficha.fecha_e = fecha_e;
}
if (fecha_d){
  ficha.fecha_d = fecha_d;
}
if (fecha_c){
  ficha.fecha_c = fecha_c;
}

    
      if (correo_fb) {
        nuevaFicha.correo_f = correo_fb.toLowerCase();
      }
      if (fecha_eb) {
        nuevaFicha.fecha_e = fecha_eb;
      }
      if (fecha_db) {
        nuevaFicha.fecha_d = fecha_db;
      }
      if (fecha_cb){
        nuevaFicha.fecha_c =  fecha_cb;
      }
      if (estado_fb) {
        nuevaFicha.estado_f = estado_fb.toLowerCase();
      }
      
  
  try {
    
         await Fichas.update({
          correo_f: nuevaFicha.correo_f,
          estado_f: nuevaFicha.estado_f,
          fecha_e: nuevaFicha.fecha_e,
          fecha_d: nuevaFicha.fecha_d,
          fecha_c: nuevaFicha.fecha_c,
        },{
          where: ficha
        });
    
      const nuevasFichas = await Fichas.findAll({
        attributes: [
          ['cota_f', 'cota'],
          ['correo_f', 'correo'],
          ['estado_f', 'estado del prestamo'],
          ['fecha_e', 'fecha de emision'],
          ['fecha_d', 'fecha de devolucion'],
          ['fecha_c', 'fecha de culminacion'],
          ['created_at', 'fecha de registro'],
          ['updated_at', 'fecha de ultima actualizacion']
        ],
        where: ficha,
      });
      return response.json({
        message: "fichas actualizados",
        data: nuevasFichas,
      });
    
  } catch (error) {
    console.log(error);
    response.json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
};
module.exports.entregarFicha = async function entregarFicha(req, res) {
 
  const { correo, cota, fecha_e} = req.query;
  
  try {
    let fichaeliminada = {};
       let creada = await fichasEntregadas.create({
          cota_f: cota,
          correo_f: correo,
          fecha_e: fecha_e,
          fecha_c: new Date(),
          estado_f: 'entregado',
        });
       if (creada ){
  
         fichaeliminada = await Fichas.destroy({
            where: {
              cota_f: cota,
            }
          });
       }
          if (fichaeliminada) {
            
            res.render('card',{
              titulo: 'ficha entregada',
              texto: 'se ha marcado como entregada',
              bandera: 1
             });
        }
    
  } catch (error) {
    console.log(error);
    res.json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
}; 



module.exports.fichasPendientes = async function fichasPendientes(req, res) {
  try {
    fichas = await Fichas.findAll({
      attributes: [
        'n_solicitud',
        'cota_f',
        'correo_f',
        'estado_f',
        'fecha_e',
        'fecha_d',
        'fecha_c',
        'created_at',
        'updated_at',
        ],
        where:{
          [Op.or]: [
            { estado_f: 'vigente' },
            { estado_f: 'vencido' }
          ]
        }
      });
      
     
        

    if (fichas) {
      
        res.render('loanpending',{
           titulo: 'pendientes' ,
           fichas: fichas
          }); 
    }
    
    

   
   

  } catch (error) {
    console.log(error);
    res.json({
      data: {},
      message: "ha ocurrido un error",
    });
  }
 
};

module.exports.fichasReservadas = async function fichasReservadas(req, res) {
 var fichas = [];
 var libros = [];
  try {
    fichas = await Fichas.findAll({
      attributes: [
        'n_solicitud',
        'cota_f',
        'correo_f',
        'estado_f',
        'fecha_e',
        'fecha_d',
        'fecha_c',
        'created_at',
        'updated_at',
        ],
        where:{
           estado_f: 'reservado', 
        }
      });
      
      for (var i=0; i<fichas.length; i++)
      {
       libros[i] = await Libros.findOne({
        attributes: [
          'tipo_l',
        ],
        where: {
          cota: fichas[i].cota_f
        }
      });
      }

    if (fichas) {
      
console.log(libros);
console.log(fichas);
        res.render('loanreservation',{
           titulo: 'reservaciones' ,
           fichas: fichas,
           libros: libros
          }); 
    }
    
    

  } catch (error) {
    console.log(error);
    res.json({
      data: {},
      message: "ha ocurrido un error",
    });
  }
 
};
module.exports.eliminarFicha = async function eliminarFicha(req, res) {
 
  const {cota} = req.query;
  
  try {
    let creada = {};
    let fichaeliminada = {};
        fichaEliminada = await fichasEntregadas.destroy({
         where: {
           cota_f: cota,
         }
        });
      
        
          if (fichaeliminada) {
      
              res.render('card',{
                titulo: 'ficha entregada',
                texto: 'se ha eliminado',
                bandera: 2
               });
        }
    
  } catch (error) {
    console.log(error);
    res.json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
}; 
