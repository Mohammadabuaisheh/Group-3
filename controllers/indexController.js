const getHome = (req, res) => {
    res.render('home');
};

const getAbout = (req, res) => {
    const projectTeam = [
        { name: 'Mohammad', id: '2023101' },
        { name: 'Nourhan', id: '2023102' },
        { name: 'Abdulrahman', id: '2023103' },
        { name: 'Mahdi', id: '2023104' },
        { name: 'Yazan', id: '2023105' }
    ];
    
    res.render('about', { team: projectTeam });
};

const getFeatures = (req, res) => {
    const safePawsServices = [
        { 
            name: 'Adoption', 
            description: 'Providing a reliable environment that allows users to browse animal details to easily find them a suitable shelter.' 
        },
        { 
            name: 'Reporting', 
            description: 'A rapid reporting system for lost animals or those requiring urgent medical intervention.' 
        },
        { 
            name: 'Donation', 
            description: 'A transparent channel to collect financial support to cover the costs of medical treatment and care.' 
        }
    ];
    res.render('features', { services: safePawsServices });
};

const getContact = (req, res) => {
    res.render('contact'); 
};

const getAnimalDetails = (req, res) => {
    const animalId = req.params.id;
    res.render('detail', {id: animalId});
};

module.exports = {
    getHome,
    getAbout,
    getFeatures,
    getContact,
    getAnimalDetails
};