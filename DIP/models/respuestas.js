const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');
const Preguntas = require('./preguntas');
const Usuarios = require('./usuarios');

const Respuestas = sequelize.define('respuestas', {
    
    id_pr: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    respuesta: {
        type: Sequelize.STRING,
        allowNull: false
    },
    correo_r: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
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
    Usuarios.hasMany(Respuestas, {
        sourceKey: 'correo_u', foreignKey: 'correo_r'});
        Respuestas.belongsTo(Usuarios, {
        targetKey: 'correo_u', foreignKey: 'correo_r'});
        
        Preguntas.hasOne(Respuestas, {sourceKey: 'id_p', foreignKey: 'id_pr' });
        Respuestas.belongsTo(Preguntas, {targetKey: 'id_p', foreignKey: 'id_pr'});

module.exports = Respuestas;