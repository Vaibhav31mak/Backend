const Event = require('../Models/Event'); // Assuming the model is in the `models` folder

// Create a new event

// Create a new event with auto-incrementing eventId
exports.createEvent = async (req, res) => {
  try {
    const { name, description, location, eventDate, totalSeats, price, imageUrl } = req.body;

    // Auto-increment logic for eventId
    let neventId = 1; // Default to 1 if there are no existing events
    
    // Check if there are existing events, and get the highest eventId
    if (await Event.countDocuments() > 0) {
      const lastEvent = await Event.findOne().sort('-eventId').select('eventId');
      neventId = lastEvent.eventId + 1;
    }

    // Create the event with the auto-incremented eventId
    const event = new Event({
      eventId: neventId,
      name,
      description,
      location,
      eventDate,
      totalSeats,
      availableSeats: totalSeats, // By default, availableSeats will be set to totalSeats
      price,
      imageUrl
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an event by eventId
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId:eventId });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
    try {
      const { eventId } = req.params;
      const updateData = req.body;
  
      // Fetch the event to compare the values before updating
      const existingEvent = await Event.findOne({ eventId });
  
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Validate availableSeats against totalSeats before updating
      if (updateData.availableSeats > updateData.totalSeats || updateData.availableSeats < 0) {
        return res.status(400).json({
          message: 'Validation failed: availableSeats cannot exceed totalSeats or be negative.',
        });
      }
  
      // Perform the update
      const event = await Event.findOneAndUpdate(
        { eventId: eventId },
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: error.message });
    }
  };

// Delete an event by eventId
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOneAndDelete({ eventId:eventId });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
