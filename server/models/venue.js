'use strict'

module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    name: DataTypes.STRING,
    google_place_id: DataTypes.STRING,
    address: DataTypes.STRING,
    locality: DataTypes.STRING,
    area: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE
  })
  Venue.loadScopes = function(models) {
    Venue.addScope('games', {
      include: [
        {
          model: models.Game,
          as: 'games',
          include: [
            {
              model: models.User,
              as: 'pendingPlayers',
              attributes: {
                exclude: ['password', 'isVerified', 'email']
              }
            },
            {
              model: models.User,
              as: 'creator',
              attributes: {
                exclude: ['password', 'isVerified', 'email']
              }
            }
          ]
        }
      ]
    })
    Venue.addScope('checkIns', {
      include: [
        {
          model: models.CheckIn,
          as: 'checkIns',
          include: [
            {
              model: models.User,
              as: 'user',
              attributes: {
                exclude: ['password', 'isVerified', 'email']
              },
              include: [{ model: models.Game, as: 'requestedGames' }]
            }
          ]
        }
      ]
    })
  }
  Venue.associate = function(models) {
    Venue.hasMany(models.CheckIn, {
      as: 'checkIns',
      foreignKey: 'venueId',
      foreignKeyConstraint: true
    })
    Venue.hasMany(models.Game, {
      as: 'games',
      foreignKey: 'venueId'
    })
  }

  Venue.prototype.toJSON = function(scope = null) {
    const venue = JSON.parse(JSON.stringify(this.get()))

    switch (scope) {
      case 'getVenue':
        return getVenue(venue)
      default:
        return venue
    }
  }

  const getVenue = venue => {
    venue.checkIns = venue.checkIns.length
    venue.games.forEach(game => {
      game.players = game.pendingPlayers.filter(
        ({ Request }) => !Request.type
      ).length
      delete game.pendingPlayers
    })
    return venue
  }

  return Venue
}
