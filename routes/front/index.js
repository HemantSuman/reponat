var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var mailObj = require('../../middlewares/Mail');
var ProductMail = require('../../middlewares/ProductMail');
var Captcha = require('../../middlewares/Captcha');
var moment = require("moment");
//var extraVar = [];
var viewDirectory = 'homes';
//var modelName = 'State';
//var titleName = 'States';
//
//extraVar['modelName'] = modelName;
//extraVar['viewDirectory'] = viewDirectory;
//extraVar['titleName'] = titleName;

router.get('/acadonia', function (req, res, next) {

res.redirect('https://acadonia.com/my-class');

});

/* GET users listing. */
router.get('/', function (req, res, next) {
    
    async.parallel({
        news: function (callback) {
            req.where = {is_active: 1}
            models.News.getFirstValues(req, function (data) {
                callback(null, data);
            });
        },
    }, function (err, results) {
        //    res.render('front/' + viewDirectory + '/demo',{layout:false});
        res.render('front/' + viewDirectory + '/home', {results: results});
    });
});

router.get('/home', function (req, res, next) {
    res.render('front/' + viewDirectory + '/home');
})

router.get('/login', function (req, res, next) {
    res.render('admin/users/front_login', {layout: false});
});

router.get('/request-for-franchise', function (req, res, next) {
    async.parallel({
        country: function (callback) {
            req.where = {is_active: 1}
            models.Country.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        states: function (callback) {
            req.where = {country_id: 1, is_active: 1}
            models.State.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        captcha: function (callback) {
            Captcha.CaptchaGenerator(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //results['states'] = [];
        results['divisions'] = [];
        results['districts'] = [];
        results['tehsils'] = [];

        res.render('front/users/request_franchise', {data: results});
    });
});

router.get('/request-for-authorized-promoter', function (req, res, next) {
    async.parallel({
        country: function (callback) {
            req.where = {is_active: 1}
            models.Country.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        states: function (callback) {
            req.where = {country_id: 1, is_active: 1}
            models.State.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        captcha: function (callback) {
            Captcha.CaptchaGenerator(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //results['states'] = [];
        results['divisions'] = [];
        results['districts'] = [];
        results['tehsils'] = [];

        res.render('front/users/request_franchise', {data: results});
    });
});

router.get('/commision_distribution_mail', function (req, res, next) {
    ProductMail.sendMail(1, "nc", "offline", "all");
});

router.get('/party_mail', function (req, res, next) {
    ProductMail.sendMail(165, "nc", "online", "parties");
});


router.get('/mapping/:user_id/:otp', function (req, res, next) {


    var userFrId = new Buffer(req.params.user_id, 'base64').toString('ascii');
    var sendOtp = new Buffer(req.params.otp, 'base64').toString('ascii');

    dataArrNew = userFrId.split('_');

    var user_id = dataArrNew[0];
    var franchise_id = dataArrNew[1];


    models['Franchise'].getById(user_id, function (userData) {

        console.log("------------->>>>>))))))))))))))))))))))))))))))) userDatauserDatauserDatauserDatauserData")
        console.log(userData)

        var getUserData = userData;
        //console.log(userData);




        if (userData && userData.otp_email == req.params.otp) {

            var currentDate = moment().format("DD-MM-YYYY");

            req.where = {id: user_id};
            //req.update = {otp_mobile: '', franchise_id: req.user.id, franchise_date: currentDate};
            req.update = {otp_email: ''};

            models['User'].updateOtp(req, function (results) {

                if (userData.user_roles_type.user_roles.role_slug != 'professional') {
                    var user_franchises_data = {body: {user_id: user_id, franchise_id: franchise_id}}
                    models['UserFranchise'].saveAllValues(user_franchises_data, function (userData) {
                        res.render('front/pages/mapping', {msg: 'For local assistance, better services and convenience at Nyaya portal, you are requested to direct your queries to your new Authorised Promoter .'});
                    })
                } else {
                    var user_franchises_data = {
                        body: {
                            franchise_id: franchise_id
                        },
                        where: {
                            user_id: user_id,
                            franchise_id: req.app.locals.settingData.admin_ap
                        }
                    }

                    models['UserFranchise'].updateValues(user_franchises_data, function (userData) {

                        var reqWhere = {};
                        reqWhere.where = {id: franchise_id};
                        models['User'].getFirstValues(reqWhere, function (getAPData) {
                            var fields_to_be_replaced = {
                                user_name: getUserData.first_name,
                                authorized_promoter_name: getAPData.first_name,
                                authorized_promoterr_name: getAPData.first_name,
                                authorized_promoter_address: getAPData.residence_address,
                                authorized_promoter_mobile_number: getAPData.mobile,
                                customer_support_details: req.app.locals.settingData.contact_us
                            }
                            var mail_option = {
                                to: getUserData.email
                            }
                            var email_template_slug = "after_mapped_by_ap",
                                    values_to_be_replaced = fields_to_be_replaced,
                                    mail_options = mail_option;
                            mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                            console.log("------------------ mail fired <<<<<<?????????????????????????????????????????????????????/**/")

                            res.render('front/pages/mapping', {msg: 'Thanks for associating as your authorized promoter. You can contact him at his mobile no. any time.'});
                        })

                    })
                }
            });


//            if (typeof req.body.type != "undefined" && req.body.type == "deed-writer") {
//                var redirectUrl = '/admin/franchises/list-deed-writer'
//
//                models['User'].updateOtp(req, function (results) {
//                    var user_franchises_data = {body: {user_id: user_id, franchise_id: franchise_id}}
//                    models['UserFranchise'].saveAllValues(user_franchises_data, function (userData) {
//                        res.status(200).send({status: true, msg: '', data: {url: redirectUrl}});
//                    })
//                });
//            } else {
//                var redirectUrl = '/admin/franchises/list-user'
//                models['User'].updateOtp(req, function (results) {
//                    var user_franchises_data = {
//                        body: {
//                            franchise_id: req.user.id
//                        },
//                        where: {
//                            user_id: req.body.id,
//                            franchise_id: req.app.locals.settingData.admin_ap
//                        }
//                    }
//                    models['UserFranchise'].updateValues(user_franchises_data, function (userData) {
//                        res.status(200).send({status: true, msg: '', data: {url: redirectUrl}});
//                    })
//                });
//            }
        } else {
            //res.status(200).send({status: false, msg: 'Invalid OTP', data: []});
            res.render('front/pages/mapping', {msg: 'Your link has been expired'});
        }


    });




});


router.get('/mapping-ap/:user_id/:otp', function (req, res, next) {


//     var fields_to_be_replaced = {
//        user_name: dataValues.first_name,
//        product_number: product_number,
//        product_creation_date: product_creation_date,
//        amount: product_amount,
//        parties_name: parties_names,
//        incentive_amount: dataValues.final_commission,
//        last_4_digits_of_account_number: dataValues.last_4_digits_of_account_number,
//        service_provider_name: dataValues.first_name,
//        product_type: product_type,
//        stamp_number: stamp_number
//    }
//
//    
//    if (dataValues.id == dataValues.ar_user_id) {
//        emailTemplateSlug += "_creator";
//    }
//
//    var mail_option = {
//        to: dataValues.email
//                //to: "sagar.jajoriya@planetwebsolution.com"
//    }
//
//    mailObj.dynamicEmailMsg('after_mapped_by_ap', values_to_be_replaced, mail_options);


    var userFrId = new Buffer(req.params.user_id, 'base64').toString('ascii');
    var sendOtp = new Buffer(req.params.otp, 'base64').toString('ascii');

    dataArrNew = userFrId.split('_');

    var user_id = dataArrNew[0];
    var franchise_id = dataArrNew[1];

    console.log(user_id, franchise_id);
    models['Franchise'].getById(user_id, function (userData) {

        console.log(userData);

        if (userData && userData.otp_email_ap == req.params.otp && userData.is_complete_registration == 1) {

            var currentDate = moment().format("DD-MM-YYYY");

            req.where = {id: user_id};
            //req.update = {otp_mobile: '', franchise_id: req.user.id, franchise_date: currentDate};
            req.update = {otp_email_ap: ''};


            models['User'].updateOtp(req, function (results) {

                if (userData.user_roles_type.user_roles.role_slug != 'professional') {
                    var user_franchises_data = {body: {user_id: user_id, franchise_id: franchise_id}}
                    models['UserFranchise'].saveAllValues(user_franchises_data, function (userData) {
                        res.render('front/pages/mapping', {msg: 'Thanks for associating as your authorized promoter. You can contact him at his mobile no. any time.'});
                    })
                } else {
                    var user_franchises_data = {
                        body: {
                            franchise_id: franchise_id
                        },
                        where: {
                            user_id: user_id,
                            franchise_id: req.app.locals.settingData.admin_ap
                        }
                    }
                    models['UserFranchise'].updateValues(user_franchises_data, function (userData) {
                        res.render('front/pages/mapping', {msg: 'Thanks for associating as your authorized promoter. You can contact him at his mobile no. any time.'});
                    })
                }
            });

        } else {
            if (userData.is_complete_registration != 1) {
                res.render('front/pages/mapping', {msg: 'Please complete your profile.'});
            } else {
                res.render('front/pages/mapping', {msg: 'Your link has been expired'});
            }
        }


    });




});


module.exports = router;
