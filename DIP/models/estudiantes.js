var Sequelize = require ('sequelize');
var sequelize = require ('../database/database');

const Estudiantes = sequelize.define('estudiantes', {
    
    idalumno: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false
    },
    cedula: {
        type: Sequelize.STRING(11)
    },
    pasaporte: {
        type: Sequelize.STRING(10)
    },
    apellidos: {
        type: Sequelize.TEXT
    },
    nombres: {
        type: Sequelize.TEXT
    },
    nacionalidad: {
        type: Sequelize.STRING(11)
    },
    fechanac: {
        type: Sequelize.STRING(10)
    },
    estadonac: {
        type: Sequelize.TEXT
    },
    ciudadnac: {
        type: Sequelize.TEXT
    },
    sexo: {
        type: Sequelize.STRING(11)
    },
    direccionhab: {
        type: Sequelize.STRING(50)
    },
    telefonohab: {
        type: Sequelize.STRING(11)
    },
    direccionlab: {
        type: Sequelize.STRING(50)
    },
    telefonolab: {
        type: Sequelize.STRING(11)
    },
    email: {
        type: Sequelize.STRING(40)
    },
    movil: {
        type: Sequelize.STRING(11)
    },
    nivelest: {
        type: Sequelize.STRING(11)
    },
    titulo: {
        type: Sequelize.TEXT
    },
    institucion: {
        type: Sequelize.TEXT
    },
    fechaegrins: {
        type: Sequelize.STRING(10)
    }
}, {
    timestamps: true
});


module.exports = Estudiantes;
