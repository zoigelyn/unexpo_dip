var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');

const Estado_Libro  = sequelize.define('estado_libro', {
    id_el: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
     },  

     estado_el: {
        type: Sequelize.STRING,
        Unique: true, 
        allowNull: false   
    },
    descripcion_el: {
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

module.exports = Estado_Libro;