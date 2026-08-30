const Adoption = require('../models/Adoption');
const Pet = require('../models/pet');

const getApplyPage = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.petId);
        if (!pet) {
            return res.status(404).render('404', { message: 'Pet not found.' });
        }
        res.render('adoptions/apply', { pet, error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const submitApplication = async (req, res) => {
    try {
        const { applicantName, applicantEmail, phone, housingType, hasOtherPets, reason } = req.body;
        const petId = req.params.petId;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).render('404', { message: 'Pet not found.' });
        }

        const existingApp = await Adoption.findOne({
            petId: petId,
            userId: req.session.user.id
        });

        if (existingApp) {
            return res.render('adoptions/apply', {
                pet,
                error: 'You have already applied to adopt this pet.'
            });
        }

        await Adoption.create({
            petId,
            userId: req.session.user.id,
            applicantName,
            applicantEmail,
            phone,
            housingType,
            hasOtherPets: hasOtherPets === 'true',
            reason
        });

        res.redirect('/my-adoptions?success=1');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const getMyAdoptions = async (req, res) => {
    try {
        const adoptions = await Adoption.find({ userId: req.session.user.id })
            .populate('petId')
            .sort({ createdAt: -1 });

        res.render('adoptions/my-adoptions', {
            adoptions,
            success: req.query.success === '1'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const cancelApplication = async (req, res) => {
    try {
        const adoption = await Adoption.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.user.id
        });

        if (!adoption) {
            return res.status(404).render('404', { message: 'Application not found.' });
        }

        res.redirect('/my-adoptions');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getApplyPage,
    submitApplication,
    getMyAdoptions,
    cancelApplication
};