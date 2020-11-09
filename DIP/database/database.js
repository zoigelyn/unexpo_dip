/*var Sequelize = require('sequelize');

var sequelize = new Sequelize("unexpo-DIP","postgres","unexpo20112",{
	dialect:"postgres", //OTROS VALORES: postgres, mysql, mariadb
	//la propiedad storage SOLO ES PARA sqlite
	define:{
		//timestamps:true,
		timezone: 'utc',
		//deshabilita la convencion por default para el nombre de las tablas
		freezeTableName:true
	}
});

sequelize.authenticate()
//sequelize.sync()
//Estudiantes.sync()
//Docentes.sync()
.then(() =>{
	
	console.log('conectado')
	
})
.catch(err => {
	console.log(err);
    console.log('no se conecto')
});


module.exports = sequelize;
*/


require('dotenv').config()
	var Sequelize = require('sequelize')
	  , sequelize = null
  
	if (process.env.HEROKU_POSTGRESQL_URL) {
	  // the application is executed on Heroku ... use the postgres database
	  sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
		dialect:  'postgres',
		protocol: 'postgres',
		port:     match[4],
		host:     match[3],
		logging:  true //false
	  })
	} else {
	  // the application is executed on the local machine ... use mysql
	  sequelize = new Sequelize("unexpo-DIP","postgres","unexpo20112",{
		dialect:"postgres", //OTROS VALORES: postgres, mysql, mariadb
		//la propiedad storage SOLO ES PARA sqlite
		define:{
			//timestamps:true,
			timezone: 'utc',
			//deshabilita la convencion por default para el nombre de las tablas
			freezeTableName:true
		}
	});
	
	}
  /*
	global.db = {
	  Sequelize: Sequelize,
	  sequelize: sequelize,
	  Usuario: sequelize.import(__dirname + '\models\usuario'),
	  tipoUsuario: sequelize.import(__dirname + '\models\tipoUsuario') 
	  // add your other models here
	}
  
	/*
	  Associations can be defined here. E.g. like this:
	  global.db.User.hasMany(global.db.SomethingElse)
	*/
  
	sequelize.authenticate()
	
	.then(() =>{
		
		console.log('conectado')
		
	})
	.catch(err => {
		console.log(err);
		console.log('no se conecto')
	});
  module.exports = sequelize;