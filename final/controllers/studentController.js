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
    if (!req.file)
        target_path = 'profilePics/unknown.jpg';
    else {

        target_path = req.file.path;
    }
    if (!req.body) {
        res.redirect('/loginOrSignup?signupfail=signup failed');
        return;
    }
    let student = new Student(req.body);
    student.profile_pic = target_path;


    //  console.log(" try create student" + student);

    student.save(function(err, student) {
        if (err) {
            //       console.log("already exists");
            res.redirect('/loginOrSignup?signupfail=signup failed');
        } else {
            req.session.student = student;
            //     console.log("success " + student.username + " registered ");
            res.redirect('/myPortfolio');
        }
    })
};

exports.renderLoginPage = function(req, res) {
    if (req.session.student && req.session.student.username) {
        //   console.log("logged in already");
        res.redirect('/myPortfolio');
        return;
    }

    var trial = " ";
    var signupfail = "";
    if (req.query.fail)
        trial = req.query.fail;
    if (req.query.signupfail)
        signupfail = req.query.signupfail;

    res.render('loginOrSignup', { trial, signupfail });
};
exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');

};

exports.loginverify = function(req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
        res.redirect('/loginOrSignup?fail=login failed');
        return;
    }
    var username = req.body.username;
    var password = req.body.password;

    Student.findOne({ 'username': username, 'password': password }, function(err, foundStudent) {
        if (err) res.redirect('/loginOrSignup?fail=login failed');
        else
        if (foundStudent) {
            req.session.student = foundStudent;
            //       console.log("login sucessful " + req.session.student);
            res.redirect('/myPortfolio');
        } else {
            //      console.log("wrong username or passward");
            res.redirect('/loginOrSignup?fail=login failed');
        }


    })

};

exports.getAllStudents = function(req, res) {

    Student.find(function(err, St) {

        var pageSize = 10;
        var currentPage = 1;
        var countPages = Math.ceil(St.length / 10);
        var students = [];
        if (St.length == 0) {
            countPages = 1;
            res.render('index', { students, currentPage, countPages });
        }
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

        var start = (currentPage - 1) * 10;
        for (var i = start; i < St.length && i < start + 10; i++) {
            students.push(St[i]);
        }
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