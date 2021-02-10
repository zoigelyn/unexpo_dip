
var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');

const Estado_Prestamo  = sequelize.define('estado_prestamo', {
    

     estado_ep: {
        type: Sequelize.STRING(20),
        Unique: true, 
        allowNull: false,
        primaryKey: true 
    },
    descripcion_ep: {
    type: Sequelize.STRING(100),
    allowNull: true,
    validate: {
    isAlpha: true,
    max: 100
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

module.exports = Estado_Prestamo;