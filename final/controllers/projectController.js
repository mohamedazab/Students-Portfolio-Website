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
    if (!req.session || !req.session.student) {
        res.redirect('/loginOrSignup');
        return;

    }
    if (!req.body.project_name) {
        res.redirect('\myPortfolio');
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return;
    }
    if (!req.file && !req.body.link) {
        res.redirect('/myPortfolio?already=please upload a file or type a link');
        return;
    }
    var project_name = req.body.project_name;
    var username = req.session.student.username;
    var project;
    if (req.body.checkbox && !req.body.link) {
        if (req.file)
            fs.unlinkSync(req.file.path);
        res.redirect('/myPortfolio?already=please upload a file or type a link');
        return;
    } else
    if (req.body.checkbox && req.body.link) {
        if (req.file)
            fs.unlinkSync(req.file.path);
        project = new Project({ 'username': username, 'project_name': project_name, 'data': req.body.link });
    } else {
        if (!req.body.checkbox && !req.file) {
            res.redirect('/myPortfolio?already=please upload a file or type a link ');
            return;
        } else {
            var tmp_path = req.file.path;

            /* var target_path = 'uploads/' + req.file.originalname;
             var src = fs.createReadStream(tmp_path);
             var dest = fs.createWriteStream(target_path);
             src.pipe(dest);
             fs.unlinkSync(tmp_path);*/
            var target_path = req.file.path;
            ///   console.log("your project path" + target_path);
            project = new Project({ 'username': username, 'project_name': project_name, 'data': target_path });
        }
    }

    Project.find({ 'username': username, 'project_name': project_name }, function(err, projects) {

        if (err)
            res.send(err.message);
        else {

            if (projects.length > 0) {
                // console.log("duplicate project error");
                res.redirect('/myPortfolio?already=already exists');

                return;
            } else {
                // console.log("good to go");
                project.save(function(err, project) {
                    if (err) res.send(err.message);
                    else {
                        res.redirect('/myPortfolio');
                        //      console.log("the new project \n " + project + "\n added ");
                    }
                });

            }
        }
    });


};




exports.getMyProjects = function(req, res) {

    /////////pictures

    if (!req.session || !req.session.student) {
        //   console.log("not logged in");
        res.redirect('loginOrSignup');
        return;

    }
    var already = "";
    if (req.query.already)
        already = req.query.already;
    var username = req.session.student.username
    var profilePic = req.session.student.profile_pic;
    var description = req.session.student.description;
    // console.log("your profile pic : " + profilePic);
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
            //  console.log("I found :" + foundStudent.username);
            profilePic = foundStudent.profile_pic;
            description = foundStudent.description;

            //  console.log("his profile pic : " + profilePic);
            //  console.log("his profile description :" + description);
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
    if (!req.session || !req.session.student || !req.session.student.username || !req.query.project_name) {
        //  console.log("not logged in");
        res.redirect('loginOrSignup');
        return;

    }

    var username = req.session.student.username;
    var tmp_path = "";
    //  console.log("try delete " + username + " for " + req.query.project_name);
    Project.findOne({ 'username': username, 'project_name': req.query.project_name }, function(err, foundproject) {
        //    console.log("i found " + foundproject);
        if (foundproject == null) {
            res.redirect('/');
            return;
        }
        tmp_path = foundproject.data;
        //   console.log("try to unlink the file " + tmp_path);

        Project.remove({
            'username': username,
            'project_name': req.query.project_name
        }, function(err, projects) {
            if (err)
                res.send(err.message);
            else {
                //    console.log("check substr " + projects);
                if (tmp_path.substring(0, 7) == "uploads") {
                    //        console.log("condition ok");
                    fs.unlinkSync(tmp_path);
                }
                //    console.log("redirect after delete");
                res.redirect('/myPortfolio');
            }
        });

    });


};

exports.searchProjects = function(req, res) {

    if (!req.body.project_name) {
        res.redirect('/');
        return;
    }
    var projectName = req.body.project_name;
    var result = "";
    Project.find({ 'project_name': { $regex: ".*" + projectName + ".*" } }, function(err, projects) {
        if (err) res.redirect('/');
        else {
            if (projects.length == 0) result = "No results";

            res.render('search', { projects, result });
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