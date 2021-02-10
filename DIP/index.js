const app = require ('./app');//requiero el servidor
const path = require('path');
let destino = path.join(__dirname, '..\\.env')
require('dotenv').config({path: destino});//Se configura la ubicacion de la carpeta

app.set('port', process.env.PORT || 3000);//configuración del puerto donde va a escuchar mi servidor, en este caso tomara el puerto de una variable de entorno configurada en el archivo .env ó el puerto 3000

/*sequelize.sync().then(function() {*/
    app.listen(app.get('port'), function(){//le ordeno comenzar a correr o escuchar mi servidor en el puerto ya configurado
      console.log('Servidor Express escuchando en el puerto ' + app.get('port'));//Si comienza a correr me envia este mensaje por consola
    });
   /* 
  });*/
  