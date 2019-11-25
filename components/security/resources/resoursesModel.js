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
    modelName: 'resource',
    name: {
        plural: 'Resources',
        singular: 'Resource'
    }
});



module.exports = Resource;