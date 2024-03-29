const Estudiantes = require("../models/estudiantes");
const Docentes = require("../models/docentes");
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const Tipo_Suscripcion = require("../models/tipoSuscripcion");
const Suscripciones = require("../models/suscripciones");
const Usuarios = require("../models/usuarios");
const { Console } = require("console");

function sumarDias(dia, fecha) {
  fecha.setDate(fecha.getDate()+dia);
  return fecha
};
//funcion para generar un id unico en base a la hora y fecha
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);

  });
  return uuid;
};
// funcion donde se expresa la ubicación del archivo
//En este caso selecciono una ubicación no publica, para que esta no sea accesible a nadie más
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../noPublic/uploads'),//ubicación del archivo
  filename: (req, file, cb) => {
    cb(null, generateUUID() + path.extname(file.originalname).toLowerCase()); // se genera un id unico y se le añade el tipo de archivo de mi archivo original 
  }
});
//Se realiza un filtro para que solo sea posible añadir archivos .xlsx
const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("spreadsheetml")//formato xlsx(excel)
  ) {
    cb(null, true);
  } else {
    cb("Por favor solo carga archivos .xlsx", false);
  }
};
//Configuracion de multer tal como se muestra en la información oficial npm

const upload = multer({
  storage: storage,
  dest: path.join(__dirname, '../noPublic/uploads'),
  fileFilter: excelFilter
});
module.exports.upload = upload;

