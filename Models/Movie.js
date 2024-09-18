const mongoose = require('mongoose');

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  releaseDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= Date.now();
      },
      message: 'Release date cannot be in the past.',
    },
  },
  genre: {
    type: [String], // Array of genres
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '/static/images/default-movie.jpg', // Default image path
  },
  // Add the screen property
  screen: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen', // Reference to the Screen model
  }],
});

// Create a Movie model
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
