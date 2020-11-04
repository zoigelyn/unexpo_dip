const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');

const Docentes = sequelize.define('docentes', {
    cedula_d: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    nombres_d: {
        type: Sequelize.STRING,
        allowNull:false
    },
    apellidos_d:{
        type: Sequelize.STRING,
        allowNull:false
    },
    materia: {
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


module.exports = Docentes;