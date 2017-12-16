var models = require('../../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
// var adminPassport = new Passport();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

router.use(adminAuth.isAdmin);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin/home/dashboard', {title: 'Express', layout: 'admin/layout/layout'});
//    res.render('admin/users/login', { title: 'Express' });
//  res.send('respond with a resource 12121');
});

router.get('/users/login', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/admin/home/dashboard');
    } else {
        res.render('admin/users/login', {layout: false});
    }
});

router.get('/users/logout', function (req, res, next) {
    req.logout();
    res.redirect('/admin/users/login');
});

router.get('/home/dashboard', function (req, res, next) {
    res.render('admin/home/dashboard', {title: 'Express', layout: 'admin/layout/layout'});
});

router.get('/users/add', function (req, res, next) {

    async.parallel({
//        countries: function (callback) {
//            var where = {'is_active': 1}
//            models.Country.getAllValues(where, function (data) {
//                callback(null, data);
//            });
//        },
//        roles: function (callback) {
//            var where = {'is_active': 1}
//            models.Role.getAllValues(where, function (data) {
//                callback(null, data);
//            });
//        }
    }, function (err, results) {
        res.render('admin/users/add', {results: results, layout: 'admin/layout/layout'});
    });

});

router.get('/users', function (req, res, next) {
    models.User.getAllValuesPaging(req, function (results) {
        res.render('admin/users/index', {results: results, layout: 'admin/layout/layout'})
    });
});
router.post('/users/create', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        console.log('req.body44444');
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        console.log(req.body);
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            var usr = models.User.build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {

                    usr.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null, errors);
                        } else {
                            callback(null, errors);
                        }

                    });
                }], function (err) {

                if (errors.length == 0) {

                    models.User.create(req.body).then(function (data) {
                        req.flash('type_messages', 'success');
                        req.flash('messages', 'Added succrssfully!');
                        res.status(200).send({status: true, url: '/admin/users'});
//                    res.redirect('/register/otp');
                    });

                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });

//            models.User.create(req.body, function (results) {
//                if (results.status) {
//                    req.flash('messages', 'sucessssss');
//                    res.semd(400);
//                    //res.status(200).send({status:true, url:'/admin/users'});
//                } else {
//                    console.log(results);
//                    res.status(400).send({results: results.errors});
//                }
//            });
        }

    });

    console.log(req.body);
//    res.send('3333');
    // res.render('admin/users/add', { results: results, layout:'admin/layout/layout' });
});

router.post('/users/login', function (req, res, next) {

    passport.authenticate('local-login', function (err, user, info) {
        console.log('user', user, err)
        if (err) {
            return next(err);
        }
        if (!user) {
            //return res.redirect('/login');
            res.status(201).send({status: false, msg: "Invalid email or password11", data: []});
        } else {

            req.logIn(user, function (err) {
                if (err) {
                    //return next(err); 
                    //console.log(err);
                }
//                res.redirect('admin/home/dashboard');
                res.status(201).send({status: true, msg: 'login done11', 'url': 'home/dashboard', data: []});
            });

        }

    })(req, res, next);
    // res.send('qwew');
    //res.render('admin/users/login', { layout: false });
});

module.exports = router;
