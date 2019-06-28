'use strict'

module.exports = (sequelize, DataTypes) => {
  const CheckIn = sequelize.import('./checkin')
  const Game = sequelize.import('./game')

  if (CheckIn.associate) CheckIn.associate(sequelize.models)

  const Venue = sequelize.define(
    'Venue',
    {
      name: DataTypes.STRING,
      google_place_id: DataTypes.STRING,
      address: DataTypes.STRING,
      lat: DataTypes.DOUBLE,
      lng: DataTypes.DOUBLE
    },
    {
      scopes: {
        games: {
          include: [{ model: Game, as: 'games' }]
        },
        checkIns: {
          include: [
            {
              model: CheckIn,
              as: 'checkIns',
              include: [
                {
                  model: sequelize.models.User,
                  as: 'user',
                  attributes: {
                    exclude: ['password', 'isVerified']
                  },
                  include: [{ model: Game, as: 'requestedGames' }]
                }
              ]
            }
          ]
        }
      }
    }
  )
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
