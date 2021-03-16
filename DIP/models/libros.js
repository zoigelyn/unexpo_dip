'use strict';
var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Tipo_Libro = require ('./tipoLibro');
const Estado_Libro = require('./estadoLibro');


const Libros = sequelize.define('libros', {
    cota: {
        type: Sequelize.STRING(25),
        primaryKey: true,
        allowNull: false
    },
    tipo_l: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    autor: {
        type: Sequelize.STRING(100),
    allowNull: false,
    defaultValue: 'no aplica'
},
    tutor: {
        type: Sequelize.STRING(100),
    allowNull: false,
    defaultValue: 'no aplica'
},
    editorial: {
        type: Sequelize.STRING(100),
    allowNull: false,
    defaultValue: 'no aplica'
},
    titulo:{
        type: Sequelize.STRING(200),
        allowNull:false
    },
    año:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    volumen:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 1
    },
    ejemplar:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    destino: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'no aplica'
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

    Tipo_Libro.hasMany(Libros,{
        sourceKey: 'tipo_tl', 
        foreignKey: 'tipo_l'});
    Libros.belongsTo(Tipo_Libro,{targetKey: 'tipo_tl', foreignKey: 'tipo_l'});
    Estado_Libro.hasMany(Libros,{
        sourceKey: 'estado_el', 
        foreignKey: 'estado_l'});
    Libros.belongsTo(Estado_Libro,{targetKey: 'estado_el', foreignKey: 'estado_l'});


module.exports = Libros;
