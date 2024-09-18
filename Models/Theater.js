// models/Theater.js
const mongoose = require('mongoose');

// Define schema for theater
const theaterSchema = new mongoose.Schema({
 theaterId:{
    type: Number,
    unique: true
 },
  name: {
    type: String,
    required: true,
    trim: true,
    unique:true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Array of references to the Movie model
    required: true,
  }],
});

// Create Theater model
const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater;
