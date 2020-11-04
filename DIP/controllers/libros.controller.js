
const  Libros  = require('../models/libros');
const multer = require('multer');
const path = require('path');
const jsPDF = require('jspdf');
const fs = require('fs');
var sequelize = require ('../database/database');
const { listenerCount } = require('cluster');



function generateUUID() {
  var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);

    });
    return uuid;
};





const storage = multer.diskStorage({
      destination: path.join(__dirname, '../public/uploads'),
      filename: (req, file, cb) => {
        cb(null, generateUUID() + path.extname(file.originalname).toLowerCase()); 
      }
    });

    const upload = multer({
      storage: storage,
       dest: path.join(__dirname, '../public/uploads'),
       fileFilter: (req, file, cb) => {
         const fileType = /pdf/;
         const mimetype = fileType.test(file.mimetype.toLowerCase());
         const extname = fileType.test(path.extname(file.originalname.toLowerCase()));
         if (mimetype && extname){
           return cb(null, true)
         }
         cb("Error: El archivo debe ser un  pdf");
         console.log(file[0]);
       }
    });
    module.exports.upload = upload;
    

module.exports.insertarLibro = async function insertar(req, res, next) {
const datosLibro = req.body;
console.log(req.file);
console.log(req.body);
const nuevaC = {};

if (datosLibro.autor && datosLibro.autor != '' ){
 datosLibro.autor = datosLibro.autor.toLowerCase();
}
if (datosLibro.tutor && datosLibro.tutor != '' ) {
 datosLibro.tutor = datosLibro.tutor.toLowerCase();
}

if (datosLibro.editorial && datosLibro.editorial != ''){
  datosLibro.editorial = datosLibro.editorial.toLowerCase();
}
if (req.file){
  datosLibro.destino = req.file.path
}
function cotas(i){
     let varia = "datosLibro.cota_"+i;
     varia = eval(varia);
     return varia;
}
  try {
    var crear=[];
    let nLibro = {};
let coma = '';
    if (datosLibro.ejemplar > 1){
      
      let ej = datosLibro.ejemplar;
      for(var i=1; i<=ej;i++){
        if(i<ej){
          coma = ','
        }else {
          coma=']';
        }
        cota = cotas(i);
       crear.push( {
          tipo_l:  datosLibro.tipo_l.toLowerCase(),
          cota: cota.toLowerCase(),
          autor:datosLibro.autor,
          titulo:datosLibro.titulo.toLowerCase(),
          año: datosLibro.año,
          volumen:datosLibro.volumen,
          tutor:datosLibro.tutor,
          editorial: datosLibro.editorial,
          destino:datosLibro.destino,
          estado_l: 'disponible', 
          ejemplar: i
        });
       
       
      }
      console.log("entre aca");
      console.log(crear);

      nLibro = await Libros.bulkCreate(crear);

    }else{
console.log("no entre alla");
       nLibro = await Libros.create({
      cota: datosLibro.cota_1.toLowerCase(),
      tipo_l: datosLibro.tipo_l.toLowerCase(),
      autor: datosLibro.autor,
      titulo: datosLibro.titulo.toLowerCase(),
      año: datosLibro.año,
      volumen: datosLibro.volumen,
      tutor: datosLibro.tutor,
      editorial: datosLibro.editorial,
      destino: datosLibro.destino,
      estado_l: 'disponible',
      ejemplar: 1
    });
    }
    
   



    if (nLibro) {
    //res.redirect('/bibliotecario/libros');
    res.send('Carga satisfactoria');
    console.log(nLibro);
     
    }
    
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: 'ha ocurrido un error',
        data: {},
      });
  }
};

module.exports.existeCota = async function (req, res, next) {

 const cota = req.body.cota;
console.log(cota);
try {
const libro = await Libros.findOne({
  where: {
    cota: cota
  }
});
if (libro){
  res.send('La cota debe ser única');
  console.log(libro);
}else if(cota == ' '){

  res.send('La cota no debe ser nula');
}else {
  res.send('');
}
}catch(error){
  console.log(error);
}
};
module.exports.libros = async function (req, res, next) {
  try {
    const libros = await Libros.findAll({
      attributes: [
        'cota',
        ['tipo_l', 'tipo de material bibliografico'],
        'autor',
        'tutor',
        'editorial',
        'titulo',
        'año',
        'volumen',
        'estado_l',
        ['created_at', 'fecha de registro'],
        ['updated_at', 'fecha de ultima actualizacion']
      ]
    });
    if (libros) {

    res.json({
      libros: libros
    });
  }
  } catch (error) {
    console.log(error);
    res.json({
      data: {},
      message: 'ha ocurrido un error',
    });
  }
};

