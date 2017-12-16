var models = require('../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../middlewares/Auth');
var ImageUpload = require('../middlewares/ImageUpload');
var async = require("async");

/* GET users listing. */
router.post('/get-db-values', function (req, res, next) {

    req.where = {};

    var whereColumn = JSON.parse(req.body.whereColumn);
    var whereValues = JSON.parse(req.body.whereValues);

    if (whereColumn.length > 0) {
        
        console.log(whereValues);
        async.eachSeries(whereColumn, function (ColumnName, callback) {

            var index = whereColumn.indexOf(ColumnName);
            
//            req.where[ColumnName] = whereValues[index].toString().split('#@#!')[0];
            req.where[ColumnName] = whereValues[index];
            console.log(req.where);
            callback();
        }, function (err) {
            if (err) {
                console.log('failed to process');
            } else {
                models[req.body.modelName].getAllValues(req, function (results) {
                    res.send(results)
                });
            }
        });
    }

//    models[modelName].getAllValuesPaging(req, function (results) {
//        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
//    });
});


router.post('/confirm_otp', function (req, res, next) {

    models['User'].confirmOtp(req, function (results) {
            res.send(results)
//        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});


router.post('/loadAgreementTypeContent', function (req, res) {
    req.body.where = {};
    if (typeof req.body.is_active != 'undefined') {
        req.body.where.is_active = req.body.is_active
    };
    var data = {};
    var modelNamesArray = req.body.modelNames.split(',');
    var renderTemplate = req.body.renderTemplate;
    var party_no = req.body.party_no;
    var member_no = req.body.member_no;
    var partynotitlecount = req.body.partynotitlecount;

    console.log('req.body%^^^^^^^^^^^^^^^^^')
    console.log(req.body)

    async.parallel({
        countries: function (callback) {
            if (modelNamesArray.indexOf('countries') >= 0) {
                models['Country'].getAllValues(req, function (data) {
                    callback(null, data);
                });
            } else {
                callback(null, true);
            }

        },
        states: function (callback) {
            if (modelNamesArray.indexOf('states') >= 0) {
                req.where = {is_active: 1, country_id: 1}
                models['State'].getAllValues(req, function (data) {
                    callback(null, data);
                });
            } else {
                callback(null, true);
            }

        },
        states_is_business: function (callback) {
            if (modelNamesArray.indexOf('states_is_business') >= 0) {
                req.where = {is_active: 1, is_business_available: 1}
                models['State'].getAllValues(req, function (data) {
                    callback(null, data);
                });
            } else {
                callback(null, true);
            }

        },
        roles: function (callback) {
            if (modelNamesArray.indexOf('roles') >= 0) {
                req.where = {is_active: 1, is_display_argreement_form: 1}
                models['Role'].getAllValues(req, function (data) {
                    callback(null, data);
                });
            } else {
                callback(null, true);
            }
        },
        users: function (callback) {
            if (modelNamesArray.indexOf('users') >= 0) {
                req.where = {id: 1}
                models['User'].getAllValues(req, function (data) {
                    callback(null, data);
                });
            } else {
                callback(null, true);
            }
        },
        service_details: function (callback) {
            if (modelNamesArray.indexOf('service_details') >= 0) {
                req.where = {is_active: 1}
                models['ServiceDetail'].getAllValues(req, function (data) {
                    callback(null, data);
                });
            } else {
                callback(null, true);
            }
        },
        government_id_types: function (callback) {
            if (modelNamesArray.indexOf('government_id_types') >= 0) {
                req.where = {is_active: 1}
                models['GovernmentIdType'].getAllValues(req, function (data) {
                    callback(null, data);
                });
            } else {
                callback(null, true);
            }
        }
    }, function (err, data) {
        console.log(data);
        data.party_no = party_no;
        data.member_no = member_no;
        data.partynotitlecount = partynotitlecount;
        res.render(renderTemplate, {status: true, msg: '', data: data, layout: false});
        // results is now equals to: {one: 1, two: 2}
    });
});

module.exports = router;
