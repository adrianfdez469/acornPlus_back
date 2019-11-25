const Sequelize = require('sequelize').Sequelize;
const dbconf = require('./dbConnDataConf.json');

// Option 1: Passing parameters separately
const sequelize = new Sequelize(dbconf.DB_NAME, dbconf.DB_USER, dbconf.DB_PASS, {
  host: dbconf.DB_HOST,
  dialect: 'postgres'
});

module.exports = sequelize;