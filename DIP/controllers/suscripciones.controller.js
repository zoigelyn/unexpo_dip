const Suscripciones = require('../models/suscripciones');
const Tipo_Suscripcion = require('../models/tipoSuscripcion');
const Usuarios = require('../models/usuarios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var sequelize = require ('../database/database');
const { Op } = require("sequelize");


function sumarDias(dia, fecha) {
    fecha.setDate(fecha.getDate()+dia);
    return fecha
  };
//
module.exports.suscripcionesP = async function (req, res, next) {
try {
    let solicitudes = await Suscripciones.findAll({
        where:{
            [Op.and] :[
                {estado_s: 'pendiente'},
                {comprobante: {
                    [Op.ne]: null
                }
            }
            ] 
        }      
    });
    if (solicitudes) {
        res.status(200).json({
            suscripciones: solicitudes
        });
    }
} catch (error) {
    res.status(500).json({
        message: 'ha ocurrido un error',
        data: {}
    });
}
};
//
module.exports.suscripcionesV = async function (req, res, next) {
    try {
        let solicitudes = await Suscripciones.findAll({
            where: {
            [Op.and] :[
                {estado_s: 'vigente'},
                {comprobante: {
                    [Op.ne]: null
                }
            }
            ] 
        }      
            
        });
        if (solicitudes) {
            res.status(200).json({
                suscripciones: solicitudes
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'ha ocurrido un error',
            data: {}
        });
    }
    };
    //
module.exports.infSuscripcion = async function (req, res, next) {
    let id=req.query.id;
    try {
        let solicitud = await Suscripciones.findOne({
            where: {
                id: id
            }
        });
        if (solicitud) {
            res.status(200).json({
                suscripciones: solicitud
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'ha ocurrido un error',
            data: {}
        });
    }
    };
///
module.exports.todasSuscripciones = async function (req, res, next) {
   
        try {
         let suscripciones = await Tipo_Suscripcion.findAll({
             where:{
                     tipo_ts: {
                         [Op.ne]:'de prueba'
            }
            }
         });
        if (suscripciones) {
          res.status(200).json({
            suscripciones: suscripciones
          });
        }
        } catch (error) {
          res.status(500).json({
            message: 'ha ocurrido un error',
            data: {},
          });   
        }
};

//funcion para ver suscripción
module.exports.verSuscripion = async function (req, res, next) {
    let suscripcion=req.query.s;
     try {
      let existe = await Tipo_Suscripcion.findOne({
       where:{
         tipo_ts: suscripcion
       }
      });
      if (existe) {
       res.status(200).json(existe);
      }
       
    
     
     } catch (error) {
       res.status(500).json({
         message: 'ha ocurrido un error',
         data: {},
       });   
     }
  
  };

 // funcion que actualiza una categoria
 module.exports.actualizarS = async function (req, res, next) {
    let suscripcion= req.body.suscripcion;
    let costo = req.body.costo;
    let vigencia = req.body.vigencia
    
     try {
      let existe = await Tipo_Suscripcion.update({
        costo: costo,
        vigencia: vigencia
      },{
       where:{
         tipo_ts: suscripcion
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
  // mis suscripciones
  module.exports.misSuscripciones = async function (req, res, next) {
      let usuario = req.session.usuarioL;
      try {
          const misSuscripcion = await Suscripciones.findAll({
              where: {
                  correo_s: usuario.correo_u
              }
          });
          if (misSuscripcion) {
              res.status(200).json(misSuscripcion);
          }
      } catch (error) {
          res.status(500).json({
              message: 'Ha ocurrido un error',
              data: {}
          });
      }
  };
  //funcion para eliminar una suscripción
  module.exports.eliminarSusV = async function (req, res, next) {
    let id = req.query.id;
    try {
        let suscripcion = await Suscripciones.findOne({
            where: {
                id: id
            }
        });
        const dias = await Tipo_Suscripcion.findOne({
            where: {
                tipo_ts: solicitud.tipo
            }
        });
        let fecha = new Date();
        let diaV = sumarDias(dias.vigencia, fecha);
        let tipoU = await Usuarios.findOne({
            where: {
                correo_u: suscripcion.correo_s
            }
        });
        if (tipoU.tipo_u === 'bibliotecario' || tipoU.tipo_u === 'administrador') {
            res.status(200).send('No se permite la eliminación de la suscripción por ser bibliotecario ó administrador');
        } else if (tipoU.tipo_u === 'estudiante' && suscripcion.tipo === 'estandar') {
            res.status(200).send('No se permite la eliminación de la suscripción por ser un estudiante activo');
        
        } else if (tipoU.tipo_u === 'docente') {
            res.status(200).send('No se permite la eliminación de la suscripción por ser un docente activo');
        
        } else if (tipoU.tipo_u === 'estudiante' && suscripcion.tipo !== 'estandar') {
            let e = await Suscripciones.update({
                tipo:'estandar',
                estado_s:'vigente',
                fecha_c: diaV
            }, {

                where: {
                    id: id
                }
            
            });

            if (e) {
                res.status(200).send('Eliminada con éxito');
            }
         } else {
            let e = await Suscripciones.destroy({
                where: {
                    id: id
                }
            });

            if (e) {
                res.status(200).send('Eliminada con éxito');
            }
        }
    } catch (error) {
        res.status(500).json({
            message: 'ha ocurrido un error',
            data: {},
          });  
    }
};
//funcion para verifcar que no exista otra solicitud de ese tipo
module.exports.solicitudUnica = async function(req, res, next) {
    try {
        let correo = req.session.usuarioL.correo_u;
        const existeS = await Suscripciones.findOne({
            where: {
                [Op.and]:[
                    {correo_s: correo},
                    {estado_s:'pendiente'}
                ]
            }
        });
        if( existeS) {
            res.status(200).send('Ya tiene un petición en espera');
        } else {
            next()
        }
    } catch (error) {
        res.status(500).json({
            data:{},
            message:'Ha ocurrido un error'
        });
    }
};
  //funcion para eliminar una suscripción
  module.exports.eliminarSusP = async function (req, res, next) {
    let id = req.query.id;
    try {
        let suscripcion = await Suscripciones.findOne({
            where: {
                id: id
            }
        });
        let tipoU = await Usuarios.findOne({
            where: {
                correo_u: suscripcion.correo_s
            }
        });
        
            let e = await Suscripciones.destroy({
                where: {
                    id: id
                }
            });

            if (e) {
                res.status(200).send('Eliminada con éxito');
            }
        
    } catch (error) {
        res.status(500).json({
            message: 'ha ocurrido un error',
            data: {},
          });  
    }
};
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  
    });
    return uuid;
  };

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads/comprobantes'),
    filename: (req, file, cb) => {
      cb(null, generateUUID() + path.extname(file.originalname).toLowerCase()); 
    }
  });

const upload = multer({
    storage: storage,
     dest: path.join(__dirname, '../public/uploads/comprobantes'),
     fileFilter: (req, file, cb) => {
       const fileType = /pdf|jpg|png|jpeg/;
       const mimetype = fileType.test(file.mimetype.toLowerCase());
       const extname = fileType.test(path.extname(file.originalname.toLowerCase()));
       if (mimetype && extname){
         return cb(null, true)
       }
       cb("Error: El archivo debe ser un  pdf, jpg, jpeg o png");
       console.log(file[0]);
     }
  });
module.exports.upload = upload;



//funcion que cargue y almacene ek comprobante del pago
module.exports.cargarComprobante = async function (req, res, next) {
    try {
        let suscripcionCreada;
        const { suscripcion } = req.body;
        const dias = await Tipo_Suscripcion.findOne({
           where: {
            tipo_ts: suscripcion
           } 
        });
        let fecha = new Date();
        let diaV = sumarDias(dias.vigencia, fecha);
    
        if (req.file) {
            let direccion = "/uploads/comprobantes/" + req.file.filename;
            suscripcionCreada = await Suscripciones.create({
                tipo: suscripcion,
                correo_s: req.session.usuarioL.correo_u,
                estado_s: 'pendiente',
                fecha_c: diaV,
                comprobante: direccion
            });
           
        }
         if (suscripcionCreada) {
             res.status(200).send('Se ha solicitado con éxito');
         }
    } catch (error) {
        res.status(500).json({
            message: 'ha ocurrido un error',
            data: {},
          }); 
    }

};
//función para aprobar uns suscripción
module.exports.aprobarSolicitud = async function (req, res, next) {
    try {
        const id = req.query.id;
        
        const solicitud = await Suscripciones.findOne({
            where: {
                id: id
        }
    });
        const dias = await Tipo_Suscripcion.findOne({
            where: {
                tipo_ts: solicitud.tipo
            }
        });
        let fecha = new Date();
        let diaV = sumarDias(dias.vigencia, fecha);
    
          let suscripcionActualizada = await Suscripciones.update({
                estado_s: 'vigente',
                fecha_c: diaV,
                },{where: {
                        id: id
                    }
                });
           
        
         if (suscripcionActualizada) {
            const solicitudV = await Suscripciones.findOne({
                where: {
                    [Op.and]:[
                        {estado_s:'vigente'},
                        {correo_s: req.session.usuarioL.correo_u},
                        {
                            id: {
                                [Op.ne]:[id]
                            }
                        }
                    ]
                }
            });
            if (solicitudV) {
                const soliciudEliminada = await Suscripciones.destroy({
                    where: {
                        id: solicitudV.id
                    }
                });

                if (soliciudEliminada) {
                    
                res.status(200).send('Se ha aprobado con éxito');
         
                }
            }
            }
    } catch (error) {
        res.status(500).json({
            message: 'ha ocurrido un error',
            data: {},
          }); 
    }

};