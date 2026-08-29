const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            req.flash('error', 'Please fill in all fields.');
            return res.redirect('/register');
        }

        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.redirect('/register');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email is already registered. Please log in.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect('/login');
    } catch (err) {
        console.error('Registration Error:', err);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error', 'Please provide both email and password.');
            return res.redirect('/login');
        }

        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/');
    } catch (err) {
        console.error('Login Error:', err);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.redirect('/login');
    });
});

module.exports = router;