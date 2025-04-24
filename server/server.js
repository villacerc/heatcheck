require('dotenv').config()
const fs = require('fs')
const https = require('https')
const express = require('express')
const path = require('path')

require('./db/sequelize')
require('./services/passport')
require('./jobs')
const controllers = require('./controllers')
const authorize = require('./middlewares/authorize')

const app = express()

require('./middlewares')(app)

if (process.env.NODE_ENV === 'prod') {
  app.use(express.static(path.join(__dirname, '/../build')))

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '/../build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('👋 Welcome to the Pick and Roll server!');
  });
}

 app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
    console.log(`Building for ${process.env.NODE_ENV}!`)
  })

//user controllers
app.post('/api/get-user', controllers.user.getUser)
app.post('/api/logout', authorize, controllers.user.logout)
app.post('/api/signup', controllers.user.signup)
app.post('/api/login', controllers.user.authenticate)

//venue controllers
app.post('/api/get-venues', controllers.venue.getVenues)
app.post('/api/get-venue', controllers.venue.getVenue)
app.post('/api/search', controllers.venue.searchVenues)

//checkin controllers
app.post('/api/checkin', authorize, controllers.checkin)

//verificationToken controllers
app.post('/api/verify', controllers.verificationToken.verify)

//game controllers
app.post('/api/create-game', authorize, controllers.game.create)
app.post('/api/get-games', controllers.game.getGames)
app.post('/api/get-game', controllers.game.getGame)
app.get('/api/joined-game', authorize, controllers.game.joinedGame)
app.delete('/api/delete-game', authorize, controllers.game.deleteGame)
app.post('/api/invite-player', authorize, controllers.game.invitePlayer)
app.post('/api/join-game', authorize, controllers.game.joinGame)
app.post('/api/leave-game', authorize, controllers.game.leaveGame)
app.post('/api/accept-invite', authorize, controllers.game.acceptInvite)
app.post('/api/cancel-invite', authorize, controllers.game.cancelInvite)
app.post(
  '/api/accept-join-request',
  authorize,
  controllers.game.acceptJoinRequest
)

// const closeConnections = () => {
//   db.sequelize.close()
//   server.close()
// }

//close db and app when terminating server
// process.on('SIGINT', () => {
//   closeConnections()
// })
// process.on('SIGTERM', () => {
//   closeConnections()
// })

module.exports = app
