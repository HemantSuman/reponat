var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

router.use(adminAuth.isAdmin);

var extraVar = [];
var viewDirectory = 'service_details';
var modelName = 'ServiceDetail';
var titleName = 'Document Category';

var setProductType = function (product_id) {
    extraVar['product_id'] = product_id;
    return true;
    //return extraVar['master_type'];
}

extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;

/* GET users listing. */
router.get('/:product_id',adminAuth.isAllow, adminAuth.productIdChk, function (req, res, next) {
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
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
    //res.render('admin/categories/index', {title: 'Express', layout: 'admin/layout/layout'});
});


router.get('/add/:product_id',adminAuth.isAllow, function (req, res, next) {
    setProductType(req.params.product_id)
    async.parallel({
        products: function (callback) {
            req.where = {'product_slug': 'nyaya-card-1'}
            models.Product.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        slabs: function (callback) {
            req.where = {}
            models.Slab.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        res.render('admin/' + viewDirectory + '/add', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
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
        },
        slabs: function (callback) {
            req.where = {}
            models.Slab.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        var keyValueSlabs = {};
        results.my_model.service_detail_slabs.map(function (value) {
            keyValueSlabs[value.slab_id] = value
            return keyValueSlabs;
        });
        extraVar['keyValueSlabs'] = keyValueSlabs;
        console.log(results.slabs);
        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
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

            if (typeof req.body.service_detail_documents != 'undefined') {
                req.body.service_detail_documents = req.body.service_detail_documents.filter(function (n) {
                    return n != undefined
                });
            }
            if (typeof req.body.service_detail_duration_wise_percentages != 'undefined') {
                req.body.service_detail_duration_wise_percentages = req.body.service_detail_duration_wise_percentages.filter(function (n) {
                    return n != undefined
                });
            }

            if (typeof req.body.service_detail_slabs != 'undefined') {
                req.body.service_detail_slabs = req.body.service_detail_slabs.filter(function (n) {
                    return n != undefined
                });
            }
            
            if (typeof req.body.service_detail_documents == 'undefined') {
                req.body.document_count = '';
            }

            console.log('req.body.service_detail_documents');
            console.log(req.body);
            var modelBuild = models[modelName].build(req.body);
//            var ServiceDetailDocumentBuild = models.ServiceDetailDocument.build(req.body.service_detail_documents);
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

                    async.forEach(req.body.service_detail_duration_wise_percentages, function (value1, callback1) {
//                        console.log(value1);
                        var ServiceDetailDurationWisePercentageBuild = models.ServiceDetailDurationWisePercentage.build(value1);
                        ServiceDetailDurationWisePercentageBuild.validate().then(function (err) {
                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + value1.no_of_year;
                                    errors = errors.concat(errObj);
                                });
                            }
                            callback1(null, errors);

                        });
                    }, function (err) {
                        //console.log('%%%%%%%%%%%');
//                    console.log(errors);
                        callback(null, errors);
                    });
                },
                function (callback) {

                    async.forEach(req.body.service_detail_slabs, function (value1, callback1) {
                        var ServiceDetailSlabBuild = models.ServiceDetailSlab.build(value1);
                        ServiceDetailSlabBuild.validate().then(function (err) {
                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + value1.slab_id;
                                    errors = errors.concat(errObj);
                                });
                            }
                            callback1(null, errors);
                        });
                    }, function (err) {
                        //console.log('%%%%%%%%%%%');
//                    console.log(errors);
                        callback(null, errors);
                    });
                },
                function (callback) {

//                    async.forEach(req.body.service_detail_documents, function (value1, callback1) {
//                        var ServiceDetailDocumentBuild = models.ServiceDetailDocument.build(value1);
//                        ServiceDetailDocumentBuild.validate().then(function (err) {
//                            if (err != null) {
//                                errors = errors.concat(err.errors);
//                                callback1(null, errors);
//                            } else {
//                                callback1(null, errors);
//                            }
//
//                        });
//                    }, function (err) {
//                        //console.log('%%%%%%%%%%%');
////                    console.log(errors);
                    callback(null, errors);
//                    });
                }], function (err) {
//                    console.log(errors, 'req.body 7777');
                if (errors.length == 0) {
                    if(typeof req.body.service_detail_documents != "undefined") {
                        models[modelName].saveAllValues(req, function (results) {
                            if (results.status) {
                                req.flash('type_messages', 'success');
                                req.flash('messages', 'Added successfully!');
                                res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body.product_id});
                            } else {
                                res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                            }
                        });
                    } else {
                        res.status(201).send({status: false, message: ' Please add at least one Document', data: []});
                    }
                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
    console.log(req.body);
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
            if (typeof req.body.service_detail_documents == 'undefined') {
                req.body.document_count = '';
            }
            var modelBuild = models[modelName].build(req.body);
//            var ServiceDetailDocumentBuild = models.ServiceDetailDocument.build(req.body.service_detail_documents);
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

                    async.forEach(req.body.service_detail_duration_wise_percentages, function (value1, callback1) {
                        var ServiceDetailDurationWisePercentageBuild = models.ServiceDetailDurationWisePercentage.build(value1);
                        ServiceDetailDurationWisePercentageBuild.validate().then(function (err) {
                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + value1.no_of_year;
                                    errors = errors.concat(errObj);
                                });
                            }
                            callback1(null, errors);

                        });
                    }, function (err) {
                        //console.log('%%%%%%%%%%%');
//                    console.log(errors);
                        callback(null, errors);
                    });
                },
                function (callback) {

                    async.forEach(req.body.service_detail_slabs, function (value1, callback1) {
                        var ServiceDetailSlabBuild = models.ServiceDetailSlab.build(value1);
                        ServiceDetailSlabBuild.validate().then(function (err) {
                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + value1.slab_id;
                                    errors = errors.concat(errObj);
                                });
                            }
                            callback1(null, errors);
                        });
                    }, function (err) {
                        //console.log('%%%%%%%%%%%');
//                    console.log(errors);
                        callback(null, errors);
                    });
                },
                function (callback) {
                    callback(null, errors);
                }], function (err) {
//                    console.log(errors, 'req.body 7777');
                if (errors.length == 0) {

                    if(typeof req.body.service_detail_documents != "undefined") {
                        models[modelName].updateAllValues(req, function (results) {
                            if (results.status) {
                                req.flash('type_messages', 'success');
                                req.flash('messages', 'Added successfully!');
                                res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body.product_id});
                            } else {
                                res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                            }
                        });
                    } else {
                        res.status(201).send({status: false, message: ' Please add at least one Document', data: []});
                    }
                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
    console.log(req.body);
});

module.exports = router;
