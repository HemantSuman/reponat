var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var mailObj = require('../../middlewares/Mail');
var adminAuth = require('../../middlewares/Auth');
var extraVar = [];
var viewDirectory = 'membership_plans';
var modelName = 'MembershipPlan';
var titleName = 'Membership';
var sequelize = require('../../config/db');

var pdfPage = require('pdf-write-page');

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
        //res.send(results)
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});



router.get('/view', adminAuth.isAllow, function (req, res, next) {

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
    req.where = {is_active: 1};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index_view', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});


router.get('/add', adminAuth.isAllow, function (req, res, next) {
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
        //res.send(results)
        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.post('/get-year-wise-fee-ui', function (req, res, next) {
    res.render('admin/' + viewDirectory + '/per_year_fee_table_ui', {reqData: req.body, layout: false});
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

                    // },
                    // function (callback) {

                    //     async.forEach(req.body.membership_plan_fees, function (value1, callback1) {
                    //         var MembershipPlanFeeBuild = models.MembershipPlanFee.build(value1);
                    //         MembershipPlanFeeBuild.validate().then(function (err) {
                    //             if (err != null) {
                    //                 async.forEach(err.errors, function (errObj, callback2) {
                    //                     errObj.path = errObj.path + '_' + value1.number_of_years;
                    //                     errors = errors.concat(errObj);
                    //                 });
                    //             }
                    //             callback1(null, errors);

                    //         });
                    //     }, function (err) {
                    //         callback(null, errors);
                    //     });    
                }], function (err) {
                if (errors.length == 0) {
                    if (typeof req.body.membership_plan_fees === "undefined") {
                        res.status(201).send({status: false, message: 'Please add at least one plan.', data: []});
                    } else {
                        models[modelName].checkAlreadyExist(req, function (checkStatus) {
                            if (checkStatus.status) {
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
                    }
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
                    async.forEachOf(req.body.membership_plan_fees, function (value1, kkk, callback1) {
                        var MembershipPlanFeeBuild = models.MembershipPlanFee.build(value1);
                        MembershipPlanFeeBuild.validate().then(function (err) {
                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + kkk;
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
                        if (checkStatus.status) {
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

router.post('/delete/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory});
    });

});

router.get('/issues_memberships', adminAuth.isAllow, function (req, res, next) {

    async.parallel({
        busines: function (callback) {
            req.where = {is_active: 1}
            models.BusinessType.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        busines_category: function (callback) {
            req.where = {is_active: 1}
            models.BusinessCategory.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        countries: function (callback) {
            models['Country'].getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        states: function (callback) {
            req.where = {country_id: 1};
            models['State'].getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        membership_plans: function (callback) {
            req.where = {is_active: 1}
            models['MembershipPlan'].getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        government_id_types: function (callback) {
            req.where = {is_active: 1}
            models['GovernmentIdType'].getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        states_is_business: function (callback) {
            req.where = {is_business_available: 1}
            models.State.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
    }, function (err, data) {
//        res.send(data);
        res.render('admin/' + viewDirectory + '/issues_memberships', {data: data, extraVar: extraVar, layout: 'admin/layout/layout'});
        // results is now equals to: {one: 1, two: 2}
    });

});

router.get('/certificate/:id/:show', function (req, res, next) {
    //req.where = {id: req.params.id};
    models['MembershipPlanIssue'].getAllPlanData(req, function (results) {

        console.log(results);
        var layoutIS = false;
        if (req.params.show == 1) {
            layoutIS = 'admin/layout/layout';
        }

        res.render('admin/' + viewDirectory + '/certificate', {data: results[0], layout: layoutIS, show: req.params.show});
    });
});

router.get('/fee/:id', function (req, res, next) {

    models['MembershipPlanIssue'].getFee(req, function (results) {

        res.send(results);
    });
});


router.get('/invoice/:id/:show', function (req, res, next) {
    req.where = {};
    var layoutIS = false;
    if (req.params.show == 1) {
        layoutIS = 'admin/layout/layout';
    }
    models['MembershipPlanIssue'].getAllPlanData(req, function (results) {

        res.render('admin/' + viewDirectory + '/invoice', {data: results[0], results: results, layout: layoutIS, show: req.params.show});
    });
});


router.get('/download_certificate/:id/:show', function (req, res, next) {

    var fullUrl = req.protocol + '://' + req.get('host') //+ req.originalUrl;
    var request = require("request");

    var options = {method: 'GET',
        url: fullUrl + '/admin/membership_plans/certificate/' + req.params.id + '/' + req.params.show,
        headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
    };
    var fileName = 'certificate' + req.params.id + '.pdf';

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
            }
        };

        html = body;
        pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
            if (err)
                return console.log(err);
            //console.log(res); // { filename: '/app/businesscard.pdf' } 

            var pdftojson = require('pdftojson');    
            pdftojson('./public/pdfs/' + fileName).then((output) => {
                
            var totalPageCount=output.length;  

            console.log('totalPageCount===================');
            console.log(totalPageCount);    

            console.log('i');
            

            for(var i=0; i<totalPageCount; i++){

            var y=100;   

            if(i==0)
             y=300  

            console.log(i); 

            pdfPage({in:'./public/pdfs/'+fileName, out:'./public/pdfs/'+fileName,pageNumber:i})
            .page(i)
            .image(80, y, './public/images/chk.png',{transformation:{width:400,height:400}})
            .restoreCfg()
            .end()    

            }  


            res.download('./public/pdfs/' + fileName, fileName);

            });

        });

        //res.send(body);
    });

});



router.get('/download_invoice/:id/:show', function (req, res, next) {

    var fullUrl = req.protocol + '://' + req.get('host') //+ req.originalUrl;
    var request = require("request");

    var options = {method: 'GET',
        url: fullUrl + '/admin/membership_plans/invoice/' + req.params.id + '/' + req.params.show,
        headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
    };
    var fileName = 'invoice_membership' + req.params.id + '.pdf';

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




router.post('/create_issue', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            if (typeof req.body.selected_plan_year == 'undefined') {
                req.body.selected_plan_year = '';
            }
            req.body.add_date = req.app.locals.site.momentObj().format('YYYY-MM-DD');
            req.body.user_id = req.user.id;
            req.body.franchise_id = req.user.franchise_id;
            req.body.plan_name = req.body.business_turn_over.split('@!@#')[1];
            req.body.business_turn_over = req.body.business_turn_over.split('@!@#')[0];

            console.log(req.body);
            var modelBuild = models['MembershipPlanIssue'].build(req.body);
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
                    req.body.tehsil_ap = req.body.franchise_id;
                    models['FranchiseLevel'].getAllParentFromTehsilId(req, function (ap_chain) {
                        //req.body.franchise_id = ProfessinalAPid;
                        req.body.franchise_district_id = ap_chain[0].district_level;
                        req.body.franchise_division_id = ap_chain[0].division_level;
                        req.body.franchise_state_id = ap_chain[0].state_level;
                        req.body.franchise_country_id = ap_chain[0].country_level;
                        models['MembershipPlanIssue'].saveAllValues(req, function (results) {
                            console.log('results########')
                            console.log(results)
                            if (results.status) {

                                req.id = results.id;
                                req.product_id = 3;
                                req.service_detail_id = '';
                                models['CommissionDistribution'].saveCommissionMembership(req, function (dataArr) {
                                    req.flash('type_messages', 'success');
                                    req.flash('messages', 'Added successfully!');
                                    res.status(200).send({status: true, url: '/admin/commission_distributions/pay/' + results.id + '/2'});
                                });

                            } else {
                                res.status(400).send({status: false, msg: ' saved  failed', data: results.errors});
                            }
                        });
                    });
                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }
    });
});


router.post('/issue_listings', function (req, res, next) {
    res.redirect('/admin/membership_plans/issue_listings');

});

router.get('/issue_listings', adminAuth.isAllow, function (req, res, next) {

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
    console.log(req.user.user_type.role_type_slug);
    if (req.user.user_type.role_type_slug == 'super_admin') {
        console.log('1');
        req.where = {is_active: 1};
    } else if (req.user.user_type.role_type_slug == 'franchise') {

        req.where = {
            is_active: 1,
            $or: [
                {franchise_id: req.user.id},
                {franchise_district_id: req.user.id},
                {franchise_division_id: req.user.id},
                {franchise_state_id: req.user.id},
                {franchise_country_id: req.user.id},
            ]
        };
    } else {
        req.where = {user_id: req.user.id, $or: [{is_active: 1}, {is_active: 2, parent_membership_id: null}]};
//        req.where = {user_id: req.user.id};
    }

    req.offset = offset;
    req.limit = limit;
    console.log(req.where);
    models['MembershipPlanIssue'].getAllValuesPaging(req, function (results) {
//        res.send(results)
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        console.log(results.rows);
        //res.send(results);
        serchData = req.query;
        //res({apLoc: apLoc, results: results});
        res.render('admin/' + viewDirectory + '/issue_listings', {results: results.results, apLoc: results.apLoc, extraVar: extraVar, layout: 'admin/layout/layout', serchData: serchData});
    });
});

router.post('/calculate_tax', function (req, res, next) {
    req.where = {};
    req.body.is_renew = req.body.is_renew;
    models['MembershipPlanIssue'].getFee(req, function (results) {

        res.send(results);
//        res.render('admin/' + viewDirectory + '/invoice', {results: results, layout: 'admin/layout/layout'});
    });
});

router.post('/renew-reminder', function (req, res, next) {
    req.where = {id: 1}
    models['MembershipPlanIssue'].getMembershipForRenewReminder(req, function (results) {
        var fields_to_be_replaced = {
            user_name: results.user.first_name,
            membership_number: results.ms_id,
            due_date: "01 Jan, 1901"
        }
        var mail_option = {
            to: results.user.email
        }
        var email_template_slug = "membership_renewal_reminder_mail",
                values_to_be_replaced = fields_to_be_replaced,
                mail_options = mail_option;
        mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
    })
})


router.post('/save_as_draft', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
//            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

//            setProductType(req.body.product_id)
            console.log('req.bodyTTTTTTTT');
            console.log(req.body);
//            res.send();

            req.body.add_date = req.app.locals.site.momentObj().format('YYYY-MM-DD');
            req.body.user_id = req.user.id;
            req.body.is_active = 2;
            req.body.franchise_id = req.user.franchise_id;
            if (typeof req.body.business_turn_over != 'undefined') {
                req.body.plan_name = req.body.business_turn_over.split('@!@#')[1];
                req.body.business_turn_over = req.body.business_turn_over.split('@!@#')[0];
            }
            async.parallel([
                function (callback) {
                    async.forEachOf(req.body, function (value, key, callback0) {

                        if (value == '' || value == 0 || value == 'undefined' || typeof value == 'undefined') {
                            delete req.body[key];
                        }
                        callback0(null);
                    }, function (err) {
                        callback(null);
                    });
                }
            ], function (err) {
                console.log(req.body);
                req.body.tehsil_ap = req.body.franchise_id;
                models['FranchiseLevel'].getAllParentFromTehsilId(req, function (ap_chain) {
                    req.body.franchise_district_id = ap_chain[0].district_level;
                    req.body.franchise_division_id = ap_chain[0].division_level;
                    req.body.franchise_state_id = ap_chain[0].state_level;
                    req.body.franchise_country_id = ap_chain[0].country_level;

                    models['MembershipPlanIssue'].saveDraftIssue(req, function (results) {
                        if (results.status) {

                            res.status(200).send({status: true, results: results, url: '/admin/' + viewDirectory + '/issue_listings'});

                        } else {
                            res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                        }
                    });

                });

            });
        }
    });
});

router.get('/edit_issue/:id', function (req, res, next) {
    var id = req.params.id;

    req.where = {'id': id}
    models['MembershipPlanIssue'].getFirstValuesForEditIssue(req, function (results) {

        if (results.results.is_active != 2) {
            res.redirect('/admin/membership_plans/issue_listings');
            return false;
        }
        //var formValue = data;
        async.parallel({
            business_Types: function (callback) {
                req.where = {}
                models.BusinessType.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            business_category: function (callback) {
                req.where = {}
                models.BusinessCategory.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            countries: function (callback) {
                req.where = {}
                models.Country.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            business_states: function (callback) {
                if (results.results.business_country_primary_id) {
                    req.where = {country_id: results.results.business_country_primary_id}
                } else {
                    req.where = {country_id: 1}
                }
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            business_divisions: function (callback) {
                if (results.results.business_state_primary_id) {
                    req.where = {state_id: results.results.business_state_primary_id}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, '');
                }
            },
            business_district: function (callback) {
                if (results.results.business_division_primary_id) {
                    req.where = {division_id: results.results.business_division_primary_id}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, '');
                }
            },
            business_tehsil: function (callback) {
                if (results.results.business_district_primary_id) {
                    req.where = {district_id: results.results.business_district_primary_id}
                    models.Tehsil.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, '');
                }
            },
            government_id_types: function (callback) {
                req.where = {}
                models.GovernmentIdType.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            authority_states: function (callback) {
                if (results.results.authority_country_primary_id) {
                    req.where = {country_id: results.results.authority_country_primary_id}
                } else {
                    req.where = {country_id: 1}
                }
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            authority_divisions: function (callback) {
                if (results.results.authority_state_primary_id) {
                    req.where = {state_id: results.results.authority_state_primary_id}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, '');
                }
            },
            authority_district: function (callback) {
                if (results.results.authority_division_primary_id) {
                    req.where = {division_id: results.results.authority_division_primary_id}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, '');
                }
            },
            authority_tehsil: function (callback) {
                if (results.results.authority_district_primary_id) {
                    req.where = {district_id: results.results.authority_district_primary_id}
                    models.Tehsil.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, '');
                }
            },
            membership_plans: function (callback) {
                req.where = {}
                models.MembershipPlan.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            invoice_states: function (callback) {
                req.where = {country_id: 1}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            states_is_business: function (callback) {
                req.where = {is_business_available: 1}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
        }, function (err, data) {

//            res.send(results.fee);
            res.render('admin/' + viewDirectory + '/edit_issue', {fee: results.fee, results: results.results, data: data, extraVar: extraVar, layout: 'admin/layout/layout'});
        });
//        callback(null, data);
    });



});


router.get('/renewable_list', function (req, res, next) {

    var limit = req.app.locals.site.pageLimit;
    var currentPage = 1;
    var offset = 1;

    srhData = req.query;
    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }
    extraVar['currentPage'] = currentPage;
    extraVar['next'] = currentPage + 1;
    extraVar['pre'] = currentPage - 1;

    var current_with_after_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).add(req.app.locals.settingData.membership_renewal_after_days, 'days').format('YYYY-MM-DD');
    var current_with_before_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).subtract(req.app.locals.settingData.membership_renewal_before_days, 'days').format('YYYY-MM-DD');

    if (req.user.user_type.role_type_slug == 'super_admin' || req.user.user_type.user_role.role_slug == 'admin_users') {
        req.where = {};
    } else {

        if (typeof srhData.start_date != 'undefined' && typeof srhData.end_date != 'undefined') {
            //is_active: 1, user_id: req.user.id, is_renewed: 0,
            req.where = [
                sequelize.where(
                        sequelize.fn('DATE_ADD', sequelize.col('MembershipPlanIssue.end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.membership_renewal_after_days + ' DAY')),
                        {
                            $gte: req.app.locals.site.momentObj(srhData['start_date'], 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            $lte: req.app.locals.site.momentObj(srhData['end_date'], 'DD-MM-YYYY').format('YYYY-MM-DD')
                        }), {is_active: 1, user_id: req.user.id, is_renewed: 0}];

        } else {
            req.where = {is_active: 1, user_id: req.user.id, is_renewed: 0,

                end_date: sequelize.where(sequelize.fn('curdate'), {
                    $gte: sequelize.fn('DATE_SUB', sequelize.col('MembershipPlanIssue.end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.membership_renewal_before_days + ' DAY')),
                    $lte: sequelize.fn('DATE_ADD', sequelize.col('MembershipPlanIssue.end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.membership_renewal_after_days + ' DAY'))
                })
            };
        }
    }

    req.offset = offset;
    req.limit = limit;
    models['MembershipPlanIssue'].getRenewValuesPaging(req, function (results) {
        serchData = req.query;
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/renew_list', {results: results, serchData: serchData, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});

router.get('/renewable_list_pdf', function (req, res, next) {

    srhData = req.query;
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

    var current_with_after_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).add(req.app.locals.settingData.membership_renewal_after_days, 'days').format('YYYY-MM-DD');
    var current_with_before_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).subtract(req.app.locals.settingData.membership_renewal_before_days, 'days').format('YYYY-MM-DD');


    if (srhData.start_date != '' && typeof srhData.start_date != 'undefined' && srhData.end_date != '' && typeof srhData.end_date != 'undefined') {
        //is_active: 1, user_id: req.query.user_id, is_renewed: 0,
        req.where = [
            sequelize.where(
                    sequelize.fn('DATE_ADD', sequelize.col('MembershipPlanIssue.end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.membership_renewal_after_days + ' DAY')),
                    {
                        $gte: req.app.locals.site.momentObj(srhData['start_date'], 'DD-MM-YYYY').format('YYYY-MM-DD'),
                        $lte: req.app.locals.site.momentObj(srhData['end_date'], 'DD-MM-YYYY').format('YYYY-MM-DD')
                    }), {is_active: 1, user_id: req.query.user_id, is_renewed: 0}];
    } else {
        req.where = {is_active: 1, user_id: req.query.user_id, is_renewed: 0,

            end_date: sequelize.where(sequelize.fn('curdate'), {
                $gte: sequelize.fn('DATE_SUB', sequelize.col('MembershipPlanIssue.end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.membership_renewal_before_days + ' DAY')),
                $lte: sequelize.fn('DATE_ADD', sequelize.col('MembershipPlanIssue.end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.membership_renewal_after_days + ' DAY'))
            })
        };
    }

    req.offset = offset;
    req.limit = limit;
    models['MembershipPlanIssue'].getRenewValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/renew_list', {results: results, extraVar: extraVar, layout: false});
    });
});


router.get('/renew_list_download/', function (req, res, next) {
    serchData = req.query;

    serchData.user_id = req.user.id;
    var fullUrl = req.protocol + '://' + req.get('host');
    var request = require("request");
    var options = {method: 'GET',
        url: fullUrl + '/admin/membership_plans/renewable_list_pdf/?start_date=' + serchData.start_date + '&end_date=' + serchData.end_date + '&user_id=' + serchData.user_id + '&' + '&pdf_flag=' + serchData.pdf_flag,
        headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
    };
    var fileName = 'renew-list.pdf';
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
                    default: '<p style="height:20px;"></p><span style="display: inline-block;text-align: center;width: 100%;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span>  Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
                }
            }
        };
        html = body;
        console.log(html);
        pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
            if (err)
                return console.log(err);
            //console.log(res); // { filename: '/app/businesscard.pdf' } 
            res.download('./public/pdfs/' + fileName, fileName);
        });
        //res.send(body);
    });
});

router.get('/renew_membership/:id', function (req, res, next) {
    var id = req.params.id;

    var current_with_after_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).add(req.app.locals.settingData.membership_renewal_after_days, 'days').format('YYYY-MM-DD');
    var current_with_before_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).subtract(req.app.locals.settingData.membership_renewal_before_days, 'days').format('YYYY-MM-DD');

    req.where = {
        id: id, is_active: 1, user_id: req.user.id,
        end_date: sequelize.where(sequelize.fn('curdate'), {
            $gte: sequelize.fn('DATE_SUB', sequelize.col('MembershipPlanIssue.end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.membership_renewal_before_days + ' DAY')),
            $lte: sequelize.fn('DATE_ADD', sequelize.col('MembershipPlanIssue.end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.membership_renewal_after_days + ' DAY'))
        })
//        end_date: {$between: [current_with_before_days, current_with_after_days]},

//        end_date: {
//            $lte: current_with_after_days,
//            $gt: current_with_before_days
//        }
    };
    models['MembershipPlanIssue'].getFirstValuesForEditIssue(req, function (results) {

        if (!results) {
            req.flash('type_messages', 'info');
            req.flash('messages', 'Not Eligible for Renewable');
            res.redirect('/admin/membership_plans/renewable_list');
            return false;
        }

        async.parallel({
            government_id_types: function (callback) {
                req.where = {}
                models.GovernmentIdType.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            membership_plans: function (callback) {
                req.where = {}
                models.MembershipPlan.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            invoice_states: function (callback) {
                req.where = {country_id: 1}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            states_is_business: function (callback) {
                req.where = {is_business_available: 1}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
        }, function (err, data) {
//            res.send(results);
            res.render('admin/' + viewDirectory + '/renew_membership', {fee: results.fee, results: results.results, data: data, extraVar: extraVar, layout: 'admin/layout/layout'});
        });
    });

});


router.post('/create_renew', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            if (typeof req.body.selected_plan_year == 'undefined') {
                req.body.selected_plan_year = '';
            }

            var modelBuild = models['MembershipPlanIssue'].build(req.body);
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
                    req.where = {id: req.body.id};
                    models['MembershipPlanIssue'].getFirstValuesForEditIssue(req, function (results_parent) {

                        var plan_name = req.body.business_turn_over.split('@!@#')[1];
                        var business_turn_over = req.body.business_turn_over.split('@!@#')[0];
                        var business_turn_over_primary_id = req.body.business_turn_over_primary_id;
                        var selected_plan_year = req.body.selected_plan_year;
                        var place_of_arbitration = req.body.place_of_arbitration;

                        results_parent = results_parent.results.get({plain: true});
//                        console.log('results_parent')
//                        console.log(results_parent.add_date)
                        req.body = results_parent;
                        req.body.parent_membership_id = results_parent.id;
                        req.body.selected_plan_year = selected_plan_year;
                        req.body.place_of_arbitration = place_of_arbitration;
                        req.body.parent_membership_period = req.app.locals.site.momentObj(results_parent.add_date).format('DD-MM-YYYY') + ' To ' + req.app.locals.site.momentObj(results_parent.end_date).format('DD-MM-YYYY');

                        delete req.body.id;
                        delete req.body.ms_id;
                        delete req.body.invoice_no;
                        req.body.add_date = req.app.locals.site.momentObj(results_parent.end_date).add(1, 'days').format('YYYY-MM-DD');

                        req.body.plan_name = plan_name;
                        req.body.business_turn_over = business_turn_over;
                        req.body.business_turn_over_primary_id = business_turn_over_primary_id;

                        req.body.payment_detail = '';
                        req.body.is_active = 2;

                        req.body.tehsil_ap = req.body.franchise_id;
                        models['FranchiseLevel'].getAllParentFromTehsilId(req, function (ap_chain) {
                            req.body.franchise_district_id = ap_chain[0].district_level;
                            req.body.franchise_division_id = ap_chain[0].division_level;
                            req.body.franchise_state_id = ap_chain[0].state_level;
                            req.body.franchise_country_id = ap_chain[0].country_level;
                            console.log(req.body)
                            models['MembershipPlanIssue'].saveAllValuesRenew(req, function (results) {

                                if (results.status) {

                                    req.id = results.id;
                                    req.product_id = 3;
                                    req.service_detail_id = '';
                                    models['CommissionDistribution'].saveCommissionMembership(req, function (dataArr) {
                                        console.log('results########')
                                        console.log(results)
                                        req.flash('type_messages', 'success');
                                        req.flash('messages', 'Added successfully!');
                                        res.status(200).send({status: true, url: '/admin/commission_distributions/pay/' + results.id + '/2'});
//                                res.status(200).send({status: true, url: '/admin/membership_plans/certificate/' + results.id + '/1'});
                                    });

                                } else {
                                    console.log('results%%%%%%%%%%')
                                    res.status(400).send({status: false, msg: ' saved  failed', data: results.errors});
                                }
                            });
                        });
                    });
                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }
    });
});
module.exports = router;
