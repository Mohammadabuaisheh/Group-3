const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Mock User Database (Temporary in-memory array until DB integration)
const users = [];

// GET Register Page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register - SafePaws', errors: [], oldData: {} });
});

// POST Register with Validation & Hashing
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // If validation fails -> Render form again with errors & previous input (Sticky Form)
    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        title: 'Register - SafePaws',
        errors: errors.array(),
        oldData: { name: req.body.name, email: req.body.email }
      });
    }

    try {
      // Hash Password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      };

      users.push(newUser);
      console.log('Registered Users:', users);

      // Redirect to login on success
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// GET Login Page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login - SafePaws', errors: [], oldData: {} });
});

// POST Login Handler
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password cannot be empty.')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('login', {
        title: 'Login - SafePaws',
        errors: errors.array(),
        oldData: { email: req.body.email }
      });
    }

    // Check if user exists
    const user = users.find(u => u.email === req.body.email);
    if (!user) {
      return res.status(400).render('login', {
        title: 'Login - SafePaws',
        errors: [{ msg: 'Invalid email or password.' }],
        oldData: { email: req.body.email }
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).render('login', {
        title: 'Login - SafePaws',
        errors: [{ msg: 'Invalid email or password.' }],
        oldData: { email: req.body.email }
      });
    }

    // Login Success Placeholder (e.g., redirect home/dashboard)
    res.redirect('/');
  }
);

module.exports = router;