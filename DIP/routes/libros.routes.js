const express = require('express');
const router = express.Router();



const { insertarLibro, eliminarLibro,  actualizarUnLibro, upload,  libros, existeCota, todosLibros, verLibro, bs, trabajo, revista} = require('../controllers/libros.controller');

const {  isAuthenticatedAjax, isAuthenticatedBAjax} = require('../controllers/usuarios.controllers');

// son rutas que consultan libros, revistas y trabajos de grado y pueden ser accedidas incluso por lector
router.get('/libros', libros);
router.get('/trabajo', trabajo);
router.get('/revista', revista);

  //ruta que se accede tanto el bibliotecario como el usuario para realizar una busqueda especifica de un o unos libros. ruta de acceso por todos
router.post('/busqueda-especifica', bs);
//Permite considerar detalles el libro, ruta de acceso por todos los roles
router.post('/ver_libro?', verLibro);

//Ruta que se consulta para ser enviado al frontend todos los libros
router.post('/todos-libros', isAuthenticatedAjax, todosLibros);

//Comprueba la unicidad de las cotas antes de ser enviada la información del formulario
router.post('/bibliotecario/ec', isAuthenticatedAjax, existeCota); 

//ruta de acceso solo para el bibliotecario mediante la cual se inserta un nuevo libro a la base de datos
router.post('/bibliotecario/insert', isAuthenticatedBAjax, upload.single('pdf'),  insertarLibro);
//ruta de acceso unico para el bibliotecario mediante la cual se edita un libro que ya se encuentre en la base de datos
router.post('/bibliotecario/actualizar', isAuthenticatedBAjax, upload.single('pdf'), actualizarUnLibro);
//ruta mediante la cual se elimina un libro de la base de datos, ruta de acceso unico para el bibliotecario
router.delete('/bibliotecario/eliminar_libro?', isAuthenticatedBAjax, eliminarLibro );


module.exports = router;