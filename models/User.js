//esquema del usuario
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  cuil: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ['admin', 'doctor', 'paciente'],
    default: 'paciente',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);