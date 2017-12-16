var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var Captcha = require('../../middlewares/Captcha');
var async = require("async");
var otpObj = require('../../middlewares/Otp');
var mailObj = require('../../middlewares/Mail');
var validator = require('validator');
var extraVar = [];
var viewDirectory = 'users';
var modelName = 'User';
var titleName = 'users';

extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;

router.get('/', function (req, res, next) {

//    res.render('front/' + viewDirectory + '/home');
    res.redirect('register');
});

router.get('/register', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/admin/dashboard');
    } else {
        async.parallel({
            roles: function (callback) {
                req.where = {is_front_registration: 1, is_active: 1}
                models.Role.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            captcha: function (callback) {
                Captcha.CaptchaGenerator(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            res.render('front/' + viewDirectory + '/register', {results: results, extraVar: extraVar, layout: 'front/layout/homeLayout'});
        });
    }
});

router.get('/form', function (req, res, next) {
    async.parallel({
        roles: function (callback) {
//            req.where = {is_front_registration: 1, is_active: 1}
//            models.Role.getAllValues(req, function (data) {
//                callback(null, data);
            callback(null, '');
//            });
        }
    }, function (err, results) {
        res.render('front/' + viewDirectory + '/form', {results: results, extraVar: extraVar});
    });
//    res.render('front/' + viewDirectory + '/register', {layout: 'front/layout/homeLayout'});
});

router.post('/signup', function (req, res, next) {
    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            if (req.body.role_id == 3) {
                req.body.role_type_id = 38;
            }
            if (typeof req.body.role_type_id == "undefined") {
                req.body.role_type_id = '';
            }
            console.log("==================>>>>>>>>>>>>>")
            console.log(req.body)
            console.log(req.session[req.body.current_time_stamp])
            console.log("==================>>>>>>>>>>>>>")
            req.body.captcha_ans = req.session[req.body.current_time_stamp];
            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {

                    modelBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null, errors);
                        } else {
                            callback(null, errors);
                        }

                    });
                }], function (err) {

                if (errors.length == 0) {
                    
                    delete req.session[req.body.current_time_stamp];
                    var digitMobile = Math.floor((Math.random() * 1000000));
                    var otpMsgMobile = 'your otp is ' + digitMobile;

                    var digitEmail = Math.floor((Math.random() * 1000000));
                    var otpMsgEmail = digitEmail;

                    req.body.otp_mobile = digitMobile;
                    req.body.otp_email = digitEmail;
                    console.log(req.body);
                    models[modelName].registration(req, function (results) {
                        if (results.status) {
                            //var msgDateMobile = {otpMsg: otpMsgMobile, mobile: req.body.mobile}
                            //otpObj.sendOtpMessage(msgDateMobile);


                            /* ------------------- Dynamic Mobile startssssssssssssssssssssss ----------------- */
                            var fields_to_be_replaced_4mobile = {
                                mobile_otp: digitMobile
                            }
                            var otp_option = {
                                mobile: req.body.mobile
                            }
                            var mobile_template_slug = "registration_mobile_otp",
                                    values_to_be_replaced = fields_to_be_replaced_4mobile,
                                    otp_options = otp_option;
                            otpObj.dynamicMobileMsg(mobile_template_slug, values_to_be_replaced, otp_options);
                            /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

                            // var otp = 'Your email OTP is : ' + otpMsgEmail;
                            // var mailData = {email: req.body.email, subject: "Welcome to Nat", list: {name: req.body.first_name, email: req.body.email, password: req.body.password, link: otp}};
                            // mailObj.resendOtpMail(mailData);


                            /* ------------------- Dynamic Email startssssssssssssssssssssss ----------------- */
                            var fields_to_be_replaced = {
                                user_name: results.first_name,
                                email_otp: otpMsgEmail,
                                user_email: results.email,
                                user_password: req.body.password
                            }
                            var mail_option = {
                                to: results.email
                            }
                            var email_template_slug = "registration_template",
                                    values_to_be_replaced = fields_to_be_replaced,
                                    mail_options = mail_option;
                            mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                            /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

                            res.status(200).send({status: true, url: '/' + viewDirectory + '/otp', user_id: results.id, msg: 'We have sent OTP on your mobile number and email. Please verify email & Mobile number.'});
                        } else {
                            res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                        }
                    });

                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
});


