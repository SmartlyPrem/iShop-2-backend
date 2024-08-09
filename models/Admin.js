const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name: {
    type: String,
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required : true
  },
  image: {
    type: String,
    default: null
  },
  contact: {
    type: Number
  },
  gender: {
    type: Number,
    enum: [1, 2, 3]
  }
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
