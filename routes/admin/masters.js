var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

router.use(adminAuth.isAdmin);
var extraVar = [];

var viewDirectory = 'masters';
var modelName = 'Master';
//var titleName = 'Professional Types';

var setMasterType = function(master_id){
    if(master_id == 1){
        extraVar['master_type'] = 1;    //1 - profession type 
        extraVar['titleName'] = 'Professional Types';
    } else if(master_id == 2){
        extraVar['master_type'] = 2;    //1 - service provider types 
        extraVar['titleName'] = 'Service Provider Types';
    } else if(master_id == 3){
        extraVar['master_type'] = 3;    //1 - business type
        extraVar['titleName'] = 'Business Types';
    } else if(master_id == 4){
        extraVar['master_type'] = 4;    //1 - business category
        extraVar['titleName'] = 'Business Category';
    }
    return true;
    //return extraVar['master_type'];
}


extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
//extraVar['titleName'] = titleName;


/* GET users listing. */
router.get('/:master_id', function (req, res, next) {
    setMasterType(req.params.master_id)

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
    req.where = {master_type:req.params.master_id};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});


router.get('/add/:master_id', function (req, res, next) {
    setMasterType(req.params.master_id)
    async.parallel({
//        products: function (callback) {
//            req.where = {'product_slug': 'nyaya-card-1'}
//            models.Product.getAllValues(req, function (data) {
//                callback(null, data);
//            });
//        }
    }, function (err, results) {
        res.render('admin/' + viewDirectory + '/add', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.get('/edit/:master_id/:id', function (req, res, next) {
    setMasterType(req.params.master_id)
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
        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.post('/delete/:master_id/:id', function (req, res, next) {
    var id = req.params.id;
    setMasterType(req.params.master_id)
    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory+'/'+extraVar['master_type']});
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

            if (typeof req.body.revised_type === 'undefined') {
                req.body.revised_type = '';
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
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory+'/'+req.body.master_type});
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
                    
                    req.body.start_date = req.app.locals.site.momentObj(req.body.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    req.body.end_date = req.app.locals.site.momentObj(req.body.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    models[modelName].updateAllValues(req, function (results) {
                        if (results.status) {
                            req.flash('type_messages', 'success');
                            req.flash('messages', 'Added successfully!');
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory+'/'+req.body.master_type});
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
