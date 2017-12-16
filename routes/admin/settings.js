var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var multer = require('multer');
var upload = multer();
router.use(adminAuth.isAdmin);
var viewDirectory = 'settings';
var modelName = 'Setting';
var titleName = 'Setting';

var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;
/* GET users listing. */

router.get('/', adminAuth.isAllow, function (req, res, next) {
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

router.get('/edit/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    async.parallel({
        my_model: function (callback) {
            req.where = {'id': id}
            models[modelName].getFirstValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        res.render('admin/' + viewDirectory + '/add', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});

router.post('/update', upload.array(), function (req, res, next) {
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPP")
    console.log(req.body)
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPP")
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
                res.status(400).send({status: false, msg: ' saved failed', data: errors});
            }
    });
});
module.exports = router;
