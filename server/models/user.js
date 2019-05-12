'use strict'

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      displayName: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: 'email' },
      password: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN
    },
    {}
  )
  User.associate = function(models) {
    User.hasOne(models.VerificationToken, {
      as: 'verificationToken',
      foreignKey: 'userId',
      foreignKeyConstraint: true
    })
  }
  User.beforeCreate((user, options) => {
    const userPw = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null)
    user.password = userPw
  })
  return User
}
