'use strict';
var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');
const Tipo_Nucleo= require ('./tipoNucleo');
const Estado_Libro = require('./estadoLibro');
const Tipo_Suscripcion = require('./tipoSuscripcion');

const Libros = sequelize.define('libros', {
    
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'no aplica'
    },
    cota: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    contributor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'no aplica'
    },
    subject: {
        type: Sequelize.STRING,
    allowNull: false,
        defaultValue: 'no aplica'
},
    creator: {
        type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'no aplica'
},
    description: {
        type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'no aplica'
},
    publisher:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'no aplica'
    },
    date:{
        type: Sequelize.DATEONLY,
        allowNull:false
    },
    format:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'solo en fisico'
    },
    identifier:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'no aplica'
    },
    relation:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'no aplica'
    },
    coverage:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'no aplica'
    },
    rights:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'no aplica'
    },
    type:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'no aplica'
    },
    source:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'no aplica'
    },
    language:{
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue: 'no aplica'
    },
    url: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'no aplica'
    },
    core:{
        type: Sequelize.STRING,
        allowNull:false
    },
    statusBook: {
        type: Sequelize.STRING,
        allowNull: false

    },
    tipo_s: {
       type: Sequelize.STRING,
       allowNull: false,
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

    Tipo_Suscripcion.hasMany(Libros,{
        sourceKey: 'tipo_ts', 
        foreignKey: 'tipo_s'});
    Libros.belongsTo(Tipo_Suscripcion,{targetKey: 'tipo_ts', foreignKey: 'tipo_s'});
    Estado_Libro.hasMany(Libros,{
        sourceKey: 'estado_el', 
        foreignKey: 'statusBook'});
    Libros.belongsTo(Estado_Libro,{targetKey: 'estado_el', foreignKey: 'statusBook'});
    Tipo_Nucleo.hasMany(Libros,{
        sourceKey: 'nucleo', 
        foreignKey: 'core'});
    Libros.belongsTo(Tipo_Nucleo,{targetKey: 'nucleo', foreignKey: 'core'});
    

module.exports = Libros;
