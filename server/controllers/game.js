const Op = require('sequelize').Op

const create = async (req, res) => {
  try {
    const { venueId, name, description } = req.body
    const body = { userId: req.user.id, venueId, name, description }

    await db.CheckIn.update({ venueId }, { where: { userId: req.user.id } })
    await db.Game.create(body)

    res.status(200).send()
  } catch (err) {
    res.status(400).send({ err })
  }
}

const getGames = async (req, res) => {
  try {
    const games = await db.Game.scope('players').findAll()

    res.status(200).json({ games })
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

    res.status(200).json({ game: game.toJSON('players', venue) })
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

acceptRequest = async (req, res, type) => {
  const { userId, gameId } = req.body
  try {
    await db.Request.update(
      {
        type: null
      },
      {
        where: {
          userId,
          gameId,
          type
        }
      }
    )

    //delete all other requests by the user
    await db.Request.destroy({
      where: { userId, type: { [Op.not]: null } }
    })

    res.status(200).send()
  } catch (err) {
    res.status(400).send({ err })
  }
}

const acceptInvite = async (req, res) => {
  acceptRequest(req, res, 'invite')
}

const acceptJoinRequest = async (req, res) => {
  acceptRequest(req, res, 'join')
}

const joinGame = async (req, res) => {
  try {
    const { userId, gameId } = req.body

    //check if player has been invited to the game
    const inviteTrue = await db.Request.findOne({
      where: {
        userId,
        gameId,
        type: 'invite'
      }
    })

    if (inviteTrue) {
      await db.Request.update(
        {
          type: null
        },
        { where: { userId, gameId } }
      )
      //delete all other requests by the user
      await db.Request.destroy({
        where: { userId, type: { [Op.not]: null } }
      })
    } else {
      await db.Request.create({
        userId,
        gameId,
        type: 'join'
      })
    }

    res.status(200).send()
  } catch (err) {
    res.status(400).send({ err })
  }
}

const invitePlayer = async (req, res) => {
  try {
    const { userId, gameId } = req.body

    const createRequest = async () => {
      await db.Request.create({
        userId,
        gameId,
        type: 'invite'
      })
    }

    const requests = await db.Request.findAll({
      where: { userId }
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
          { where: { userId, gameId } }
        )
        //delete all other requests by the user
        await db.Request.destroy({
          where: { userId, type: { [Op.not]: null } }
        })
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

module.exports = {
  create,
  getGames,
  myGame,
  deleteGame,
  invitePlayer,
  joinGame,
  acceptJoinRequest,
  acceptInvite
}
