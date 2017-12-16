var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
router.use(adminAuth.isAdmin);
var viewDirectory = 'franchise-commissions';
var modelName = 'FranchiseCommissions';
var titleName = 'Authorized Promoter Commission';

var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;


router.get('/:product_id', adminAuth.isAllow, adminAuth.productIdChk, function (req, res, next) {


    extraVar['product_id'] = req.params.product_id;
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
    req.where = {product_id: req.params.product_id};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValues(req, function (results) {

        async.parallel({
        }, function (err, resultSearch) {
            //res.send(results);
            extraVar['query'] = req.query;
            extraVar['pageCount'] = Math.ceil(results.count / limit);
            console.log(extraVar);
            //res.send(results);
            res.render('admin/' + viewDirectory + '/index', {results: results, layout: 'admin/layout/layout', extraVar: extraVar, resultSearch: resultSearch, fromData: []});
        });


    });
});


router.get('/add/:product_id', adminAuth.isAllow, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    req.where = {product_id: req.params.product_id};
    models[modelName].getAllValues(req, function (data) {
        //console.log(data);

        async.parallel({
            FranchiseCommissions: function (callback) {
                req.where = {}
                models.FranchiseCommissionLevel.getBy(req, function (data) {
                    callback(null, data);
                });
            }

        }, function (err, results) {
            res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
        });
    });

});

router.get('/edit/:product_id/:id', adminAuth.isAllow, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    req.where = {product_id: req.params.product_id};
    //models[modelName].getAllValues(req, function (data) {
    models[modelName].getById(req.params.id, function (data) {
        async.parallel({
            FranchiseCommissions: function (callback) {
                req.where = {}
                models.FranchiseCommissionLevel.getBy(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            
            res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
        });
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

            console.log("(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((")
            console.log(req.body)
            console.log(")))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))")

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
                    models[modelName].checkIfExist(req, function (alreadyExistStatus) {
                        if(alreadyExistStatus.status) {
                            models[modelName].saveAllValues(req, function (results) {
                                if (results.status) {
                                    if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                        var msg = 'Added successfully';
                                    } else {
                                        var msg = 'Edit successfully';
                                    }

                                    req.flash('type_messages', 'success');
                                    req.flash('messages', msg);
                                    res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body['product_id']});
                                } else {
                                    res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                                }
                            });
                        } else {
                            res.status(201).send({status: false, message: 'Already exist for the selected level.', data: {}});
                        }
                    });
                } else {
                    res.status(400).send({status: false, msg: ' saved failed', data: errors});
                }
            });
        }

    });
    console.log(req.body);
});

router.post('/delete/:product_id/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory +'/'+req.params.product_id});
//        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});


module.exports = router;
