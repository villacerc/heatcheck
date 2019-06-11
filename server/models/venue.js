'use strict'

module.exports = (sequelize, DataTypes) => {
  const CheckIn = sequelize.import('./checkin')

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
        checkIns: {
          include: [
            {
              model: CheckIn,
              as: 'checkIns',
              include: [{ model: sequelize.models.User, as: 'user' }]
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
  }

  return Venue
}