module.exports.insertarBaseE = async function (req, res, next) {

  try {
    let bandera = 0;
    // si se realiza la carga de archivo exitosamente se gernera un objeto file, el cual es accesible desde req, y en el se encuentra toda la informacion del archivo cargado
    let ruta = path.join(__dirname, '../noPublic/uploads/', req.file.filename)//ruta del archivo

    readXlsxFile(ruta).then(async function (rows) {//el middleware toma el archivo de la ruta y extrae las filas
      rows.shift(); //Se desplaza el primer elemento, el encabezado

      let estudiantes = [];
      //Expresiones regulares para verificar el formato de entrada de loa datos a la base de datos
      //Esto es necesario porque no existe validacion en el frontEnd
      const regExpIdalumno = new RegExp(/^[\d]{1,10}$/);
      const regExpCedula = new RegExp(/^([\d\s]||Null){0,11}$/i);
      const regExpPasaporte = new RegExp(/(^[a-z- -á]{0,10}$)/i);
      const regExpApellidos = new RegExp(/(^[a-z- -á]{0,}$)/i);
      const regExpNombres = new RegExp(/(^[a-z- -á]{0,}$)/i);
      const regExpNacionalidad = new RegExp(/^([\d\s]||Null){0,11}$/i);
      const regExpFechanac = new RegExp(/(^[a-z- -á]{0,10}$)/i);
      const regExpEstadonac = new RegExp(/(^[a-z- -á]{0,}$)/i);
      const regExpCiudadnac = new RegExp(/(^[a-z- -á]{0,}$)/i);
      const regExpSexo = new RegExp(/^([\d\s]||Null){0,11}$/i);
      const regExpDireccionhab = new RegExp(/(^[a-z- -á]{0,50}$)/i);
      const regExpTelefonohab = new RegExp(/(^[a-z- -á]{0,11}$)/i);
      const regExpDireccionlab = new RegExp(/(^[a-z- -á]{0,50}$)/i);
      const regExpTelefonolab = new RegExp(/(^[a-z- -á]{0,11}$)/i);
      const regExpEmail = new RegExp(/(^[a-z- -á]{0,40}$)/i);
      const regExpMovil = new RegExp(/(^[a-z- -á]{0,11}$)/i);
      const regExpNivelest = new RegExp(/^([\d\s]||Null){0,11}$/i);
      const regExpTitulo = new RegExp(/(^[a-z- -á]{0,}$)/i);
      const regExpInstitucion = new RegExp(/(^[a-z- -á]{0,}$)/i);
      const regExpFechaegrins = new RegExp(/(^[a-z- -á]{0,10}$)/i);

      //Se recorrren todas las filas una a una
      rows.forEach((row) => {
        for (var i=0; i<row.length; i++) {
          if (row[i] =='NULL' || row[i] == 'null' || row[i] == 'Null') {
          row[i] = null;
        }
        }
        
        let estudiante = {
          id: row[0],
          cedula: row[1],
          pasaporte: row[2],
          apellidos: row[3],
          nombres: row[4],
          nacionalidad: row[5],
          fechanac: row[6],
          estadonac: row[7],
          ciudadnac: row[8],
          sexo: row[9],
          direccionhab: row[10],
          telefonohab: row[11],
          direccionlab: row[12],
          telefonolab: row[13],
          email: row[14],
          movil: row[15],
          nivelest: row[16],
          titulo: row[17],
          institucion: row[18],
          fechaegrins: row[19]

        };
        //Se utiliza el metodo test para comprobar que cada una de las expresiones regulares se cumple

        const resultadoIdalumno = regExpIdalumno.test(estudiante.id);
        const resultadoCedula = regExpCedula.test(estudiante.cedula);
        const resultadoPasaporte = regExpPasaporte.test(estudiante.pasaporte);
        const resultadoApellidos = regExpApellidos.test(estudiante.apellidos);
        const resultadoNombres = regExpNombres.test(estudiante.nombres);
        const resultadoNacionalidad = regExpNacionalidad.test(estudiante.nacionalidad);
        const resultadoFechanac = regExpFechanac.test(estudiante.fechanac);
        const resultadoEstadonac = regExpEstadonac.test(estudiante.estadonac);
        const resultadoCiudadnac = regExpCiudadnac.test(estudiante.ciudadnac);
        const resultadoSexo = regExpSexo.test(estudiante.sexo);
        const resultadoDireccionhab = regExpDireccionhab.test(estudiante.direccionhab);
        const resultadoTelefonohab = regExpTelefonohab.test(estudiante.telefonohab);
        const resultadoDireccionlab = regExpDireccionlab.test(estudiante.direccionlab);
        const resultadoTelefonolab = regExpTelefonolab.test(estudiante.telefonolab);
        const resultadoEmail = regExpEmail.test(estudiante.email);
        const resultadoMovil = regExpMovil.test(estudiante.movil);
        const resultadoNivelest = regExpNivelest.test(estudiante.nivelest);
        const resultadoTitulo = regExpTitulo.test(estudiante.titulo);
        const resultadoInstitucion = regExpInstitucion.test(estudiante.institucion);
        const resultadoFechaegrins = regExpFechaegrins.test(estudiante.fechaegrins);
        if (resultadoIdalumno) {
          if(resultadoCedula) {
            if (resultadoPasaporte) {
              if (resultadoApellidos) {
                if(resultadoNombres) {
                  if (resultadoNacionalidad) {
                    if (resultadoFechanac) {
                      if (resultadoEstadonac) {
                        if (resultadoCiudadnac) {
                          if (resultadoSexo) {
                            if (resultadoDireccionhab) {
                              if (resultadoTelefonohab) {
                                if (resultadoDireccionlab) {
                                  if (resultadoTelefonolab) {
                                    if (resultadoEmail) {
                                      if (resultadoMovil) {
                                        if (resultadoNivelest) {
                                          if (resultadoTitulo) {
                                            if ( resultadoInstitucion) {
                                              if (resultadoFechaegrins) {
                                                estudiantes.push(estudiante);// si se cumple cada una de las expresiones regulares entonces el estudiante se añade al arreglo estudianttes
      
                                              } else {
                                                res.status(500).send({
                                                  message: 'Formato de fechaegrins incorrecto '
                                                });
                                              }
                                            } else {
                                              res.status(500).send({
                                                message: 'Formato de institución incorrecto '
                                              });
                                            }
                                          } else {
                                            res.status(500).send({
                                              message: 'Formato de titulo incorrecto '
                                            });
                                          }
                                        } else {
                                          res.status(500).send({
                                            message: 'Formato de nivelest incorrecto '
                                          });
                                        }
                                      } else {
                                        res.status(500).send({
                                          message: 'Formato de movil incorrecto '
                                        });
                                      }
                                    } else {
                                      res.status(500).send({
                                        message: 'Formato de email incorrecto '
                                      });
                                    }
                                  } else {
                                    res.status(500).send({
                                      message: 'Formato de telefonolab incorrecto '
                                    });
                                  }
                                } else {
                                  res.status(500).send({
                                    message: 'Formato de direccionlab incorrecto '
                                  });
                                }
                              } else {
                                res.status(500).send({
                                  message: 'Formato de telefonohab incorrecto '
                                });
                              }
                            } else {
                              res.status(500).send({
                                message: 'Formato de direccionhab incorrecto '
                              });
                            }
                          } else {
                            res.status(500).send({
                              message: 'Formato de sexo incorrecto '
                            });
                          }
                        } else {
                          res.status(500).send({
                            message: 'Formato de ciudadnac incorrecto '
                          });
                        }
                      } else {
                        res.status(500).send({
                          message: 'Formato de estadonac incorrecto '
                        });
                      }
                    } else {
                      res.status(500).send({
                        message: 'Formato de fechanac incorrecto '
                      });
                    }
                  } else {
                    res.status(500).send({
                      message: 'Formato de nacionalidad incorrecto '
                    });
                  }
                } else {
                  res.status(500).send({
                    message: 'Formato de nombres incorrecto '
                  });
                }
              } else {
                res.status(500).send({
                  message: 'Formato de apellidos incorrecto '
                });
              }
            } else {
              res.status(500).send({
                message: 'Formato de pasaporte incorrecto '
              });
            }
          } else {
            res.status(500).send({
              message: 'Formato de cedula incorrecto '
            });
          }
        }  else {
          res.status(500).send({
            message: 'Formato de idalumno incorrecto '
          });
        }
             
      });

      //Se elimina la información de la tabla de estudiantes anterior
      await Estudiantes.destroy({
        where:
        {
          idalumno: {
            [Op.ne]: null
          }
        }
      });
      // se crea por lote en la tabla Estudiantes
      let creacion = await Estudiantes.bulkCreate(estudiantes);


      if (creacion) { //Si se realiza la creacion se buscan usuarios con el tipo de usuario "estudiante"
        let filePath = path.join(__dirname, '../noPublic/uploads/', req.file.filename);
        fs.unlinkSync(filePath);
        const usuariosE = await Usuarios.findAll({//Se realiza una busqueda en el modelo Estudiante con el metodo findAll proporcionado por sequelize
          where: {
            tipo_u: 'estudiante'// la busqueda se condiciona
          }
        });

        const usuarios = await Usuarios.findAll(); // Se realiza una busqueda completa sin condición 
        if (usuarios.length > 0) { // si existen usuarios 
          for (var j = 0; j < usuarios.length; j++) {//se recorre cada usuario
            for (var k = 0; k < creacion.length; k++) {// se recorre cada estudiante de la informacion registrada
              if (usuarios[j].cedula_u === creacion[k].cedula && usuarios[j].tipo_u != 'estudiante') {//Si existe un usuario que se encuentre en la nueva data de estudiantes creados y que no tenga el tipo de usuario "estudiante", se procede a cambiar el tipo de usuario y el tipo de suscripcion en la tabla usuario
                bandera = 1;
                let suscripcion = await Tipo_Suscripcion.findOne({
                  where: {
                      tipo_ts: 'estandar'
                  }
              });
              let fecha = new Date();
              let diaV = sumarDias(suscripcion.vigencia, fecha);
              
              
                var igualdad = await Usuarios.update({//Se actualiza con el metodo update que proporciona sequelize
                  tipo_u: 'estudiante',
                  estado_s: 'vigente',
                  tipo_s: 'estandar',
                  fecha_s: diaV

                }, {
                  where: {
                    cedula_u: usuarios[j].cedula_u
                  }
                });
               
              
              

    if (igualdad) {
        const suscripciones = await Suscripciones.create({
        tipo: 'estandar',
        correo_s: usuarios[j].correo_u,
        estado_s: 'vigente',
        fecha_c: diaV
    });
    }
              }
            }

          }
        }
        if (usuariosE.length > 0) {//Si existen usuarios con el tipo de usuario "estudiante"

          for (var i = 0; i < usuariosE.length; i++) {//Se recorre cada usuario
            
            if (usuariosE[i].cedula !== null && usuariosE[i].cedula !== 'undefined') {
              console.log(usuariosE[i].cedula);
               var existe = await Estudiantes.findOne({//Si la cedula del usuario que se encuentra con el tipo de usuario "estudiante" se encuentra en la tabla estudiante se crea existe
              where: {
                cedula: usuariosE[i].cedula
              }
            });
            if (existe == null) {// si exite es igual a null quiere decir que el usuario con tipo de usuario estudiante no se encuentra en la tabla de estudiantes
              let suscripcion = await Tipo_Suscripcion.findOne({
                where: {
                    tipo_ts: 'de prueba'
                }
            });
            let fecha = new Date();
            let diaV = sumarDias(suscripcion.vigencia, fecha);
              var actualizado = await Usuarios.update({//Se actualiza el tipo de usuario a lector
                tipo_u: 'lector',
                tipo_s: 'de prueba',
                estado_s: 'vigente',
                fecha_s: diaV
              }, {
                where: {
                  cedula_u: usuariosE[i].cedula
                }
              })
              if (actualizado) {
                const suscripciones = await Suscripciones.create({
                tipo: 'de prueba',
                correo_s: usuariosE[i].correo_u,
                estado_s: 'vigente',
                fecha_c: diaV
            });
            }
            }
            }
            if (usuariosE[i].pasaporte !== null && usuariosE[i].pasaporte !== 'undefined') {
              console.log(usuariosE[i].pasaporte);
             var existe = await Estudiantes.findOne({//Si la cedula del usuario que se encuentra con el tipo de usuario "estudiante" se encuentra en la tabla estudiante se crea existe
            where: {
              cedula: usuariosE[i].pasaporte
            }
          });
          if (existe == null) {// si exite es igual a null quiere decir que el usuario con tipo de usuario estudiante no se encuentra en la tabla de estudiantes
            let suscripcion = await Tipo_Suscripcion.findOne({
              where: {
                  tipo_ts: 'de prueba'
              }
          });
          let fecha = new Date();
          let diaV = sumarDias(suscripcion.vigencia, fecha);
           var actualizado = await Usuarios.update({//Se actualiza el tipo de usuario a lector
              tipo_u: 'lector',
              tipo_s: 'de prueba',
              estado_s: 'vigente',
              fecha_s: diaV
            }, {
              where: {
                pasaporte: usuariosE[i].pasaporte
              }
            })
            if (actualizado) {
             const suscripciones = await Suscripciones.create({
              tipo: 'de prueba',
              correo_s: usuariosE[i].correo_u,
              estado_s: 'vigente',
              fecha_c: diaV
          });
          }
          }
          }
          }
        }
        console.log(usuariosE.length);
        console.log(existe);
        console.log(actualizado);
        console.log(bandera);
        if (usuariosE.length > 0 && existe == null && actualizado && bandera == 0) {// si existen usuarios con tipo de usuario "estudiante" y  existen usuarios que tengan tipo de usuario "estudiante" y no se encuentre en la tabla estudiante y que se haya realizado un cambio de tipo de usuario de estudiante a lector y no existan estudiantes en la tabla estudiantes que hayan tenido un tipo de usuario distinto a "estudiante"
          res.status(200).send({
            message: "Actualizada con éxito",
          });
        } else if (usuariosE.length > 0 && existe != null && bandera == 0) {// si existen usuarios con tipo de usuario "estudiante" y no existen usuarios que tengan tipo de usuario "estudiante" y no se encuentre en la tabla estudiante  y no existan estudiantes en la tabla estudiantes que hayan tenido un tipo de usuario distinto a "estudiante"
          res.status(200).send({
            message: "Actualizada con éxito",
          });
        } else if (usuariosE.length > 0 && existe == null && actualizado && bandera == 1 && igualdad) { // si existen usuarios con tipo de usuario "estudiante" y  existen usuarios que tengan tipo de usuario "estudiante" y no se encuentre en la tabla estudiante y que se haya realizado un cambio de tipo de usuario de estudiante a lector y  existan estudiantes en la tabla estudiantes que hayan tenido un tipo de usuario distinto a "estudiante" y se haya realizado el cambio a "estudiante" a los usuarios con el tipo de usuario erroneo
          res.status(200).send({
            message: "Actualizada con éxito",
          });
        } else if (usuariosE.length == 0 && bandera == 1 && igualdad) {
          res.status(200).send({// si no existen usuarios con tipo de usuario "estudiante"  y  existan estudiantes en la tabla estudiantes que hayan tenido un tipo de usuario distinto a "estudiante" y se haya realizado la actualizacion al tipo de usuario "estudiante" 
            message: "Actualizada con éxito",
          });
        } else if (usuariosE.length == 0 && bandera == 0) {//no existen usuarios registrados y tampoco diferencias en el tipo de usuarios
          res.status(200).send({
            message: "Actualizada con éxito",
          });
        }



      }
    });


  } catch (error) {//Se envia el status correspondiente y el mensaje
    res.status(500).send({
      message: "Datos no importados en la base de datos estudiantes",
    });
  }


};

