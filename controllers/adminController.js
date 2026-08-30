// controllers/adminController.js
const User = require('../models/User'); 
const Report = require('../models/Report');
const Animal = require('../models/Animal');

// 1. Admin Panel Page
exports.getAdminPanel = async (req, res) => {
  try {
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentReports = await Report.find().sort({ createdAt: -1 }).limit(5);

    res.render('admin/dashboard', {
      title: 'Admin Panel - SafePaws',
      user: req.session.user,
      recentUsers,
      recentReports
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 2. Summary Analytics Page (MongoDB Aggregations + countDocuments)
exports.getAnalytics = async (req, res) => {
  try {
    // Multi-collection document counts
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalAnimals = await Animal.countDocuments();

    // Aggregation Pipeline: Animals by Type
    const animalsByType = await Animal.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregation Pipeline: Reports by Status
    const reportsByStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.render('admin/analytics', {
      title: 'Analytics - SafePaws',
      user: req.session.user,
      stats: {
        totalUsers,
        totalReports,
        totalAnimals,
        animalsByType,
        reportsByStatus
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};