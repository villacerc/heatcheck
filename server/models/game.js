'use strict'
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    userId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING
  })
  Game.loadScopes = function(models) {
    Game.addScope('venue', {
      include: [
        {
          model: models.Venue,
          as: 'venue'
        }
      ]
    })
    Game.addScope('players', {
      include: [
        {
          model: models.User,
          as: 'pendingPlayers',
          attributes: {
            exclude: ['password', 'isVerified']
          }
        }
      ]
    })
    // Game.addScope('creator', {
    //   include: [
    //     {
    //       model: models.User,
    //       as: 'creator',
    //       attributes: {
    //         exclude: ['password']
    //       }
    //     }
    //   ]
    // })
  }
  Game.associate = function(models) {
    Game.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'userId'
    })
    Game.belongsTo(models.Venue, {
      as: 'venue',
      foreignKey: 'venueId'
    })
    Game.belongsToMany(models.User, {
      through: 'Request',
      as: 'pendingPlayers',
      foreignKey: 'gameId'
    })
  }

  Game.afterCreate(async (game, options) => {
    //the creator will be a player in this game by default
    await db.Request.create({ userId: game.userId, gameId: game.id })
  })
  Game.afterDestroy(async (game, options) => {
    // destroy all requests related to this game
    await db.Request.destroy({ where: { gameId: game.id } })
  })

  Game.prototype.toJSON = function(scope, venueRaw = null) {
    const game = JSON.parse(JSON.stringify(this.get()))

    switch (scope) {
      case 'players':
        return withPlayers(game, venueRaw)
      default:
        return game
    }
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
