const create = async (req, res) => {
  try {
    const { user, venueId, name, description } = req.body
    const body = { userId: user.id, venueId, name, description }

    const game = await db.Game.create(body)

    res.status(200).json({ game })
  } catch (e) {
    res.status(400).send(e)
  }
}

const getGames = async (req, res) => {
  try {
    const games = await db.Game.findAll()

    res.status(200).json({ games })
  } catch (e) {
    res.status(400).send(e)
  }
}

module.exports = { create, getGames }
