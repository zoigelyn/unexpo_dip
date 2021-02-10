const  PreguntasFrecuentes  = require('../models/preguntasFrecuentes');

   
  module.exports.insertarPregunta = async function (req, res, next) {
    const datosPregunta = req.body;
    datosPregunta.titulo = '¿' + datosPregunta.titulo + '?';

   
    let nuevaPregunta = await PreguntasFrecuentes.create({
      titulo_pregunta: datosPregunta.titulo,
      text_respuesta: datosPregunta.textRespuesta
      });
      
      if (nuevaPregunta) {
        res.send('Creada con exito');
      } else {
        res.send('');
      }
    };
//Función que consulta las preguntas frecuentes almacenadas
  module.exports.mostrarPreguntasF = async function (req, res, next) { 
        try {
          const preguntas = await PreguntasFrecuentes.findAll();
          if (preguntas) {
      
          res.status(200).send(preguntas);

        }
        } catch (error) {
         res.status(500);
        }
    };

  module.exports.unaPregunta = async function (req, res, next) {
    const id = req.query.id_pf;
    try {
      const pregunta = await PreguntasFrecuentes.findOne({
        where: {
          id_pf: id,
        }
      });
      if (pregunta) {
  
      res.send(pregunta);
    }
    } catch (error) {
      console.log(error);
      res.json({
        data: {},
        message: 'ha ocurrido un error',
      });
    }

  }
  module.exports.actualizarPregunta = async function (req, res, next) {
    const datosPregunta = req.body;
   console.log(datosPregunta);
      let nuevaPregunta = await PreguntasFrecuentes.update({
      text_respuesta: datosPregunta.texto,
      titulo_pregunta: datosPregunta.titulo
      }, { where: { id_pf: datosPregunta.id_pf} 

      });
  
      
      if (nuevaPregunta) {
        console.log(nuevaPregunta);
        res.send('Actualizada con exito');
      } else {
        res.send('');
      }
  };
  module.exports.eliminarUnaPregunta = async function(req, res, next) {
  const id = req.query.id_pf;
    try {
     
    
       const preguntaEliminada = await PreguntasFrecuentes.destroy({
        where: {
          id_pf: id
        },
      });
      
      if ( preguntaEliminada ) {
        
       
     res.send('ok');
     
    }
     
    } catch (error) {
      res.status(500);
    }
  }
    