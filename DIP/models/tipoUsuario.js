var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Usuario = require('./usuarios');

const Tipo_Usuario = sequelize.define('tipo_usuario', {
    id_tu: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
     },  
    tipo_tu: {
        type: Sequelize.STRING,
        Unique: true, 
        allowNull: false   
    
    },
    descripcion_tu: {
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




module.exports = Tipo_Usuario;