var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Estado_Prestamo = require ('./estadoPrestamo');
const Usuarios = require('./usuarios');
const Libros = require('./libros');

const Fichas = sequelize.define('fichas', {
    
    n_solicitud: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
        },
    cota_f: {
        type: Sequelize.STRING(25),
        allowNull: false
    },
    correo_f: {
        type: Sequelize.STRING(50),
        allowNull: false,
        Validate: {
            isEmail: true
        }
    },
    fecha_e:{
      type: Sequelize.DATEONLY,
      allowNull: false
      },
    
    fecha_d: {
        type: Sequelize.DATEONLY,
        allowNull: false
        },
     fecha_c :Sequelize.DATEONLY,
    estado_f: {
        type: Sequelize.STRING(20),
        allowNull: false
        },
    multa: {
        type: Sequelize.STRING,
        defaultValue: '0'
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



Estado_Prestamo.hasMany(Fichas, {sourceKey: 'estado_ep', foreignKey: 'estado_f'});
Fichas.belongsTo(Estado_Prestamo, { 
targetKey: 'estado_ep', foreignKey: 'estado_f'});

Usuarios.hasMany(Fichas, {
sourceKey: 'correo_u', foreignKey: 'correo_f'});
Fichas.belongsTo(Usuarios, {
targetKey: 'correo_u', foreignKey: 'correo_f'});

Libros.hasOne(Fichas, {sourceKey: 'cota', foreignKey: 'cota_f'});
Fichas.belongsTo(Libros, {targetKey: 'cota', foreignKey: 'cota_f'});





module.exports = Fichas;
