const Sequelize = require('sequelize');
const sequelize = require('../../../utils/db/sequelizeConf');
const Model = Sequelize.Model;


class User extends Model{};
User.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'user',
    paranoid: true
});

//User.sync({force: true});

/*User.create({
    name: 'admin',
    password: 'admin'
});*/


module.exports = User;