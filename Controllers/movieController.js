const Movie = require('../Models/Movie');

// Create a new movie
const createMovie = async (req, res) => {
    try {
      // Create a movie instance from the request body
      const movie = new Movie(req.body);
      
      // Calculate the new movieId
      let movieId = 1; // Default to 1 if there are no existing movies
      
      if (await Movie.countDocuments() > 0) {
        const lastMovie = await Movie.findOne().sort('-movieId').select('movieId');
        movieId = lastMovie.movieId + 1; // Assign the next movieId
      }
      
      // Assign the calculated movieId to the movie instance
      movie.movieId = movieId;
      
      // Save the movie
      await movie.save();
      
      // Respond with the newly created movie
      res.status(201).json(movie);
    } catch (error) {
      // Handle any errors
      res.status(400).json({ error: error.message });
    }
  };
  

// Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find(); // Populating screen details if needed
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ movieId: req.params.id });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a movie
const updateMovie = async (req, res) => {
  try {
    // Extract movieId from request parameters
    // Find movie by id and update
    const movie = await Movie.findOneAndUpdate({ movieId: req.params.id }, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a movie
const deleteMovie = async (req, res) => {
  try {
    // Extract movieId from request parameters
    // Find movie by id and delete
    const movie = await Movie.findOneAndDelete({ movieId: req.params.id });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
