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
        players: {
          include: [
            {
              model: User,
              as: 'pendingPlayers',
              attributes: {
                exclude: ['password']
              }
            }
          ]
        }
      }
    }
  )
  Game.associate = function(models) {
    Game.belongsTo(models.User, {
      as: 'createdGame',
      foreignKey: 'userId'
    })
    Game.belongsToMany(models.User, {
      through: 'Request',
      as: 'pendingPlayers',
      foreignKey: 'gameId'
    })
  }

  Game.afterCreate(async (game, options) => {
    await Request.create({ userId: game.userId, gameId: game.id })
  })
  // destroy all requests related to this game
  Game.afterDestroy(async (game, options) => {
    await Request.destroy({ where: { gameId: game.id } })
  })

  return Game
}
