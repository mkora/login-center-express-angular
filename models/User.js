const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  },
  created: {
    type: Date,
    required: true,
    default: new Date()
  }
});

UserSchema.virtual('name')
  .get(function () {
      return this.firstName + ', ' + this.lastName;
  });

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) throw err;
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
          .then(callback);
    });
  });
}

module.exports.findUserByUsername = function(username, callback) {
  User.findOne({ username: username }).exec(callback);
}

module.exports.findUserById = function(id, callback) {
  User.findById(id).exec(callback);
}

module.exports.isValidPassword = function(password, hash, callback) {
  bcrypt.compare(password, hash)
    .then(callback);
}
