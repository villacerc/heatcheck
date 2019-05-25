const create = async (req, res) => {
  try {
    const { venueId, name, description } = req.body
    const body = { userId: req.user.id, venueId, name, description }

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

    res.status(200).json({ game: sanitize(game) })
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

const sanitize = game => {
  game.players = game.pendingPlayers.filter(player => {
    return !player.Request.type
  })
  game.pendingPlayers = game.pendingPlayers.filter(player => {
    return player.Request.type
  })

  return game
}

sanitizeAll = gamesArr => {
  games = JSON.parse(JSON.stringify(gamesArr))

  return games.map(game => {
    return sanitize(game)
  })
}

module.exports = { create, getGames, myGame, deleteGame }
