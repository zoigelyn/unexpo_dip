const sequelize = require('../database/database');
//const Sequelize = require ('sequelize');
const Fichas = require('../models/fichas');
const Libros = require('../models/libros');
const ConfDiasLibros = require('../models/conf-dias-libros');
const fichasEntregadas = require('../models/fichasEntregadas');
const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");

const nodemailer = require('nodemailer');
function sumarDias(dia, fecha_emision) {
  var dias = Number(dia);
  var fecha = fecha_emision;
  var nuevaFecha = new Date(fecha);
  nuevaFecha.setDate(nuevaFecha.getDate() - dias);
  var numeroD = new Date(nuevaFecha);
  return numeroD
};
//Verifica si existe configuración de dias de prestamos
module.exports.existeConfigDias = async function (req, res, next) {
  const diasLibros = ConfDiasLibros.findAll();
  if (diasLibros) {
    next();
  } else {
    res.redirect('/bibliotecario/conf-dias');
  }
};
//consulta los prestamos entregados
module.exports.prestamosAjax = async function (req, res, next) {
  try {
    const prestamos = await fichasEntregadas.findAll();
    if (prestamos) {
      res.status(200).send({ fichas: prestamos });
    }

  } catch (error) {
    res.status(500);
  }


};

//consulta los prestamos pendientes
module.exports.prestamosPAjax = async function (req, res, next) {
  try {
    const prestamos = await Fichas.findAll({
      where: {
        estado_f: 'pendiente'
      }
    });
    if (prestamos) {
      res.status(200).send({ fichas: prestamos });
    }
  } catch (error) {
    res.status(500);
  }


};
//pendientes por entregar

module.exports.prestamosVVAjax = async function (req, res, next) {
  try {
    const prestamos = await Fichas.findAll({
      where: {
        [Op.or]: [
          { estado_f: 'vigente' },
          { estado_f: 'vencido' }
        ]
      }
    });
    if (prestamos) {
      res.status(200).send({ fichas: prestamos });
    }

  } catch (error) {
    res.status(500);
  }


};

