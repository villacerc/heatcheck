'use strict';
module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    name: DataTypes.STRING,
    google_place_id: DataTypes.STRING,
    address: DataTypes.STRING,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING
  }, {});
  Venue.associate = function(models) {
    // associations can be defined here
  };
  return Venue;
};