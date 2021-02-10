const {Sequelize, DataTypes} = require ('sequelize');
var sequelize = require ('../database/database');


const PreguntasFrecuentes = sequelize.define('preguntas_f', {
    id_pf: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
        },
   
    titulo_pregunta: {
        type: Sequelize.TEXT,
        allowNull: false,
        Unique: true
    },
    text_respuesta: {
        type: Sequelize.TEXT,
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
    
    module.exports = PreguntasFrecuentes;
