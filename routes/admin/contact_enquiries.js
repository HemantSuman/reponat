var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var fs = require('fs');
var request = require('request');
var extraVar = [];
var viewDirectory = 'contact_enquiries';
var modelName = 'ContactEnquiry';
var titleName = 'Contact Enquiries';

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

router.post('/respond', function (req, res, next) {
    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {

        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            console.log("------------------ Here is the data ------------------->>>>>>>>>>>>>>>")
            console.log(req.body)

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
                    req.body.responded_date = req.app.locals.site.momentObj().format('YYYY-MM-DD');
                    req.body.status = 2;
                    models[modelName].updateAllValues(req, function (results) {
                        if (results.status) {
                            req.flash('type_messages', 'success');
                            req.flash('messages', 'Updated successfully!');
                            res.status(200).send({status: true, url: '/admin/contact-enquiries'});
                        } else {
                            res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                        }
                    });

                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });




            // if (results.status) {
            //     req.flash('type_messages', 'success');
            //     req.flash('messages', 'Updated successfully!');
            //     res.status(200).send({status: true, url: '/admin/' + viewDirectory});
            // } else {
            //     res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
            // }
        }
    })
    // models[modelName].respond(req, function (data) {

    // });

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
                    req.body.created = req.app.locals.site.momentObj().format('YYYY-MM-DD');
                    models[modelName].saveAllValues(req, function (results) {
                        if (results.status) {
                            // req.flash('type_messages', 'success');
                            // req.flash('messages', 'Added successfully!');
                            // res.status(200).send({status: true, url: '/pages/contact-us'});
                            res.status(200).send({status: true, url: '/pages/contact-us', msg: 'Your enquiry has been submitted successfully. Nyaya Portal Executive will contact you soon. Thank You !!'});
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

router.get('/download_excel', function (req, res, next) {
    req.where = {};
    models[modelName].getAllValues(req, function (results) {

        fileName = req.app.locals.site.momentObj().toDate().getTime() + '.xls';
        var writeStream = fs.createWriteStream('./public/uploads/temp_file/' + fileName);

        var rowString = 'Name'+ '\t' + 'Mobile No.' + '\t' + 'Email' + '\t' + 'Enquiry' + '\t' + 'Enquiry date' + '\n';
        async.forEachOf(results, function (value, key, callback) {

            rowString += value.dataValues.name + "\t";
            rowString += value.dataValues.mobile + "\t";
            rowString += value.dataValues.email + "\t";
            rowString += value.dataValues.enquiry_detail.replace(/(\r\n|\n|\r)/gm, "") + "\t";
            rowString += req.app.locals.site.momentObj(value.dataValues.created).format('YYYY-MM-DD HH:mm:ss').toString() + "\t";
            rowString += "\n";
            callback();
        }, function (err) {
            writeStream.write(rowString, function () {
                writeStream.close();
                res.download('./public/uploads/temp_file/' + fileName, fileName);
            })
        });
    });

});

module.exports = router;