router.get('/professional', function (req, res, next) {
    async.parallel({
        role_types: function (callback) {
            req.where = {role_id: 1, is_active: 1, is_front_registration: 1}
            models.RoleType.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        console.log(results);
        res.render('front/' + viewDirectory + '/professional', {results: results, extraVar: extraVar, layout: false});
    });
//    res.render('front/' + viewDirectory + '/register', {layout: 'front/layout/homeLayout'});
});

router.get('/service_provider', function (req, res, next) {
    async.parallel({
        role_types: function (callback) {
            req.where = {role_id: 2, is_active: 1, is_front_registration: 1}
            models.RoleType.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        console.log(results);
        res.render('front/' + viewDirectory + '/service_provider', {results: results, extraVar: extraVar, layout: false});
    });
//    res.render('front/' + viewDirectory + '/register', {layout: 'front/layout/homeLayout'});
});

router.get('/other', function (req, res, next) {
    async.parallel({
//        role_types: function (callback) {
//            req.where = {role_id: 1}
//            models.RoleType.getAllValues(req, function (data) {
//                callback(null, data);
//            });
//        }
    }, function (err, results) {
        console.log(results);
        res.render('front/' + viewDirectory + '/other', {results: results, extraVar: extraVar, layout: false});
    });
//    res.render('front/' + viewDirectory + '/register', {layout: 'front/layout/homeLayout'});
});

router.post('/otp', function (req, res, next) {
    res.render('front/' + viewDirectory + '/otp', {results: req.body, layout: false});
});

router.get('/login', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/admin/dashboard');
    } else {
        res.render('front/' + viewDirectory + '/login', {});
    }
});

router.get('/forgot-password', function (req, res, next) {
    res.render('front/' + viewDirectory + '/forgot_password', {});
});

router.post('/forgot-password', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            if (validator.isEmail(req.body.email)) {
                req.where = {email: req.body.email}
                models[modelName].getFirstValues(req, function (results) {
                    if (results) {
                        /* ------------------- Dynamic Email startssssssssssssssssssssss ----------------- */
                        var generate_random_key = Math.floor((Math.random() * 1000000));
                        var reset_password_link = req.protocol + '://' + req.get('host') + '/users/reset-password/' + generate_random_key;
                        var fields_to_be_replaced = {
                            user_name: results.first_name,
                            reset_password_link: reset_password_link
                        }
                        var mail_option = {
                            to: results.email
                        }
                        var email_template_slug = "forgot_password",
                                values_to_be_replaced = fields_to_be_replaced,
                                mail_options = mail_option;
                        mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                        /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

                        var val_to_be_update = {}
                        val_to_be_update.update = {reset_password_token: generate_random_key};
                        val_to_be_update.where = {email: results.email};
                        models[modelName].updateValues(val_to_be_update, function (sttt) {
                            res.status(200).send({status: true, msg: 'Reset password link has been sent to your email. Please check.', data: []});
                        })
                    } else {
                        res.status(201).send({status: false, msg: 'This email is not registered with Nyaya Portal.', data: []});
                    }
                })
            } else {
                res.status(201).send({status: false, msg: 'Please enter a valid email', data: []});
            }
        }
    });
});

router.get('/reset-password/:reset_password_token', function (req, res, next) {
    if (typeof req.user !== 'undefined') {
        res.redirect('/admin/dashboard');
    }

    req.where = {reset_password_token: req.params.reset_password_token}
    if (req.params.reset_password_token) {
        models[modelName].getFirstValues(req, function (results) {
            if (results) {
                res.render('front/' + viewDirectory + '/reset_password', {token: req.params.reset_password_token});
            } else {
                req.flash('type_messages', 'info');
                req.flash('messages', 'Invalid token or token has been expired');
                res.redirect('/users/register');
            }
        })
    } else {
        res.redirect('/users/register');
    }
});

router.post('/reset-password', function (req, res, next) {
    console.log("--------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    console.log(req.body)
    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            console.log("------------------------- BODY ---------------------------------------------->>>>>>>>>>>>>>>>>>>>")
            console.log(req.body)
            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {
                    modelBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null, errors);
                        } else {
                            callback(null, errors);
                        }

                    });
                }], function (err) {

                if (errors.length == 0) {
                    console.log("--------------- errors ----------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>")
                    console.log(errors)

                    var val_to_be_update = {}
                    val_to_be_update.update = {password: req.body.password, reset_password_token: ''};
                    val_to_be_update.where = {reset_password_token: req.body.reset_password_token};
                    models[modelName].updateValues(val_to_be_update, function (status) {
                        res.status(200).send({status: true, msg: 'Your password has been updated. Now you can login with your new password.', url: '/' + viewDirectory + '/login'});
                    })

                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }
    })
});



module.exports = router;
