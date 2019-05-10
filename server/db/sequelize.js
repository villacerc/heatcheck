const Sequelize = require('sequelize')

const sequelize = new Sequelize('pick_and_roll', 'carlo', '', {
  host: 'localhost',
  dialect: 'postgres'
})

module.exports = sequelize
global.sequelize = sequelize
