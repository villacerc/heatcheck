'use strict'
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    'Game',
    {
      userId: DataTypes.INTEGER,
      venueId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  )
  Game.associate = function(models) {
    Game.belongsToMany(models.User, {
      through: 'Request',
      as: 'players',
      foreignKey: 'gameId'
    })
  }
  return Game
}
