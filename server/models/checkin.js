'use strict'
module.exports = (sequelize, DataTypes) => {
  const CheckIn = sequelize.define(
    'CheckIn',
    {
      userId: DataTypes.INTEGER,
      venueId: DataTypes.INTEGER
    },
    {}
  )
  CheckIn.associate = function(models) {
    CheckIn.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      foreignKeyConstraint: true
    })
  }
  return CheckIn
}
