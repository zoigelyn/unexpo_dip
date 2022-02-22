var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Tipo_Nucleo = sequelize.define('tipo_nucleo', {
    
    
   nucleo: {
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

module.exports = Tipo_Nucleo;