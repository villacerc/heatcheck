module.exports = async (req, res) => {
  try {
    //check in to new venue
    await db.CheckIn.update(
      { venueId: req.body.venueId },
      { where: { userId: req.user.id } }
    )
    return res.status(200).send()
  } catch (e) {
    return res.status(400).send(e)
  }
}
