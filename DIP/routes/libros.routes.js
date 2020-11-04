

const express = require('express');
const router = express.Router();
const multer = require('multer');
const up = multer();

const { jsPDF } = require("jspdf");
const  watermark  = require('image-watermark');
var path = require('path');


const { insertarLibro, busquedaLibros, busquedaEspecifica, eliminarLibro, actualizarLibro, actualizarUnLibro, busquedaGeneral, totalLibros, upload, generateUUID, libros, existeCota, todosLibros, verLibro} = require('../controllers/libros.controller');
const { isAuthenticated} = require('../controllers/usuarios.controllers');

//const consultaBooks = require('../controllers/digitalLibrary.controller');
//const consultaBooksOne = require('../controllers/digitalLibrary.controller');



router.get('/usuario/libros', totalLibros);
router.get('/libros', libros);
router.get('/oneBook?', busquedaEspecifica);
router.get('/books?', busquedaGeneral)
router.put('/updatedBook?', actualizarLibro);
router.put('/updatedBookOne?', actualizarUnLibro)
router.delete('/deleteBook?', eliminarLibro);

router.get('/bibliotecario/insert', isAuthenticated, (req,res,next) => {
  
    res.render('ingresarMaterial',{
       titulo: 'Inicio',
      usuarioL: req.session.usuarioL 
      });
  });
router.get('/bibliotecario/insert/varios', isAuthenticated, (req,res,next) => {
  
    res.render('ingresarVarios',{
       titulo: 'Ingresar libros',
      usuarioL: req.session.usuarioL 
      });
  });
router.get('/bibliotecario/editar-y-eliminar', isAuthenticated, (req,res,next) => {
  
    res.render('editar-y-eliminar',{
       titulo: 'Ingresar libros',
      usuarioL: req.session.usuarioL 
      });
  });

  /*router.get('/bibliotecario/insertar',  (req,res,next) => {
  
    res.render('pdf');
  });
  router.get('/bibliotecario/insertar2',  (req,res,next) => {
  
    res.render('pdf2');
  });*/
router.post('/bibliotecario/busqueda-especifica', isAuthenticated, busquedaEspecifica);
router.post('/bibliotecario/ver?', isAuthenticated, verLibro);
router.post('/bibliotecario/todos-libros', isAuthenticated, todosLibros);
router.post('/bibliotecario/ec', isAuthenticated, existeCota);  
router.post('/bibliotecario/insert', isAuthenticated, upload.single('pdf'), (req, res, next) => {
 /* let mostrar = req.body.mostrar;
  if(!mostrar){
    console.log('no existe mostrar');
    upload.single('pdf');
    next();
  }else{
  next();
  }*/
  console.log(req.file);
  next();
}, insertarLibro);
router.post('/bibliotecario/actualizar', isAuthenticated, upload.single('pdf'), (req, res, next) => {
  
   console.log(req.file);
   next();
 }, actualizarUnLibro);
router.delete('/bibliotecario/eliminar?', isAuthenticated, eliminarLibro );


router.get('/bibliotecario/insertar3', (req, res, next) => {
  function addWaterMark(doc){
    var totalPages = doc.internal.getNumberOfPages();
    for (var i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setTextColor(150);
        doc.text(50, doc.internal.pageSize.height - 30, 'Watermark');
    
    }
    return doc;
}

  let doc = new jsPDF('p', 'pt', 'a4');
 doc = addWaterMark(doc);
 //doc.save('test');
 const file = doc.output();
 console.log(file);
});

router.get('/bibliotecario/libros', totalLibros);
/*router.get('/incrustar-pdf', function (req, res, next) {
  var options = {
    'text' : 'sample watermark', 
    'resize' : '200%'
};
    var fs = require('fs');
    const pdfPath = path.join(__dirname, '../public/uploads/7_PRACTICAS_DE_FISICA_1.pdf');
    console.log(pdfPath);
    if (fs.existsSync(pdfPath)) {
      watermark.embedWatermark(pdfPath, options);
        res.send('Hello world');
    }else{
        res.json({"filesexist":"no"});
    }
  
});
*/
router.get('/incrustar-pdf', function (req, res, next) {
  var options = {
    'text' : 'sample watermark', 
    'resize' : '200%'
};
    var fs = require('fs');
    const pdfPath = path.join(__dirname, '../public/uploads/7_PRACTICAS_DE_FISICA_1.pdf');
    
    if (fs.existsSync(pdfPath)) {
    console.log(pdfPath);
      watermark.embedWatermarkWithCb(pdfPath, options,
        function(err){
          if (!err){
          console.log('exitoso');
          }else{
            console.log('----error---');
            console.log(err);
          }
        });
        res.send('Hello world');
    }
    else{
        res.send('No existe la ruta');
    }
  
});


module.exports = router;