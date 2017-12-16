var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var mailObj = require('../../middlewares/Mail');

var extraVar = [];
var viewDirectory = 'membership_plan_fees';
var modelName = 'MembershipPlanFee';
var titleName = 'Membership Plan Fee';

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
    req.where = {};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});



router.get('/view', function (req, res, next) {

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
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index_view', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});


router.get('/add', function (req, res, next) {
    async.parallel({
        // countries: function (callback) {
        //     req.where = {}
        //     models.Country.getAllValues(req, function (data) {
        //         callback(null, data);
        //     });
        // }
    }, function (err, results) {
        res.render('admin/' + viewDirectory + '/add', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.get('/edit/:id', function (req, res, next) {
    var id = req.params.id;
    async.parallel({
        my_model: function (callback) {
            req.where = {'id': id}
            models[modelName].getFirstValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.post('/change_status_of_membership_plan_fee', function (req, res, next) {
    var id = req.body.data_id;
    var m_plan_id = req.body.m_plan_id;
    var value_to_be_updated = req.body.status
    req.where = {'id': id};
    req.body = {'is_active': req.body.status};
    
    delete req.body.data_id;
    delete req.body.status;

    var cond = {where: {membership_plan_id: m_plan_id, is_active: 1, id: { $ne: id }}}
    models[modelName].getBy(cond, function (checkk) {
        console.log(checkk.length)
        console.log(value_to_be_updated)
        if(value_to_be_updated == 0 && checkk.length == 0) {
            res.status(201).send({status: false, message: "Cannot update the status. At least one active package is required"});
        } else {
            models[modelName].changeStatus(req, function (resultStatus) {
                res.status(200).send({status: true, message: "Status Updated Successfully."});
            });
        }
    })

    //res.render('admin/' + viewDirectory + '/per_year_fee_table_ui', {reqData: req.body, layout: false});
});

router.post('/create', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            if (typeof req.body.membership_plan_fees != 'undefined') {
                req.body.membership_plan_fees = req.body.membership_plan_fees.filter(function (n) {
                    return n != undefined
                });
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

                    async.forEach(req.body.membership_plan_fees, function (value1, callback1) {
                        var MembershipPlanFeeBuild = models.MembershipPlanFee.build(value1);
                        MembershipPlanFeeBuild.validate().then(function (err) {
                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + value1.number_of_years;
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
                        
                        models[modelName].checkAlreadyExist(req, function (checkStatus) {
                            if(checkStatus.status) {   
                                models[modelName].saveAllValues(req, function (results) {
                                    if (results.status) {
                                        req.flash('type_messages', 'success');
                                        req.flash('messages', 'Added successfully!');
                                        res.status(200).send({status: true, url: '/admin/' + viewDirectory});
                                    } else {
                                        res.status(400).send({status: false, msg: ' saved  failed', data: results.errors});
                                    }
                                });
                            } else {
                                res.status(201).send({status: false, message: 'An entry already exist for the given turnover range.', data: []});
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
            if (typeof req.body.membership_plan_fees != 'undefined') {
                req.body.membership_plan_fees = req.body.membership_plan_fees.filter(function (n) {
                    return n != undefined
                });
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
                    async.forEach(req.body.membership_plan_fees, function (value1, callback1) {
                        var MembershipPlanFeeBuild = models.MembershipPlanFee.build(value1);
                        MembershipPlanFeeBuild.validate().then(function (err) {
                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + value1.number_of_years;
                                    errors = errors.concat(errObj);
                                });
                            }
                            callback1(null, errors);

                        });
                    }, function (err) {
                        callback(null, errors);
                    });
                },
                function (callback) {
                    callback(null, errors);
                }], function (err) {
                    if (errors.length == 0) {
                        models[modelName].checkAlreadyExist(req, function (checkStatus) {
                            if(checkStatus.status) {
                                models[modelName].updateAllValues(req, function (results) {
                                    if (results.status) {
                                        req.flash('type_messages', 'success');
                                        req.flash('messages', 'Updated successfully!');
                                        res.status(200).send({status: true, url: '/admin/' + viewDirectory});
                                    } else {
                                        res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                                    }
                                });
                            } else {
                                res.status(201).send({status: false, message: 'An entry already exist for the given turnover range.', data: []});
                            }
                        });
                    } else {
                        res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                    }
            });
        }

    });
    console.log(req.body);
});

router.post('/delete/:id', function (req, res, next) {
    var id = req.params.id;
    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory});
    });

});


module.exports = router;
