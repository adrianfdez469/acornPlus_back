const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');

const Model = Sequelize.Model;
class Rol extends Model{};
Rol.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: Sequelize.STRING
}, {
    sequelize, modelName: 'rol'
});

//Rol.sync({force: true});

module.exports = Rol;