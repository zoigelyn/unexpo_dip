
const path = require('path');
let destino = path.join(__dirname, '..\\..\\.env')
require('dotenv').config({path: destino});
//Se requiere para el uso de variables de entorno

var Sequelize = require('sequelize')//Se requiere sequelize
	  , sequelize = null
  
/**/		if (process.env.DATABASE_URL) {// si existe las variables que me brinda heroku
	  sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect:  'postgres',
		dialectOptions: {
			ssl: {
				rejectUnauthorized: false
			}
		  },
		protocol: 'postgres',
		port:     '5432',
		host:     'ec2-54-90-13-87.compute-1.amazonaws.com',
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