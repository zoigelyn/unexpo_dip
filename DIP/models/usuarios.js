const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');
const Tipo_Usuario = require ('./tipoUsuario');
const Tipo_Suscripcion = require('./tipoSuscripcion');
const Estado_Prestamo = require('./estadoPrestamo');


const Usuarios = sequelize.define('usuarios', {
    correo_u: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    tipo_u: {
        type:Sequelize.STRING(20),
        allowNull: false
    },
    cedula_u: {
        type: Sequelize.INTEGER(11)
       },
    pasaporte_u: {
        type: Sequelize.INTEGER(10)
    },
    nombres_u: {
        type: Sequelize.STRING(35)
    },
    apellidos_u:{
        type: Sequelize.STRING(35)
    },
    clave_u:{
        type: Sequelize.STRING,
        allowNull:false
    },
    tipo_s: {
        type: Sequelize.STRING,
        allowNull: false
    },
    estado_s: {
        type: Sequelize.STRING,
        allowNull: false,
        default: 'pendiente'
    },
    fecha_s: {
        type: Sequelize.DATEONLY,
        default: new Date()
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


Tipo_Usuario.hasMany(Usuarios,{
    sourceKey: 'tipo_tu', 
    foreignKey: 'tipo_u'});
Usuarios.belongsTo(Tipo_Usuario,{targetKey: 'tipo_tu', foreignKey: 'tipo_u'});

Tipo_Suscripcion.hasMany(Usuarios,{
    sourceKey: 'tipo_ts', 
    foreignKey: 'tipo_s'});
Usuarios.belongsTo(Tipo_Suscripcion,{targetKey: 'tipo_ts', foreignKey: 'tipo_s'});
Estado_Prestamo.hasMany(Usuarios,{
    sourceKey: 'estado_ep', 
    foreignKey: 'estado_s'});
Usuarios.belongsTo(Estado_Prestamo,{targetKey: 'estado_ep', foreignKey: 'estado_s'});

module.exports = Usuarios;
