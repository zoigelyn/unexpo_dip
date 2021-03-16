
const express = require ('express');//Middleware para hacer funcionar el servidor con node.js de manera
const morgan = require ('morgan');//Se utiliza para ver el tipo de solicitud que se ejecuta
const path = require('path');//middleware que se utliza para hallar el directorio raiz de algunos casos
const methodOverride = require('method-override');//Middleware que se usa para que solicitudes tipo "post" se traten como otro tipo de solicitud, esto en caso de que se envie la información desde formularios los cuales solo son usados con solicitudes tipo "post", referente a las platillas ejs
const  flash = require ('connect-flash');//middleware que se utiliza para almacenar mensajes que luego son enviados al cliente
const passport = require ('passport'); //middleware usado para la autentificación de usuario
const session = require ('express-session'); //middleware para el manejo de la sesión del usuario
const favicon = require('serve-favicon');//Se utiliza como identificación de un sitio web, este no es necesario para ser ejecutado localmente pero si para ser ejecutado en la web


//
var sequelize = require ('./database/database');// middleware usado para la configuración de la base de datos y modelado, este no es obligatorio pero si muy util porque a través de el se logra modelar la base de datos con javascript y de este modo en caso de emigrar a otro sistema diferente a postgresql no se deben hacer cambios en los modelos de cada tabla sino cambios en la configuración general, eso si siempre y cuando sean relacional


//inicialization
const app = express();// ejecuto el middleware express y el me devuelve un objeto, el servidor
require ('./passport/local-auth');//Se requiere las estrategias creadas en el directorio referido

//
//Configuración del motor de plantillas
app.set('views', path.join(__dirname, 'views'));//ubicación
app.set('view engine', 'ejs');//nombre del motor de plantillas a usar



//middlewares=>> funciones que procesan los datos antes de llegar a las rutas
app.use(morgan('dev'));
app.use(express.json());//Configuramos nuestro servidor para que reciba datos en formato json
app.use(express.urlencoded({ extended: false }));//Configuramos para que nuestro servidor reciba datos en forma de objeto como los que se envian desde un formulario, extended: false para que solo sean datos sin archivos. Debido a que este ultimo se realiza con multer.js
app.use( express.static(path.join(__dirname, 'public')));//De esta manera se hace saber al servidor que la carpeta public es de acceso publico
app.use(favicon(path.join(__dirname, 'public','assets','icons','favicon.ico')));//configuracion de favicon, ubicación

app.use(methodOverride('_method'));
//Configuración de la sesión, estas son proporcionadas por la documentación oficial
app.use(session({
  secret: 'miSecreto',
  resave: false,
  saveUninitialized: true,//investigar porque false
  cookie: {
maxAge: 180000000
    }  
})
); 

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



//En caso de que existan los mensajes de flash se almacenan en variables locales que pueden ser accedida desde cualquier ubicación en el tiempo de vigencia, este es de una petición
app.use((req, res, next) => {
  try {
    app.locals.mensajeRegistro = req.flash('mensajeRegistro');
  app.locals.mensajeIngreso = req.flash('mensajeIngreso');
  app.locals.mensajeRecuperacion = req.flash('mensajeRecuperacion');
 
 
  next();
  } catch (error) {
    next(error);
  }
});




var CronJob = require("cron").CronJob;
const {actualizarEstadoF, actualizarR, multas, envioCorreo} = require("./controllers/fichas.controller");

var cronJob1 = new CronJob({
  cronTime: '01 00 02 * * *',
  onTick: async function () {
    console.log('Actualzando fichas del  '+ new Date()); 
    await actualizarR();
    await actualizarEstadoF();
   
    await multas();
    await envioCorreo();
    
  },
  start: true,
  timeZone: "America/Caracas"
});


//Se requieren las rutas de cada archivo
app.use(require ('./routes/fichas.routes') );
app.use(require ('./routes/usuarios.routes'));
app.use(require ('./routes/libros.routes'));
app.use(require('./routes/configuracion.routes'));
app.use(require('./routes/inicio.routes'));
app.use(require('./routes/noticias.routes'));
app.use(require('./routes/excel.routes'));
app.use(require('./routes/preguntasFrecuentes.routes'));

app.use(function(req, res, next) {
  res.status(404);

  res.format({
    html: function () {
      res.render('404', { titulo: 'No encontrado', url: req.url })
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
});

app.use(function(error, req, res, next){
  let statusCode = error.status || 500;
let statusText = '';
let mensaje;
if (error.mensaje) {
  mensaje = error.mensaje;
} else {
  mensaje = '';
}
  switch (statusCode) {
    case 400:
      statusText = 'Bad Request';
      break;
    case 401:
      statusText = 'Unauthorized';
      break;
    case 403:
      statusText = 'Forbidden';
      break;
    case 500:
      statusText = 'Internal Server Error';
      break;
    };

  res.render('error', {
    tipoError: statusText,
    code: statusCode,
    titulo: 'Error',
    message: mensaje 
  });
  if ('development' === app.get('env')) {
    console.log(error);
  }
});



module.exports = app;
