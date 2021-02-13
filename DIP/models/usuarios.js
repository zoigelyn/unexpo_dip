const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');
const Tipo_Usuario = require ('./tipoUsuario');


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
        type: Sequelize.STRING(10),
        allowNull: false
       },
    nombres_u: {
        type: Sequelize.STRING(35),
        allowNull:false
    },
    apellidos_u:{
        type: Sequelize.STRING(35),
        allowNull:false
    },
    clave_u:{
        type: Sequelize.STRING,
        allowNull:false
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

module.exports = Usuarios;
