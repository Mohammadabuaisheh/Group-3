const User = require('../models/User'); 
const Pet = require('../models/pet');

exports.getAdminPanel = async (req, res) => {
  try {
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.render('admin/dashboard', {
      title: 'Admin Panel - SafePaws',
      user: req.session.user,
      recentUsers,
      recentReports: [] 
    });
  } catch (err) {
    console.error('Admin Panel Error:', err);
    res.status(500).send('Server Error');
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAnimals = await Pet.countDocuments();

    // Aggregation Pipeline: Animals by Type
    const animalsByType = await Pet.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.render('admin/analytics', {
      title: 'Analytics - SafePaws',
      user: req.session.user,
      stats: {
        totalUsers,
        totalReports: 0,
        totalAnimals,
        animalsByType,
        reportsByStatus: []
      }
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).send('Server Error');
  }
};