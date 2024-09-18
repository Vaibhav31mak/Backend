const mongoose = require('mongoose');
const Movie = require('./Movie');

// Define the Screen schema
const screenSchema = new mongoose.Schema({
  screenId: {
    type: Number,
    unique: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Reference to the Movie model
    required: true,
  },
  bookings:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookings', // Reference to the Screen model
  }],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  screenNumber: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(value) {
        return value <= this.totalSeats;
      },
      message: 'Available seats cannot exceed total seats',
    },
  },
});

// Pre-save hook to check for the movie and update the screen field in the Movie model
screenSchema.pre('save', async function (next) {
  const screen = this;

  try {
    // Check if the movie exists
    const movie = await Movie.findById(screen.movie);
    
    if (!movie) {
      throw new Error('Movie does not exist');
    }

    // If it's a new screen (not an update)
    if (this.isNew) {
      // Set available seats to total seats for new screens
      screen.availableSeats = screen.totalSeats;
      
      // Update the 'screen' field of the movie with the screen's ID
      movie.screen.push(screen._id);
      await movie.save(); // Save the updated movie document
    } else {
      // For updates, ensure availableSeats doesn't exceed totalSeats
      if (screen.availableSeats > screen.totalSeats) {
        screen.availableSeats = screen.totalSeats;
      }
    }

    next(); // Proceed to save the screen
  } catch (err) {
    next(err); // Pass the error to the next middleware or request handler
  }
});

// Create a Screen model
const Screen = mongoose.model('Screen', screenSchema);
module.exports = Screen;
