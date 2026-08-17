const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const reports=[];

router.get('/', indexController.getHome);
router.get('/about', indexController.getAbout);
router.get('/features', indexController.getFeatures);
router.get('/contact', indexController.getContact);
router.get('/animal/:id', indexController.getAnimalDetails);

router.get('/report-animal', (req, res) => {
    if(!req.session.user){
        return res.redirect('/login');
    }
    res.render('report-animal');
});
router.post('/report-animal',(req,res)=>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    const report={
        animalName:req.body.animalName,
        type:req.body.type,
        status:req.body.status,
        behavior:req.body.behavior,
        location:req.body.location,
        description:req.body.description,
        userId:req.session.user.id

    };
    reports.push(report);
    res.redirect('/my-reports?success=1');
    
});

router.get('/my-reports', (req, res) => {
     if(!req.session.user){
        return res.redirect('/login');
    }
    const userReports=reports.filter(
        report => report.userId===req.session.user.id
    );
    res.render('my-reports',{
        reports:userReports,
        success:req.query.success==='1'
    });
    
});




router.get('/theme/:theme', (req, res) => {
  const theme = req.params.theme;
  
  if (theme === "light" || theme === "dark") {
    res.cookie("theme", theme, {
      maxAge: 1000 * 60 * 60 * 24 * 30, 
      httpOnly: true
    });
  }
  
  res.redirect('/search');
});

const pets = [
  { name: "Max", type: "dog", age: 3 },
  { name: "Luna", type: "cat", age: 2 },
  { name: "Bella", type: "dog", age: 5 },
  { name: "Milo", type: "cat", age: 1 },
  { name: "Charlie", type: "bird", age: 4 }
];

router.get('/search', (req, res) => {
  const search = req.query.search || "";
  const type = req.query.type || "";
  
  const theme = req.cookies.theme || "light";

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === "" || pet.type === type;
    return matchesSearch && matchesType;
  });

  res.render('search', {
    title: 'Search Pets',
    pets: filteredPets,
    searchQuery: search,
    searchType: type,
    theme: theme
  });
});

module.exports = router;