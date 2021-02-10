var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Tipo_Libro = sequelize.define('tipo_libro', {
    
    tipo_tl: {
        type: Sequelize.STRING(20),
        Unique: true, 
        allowNull: false,
        primaryKey: true  
    
    },
    descripcion_tl: {
        type: Sequelize.STRING(100),
        dafaultValue: 'no aplica'
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