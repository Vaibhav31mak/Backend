const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  deleteBooking,
  getBookingById,
  getBookingsByItemName,
} = require('../Controllers/bookingController');

const {verifyUser , verifyAdmin , verifySelfOrAdmin} = require('../authMiddleware');

// Route to create a new screen
router.post('/',verifyUser,createBooking);

// Route to get all screens
router.get('/',verifyAdmin,getBookings);

router.delete('/:id',verifySelfOrAdmin,deleteBooking);

router.get('/:id',verifyUser,getBookingById);

router.get('/:type/:name',verifyUser,getBookingsByItemName);

module.exports = router;
