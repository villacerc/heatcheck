require('dotenv').config()
const express = require('express')

require('./db/sequelize')
require('./services/passport')
require('./jobs')
const controllers = require('./controllers')
const authorize = require('./middlewares/authorize')

const app = express()
const port = process.env.PORT

require('./middlewares')(app)

//user controllers
app.get('/api/user', controllers.user.getUser)
app.post('/api/logout', authorize, controllers.user.logout)
app.post('/api/signup', controllers.user.signup)
app.post('/api/login', controllers.user.authenticate)

//venue controllers
app.get('/api/venues', controllers.venue.getVenues)

//checkin controllers
app.post('/api/checkin', authorize, controllers.checkin)

//verificationToken controllers
app.post('/api/verify', authorize, controllers.verificationToken.verify)

//game controllers
app.post('/api/create-game', authorize, controllers.game.create)
app.get('/api/games', controllers.game.getGames)
app.get('/api/my-game', authorize, controllers.game.myGame)
app.delete('/api/my-game', authorize, controllers.game.deleteGame)

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
