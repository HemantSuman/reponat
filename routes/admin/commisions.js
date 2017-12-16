var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var multer = require('multer');
var upload = multer();
var async = require("async");
router.use(adminAuth.isAdmin);
var viewDirectory = 'commisions';
var modelName = 'Commision';
var titleName = 'Incentive';

var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;
/* GET users listing. */




router.get('/incentives', function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;

    //req.where.product_id
    req.where = {product_id: 1, master_type_id: 1};

    models[modelName].getUserInc(req, function (results) {

        req.where = {product_id: 2, master_type_id: 1};
        models[modelName].getUserInc(req, function (nc2) {
            req.where = {product_id: 3, master_type_id: 1};
            models[modelName].getUserInc(req, function (mshp) {
                models[modelName].getUserSp(req, function (sb) {
                    extraVar['titleName'] = 'Incentive Criteria';
                    res.render('admin/' + viewDirectory + '/user_commision', {results: results, layout: 'admin/layout/layout', extraVar: extraVar, nc2: nc2, mshp: mshp, sb: sb});
                }, function (err, resultSearch) {
                });
            }, function (err, resultSearch) {
            });
        }, function (err, resultSearch) {

        });
    }, function (err, resultSearch) {
    });
});




router.get('/:product_id', adminAuth.isAllow, function (req, res, next) {
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
    req.where = {product_id: req.params.product_id, master_type_id: 1};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValues(req, function (results) {

        extraVar['query'] = req.query;
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        console.log(extraVar);
        //res.send(results);
        extraVar['titleName'] = 'Professional Incentive';
        res.render('admin/' + viewDirectory + '/index', {results: results, layout: 'admin/layout/layout', extraVar: extraVar});
    }, function (err, resultSearch) {
        //res.send(results);
    });
});







router.get('/provider/:product_id', adminAuth.isAllow, function (req, res, next) {
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
    req.where = {product_id: req.params.product_id, role_type_id: 2};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesProviderOrm(req, function (results) {

        extraVar['query'] = req.query;
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        console.log(extraVar);
        //res.send(results);
        extraVar['titleName'] = 'Service Provider Incentive';
        res.render('admin/' + viewDirectory + '/index_provider', {results: results['rows'], layout: 'admin/layout/layout', extraVar: extraVar});
    }, function (err, resultSearch) {
        //res.send(results);
    });
});





router.get('/add/:product_id', adminAuth.isAllow, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    async.parallel({
        professional: function (callback) {
            req.where = {role_id: 1}
            models.RoleType.getByType(req, function (data) {
                callback(null, data);
            });
        }, provider: function (callback) {
            req.where = {role_id: 2}
            models.RoleType.getByType(req, function (data) {
                callback(null, data);
            });
        }, services: function (callback) {
            req.where = {product_id: req.params.product_id}
            models.ServiceDetail.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: []});
    });
});


router.get('/add_provider/:product_id', adminAuth.isAllow, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    async.parallel({
        professional: function (callback) {
            req.where = {role_id: 2}
            models.RoleType.getByType(req, function (data) {
                callback(null, data);
            });
        }, provider: function (callback) {
            req.where = {role_id: 2}
            models.RoleType.getByType(req, function (data) {
                callback(null, data);
            });
        }, services: function (callback) {
            req.where = {product_id: req.params.product_id}
            models.ServiceDetail.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        extraVar['titleName'] = 'Service Provider Incentive';
        res.render('admin/' + viewDirectory + '/add_providers', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: []});
    });
});




router.get('/membership/:product_id', adminAuth.isAllow, function (req, res, next) {
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
    req.where = {product_id: req.params.product_id, role_type_id: 1};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesProviderOrm(req, function (results) {

        extraVar['query'] = req.query;
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        console.log(extraVar);
        //res.send(results);
        extraVar['titleName'] = 'Professional Incentive';
        res.render('admin/' + viewDirectory + '/index_membership', {results: results['rows'], layout: 'admin/layout/layout', extraVar: extraVar});
    }, function (err, resultSearch) {
        //res.send(results);
    });
});


