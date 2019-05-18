'use strict'

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const CheckIn = sequelize.import('./checkIn')

  const User = sequelize.define(
    'User',
    {
      displayName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: 'email',
        validate: { isEmail: true }
      },
      password: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN
    },
    {
      defaultScope: {
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

  const hashPw = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
  }

  User.beforeUpdate(user => {
    if (user.changed('password')) {
      user.password = hashPw(user.password)
    }
  })
  User.beforeCreate((user, options) => {
    user.password = hashPw(user.password)
  })

  //exclude password from JSON
  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get())

    delete values.password
    return values
  }
  return User
}
