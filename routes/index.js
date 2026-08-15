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




module.exports = router;