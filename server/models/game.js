'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.import('./user')
  const Request = sequelize.import('./request')
  const Game = sequelize.define(
    'Game',
    {
      userId: DataTypes.INTEGER,
      venueId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {
      scopes: {
        // creator: {
        //   include: [
        //     {
        //       model: User,
        //       as: 'creator',
        //       attributes: {
        //         exclude: ['password']
        //       }
        //     }
        //   ]
        // },
        players: {
          include: [
            {
              model: User,
              as: 'pendingPlayers',
              attributes: {
                exclude: ['password', 'isVerified']
              }
            }
          ]
        }
      }
    }
  )
  Game.associate = function(models) {
    Game.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'userId'
    })
    Game.belongsToMany(models.User, {
      through: 'Request',
      as: 'pendingPlayers',
      foreignKey: 'gameId'
    })
  }

  Game.afterCreate(async (game, options) => {
    //the creator will be a player in this game by default
    await Request.create({ userId: game.userId, gameId: game.id })
  })
  Game.afterDestroy(async (game, options) => {
    // destroy all requests related to this game
    await Request.destroy({ where: { gameId: game.id } })
  })

  Game.prototype.toJSON = function(scope, venueRaw = null) {
    const game = JSON.parse(JSON.stringify(this.get()))

    if (scope === 'players') return withPlayers(game, venueRaw)

    return game
  }

  const withPlayers = (game, venueRaw) => {
    //parse players from request model
    game.players = game.pendingPlayers.filter(player => {
      return !player.Request.type
    })
    game.pendingPlayers = game.pendingPlayers.filter(player => {
      return player.Request.type
    })

    if (venueRaw) {
      const venue = JSON.parse(JSON.stringify(venueRaw))

      //remove creator from checked in users
      const creator = venue.checkIns.findIndex(
        ({ userId }) => userId === game.userId
      )
      venue.checkIns.splice(creator, 1)

      //normalize checkins
      venue.checkIns = venue.checkIns.map(({ user }) => {
        user.requestedGames = user.requestedGames.map(({ Request }) => Request)
        return user
      })

      game.venue = venue
    }

    return game
  }

  return Game
}
