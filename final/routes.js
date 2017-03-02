//require dependencies
var express = require('express');
var router = express.Router();
var projectController = require('./controllers/projectController');
var studentController = require('./controllers/studentController');

var multer = require('multer');
var upload = multer({ dest: 'uploads' });
var upload2 = multer({ dest: 'profilePics' });
var type = upload.single('data');
var pic = upload2.single('profile_pic');


// adding routes

//login or signup page
router.get('/loginOrSignup', studentController.renderLoginPage);
router.post('/loginStudent', studentController.loginverify);
router.post('/registerStudent', pic, studentController.createStudent);
router.post('/search', projectController.searchProjects);

//my portfolio page
router.get('/myPortfolio', projectController.getMyProjects);
router.post('/createProject', type, projectController.createProject);
router.get('/deleteProject', projectController.deleteProject);

//home
//router.get('/', projectController.getAllProjects);
router.get('/', studentController.getAllStudents);
router.get('/logout', studentController.logout);
router.get('/viewProfile', projectController.viewProfile);

router.get('/viewScreenShot', studentController.viewImage);

//router.get('/loggedIn', projectController.getAllProjects);
//router.post('/updateProject', projectController.updateProject);

//router.post('/deleteProject', projectController.deleteProject);
//router.post('/searchProjects', projectController.searchProjects);

module.exports = router;