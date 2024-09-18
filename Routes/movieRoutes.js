const express = require('express');
const router = express.Router();
const {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require('../Controllers/movieController');
const {verifyUser, verifyAdmin, verifySelfOrAdmin} =require('../authMiddleware')
// Route to create a new movie
// POST /api/movies
router.post('/',verifyAdmin,createMovie);

// Route to get all movies
// GET /api/movies
router.get('/',verifyUser,getMovies);

// Route to get a movie by ID
// GET /api/movies/:id
router.get('/:id?',verifyUser,getMovieById);

// Route to update a movie by ID
// PUT /api/movies/:id
router.put('/:id',verifyAdmin,updateMovie);

// Route to delete a movie by ID
// DELETE /api/movies/:id
router.delete('/:id',verifyAdmin,deleteMovie);

module.exports = router;
