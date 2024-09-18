const Concert = require('../Models/Concert');

// Create a new concert
const createConcert = async (req, res) => {
    try {
      // Create a concert instance without concertId
      const concert = new Concert(req.body);
  
      // Calculate the new concertId
      let newConcertId = 1;  // Default to 1 if there are no existing concerts
  
      if (await Concert.countDocuments() > 0) {
        const lastConcert = await Concert.findOne().sort('-concertId').select('concertId');
        newConcertId = lastConcert.concertId + 1;
      }
  
      // Assign the calculated concertId to the concert instance
      concert.concertId = newConcertId;
  
      // Save the concert
      await concert.save();
  
      // Respond with the newly created concert
      res.status(201).json(concert);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
// Get all concerts
const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.status(200).json(concerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get concert by ID
// Get concert by concertId (instead of MongoDB _id)
const getConcertById = async (req, res) => {
    try {
      const concert = await Concert.findOne({ concertId: req.params.id });
      if (!concert) return res.status(404).json({ error: 'Concert not found' });
      res.status(200).json(concert);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Update concert by ID
// Update concert by concertId (instead of MongoDB _id)
const updateConcert = async (req, res) => {
    try {
      const concert = await Concert.findOneAndUpdate(
        { concertId: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!concert) return res.status(404).json({ error: 'Concert not found' });
      res.status(200).json(concert);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// Delete concert by ID
// Delete concert by concertId (instead of MongoDB _id)
const deleteConcert = async (req, res) => {
    try {
      const concert = await Concert.findOneAndDelete({ concertId: req.params.id });
      if (!concert) return res.status(404).json({ error: 'Concert not found' });
      res.status(200).json({ message: 'Concert deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = {
  createConcert,
  getAllConcerts,
  getConcertById,
  updateConcert,
  deleteConcert,
};
