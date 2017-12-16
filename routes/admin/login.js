var models = require('../../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
//router.use(adminAuth.isAdmin);
var viewDirectory = 'users';
var modelName = 'User';
var titleName = 'User';

var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;
/* GET users listing. */

router.get('/', function (req, res, next) {
    if (req.session.varifyOtp == 'yes') {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Verification process completed successfully. please login your account');
    }
    req.session.varifyOtp = '';
    if (req.isAuthenticated()) {
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/users/login', {layout: false});
    }
});

router.get('/login', function (req, res, next) {

    if (req.isAuthenticated()) {
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/users/login', {layout: false});
    }
});


router.get('/logout', function (req, res, next) {
    req.logout();
    req.session.destroy();
    req.app.locals.loginUser = false;
    res.redirect('/users/login');

//    req.session.destroy(function (err) {
//        res.redirect('/'); //Inside a callback… bulletproof!
//    });


//    if (!req.isAuthenticated()) {
//
//        if (req.user.user_type.role_id == 4) {
//            req.logout();
//            res.redirect('/users/login');
//        } else {
//            req.logout();
//            res.redirect('/users/login');
//        }
//    } else {
//        res.redirect('/users/login');
//    }

});

router.post('/login', function (req, res, next) {

    passport.authenticate('local-login', function (err, user, info) {
        //console.log('user', user, err)
        if (err) {
            return next(err);
        }
        if (!user) {
            //return res.redirect('/login');
            res.status(201).send({status: false, msg: "Invalid email or password", data: []});
        } else {
            if (user.is_complete_registration == 1 && user.is_active == 0) {
                res.status(201).send({status: false, msg: 'Your account is inactive. Contact your administrator to activate it.', data: []});
            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        //return next(err); 
                        //console.log(err);
                    }
                    res.status(201).send({status: true, msg: 'login done', 'url': 'dashboard', data: []});
                });

            }
        }

    })(req, res, next);
    // res.send('qwew');
    //res.render('admin/users/login', { layout: false });
});



module.exports = router;
