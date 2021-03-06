const verify = async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { email: req.body.email }
    })

    if (user) {
      if (user.isVerified) {
        return res.status(202).json(`Email Already Verified`)
      }
      const foundToken = await db.VerificationToken.findOne({
        where: { token: req.body.token }
      })

      if (foundToken) {
        //update user
        const updatedUser = await user.update({ isVerified: true })
        if (updatedUser) {
          //login the user
          req.logIn(user, async err => {
            if (err) {
              throw { status: 403, msg: 'Login failed' }
            }
          })
          return res
            .status(200)
            .json(`User with ${user.email} has been verified`)
        } else {
          throw { status: 403, msg: 'Verification failed' }
        }
      } else {
        throw { status: 404, msg: 'Token invalid or expired' }
      }
    } else {
      throw { status: 404, msg: 'Email not found' }
    }
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json(e.msg)
    }
    return res.status(400).json(e)
  }
}

module.exports = { verify }
