const cron = require('node-cron')

//delete tokens that are a day old every midnight
cron.schedule('0 0 0 * * *', async () => {
  try {
    const tokens = await db.VerificationToken.findAll()
    tokens.forEach(token => {
      const diffInDays = moment().diff(moment(token.createdAt), 'days')

      if (diffInDays >= 1) {
        token.destroy()
      }
    })
  } catch (e) {
    console.log('cron delete verification tokens error', e)
  }
})
