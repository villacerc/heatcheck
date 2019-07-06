'use strict'

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const CheckIn = sequelize.import('./checkin')
  const Game = sequelize.models.Game

  const User = sequelize.define(
    'User',
    {
      displayName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true }
      },
      color: {
        type: DataTypes.STRING
      },
      password: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN
    },
    {
      scopes: {
        checkIn: {
          include: [{ model: CheckIn, as: 'checkIn' }]
        },
        createdGame: {
          include: [{ model: Game, as: 'createdGame' }]
        },
        includeAll: {
          include: [
            {
              model: Game,
              as: 'createdGame',
              attributes: {
                exclude: ['userId']
              }
            },
            {
              model: CheckIn,
              as: 'checkIn',
              attributes: {
                exclude: ['userId']
              }
            },
            {
              model: Game,
              as: 'requestedGames',
              attributes: {
                exclude: ['userId']
              },
              include: [
                {
                  model: sequelize.models.User,
                  as: 'creator',
                  attributes: {
                    exclude: ['password', 'isVerified', 'email']
                  }
                }
              ]
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
  User.afterCreate(async (user, options) => {
    await CheckIn.create({ userId: user.id })
  })
  User.beforeDestroy(async (user, options) => {
    await CheckIn.destroy({ where: { userId: user.id } })
  })

  //sanitize user JSON
  User.prototype.toJSON = function(scope = null) {
    //skip parse if no id
    if (!this.get().id) return

    const user = JSON.parse(JSON.stringify(this.get()))

    if (scope === 'includeAll') return includeAll(user)

    return user
  }

  const includeAll = user => {
    //filter games by type
    user.gameInvites = user.requestedGames.filter(
      ({ Request }) => Request.type === 'invite'
    )
    user.joinRequests = user.requestedGames.filter(
      ({ Request }) => Request.type === 'join'
    )

    //check if a player has joined a game
    if (!user.createdGame) {
      const joinedGame = user.requestedGames.find(({ Request }) => {
        return !Request.type
      })

      if (joinedGame) {
        user.joinedGame = JSON.parse(JSON.stringify(joinedGame))

        delete user.joinedGame.Request
      }
    }

    delete user.requestedGames
    delete user.password

    return user
  }

  return User
}
