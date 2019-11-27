const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');
const Model = Sequelize.Model;

class NomTipoDescuento extends Model{}
NomTipoDescuento.init({
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        set(val){
            this.setDataValue('nombre',val.toUpperCase());
        }
    },
    descuento: {
        type: Sequelize.DECIMAL,
        defaultValue: 0
    }
}, {sequelize, modelName: 'nom_tipodescuento', freezeTableName: true
});

module.exports = NomTipoDescuento;