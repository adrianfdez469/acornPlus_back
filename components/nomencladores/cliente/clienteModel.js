const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');

const Model = Sequelize.Model;

class NomCliente extends Model{};
NomCliente.init({
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('nombre', value.toUpperCase());
        }
    },
    descuento: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },    
    descripcion: Sequelize.STRING,
    telefono: Sequelize.STRING,
    direccion:Sequelize.STRING,
    correo: Sequelize.STRING,
    nombreempresa: Sequelize.STRING
},{
    sequelize,
    modelName: 'nom_cliente',
    freezeTableName: true,
    schema: 'mod_nomencladores'
});

module.exports = NomCliente;