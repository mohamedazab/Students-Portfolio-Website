var Project = require('../models/Project');
var Student = require('../models/Student');
//multer
var multer = require('multer');
var upload = multer({ dest: 'uploads' });
var type = upload.single('data');
//

// file system
var fs = require('fs');

///duplicates
exports.createProject = function(req, res, type) {
    console.log(req.body);
    console.log(req.body.checkbox);
    if (!req.session || !req.session.student) {
        res.redirect('/loginOrSignup');
        return;

    }
    var project_name = req.body.project_name;
    var username = req.session.student.username;
    var project;
    if (req.body.checkbox && !req.body.link) {
        if (req.file)
            fs.unlinkSync(req.file.path);
        res.redirect('/myPortfolio');
        return;
    } else
    if (req.body.checkbox && req.body.link) {
        if (req.file)
            fs.unlinkSync(req.file.path);
        project = new Project({ 'username': username, 'project_name': project_name, 'data': req.body.link });
    } else {
        if (!req.file) {
            res.redirect('/myPortfolio');
        } else {
            var tmp_path = req.file.path;

            /* var target_path = 'uploads/' + req.file.originalname;
             var src = fs.createReadStream(tmp_path);
             var dest = fs.createWriteStream(target_path);
             src.pipe(dest);
             fs.unlinkSync(tmp_path);*/
            var target_path = req.file.path;
            project = new Project({ 'username': username, 'project_name': project_name, 'data': target_path });
        }
    }

    Project.find({ 'username': username, 'project_name': project_name }, function(err, projects) {

        if (err)
            res.send(err.message);
        else {

            if (projects.length > 0) {
                console.log("heha");
                res.redirect('/myPortfolio?already=already exists');

                return;
            } else {
                console.log("good to go");
                project.save(function(err, project) {
                    if (err) res.send(err.message);
                    else {
                        res.redirect('/myPortfolio');
                        console.log("new project  for\n " + project + "\n added ");
                    }
                });

            }
        }
    });


};

/*exports.getAllProjects = function(req, res) {
    //find and loop on students get highest 2
    console.log("get all projects   " + req.session);


    Project.find(function(err, projects) {

        if (err)
            res.send(err.message);
        else {
            if (!req.session || !req.session.student)
                res.render('index', { projects });
            else
                res.render('loggedIn', { projects });
        }
    })
};*/


exports.getMyProjects = function(req, res) {

    /////////pictures

    if (!req.session || !req.session.student) {
        console.log("not logged in");
        res.redirect('loginOrSignup');

    }
    var already = "";
    if (req.query.already)
        already = req.query.already;
    var username = req.session.student.username
    var profilePic = req.session.student.profile_pic;
    var description = req.session.student.description;
    console.log(profilePic);
    Project.find({ 'username': username }, function(err, projects) {

        if (err)
            res.send(err.message);
        else
            res.render('myPortfolio', { projects, profilePic, username, description, already });
    })
};


exports.viewProfile = function(req, res) {

    var username = req.query.name;
    var profilePic = "";
    var description = "";
    Student.findOne({ 'username': username }, function(err, foundStudent) {
        if (err) res.send(err.message);
        else
        if (foundStudent) {
            console.log(foundStudent);
            profilePic = foundStudent.profile_pic;
            description = foundStudent.description;

            console.log("yes   " + profilePic);
            console.log(description);
        } else {

        }


    })

    Project.find({ 'username': username }, function(err, projects) {

        if (err)
            res.send(err.message);
        else
        // res.send(projects);
        if (!req.session || !req.session.student)
            res.render('viewProfile', { projects, profilePic, username, description });
        else
        if (req.session.student.username == username)
            res.redirect('/myPortfolio');
        else
            res.render('viewProfileLoggedIn', { projects, profilePic, username, description });
    })



};





exports.deleteProject = function(req, res) {


    //check iff username and password matches
    if (!req.session || !req.session.student || !req.query.project_name) {
        console.log("not logged in");
        res.redirect('loginOrSignup');
        return;

    }

    var username = req.session.student.username;
    var tmp_path = "";
    console.log("ready");
    Project.findOne({ 'username': username }, function(err, foundproject) {
        console.log("i found " + foundproject);
        tmp_path = foundproject.data;

    });

    Project.remove({
        'username': username,
        'project_name': req.query.project_name
    }, function(err, projects) {
        //console.log(projects);
        if (err)
            res.send(err.message);
        else {
            if (tmp_path.substring(0, 7) == "uploads") {
                fs.unlinkSync(tmp_path);
            }

            res.redirect('/myPortfolio');
        }
    })

};
/*

exports.updateProject = function(req, res) {
    let Nproject = new project(req.body);
    //check iff username and password matches


    project.save(function(err, project) {
        if (err) res.send(err.message);
        else
            res.send("updated " + Nproject.Mail + "  ");



    })
};

*/
exports.searchProjects = function(req, res) {


    var projectName = req.body.project_name;

    Project.find({ 'project_name': { $regex: ".*" + projectName + ".*" } }, function(err, projects) {
        if (err) res.send(err.message);
        else
            res.render('search', { projects });

    })
};