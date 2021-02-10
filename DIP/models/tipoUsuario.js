var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Usuario = require('./usuarios');

const Tipo_Usuario = sequelize.define('tipo_usuario', {
     
    tipo_tu: {
        type: Sequelize.STRING(20),
        allowNull: false, 
        primaryKey: true
    },
    descripcion_tu: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: 'no aplica' 
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




module.exports = Tipo_Usuario;