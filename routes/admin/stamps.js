var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');

var XlsUpload = require('../../middlewares/XlsUpload');
var multer = require('multer');
var upload = multer();

var async = require("async");

router.use(adminAuth.isAdmin);

var extraVar = [];
var viewDirectory = 'stamp';
var modelName = 'Stamp';
var titleName = 'Stamp';

var setProductType = function (product_id) {
    extraVar['product_id'] = product_id;
    return true;
    //return extraVar['master_type'];
}

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
    req.where = {user_id: req.user.id};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
    //res.render('admin/categories/index', {title: 'Express', layout: 'admin/layout/layout'});
});


router.get('/add', function (req, res, next) {

    res.render('admin/' + viewDirectory + '/add', {extraVar: extraVar, layout: 'admin/layout/layout'});

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
        //console.log(results);
        res.render('admin/' + viewDirectory + '/edit', {results: results['my_model'], extraVar: extraVar, layout: 'admin/layout/layout'});
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


                    models[modelName].vaildStamp(req, function (valid) {

                        if (valid.status) {

                            req.body.penalty = valid.penalty;
                            req.results = valid;
                            models[modelName].saveAllValues(req, function (results) {
                                if (results.status) {


                                    req.flash('type_messages', 'success');
                                    req.flash('messages', 'Added successfully!');
                                    url = '/admin/' + viewDirectory + 's';
                                    if (req.body.url_is) {
                                        url = req.body.url_is;
                                    }
                                    res.status(200).send({status: true, url: url, msg: ' Added Successfully '});
                                } else {
                                    res.status(200).send({status: false, msg: ' saved d failed', data: results.errors});
                                }
                            });

                        } else {
                            res.status(200).send({status: false, message: ' Valid Period is Expired', data: []});
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

router.post('/update', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
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


                    models[modelName].vaildStamp(req, function (valid) {

                        //console.log('valid-===-------------=-=----=-=-=-=-=-');
                        //console.log(valid);

                        if (valid.status) {

                            req.body.penalty = valid.penalty;
                            req.results = valid;

                            models[modelName].updateAllValues(req, function (results) {
                                if (results.status) {
                                    req.flash('type_messages', 'success');
                                    req.flash('messages', 'Updated successfully!');
                                    res.status(200).send({status: true, url: '/admin/dashboard'});
                                } else {
                                    res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                                }
                            });

                        } else {
                            res.status(200).send({status: false, message: ' Valid Period is Expired', data: []});
                        }

                    });

                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
});

router.post('/xls-upload', function (req, res, next) {
    // console.log("======================>>>>>>>>>>>>>>>>>>>>>")
    // console.log(req.body)
    // console.log("<<<<<<<<<<<<<<<<<<<========================")
    // req.body.file_path = "public/uploads/stamps";
    XlsUpload.uploadFile(req, res, function (err) {
        if (err) {
            res.send({status: false, message: err, data: []});
        } else {
            //console.log("-------------->    SUCCESS    <-----------------")
            models[modelName].xlsUpload(req, function (results) {
                // console.log("------------- return from function ------------------------->  ")
                // console.log(results)
                if (typeof results.isFileValid !== "undefined" && results.isFileValid === false) {
                    res.status(201).send({status: false, message: "Invalid file"});
                } else {
                    //res.status(201).send({status: false, message: "Invalid file"});
                    if (results.status) {
                        req.flash('type_messages', 'success');
                        req.flash('messages', 'Added successfully!');
                        url = '/admin/dashboard';

                        res.status(200).send({status: true, url: url});
                    } else {
                        res.status(400).send({
                            status: false,
                            msg: ' saved failed',
                            data: results.err
                        });
                    }
                }
            })
        }
    })
})

module.exports = router;
