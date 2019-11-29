const Sequalize = require('sequelize');
const Model = Sequalize.Model;
const sequelize = require('../../../utils/db/sequelizeConf');

class NomUnidadMedida extends Model{};
NomUnidadMedida.init({
    nombre: {
        type: Sequalize.STRING(50),
        allowNull: false,
        set(val){
            this.setDataValue('nombre',val.toUpperCase());
        }
    },
    abreviatura: {
        type: Sequalize.STRING(10),
        allowNull: false,
        set(val){
            this.setDataValue('abreviatura',val.toUpperCase());
        }
    }
},{
    sequelize,
    tableName: 'nom_unidadmedida',
    freezeTableName: true, schema: 'mod_nomencladores'
})

module.exports = NomUnidadMedida;