const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
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
  },
  tokens: [
    {
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
})

//override toJSON method
UserSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email'])
}

//need to use a function keyword rather than arrow because arrow functions do not bind THIS
//.methods is for instance methods
UserSchema.methods.generateAuthToken = function() {
  //this keyword stores the individual document
  const user = this
  const access = 'auth'
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString()

  user.tokens = user.tokens.concat({ access, token })

  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function(token) {
  const user = this

  return user.update({
    $pull: { tokens: { token } }
  })
}

//.statics is for model metods
UserSchema.statics.findByToken = function(token) {
  const User = this
  let decoded

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    return Promise.reject()
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
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
