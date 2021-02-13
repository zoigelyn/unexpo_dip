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
    if (prestamos){
      res.status(200).send({fichas: prestamos});
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
    if (prestamos){
      res.status(200).send({fichas: prestamos});
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
    if (prestamos){
      res.status(200).send({fichas: prestamos});
    }

  } catch (error) {
   res.status(500);
  }


};

// funcion para reservar un libro
module.exports.reservarLibro = async function (req, res, next) {
 
  const { cota, fecha_e } = req.body;
  let reservas = {};

   reservas = await Fichas.findAll({
    where: {
      correo_f: req.session.usuarioL.correo_u
    }
  });
  const configurado = await ConfDiasLibros.findOne();
  const cantidadL = configurado.cantidad_libros;
  const cantidadD = configurado.dias_prestamo;

  function sumarDias(dia, fecha_emision) {
    var diaSemana = 5;
    var i = 0;
    while (diaSemana == 5 || diaSemana == 6) {
     
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
    var fecha_emision = fecha_e;
  } else {
    var fecha_emision = new Date();
  }




  try {
    if (reservas.length < cantidadL) {
      const dia = cantidadD;
      var nd = sumarDias(dia, fecha_emision);
      let fecha_d = new Date(nd);
      if (!fecha_d) {
        var fecha_devolucion = nd;
      }
      else {
        var fecha_devolucion = fecha_d;
      };

   let  nFicha = await Fichas.create({
        cota_f: cota.toLowerCase(),
        correo_f: req.session.usuarioL.correo_u,
        fecha_e: fecha_emision,
        fecha_d: fecha_devolucion,
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



      if (nFicha && actualizadoL){
        res.status(200).send('Se ha reservado con exito');
      }else{
        res.status(500).send({
          message: 'Libro no reservado'
        });
      };
    } else if (reservas.length >= cantidadL) {
      res.status(200).send('has llegado al limite');
    };

  } catch (error) {
    console.log(error);
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
     
       if ( fichas[i].cota_f === libros[j].cota){
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
          { estado_f: 'vigente',
          correo_f: req.session.usuarioL.correo_u },
          { estado_f: 'vencido',
          correo_f: req.session.usuarioL.correo_u }
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
     
       if ( fichas[i].cota_f === libros[j].cota){
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
  console.log(cota);
  try {
    const ficha = await Fichas.findOne({
      where: {
        cota_f: cota
      }
    });
    console.log('-------------------------');
    console.log(ficha)
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

  let  cota  = req.body.cota;

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
       actualizarE =  await Libros.update({
        estado_l: 'disponible',
      } , {
        where: {cota: cota}
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
     actualizarEstado =  await Libros.update({
       estado_l: 'disponible',
     } , {
       where: {cota: cota}
      });
    }
    if (fichaEliminada != '' && actualizarEstado != '' ) {
res.status(200).send('Libro entregado exitosamente');
    }

  } catch (error) {
   res.status(500);
  }
};



//Elimina una ficha entregada listo
module.exports.eliminarFichaE = async function (req, res, next) {

  const  cota  = req.query.cota;

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
      fecha_d : {
        [Op.lt] : new Date()
      },
      estado_f: 'vigente'
    }
  });
  if (fichas.length > 0) {
    for (var i = 0; i < fichas.length; i++) {
      await Fichas.update({
        estado_f: "vencido",
      }, {
        where: {
          correo_f: fichas[i].correo_f
        }
      });
    }
      }
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
                html: `<div class="container-fluid" style="border-color: teal; border-radius: 10px;">
        
                <div style="height:50px;">
                    <p style="text-align: center;background-color: rgb(45, 101, 206); font-size: 20px; color:rgb(0,0,0)">Biblioteca UNEXPO Departamento de Investigacióon y Postgrado</p>
                </div>
                    <div class="row">
                        <div class="col-6 col-md-3">Querido usuario: </div>
                        <div class="col-6 col-md-3">${fichasV[j].correo_f} </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-12 col-md-8">Te recordamos que el préstamo del libro ya se encuentra vencido. Te agradecemos que lo regreses para que alguien más lo pueda utilizar. </div>
                        
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-8">Recuerda que el libro que debes consignar es: </div>
                            
                            </div>
                        <div class="row">
                        <div class="col-6 col-sm-4">Cota: ${fichasV[j].cota_f}</div>
                        </div>
     </div>`
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
            html: `<div class="container-fluid" style="border-color: teal; border-radius: 10px;">
    
            <div style="height:50px;">
                <p style="text-align: center;background-color: rgb(45, 101, 206); font-size: 20px; color:rgb(0,0,0)">Biblioteca UNEXPO Departamento de Investigacióon y Postgrado</p>
            </div>
                <div class="row">
                    <div class="col-6 col-md-3">Querido usuario: </div>
                    <div class="col-6 col-md-3">${fichasVigentes[k].correo_f} </div>
                </div>
                
                <div class="row">
                    <div class="col-12 col-md-8">Te recordamos que debes entregar tu libro el día ${fichasVigentes[k].fecha_d}, sino debes atenerte a la suspención respectiva. </div>
                    
                    </div>
                    <div class="row">
                        <div class="col-12 col-md-8">Recuerda que el libro que debes consignar es: </div>
                        
                        </div>
                    <div class="row">
                    <div class="col-6 col-sm-4">Cota: ${fichasVigentes.cota_f}</div>
                    </div>
 </div>`
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
  next(error);
}
};
//listo elimina reservaciones y notifica que las ha reservado
module.exports.actualizarR = async function(req, res, next) {
try {
  const reservaciones = await Fichas.findAll({
    where: {
      estado_f: "pendiente",
      fecha_e: {
        [Op.lt]: new Date()
      }
    }
  });
  if (reservaciones) {
   const eliminadas = await Fichas.destroy({where: reservaciones});
   if (eliminadas) {
     await Libros.update({
      estado_l: 'disponible',
    } , {
      where: reservaciones
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
          for (var j = 0; j < reservaciones.length; j++) {
            var mailOptions = {
              from: 'Biblioteca Unexpo <unexpo.sbdip@gmail.com',
              to: reservaciones[j].correo_f,
              subject: 'Reservación eliminada',
              html: `<div class="container-fluid" style="border-color: teal; border-radius: 10px;">
      
              <div style="height:50px;">
                  <p style="text-align: center;background-color: rgb(45, 101, 206); font-size: 20px; color:rgb(0,0,0)">Biblioteca UNEXPO Departamento de Investigacióon y Postgrado</p>
              </div>
                  <div class="row">
                      <div class="col-6 col-md-3">Querido usuario: </div>
                      <div class="col-6 col-md-3">${reservaciones[j].correo_f} </div>
                  </div>
                  
                  <div class="row">
                      <div class="col-12 col-md-8">La fecha que habías selecionado para el retiro ya se venció. </div>
                      
                      </div>
                      <div class="row">
                          <div class="col-12 col-md-8">El libro que tenías reservado era: </div>
                          
                          </div>
                      <div class="row">
                      <div class="col-6 col-sm-4">Cota: ${reservaciones[j].cota_f}</div>
                      </div>
   </div>`
            };
      
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('mensaje enviado: ' + info.response);
                
              }
            });
  }
  next();       
} 
   
  
  }else{
    next();
  }
    
 
} catch (error) {
  next(error)
}
};
module.exports.multas = async function (req, res, next) {
  try {
    const fichas = await Fichas.findAll({
      where: {
        estado_f: 'vencido'
      }
    });
    const conf = await ConfDiasLibros.findOne();
    if (fichas.length > 0) {
      for (var i = 0; i < fichas.length; i++) {
        let multaTotal = Number(fichas.multa)  + Number(conf.multa)
        await Fichas.update({
         multa: multaTotal,
        }, {
          where: {
            correo_f: fichas[i].correo_f
          }
        });
      }
        }
       
   
  } catch (error) {
    next(error);
  }
  };