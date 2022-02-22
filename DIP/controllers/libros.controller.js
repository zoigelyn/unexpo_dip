
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
module.exports.insertarLibro = async function (req, res, next) {
const datosLibro = req.body;
if (datosLibro.creator){
 datosLibro.creator = datosLibro.creator.toLowerCase();
}
if (datosLibro.contributor) {
 datosLibro.contributor = datosLibro.contributor.toLowerCase();
}

if (datosLibro.publisher){
  datosLibro.publisher = datosLibro.publisher.toLowerCase();
}
if (req.file){
 let nombre = req.file.filename;
  let ruta = "/uploads/pdfs/"+nombre;
  datosLibro.url = ruta;
  datosLibro.identifier = req.file.destination;
  datosLibro.format = "pdf"
} 
if (datosLibro.title) {
  datosLibro.title = datosLibro.title.toLowerCase();
}
if (datosLibro.subject) {
  datosLibro.subject = datosLibro.subject.toLowerCase();
}
if (datosLibro.description) {
  datosLibro.description = datosLibro.description.toLowerCase();
}
if (datosLibro.relation) {
  datosLibro.relation = datosLibro.relation.toLowerCase();
} 
if (datosLibro.coverage) {
  datosLibro.coverage = datosLibro.coverage.toLowerCase();
}
if (datosLibro.rights) {
  datosLibro.rights = datosLibro.rights.toLowerCase();
}
if (datosLibro.type) {
  datosLibro.type = datosLibro.type.toLowerCase();
}
if (datosLibro.source) {
  datosLibro.source = datosLibro.source.toLowerCase();
}
if (datosLibro.language) {
  datosLibro.language = datosLibro.language.toLowerCase();
}
if (datosLibro.core) {
  datosLibro.core = datosLibro.core.toLowerCase();
}
if (datosLibro.suscription) {
  datosLibro.suscription = datosLibro.suscription.toLowerCase();
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
          cota: cota,
          title: datosLibro.title,
          contributor: datosLibro.contributor,
          subject: datosLibro.subject,
          creator: datosLibro.creator,
          description: datosLibro.description,
          publisher: datosLibro.publisher,
          date: datosLibro.date,
          format: datosLibro.format,
          identifier:datosLibro.identifier,
          relation: datosLibro.relation,
          coverage: datosLibro.coverage,
          rights: datosLibro.rights,
          type: datosLibro.type,
          statusBook: 'disponible',
          source: datosLibro.source,
          language: datosLibro.language,
          url: datosLibro.url,
          core: datosLibro.core,
          tipo_s: datosLibro.suscription
        });
       
       
      }
    

      nLibro = await Libros.bulkCreate(crear);

    }else{
       nLibro = await Libros.create({
        cota: datosLibro.cota_1,
        title: datosLibro.title,
        contributor: datosLibro.contributor,
        subject: datosLibro.subject,
        creator: datosLibro.creator,
        description: datosLibro.description,
        publisher: datosLibro.publisher,
        date: datosLibro.date,
        format: datosLibro.format,
        identifier:datosLibro.identifier,
        relation: datosLibro.relation,
        coverage: datosLibro.coverage,
        rights: datosLibro.rights,
        type: datosLibro.type,
        statusBook: 'disponible',
        source: datosLibro.source,
        language: datosLibro.language,
        url: datosLibro.url,
        core: datosLibro.core,
        tipo_s: datosLibro.suscription
    });
    }
    
   



    if (nLibro) {
    res.status(200).send('Carga satisfactoria');
     
    }
    
  } catch (error) {
    console.log(error);
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

}else if(cota == ' '){

  res.send('La cota no debe ser nula');
}else {
  res.send('');
}
}catch(error){
 res.status(500);
}
};
//consulta de libros premium
module.exports.premium = async function (req, res, next) {
  try {
    const libros = await Libros.findAll({
      where: {
        tipo_s: 'premium'
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

//consulta de libros estandar
module.exports.estandar = async function (req, res, next) {
  try {
    const libros = await Libros.findAll({
      where: {
        tipo_s: 'estandar'
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
//libros basicos
module.exports.basico = async function (req, res, next) {
  try {
    const libros = await Libros.findAll({
      where: {
        tipo_s: 'basica'
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
   
   /* var librosJson = JSON.stringify(libros);
    
   var json2xml = require('json2xml');

    var librosXml = json2xml(JSON.parse(librosJson) , { header: true });
    console.log(librosXml);
*/
    
    if (libros) {
      
      res.status(200).json({
        libros
      });
  }
  } catch (error) {
    console.log(error);
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
      libro: libro,
      usuarioL: req.session.usuarioL
    });
  } catch (error) {
    res.status(500);
  }
};



//Función que utiliza expresiones de posgresql
module.exports.bs = async function (req, res, next) {
  try {
    const b = req.body;
 let q1 = 'SELECT cota, title, contributor, subject, creator, description, publisher, date, format, identifier, relation, coverage, rights, type, source, language, url, core, tipo_s FROM libros WHERE ';
 let q = '';
  if (b.cota) {
   let cota = '%' + b.cota + '%';
   if ( q === '') {
     q = q1 + `cota ILIKE '${cota}'`;
   } else {
    q = q + `AND cota ILIKE '${cota}'`;
   }
  }
  if (b.title) {
    let title = '%' + b.title + '%';
    if ( q === '') {
      q = q1 + `title ILIKE '${title}'`;
    } else {
     q = q + `AND title ILIKE '${title}'`;
    }
   }
   if (b.creator) {
    let creator = '%' + b.creator + '%';
    if ( q === '') {
      q = q1 + `creator ILIKE '${creator}'`;
    } else {
     q = q + `AND creator ILIKE '${creator}'`;
    }
   }
   if (b.type) {
    let type = '%' + b.type + '%';
    if ( q === '') {
      q = q1 + `type ILIKE '${type}'`;
    } else {
     q = q + `AND type ILIKE '${type}'`;
    }
   }
   if (b.contributor) {
    let contributor = '%' + b.contributor + '%';
    if ( q === '') {
      q = q1 + `contributor ILIKE '${contributor}'`;
    } else {
     q = q + `AND contributor ILIKE '${contributor}'`;
    }
   }
   //comparar fechas en sql
   if (b.date) {
    let date = b.date;
    if ( q === '') {
      q = q1 + `date='${date}'`;
    } else {
     q = q + `AND TO_CHAR(año,'9999999999') ILIKE '${año}'`;
    }
   }
   if (b.suscription) {
    let suscription = '%' + b.suscription + '%';
    if ( q === '') {
      q = q1 + `tipo_s ILIKE '${suscription}'`;
    } else {
     q = q + `AND tipo_s ILIKE '${suscription}'`;
    }
   }
   if (b.description) {
    let description = '%' + b.description + '%';
    if ( q === '') {
      q = q1 + `description ILIKE '${description}'`;
    } else {
     q = q + `AND description ILIKE '${description}'`;
    }
   }
   
   if (b.publisher) {
    let publisher = '%' + b.publisher + '%';
    if ( q === '') {
      q = q1 + `publisher ILIKE '${publisher}'`;
    } else {
     q = q + `AND publisher ILIKE '${publisher}'`;
    }
   }
   if (b.format) {
    let format = '%' + b.format + '%';
    if ( q === '') {
      q = q1 + `format ILIKE '${format}'`;
    } else {
     q = q + `AND format ILIKE '${format}'`;
    }
   }
   if (b.relation) {
    let relation = '%' + b.relation + '%';
    if ( q === '') {
      q = q1 + `relation ILIKE '${relation}'`;
    } else {
     q = q + `AND relation ILIKE '${relation}'`;
    }
   }
   if (b.coverage) {
    let coverage = '%' + b.coverage + '%';
    if ( q === '') {
      q = q1 + `coverage ILIKE '${coverage}'`;
    } else {
     q = q + `AND coverage ILIKE '${coverage}'`;
    }
   }
   if (b.rights) {
    let rights = '%' + b.rights + '%';
    if ( q === '') {
      q = q1 + `rights ILIKE '${rights}'`;
    } else {
     q = q + `AND rights ILIKE '${rights}'`;
    }
   }
   if (b.source) {
    let source = '%' + b.source + '%';
    if ( q === '') {
      q = q1 + `source ILIKE '${source}'`;
    } else {
     q = q + `AND source ILIKE '${source}'`;
    }
   }
   if (b.language) {
    let language = '%' + b.language + '%';
    if ( q === '') {
      q = q1 + `language ILIKE '${language}'`;
    } else {
     q = q + `AND language ILIKE '${language}'`;
    }
   }
   if (b.core) {
    let core = '%' + b.core + '%';
    if ( q === '') {
      q = q1 + `core ILIKE '${core}'`;
    } else {
     q = q + `AND core ILIKE '${core}'`;
    }
   }
   if (b.subject) {
    let subject = '%' + b.subject + '%';
    if ( q === '') {
      q = q1 + `subject ILIKE '${subject}'`;
    } else {
     q = q + `AND subject ILIKE '${subject}'`;
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
    
    if(librosEliminados && libro.format === 'pdf'){
      const otrosLibros = await Libros.findAll({
        where:{
          url: libro.url
        },
      });
      if(otrosLibros.length >= 1){
        res.json({librosEliminados});
      }else if(otrosLibros.length == 0){
        let nombre = libro.url.split("/").pop();
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

  const {  cota,
    title,
    contributor,
    subject,
    creator,
    description,
    publisher,
    date,
    relation,
    coverage,
    rights,
    type,
    source,
    language,
    core,
    statusBook,
    tipo_s } = req.body;
  console.log(req.body);
let libro = {};
if (title){
  libro.title = title.toLowerCase();
}
if (cota){
  libro.cota = cota.toLowerCase();
}
if (contributor){
  libro.contributor = contributor.toLowerCase();
}
if (subject){
  libro.subject = subject.toLowerCase();
}
if (creator){
  libro.creator = creator.toLowerCase();
}
if (description){
  libro.description = description.toLowerCase();
}
if (date){
  libro.date = date;
}

if (publisher){
  libro.publisher = publisher.toLowerCase();
}

if (tipo_s){
  libro.tipo_s = tipo_s.toLowerCase();
}
if (req.file){
  let nombre = req.file.filename;
   let ruta = "/uploads/pdfs/"+nombre;
   libro.url = ruta;
   libro.identifier = req.file.destination;
   libro.format = "pdf"
 }
 if (relation) {
libro.relation = relation.toLowerCase();
 }    
 if (coverage) {
   libro.coverage = coverage.toLowerCase();
 }
 if (rights) {
   libro.rights = rights.toLowerCase();
 }
 if (type) {
   libro.type = type.toLowerCase();
 }
 if (source) {
   libro.source = source.toLowerCase();
 }
 if (language) {
   libro.language = language.toLowerCase();
 }
 if (core) {
   libro.core= core.toLowerCase()
 }
 if (statusBook) {
   libro.statusBook= statusBook.toLowerCase();
 }
  try {
    let otrosLibros = '';
    const viejoLibro = await Libros.findOne({
      where:{
        cota: libro.cota
      }
    });
    const nuevoLibro = await Libros.update({

         core:libro.core ,
         tipo_s:libro.tipo_s,
         identifier: libro.identifier,
         publisher: libro.publisher,
         title: libro.title,
         contributor: libro.contributor,
         subject: libro.subject,
         creator: libro.creator,
         description: libro.description,
         date: libro.date,
         relation: libro.relation,
         coverage: libro.coverage,
         rights: libro.rights,
         type: libro.type,
         source: libro.source,
         language: libro.language,
         statusBook: libro.statusBook

          
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
    console.log(error);
    res.status(500).json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
};