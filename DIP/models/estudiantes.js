var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');

const Estudiantes = sequelize.define('estudiantes', {
    
    cedula_e: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        validate: {
            is: /^([VE]-)[0-9]{1,8}$/i
        }
        

        },
    nombres_e: {
        type: Sequelize.STRING(35),
        allowNull: false,
        validate: {
            isAlpha: true,
        max: 35
        }
    },
    apellidos_e: {
        type: Sequelize.STRING(35),
        allowNull: false,
       validate:{
          isAlpha: true,
        max: 35 
       } 
    },
    especializacion:{
      type: Sequelize.STRING(50),
      allowNull: true,
      validate: {
          isAlpha: true,
      max: 35
      }
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


module.exports = Estudiantes;
