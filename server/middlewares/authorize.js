module.exports = async (req, res, next) => {
  if (!req.user) {
    res.status(401).send({ err: 'Unauthorized' })
  } else {
    next()
  }
}
