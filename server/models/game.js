'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.import('./user')
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

  return Game
}
