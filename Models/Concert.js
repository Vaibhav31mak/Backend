  const mongoose = require('mongoose');
  const validator = require('validator');

  const concertSchema = new mongoose.Schema({
      concertId:{
      type: Number,
      unique:true,
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
    location: {
      type: String,
      required: true,
      trim: true,
    },
    concertDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value >= Date.now();
        },
        message: 'Concert date cannot be in the past.',
      },
    },
    availableSeats: {
      type: Number,
      default: function() {
        return this.totalSeats; // Initially, all seats are available
      },
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [1, 'Total seats must be at least 1.'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number.'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '/static/images/default-movie.jpg',
    },
  });

  // Middleware to handle availableSeats intelligently
  concertSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        // On creation, availableSeats is set to totalSeats (handled by default)
        return next();
      }

      if (this.isModified('totalSeats')) {
        const Concert = mongoose.model('Concert'); // To prevent circular dependency
        const existingConcert = await Concert.findById(this._id).exec();

        if (!existingConcert) {
          return next(new Error('Concert not found.'));
        }

        const previousTotalSeats = existingConcert.totalSeats;
        const previousAvailableSeats = existingConcert.availableSeats;

        const seatDifference = this.totalSeats - previousTotalSeats;

        if (seatDifference > 0) {
          // If totalSeats increased, increase availableSeats by the difference
          this.availableSeats = previousAvailableSeats + seatDifference;
        } else if (seatDifference < 0) {
          // If totalSeats decreased, ensure availableSeats does not exceed new totalSeats
          const newAvailableSeats = previousAvailableSeats + seatDifference;
          if (newAvailableSeats < 0) {
            return next(new Error('Cannot reduce total seats below the number of booked seats.'));
          }
          this.availableSeats = newAvailableSeats;
        }
        // If seatDifference === 0, no action needed
      }

      next();
    } catch (error) {
      next(error);
    }
  });

  const Concert = mongoose.model('Concert', concertSchema);
  module.exports = Concert;
