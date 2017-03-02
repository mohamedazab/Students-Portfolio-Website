var Student = require('../models/Student');

var multer = require('multer');
var upload2 = multer({ dest: 'profilePics' });
var pic = upload2.single('profile_pic');
var fs = require('fs');









///functions
exports.viewImage = function(req, res) {

    var screenshot = req.query.screenshot;
    res.render('viewScreenShot', { screenshot });

}
exports.createStudent = function(req, res, pic) {
    var target_path = "";
    // console.log(req.file);
    if (!req.file)
        target_path = 'profilePics/31246-purple-lights-in-space-1920x1080-space-wallpaper.jpg';
    else {
        // console.log(req.file);
        // var tmp_path = req.file.path;
        // var target_path = 'profilePics/' + req.file.originalname;
        //var src = fs.createReadStream(tmp_path);
        //var dest = fs.createWriteStream(target_path);
        //src.pipe(dest);
        //fs.unlinkSync(tmp_path);
        target_path = req.file.path;
        console.log("hi the target is" + target_path);
    }
    let student = new Student(req.body);
    student.profile_pic = target_path;

    //console.log(target_path);
    console.log("create student" + student);

    student.save(function(err, student) {
        if (err) {
            console.log("already exists");
            res.redirect('/loginOrSignup?signupfail=signup failed');
        } else {
            req.session.student = student;
            console.log("new student " + student.username + " registered ");
            res.redirect('/myPortfolio');
        }
    })
};

exports.renderLoginPage = function(req, res) {
    var trial = " ";
    var signupfail = "";
    if (req.query.fail)
        trial = req.query.fail;
    if (req.query.signupfail)
        signupfail = req.query.signupfail;

    console.log(signupfail + " hi " + signupfail);
    res.render('loginOrSignup', { trial, signupfail });
};
exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');

};

exports.loginverify = function(req, res) {
    //res.send(projects);
    var username = req.body.username;
    var password = req.body.password;

    Student.findOne({ 'username': username, 'password': password }, function(err, foundStudent) {
        if (err) res.send(err.message);
        else
        if (foundStudent) {
            req.session.student = foundStudent;
            console.log("login sucessful " + req.session.student);
            res.redirect('/myPortfolio');
            //create session
        } else {
            console.log("wrong username or passward");
            res.redirect('/loginOrSignup?fail=login failed');
        }


    })

};

exports.getAllStudents = function(req, res) {

    ///pictures


    Student.find(function(err, St) {

        var pageSize = 10;
        var currentPage = 1;
        var countPages = Math.ceil(St.length / 10);
        if (req.query.page) {
            currentPage = req.query.page;
        }
        if (currentPage > countPages || currentPage < 1) {
            var val = 1;
            if (currentPage > countPages)
                val = countPages;
            res.redirect('/?page=' + val);
            return;
        }
        var students = [];
        var start = (currentPage - 1) * 10;
        for (var i = start; i < St.length && i < start + 10; i++) {
            students.push(St[i]);
        }
        console.log(students.length);
        console.log(St.length);
        if (err)
            res.send(err.message);
        else {
            if (!req.session || !req.session.student)
                res.render('index', { students, currentPage, countPages });
            else
                res.render('loggedIn', { students, currentPage, countPages });
        }
    })
};