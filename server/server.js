require('dotenv').config()
const express = require('express')

require('./db/sequelize')
require('./services/passport')
require('./jobs')
const controllers = require('./controllers')

const app = express()
const port = process.env.PORT

require('./middlewares')(app)

//user controllers
app.get('/api/user', controllers.user.getUser)
app.get('/api/logout', controllers.user.logout)
app.post('/api/signup', controllers.user.signup)
app.post('/api/login', controllers.user.authenticate)

//venue controllers
app.get('/api/venues', controllers.venue.getVenues)

//checkin controllers
app.post('/api/checkin', controllers.checkin)

//verificationToken controllers
app.post('/api/verify', controllers.verificationToken.verify)

//game controllers
app.post('/api/create-game', controllers.game.create)
app.get('/api/games', controllers.game.getGames)
app.get('/api/my-game', controllers.game.myGame)

const server = app.listen(port, () => console.log(`listening on port ${port}!`))

const closeConnections = () => {
  db.sequelize.close()
  server.close()
}

//close db and app when terminating server
process.on('SIGINT', () => {
  closeConnections()
})
process.on('SIGTERM', () => {
  closeConnections()
})

module.exports = app
