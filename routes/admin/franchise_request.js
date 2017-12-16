var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var mailObj = require('../../middlewares/Mail');

var extraVar = [];
var viewDirectory = 'franchise_requests';
var modelName = 'FranchiseRequest';
var titleName = 'Authorized Promoter';

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
    //req.where = {status: 1};


    var serObj = {status: 1}
    var searchStr = '';
    async.forEachOf(req.query, function (getData, key, callback) {
        if (key != 'page') {
            searchStr += '&' + key + '=' + getData;
        }
        if (getData != '' && key != 'page')
            serObj[key] = {$like: '%' + getData + '%'};
    });
    extraVar['searchStr'] = searchStr;
    req.where = serObj;


    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['query'] = req.query;
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});

router.get('/view/:id', function (req, res, next) {
    var id = req.params.id;
    models[modelName].getById(id, function (my_model) {
        async.parallel({
            country: function (callback) {
                models.Country.getById(my_model.country_id, function (data) {
                    callback(null, data);
                });
            },
            state: function (callback) {
                models.State.getById(my_model.state_id, function (data) {
                    callback(null, data);
                });
            },
            division: function (callback) {
                models.Division.getById(my_model.division_id, function (data) {
                    callback(null, data);
                });
            },
            district: function (callback) {
                models.District.getById(my_model.district_id, function (data) {
                    callback(null, data);
                });
            },
            tehsil: function (callback) {
                models.Tehsil.getById(my_model.tehsil_id, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            console.log(results.country)
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(results.state)
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            console.log(results.division)
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(results.district)
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            console.log(results.tehsil)
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            results.my_model = my_model;
            res.render('admin/' + viewDirectory + '/view', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
        });
    });

});

router.get('/download_pdf/:id', function (req, res, next) {
    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {
        
        var fullUrl = req.protocol + '://' + req.get('host');
        var request = require("request");
        var options = {method: 'GET',
            url: fullUrl + '/admin/franchise_requests/pdf/' + req.params.id,
            headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    },
        };
        var fileName = results.dataValues.contact_person + '_' + results.dataValues.id + '.pdf';
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
                        default: '<p style="height:30px;"></p><span style="display: inline-block;text-align: center;width: 100%;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span></span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
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

router.get('/pdf/:id', function (req, res, next) {
    var id = req.params.id;
    models[modelName].getById(id, function (my_model) {
        async.parallel({
            country: function (callback) {
                models.Country.getById(my_model.country_id, function (data) {
                    callback(null, data);
                });
            },
            state: function (callback) {
                models.State.getById(my_model.state_id, function (data) {
                    callback(null, data);
                });
            },
            division: function (callback) {
                models.Division.getById(my_model.division_id, function (data) {
                    callback(null, data);
                });
            },
            district: function (callback) {
                models.District.getById(my_model.district_id, function (data) {
                    callback(null, data);
                });
            },
            tehsil: function (callback) {
                models.Tehsil.getById(my_model.tehsil_id, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            results.my_model = my_model;
            res.render('admin/' + viewDirectory + '/pdf', {results: results, extraVar: extraVar, layout: false});
        });
    });

});

module.exports = router;
