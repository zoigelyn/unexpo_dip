
const {Sequelize, DataTypes} = require ('sequelize');
var sequelize = require ('../database/database');


const Noticias = sequelize.define('noticias', {
    id_n: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
        },
   
    url_imagen: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    text_noticia: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    titulo_noticia: {
        type: Sequelize.STRING(200),
        allowNull: false,
        Unique: true
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
    
    module.exports = Noticias;
