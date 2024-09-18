const express = require('express');
const router = express.Router();
const {
  createTheater,
  getTheaters,
  getTheaterById,
  update,updateTheater,
  deleteTheater,
} = require('../Controllers/theaterController');
const {verifyAdmin, verifyUser} = require('../authMiddleware');
// Route to create a new movie
// POST /api/movies
router.post('/',verifyAdmin,createTheater);

// Route to get all movies
// GET /api/movies
router.get('/',verifyUser,getTheaters);

// Route to get a movie by ID
// GET /api/movies/:id
router.get('/:id',verifyUser,getTheaterById);

// Route to update a movie by ID
// PUT /api/movies/:id
router.put('/:id',verifyAdmin,updateTheater);

// Route to delete a movie by ID
// DELETE /api/movies/:id
router.delete('/:id',verifyAdmin,deleteTheater);

module.exports = router;
