const Screen = require('../Models/Screen');
const Movie = require('../Models/Movie');

const createScreen = async (req, res) => {
    try {
        const { movieId, movieName, ...screenData } = req.body;

        // Find the movie by either movieId or name
        let movie;
        if (movieId) {
            movie = await Movie.findOne({ movieId });
        } else if (movieName) {
            movie = await Movie.findOne({ name: movieName });
        }

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Generate a new screenId
        let newScreenId = 1;
        if (await Screen.countDocuments() > 0) {
            const lastScreen = await Screen.findOne().sort('-screenId').select('screenId');
            newScreenId = lastScreen.screenId + 1;
        }

        // Create a new Screen with the movie's ObjectId
        const screen = new Screen({
            ...screenData,
            movie: movie._id, // Reference the movie's ObjectId
            screenId: newScreenId,
        });

        // Save the new screen
        const savedScreen = await screen.save();

        res.status(201).json({ message: 'Screen added successfully', screen: savedScreen });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all screens
const getScreens = async (req, res) => {
    try {
        const screens = await Screen.find().populate('movie');
        res.status(200).json(screens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getScreenByMovie = async (req, res) => {
    try {
        const { movieName } = req.params;
        
        // Find the movie by name
        const movie = await Movie.findOne({ name: movieName });

        if (!movie) return res.status(404).json({ error: 'Movie not found' });

        // Find screens associated with the movie
        const screens = await Screen.find({ movie: movie._id }).populate('movie');
        if (!screens.length) return res.status(404).json({ error: 'No screens found for this movie' });

        res.status(200).json(screens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateScreen = async (req, res) => {
    try {
        const { id } = req.params;
        const { movieId, movieName, ...updateData } = req.body;

        // Find the screen
        const screen = await Screen.findOne({ screenId: id });
        if (!screen) return res.status(404).json({ error: 'Screen not found' });

        // Check if movieId or movieName is being updated
        if (movieId || movieName) {
            // Find the current movie associated with the screen
            const oldMovie = await Movie.findById(screen.movie);
            
            // Find the new movie by movieId or name
            let newMovie;
            if (movieId) {
                newMovie = await Movie.findOne({ movieId });
            } else if (movieName) {
                newMovie = await Movie.findOne({ name: movieName });
            }

            if (!newMovie) return res.status(404).json({ error: 'New movie not found' });

            // Remove the screen from the old movie's screen array
            if (oldMovie) {
                oldMovie.screen = oldMovie.screen.filter(id => !id.equals(screen._id));
                await oldMovie.save();
            }

            // Update the screen's movie reference (make sure it's the ObjectId)
            screen.movie = newMovie._id;

            // Add the screen to the new movie's screen array
            newMovie.screen.push(screen._id);
            await newMovie.save();
        }

        // Update other screen fields
        Object.assign(screen, updateData);
        const updatedScreen = await screen.save();

        res.status(200).json(updatedScreen);
    } catch (error) {
        console.error('Error in updateScreen:', error);
        res.status(400).json({ error: error.message });
    }
};


//
const deleteScreen = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the screen
        const screen = await Screen.findOne({ screenId: id });
        if (!screen) return res.status(404).json({ error: 'Screen not found' });

        // Find the movie associated with the screen
        const movie = await Movie.findById(screen.movie);
        if (movie) {
            // Remove the screen from the movie's screen array
            movie.screen = movie.screen.filter(id => !id.equals(screen._id));
            await movie.save();
        }

        // Delete the screen
        await Screen.deleteOne({ screenId: id });

        res.status(200).json({ message: 'Screen deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getScreenById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the screen by its screenId
        const screen = await Screen.findOne({ screenId:id });

        if (!screen) return res.status(404).json({ error: 'Screen not found' });

        res.status(200).json(screen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Export all the controller functions
module.exports = {
    createScreen,
    getScreens,
    getScreenByMovie,
    updateScreen,
    deleteScreen,
    getScreenById,
};
