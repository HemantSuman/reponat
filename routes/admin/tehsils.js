var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

router.use(adminAuth.isAdmin);
var extraVar = [];
var viewDirectory = 'tehsils';
var modelName = 'Tehsil';
var titleName = 'Tehsils';

extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;

/* GET users listing. */
router.get('/', adminAuth.isAllow, function (req, res, next) {

    var srhData = req.query;
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
    req.where = {};
    req.offset = offset;
    req.limit = limit;
    
    
    if (srhData.country_id) {
        req.where.country_id = srhData.country_id;
    }
    if (srhData.state_id) {
        req.where.state_id = srhData.state_id;
    }
    if (srhData.division_id) {
        req.where.division_id = srhData.division_id;
    }
    if (srhData.district_id) {
        req.where.district_id = srhData.district_id;
    }
    if (srhData.tehsil_name) {
        req.where.tehsil_name = {$like: '%' + srhData.tehsil_name + '%'};
    }

    models[modelName].getAllValuesPaging(req, function (results) {
        async.parallel({
            countries: function (callback) {
                req.where = {}
                models.Country.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            states: function (callback) {
                req.where = {country_id: 1}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            divisions: function (callback) {
                if (srhData.state_id) {
                    req.where = {state_id: srhData.state_id}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, '');
                }
            },
            districts: function (callback) {
                if (srhData.division_id) {
                    req.where = {division_id: srhData.division_id}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, '');
                }
            }
        }, function (err, data) {
            results.data = data;
            extraVar['pageCount'] = Math.ceil(results.count / limit);
            serchData = req.query;
            res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, serchData: serchData, layout: 'admin/layout/layout'});
        });
    });
    
//    models[modelName].getAllValuesPaging(req, function (results) {
//        extraVar['pageCount'] = Math.ceil(results.count / limit);
//        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
//    });
    //res.render('admin/categories/index', {title: 'Express', layout: 'admin/layout/layout'});
});


router.get('/add', adminAuth.isAllow, function (req, res, next) {
    async.parallel({
        countries: function (callback) {
            req.where = {}
            models.Country.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        res.render('admin/' + viewDirectory + '/add', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.get('/edit/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {'id': id}
    models[modelName].getFirstValues(req, function (my_model) {
        async.parallel({
            countries: function (callback) {
                req.where = {}
                models.Country.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            states: function (callback) {
                req.where = {country_id: my_model.country_id}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            divisions: function (callback) {
                req.where = {country_id: my_model.country_id}
                models.Division.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            districts: function (callback) {
                req.where = {state_id: my_model.state_id}
                models.District.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            results.my_model = my_model;
            res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
        });
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
            req.body.product_id = 1;

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

                    models[modelName].saveAllValues(req, function (results) {
                        if (results.status) {
                            req.flash('type_messages', 'success');
                            req.flash('messages', 'Added successfully!');
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory});
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

router.post('/update', function (req, res, next) {

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
                },
                function (callback) {
                    callback(null, errors);
                }], function (err) {
                if (errors.length == 0) {

                    models[modelName].updateAllValues(req, function (results) {
                        if (results.status) {
                            req.flash('type_messages', 'success');
                            req.flash('messages', 'Updated successfully!');
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory});
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

module.exports = router;
