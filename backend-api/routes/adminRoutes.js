
import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

// Dashboard Stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [totalUsers, totalBookings, totalHotels, totalSubscribers] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Hotel.countDocuments(),
      Newsletter.countDocuments()
    ]);

    // Calculate total revenue
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Recent activity
    const recentBookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .limit(5)
      .populate('hotelId', 'name');

    const recentActivity = recentBookings.map(booking => ({
      message: `New booking at ${booking.hotelId?.name || 'Unknown Hotel'}`,
      time: booking.bookingDate.toLocaleDateString()
    }));

    res.json({
      totalUsers,
      totalBookings,
      totalHotels,
      totalRevenue,
      totalSubscribers,
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Users Management
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-clerkId'),
      User.countDocuments(query)
    ]);

    res.json({
      data: users,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-clerkId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).select('-clerkId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User delete error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Bookings Management
router.get('/bookings', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { userEmail: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ bookingDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('hotelId', 'name city')
        .populate('roomId', 'roomType')
        .populate('userId', 'firstName lastName email'),
      Booking.countDocuments(query)
    ]);

    res.json({
      data: bookings,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotelId', 'name city address contact')
      .populate('roomId', 'roomType pricePerNight amenities')
      .populate('userId', 'firstName lastName email phoneNumber');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Booking fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Booking status update error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Hotels Management
router.get('/hotels', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [hotels, total] = await Promise.all([
      Hotel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'firstName lastName username email'),
      Hotel.countDocuments(query)
    ]);

    res.json({
      data: hotels,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Hotels fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

router.get('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'firstName lastName username email phoneNumber');
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    // Get rooms for this hotel
    const rooms = await Room.find({ hotel: hotel._id });
    
    res.json({ ...hotel.toJSON(), rooms });
  } catch (error) {
    console.error('Hotel fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

router.put('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    console.error('Hotel update error:', error);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
});

router.delete('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    // Also delete associated rooms
    await Room.deleteMany({ hotel: req.params.id });
    
    res.json({ message: 'Hotel and associated rooms deleted successfully' });
  } catch (error) {
    console.error('Hotel delete error:', error);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

// Newsletter Management
router.get('/newsletter', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = { email: { $regex: search, $options: 'i' } };
    }

    const [subscribers, total] = await Promise.all([
      Newsletter.find(query)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit),
      Newsletter.countDocuments(query)
    ]);

    res.json({
      data: subscribers,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Newsletter fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter subscribers' });
  }
});

router.delete('/newsletter/:id', async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    res.json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    console.error('Newsletter delete error:', error);
    res.status(500).json({ error: 'Failed to remove subscriber' });
  }
});

// Rooms Management
router.get('/rooms', async (req, res) => {
  try {
    const hotelId = req.query.hotelId;
    let query = {};
    if (hotelId) {
      query.hotel = hotelId;
    }

    const rooms = await Room.find(query)
      .populate('hotel', 'name city')
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    console.error('Rooms fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

router.post('/rooms', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error('Room create error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.put('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Room update error:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

router.delete('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Room delete error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;
