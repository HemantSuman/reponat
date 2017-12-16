var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var mailObj = require('../../middlewares/Mail');

var extraVar = [];
var viewDirectory = 'franchise_requests';
var modelName = 'FranchiseRequest';
var titleName = 'Authorized Promoter';

extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;

router.post('/create', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            req.body.captcha_ans = req.session[req.body.current_time_stamp]
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
                    models[modelName].saveAllValues(req, function (results) {
                        if (results.status) {
                            res.status(200).send({status: true, url: '/request-for-franchise', msg: 'Your Authorized Promoter Request has been submitted successfully. Nyaya Portal Executive will contact you soon. Thank You !!'});
                        } else {
                            res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                        }
                    });
                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
});

module.exports = router;
