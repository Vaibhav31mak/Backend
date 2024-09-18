const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController'); // Assuming the controller is in the `controllers` folder
const {verifyUser, verifyAdmin, verifyUserOrAdmin} = require('../authMiddleware');
// Route to create an event
router.post('/',verifyAdmin,eventController.createEvent);

// Route to get all events
router.get('/',verifyUser,eventController.getAllEvents);

// Route to get a single event by eventId
router.get('/:eventId',verifyUser,eventController.getEventById);

// Route to update an event by eventId
router.put('/:eventId',verifyAdmin,eventController.updateEvent);

// Route to delete an event by eventId
router.delete('/:eventId',verifyAdmin,eventController.deleteEvent);

module.exports = router;
