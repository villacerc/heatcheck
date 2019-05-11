'use strict'

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      displayName: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: 'email' },
      password: DataTypes.STRING
    },
    {}
  )
  User.associate = function(models) {
    // associations can be defined here
  }
  User.beforeCreate((user, options) => {
    const userPw = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null)
    user.password = userPw
  })
  return User
}
