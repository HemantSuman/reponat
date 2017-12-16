var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var otpObj = require('../../middlewares/Otp');
router.use(adminAuth.isAdmin);
var viewDirectory = 'freeze_deals';
var modelName = 'FreezeDeal';
var titleName = 'FreezeDeal';

var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;
/* GET users listing. */

router.get('/', function (req, res, next) {

    var limit = req.app.locals.site.pageLimit;
    var currentPage = 1;
    var offset = 1;
    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }

    extraVar['currentPage'] = currentPage;
    extraVar['next'] = currentPage + 1;
    extraVar['pre'] = currentPage - 1;
    req.where = {user_id: req.user.id};
    req.offset = offset;
    req.limit = limit;

    var serObj = {}
    var searchStr = '';
    sechStr = '';
    async.forEachOf(req.query, function (getData, key, callback) {

        if (key == 'msg_type') {
            return false;
        }

        if (key == 'deal_status' && (getData == 3 || getData == 0)) {
            return false;
        }

        if (key != 'page') {
            searchStr += '&' + key + '=' + getData;
        }

        if (getData != '' && key != 'page') {
            serObj[key] = {$like: '%' + getData + '%'};
            sechStr += ' and ' + key + ' like "%' + getData + '%"';
        }

    });

    console.log('searchStr____________________');
    console.log(searchStr);
    console.log('searchStr____________________');

    extraVar['searchStr'] = searchStr;

    console.log('================================');
    console.log(sechStr);
    console.log('================================');

    req.where = sechStr;

    models[modelName].getAllValues(req, function (results) {

        extraVar['query'] = req.query;
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        //console.log(extraVar);
        //res.send(results);
        extraVar['titleName'] = 'Freeze Deals';
        if (req.query && req.query.msg_type == 'done') {
            console.log(req.query)
            var msg = 'Added successfully';
            req.flash('type_messages', 'success');
            req.flash('messages', msg);
        }
        res.render('admin/' + viewDirectory + '/index', {results: results, layout: 'admin/layout/layout', extraVar: extraVar, srchData: req.query, flsh: req.query.msg_type});
    }, function (err, resultSearch) {
        //res.send(results);
    });
});



router.get('/add', function (req, res, next) {

    async.parallel({
        professional: function (callback) {
            req.where = {is_active: 1}
            models.ServiceDetail.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: []});
    });
});



router.post('/create', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }

        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            //console.log(req.body);
            req.body.chkNo = req.user.mobile;
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
                console.log('errors-------------------')
                console.log(errors)

                if (errors.length == 0) {
                    console.log(req.body);
                    var sendOtp = Math.floor((Math.random() * 1000000));
                    var otpMsgMobile = 'Your mobile OTP is : ' + sendOtp;

                    var msgDateMobile = {otpMsg: otpMsgMobile, mobile: req.body.party_mobile_no}

                    //otpObj.sendOtpMessage(msgDateMobile);

                    /* ----------------------------------- Send sms --------------------------------- */
                    var fields_to_be_replaced_4mobile = {
                        stamp_number: req.body.stamp_no,
                        profession_name: req.user.user_type.role_type_name,
                        professional_name: req.user.first_name,
                        mobile_otp: sendOtp
                    }
                    var otp_option = {
                        mobile: req.body.party_mobile_no
                    }
                    var mobile_template_slug = "freeze_deal",
                            values_to_be_replaced = fields_to_be_replaced_4mobile,
                            otp_options = otp_option;
                    otpObj.dynamicMobileMsg(mobile_template_slug, values_to_be_replaced, otp_options);
                    /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

                    req.body.otp = sendOtp;


                    models[modelName].saveAllValues(req, function (results) {

                        console.log('ooooooooooooooooo')
                        console.log(results);

                        if (results.status) {

                            var msg = 'Added successfully';

                            //req.flash('type_messages', 'success');
                            //req.flash('messages', msg);
                            res.status(200).send({status: true, url: '/admin/freeze-deal', data: results.id});
                        } else {
                            res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                        }
                    });



                } else {
                    res.status(400).send({status: false, msg: ' saved failed', data: errors});
                }
            });
        }

    });

});



router.post('/confirm_otp', function (req, res, next) {
    console.log('000-------------');
    console.log(req.body);

    models[modelName].getById(req.body.id, function (userData) {

        if (userData && userData.otp == req.body.otp) {
            req.where = {id: req.body.id};
            req.update = {verify: 1, otp: ''}
            models[modelName].changeStatus(req, function (results) {
                res.status(200).send({status: true, msg: '', data: []});
            });

        } else {

            res.status(200).send({status: false, msg: 'Invalid OTP', data: []});
        }


    });
});



router.post('/resendOtp', function (req, res, next) {

    models[modelName].getById(req.body.id, function (userData) {
        console.log('=--=-=--=-=-==-==-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=');
        console.log(userData);

        var sendOtp = Math.floor((Math.random() * 1000000));
        req.updateObj = {otp_mobile: sendOtp};
        var otpMsgMobile = 'your otp is ' + sendOtp;

        /* ----------------------------------- Send sms --------------------------------- */
        var fields_to_be_replaced_4mobile = {
            stamp_number: userData.stamp_no,
            profession_name: req.user.user_type.role_type_name,
            professional_name: req.user.first_name,
            mobile_otp: sendOtp
        }
        var otp_option = {
            mobile: userData.party_mobile_no
        }
        var mobile_template_slug = "freeze_deal",
                values_to_be_replaced = fields_to_be_replaced_4mobile,
                otp_options = otp_option;
        otpObj.dynamicMobileMsg(mobile_template_slug, values_to_be_replaced, otp_options);
        /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

        var msgDateMobile = {otpMsg: otpMsgMobile, mobile: userData.party_mobile_no}
        //otpObj.sendOtpMessage(msgDateMobile);
        var msg = 'OTP send successfully on your registerd mobile number!';


        req.where = {id: req.body.id};
        req.update = {otp: sendOtp}
        models[modelName].changeStatus(req, function (results) {
            res.status(200).send({status: true, msg: msg, data: []});
        });
    });

});




module.exports = router;
