const Theater = require('../Models/Theater');
const Movie = require('../Models/Movie');

// Create a new theater
const createTheater = async (req, res) => {
    try {
        const { movies, ...theaterData } = req.body;

        // Find movies by their names
        const movieIds = [];
        for (let movieName of movies) {
            const movie = await Movie.findOne({ name: movieName });

            // If a movie is not found, return an error
            if (!movie) {
                return res.status(404).json({ error: `Movie '${movieName}' not found` });
            }
            
            // Add the movie's ObjectId to the array
            movieIds.push(movie._id);
        }

        // Create a new theater with the movie ObjectIds
        const theater = new Theater({
            ...theaterData,
            movies: movieIds, // Store movie ObjectIds
        });

        // Save the theater to the database
        const savedTheater = await theater.save();
        res.status(201).json({ message: 'Theater created successfully', theater: savedTheater });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all theaters
const getTheaters = async (req, res) => {
    try {
        // Fetch all theaters and populate the movie details
        const theaters = await Theater.find().populate('movies');
        res.status(200).json(theaters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a theater by ID
const getTheaterById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the theater by theaterId (not _id) and populate movie details
        const theater = await Theater.findOne({ theaterId: id }).populate('movies');
        
        if (!theater) {
            return res.status(404).json({ error: 'Theater not found' });
        }

        res.status(200).json(theater);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update a theater
const updateTheater = async (req, res) => {
    try {
        const { id } = req.params; // The theaterId
        const { movies, ...updateData } = req.body;

        // Find the theater by theaterId
        const theater = await Theater.findOne({ theaterId: id });
        if (!theater) {
            return res.status(404).json({ error: 'Theater not found' });
        }

        // If movies are provided, update the movies list by movie names
        if (movies) {
            const movieIds = [];
            for (let movieName of movies) {
                const movie = await Movie.findOne({ name: movieName });
                if (!movie) {
                    return res.status(404).json({ error: `Movie '${movieName}' not found` });
                }
                movieIds.push(movie._id);
            }
            updateData.movies = movieIds; // Set the new movie references
        }

        // Update the theater with the new data
        Object.assign(theater, updateData);
        const updatedTheater = await theater.save();
        res.status(200).json(updatedTheater);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a theater
const deleteTheater = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the theater by theaterId and delete it
        const theater = await Theater.findOneAndDelete({ theaterId: id });
        if (!theater) {
            return res.status(404).json({ error: 'Theater not found' });
        }

        res.status(200).json({ message: 'Theater deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export all controller functions
module.exports = {
    createTheater,
    getTheaters,
    getTheaterById,
    updateTheater,
    deleteTheater,
};
