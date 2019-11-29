const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');
const Model = Sequelize.Model;

class NomMoneda extends Model{}
NomMoneda.init({
    abreviatura: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        set(val){
            this.setDataValue('abreviatura',val.toUpperCase());
        }
    },
    descripcion: Sequelize.STRING,
    principal: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    tasacambio: {
        type: Sequelize.DECIMAL(19,6),
        allowNull: false,
        get(){
            return Number.parseFloat(this.getDataValue('tasacambio')).toFixed(2);
        }
    }
}, {sequelize, modelName: 'nom_moneda', freezeTableName: true, schema: 'mod_nomencladores'
})

NomMoneda.quitarLaPrincipal = async () => {
    await NomMoneda.update({
        principal: false
    },{
        where: {
            principal: true
        }
    });
}

module.exports = NomMoneda;