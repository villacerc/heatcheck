const Sequelize = require('sequelize')

module.exports = new Sequelize('pickAndRoll', 'carlo', '', {
  host: 'localhost',
  dialect: 'postgres'
})
