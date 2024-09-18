const Booking = require('../Models/Bookings');
const User = require('../Models/User');
const Movie = require('../Models/Movie');
const Event = require('../Models/Event');
const Concert = require('../Models/Concert');

const createBooking = async (req, res) => {
    try {
      const { userId, type, itemName, ticketsBooked } = req.body;
  
      // Find user by userId
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }
  
      // Fetch item based on type and itemName
      let Model;
      let screens = []; // Will hold the screens if booking is for a movie
  
      switch (type) {
        case 'Movie':
          Model = Movie;
          break;
        case 'Event':
          Model = Event;
          break;
        case 'Concert':
          Model = Concert;
          break;
        default:
          throw new Error('Invalid type');
      }
  
      const query = Model.findOne({ name: itemName });
      if (type === 'Movie') {
        query.populate('screen'); // Populate screens only for movies
      }
      let currscreen;
      const item = await query;
      if (!item) {
        throw new Error(`${type} not found`);
      }
  
      // If booking is for a movie, find screens with available seats
      if (type === 'Movie') {
        screens = item.screen;
        if (!screens || screens.length === 0) {
          throw new Error('No screens available for this movie');
        }
  
        // Find a screen with available seats
        let seatsToBook = ticketsBooked;
        let screenFound = false;
        for (const screen of screens) {
          if (screen.availableSeats > 0 && screenFound === false) {
            if (screen.availableSeats >= seatsToBook) {
              screen.availableSeats -= seatsToBook;
              screen.bookings = 
              await screen.save();
              screenFound = true;
              currscreen = screen;
              break;
            } else {
              seatsToBook -= screen.availableSeats;
              screen.availableSeats = 0;
              await screen.save();
            }
          }
        }
  
        if (!screenFound) {
          throw new Error('Not enough available seats in any screen');
        }
      } else {
        // Update availableSeats for events or concerts
        item.availableSeats -= ticketsBooked;
        if (item.availableSeats < 0) {
          item.availableSeats = 0; // Ensure availableSeats doesn't go negative
        }
        await item.save();
      }
  
      // Calculate the new bookingId
      let newBookingId = 1; // Default to 1 if there are no existing bookings
      if (await Booking.countDocuments() > 0) {
        const lastBooking = await Booking.findOne().sort('-bookingId').select('bookingId');
        newBookingId = lastBooking.bookingId + 1;
      }
  
      // Create the booking
      const newBooking = new Booking({
        bookingId: newBookingId,
        user: user._id,
        type,
        item: item._id,
        itemName,
        ticketsBooked,
      });
  
      // Save the booking
      await newBooking.save();
      if(type === 'Movie')
      {
        currscreen.bookings.push(newBooking._id);
        await currscreen.save();
      }
      // Add booking reference to user's bookings array
      user.bookings.push(newBooking._id);
      await user.save();
  
      res.status(201).json({ message: 'Booking added successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

const getBookings = async (req,res) => {
    try{const bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('item');
      res.json(bookings);

    }catch(error){
        res.status(500).json({error:error.message});
    }
};
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the booking by its bookingId
        const booking = await Booking.findOne({ bookingId: id }).populate('user').populate('item');
        if (!booking) {
            throw new Error('Booking not found');
        }

        // Remove the booking reference from the user's bookings array
        const user = await User.findById(booking.user._id);
        user.bookings = user.bookings.filter((b) => b.toString() !== booking._id.toString());
        await user.save();

        // Handle item (movie, event, or concert) specifics
        let Model;
        let item = null;
        let screens = [];

        switch (booking.type) {
            case 'Movie':
                Model = Movie;
                item = await Model.findById(booking.item._id).populate('screen');
                if (!item) {
                    throw new Error('Movie not found');
                }
                screens = item.screen;
                if (!screens || screens.length === 0) {
                    throw new Error('No screens available for this movie');
                }

                // Increment seats starting from the last screen
                let seatsToReturn = booking.ticketsBooked;
                let screenFound = false;
                for (let i = screens.length - 1; i >= 0; i--) {
                    const screen = screens[i];
                    if (screen.totalSeats > screen.availableSeats) {  // Check if seats can be incremented
                        const availableSeats = screen.availableSeats;
                        screen.availableSeats += seatsToReturn;
                        if (screen.availableSeats > screen.totalSeats) {
                            screen.availableSeats = screen.totalSeats; // Ensure availableSeats doesn't exceed totalSeats
                        }
                        await screen.save();
                        seatsToReturn = 0;
                        screenFound = true;
                        break;
                    }
                }

                if (!screenFound) {
                    throw new Error('Unable to update seats on screens');
                }
                break;

            case 'Event':
            case 'Concert':
                Model = booking.type === 'Event' ? Event : Concert;
                item = await Model.findById(booking.item._id);
                if (!item) {
                    throw new Error(`${booking.type} not found`);
                }
                item.availableSeats += booking.ticketsBooked;
                if (item.availableSeats > item.totalSeats) {
                    item.availableSeats = item.totalSeats; // Ensure availableSeats doesn't exceed totalSeats
                }
                await item.save();
                break;

            default:
                throw new Error('Invalid booking type');
        }

        // Delete the booking
        await Booking.deleteOne({ _id: booking._id });

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        // Convert id to a number
        const bookingId = Number(id);

        if (isNaN(bookingId)) {
            throw new Error('Invalid booking ID');
        }

        // Find the booking by its bookingId
        const booking = await Booking.findOne({ bookingId }).populate('user').populate('item');
        if (!booking) {
            throw new Error('Booking not found');
        }

        res.json(booking);
    } catch (error) {
        console.error(error.message); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};
const getBookingsByItemName = async (req, res) => {
    try {
        const { type, name } = req.params;

        let Model;

        // Determine the model based on the type
        switch (type) {
            case 'Movie':
                Model = Movie;
                break;
            case 'Event':
                Model = Event;
                break;
            case 'Concert':
                Model = Concert;
                break;
            default:
                throw new Error('Invalid type');
        }

        // Find the item by name
        const item = await Model.findOne({ name });
        if (!item) {
            throw new Error(`${type} not found`);
        }

        // Find bookings associated with this item
        const bookings = await Booking.find({ item: item._id }).populate('user').populate('item');
        if (bookings.length === 0) {
            throw new Error('No bookings found for this item');
        }

        res.json(bookings);
    } catch (error) {
        console.error(error.message); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};



module.exports={
    createBooking,
    getBookings,
    deleteBooking,
    getBookingById,
    getBookingsByItemName,
};