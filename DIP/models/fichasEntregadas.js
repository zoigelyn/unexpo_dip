var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Estado_Prestamo = require ('./estadoPrestamo');
const Libros = require('./libros');

const fichasEntregadas = sequelize.define('fichas_entregadas', {
    
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
      type: Sequelize.DATE,
      allowNull: false
      },
    

     fecha_c :Sequelize.DATE,
    estado_f: {
        type: Sequelize.STRING,
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



Estado_Prestamo.hasMany(fichasEntregadas, {sourceKey: 'estado_ep', foreignKey: 'estado_f'});
fichasEntregadas.belongsTo(Estado_Prestamo, { 
targetKey: 'estado_ep', foreignKey: 'estado_f'});

Libros.hasOne(fichasEntregadas, {sourceKey: 'cota', foreignKey: 'cota_f'});
fichasEntregadas.belongsTo(Libros, {targetKey: 'cota', foreignKey: 'cota_f'});





module.exports = fichasEntregadas;