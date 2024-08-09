const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  image: {
    type: String,
    default: null
  },
  contact: {
    type: Number
  },
  bio: {
    type: String
  },
  gender: {
    type: Number,
    enum: [1, 2, 3]
  },
  status: {
    type: Boolean,
    default: true
  },
  address: {
    type: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' }
    }
  }
},
{timestamps : true});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
