module.exports = async (req, res) => {
  try {
    if (req.user) {
      if (req.user.checkIn) {
        //check user out from current venue
        await db.CheckIn.destroy({ where: { userId: req.user.id } })
      }
      //check in to new venue
      await db.CheckIn.create({
        userId: req.user.id,
        venueId: req.body.venueId
      })

      const user = await db.User.scope('checkIn').findByPk(req.user.id)

      return res.status(200).send({ user })
    } else {
      return res.status(400).send()
    }
  } catch (e) {
    return res.status(400).send(e)
  }
}