module.exports.totalLibros = async function totalLibros(req, res, next) {
  try {
    const libros = await Libros.findAll({
      attributes: [
        'cota',
        ['tipo_l', 'tipo de material bibliografico'],
        'autor',
        'tutor',
        'editorial',
        'titulo',
        'año',
        'volumen',
        'estado_l',
        ['created_at', 'fecha de registro'],
        ['updated_at', 'fecha de ultima actualizacion']
      ]
    });
    if (libros) {

    res.render('libros', {
      titulo: 'Catalogo',
      usuarioL: req.session.usuarioL,
      libros: libros
    });
  }
  } catch (error) {
    console.log(error);
    res.json({
      data: {},
      message: 'ha ocurrido un error',
    });
  }
};
module.exports.todosLibros = async function (req, res, next) {
  try {
    const libros = await Libros.findAll();
    if (libros) {

      res.json({
        libros
      });
  }
  } catch (error) {
    console.log(error);
    res.json({
      data: {},
      message: 'ha ocurrido un error',
    });
  }
};
module.exports.busquedaEspecifica = async function (req,res, next) {
  const datosLibro = req.body;
  
  console.log(res.statusCode);
  var busqueda = {};
  if (datosLibro.año){
    busqueda.año = datosLibro.año;
  }
  if (datosLibro.volumen){
    busqueda.volumen = datosLibro.volumen; 
  }
 
if (datosLibro.cota){
busqueda.cota = datosLibro.cota.toLowerCase();
}
if (datosLibro.tipo_l){
    busqueda.tipo_l =  datosLibro.tipo_l.toLowerCase();
}
if (datosLibro.titulo){
  busqueda.titulo = datosLibro.titulo.toLowerCase();
}
if (datosLibro.autor){
  busqueda.autor = datosLibro.autor.toLowerCase();
}
if (datosLibro.tutor){
  busqueda.tutor = datosLibro.tutor.toLowerCase();
}
if (datosLibro.editorial){
  busqueda.editorial = datosLibro.editorial.toLowerCase();
}
if (datosLibro.ejemplar){
  busqueda.ejemplar = datosLibro.ejemplar;
}

   
  try {
    
    libros =   await Libros.findAll({
     
      where: busqueda,
      
    });
    res.json({
      libros
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.verLibro = async function (req,res, next) {
  const cota = req.query.cota;
  
  try {
    
  const  libro =   await Libros.findAll({
     
      where: {
        cota: cota
      },
      
    });
    res.json({
      libro
    });
  } catch (error) {
    console.log(error);
  }
};


module.exports.busquedaGeneral = async function busquedaGeneral(request, response) {
  const busqueda = request.query;
  try {
    var libros;
    if (busqueda.cota){
    const cota = '%' + busqueda.cota + '%';
    libros =  await sequelize.query(
      'SELECT cota, tipo_l AS "tipo de material bibliografico",titulo, autor, año, volumen, created_at AS "fecha de registro", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE cota ILIKE :busq',
      {
        replacements: {busq: cota},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.titulo){
      const titulo = '%' + busqueda.titulo + '%';
   libros = await sequelize.query(
      'SELECT cota, tipo_l AS "tipo de material bibliografico",titulo, autor, año, volumen, created_at AS "fecha de registro", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE titulo ILIKE :busq',
      {
        replacements: {busq: titulo},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.año){
      const año =  busqueda.año + '%';
   libros = await sequelize.query(
      'SELECT cota, tipo_l AS "tipo de material bibliografico",titulo, autor, año, volumen, created_at AS "fecha de registro", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE año ILIKE :busq',
      {
        replacements: {busq: año},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.volumen){
      const volumen =  busqueda.volumen;
   libros = await sequelize.query(
      'SELECT cota, tipo_l AS "tipo de material bibliografico",titulo, autor, año, volumen, created_at AS "fecha de registro", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE volumen ILIKE :busq',
      {
        replacements: {busq: volumen},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.tipo_l){
      const tipo_l = '%' + busqueda.tipo_l + '%';
   libros = await sequelize.query(
      'SELECT cota, tipo_l AS "tipo de material bibliografico",titulo, autor, año, volumen, created_at AS "fecha de registro", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE tipo_l ILIKE :busq',
      {
        replacements: {busq: tipo_l},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.tutor){
      const tutor = '%' + busqueda.tutor + '%';
   libros = await sequelize.query(
      'SELECT cota, tipo_l AS "tipo de material bibliografico",titulo, autor, año, volumen, created_at AS "fecha de registro", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE tutor ILIKE :busq',
      {
        replacements: {busq: tutor},
        type: QueryTypes.SELECT
      }
    );
    }
    if (busqueda.autor){
      const autor = '%' + busqueda.autor + '%';
   libros = await sequelize.query(
      'SELECT cota, tipo_l AS "tipo de material bibliografico",titulo, autor, año, volumen, created_at AS "fecha de registro", updated_at AS "fecha de ultima actualizacion" FROM libros WHERE autor ILIKE :busq',
      {
        replacements: {busq: autor},
        type: QueryTypes.SELECT
      }
    );
    };
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



module.exports.eliminarLibro = async function (req, res, next) {
  let cota = req.query.cota;
  try {
    const libro = await Libros.findOne({
      where: {
        cota: cota
      },
    });
    
    const librosEliminados = await Libros.destroy({
      where: {
        cota: cota
      },
    });
    
    if(librosEliminados && libro.destino !== 'no aplica'){
      const otrosLibros = await Libros.findAll({
        where:{
          destino: libro.destino
        },
      });
      console.log(otrosLibros.length);
      if(otrosLibros.length >= 1){
        res.json({librosEliminados});
        console.log('existen otros');
      }else if(otrosLibros.length == 0){
        console.log('entre a la eliminacion');
        
        let filePath = libro.destino;
        fs.unlinkSync(filePath);
        res.json({librosEliminados});
      }
    }else{
      
      res.json({librosEliminados});
    }
     
  } catch (error) {
    res.json({
      message: 'ha fallado la eliminacion',
    });
    console.log(error);
  }
};



module.exports.actualizarLibro = async function(req, res, next) {
  const { cota, editorial, titulo, autor, tutor, año, volumen, tipo_l} = req.body;
  const {cotab, editorialb, titulob, autorb, tutorb, añob, volumenb, tipo_lb} = request.body;
  const nuevoLibro ={};
  const libro = {};


  if (cota){
    libro.cota = cota.toLowerCase();
  }
  if (editorial){
    libro.editorial = editorial.toLowerCase();
  }
  if (titulo){
    libro.titulo = titulo.toLowerCase();
  }
  if (autor){
    libro.autor = autor.toLowerCase();
  }
  if (tutor){
    libro.tutor = tutor.toLowerCase();
  }
  if (año){
    libro.año = año;
  }
  
  if (volumen){
    libro.volumen = volumen;
  }
  
  if (tipo_l){
    libro.tipo_l = tipo_l.toLowerCase();
  }
////////------------------------------------------------------
    
if (cotab) {
  nuevoLibro.cota = cotab.toLowerCase();
}
if (editorialb) {
  nuevoLibro.editorial = editorialb.toLowerCase();
}
if (titulob){
  nuevoLibro.titulo = titulob.toLowerCase();
}
if (autorb){
  nuevoLibro.autor = autorb.toLowerCase();
}
if (tutorb){
  nuevoLibro.tutor = tutorb.toLowerCase();
}
if (añob){
  nuevoLibro.año = añob;
}

if (volumenb){
  nuevoLibro.volumen = volumenb;
}

if (tipo_lb){
  nuevoLibro.tipo_l = tipo_lb.toLowerCase();
}

      
  
  try {
    const libros = await Libros.findAll({
      attributes: [
        'cota',
        'editorial',
        'titulo',
        'tutor',
        'autor',
        'volumen',
        'año',
        'tipo_l'
      ],
      where: libro,
    });
    if (libros.length > 0) {
      libros.forEach(async (libros) => {
        await Libros.update({

          editorial: nuevoLibro.editorial,
          titulo: nuevoLibro.titulo,
          tutor: nuevoLibro.tutor,
          autor: nuevoLibro.autor,
          año: nuevoLibro.año,
          volumen: nuevoLibro.volumen,
          tipo_l: nuevoLibro.tipo_l,

          
        },{
          where: libro
        });
      });
    };
    
      const nuevosLibros = await Libros.findAll({
        attributes: [
          'cota',
          ['tipo_l', 'tipo de material bibliografico'],
          'autor',
          'tutor',
          'editorial',
          'titulo',
          'año',
          'volumen',
          ['created_at', 'fecha de registro'],
          ['updated_at', 'fecha de ultima actualizacion']
        ],
        where: libro,
      });
      return response.json({
        message: "fichas actualizados",
        data: nuevosLibros,
      });
    
  } catch (error) {
    console.log(error);
    response.json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
};


module.exports.actualizarUnLibro = async function(req, res, next) {
 console.log(req.body);
  const { editorial, titulo, autor, tutor, año, volumen, tipo_l, cota, estado_l} = req.body;
  
  const libro = {};


if (editorial){
  libro.editorial = editorial.toLowerCase();
}
if (cota){
  libro.cota = cota.toLowerCase();
}
if (estado_l){
  libro.estado_l = estado_l.toLowerCase();
}
if (titulo){
  libro.titulo = titulo.toLowerCase();
}
if (autor){
  libro.autor = autor.toLowerCase();
}
if (tutor){
  libro.tutor = tutor.toLowerCase();
}
if (año){
  libro.año = año;
}

if (volumen){
  libro.volumen = volumen;
}

if (tipo_l){
  libro.tipo_l = tipo_l.toLowerCase();
}
if (req.file){
  libro.destino = req.file.path;
} 
      
  try {
    
       const nuevoLibro = await Libros.update({

          editorial: libro.editorial,
          titulo: libro.titulo,
          tutor: libro.tutor,
          autor: libro.autor,
          año: libro.año,
          volumen: libro.volumen,
          tipo_l: libro.tipo_l,
          destino: libro.destino,
          ejemplar: libro.ejemplar,
          estado_l: libro.estado_l

          
        },{
          where: {
            cota: libro.cota
          }
        });
    
     if(nuevoLibro){
      res.send('Actualizado con éxito');
      }else{
        res.send('');
      }
    
  } catch (error) {
    console.log(error);
    response.json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
};