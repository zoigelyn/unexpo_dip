const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');

const Docentes = sequelize.define('docentes', {
    cedula_d: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false,
        validate: {
            is: /^([VE]-)[0-9]{1,8}$/i,
            len: [3,10]
        }
    },
    nombres_d: {
        type: Sequelize.STRING(35),
        allowNull:false,
        validate: {
           max: 35,
           isAlpha: true 
        }
        
    },
    apellidos_d:{
        type: Sequelize.STRING(35),
        allowNull:false,
       validate: {
          max: 35,
        isAlpha: true 
       } 
    },
    materia: {
        type: Sequelize.STRING(50),
        allowNull:false,
       validate: {
          max: 50,
        isAlpha: true 
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


module.exports = Docentes;