var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

var extraVar = [];
var viewDirectory = 'file_disputes';
var modelName = 'FileDispute';
var titleName = 'File Disputes';

extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;


//app.use(adminAuth.isAllow);

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
    //res.render('admin/categories/index', {title: 'Express', layout: 'admin/layout/layout'});
});


router.get('/add', function (req, res, next) {
    async.parallel({
        country: function (callback) {
            req.where = {}
            models.Country.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        results['states'] = [];
        results['divisions'] = [];
        results['districts'] = [];
        results['tehsils'] = [];

        res.render('admin/' + viewDirectory + '/add', {data: results, extraVar: extraVar, layout: 'admin/layout/layout', fromData: []});
    });

});

router.get('/edit/:id', function (req, res, next) {
    var id = req.params.id;
    req.where = {'id': id}
    models[modelName].getFirstValues(req, function (my_model) {
        async.parallel({
            country: function (callback) {
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
                req.where = {state_id: my_model.state_id}
                models.Division.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            districts: function (callback) {
                req.where = {division_id: my_model.division_id}
                models.District.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            tehsils: function (callback) {
                req.where = {district_id: my_model.district_id}
                models.Tehsil.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            results.my_model = my_model;
            console.log(results)
            res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
        });
    });
});


router.post('/delete/:id', function (req, res, next) {
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
            req.body.image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            console.log("------------------ COntact Enquiries Data Starts ---------------------->>>>>>>>>>>>>>>>>>>>>")
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
                            // req.flash('type_messages', 'success');
                            // req.flash('messages', 'Added successfully!');
                            // res.status(200).send({status: true, url: '/pages/contact-us'});
                            res.status(200).send({status: true, url: '/pages/file-disputes', msg: 'Thank you for submitting your details, our team will contact you soon.'});
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

router.get('/pdf/:id', function (req, res, next) {
    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {
        res.render('admin/' + viewDirectory + '/pdf', {results: results, layout: false});
    });
});

router.get('/download_pdf/:id', function (req, res, next) {

    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {
        console.log(results.dataValues.doc_type)
        var fullUrl = req.protocol + '://' + req.get('host');

        var request = require("request");

        var options = {method: 'GET',
            url: fullUrl + '/admin/file-disputes/pdf/' + req.params.id,
            headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    },
        };
        var fileName = results.dataValues.doc_type + '_' + results.dataValues.doc_value + '.pdf';

        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);

            var pdf = require('html-pdf');
            var options = {
                format: 'A4',
                "border": {
                    "top": "30px",
                    "right": "10px",
                    "bottom": "20px",
                    "left": "2px"
                },
                "header": {
                    "height": "0px",
                    //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
                },
                "footer": {
                    "height": "10mm",
                    "contents": {
                        default: '<p style="height:30px;"></p><span style="display: inline-block;text-align: center;width: 100%;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of '+ results.dataValues.doc_type +' Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
                    }
                }
            };
            html = body;
            pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
                if (err)
                    return console.log(err);
                //console.log(res); // { filename: '/app/businesscard.pdf' } 
                res.download('./public/pdfs/' + fileName, fileName);
            });

            //res.send(body);
        });
    });
});

module.exports = router;
