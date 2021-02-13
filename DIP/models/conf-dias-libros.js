var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const ConfDiasLibros = sequelize.define('conf_dias_libros', {
    id_c: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
     },  
    dias_prestamo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
        validate: {
            isInt: true 
        }
    },
    multa: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 1
    },
    unidad: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'Bolivares'
    },
    cantidad_libros: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
        validate: {
           isInt: true   
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

module.exports = ConfDiasLibros;