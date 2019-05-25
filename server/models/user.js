'use strict'

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
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
      scopes: {
        checkIn: {
          include: [{ model: sequelize.models.CheckIn, as: 'checkIn' }]
        },
        createdGame: {
          include: [{ model: sequelize.models.Game, as: 'createdGame' }]
        },
        includeAll: {
          include: [
            {
              model: sequelize.models.Game,
              as: 'createdGame',
              attributes: {
                exclude: ['userId']
              }
            },
            {
              model: sequelize.models.CheckIn,
              as: 'checkIn',
              attributes: {
                exclude: ['userId']
              }
            },
            {
              model: sequelize.models.Game,
              as: 'requestedGames',
              attributes: {
                exclude: ['userId']
              }
            }
          ]
        }
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
    User.hasOne(models.Game, {
      as: 'createdGame',
      foreignKey: 'userId'
    })
    User.belongsToMany(models.Game, {
      through: 'Request',
      as: 'requestedGames',
      foreignKey: 'userId'
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

  //sanitize user JSON
  User.prototype.toJSON = function() {
    //skip parse if no id
    if (!this.get().id) return

    const values = JSON.parse(JSON.stringify(this.get()))

    delete values.password
    if (!values.checkIn.createdAt) {
      values.checkIn = null
    }

    //filter the games that have a request type
    values.requestedGames = values.requestedGames.filter(({ Request }) => {
      if (Request.type) {
        const request = JSON.parse(JSON.stringify(Request))

        // delete request.userId
        return request
      }
    })

    //check if a player has joined a game
    if (!values.createdGame) {
      const joinedGame = values.requestedGames.find(({ Request }) => {
        return !Request.type
      })

      if (joinedGame) {
        values.joinedGame = JSON.parse(JSON.stringify(joinedGame))

        delete values.joinedGame.Request
      }
    }

    return values
  }
  return User
}
