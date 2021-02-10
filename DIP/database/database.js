
const path = require('path');
let destino = path.join(__dirname, '..\\..\\.env')
require('dotenv').config({path: destino});
//Se requiere para el uso de variables de entorno

var Sequelize = require('sequelize')//Se requiere sequelize
	  , sequelize = null
  
	if (process.env.HEROKU_POSTGRESQL_URL) {// si existe las variables que me brinda heroku
	 
	  sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
		dialect:  'postgres',
		protocol: 'postgres',
		port:     match[4],
		host:     match[3],
		logging:  true 
	  })
	} else {
	//Sino se ejecuta localmente
	  sequelize = new Sequelize(process.env.NAME_DATABASE, process.env.USUARIO_DATABASE, process.env.CLAVE_DATABASE,{
		dialect:"postgres", 
		define:{
			timezone: 'utc',
			//deshabilita la convencion por default para el nombre de las tablas
			freezeTableName:true
		}
	});
	
	}

    (async () => {
			
		});
	sequelize.authenticate()//autentifica la conexion
	.then(async function(){
		
		
	await sequelize.sync({force: true})	//Elimina las tablas existentes en la base de datos y crea las nuevas en base a los modelos
		console.log('conectado');
		
	})
	.catch(error => {
		console.log('no se conecto');
		console.log(error);
		
	});
	
  module.exports = sequelize;