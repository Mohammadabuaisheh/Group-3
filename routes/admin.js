// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// Protected routes using role-based session middleware
router.get('/admin', isAdmin, adminController.getAdminPanel);
router.get('/admin/analytics', isAdmin, adminController.getAnalytics);

module.exports = router;