var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const ConfDiasLibros = sequelize.define('conf-dias-libros', {
    id_c: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
     },  
    dias_prestamo: {
        type: Sequelize.INTEGER,
        allowNull: false   
    
    },
    cantidad_libros: {
        type: Sequelize.INTEGER
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