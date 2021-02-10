const Estudiantes = require("../models/estudiantes");
const Docentes = require("../models/docentes");
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const Usuarios = require("../models/usuarios");
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
    let ruta = path.join(__dirname, '..\\noPublic\\uploads\\', req.file.filename)//ruta del archivo

    readXlsxFile(ruta).then(async function (rows) {//el middleware toma el archivo de la ruta y extrae las filas
      rows.shift(); //Se desplaza el primer elemento, el encabezado

      let estudiantes = [];
      //Expresiones regulares para verificar el formato de entrada de loa datos a la base de datos
      //Esto es necesario porque no existe validacion en el frontEnd
      const regExpCedula = new RegExp(/^([VE]-)[0-9]{1,8}$/i)// formato v ó e ó E ó V + - + 8 numeros del 0 al 9
      const regExpNombres = new RegExp(/(^[a-z- -á]{1,35}$)/i)// 35 caracteres que pueden ser: letras, espacios con acentos
      const regExpApellidos = new RegExp(/(^[a-z- -á]{1,35}$)/i)
      const regExpE = new RegExp(/(^[a-z- -á]{1,35}$)/i)

      //Se recorrren todas las filas una a una
      rows.forEach((row) => {
        let estudiante = {
          cedula_e: row[0].toLowerCase(),// Se asigna cada fila, columna a su correspondiente en la tabla docente
          nombres_e: row[1].toLowerCase(),
          apellidos_e: row[2].toLowerCase(),
          especializacion: row[3].toLowerCase(),
        };
        //Se utiliza el metodo test para comprobar que cada una de las expresiones regulares se cumple
        const resultadoCedula = regExpCedula.test(estudiante.cedula_e);
        const resultadoNombres = regExpNombres.test(estudiante.nombres_e);
        const resultadoApellidos = regExpApellidos.test(estudiante.apellidos_e);
        const resultadoE = regExpE.test(estudiante.especializacion);
        if (resultadoCedula) {
          if (resultadoNombres) {
            if (resultadoApellidos) {
              if (resultadoE) {

                estudiantes.push(estudiante);// si se cumple cada una de las expresiones regulares entonces el estudiante se añade al arreglo estudianttes
              } else {
                // respuesta en caso de error
                //Se devuelve el codigo de estatus 500 para indicar que ha sido un problema en el servidor    
                res.status(500).send({
                  message: 'Formato de la materia no coincide'
                });
              }
            } else {
              res.status(500).send({
                message: 'Formato del apellido no coincide'
              });
            }
          } else {
            res.status(500).send({
              message: 'Formato del nombre no coincide'
            });
          }
        } else {
          res.status(500).send({
            message: 'Formato de la cédula no coincide'
          });
        }

      });

      //Se elimina la información de la tabla de estudiantes anterior
      await Estudiantes.destroy({
        where:
        {
          cedula_e: {
            [Op.ne]: null
          }
        }
      });
      // se crea por lote en la tabla Estudiantes
      let creacion = await Estudiantes.bulkCreate(estudiantes);


      if (creacion) { //Si se realiza la creacion se buscan usuarios con el tipo de usuario "estudiante"
        let filePath = path.join(__dirname, '..\\noPublic\\uploads\\', req.file.filename);
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
              if (usuarios[j].cedula_u === creacion[k].cedula_e && usuarios[j].tipo_u != 'estudiante') {//Si existe un usuario que se encuentre en la nueva data de estudiantes creados y que no tenga el tipo de usuario "estudiante", se procede a cambiar el tipo de usuario en la tabla usuario
                bandera = 1;
                var igualdad = await Usuarios.update({//Se actualiza con el metodo update que proporciona sequelize
                  tipo_u: 'estudiante'
                }, {
                  where: {
                    cedula_u: usuarios[j].cedula_u
                  }
                });
              }
            }

          }
        }
        if (usuariosE.length > 0) {//Si existen usuarios con el tipo de usuario "estudiante"
          for (var i = 0; i < usuariosE.length; i++) {//Se recorre cada usuario

            var existe = await Estudiantes.findOne({//Si la cedula del usuario que se encuentra con el tipo de usuario "estudiante" se encuentra en la tabla estudiante se crea existe
              where: {
                cedula_e: usuariosE[i].cedula_u
              }
            });
            if (existe == null) {// si exite es igual a null quiere decir que el usuario con tipo de usuario estudiante no se encuentra en la tabla de estudiantes
              var actualizado = await Usuarios.update({//Se actualiza el tipo de usuario a lector
                tipo_u: 'lector'
              }, {
                where: {
                  cedula_u: usuariosE[i].cedula_u
                }
              })
            }
          }
        }
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
      message: "Datos no importados en la base de datos docente",
    });
  }


};

