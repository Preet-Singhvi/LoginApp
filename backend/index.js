const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express app
const app = express();

// Configure middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/auth_demo', {
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Create a user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create a user model
const User = mongoose.model('User', userSchema);

// Sign-up route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up' });
  }
});

// Sign-in route
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user._id }, '1234', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
});
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token,"token")
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  
    jwt.verify(token, '1234', (error, decodedToken) => {
      if (error) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      req.userId = decodedToken.userId;
      next();
    });
  };  
// Get user information route
// GET user details route
app.get('/home', authenticateToken, async (req, res) => {
    try {
      // Extract the user ID from the request
      const userId = req.userId;
  
      // Fetch the user details from the database
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Return the user details
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user details' });
    }
  });
  

// Protect a route with authentication middleware

// Start the server
app.listen(8888, () => {
  console.log('Server is running on port 8888');
});
