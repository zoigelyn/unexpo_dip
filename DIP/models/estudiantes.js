var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');

const Estudiantes = sequelize.define('estudiantes', {
    
    cedula_e: {
        type: Sequelize.INTEGER,
        primaryKey: true
        },
    nombres_e: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apellidos_e: {
        type: Sequelize.STRING,
        allowNull: false
    },
    especializacion:{
      type: Sequelize.DATE,
      allowNull: false
      },
    createdAt:{
        type: Sequelize.DATE,
        field: 'created_at'
    },
    updatedAt:{
        type: Sequelize.DATE,
        field: 'updated_at'
    }
    
}, {
        timestamps: true
    });
/*(async() => {
    await Estudiantes.sync();  
})();*/

module.exports = Estudiantes;
