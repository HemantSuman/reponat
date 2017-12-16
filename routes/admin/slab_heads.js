var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

router.use(adminAuth.isAdmin);

var viewDirectory = 'slab-heads';
var modelName = 'SlabHead';
var titleName = 'Slab Head';


var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;

/* GET users listing. */
router.get('/:product_id',adminAuth.isAllow, adminAuth.productIdChk, function (req, res, next) {

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
    models[modelName].getAllFeesValues(req, function (results) {

        async.parallel({
            slabs: function (callback) {
                req.where = {}
                models.Slab.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, heads: function (callback) {
                req.where = {'is_active': 1}
                models.Head.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, services: function (callback) {
                req.where = {'is_active': 1}
                models.ServiceDetail.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }
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


router.get('/add/:product_id',adminAuth.isAllow, adminAuth.productIdChk, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    async.parallel({
        slabs: function (callback) {
            req.where = {}
            models.Slab.getAllValues(req, function (data) {
                callback(null, data);
            });
        }, heads: function (callback) {
            req.where = {'product_id': req.params.product_id}
            models.Head.getAllValues(req, function (data) {
                callback(null, data);
            });
        }, services: function (callback) {
            req.where = {'product_id': req.params.product_id}
            models.ServiceDetail.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: []});
    });



});

router.get('/edit/:product_id/:id',adminAuth.isAllow, adminAuth.productIdChk, function (req, res, next) {
    extraVar['product_id'] = req.params.product_id;
    models[modelName].getById(req.params.id, function (data) {
        //console.log(data);



        async.parallel({
            slabs: function (callback) {
                req.where = {}
                models.Slab.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, heads: function (callback) {
                req.where = {'product_id': req.params.product_id}
                models.Head.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, services: function (callback) {
                req.where = {'product_id': req.params.product_id}
                models.ServiceDetail.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, fees: function (callback) {
                req.where = {'is_active': 1}
                models.SlabHeadFees.getByHeads(req, function (data) {
                    callback(null, data);
                });
            }
//            slabs: function (callback) {
//                req.where = {'is_active': 1}
//                models.Slab.getAllValues(req, function (data) {
//                    callback(null, data);
//                });
//            }, heads: function (callback) {
//                req.where = {'is_active': 1}
//                models.Head.getAllValues(req, function (data) {
//                    callback(null, data);
//                });
//            }, fees: function (callback) {
//                req.where = {'is_active': 1}
//                models.SlabHeadFees.getByHeads(req, function (data) {
//                    callback(null, data);
//                });
//            }, services: function (callback) {
//                req.where = {'is_active': 1}
//                models.ServiceDetail.getAllValues(req, function (data) {
//                    callback(null, data);
//                });
//            }
        }, function (err, results) {
            var headArr = [];
            var rows = {};
            count = 0;
            flag = 0;
            
            console.log(results.fees);
            console.log('results.fees ============');
            async.each(results.heads, function (rowsDate, callback) {
                flag = 0;
                rows = {};
                async.each(results.fees, function (rowsFees, callback2) {

                    if (rowsFees['heads_id'] == rowsDate['id']) {

                        rows['slab_heads_id'] = rowsFees['slab_heads_id'];
                        rows['fee_type'] = rowsFees['fee_type'];
                        rows['amount'] = rowsFees['amount'];
                        rows['id'] = rowsDate['id'];
                        rows['heads_name'] = rowsDate['heads_name'];
                        //console.log(rowsDate);
                        headArr.push(rows);
                        flag = 1;

                    }
                    callback2();
//                    console.log('Done ..............................' + flag + '---' + rowsDate['id'] + '----' + rowsFees['heads_id']);

                }, function (err) {

                });
//                console.log(rowsDate['id']);
                if (flag == 0) {
//                    console.log(rowsDate['id']);
                    flag = 0;
                    rows['slab_heads_id'] = '';
                    rows['fee_type'] = '';
                    rows['amount'] = '';
                    rows['id'] = rowsDate['id'];
                    rows['heads_name'] = rowsDate['heads_name'];
                    //console.log(rowsDate);
                    headArr.push(rows);
                }
                callback();
                //console.log(flag);

            }, function (err) {

            });
            results.heads = [];
            results.heads = headArr;
            console.log('results.fees 0000000000000000');
            console.log('------------------------------');
            //res.send(results.heads);
            console.log('------------------------------');
            res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
        });

    });
});


router.post('/delete/:id/:product_id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;

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
        var skipFields = {}
        if(typeof (req.body.service_details_id) == 'undefined') {
            req.body.service_details_id = '';
        } else {
            skipFields = {skip: ["service_details_id"]}
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            if (typeof req.body.heads_id != 'undefined') {
                req.body.heads_id = req.body.heads_id.filter(function (n) {
                    return n != undefined
                });
            }
            if (typeof req.body.fee_type != 'undefined') {
                req.body.fee_type = req.body.fee_type.filter(function (n) {
                    return n != undefined
                });
            }
            if (typeof req.body.amount != 'undefined') {
                req.body.amount = req.body.amount.filter(function (n) {
                    return n != undefined
                });
            }    
            console.log("----------- Here is the data---------------------")
            console.log(req.body)
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
                    async.forEachOf(req.body.heads_id, function (value1, key, callback1) {
                        var slabHeadDataToValidate = {
                            heads_id: value1,
                            fee_type: req.body.fee_type[key],
                            amount: req.body.amount[key],
                        }
                        
                        var SlabHeadFeeBuild = models.SlabHeadFees.build(slabHeadDataToValidate);
                        SlabHeadFeeBuild.validate().then(function (err) {
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
                        
                        models[modelName].checkAlreadyExist(req, function (existenceStatus) {
                            if(existenceStatus.status) {
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
                                res.status(201).send({status: false, message: ' Already exist', data: []});
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
