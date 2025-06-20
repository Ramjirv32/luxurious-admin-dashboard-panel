
import express from 'express';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

// Public API routes (for frontend consumption)

// Get all hotels
router.get('/hotels', async (req, res) => {
  try {
    const { city, search } = req.query;
    let query = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const hotels = await Hotel.find(query)
      .populate('owner', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(hotels);
  } catch (error) {
    console.error('Public hotels fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Get hotel by ID with rooms
router.get('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'firstName lastName');
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const rooms = await Room.find({ hotel: hotel._id, isAvailable: true });
    
    res.json({ ...hotel.toJSON(), rooms });
  } catch (error) {
    console.error('Public hotel fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

// Get rooms for a hotel
router.get('/hotels/:id/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ 
      hotel: req.params.id, 
      isAvailable: true 
    }).populate('hotel', 'name city');

    res.json(rooms);
  } catch (error) {
    console.error('Public rooms fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Create booking
router.post('/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    
    // Populate the booking with hotel and room details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotelId', 'name city address')
      .populate('roomId', 'roomType pricePerNight');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Subscribe to newsletter
router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.subscribed) {
        return res.status(400).json({ error: 'Already subscribed' });
      } else {
        // Resubscribe
        existing.subscribed = true;
        existing.subscribedAt = Date.now();
        await existing.save();
        return res.json({ message: 'Resubscribed successfully' });
      }
    }

    // Create new subscription
    const subscription = new Newsletter({ email });
    await subscription.save();
    
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe from newsletter
router.post('/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscription = await Newsletter.findOne({ email });
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.subscribed = false;
    await subscription.save();
    
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;