// funcion para reservar un libro
module.exports.reservarLibro = async function (req, res, next) {

  const { cota, fecha_e } = req.body;
  console.log('1');
  let reservas = {};
  let fecha_emision;

  reservas = await Fichas.findAll({
    where: {
      correo_f: req.session.usuarioL.correo_u
    }
  });
  const configurado = await ConfDiasLibros.findOne();
  const cantidadL = configurado.cantidad_libros;
  const cantidadD = configurado.dias_prestamo;

  function sumarDias2(dia, fecha_emision) {
    var diaSemana = 0;// modificar a cero en caso de hallar solución
    var i = 0;//modificar el uno al 0
    while (diaSemana == 0 || diaSemana == 6) {//modificar el cero por cinco en caso de halalr solucion

      var dias = Number(dia + i);
      var fecha = fecha_emision;
      var nuevaFecha = new Date(fecha);
      nuevaFecha.setDate(nuevaFecha.getDate() + dias);
      var numeroD = new Date(nuevaFecha);
      diaSemana = numeroD.getDay();
      i++;
    }
    i = 0;
    return numeroD;
  }

  if (fecha_e) {
        let dia = fecha_e.split('-')[2];
        let mes = fecha_e.split('-')[1] - 1;
        let año = fecha_e.split('-')[0];
         fecha_emision = new Date(año, mes, dia);
  } else {
     fecha_emision = new Date();
  }




  try {
    if (reservas.length < cantidadL) {
      const dia = parseInt(cantidadD);
      var fecha_d = sumarDias2(dia, fecha_emision);
      let nFicha = await Fichas.create({
        cota_f: cota.toLowerCase(),
        correo_f: req.session.usuarioL.correo_u,
        fecha_e: fecha_emision,
        fecha_d: fecha_d,
        estado_f: 'pendiente',
      });
      if (nFicha) {
        var actualizadoL = await Libros.update({
          estado_l: 'no disponible'
        }, {
          where: {
            cota: cota
          }
        });
      }



      if (nFicha && actualizadoL) {
        res.status(200).send('Se ha reservado con exito');
      } else {
        res.status(500).send({
          message: 'Libro no reservado'
        });
      };
    } else if (reservas.length >= cantidadL) {
      res.status(200).send('has llegado al limite');
    };

  } catch (error) {
    res.status(500);
  }
};
//Mis reservas, listo. Consulta las reservas activas del usuario logeado
module.exports.misReservas = async function (req, res, next) {

  try {
    let titulo = {};
    let autor = {};
    let fichas = await Fichas.findAll({
      where: {
        correo_f: req.session.usuarioL.correo_u,
        estado_f: 'pendiente'
      },
    });

    let libros = await Libros.findAll();

    for (var j = 0; j < libros.length; j++) {

      for (var i = 0; i < fichas.length; i++) {

        if (fichas[i].cota_f === libros[j].cota) {
          titulo[i] = libros[j].titulo;
          autor[i] = libros[j].autor;
        }
      }

    }
    res.status(200).send({
      fichas: fichas,
      autor: autor,
      titulo: titulo,
    });
  } catch {

    res.status(500);
  }
};
module.exports.misPrestamos = async function (req, res, next) {

  try {
    let titulo = {};
    let autor = {};
    let fichas = await Fichas.findAll({
      where: {
        [Op.or]: [
          {
            estado_f: 'vigente',
            correo_f: req.session.usuarioL.correo_u
          },
          {
            estado_f: 'vencido',
            correo_f: req.session.usuarioL.correo_u
          }
        ]
      },
    });

    let libros = await Libros.findAll(/*{
      where: {
        [Op.or]: fichas.cota_f,
      }
    }*/);
    for (var j = 0; j < libros.length; j++) {

      for (var i = 0; i < fichas.length; i++) {

        if (fichas[i].cota_f === libros[j].cota) {
          titulo[i] = libros[j].titulo;
          autor[i] = libros[j].autor;
        }
      }

    }
    res.send({
      fichas: fichas,
      autor: autor,
      titulo: titulo,
    });
  } catch {
    console.log(error);
    res.status(500).json({
      message: 'ha ocurrido un error',
      data: {},
    });
  }
};
//función que consulta la ficha de reserva o préstamo
module.exports.miFicha = async function (req, res, next) {
  const cota = req.query.cota

  try {
    const ficha = await Fichas.findOne({
      where: {
        cota_f: cota
      }
    });
    
    const libro = await Libros.findOne({
      where: {
        cota: cota
      }
    });

    const conf = await ConfDiasLibros.findOne();


    if (ficha && libro) {
      res.status(200).send({
        ficha: ficha,
        libro: libro,
        conf: conf
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
//función que consulta la ficha de reserva o préstamo
module.exports.miFichaE = async function (req, res, next) {
  const cota = req.query.cota;
  try {
    const ficha = await fichasEntregadas.findOne({
      where: {
        cota_f: cota
      }
    });
    const libro = await Libros.findOne({
      where: {
        cota: cota
      }
    });

    if (ficha && libro) {
      res.status(200).send({
        ficha: ficha,
        libro: libro
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

module.exports.aprobarFicha = async function (req, res, next) {

  let cota = req.body.cota;

  if (cota) {
    cota = cota.toLowerCase();
  }

  try {

    let nFicha = await Fichas.update({
      estado_f: 'vigente'
    }, {
      where: {
        cota_f: cota
      }
    });

    if (nFicha) {
      res.status(200).send('Préstamo aprobado exitosamente');

    }

  } catch (error) {
    res.status(500);
  }
};



//elimina una ficha reservada
module.exports.eliminarReserva = async function (req, res, next) {
  const cota = req.query.cota
  let actualizarE;

  try {
    const fichaEliminada = await Fichas.destroy({
      where: {
        cota_f: cota
      }
    });
    if (fichaEliminada) {
      actualizarE = await Libros.update({
        estado_l: 'disponible',
      }, {
        where: { cota: cota }
      });
    }
    if (actualizarE != '') {
      res.status(200).send('Se ha eliminado con éxito');
    }


  } catch (error) {
    res.status(500);

  }
};


//Se recibe el libro que se tenia prestado
module.exports.recibirLibro = async function (req, res, next) {

  const cota = req.body.cota;
  let fichaEliminada, actualizarEstado;
  try {
    let ficha = await Fichas.findOne({
      where: {
        cota_f: cota
      }
    });

    let creada = await fichasEntregadas.create({
      cota_f: ficha.cota_f,
      correo_f: ficha.correo_f,
      fecha_e: ficha.fecha_e,
      fecha_c: new Date(),
      estado_f: 'entregado',
    });
    if (creada) {

      fichaEliminada = await Fichas.destroy({
        where: {
          cota_f: cota,
        }
      });
      actualizarEstado = await Libros.update({
        estado_l: 'disponible',
      }, {
        where: { cota: cota }
      });
    }
    if (fichaEliminada != '' && actualizarEstado != '') {
      res.status(200).send('Libro entregado exitosamente');
    }

  } catch (error) {
    res.status(500);
  }
};



//Elimina una ficha entregada listo
module.exports.eliminarFichaE = async function (req, res, next) {

  const cota = req.query.cota;

  try {

    const fichaEliminada = await fichasEntregadas.destroy({
      where: {
        cota_f: cota,
      }
    });


    if (fichaEliminada) {

      res.status(200).send('Ficha eliminada exitosamente');
    }

  } catch (error) {
    res.status(500);
  }
};
//función que actualice el estado de fichas y envia a los usuarios un recordatorio sobre la vigencia del préstamo que tengan activo
module.exports.actualizarEstadoF = async function (req, res, next) {
  try {
    const fichas = await Fichas.findAll({
      where: {
        estado_f: 'vigente'
      }
    });
    if (fichas.length > 0) {
      for (var i = 0; i < fichas.length; i++) {
         let fecha_d = fichas[i].fecha_d;
        let dia = fecha_d.split('-')[2];
        let mes = fecha_d.split('-')[1] - 1;
        let año = fecha_d.split('-')[0];
        let fecha_devo = new Date(año, mes, dia);
        let resultado1 = fecha_devo < new Date();
        let resultado2 = fecha_devo.getDate() === new Date().getDate();
        
        if (resultado1 && !resultado2) {
        
           await Fichas.update({
          estado_f: "vencido",
        }, {
          where: {
            cota_f: fichas[i].cota_f
          }
        });
        }
       
      }
    }
   
    
  } catch (error) {
    console.log(error);
  }
}; //Funcion que envia correo electrónicos a préstamos vigentes y vencidos
module.exports.envioCorreo = async function (req, res, next) {
  try {
    const conf = await ConfDiasLibros.findOne();
    const fichasV = await Fichas.findAll({
      where: {
        estado_f: "vencido"
      }
    });
    const fichasVigentes = await Fichas.findAll({
      where: {
        estado_f: "vigente"
      }
    });
    if (fichasV.length > 0) {
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'unexpo.sbdip@gmail.com',
          pass: 'unexpo.2021'
        }

      });
      for (var j = 0; j < fichasV.length; j++) {
        var mailOptions = {
          from: 'Biblioteca Unexpo <unexpo.sbdip@gmail.com',
          to: fichasV[j].correo_f,
          subject: 'Préstamo vencido',
          html: `<html>
          <head>
            <title>Introducción formularios web</title>
            <meta charset="utf-8"/>
            <meta name="description" />
          
          </head>
          <body>
          
          <form action="#" target="" method="get" name="formDatosPersonales" style ="width:300px;
          padding:16px;
          border-radius:10px;
          margin:auto;
          background-color:#ccc;">
          <div style="height:50px;">
                          <p style="text-align: center; font-size: 20px; color:rgb(0,0,0)">Biblioteca UNEXPO Departamento de Investigacióon y Postgrado</p>
                      </div><br><br>
                      <div class="row">
                      <div class="col-6 col-md-3"style="width:72px;
                      font-weight:bold;
                      display:inline-block;">Querido usuario: </div>
                      <div class="col-6 col-md-3"style="width:190px;
                      font-weight:bold;
                      display:inline-block;">${fichasV[j].correo_f} </div>
                      <div class="col-6 col-md-3"style="width:270px;
                      font-weight:bold;
                      display:inline-block;">Tu préstamo se encuentra vencido, y a continuación la información pertinente:</div>
                      
                  </div>
                  
            <label  style="width:72px;
            font-weight:bold;
            display:inline-block;">Cota </label>
            <input type="text" style="width:180px;
            padding:3px 10px;
            border:1px solid #f6f6f6;
            border-radius:3px;
            background-color:#f6f6f6;
            margin:8px 0;
            display:inline-block;" value="${fichasV[j].cota_f}"/>
          
            <label  style="width:72px;
            font-weight:bold;
            display:inline-block;">Fecha de emisión</label>
            <input type="text" style="width:180px;
            padding:3px 10px;
            border:1px solid #f6f6f6;
            border-radius:3px;
            background-color:#f6f6f6;
            margin:8px 0;
            display:inline-block;" value="${fichasV[j].fecha_e}">
          
            <label  style="width:72px;
            font-weight:bold;
            display:inline-block;">Fecha de devolución</label>
            <input  style="width:180px;
            padding:3px 10px;
            border:1px solid #f6f6f6;
            border-radius:3px;
            background-color:#f6f6f6;
            margin:8px 0;
            display:inline-block;" value="${fichasV[j].fecha_d}" />
            
            <label  style="width:72px;
            font-weight:bold;
            display:inline-block;">Multa</label>
            <input  style="width:180px;
            padding:3px 10px;
            border:1px solid #f6f6f6;
            border-radius:3px;
            background-color:#f6f6f6;
            margin:8px 0;
            display:inline-block;" value="${fichasV[j].multa} ${conf.unidad}" />
            
          </form>
          
          </body>
          </html>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('mensaje enviado: ' + info.response);
            console.log(info);
          }
        });
      }

    }
    if (fichasVigentes.length > 0) {
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'unexpo.sbdip@gmail.com',
          pass: 'unexpo.2021'
        }

      });
      for (var k = 0; k < fichasVigentes.length; k++) {
        var mailOptions = {
          from: 'Biblioteca Unexpo <unexpo.sbdip@gmail.com',
          to: fichasVigentes[k].correo_f,
          subject: 'Préstamo por vencer',
          html: `
 <html>
<head>
	<title>Introducción formularios web</title>
	<meta charset="utf-8"/>
	<meta name="description" />

</head>
<body>

<form action="#" target="" method="get" name="formDatosPersonales" style ="width:300px;
padding:16px;
border-radius:10px;
margin:auto;
background-color:#ccc;">
<div style="height:50px;">
                <p style="text-align: center; font-size: 20px; color:rgb(0,0,0)">Biblioteca UNEXPO Departamento de Investigacióon y Postgrado</p>
            </div><br><br>
            <div class="row">
            <div class="col-6 col-md-3"style="width:72px;
            font-weight:bold;
            display:inline-block;">Querido usuario: </div>
            <div class="col-6 col-md-3"style="width:190px;
            font-weight:bold;
            display:inline-block;">${fichasVigentes[k].correo_f} </div>
            <div class="col-6 col-md-3"style="width:270px;
            font-weight:bold;
            display:inline-block;">Te recordamos que debes entregar tu libro la fecha correspondiente para evitar una multa, a continuación la información de tu préstamo </div>
            
        </div>
        
	<label  style="width:72px;
	font-weight:bold;
	display:inline-block;">Cota </label>
	<input type="text" style="width:180px;
	padding:3px 10px;
	border:1px solid #f6f6f6;
	border-radius:3px;
	background-color:#f6f6f6;
	margin:8px 0;
	display:inline-block;" value="${fichasVigentes[k].cota_f}"/>

	<label  style="width:72px;
	font-weight:bold;
	display:inline-block;">Fecha de emisión</label>
	<input type="text" style="width:180px;
	padding:3px 10px;
	border:1px solid #f6f6f6;
	border-radius:3px;
	background-color:#f6f6f6;
	margin:8px 0;
	display:inline-block;" value="${fichasVigentes[k].fecha_e}">

	<label  style="width:72px;
	font-weight:bold;
	display:inline-block;">Fecha de devolución</label>
	<input  style="width:180px;
	padding:3px 10px;
	border:1px solid #f6f6f6;
	border-radius:3px;
	background-color:#f6f6f6;
	margin:8px 0;
  display:inline-block;" value="${fichasVigentes[k].fecha_d}" />
  
  <label  style="width:72px;
	font-weight:bold;
	display:inline-block;">Multa</label>
	<input  style="width:180px;
	padding:3px 10px;
	border:1px solid #f6f6f6;
	border-radius:3px;
	background-color:#f6f6f6;
	margin:8px 0;
	display:inline-block;" value="${fichasVigentes[k].multa} ${conf.unidad}" />
	
</form>

</body>
</html>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('mensaje enviado: ' + info.response);
            console.log(info);
          }
        });
      }

    }
  } catch (error) {
    console.log(error);
  }
}
//listo elimina reservaciones y notifica que las ha reservado
module.exports.actualizarR = async function (req, res, next) {
  try {
    const reservaciones = await Fichas.findAll({
      where: {
        estado_f: "pendiente"
      }
    });

    for (var j = 0; j < reservaciones.length; j++) {
      let fecha_e = reservaciones[j].fecha_e;
        let dia = fecha_e.split('-')[2];
        let mes = fecha_e.split('-')[1] - 1;
        let año = fecha_e.split('-')[0];
        let fecha_emi = new Date(año, mes, dia);
let resultado1 = fecha_emi < new Date();
let resultado2 = fecha_emi.getDate() === new Date().getDate();
      if (resultado1 && !resultado2 ) {
       
        let eliminadas = await Fichas.destroy({
          where: {
            cota_f: reservaciones[j].cota_f
          }
        });
        if (eliminadas) {
          await Libros.update({
            estado_l: 'disponible',
          }, {
            where: {
              cota: reservaciones[j].cota_f
            }
          })
          var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'unexpo.sbdip@gmail.com',
              pass: 'unexpo.2021'
            }

          });

          var mailOptions = {
            from: 'Biblioteca Unexpo <unexpo.sbdip@gmail.com',
            to: reservaciones[j].correo_f,
            subject: 'Reservación eliminada',
            html: `<html>
            <head>
              <title>Introducción formularios web</title>
              <meta charset="utf-8"/>
              <meta name="description" />
            
            </head>
            <body>
            
            <form action="#" target="" method="get" name="formDatosPersonales" style ="width:300px;
            padding:16px;
            border-radius:10px;
            margin:auto;
            background-color:#ccc;">
            <div style="height:50px;">
                            <p style="text-align: center; font-size: 20px; color:rgb(0,0,0)">Biblioteca UNEXPO Departamento de Investigacióon y Postgrado</p>
                        </div><br><br>
                        <div class="row">
                        <div class="col-6 col-md-3"style="width:72px;
                        font-weight:bold;
                        display:inline-block;">Querido usuario: </div>
                        <div class="col-6 col-md-3"style="width:190px;
                        font-weight:bold;
                        display:inline-block;">${reservaciones[j].correo_f} </div>
                        <div class="col-6 col-md-3"style="width:270px;
                        font-weight:bold;
                        display:inline-block;">Te informamos que la reservación que se anexa fue eliminada por no ser concretada</div>
                        
                    </div>
                    
              <label  style="width:72px;
              font-weight:bold;
              display:inline-block;">Cota </label>
              <input type="text" style="width:180px;
              padding:3px 10px;
              border:1px solid #f6f6f6;
              border-radius:3px;
              background-color:#f6f6f6;
              margin:8px 0;
              display:inline-block;" value="${reservaciones[j].cota_f}"/>
            
              <label  style="width:72px;
              font-weight:bold;
              display:inline-block;">Fecha de emisión</label>
              <input type="text" style="width:180px;
              padding:3px 10px;
              border:1px solid #f6f6f6;
              border-radius:3px;
              background-color:#f6f6f6;
              margin:8px 0;
              display:inline-block;" value="${reservaciones[j].fecha_e}">
            
              <label  style="width:72px;
              font-weight:bold;
              display:inline-block;">Fecha de devolución</label>
              <input  style="width:180px;
              padding:3px 10px;
              border:1px solid #f6f6f6;
              border-radius:3px;
              background-color:#f6f6f6;
              margin:8px 0;
              display:inline-block;" value="${reservaciones[j].fecha_d}" />
              
             
            </form>
            
            </body>
            </html>`
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('mensaje enviado: ' + info.response);

            }
          });
        }
      }
    }
   
    } catch (error) {
      console.log(error);
    }
  };
  //Función que actualiza el estado de la multa
  module.exports.multas = async function (req, res, next) {
    try {
      const fichasVencidas = await Fichas.findAll({
        where: {
          estado_f: 'vencido'
        }
      });
      const conf = await ConfDiasLibros.findOne();
      
      if (fichasVencidas.length > 0) {
        for (var l = 0; l < fichasVencidas.length; l++) {
         
          let multaTotal = parseInt(fichasVencidas[l].multa) + parseInt(conf.multa);
          console.log(multaTotal);
          await Fichas.update({
            multa: multaTotal,
          }, {
            where: {
              correo_f: fichasVencidas[l].correo_f
            }
          });
        }
      }
    

    } catch (error) {
    console.log(error);
    }
  };

 