module.exports.insertarBaseD = async function (req, res, next) {

  try {
    let bandera = 0;
    let ruta = path.join(__dirname, '..\\noPublic\\uploads\\', req.file.filename)// ruta del archivo excel

    readXlsxFile(ruta).then(async function (rows) {

      rows.shift(); // Extrae el primer elemento, el elemento cero

      //Expresiones regulares para verificar el formato de entrada de loa datos a la base de datos
      //Esto es necesario porque no existe validacion en el frontEnd
      let docentes = [];
      const regExpCedula = new RegExp(/^([VE]-)[0-9]{1,8}$/i) // formato v ó e ó E ó V + - + 8 numeros del 0 al 9
      const regExpNombres = new RegExp(/(^[a-z- -á]{1,35}$)/i)// 35 caracteres que pueden ser: letras, espacios con acentos
      const regExpApellidos = new RegExp(/(^[a-z- -á]{1,35}$)/i)
      const regExpMateria = new RegExp(/(^[a-z- -á]{1,35}$)/i)
      rows.forEach((row) => {
        let docente = {
          cedula_d: row[0].toLowerCase(),
          nombres_d: row[1].toLowerCase(),
          apellidos_d: row[2].toLowerCase(),
          materia: row[3].toLowerCase(),
        };
        //Se utiliza el metodo test para comprobar si se cumplen las expresiones regulares
        const resultadoCedula = regExpCedula.test(docente.cedula_d);
        const resultadoNombres = regExpNombres.test(docente.nombres_d);
        const resultadoApellidos = regExpApellidos.test(docente.apellidos_d);
        const resultadoMateria = regExpMateria.test(docente.materia);
        if (resultadoCedula) {
          if (resultadoNombres) {
            if (resultadoApellidos) {
              if (resultadoMateria) {
                //Si se cummplen las expresiones regulares se añade cada docente a el arreglo docentes
                docentes.push(docente);
              } else {
                //mensajes de respuesta en caso de que no se cumpla alguna de las expresiones regulares
                res.status(500).send({
                  message: 'Formato de la materia no coincide'
                });
              }
            } else {
              res.status(500).send({
                message: 'Formato del apellido no coincide'
              });
            }
          } else {
            res.status(500).send({
              message: 'Formato del nombre no coincide'
            });
          }
        } else {
          res.status(500).send({
            message: 'Formato de la cédula no coincide'
          });
        }

      });

      //Se elimina la informacion contenida en la tabla docente
      await Docentes.destroy({
        where:
        {
          cedula_d: {
            [Op.ne]: null
          }
        }
      });

      let creacion = await Docentes.bulkCreate(docentes);//Se utiliza el metodo de sequeliza para crear por lote el arreglo docentes


      if (creacion) {
        let filePath = path.join(__dirname, '..\\noPublic\\uploads\\', req.file.filename); //si se realiza la creacion se procede a eliminar el archivo excel, debido a que no es necesario su almacenamiento despues de haber importado los datos en la base de datos
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
              if (usuarios[j].cedula_u === creacion[k].cedula_d && usuarios[j].tipo_u != 'docente') {//Si la cedula de un usuario se encuetra registrada en la nueva creacion de tabla docente y este tiene tipo de usuario distinto a docente se procede a cambiar
                bandera = 1;
                var igualdad = await Usuarios.update({//Se actualiza el campo tipo de usuario a "docente"
                  tipo_u: 'docente'
                }, {
                  where: {
                    cedula_u: usuarios[j].cedula_u
                  }
                });
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
              var actualizado = await Usuarios.update({
                tipo_u: 'lector'
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