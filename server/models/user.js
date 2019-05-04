const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')
const bcrypt = require('bcrypt')

//declare schema to tack on custom methods
const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 5
  }
})

//override toJSON method
UserSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.removeToken = function(token) {
  const user = this

  return user.update({
    $pull: { tokens: { token } }
  })
}

UserSchema.statics.findByCredentials = function(email, password) {
  const User = this

  return User.findOne({ email }).then(user => {
    if (!user) return Promise.reject()

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, match) => {
        if (match) {
          return resolve(user)
        } else {
          return reject('401')
        }
      })
    })
  })
}

UserSchema.pre('save', function(next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
