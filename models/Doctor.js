const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);