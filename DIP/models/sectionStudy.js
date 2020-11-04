const Sequelize = require ('sequelize');
const sequelize = require ('../database/database');

const SectionStudy = sequelize.define('sectionStudy', {
    idSS: {
        type: Sequelize.serial,
        primaryKey: true
     },  
    areStudy: {
        type: Sequelize.varchar(35),
        Unique: true, 
        allowNull: false   
    
    }
}, {
    timestamps: false
});

module.exports = SectionStudy;