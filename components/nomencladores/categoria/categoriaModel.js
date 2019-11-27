const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');

const Model = Sequelize.Model;

class NomCategoria extends Model{};
NomCategoria.init({
    nombre: {
        type: Sequelize.STRING,        
        allowNull: false,
        unique: true,
        set(val){
            this.setDataValue('nombre',val.toUpperCase());
        }
    },
    descripcion: Sequelize.STRING,
    color: {
        type: Sequelize.STRING(7),
        allowNull: false
    },
    orden: Sequelize.REAL
}, {
    sequelize,
    modelName: 'nom_categoria',
    freezeTableName: true
});

module.exports = NomCategoria;