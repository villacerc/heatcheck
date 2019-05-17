'use strict'

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const CheckIn = sequelize.import('./checkIn')

  const User = sequelize.define(
    'User',
    {
      displayName: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: 'email' },
      password: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN
    },
    {
      defaultScope: {
        // attributes: { exclude: ['password'] },
        include: [{ model: CheckIn, as: 'checkIn' }]
      }
    }
  )
  User.associate = function(models) {
    User.hasOne(models.VerificationToken, {
      as: 'verificationToken',
      foreignKey: 'userId',
      foreignKeyConstraint: true
    })
    User.hasOne(models.CheckIn, {
      as: 'checkIn',
      foreignKey: 'userId',
      foreignKeyConstraint: true
    })
  }
  User.beforeCreate((user, options) => {
    const userPw = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null)
    user.password = userPw
  })

  //exclude password from JSON
  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get())

    delete values.password
    return values
  }
  return User
}
