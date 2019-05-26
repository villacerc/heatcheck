module.exports = async (req, res) => {
  try {
    //check in to new venue
    await db.CheckIn.update(
      { venueId: req.body.venueId },
      { where: { userId: req.user.id } }
    )

    const user = await db.User.scope('includeAll').findByPk(req.user.id)

    return res.status(200).send({ user })
  } catch (e) {
    return res.status(400).send(e)
  }
}
