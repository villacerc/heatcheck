const Sequelize = require('sequelize')
const db = require('../db/sequelize')

const User = db.define('user', {
  displayName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
})

module.exports = User
