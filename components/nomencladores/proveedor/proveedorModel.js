const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');
const Model = Sequelize.Model;

class NomProveedor extends Model{}

NomProveedor.init({
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        set(value){
            this.setDataValue('nombre', value.toUpperCase());
        }
    },
    descripcion: Sequelize.STRING,
    telefono: Sequelize.STRING,
    correo: Sequelize.STRING,
    sitioweb: Sequelize.STRING

}, {sequelize, modelName: 'nom_proveedor', freezeTableName: true})

module.exports = NomProveedor;