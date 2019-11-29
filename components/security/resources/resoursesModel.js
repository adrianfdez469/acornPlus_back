const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');

const Model = Sequelize.Model;
class Resource extends Model{};
Resource.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nameid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    parentid: {
        type: Sequelize.INTEGER
    }
}, {
    sequelize,
    modelName: 'seg_resource',
    freezeTableName: true,
    /*name: {
        plural: 'Resources',
        singular: 'Resource'
    }*/
    schema: 'mod_seguridad'
});



module.exports = Resource;