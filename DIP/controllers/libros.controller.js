
const  Libros  = require('../models/libros');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var sequelize = require ('../database/database');
const { listenerCount } = require('cluster');
const {QueryTypes} = require('sequelize');
const { Op } = require("sequelize");


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
      destination: path.join(__dirname, '../public/uploads/pdfs'),
      filename: (req, file, cb) => {
        cb(null, generateUUID() + path.extname(file.originalname).toLowerCase()); 
      }
    });

const upload = multer({
      storage: storage,
       dest: path.join(__dirname, '../public/uploads/pdfs'),
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
    
//función con la que insertan uno o varios libros
module.exports.insertarLibro = async function insertar(req, res, next) {
const datosLibro = req.body;

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
 let nombre = req.file.filename;
  let ruta = "/uploads/pdfs/"+nombre;
  datosLibro.destino = ruta;
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
    

      nLibro = await Libros.bulkCreate(crear);

    }else{
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
    res.status(200).send('Carga satisfactoria');
     
    }
    
  } catch (error) {
      res.status(500).json({
        message: 'ha ocurrido un error',
        data: {},
      });
  }
};
//Consulta si la cota que se pretende registar exite
module.exports.existeCota = async function (req, res, next) {

 const cota = req.body.cota;
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
 res.status(500);
}
};
//consulta de libros
module.exports.libros = async function (req, res, next) {
  try {
    const libros = await Libros.findAll({
      where: {
        tipo_l: 'libro'
      }
    });
    if (libros) {
    res.status(200).json({libros: libros
    });
  }
  } catch (error) {
    res.status(500).send({
      message: 'Ha ocurrido un error',
    });
  }
};

//consulta de trabajos de grado
module.exports.trabajo = async function (req, res, next) {
  try {
    const libros = await Libros.findAll({
      where: {
        tipo_l: 'trabajo de grado'
      }
    });
    if (libros) {
    res.status(200).json({libros: libros
    });
  }
  } catch (error) {
    res.status(500).send({
      message: 'Ha ocurrido un error',
    });
  }
};
//revista
module.exports.revista = async function (req, res, next) {
  try {
    const libros = await Libros.findAll({
      where: {
        tipo_l: 'revista'
      }
    });
    if (libros) {
    res.status(200).json({libros: libros
    });
  }
  } catch (error) {
    res.status(500).send({
      message: 'Ha ocurrido un error',
    });
  }
};

//Función que consulta todos los libros
module.exports.todosLibros = async function (req, res, next) {
  try {
    const libros = await Libros.findAll();
    if (libros) {

      res.status(200).json({
        libros
      });
  }
  } catch (error) {
   res.status(500);
  }
};


//Funcion que consulta detalles de un libro en particular
module.exports.verLibro = async function (req,res, next) {
  const cota = req.query.cota;
  try {
    
  const  libro =   await Libros.findAll({
     
      where: {
        cota: cota
      },
      
    });
    res.status(200).json({
      libro
    });
  } catch (error) {
    res.status(500);
  }
};



