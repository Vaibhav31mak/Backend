const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');
const movieRoutes = require('./Routes/movieRoutes');
const screenRoutes = require('./Routes/screenRoutes');
const theaterRoutes = require('./Routes/theaterRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const concertRoutes = require('./Routes/concertRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// Use routes with their respective prefixes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/theater',theaterRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/bookings',bookingRoutes);
// ... other routes

// Connect to MongoDB and start server
mongoose.connect('mongodb://localhost:27017/EventHub').then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
