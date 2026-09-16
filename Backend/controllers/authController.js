const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'agrishield_jwt_secret_key_2026_safe_auth';
  return jwt.sign({ userId, role }, secret, {
    expiresIn: '7d'
  });
};

/**
 * @desc    Register new user (Admin / User)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, Email, and Password are required fields'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email ID already exists'
      });
    }

    // Validate role
    const assignedRole = role && ['admin', 'user'].includes(role.toLowerCase())
      ? role.toLowerCase()
      : 'user';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole
    });

    // Generate JWT Token
    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in registerUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user registration'
    });
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email ID and password'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email ID or password'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email ID or password'
      });
    }

    // Generate JWT Token
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in loginUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Error in getMe controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
