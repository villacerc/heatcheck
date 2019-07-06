'use strict'

module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    name: DataTypes.STRING,
    google_place_id: DataTypes.STRING,
    address: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE
  })
  Venue.loadScopes = function(models) {
    Venue.addScope('games', {
      include: [{ model: models.Game, as: 'games' }]
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
                exclude: ['password', 'isVerified']
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

  return Venue
}
