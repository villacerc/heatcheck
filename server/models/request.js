'use strict'
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'Request',
    {
      userId: DataTypes.INTEGER,
      gameId: DataTypes.INTEGER,
      type: DataTypes.STRING
    },
    {}
  )
  Request.removeAttribute('id')
  Request.associate = function(models) {
    // associations can be defined here
  }
  return Request
}
