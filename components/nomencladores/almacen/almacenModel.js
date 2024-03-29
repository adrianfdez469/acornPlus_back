const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');
const Model = Sequelize.Model;

class NomAlmacen extends Model{}
NomAlmacen.init({
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        set(val){
            this.setDataValue('nombre',val.toUpperCase());
        }
    },
    descripcion: Sequelize.STRING    
}, {sequelize, modelName: 'nom_almacen', freezeTableName: true, schema: 'mod_nomencladores'
});

module.exports = NomAlmacen;