// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId:{
   type:Number,
   unique:true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  type: {
    type: String,
    enum: ['Movie', 'Event', 'Concert'], // Specifies the type of booking
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Can reference either a movie, event, or concert
    refPath: 'type', // Dynamically reference the correct model
  },
  itemName: {
    type: String,
    required: true
  },
  ticketsBooked: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
