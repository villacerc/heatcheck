const Sequelize = require('sequelize')
const db = require('../db/sequelize')

const Venue = db.define(
  'venue',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    google_place_id: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    lat: {
      type: Sequelize.NUMBER
    },
    lng: {
      type: Sequelize.NUMBER
    }
  },
  {
    timestamps: false
  }
)

module.exports = Venue
