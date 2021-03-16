
const express = require('express');//Se requiere el middleware
const router = express.Router();//Se trae desde express.js el metodo router
const { upload, insertarNoticia, noticias, unaNoticia, editarNoticia, eliminarUnaNoticia } = require('../controllers/noticias.controller');//Se requieren las funciones que controlan y envian las respuestas a las rutas

const { isAuthenticatedBAjax, isAuthenticatedAjax } = require('../controllers/usuarios.controllers');//se requiere las funciones de autentificacion
//ruta post para la creacion de una nueva noticia, se termina de configurar upload de multer.js, haciendole saber que solo se subiran archivos por unidad
router.post('/bibliotecario/nuevaNoticia', isAuthenticatedBAjax, upload.single('img'), insertarNoticia);
router.get('/noticias', noticias);//ruta get que solo consulta las noticias almacenadas
router.post('/noticia?', unaNoticia);//ruta post que consulta la informacion de una noticia en particulas, esta se usa tanto para ver la noticia en la ventana modal como para ver la información antes de editarla, y se tiene acceso desde todos los roles
router.post('/bibliotecario/editar-noticia', isAuthenticatedBAjax, upload.single('img'), editarNoticia);//ruta post donde se envia desde ajax un objeto formData con la nueva información de la noticia, si este objeto contiene un archivo este es almacenado y se ejecuta la función siguiente, sino se salta el almacenamiento por parte de multer.js y se prosigue a la actualización de los campos
router.post('/bibliotecario/eliminar?', isAuthenticatedBAjax, eliminarUnaNoticia);//Se elimina la notica con el id especificado en la url
module.exports = router;// se exportan todas las rutas en router