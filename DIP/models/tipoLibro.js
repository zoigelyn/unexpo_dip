var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Tipo_Libro = sequelize.define('tipo_libro', {
    id_tl: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
     },  
    tipo_tl: {
        type: Sequelize.STRING,
        Unique: true, 
        allowNull: false   
    
    },
    descripcion_tl: {
        type: Sequelize.STRING
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

module.exports = Tipo_Libro;