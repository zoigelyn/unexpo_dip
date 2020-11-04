const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');


const Preguntas = sequelize.define('preguntas', {
    id_p: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
        },
    pregunta: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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


module.exports = Preguntas;
