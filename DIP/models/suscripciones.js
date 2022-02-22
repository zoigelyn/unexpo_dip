var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Tipo_Suscripcion = require('../models/tipoSuscripcion');
const Usuarios = require('../models/usuarios');
const Estado_Prestamo = require('../models/estadoPrestamo');
const Suscripciones = sequelize.define('suscripciones', {
    
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement:true
    },
    tipo: {
        type: Sequelize.STRING,
       allowNull: false
    },
    correo_s: {
        type: Sequelize.STRING,
        allowNull: false
    },
    estado_s: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    fecha_c: {
        type: Sequelize.DATEONLY
    },
    comprobante: {
        type: Sequelize.TEXT
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
Tipo_Suscripcion.hasMany(Suscripciones,{
    sourceKey: 'tipo_ts', 
    foreignKey: 'tipo'});
Suscripciones.belongsTo(Tipo_Suscripcion,{targetKey: 'tipo_ts', foreignKey: 'tipo'});
Estado_Prestamo.hasMany(Suscripciones,{
    sourceKey: 'estado_ep', 
    foreignKey: 'estado_s'});
Suscripciones.belongsTo(Estado_Prestamo,{targetKey: 'estado_ep', foreignKey: 'estado_s'});
Usuarios.hasMany(Suscripciones, {
    sourceKey: 'correo_u', foreignKey: 'correo_s'});
    Suscripciones.belongsTo(Usuarios, {
    targetKey: 'correo_u', foreignKey: 'correo_s'});
module.exports = Suscripciones;