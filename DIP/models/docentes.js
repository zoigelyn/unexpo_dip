const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');

const Docentes = sequelize.define('docentes', {
    iddocente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false
    },
    ceddoc: {
        type: Sequelize.INTEGER(11)
    },
    apedoc: {
        type: Sequelize.TEXT
    },
    nomdoc: {
        type: Sequelize.TEXT
    },
    fecnacdoc: {
        type: Sequelize.STRING(10)
    },
    teldoc: {
        type: Sequelize.STRING(12)
    },
    movdoc: {
        type: Sequelize.STRING(12)
    },
    emadoc: {
        type: Sequelize.STRING(40)
    },
    titdoc: {
        type: Sequelize.TEXT
    }
});


module.exports = Docentes;