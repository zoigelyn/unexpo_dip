var Sequelize = require('sequelize');

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