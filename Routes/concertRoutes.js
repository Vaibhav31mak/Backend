const express = require('express');
const router = express.Router();
const concertController = require('../Controllers/concertController');
const {verifyUser, verifyAdmin, verifyUserOrAdmin} = require('../authMiddleware');
// Route to create an event
router.post('/',verifyAdmin,concertController.createConcert);

// Route to get all events
router.get('/',verifyUser,concertController.getAllConcerts);

// Route to get a single event by eventId
router.get('/:id',verifyUser,concertController.getConcertById);

// Route to update an event by eventId
router.put('/:id',verifyAdmin,concertController.updateConcert);

// Route to delete an event by eventId
router.delete('/:id',verifyAdmin,concertController.deleteConcert);

module.exports = router;
