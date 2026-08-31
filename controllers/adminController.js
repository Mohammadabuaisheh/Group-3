const User = require('../models/User');
const Pet = require('../models/pet');
const Report = require('../models/Report');

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

exports.getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAnimals = await Pet.countDocuments();
        const totalReports = await Report.countDocuments();

        const animalsByType = await Pet.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const reportsByStatus = await Report.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
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