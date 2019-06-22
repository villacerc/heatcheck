const create = async (req, res) => {
  try {
    const { venueId, name, description } = req.body
    const body = { userId: req.user.id, venueId, name, description }

    await db.CheckIn.update({ venueId }, { where: { userId: req.user.id } })
    const newGame = await db.Game.create(body)
    const game = await db.Game.scope('players').findByPk(newGame.id)

    res.status(200).json({ game: sanitize(game) })
  } catch (err) {
    res.status(400).send({ err })
  }
}

const getGames = async (req, res) => {
  try {
    const games = await db.Game.scope('players').findAll()

    res.status(200).json({ games: sanitizeAll(games) })
  } catch (err) {
    res.status(400).send({ err })
  }
}

const myGame = async (req, res) => {
  try {
    const game = await db.Game.scope('players').findOne({
      where: { userId: req.user.id }
    })

    if (!game) throw 'No game found'

    //get checkins from venue
    const venue = await db.Venue.scope('checkIns').findByPk(game.venueId)

    res.status(200).json({ game: sanitize(game, venue) })
  } catch (err) {
    res.status(400).send({ err })
  }
}

const deleteGame = async (req, res) => {
  try {
    const game = await db.Game.findOne({ where: { userId: req.user.id } })
    await game.destroy()

    res.status(200).send()
  } catch (err) {
    res.status(400).send({ err })
  }
}

const invitePlayer = async (req, res) => {
  try {
    const { playerId, gameId } = req.body

    const createRequest = async () => {
      await db.Request.create({
        userId: playerId,
        gameId: gameId,
        type: 'invite'
      })
    }

    const requests = await db.Request.findAll({
      where: { userId: playerId }
    })

    if (requests[0]) {
      //check if player is already in a game
      const inGame = requests.find(({ type }) => type === null)
      if (inGame) throw 'This player is already in a game'

      //check if player requested to join
      const joinTrue = requests.find(request => {
        return request.gameId == gameId && request.type === 'join'
      })

      if (joinTrue) {
        await db.Request.update(
          {
            type: null
          },
          { where: { userId: playerId, gameId: gameId } }
        )
      } else {
        await createRequest()
      }
    } else {
      await createRequest()
    }

    res.status(200).send()
  } catch (err) {
    res.status(400).send({ err })
  }
}

const sanitize = (gameRaw, venueRaw = null) => {
  const game = JSON.parse(JSON.stringify(gameRaw))

  //parse players from request
  game.players = game.pendingPlayers.filter(player => {
    return !player.Request.type
  })
  game.pendingPlayers = game.pendingPlayers.filter(player => {
    return player.Request.type
  })

  if (venueRaw) {
    const venue = JSON.parse(JSON.stringify(venueRaw))

    //remove creator from checked in users
    const creator = venue.checkIns.findIndex(
      ({ userId }) => userId === game.userId
    )
    venue.checkIns.splice(creator, 1)

    //normalize checkins
    venue.checkIns = venue.checkIns.map(({ user }) => {
      user.requestedGames = user.requestedGames.map(({ Request }) => Request)
      return user
    })

    game.venue = venue
  }

  return game
}

sanitizeAll = gamesArr => {
  games = JSON.parse(JSON.stringify(gamesArr))

  return games.map(game => {
    return sanitize(game)
  })
}

module.exports = { create, getGames, myGame, deleteGame, invitePlayer }
