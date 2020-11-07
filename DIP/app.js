
const express = require ('express');
const morgan = require ('morgan');
const path = require('path');
const methodOverride = require('method-override');
const  flash = require ('connect-flash');
const passport = require ('passport');
const session = require ('express-session');
const multer = require('multer');




const {existeBibliotecario} = require('./controllers/usuarios.controllers');




//
var sequelize = require ('./database/database');

//importing routes
//const typeBookRoutes = require ('./routes/typeBook.routes');
const vencimiento = require('./controllers/fichas.controller');

//database


//inicialization
const app = express();
require ('./passport/local-auth');

//
//view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use( express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public')));

/*app.use('/conf', express.static(path.join(__dirname, 'public')));
app.use('/libros', express.static(path.join(__dirname, 'public')));
app.use('/index', express.static(path.join(__dirname, 'public')));
*/
app.use(methodOverride('_method'));
//app.use(cookieParser);
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


/*app.use((req, res,next) => {
  existeBibliotecario(req, res, next);
  next();
});*/

app.use((req, res, next) => {
  app.locals.mensajeRegistro = req.flash('mensajeRegistro');
  app.locals.mensajeIngreso = req.flash('mensajeIngreso');
  app.locals.mensajeRecuperacion = req.flash('mensajeRecuperacion');
 
 
  next();
});

app.get('/444', function(req, res, next){
  console.log('aqui estoy');
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

app.get('/403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('not allowed!');
  err.status = 400;
  next(err);
});

app.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});



//routes
//app.use('/typeBook', typeBookRoutes);
//const Sequelize = require ('sequelize');
/*const Fichas = require('./models/fichas');
const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");
const Libros = require('./models/libros');


app.use(async (req, res, next) => {
  
    const fechaHoy = new Date();
   console.log(fechaHoy);
   try {
    const fichas = await Fichas.findAll({
         where:{
           [Op.gte]: [
             { fecha_d: fechaHoy }
           ]
         }
       });
       console.log(fichas);
   } catch(error){
     console.log(error);
   }

  next();
});*/
app.use(require ('./routes/fichas.routes') );
app.use(require ('./routes/usuarios.routes'));
app.use(require ('./routes/libros.routes'));
app.use(require('./routes/preguntas.routes'));
app.use(require('./routes/configuracion.routes'));
app.use(require('./routes/inicio.routes'));

app.use(function(req, res, next){
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

app.use(function(err, req, res, next){
  let statusCode = err.status || 500;
let statusText = '';
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
    titulo: 'Error'
  });
});


module.exports = app;
