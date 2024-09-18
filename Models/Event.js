const mongoose = require('mongoose');
const validator = require('validator');

const eventSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    unique: true
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
  eventDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value.getTime() >= Date.now();
      },
      message: 'Event date cannot be in the past.',
    },
  },
  availableSeats: {
    type: Number,
    default: function () {
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
    default: '/static/images/default-movie.jpg', // Default image path
  },
});

eventSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        // On creation, set availableSeats to totalSeats
        this.availableSeats = this.totalSeats;
        return next();
      }
  
      if (this.isModified('totalSeats')) {
        const existingEvent = await mongoose.model('Event').findById(this._id);
  
        if (!existingEvent) {
          return next(new Error('Event not found.'));
        }
  
        const seatDifference = this.totalSeats - existingEvent.totalSeats;
        const newAvailableSeats = existingEvent.availableSeats + seatDifference;
  
        if (newAvailableSeats < 0) {
          return next(new Error('Cannot reduce total seats below the number of booked seats.'));
        }
  
        this.availableSeats = newAvailableSeats;
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });
  

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