router.get('/membership/add/:product_id', adminAuth.isAllow, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    async.parallel({
        professional: function (callback) {
            req.where = {role_id: 1}
            models.RoleType.getByType(req, function (data) {
                callback(null, data);
            });
        }, provider: function (callback) {
            req.where = {role_id: 1}
            models.RoleType.getByType(req, function (data) {
                callback(null, data);
            });
        }, services: function (callback) {
            req.where = {product_id: req.params.product_id}
            models.ServiceDetail.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        extraVar['titleName'] = 'Professional Incentive';
        res.render('admin/' + viewDirectory + '/add_membership', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: []});
    });
});





router.get('/edit_membership/:product_id/:id/:master_id', adminAuth.isAllow, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    models[modelName].getById(req.params.id, function (data) {
        async.parallel({
            professional: function (callback) {
                req.where = {role_id: 1}
                models.RoleType.getByType(req, function (data) {
                    callback(null, data);
                });
            }, provider: function (callback) {
                req.where = {role_id: 1}
                models.RoleType.getByType(req, function (data) {
                    callback(null, data);
                });
            }, services: function (callback) {
                req.where = {product_id: req.params.product_id}
                models.ServiceDetail.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            //res.send(data);
            extraVar['titleName'] = 'Professional Incentive';
            res.render('admin/' + viewDirectory + '/add_membership', {data: results, layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
        });
    });
});








router.get('/edit_provider/:product_id/:id/:master_id', adminAuth.isAllow, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    models[modelName].getById(req.params.id, function (data) {
        async.parallel({
            professional: function (callback) {
                req.where = {role_id: 2}
                models.RoleType.getByType(req, function (data) {
                    callback(null, data);
                });
            }, provider: function (callback) {
                req.where = {role_id: 2}
                models.RoleType.getByType(req, function (data) {
                    callback(null, data);
                });
            }, services: function (callback) {
                req.where = {product_id: req.params.product_id}
                models.ServiceDetail.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            //res.send(data);
            extraVar['titleName'] = 'Service Provider Incentive';
            res.render('admin/' + viewDirectory + '/add_providers', {data: results, layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
        });
    });
});



router.get('/edit/:product_id/:id/:master_id', adminAuth.isAllow, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    models[modelName].getById(req.params.id, function (data) {
        //console.log(data);

        async.parallel({
            professional: function (callback) {
                req.where = {role_id: 1}
                models.RoleType.getByType(req, function (data) {
                    callback(null, data);
                });
            }, provider: function (callback) {
                req.where = {role_id: 2}
                models.RoleType.getByType(req, function (data) {
                    callback(null, data);
                });
            }, services: function (callback) {
                req.where = {product_id: req.params.product_id}
                models.ServiceDetail.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, saveServices: function (callback) {
                req.where = {'role_type_id': req.params.master_id}
                models[modelName].getAllValuesProvider(req, function (data) {
                    callback(null, data);
                });
            }

        }, function (err, results) {
            var headArr = [];
            var rows = {};
            count = 0;
            flag = 0;
            console.log('------------------>');
            console.log(results.services);
            console.log('------------------>');

            async.each(results.services, function (rowsDate, callback) {
                flag = 0;
                rows = {};
                async.each(results.saveServices.rows, function (rowsFees, callback2) {

                    if (rowsFees['service_detail_id'] == rowsDate['id']) {

                        rows['commission_type'] = rowsFees['commission_type'];
                        rows['commission_value'] = rowsFees['commission_value'];
                        rows['id'] = rowsDate['id'];
                        rows['service_details_name'] = rowsDate['service_details_name'];
                        //console.log(rowsDate);
                        headArr.push(rows);
                        flag = 1;
                    }
                    callback2();
                    console.log('Done ..............................' + flag + '---' + rowsDate['id'] + '----' + rowsFees['heads_id']);
                }, function (err) {

                });
                console.log(rowsDate['id']);
                if (flag == 0) {
                    console.log(rowsDate['id']);
                    flag = 0;
                    rows['commission_type'] = '';
                    rows['commission_value'] = '';
                    rows['id'] = rowsDate['id'];
                    rows['service_details_name'] = rowsDate['service_details_name'];
                    //console.log(rowsDate);
                    headArr.push(rows);
                }
                callback();
                //console.log(flag);

            }, function (err) {

            });
            results.services = [];
            results.services = headArr;
            console.log('------------------------------');
            //res.send(results.services);
            console.log('------------------------------');
            res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
        });
    });
});





router.post('/delete/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {'role_type_id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + extraVar['product_id']});
//        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});


router.post('/delete_provider/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {'role_type_id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/provider/' + extraVar['product_id']});
//        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});

router.post('/delete_membership/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {'role_type_id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/membership/' + extraVar['product_id']});
//        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});


router.post('/create', function (req, res, next) {
    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        var skipFields = {}
        if (typeof req.body.role_type_id == 'undefined') {
            req.body.role_type_id = '';
        } else {
            skipFields = {skip: ["role_type_id", "commission_value"]}
        }

        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {
                    modelBuild.validate(skipFields).then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null, errors);
                        } else {
                            callback(null, errors);
                        }
                    });
                },
                function (callback) {
                    async.forEachOf(req.body.commission_value, function (value1, key, callback1) {
                        var valueSet = {commission_value: value1}
                        var modelBuild = models[modelName].build(valueSet);
                        modelBuild.validate().then(function (err) {
                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + key;
                                    errors = errors.concat(errObj);
                                });
                            }
                            callback1(null, errors);

                        });
                    }, function (err) {
                        callback(null, errors);
                    });
                }], function (err) {
                if (errors.length == 0) {
                    models[modelName].checkAlreadyExist(req, function (dataResult) {
                        if (dataResult.status) {
                            models[modelName].saveAllValues(req, function (results) {
                                if (results.status) {
                                    if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                        var msg = 'Edit successfully';
                                    } else {
                                        var msg = 'Added successfully';
                                    }
                                    req.flash('type_messages', 'success');
                                    req.flash('messages', msg);



                                    res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + extraVar['product_id']});
                                } else {
                                    res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                                }
                            });
                        } else {
                            res.status(201).send({status: false, message: 'Already exist for role within your selected roles.', data: {}});
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




router.post('/add_provider', function (req, res, next) {

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
                    models[modelName].checkIfExistServiceProviderCommision(req, function (isAlreadyExist) {
                        if (isAlreadyExist.status) {
                            models[modelName].saveAllValueProvider(req, function (results) {
                                if (results.status) {
                                    if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                        var msg = 'Edit successfully';
                                    } else {

                                        var msg = 'Added successfully';
                                    }

                                    req.flash('type_messages', 'success');
                                    req.flash('messages', msg);
                                    //viewDirectory = 'commisions/provider';
                                    res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/provider/' + extraVar['product_id']});
                                } else {
                                    res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                                }
                            });
                        } else {
                            res.status(201).send({status: false, message: 'Already exist for the selected provider type.', data: errors});
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






router.post('/add_membership', function (req, res, next) {

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
                    models[modelName].checkIfExistServiceProviderCommision(req, function (isAlreadyExist) {
                        if (isAlreadyExist.status) {
                            models[modelName].saveAllValueProvider(req, function (results) {
                                if (results.status) {
                                    if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                        var msg = 'Added successfully';
                                    } else {
                                        var msg = 'Edit successfully';
                                    }

                                    req.flash('type_messages', 'success');
                                    req.flash('messages', msg);
                                    //viewDirectory = 'commisions/provider';
                                    res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/membership/' + extraVar['product_id']});
                                } else {
                                    res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                                }
                            });
                        } else {
                            res.status(201).send({status: false, message: 'Already exist for the selected user type.', data: errors});
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




module.exports = router;
