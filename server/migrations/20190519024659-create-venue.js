'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Venues', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        google_place_id: {
          type: Sequelize.STRING
        },
        address: {
          type: Sequelize.STRING
        },
        lat: {
          type: Sequelize.DOUBLE
        },
        lng: {
          type: Sequelize.DOUBLE
        },
        locality: {
          type: Sequelize.STRING
        },
        area: {
          type: Sequelize.STRING
        },
        country: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() =>
        queryInterface.addIndex('Venues', [
          'google_place_id',
          'locality',
          'area',
          'country'
        ])
      )
      .then(() => {
        // perform further operations if needed
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Venues')
  }
}
