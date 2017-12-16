var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

router.use(adminAuth.isAdmin);
var extraVar = [];
var viewDirectory = 'special_bonus';
var modelName = 'SpecialBonus';
var titleName = 'Special Bonus';

var setProductType = function (product_id) {
    extraVar['product_id'] = product_id;
    return true;
    //return extraVar['master_type'];
}

extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;

/* GET users listing. */
router.get('/:product_id',adminAuth.isAllow, function (req, res, next) {
    setProductType(req.params.product_id)

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


    if (req.params.product_id == 4) {
        extraVar['titleName'] = 'Additional Incentives';
    } 

    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
    //res.render('admin/categories/index', {title: 'Express', layout: 'admin/layout/layout'});
});


router.get('/add/:product_id',adminAuth.isAllow, function (req, res, next) {
    setProductType(req.params.product_id)
    async.parallel({
//        products: function (callback) {
//            req.where = {'product_slug': 'nyaya-card-1'}
//            models.Product.getAllValues(req, function (data) {
//                callback(null, data);
//            });
//        }
    }, function (err, results) {
        res.render('admin/' + viewDirectory + '/add', {results: results, extraVar: extraVar, layout: 'admin/layout/layout', type_id: req.params.product_id});
    });

});

router.get('/edit/:id/:product_id',adminAuth.isAllow, function (req, res, next) {
    setProductType(req.params.product_id)
    var id = req.params.id;
    async.parallel({
        my_model: function (callback) {
            req.where = {'id': id}
            models[modelName].getFirstValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        console.log(results);
        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout', type_id: req.params.product_id});
    });

});

router.post('/delete/:id/:product_id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    setProductType(req.params.product_id)
    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + extraVar['product_id']});
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
//            req.body.product_id = 1;

            if (typeof req.body.revised_type === 'undefined') {
                req.body.revised_type = '';
            }
            if (req.body.start_date != '') {
                req.body.start_date = req.app.locals.site.momentObj(req.body.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            if (req.body.end_date != '') {
                req.body.end_date = req.app.locals.site.momentObj(req.body.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
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
//                    console.log(errors, 'req.body 7777');
                if (errors.length == 0) {


                    models[modelName].saveAllValues(req, function (results) {
                        if (results.status) {
                            req.flash('type_messages', 'success');
                            req.flash('messages', 'Added successfully!');
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + extraVar['product_id']});
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

            if (req.body.start_date != '') {
                req.body.start_date = req.app.locals.site.momentObj(req.body.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            if (req.body.end_date != '') {
                req.body.end_date = req.app.locals.site.momentObj(req.body.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
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
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + extraVar['product_id']});
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