module.exports.insertarBaseD = async function (req, res, next) {

  try {
    let bandera = 0;
    let ruta = path.join(__dirname, '../noPublic/uploads/', req.file.filename)// ruta del archivo excel

    readXlsxFile(ruta).then(async function (rows) {

      rows.shift(); // Extrae el primer elemento, el elemento cero

      //Expresiones regulares para verificar el formato de entrada de loa datos a la base de datos
      //Esto es necesario porque no existe validacion en el frontEnd
      let docentes = [];
      const regExpIddocente = new RegExp(/^\d{1,10}$/);
      const regExpCeddoc = new RegExp(/^([\d\s]||Null){0,11}$/i);
      const regExpApedoc = new RegExp(/(^[a-z- -á]{0,}$)/i);
      const regExpNomdoc = new RegExp(/(^[a-z- -á]{0,}$)/i);
      const regExpFecnacdoc = new RegExp(/(^[a-z- -á]{0,10}$)/i);
      const regExpTeldoc = new RegExp(/(^[a-z- -á]{0,12}$)/i);
      const regExpMovdoc = new RegExp(/(^[a-z- -á]{0,12}$)/i);
      const regExpEmadoc = new RegExp(/(^[a-z- -á]{0,40}$)/i);
      const regExpTitdoc = new RegExp(/(^[a-z- -á]{0,}$)/i);
            rows.forEach((row) => {
        let docente = {
          iddocente: row[0],
          ceddoc: row[1],
          apedoc: row[2],
          nomdoc: row[3],
          fecnacdoc: row[4],
          teldoc: row[5],
          movdoc: row[6],
          emadoc: row[7],
          titdoc: row[8]
        };
        //Se utiliza el metodo test para comprobar si se cumplen las expresiones regulares
        
        const resultadoIddocente = regExpIddocente.test(docente.iddocente);
        const resultadoCeddoc = regExpCeddoc.test(docente.ceddoc);
        const resultadoApedoc = regExpApedoc.test(docente.apedoc);
        const resultadoNomdoc = regExpNomdoc.test(docente.nomdoc);
        const resultadoFecnacdoc = regExpFecnacdoc.test(docente.fecnacdoc);
        const resultadoTeldoc = regExpTeldoc.test(docente.teldoc);
        const resultadoMovdoc = regExpMovdoc.test(docente.movdoc);
        const resultadoEmadoc = regExpEmadoc.test(docente.emadoc);
        const resultadoTitdoc = regExpTitdoc.test(docente.titdoc);
        if (resultadoIddocente) {
          if (resultadoCeddoc) {
            if (resultadoApedoc) {
              if (resultadoNomdoc) {
                if (resultadoFecnacdoc) { 
                  if (resultadoTeldoc) { 
                     if (resultadoMovdoc) { 
                       if (resultadoEmadoc) {
                         if (resultadoTitdoc) {
      
                          //Si se cummplen las expresiones regulares se añade cada docente a el arreglo docentes
                          docentes.push(docente);
                        }  else {
                          res.status(500).send({
                            message: 'Formato de titdoc incorrecto'
                          });
                        }
                      }  else {
                        res.status(500).send({
                          message: 'Formato de emadoc incorrecto'
                        });
                      }
                    }  else {
                      res.status(500).send({
                        message: 'Formato de movdoc incorrecto'
                      });
                    }
                  }  else {
                    res.status(500).send({
                      message: 'Formato de teldoc incorrecto'
                    });
                  }
                } else {
                  res.status(500).send({
                    message: 'Formato de fecnacdoc incorrecto'
                  });
                }
              } else {
                //mensajes de respuesta en caso de que no se cumpla alguna de las expresiones regulares
                res.status(500).send({
                  message: 'Formato de nomdoc incorrecto'
                });
              }
            } else {
              res.status(500).send({
                message: 'Formato de apedoc incorrecto'
              });
            }
          } else {
            res.status(500).send({
              message: 'Formato de cedula incorrecto'
            });
          }
        } else {
          res.status(500).send({
            message: 'Formato de iddocente incorrecto'
          });
        }

      });

      //Se elimina la informacion contenida en la tabla docente
      await Docentes.destroy({
        where:
        {
          iddocente: {
            [Op.ne]: null
          }
        }
      });

      let creacion = await Docentes.bulkCreate(docentes);//Se utiliza el metodo de sequeliza para crear por lote el arreglo docentes


      if (creacion) {
        let filePath = path.join(__dirname, '../noPublic/uploads/', req.file.filename); //si se realiza la creacion se procede a eliminar el archivo excel, debido a que no es necesario su almacenamiento despues de haber importado los datos en la base de datos
        fs.unlinkSync(filePath);
        var usuariosD = await Usuarios.findAll({//consulta del modelo Usuarios
          where: {
            tipo_u: 'docente'//se condiciona la consulta para usuarios con el tipo de dato docente
          }
        });

        let usuarios = await Usuarios.findAll();//Se realiza una consulta de busqueda completa, sin condiciones
        if (usuarios.length > 0) {//si existen usuarios en la tabla usuarios
          for (var j = 0; j < usuarios.length; j++) {//se recorre cada usuario
            for (var k = 0; k < creacion.length; k++) {//Se recorre cada docente
              if (usuarios[j].cedula_u === creacion[k].ceddoc && usuarios[j].tipo_u != 'docente') {//Si la cedula de un usuario se encuetra registrada en la nueva creacion de tabla docente y este tiene tipo de usuario distinto a docente se procede a cambiar
                bandera = 1;
                let suscripcion = await Tipo_Suscripcion.findOne({
                  where: {
                      tipo_ts: 'premium'
                  }
              });
              let fecha = new Date();
              let diaV = sumarDias(suscripcion.vigencia, fecha);
                var igualdad = await Usuarios.update({//Se actualiza el campo tipo de usuario a "docente"
                  tipo_u: 'docente',
                  tipo_s: 'premium',
                  fecha_s: diaV
                }, {
                  where: {
                    cedula_u: usuarios[j].cedula_u
                  }
                });

                if (igualdad) {
                  const suscripciones = await Suscripciones.create({
                  tipo: 'premium',
                  correo_s: usuario[j].correo_u,
                  estado_s: 'vigente',
                  fecha_c: diaV
              });
              }
              }
            }

          }
        }
        if (usuariosD.length > 0) {//Si existen usuarios con tipo de usuario "docente"
          for (var i = 0; i < usuariosD.length; i++) {//Se recorren con el fin de verificar que se encuentre en los datos de los docentes creados

            var existe = await Docentes.findOne({
              where: {
                cedula_d: usuariosD[i].cedula_u
              }
            });
            if (existe == null) {//Si no existe en la tabla docente, existe es null y se procede a actualizar el tipo de usuario a "lector"
              let suscripcion = await Tipo_Suscripcion.findOne({
                where: {
                    tipo_ts: 'de prueba'
                }
            });
            let fecha = new Date();
            let diaV = sumarDias(suscripcion.vigencia, fecha);
              var actualizado = await Usuarios.update({
                tipo_u: 'lector',
                fecha_s: diaV,
                estatus_s: 'vigente'

              }, {
                where: {
                  cedula_u: usuariosD[i].cedula_u
                }
              })
            }
          }
        }
        if (usuariosD.length > 0 && existe == null && actualizado && bandera == 0) {// si existen usuarios con tipo de usuario "docente" y  existen usuarios que tengan tipo de usuario "docente" y no se encuentre en la tabla docente y que se haya realizado un cambio de tipo de usuario a "lector" y no existan docentes en la tabla docentes que hayan tenido un tipo de usuario distinto a "docentes"
          res.status(200).send({
            message: "Actualizada con éxito",
          });
        } else if (usuariosD.length > 0 && existe != null && bandera == 0) {
          res.status(200).send({// si existen usuarios con tipo de usuario "docente" y no existen usuarios que tengan tipo de usuario "docente" y no se encuentre en la tabla docente y que no existan docentes en la tabla docentes que hayan tenido un tipo de usuario distinto a "docentes"
            message: "Actualizada con éxito",
          });
        } else if (usuariosD.length > 0 && existe == null && actualizado && bandera == 1 && igualdad) { // si existen usuarios con tipo de usuario "docente" y no existen usuarios que tengan tipo de usuario "docente" y no se encuentre en la tabla docente y existan docentes en la tabla docentes que hayan tenido un tipo de usuario distinto a "docentes" y a estos se les haya actualizado el tipo de usuario a "docente"
          res.status(200).send({
            message: "Actualizada con éxito",
          });
        } else if (usuariosD.length == 0 && bandera == 1 && igualdad) { // si no existen usuarios con tipo de usuario "docente" y existan docentes en la tabla docentes que hayan tenido un tipo de usuario distinto a "docentes" y que a estos se les haya actualizado el tipo de usuario a "docente"
          res.status(200).send({
            message: "Actualizada con éxito",
          });
        } else if (usuariosD.length == 0 && bandera == 0) {// si no existen usuarios registrados como docentes y no existen por tanto diferencias entre esta y la tabla docente
          res.status(200).send({
            message: "Actualizada con éxito",
          });
        }



      }
    });


  } catch (error) {

    res.status(500).send({
      message: 'Datos no importados en la base de datos docente'
    });
  }


};