//Función que utiliza expresiones de posgresql
module.exports.bs = async function (req, res, next) {
  try {
    const b = req.body;
 let q1 = 'SELECT cota, titulo, tipo_l, autor, año, volumen, estado_l, destino FROM libros WHERE ';
 let q = '';
  if (b.cota) {
   let cota = '%' + b.cota + '%';
   if ( q === '') {
     q = q1 + `cota ILIKE '${cota}'`;
   } else {
    q = q + `AND cota ILIKE '${cota}'`;
   }
  }
  if (b.titulo) {
    let titulo = '%' + b.titulo + '%';
    if ( q === '') {
      q = q1 + `titulo ILIKE '${titulo}'`;
    } else {
     q = q + `AND titulo ILIKE '${titulo}'`;
    }
   }
   if (b.autor) {
    let autor = '%' + b.autor + '%';
    if ( q === '') {
      q = q1 + `autor ILIKE '${autor}'`;
    } else {
     q = q + `AND autor ILIKE '${autor}'`;
    }
   }
   if (b.tipo_l) {
    let tipo_l = '%' + b.tipo_l + '%';
    if ( q === '') {
      q = q1 + `tipo_l ILIKE '${tipo_l}'`;
    } else {
     q = q + `AND tipo_l ILIKE '${tipo_l}'`;
    }
   }
   if (b.tutor) {
    let tutor = '%' + b.tutor + '%';
    if ( q === '') {
      q = q1 + `tutor ILIKE '${tutor}'`;
    } else {
     q = q + `AND tutor ILIKE '${tutor}'`;
    }
   }
   if (b.año) {
    let año = '%' + b.año + '%';
    if ( q === '') {
      q = q1 + `TO_CHAR(año,'9999999999') ILIKE '${año}'`;
    } else {
     q = q + `AND TO_CHAR(año,'9999999999') ILIKE '${año}'`;
    }
   }
   if (b.volumen) {
    let volumen = '%' + b.volumen + '%';
    if ( q === '') {
      q = q1 + `TO_CHAR(volumen, '9999999999') ILIKE '${volumen}'`;
    } else {
     q = q + `AND TO_CHAR(volumen, '9999999999') ILIKE '${volumen}'`;
    }
   }
   if (b.editorial) {
    let editorial = '%' + b.editorial + '%';
    if ( q === '') {
      q = q1 + `editorial ILIKE '${editorial}'`;
    } else {
     q = q + `AND editorial ILIKE '${editorial}'`;
    }
   }
   
   if (b.ejemplar) {
    let ejemplar = '%' + b.ejemplar + '%';
    if ( q === '') {
      q = q1 + `TO_CHAR(ejemplar, '9999999999') ILIKE '${ejemplar}'`;
    } else {
     q = q + `AND TO_CHAR(ejemplar, '9999999999') ILIKE '${ejemplar}'`;
    }
   }
  
 

  let libros =  await sequelize.query(q);
  
res.status(200).json({
 libros
});
  } catch (error) {
    res.status(500);
  }
};

//Se elimina un libro, solo el bibliotecario
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
      if(otrosLibros.length >= 1){
        res.json({librosEliminados});
      }else if(otrosLibros.length == 0){
        let nombre = libro.destino.split("/").pop();
        let filePath =  path.join(__dirname, "..\\public\\uploads\\pdfs\\", nombre);
       
        fs.unlinkSync(filePath);
        res.status(200).json({librosEliminados});
      }
    }else{
      
      res.status(200).json({librosEliminados});
    }
     
  } catch (error) {
    res.status(500).json({
      message: 'ha fallado la eliminacion',
    });
  }
};



//Actualiza una libro, solo bibliotecario
module.exports.actualizarUnLibro = async function(req, res, next) {

  const { editorial, titulo, autor, tutor, año, volumen, tipo_l, cota, estado_l} = req.body;
  
let libro = {};
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
  let nombre = req.file.filename;
   let ruta = "/uploads/pdfs/"+nombre;
   libro.destino = ruta;
}
      
  try {
    let otrosLibros = '';
    const viejoLibro = await Libros.findOne({
      where:{
        cota: libro.cota
      }
    });
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
if(libro.destino !== viejoLibro.destino){
        otrosLibros = await Libros.findAll({
      where: {
        destino: viejoLibro.destino
      }
    });
if(otrosLibros.length === 0){
  let direccion = `../public${viejoLibro.destino}`
  let filePath =  path.join(__dirname, direccion);
  fs.unlinkSync(filePath);
}
}
     if(nuevoLibro){
      res.status(200).json({
        libro: libro,
        mensaje: "Actualizado con éxito"
      });
      }else{
        res.status(200).send('');
      }
    
  } catch (error) {
    res.status(500).json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
};