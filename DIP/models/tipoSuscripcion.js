var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Tipo_Suscripcion = sequelize.define('tipo_suscripcion', {
    
    tipo_ts: {
        type: Sequelize.STRING(20),
        Unique: true, 
        allowNull: false,
        primaryKey: true  
    
    },
    descripcion_ts: {
        type: Sequelize.STRING(100),
        dafaultValue: 'no aplica'
    },
    costo: {
        type: Sequelize.INTEGER,
        default: 0
    }, 
    vigencia: {
        type: Sequelize.INTEGER,
        default: 0
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

module.exports = Tipo_Suscripcion;