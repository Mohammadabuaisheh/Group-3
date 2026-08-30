const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    applicantEmail: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    housingType: {
        type: String,
        enum: ['Apartment', 'House', 'Villa', 'Other'],
        required: true
    },
    hasOtherPets: {
        type: Boolean,
        default: false
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Adoption', adoptionSchema);