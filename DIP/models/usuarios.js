const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');
const Tipo_Usuario = require ('./tipoUsuario');
//const { validator } = require('sequelize/types/lib/utils/validator-extras');

const Usuarios = sequelize.define('usuarios', {
    correo_u: {
        type: Sequelize.STRING,
        primaryKey: true,
        /*validate:{
            isEmail: true,
            mensaje: 'debes introducir un correo electronico'
        }*/
    },
    tipo_u: {
        type:Sequelize.STRING,
        allowNull: false
    },
    cedula_u: {
        type: Sequelize.STRING,
        allowNull: false,
       /* validate: {
           len: { args:[8,30],
            mensaje: "la cedula debe contener minimo 8 caracteres"
        }/*,
        validarCedula: function(cedula_u){
            
            if (cedula_u.indexOf("V") != 0 || cedula_u.indexOf("E") != 0)
            {

              console.log("verifique su documento de identidad")
                throw new Error("la cedula debe iniciar con V o E dependiendo de su nacionalidad");
            }
            }

        }
        */
    },
    nombres_u: {
        type: Sequelize.STRING,
        allowNull:false
    },
    apellidos_u:{
        type: Sequelize.STRING,
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
