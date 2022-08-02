const Sequelize = require('sequelize');
const { settings } = require('../helpers/config');

const {
  database, username, password, host, dialect,
} = settings.database;
// XXX add port

if (!database || !username || !password || !host || !dialect) {
  console.error('Could not connect to database. A database, username, password, host, and dialect are required');
  process.exit();
}

console.log(`Connecting to ${dialect} (${database}) on ${host}`);

const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host,
    dialect,
    logging: false,
  }
);

module.exports = sequelize;
