const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    animalName: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Dog', 'Cat', 'Bird', 'Other']
    },
    status: {
        type: String,
        required: true,
        enum: ['Lost', 'Injured', 'Found', 'Resolved'],
        default: 'Lost'
    },
    behavior: {
        type: String,
        enum: ['Calm', 'Scared', 'Aggressive'],
        default: 'Calm'
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);