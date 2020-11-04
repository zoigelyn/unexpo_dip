
var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');

const Estado_Prestamo  = sequelize.define('estado_prestamo', {
    id_ep: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
     },  

     estado_ep: {
        type: Sequelize.STRING,
        Unique: true, 
        allowNull: false   
    },
    descripcion_ep: {
    type: Sequelize.STRING
    },
    created_at:{
        type: Sequelize.DATE,
        field: 'created_at'
    },
    updated_at:{
        type: Sequelize.DATE,
        field: 'updated_at'
    }
}, {
    timestamps: true
});

module.exports = Estado_Prestamo;