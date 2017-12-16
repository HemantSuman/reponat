var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

router.use(adminAuth.isAdmin);

var viewDirectory = 'nc1-slab';
var modelName = 'Slab';
var titleName = 'Schedule-1 Slab';

var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;

/* GET users listing. */
router.get('/', adminAuth.isAllow, function (req, res, next) {
    var limit = 100;
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
    req.where = {};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results.rows, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});


router.get('/add', adminAuth.isAllow, function (req, res, next) {

    res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar});

});

router.get('/edit/:id', adminAuth.isAllow, function (req, res, next) {
    models[modelName].getById(req.params.id, function (data) {
        console.log(data);
        //res.send(data);
        res.render('admin/' + viewDirectory + '/add', {data: data, layout: 'admin/layout/layout', extraVar: extraVar});
    });
});


router.post('/delete/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;

    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory});
//        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
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
            console.log(req.body);
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
                    //console.log(req.body);
                    models[modelName].checkAlreadyExist(req, function (checkStatus) {
                        if (checkStatus.status) {
                            models[modelName].saveAllValues(req, function (results) {
                                if (results.status) {
                                    if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                        var msg = 'Added succrssfully';
                                    } else {
                                        var msg = 'Edit succrssfully';
                                    }

                                    req.flash('type_messages', 'success');
                                    req.flash('messages', msg);
                                    res.status(200).send({status: true, url: '/admin/' + viewDirectory});
                                } else {
                                    res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                                }
                            });
                        } else {
                            res.status(201).send({status: false, message: 'An entry already exist for the given range.', data: []});
                        }
                    })

                } else {
                    res.status(400).send({status: false, msg: ' saved failed', data: errors});
                }
            });
        }

    });
    console.log(req.body);
});

module.exports = router;
