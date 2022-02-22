var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Tipo_Categoria = sequelize.define('tipo_categoria', {
    
    
  categoria: {
        type: Sequelize.STRING,
         primaryKey: true,
         allowNull: false 
    
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

module.exports = Tipo_Categoria;