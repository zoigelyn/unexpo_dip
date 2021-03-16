const Noticias = require('../models/noticias'); //Se requiere el modelo sequelize
const multer = require('multer'); //Se requiere el middleware multer.js la carga de archivos
const path = require('path');// se requiere el middleware para las rutas
const fs = require('fs');// Se requiere middleware para eliminar archivos almacenados en el servidor
//funcion para generar id unico en base a la fecha y hora
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);

  });
  return uuid;
};
//configuracion del middleware multer.js, donde se almacena en una const el destino y nombre del archivo
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads/imgs'),
  filename: (req, file, cb) => {
    cb(null, generateUUID() + path.extname(file.originalname).toLowerCase());
  }
});
//Se pasa la configuracion a multer.js, se añade la configuracion para filtrar el tipo de archivos, solo imagenes
const upload = multer({
  storage: storage,
  dest: path.join(__dirname, '../public/uploads/imgs'),
  fileFilter: (req, file, cb) => {
    const fileType = /jpg|png|jpeg/;
    const mimetype = fileType.test(file.mimetype.toLowerCase());
    const extname = fileType.test(path.extname(file.originalname.toLowerCase()));
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb("Error: El archivo debe ser una imagen jpg, jpeg, png");

  }
});
module.exports.upload = upload;
//En esta funcion se crean nuevas noticias
module.exports.insertarNoticia = async function (req, res, next) {//la funcion debe ser asincrona para usar el operador await
  const datosNoticia = req.body;//Se requiere del body la informacion
  //la informacion trasmitida en el cuerpo es la transmitida en un formulario o en una objeto formData
  try {
    if (req.file) {//si existe req.file es porque se cargo en el servidor el archivo
      let nombre = req.file.filename;
      let ruta = "/uploads/imgs/" + nombre;
      datosNoticia.destino = ruta;
    }
    //A partir del objeto file se puede acceder a la ruta en la que se almaceno el archivo, pero esta ruta me causa problemas al acceder desde el cliente. ¿Por que? porque esta ruta contiene la direccion desde el disco C y al intentar acceder desde el cliente la ruta es protegida por seguridad. 
    //Por esto concateno la ruta de modo que no tenga la direccion desde el disco.
    let nuevaNoticia = await Noticias.create({//Si se crea la nueva noticia se almacena en nuevaNoticia
      url_imagen: datosNoticia.destino, //datos del resultado de concatenar
      text_noticia: datosNoticia.textNoticia,//datos del body
      titulo_noticia: datosNoticia.titulo
    });

    if (nuevaNoticia) {//Si se crea la noticia envio la respuesta
      res.status(200).send('Creada con exito');
    }


  } catch (error) {
    res.status(500).send({
      message: "Noticia no creada"
    });
  }
};
//funcion en que se consultas todas las noticias almecenadas 
module.exports.noticias = async function (req, res, next) {//funcion asincrona para utilizar el operador await
  try {
    const noticias = await Noticias.findAll();//consulta que se almacena en la const noticias y solo se avanza a la siguiente linea de progracion cuando se realizar la consulta
    if (noticias) {//SI se realiza la consulta

      res.status(200).send(noticias);//se envia las noticias

    }
  } catch (error) {//Si existe un error en try
    res.status(500).send({//Se envia el estatus 500 y el message
      message: "Error al consultar la base de datos"
    });
  }
};
//funcion en que se consulta con un id especifico una noticia en particular
module.exports.unaNoticia = async function (req, res, next) {//funcion async para poder usar el operador await
  const id = req.query.id_n;//se requiere y almacena en una constante un parametro enviado desde el cliente como un query, es decir en la url
  try {
    const noticia = await Noticias.findOne({//Se realiza un consulta en donde el resulta se almacena en una const, esta consulta solo obtiene un resultado, el primero que cumpla con la condicion
      where: {
        id_n: id,//condicion de busqueda, id unico de la noticia
      }
    });
    if (noticia) {//Si se obtiene resultado

      res.status(200).send(noticia);//Se envia el codigo http 200 y la noticia
    }
  } catch (error) {//Si existe un error en try
    res.status(500).send({
      message: "Información no encontrada en la base de datos"
    });
  }

}
//Funcion en donde se edita una noticia, se puede mantener o no la imgen anteriormente guardada
module.exports.editarNoticia = async function (req, res, next) {//funcion asincrona para utilizar el operador await, la cual es guardada y exportada con el nombre editarNoticia
  const datosNoticia = req.body;//Se almacena la informacion en el body en una constante con nombre datosNoticia
  let bandera = 0;
  try {
    if (req.file) {//Si se almacena en el servidor la imagen correspodiente a la noticia
      let nombre = req.file.filename;
      let ruta = "/uploads/imgs/" + nombre;
      datosNoticia.destino = ruta;
    }
    let imagen = await Noticias.findOne({//Se busca la informacion de la noticia a editar
      where: {
        id_n: datosNoticia.id_n
      }
    });
    let nuevaNoticia = await Noticias.update({//Se actualiza la informacion de la noticia
      url_imagen: datosNoticia.destino,
      text_noticia: datosNoticia.textNoticia,
      titulo_noticia: datosNoticia.titulo
    }, {
      where: { id_n: datosNoticia.id_n }

    });


    if (nuevaNoticia && imagen.url_imagen != datosNoticia.destino) {//Si se actualizo con exito y la url de la noticia antes de ser actualizada es distinta de la url de la noticia ya actualizada se procede a eliminar la imagen anterior del servidor
      let nombre = imagen.url_imagen.split("/").pop();//Se utlizan los metodos split y pop para separar y quedarse solo con el nombre de la imagen
      let filePath = path.join(__dirname, "..\\public\\uploads\\imgs\\", nombre); //Se concatena para crear la ruta de la imagen a eliminar
      fs.unlinkSync(filePath);//Se elimina la imagen sel servidor
      bandera = 1;
    }

    if (nuevaNoticia && bandera == 1 && imagen.url_imagen != datosNoticia.destino || nuevaNoticia && bandera == 0 && imagen.url_imagen == datosNoticia.destino) {//Si se actualizo la noticia, y al actualizar se cambia la imagen y se elimina la imagen anterior ó se actualizo la noticia pero se mantuvo la misma imagen y no ocurrio la eliminacion
      res.status(200).send('Actualizada con éxito');
    }
  } catch (error) {
    res.status(500).send({
      message: "Error al actualizar la noticia"
    });
  }
};
module.exports.eliminarUnaNoticia = async function (req, res, next) {//funcion asincrona para utilizar el operador await, esta se guarda y exporta
  const id = req.query.id_n;//se requiere el id enviado como query en la url
  try {

    const imagen = await Noticias.findOne({//se consulta la informacion de la noticia que se va a eliminar
      where: {
        id_n: id// condicion id de la noticia
      }
    });
    const noticiaEliminada = await Noticias.destroy({//metodo de eliminacion de sequelize, se utiliza para eliminar de la tabla noticias la noticia que cumple la condición y esta se almacena en la constante
      where: {
        id_n: id//condición
      },
    });

    if (noticiaEliminada) { //Si se realiza la eliminación

      let nombre = imagen.url_imagen.split("/").pop();//se extrae el nombre de la url de la imagen asociada a la noticia que fue eliminada
      let filePath = path.join(__dirname, "..\\public\\uploads\\imgs\\", nombre);// se concatena para conseguir la ruta dentro del servidor
      fs.unlinkSync(filePath);//se elimina la imagen asociada a la noticia
      res.status(200).send('ok');

    }

  } catch (error) {//en caso de error
    res.status(500).send({
      message: "Se produjo un error al eliminar la noticia"
    });
  }
}
