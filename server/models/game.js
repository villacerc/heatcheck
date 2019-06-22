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

  return Game
}
