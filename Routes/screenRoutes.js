const express = require('express');
const router = express.Router();
const {
  createScreen,
  getScreens,
  getScreenByMovie,
  updateScreen,
  deleteScreen,
  getScreenById,
} = require('../Controllers/screenController');
const {verifyUser, verifyAdmin, verifySelfOrAdmin} = require('../authMiddleware');
// Route to create a new screen
router.post('/',verifyAdmin,createScreen);

// Route to get all screens
router.get('/',verifyUser,getScreens);

// Route to get screens by movie name or movieId
router.get('/movie/:movieName',verifyUser,getScreenByMovie);  // Use either movieId or movieName as parameter

// Route to update a screen by screenId
router.put('/:id',verifyAdmin,updateScreen);

// Route to delete a screen by screenId
router.delete('/:id',verifyAdmin,deleteScreen);

router.get('/:id',verifyUser,getScreenById);

module.exports = router;
