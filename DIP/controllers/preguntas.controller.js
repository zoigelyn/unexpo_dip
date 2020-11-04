const Preguntas = require('../models/preguntas');
const { QueryTypes} = require('sequelize')
const sequelize = require('../database/database');


module.exports.insertarPregunta = async function insertarPregunta(request, response) {
const {pregunta} = request.body;
      

  try {
    let nPregunta = await Preguntas.create({
     pregunta: '¿ ' + pregunta.toLowerCase() + ' ?'
    });

let nuevaPregunta = await Preguntas.findAll({
  attributes: [
    ['id_p', 'id'],
    'pregunta',
    ['created_at','fecha de registro'],
    ['updated_at','fecha de actualizacion'],
    ],
  where: {
    pregunta: '¿ ' + pregunta.toLowerCase() + ' ?'
  },
});

    if (nPregunta) {
      return response.json({
        message: 'creado safisfactoriamente',
        data: nuevoPregunta
      });
    }
  } catch (error) {
    console.log(error),
      response.status(500).json({
        message: 'ha ocurrido un error',
        data: {},
      });
  }
};
/*
module.exports.totalLibros = async function totalLibros(request, response) {
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
        'volumen',,
        ['created_at', 'fecha de registro'],
        ['updated_at', 'fecha de ultima actualizacion'],
      ],
    });
    response.json({
      data: libros,
      resultados: libros.length,
      message: 'busqueda exitosa',
    });
  } catch (error) {
    console.log(error);
    response.json({
      data: {},
      message: 'ha ocurrido un error',
    });
  }
};

module.exports.busquedaEspecifica = async function busquedaEspecifica(request, response) {
  const datosLibro = request.query;
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
if (datosLibro.created_at){
  busqueda.created_at = datosLibro.created_at;
}
if (datosLibro.updated_at){
  busqueda.updated_at = datosLibro.updated_at;
}
   
  try {
    
    libros =   await Libros.findAll({
      attributes: [
        'cota',
        ['tipo_l', 'tipo de material bibliografico'],
        'autor',
        'tutor',
        'editorial',
        'titulo',
        'año',
        'volumen',,
        ['created_at', 'fecha de registro'],
        ['updated_at', 'fecha de ultima actualizacion'],
      ],
    

      where: busqueda,
      
    });

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


module.exports.eliminarLibro = async function eliminarLibro(request, response) {
  var libro = request.query;

  try {
    const librosEliminados = await Libros.destroy({
      where: libro,
    });
    response.json({
      message: 'se han afectado ' + librosEliminados + ' filas',
    });
  } catch (error) {
    response.json({
      message: 'ha fallado la eliminacion',
    });
  }
};



module.exports.actualizarLibro = async function actualizarLibro(request, response) {
  const { cota, editorial, titulo, autor, tutor, año, volumen, tipo_l} = request.query;
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


module.exports.actualizarUnLibro = async function actualizarUnLibro(request, response) {
 
  const { editorial, titulo, autor, tutor, año, volumen, tipo_l} = request.query;
  const { editorialb, titulob, autorb, tutorb, añob, volumenb, tipo_lb} = request.body;
  const nuevoLibro ={};
  const libro = {};


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
*/