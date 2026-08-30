const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// --- MIDDLEWARE EXPORT ---
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).render('404');
};

// --- ROUTES ---

// GET Register
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { errors: [], oldData: {} });
});

// POST Register (With express-validator for sticky forms)
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Sticky Form: Render view with old input data if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        errors: errors.array(),
        oldData: { name: req.body.name, email: req.body.email }
      });
    }

    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).render('register', {
          errors: [{ msg: 'Email is already registered. Please log in.' }],
          oldData: { name, email }
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'user' // Default user role
      });

      await newUser.save();
      res.redirect('/login');
    } catch (err) {
      console.error('Registration Error:', err);
      res.status(500).send('Server Error');
    }
  }
);

// GET Login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { errors: [], oldData: {} });
});

// POST Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('login', {
        errors: [{ msg: 'Please provide both email and password.' }],
        oldData: { email }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('login', {
        errors: [{ msg: 'Invalid email or password.' }],
        oldData: { email }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('login', {
        errors: [{ msg: 'Invalid email or password.' }],
        oldData: { email }
      });
    }

    // Session assignment
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    };

    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Server Error');
  }
});

// GET Dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('dashboard', {
    user: req.session.user
  });
});

// GET Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/login');
  });
});

// Export Router and Admin Middleware together cleanly
module.exports = { router, isAdmin };