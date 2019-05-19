'use strict'
module.exports = (sequelize, DataTypes) => {
  const CheckIn = sequelize.import('./checkIn')

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
      defaultScope: {
        include: [{ model: CheckIn, as: 'checkIns' }]
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

  Venue.prototype.toJSON = function() {
    const values = Object.assign({}, this.get())
    //only include checkins that have a user id
    values.checkIns = values.checkIns.filter(e => e.userId)

    return values
  }
  return Venue
}
