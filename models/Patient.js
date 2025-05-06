 const mongoose = require('mongoose');

 const patientSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true
    },
    dni: {
      type: String,
      required: true,
      unique: true
    },
    medicalInsurance: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model('Patient', patientSchema);