
import express from 'express';
import Auth from '../models/Auth.js';
import User from '../models/User.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find auth record
    const auth = await Auth.findOne({ email }).populate('userId');
    if (!auth) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await auth.isValidPassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user info (without sensitive data)
    const user = auth.userId;
    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'user' } = req.body;

    // Check if user already exists
    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user first
    const user = new User({
      email,
      firstName,
      lastName,
      username: `${firstName}${lastName}`.toLowerCase(),
      clerkId: `local_${Date.now()}`, // Temporary clerk ID
      role
    });
    await user.save();

    // Create auth record
    const auth = new Auth({
      email,
      password,
      userId: user._id,
      provider: 'local'
    });
    await auth.save();

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
