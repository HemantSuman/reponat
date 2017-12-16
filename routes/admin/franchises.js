var models = require('../../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var XlsUpload = require('../../middlewares/XlsUpload');
var async = require("async");
var randomstring = require("randomstring");
var moment = require("moment");
var multer = require('multer');
var upload = multer();
var mail = require('../../middlewares/Mail');
var mailObj = require('../../middlewares/Mail');
//router.use(adminAuth.isAdmin);
var viewDirectory = 'franchises';
var modelName = 'Franchise';
var titleName = 'Authorized Promoter';
var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;
var otpObj = require('../../middlewares/Otp');
/* GET users listing. */


router.get('/', adminAuth.isAdmin, function (req, res, next) {

    models[modelName].getList(req, function (userData) {
        //res.send(userData)
        async.parallel({
            professional: function (callback) {
                req.where = {role_id: req.params.role_id}
                models.RoleType.getByType(req, function (data) {
                    callback(null, data);
                });
            }, state: function (callback) {
                req.where = {}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, division: function (callback) {
                req.where = {state_id: req.query.state_id}
                models.Division.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, district: function (callback) {
                req.where = {division_id: req.query.division_id}
                models.District.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, tehsil: function (callback) {
                req.where = {district_id: req.query.district_id}
                models.Tehsil.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, SpecialBonus: function (callback) {
                req.where = {product_id: 4}
                models.SpecialBonus.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, data) {
            extraVar['query'] = req.query;
            res.render('admin/' + viewDirectory + '/index', {results: userData, title: '', layout: 'admin/layout/layout', extraVar: extraVar, data: data});

        });
    });
});

router.get('/view/:id/:role_type_id', adminAuth.isAdmin, function (req, res, next) {
    var serObj = {}
    var searchStr = '';
    sechStr = '';
    async.forEachOf(req.query, function (getData, key, callback) {

        if (getData != '' && key != 'page') {
            serObj[key] = getData;
        }
    });
    serObj['franchise_id'] = req.params.id;
    serObj['role_slug'] = req.params.role_type_id;

    models[modelName].getMyUsers(serObj, function (userData) {
        //res.send(userData);
        res.render('admin/' + viewDirectory + '/user-list', {results: userData, title: 'Express', layout: 'admin/layout/layout', extraVar: serObj, role_type_id: req.params.role_type_id});
    });
});


router.get('/ap-scale/:type/:user_id', function (req, res, next) {

    var sortStrNc = 'nc_order=asc&';
    if (req.query.nc_order === 'asc') {
        sortStrNc = 'nc_order=desc&';
    } else if (req.query.nc_order === 'desc') {
        sortStrNc = 'nc_order=asc&';
    }

    var sortStrM = 'm_order=asc&';
    if (req.query.m_order === 'asc') {
        sortStrM = 'm_order=desc&';
    } else if (req.query.m_order === 'desc') {
        sortStrM = 'm_order=asc&';
    }
    models[modelName].getApScale(req, function (data) {
        var urlString = req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0];
        res.render('admin/' + viewDirectory + '/ap-scale', {results: data, query_string: urlString, sortStrNc: sortStrNc, sortStrM: sortStrM, title: 'Express', layout: 'admin/layout/layout', extraVar: {}, params: req.params});
    });


});


router.get('/ap-scale/:type', function (req, res, next) {
    var sortStrNc = 'nc_order=asc&';
    if (req.query.nc_order === 'asc') {
        sortStrNc = 'nc_order=desc&';
    } else if (req.query.nc_order === 'desc') {
        sortStrNc = 'nc_order=asc&';
    }

    var sortStrM = 'm_order=asc&';
    if (req.query.m_order === 'asc') {
        sortStrM = 'm_order=desc&';
    } else if (req.query.m_order === 'desc') {
        sortStrM = 'm_order=asc&';
    }
    models[modelName].getApScale(req, function (data) {

        var urlString = req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0];
        res.render('admin/' + viewDirectory + '/ap-scale', {results: data, query_string: urlString, sortStrNc: sortStrNc, sortStrM: sortStrM, title: 'Express', layout: 'admin/layout/layout', extraVar: {}, params: req.params});
    });


});


router.get('/list-user', adminAuth.isAdmin, function (req, res, next) {


    var serObj = {}
    var searchStr = '';
    sechStr = '';
    async.forEachOf(req.query, function (getData, key, callback) {

        if (getData != '' && key != 'page') {
            serObj[key] = getData;
        }
    });
    serObj['franchise_id'] = req.user.id;
    serObj['role_type_id'] = 5;
    serObj['role_slug'] = "professional";
    serObj['query'] = req.query;

    var sortStrNc = 'nc_order=asc&';
    if (req.query.nc_order === 'asc') {
        sortStrNc = 'nc_order=desc&';
    } else if (req.query.nc_order === 'desc') {
        sortStrNc = 'nc_order=asc&';
    }

    var sortStrM = 'm_order=asc&';
    if (req.query.m_order === 'asc') {
        sortStrM = 'm_order=desc&';
    } else if (req.query.m_order === 'desc') {
        sortStrM = 'm_order=asc&';
    }

    var sortStr = '?';
    if (typeof req.query.first_name !== 'undefined') {
        sortStr += 'first_name=' + req.query.first_name + '&';
    }
    if (typeof req.query.area !== 'undefined') {
        sortStr += 'area=' + req.query.area + '&';
    }
    if (typeof req.query.mobile !== 'undefined') {
        sortStr += 'mobile=' + req.query.mobile + '&';
    }
    var urlString = req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0] + sortStr;

    //0=>Professional,1=>Lawyers
    if (req.user.franchise_type == 0) {
        req.where = {role_id: 1, role_type_slug: {$ne: 'lawyers'}};
    } else {
        req.where = {role_id: 1, role_type_slug: 'lawyers'}
    }


    models.RoleType.getByType(req, function (data) {

        models[modelName].getMyUsers(serObj, function (userData) {
            models['Franchise'].getTehsilByAp(req, function (thData) {
                res.render('admin/' + viewDirectory + '/list-user', {results: userData, query_string: urlString, sortStrNc: sortStrNc, sortStrM: sortStrM, title: 'Express', layout: 'admin/layout/layout', extraVar: serObj, data: data, thData: thData});
            });
        });
    });


});

router.get('/add-user', adminAuth.isAdmin, function (req, res, next) {
    models[modelName].getList(req.user.id, function (userData) {
        //res.send(userData)
        res.render('admin/' + viewDirectory + '/add_user', {results: userData, title: 'Express', layout: 'admin/layout/layout', extraVar: {}});
    });
});

router.get('/list-deed-writer', adminAuth.isAdmin, function (req, res, next) {


    var serObj = {}
    var searchStr = '';
    sechStr = '';
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    console.log(req.query)
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    async.forEachOf(req.query, function (getData, key, callback) {

        if (getData != '' && key != 'page') {
            serObj[key] = getData;
        }
    });
    serObj['franchise_id'] = req.user.id;
    //serObj['role_type_id'] = 5;
    serObj['role_type_id'] = 'deed_writer';
    serObj['role_slug'] = "service_provider";
    serObj['query'] = req.query;

    models[modelName].getAssociatedDeedWriters(serObj, function (userData) {
        models.User.getById(req.user.id, function (login_user_data) {
            res.render('admin/' + viewDirectory + '/list-deed-writer', {results: userData, title: 'Express', layout: 'admin/layout/layout', extraVar: serObj, login_user_data: login_user_data});
        });

    });
});



router.post('/delete/:id/:user_type', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {id: id};
    req.body = {'is_active': req.body.statusUpdated};
    models['User'].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');

        var url = '/admin/' + viewDirectory + '/' + req.params.user_type;
        if (req.params.user_type == '5') {
            var url = '/admin/franchises';
        }

        res.status(200).send({status: true, url: url});
    });
});


router.get('/add-deed-writer', adminAuth.isAdmin, function (req, res, next) {
    models[modelName].getList(req.user.id, function (userData) {
        //res.send(userData)
        res.render('admin/' + viewDirectory + '/add_deed_writer', {results: userData, title: 'Express', layout: 'admin/layout/layout', extraVar: {}});
    });
});

router.post('/load-parent', function (req, res, next) {
    async.parallel({
        data: function (callback) {
            req.where = {}
            models.Franchise.getParent(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/load-parent', {data: results, layout: false});
    });
});




router.post('/load-level', function (req, res, next) {
    async.parallel({
        busines: function (callback) {
            req.where = {}
            models.BusinessType.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        busines_category: function (callback) {
            req.where = {}
            models.BusinessCategory.getAllValues(req, function (data) {
                callback(null, data);
            });
        },
        franchise_levels: function (callback) {
            req.where = {}
            models.FranchiseCommissionLevel.getAllValues(req, function (data) {
                callback(null, data['rows']);
            });
        },
        professional: function (callback) {
            req.where = {role_id: req.params.role_id}
            models.RoleType.getByType(req, function (data) {
                callback(null, data);
            });
        }, country: function (callback) {
            req.where = {}
            models.Country.getAllValues(req, function (data) {
                callback(null, data);
            });
        }, SpecialBonus: function (callback) {
            req.where = {}
            models.SpecialBonus.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        results['states'] = [];
        results['divisions'] = [];
        results['districts'] = [];
        results['tehsils'] = [];
        console.log(req.body);
        if (req.body.level == '') {
            res.send('');
        } else {
            res.render('admin/' + viewDirectory + '/load-level', {data: [], layout: false, extraVar: extraVar, data:results, fromData: req.body});
        }

    });
});

router.get('/add/:role_id', adminAuth.isAllow, function (req, res, next) {
    extraVar['view_type'] = 0;
    req.where = {role_id: req.params.role_id}
    models.RoleType.getMasterId(req, function (masterData) {

        //console.log(masterData);

        extraVar['masterData'] = masterData;
        extraVar['role_id'] = req.params.role_id;
        async.parallel({
            busines: function (callback) {
                req.where = {}
                models.BusinessType.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            busines_category: function (callback) {
                req.where = {}
                models.BusinessCategory.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            franchise_levels: function (callback) {
                req.where = {}
                models.FranchiseCommissionLevel.getAllValues(req, function (data) {
                    callback(null, data['rows']);
                });
            },
            professional: function (callback) {
                req.where = {role_id: req.params.role_id}
                models.RoleType.getByType(req, function (data) {
                    callback(null, data);
                });
            }, country: function (callback) {
                req.where = {}
                models.Country.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }, SpecialBonus: function (callback) {
                req.where = {}
                models.SpecialBonus.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            results['states'] = [];
            results['divisions'] = [];
            results['districts'] = [];
            results['tehsils'] = [];
            results['requestData'] = [];

            //res.send(results);
            res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: []});
        });
    });
});



router.get('/add/:role_id/:rid', adminAuth.isAllow, function (req, res, next) {
    extraVar['view_type'] = 0;
    req.where = {role_id: req.params.role_id}
    models.RoleType.getMasterId(req, function (masterData) {

        extraVar['masterData'] = masterData;
        extraVar['role_id'] = req.params.role_id;

        models.FranchiseRequest.getById(req.params.rid, function (rsData) {
            async.parallel({
                requestData: function (callback) {
                    req.where = {}
                    models.FranchiseRequest.getById(req.params.rid, function (data) {
                        rsData = data;
                        callback(null, data);
                    });
                },
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
                franchise_levels: function (callback) {
                    req.where = {}
                    models.FranchiseCommissionLevel.getAllValues(req, function (data) {
                        callback(null, data['rows']);
                    });
                },
                professional: function (callback) {
                    req.where = {role_id: req.params.role_id}
                    models.RoleType.getByType(req, function (data) {
                        callback(null, data);
                    });
                },
                country: function (callback) {
                    req.where = {is_active: 1}
                    models.Country.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                states: function (callback) {

                    console.log('rsData-==-=-=-=-=-=-=-==-');
                    console.log(rsData);
                    console.log('rsData-==-=-=-=-=-=-=-==-');

                    req.where = {country_id: rsData.country_id, is_active: 1}
                    models.State.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                divisions: function (callback) {
                    req.where = {state_id: rsData.state_id}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                districts: function (callback) {
                    req.where = {division_id: rsData.division_id}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                tehsils: function (callback) {
                    req.where = {district_id: rsData.district_id}
                    models.Tehsil.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                }
                , SpecialBonus: function (callback) {
                    req.where = {is_active: 1}
                    models.SpecialBonus.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                }
            }, function (err, results) {


                //res.send(results);
                res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: []});
            });
        });
    });
});


router.get('/verify-account', function (req, res, next) {
    //console.log(req.user);
    res.render('admin/' + viewDirectory + '/verify_account', {layout: false, userData: req.user});
});




router.get('/edit/:role_id/:id', adminAuth.isAllow, function (req, res, next) {

    extraVar['role_id'] = req.params.role_id;
    extraVar['view_type'] = req.params.view_type;
    req.where = {role_id: req.params.role_id}
    models.RoleType.getMasterId(req, function (masterData) {

        //console.log(masterData);

        extraVar['masterData'] = masterData;
        models.Franchise.getById(req.params.id, function (data) {
            console.log(data);

            async.parallel({
                levelData: function (callback) {
                    req.data = data
                    models.Franchise.getDataByLevel(req, function (data) {
                        callback(null, data);
                    });
                },
                busines: function (callback) {
                    req.where = {}
                    models.BusinessType.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                busines_category: function (callback) {
                    req.where = {}
                    models.BusinessCategory.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                professional: function (callback) {
                    req.where = {role_id: req.params.role_id}
                    models.RoleType.getByType(req, function (data) {
                        callback(null, data);
                    });
                }, country: function (callback) {
                    req.where = {}
                    models.Country.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                states: function (callback) {
                    req.where = {country_id: data.country_id}
                    models.State.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                franchise_levels: function (callback) {
                    req.where = {}
                    models.FranchiseCommissionLevel.getAllValues(req, function (data) {
                        callback(null, data['rows']);
                    });
                },
                divisions: function (callback) {
                    req.where = {country_id: data.country_id}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                districts: function (callback) {
                    req.where = {state_id: data.state_id}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                tehsils: function (callback) {
                    req.where = {district_id: data.district_id}
                    models.Tehsil.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                }


            }, function (err, results) {
                //res.send(data);
                extraVar['viewIs'] = 0;
                res.render('admin/' + viewDirectory + '/edit', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
            });
        });
    });
});

router.get('/edit/:role_id/:id/:view', function (req, res, next) {

    extraVar['role_id'] = req.params.role_id;
    extraVar['viewIs'] = req.params.view;
    extraVar['view_type'] = req.params.view_type;
    req.where = {role_id: req.params.role_id}
    models.RoleType.getMasterId(req, function (masterData) {

        //console.log(masterData);

        extraVar['masterData'] = masterData;
        models.Franchise.getById(req.params.id, function (data) {
            console.log(data);

            async.parallel({
                levelData: function (callback) {
                    req.data = data
                    models.Franchise.getDataByLevel(req, function (data) {
                        callback(null, data);
                    });
                },
                busines: function (callback) {
                    req.where = {}
                    models.BusinessType.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                busines_category: function (callback) {
                    req.where = {}
                    models.BusinessCategory.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                professional: function (callback) {
                    req.where = {role_id: req.params.role_id}
                    models.RoleType.getByType(req, function (data) {
                        callback(null, data);
                    });
                }, country: function (callback) {
                    req.where = {}
                    models.Country.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                states: function (callback) {
                    req.where = {country_id: data.country_id}
                    models.State.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                franchise_levels: function (callback) {
                    req.where = {}
                    models.FranchiseCommissionLevel.getAllValues(req, function (data) {
                        callback(null, data['rows']);
                    });
                },
                divisions: function (callback) {
                    req.where = {country_id: data.country_id}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                districts: function (callback) {
                    req.where = {state_id: data.state_id}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                tehsils: function (callback) {
                    req.where = {district_id: data.district_id}
                    models.Tehsil.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                }


            }, function (err, results) {
                //res.send(data);
                res.render('admin/' + viewDirectory + '/edit', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
            });
        });
    });
});
router.get('/fessCall/:value/:type/:product_id/:type_id/:doc_name', function (req, res, next) {

    req.agreement_value = req.params.value;
    req.service_details_id = req.params.type;
    req.product_id = req.params.product_id;
    req.doc_name = req.params.doc_name;

    models.User.feesCalc(req, function (data) {
        res.send(data);
    });
});

router.get('/fess/:value/:type/:product_id', function (req, res, next) {

    var Sequelize = require('sequelize');
    var sequelize = require('../../config/db');

    // -------
    var doc_value = req.params.value;
    var doc_type = req.params.type;
    var product_id = req.params.product_id;
    //--------


    var registration_fee = 0;
    var arbitration_fee = 0;
    var default_percentage_value = 0;
    var slab_id = '';



    // STEP 1 ---------------------------------------------------------------------------------------------------

    var slab_query = '';

    slab_query += ' SELECT * FROM slab where ? between min_value and max_value and is_active=1 order by min_value asc limit 1 '

    sequelize.query(slab_query,
            {replacements: [doc_value], type: sequelize.QueryTypes.SELECT}
    ).then(function (slab_data) {

        if (!slab_data.length) {
            res.send({status: false, msg: 'No slab found', data: []});
        } else {

            slab_obj = slab_data[0]
            slab_id = slab_obj['id'];
            registration_fee = slab_obj['registration_fee'];
            arbitration_fee = slab_obj['arbitration_fee'];
            default_percentage_value = slab_obj['default_percentage_value'];

            sum_registrationFee_arbitrationFee = parseFloat(registration_fee) + parseFloat(arbitration_fee);

            var above_amount_is = 0;
            var above_amount_ext = 0;

            if (slab_obj['above_amount'] > 0) {
                var above_amount_is = parseFloat(doc_value) - parseFloat(slab_obj['above_amount']);
                var above_amount_ext = (above_amount_is * parseFloat(slab_obj['percentage_value'])) / 100
            }


            sum_registrationFee_arbitrationFee = above_amount_ext + sum_registrationFee_arbitrationFee;

            default_amu = 0;

            if (slab_obj['default_percentage_value'] > 0) {
                default_amu = (sum_registrationFee_arbitrationFee * parseFloat(slab_obj['default_percentage_value'])) / 100
            }

            sum_registrationFee_arbitrationFee = default_amu + sum_registrationFee_arbitrationFee;

            console.log('______________________________________________________________________________');
            console.log('Step 1 Extra Fee ' + above_amount_ext);
            console.log('Step 1 Default amu ' + default_amu);
            console.log('Step 1 Total Fees ' + sum_registrationFee_arbitrationFee);
            console.log('______________________________________________________________________________');



            // STEP 2 ------------------------------------------------------------------------------------

            slab_head_query = '';
            slab_head_query += ' SELECT  * FROM slab_heads s right join slab_head_fees s_fees '
            slab_head_query += ' on s.id=s_fees.slab_heads_id '
            slab_head_query += ' where s.slab_id=? and s.service_details_id=? and s.is_active=1 and s.product_id=? '

            sequelize.query(slab_head_query,
                    {replacements: [slab_id, doc_type, product_id], type: sequelize.QueryTypes.SELECT}
            ).then(function (slab_head_data) {
                var slab_head_total = 0;
                async.each(slab_head_data, function (slab_head_data_rows, callback) {

                    //0 is fixed / % 1

                    if (slab_head_data_rows['fee_type'] == 0) {
                        slab_head_total = parseFloat(slab_head_total) + parseFloat(slab_head_data_rows['amount']);
                    } else {
                        slab_head_total = parseFloat(slab_head_total) + (parseFloat(sum_registrationFee_arbitrationFee) * parseFloat(slab_head_data_rows['amount'])) / 100
                    }

                    callback();
                }, function (err) {
                    console.log(err);
                });

                sum_registrationFee_arbitrationFee_slabHead = slab_head_total + sum_registrationFee_arbitrationFee;


                console.log('______________________________________________________________________________');
                console.log('Slab head total ' + slab_head_total);
                console.log('Slab head total+ Step 1 fess ' + sum_registrationFee_arbitrationFee_slabHead);
                console.log('______________________________________________________________________________');



                // STEP 3 ------------------------------------------------------------------------------------

                revised_fees_query = '';
                revised_fees_query += ' SELECT * FROM revised_fees where product_id=? and is_active=1 and curdate() between start_date and end_date ';
                sequelize.query(revised_fees_query,
                        {replacements: [product_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (revised_fees_data) {

                    revised_fees_obj = revised_fees_data[0];

                    //1-discount, 2- loading 
                    var revised_fees_amu = (parseFloat(sum_registrationFee_arbitrationFee_slabHead) * parseFloat(revised_fees_obj['revised_value'])) / 100;

                    if (revised_fees_obj['revised_type'] == 1) {

                        sum_registrationFee_arbitrationFee_slabHead_revised = parseFloat(sum_registrationFee_arbitrationFee_slabHead) - parseFloat(revised_fees_amu);

                    } else {
                        sum_registrationFee_arbitrationFee_slabHead_revised = parseFloat(sum_registrationFee_arbitrationFee_slabHead) + parseFloat(revised_fees_amu);
                    }


                    console.log('______________________________________________________________________________');
                    console.log('revised fee total ' + revised_fees_amu);
                    console.log('revised total+ Step 1 +Step 2 fess ' + sum_registrationFee_arbitrationFee_slabHead_revised);
                    console.log('______________________________________________________________________________');



                    // STEP 4 ------------------------------------------------------------------------------------
                    var services_discount = 0;
                    services_discount_query = '';
                    services_discount_query += ' SELECT * FROM service_detail_slabs where service_detail_id=? and slab_id=? ';
                    sequelize.query(services_discount_query,
                            {replacements: [doc_type, slab_id], type: sequelize.QueryTypes.SELECT}
                    ).then(function (services_discount_data) {
                        services_discount_obj = services_discount_data[0];
                        services_discount_obj['discount_to_consumer'];


                        services_discount = (parseFloat(sum_registrationFee_arbitrationFee_slabHead_revised) * parseFloat(services_discount_obj['discount_to_consumer'])) / 100


                        sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount = sum_registrationFee_arbitrationFee_slabHead_revised - services_discount;

                        console.log('______________________________________________________________________________');
                        console.log('services discount ' + services_discount);
                        console.log('services discount+revised total+ Step 1 +Step 2 fess ' + sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount);
                        console.log('______________________________________________________________________________');


                        // STEP 5 ------------------------------------------------------------------------------------
                        tax_query = '';
                        tax_query += ' SELECT * FROM taxes where is_active=1 ';
                        sequelize.query(tax_query,
                                {replacements: [], type: sequelize.QueryTypes.SELECT}
                        ).then(function (tax_data) {

                            var total_tax = 0;
                            var total_cess = 0;
                            async.each(tax_data, function (tax_data_rows, callback) {

                                //1 - Tax, 2 - Cess 

                                if (tax_data_rows['tax_type'] == 1) {

                                    total_tax = parseFloat(total_tax) + parseFloat(tax_data_rows['tax_value']);
                                } else {
                                    total_cess = parseFloat(total_cess) + parseFloat(tax_data_rows['tax_value']);
                                }

                                callback();
                            }, function (err) {
                                console.log(err);
                            });

                            var total_tax_amu = 0;
                            var total_cess_amu = 0;

                            if (total_tax > 0) {
                                total_tax_amu = (sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * total_tax) / 100

                            }

                            if (total_cess > 0) {
                                total_cess_amu = (total_tax_amu * total_cess) / 100
                            }


                            sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount_tax = sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount + total_tax_amu + total_cess_amu

                            console.log('______________________________________________________________________________');
                            console.log('tax total ' + total_tax_amu);
                            console.log('tax total ' + total_cess_amu);
                            console.log('tax+services discount+revised total+ Step 1 +Step 2 fess ' + sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount_tax);
                            console.log('______________________________________________________________________________');



                            year_fees_query = '';
                            year_fees_query += ' SELECT * FROM service_details sd left join service_detail_duration_wise_percentages sdp '
                            year_fees_query += ' on sd.id=sdp.service_detail_id '
                            year_fees_query += ' where sd.is_active=1 and sd.id=? ';

                            var fess_package = {}
                            sequelize.query(year_fees_query,
                                    {replacements: [doc_type], type: sequelize.QueryTypes.SELECT}
                            ).then(function (year_fees_data) {

                                //fess_package['year'+]
                                var planArr = [];
                                async.each(year_fees_data, function (year_fees_data_rows, callback) {
                                    var fess_package = {};
                                    var yr_fees = 0;

                                    yr_fees = sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount + (sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * parseFloat(year_fees_data_rows['value_of_percentage'])) / 100;


                                    if (total_tax > 0) {
                                        total_tax_amu = (yr_fees * total_tax) / 100
                                    }

                                    if (total_cess > 0) {
                                        total_cess_amu = (total_tax_amu * total_cess) / 100
                                    }

                                    yr_fees_tax = sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount + total_tax_amu + total_cess_amu;

                                    fess_package[year_fees_data_rows['no_of_year']] = parseFloat(yr_fees_tax).toFixed(2);

                                    planArr.push(fess_package);

                                    callback();
                                }, function (err) {
                                    console.log(err);
                                });
                                var fess_package = {};
                                fess_package['1'] = parseFloat(sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount_tax).toFixed(2);
                                planArr.push(fess_package);
                                res.send(planArr);

                            });

                            //res.send({data: parseFloat(sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount_tax).toFixed(2)});

                        });
                    });
                });
            });


        }



    });

});












router.get('/profile', function (req, res, next) {


//    var pdf = require('html-pdf');
//    var options = {format: 'Letter'};
//    html = "<h1 style='background-color:red '>PDF.....</h1>"
//    pdf.create(html, options).toFile('./businesscard.pdf', function (err, res) {
//        if (err)
//            return console.log(err);
//        console.log(res); // { filename: '/app/businesscard.pdf' } 
//    });


    extraVar['role_id'] = req.user.user_type.role_id;
    extraVar['view_type'] = 0;
    req.where = {role_id: req.user.user_type.role_id}
    models.RoleType.getMasterId(req, function (masterData) {


        extraVar['masterData'] = masterData;
        models[modelName].getById(req.user.id, function (data) {
            console.log('--------++++++++++++++++');
            console.log(data);
            console.log('--------++++++++++++++++');
            async.parallel({
                busines: function (callback) {
                    req.where = {}
                    models.BusinessType.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                busines_category: function (callback) {
                    req.where = {}
                    models.BusinessCategory.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                professional: function (callback) {
                    req.where = {role_id: req.params.role_id}
                    models.RoleType.getByType(req, function (data) {
                        callback(null, data);
                    });
                }, country: function (callback) {
                    req.where = {}
                    models.Country.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                states: function (callback) {
                    req.where = {country_id: data.country_id}
                    models.State.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                divisions: function (callback) {
                    req.where = {country_id: data.country_id}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                districts: function (callback) {
                    req.where = {state_id: data.state_id}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                tehsils: function (callback) {
                    req.where = {district_id: data.district_id}
                    models.Tehsil.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                SpecialBonus: function (callback) {
                    req.where = {}
                    models.SpecialBonus.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                }

            }, function (err, results) {
                //res.send(masterData);
                extraVar.titleName = '';
                res.render('admin/' + viewDirectory + '/profile', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data:results, fromData: data});
            });
        });
    });
});









router.post('/delete/:id/:user_type', function (req, res, next) {
    var id = req.params.id;
    req.where = {id: id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.params.user_type});
//        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});
router.post('/apply-bonus', upload.array(), function (req, res, next) {

    console.log(req.body);
    models[modelName].applyBonus(req, function (data) {
        //req.flash('type_messages', 'success');
        //req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, data: [], message: 'Update Bonus sucessfuly'});
    });
});






router.post('/complete-registration', function (req, res, next) {

    ImageUpload.uploadUserProfilePic(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, message: err, data: []});
        } else {
            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {

                    modelBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null);
                        } else {
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    var UserBusinesDetailBuild = models.UserBusinesDetail.build(req.body.user_busines_details);
                    UserBusinesDetailBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null);
                        } else {
                            callback(null);
                        }

                    });
                },
                function (callback) {
                    var UserBankDetailBuild = models.UserBankDetail.build(req.body.user_bank_details);
                    UserBankDetailBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null);
                        } else {
                            callback(null);
                        }

                    });
                }], function (err) {

                if (errors.length == 0) {
                    //console.log(req.body);
                    req.body.token = randomstring.generate();
                    models[modelName].completeRegistration(req, function (results) {
                        if (results.status) {
                            if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                var msg = 'Edit Successfully';
                            } else {
                                //var fullUrl = req.protocol + '://' + req.get('host') + '/verify-account/' + req.body.token + '/' + results.id;
                                //var mailData = {email: req.body.email, subject: "Welcome to NAT", list: {name: req.body.first_name, email: req.body.email, password: req.body.password, link: fullUrl}};
                                //mail.sendHtmlMail(mailData);
                                var msg = 'Added Successfully';
                            }


                            req.flash('type_messages', 'success');
                            req.flash('messages', msg);
                            //res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body.role_id});
                            res.status(200).send({status: true, url: '/admin/users/dashboard'});
                        } else {
                            res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
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


router.post('/check-user', function (req, res, next) {

    models.User.getProfessionalByEmail(req, function (data) {
        data = data[0];
        console.log("----------------------------===============>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log(data);
        console.log("----------------------------===============>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        //res.send(data);

        var status = true;
        var msg = '';
        if (!data || data.id == '' || !data.id) {
            status = false;
            msg = 'This email is not register with Nyaya Portal . Please verify and re-enter';
        }

        if (data.is_complete_registration != 1) {
            status = false;
            msg = ' This profile is not completed ';
        }

        if (data && data.franchise_id && data.franchise_id != '') {
            if (data.franchise_id == req.user.id) {
                status = false;
                msg = ' This email already associated with you ';
            } else if (data && data.franchise_id && (data.franchise_id != req.app.locals.settingData.admin_ap)) {
                status = false;
                msg = ' This email is already associated ';
            } else if (data.franchise_tehsils && data.franchise_tehsils != '') {
                var tehsils = data.franchise_tehsils.split(',');
                if (tehsils.indexOf(data.tehsil_id.toString()) == -1) {
                    status = false;
                    msg = ' Tehsil are not same ';
                }
            }
        }





        userTypeArr = [];
        if (req.user.franchise_type == 1) {
            userTypeArr.push('lawyers');
        }

        if (data && req.user.franchise_type == 0) {
            userTypeArr.push('ca');
            userTypeArr.push('cs');
        }


        if (data && data.role_type_name && userTypeArr.indexOf(data.role_type_slug) == -1) {
            status = false;
            msg = ' This email is registered with us as  ' + data.role_type_name + ' and you are not authorized to register ' + data.role_type_name + ' profile ';
        }

        res.status(200).send({status: status, msg: msg, data: data});
    });

});

router.post('/check-deed-writer-user', function (req, res, next) {
    models.User.getDWByEmail(req, function (data) {
        data = data[0];
        console.log("----------------------------===============>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log(data);
        console.log("----------------------------===============>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        //res.send(data);
        var status = true;
        var msg = '';
        //if (!data || data.id == '') {
        if (!data || data.id == '' || !data.id) {
            status = false;
            msg = 'This email is not register as a service provider with Nyaya Portal . Please verify and re-enter';
        } else if (data.is_complete_registration != 1) {
            status = false;
            msg = ' This profile is not completed ';
        }

        if (data && data.franchise_id && data.franchise_id != '') {
            var user_franchises = data.user_franchises.split(',');
            if (user_franchises.indexOf(req.user.id.toString()) != -1) {
                status = false;
                msg = ' This email is already associated with you ';
            } else if (data.franchise_tehsils && data.franchise_tehsils != '') {
                var tehsils = data.franchise_tehsils.split(',');
                if (tehsils.indexOf(data.tehsil_id.toString()) == -1) {
                    status = false;
                    msg = ' Tehsil are not same ';
                }
            }
        }

        res.status(200).send({status: status, msg: msg, data: data});
    });

});

router.post('/ap-add-credit', function (req, res, next) {

    if (parseInt(req.body.no_of_credits) < 0) {
        console.log("--------- ERROR -------------- Please enter positive value ------------------------");
        res.status(201).send({status: false, message: "Please enter positive value", data: []});
    } else {
        models.User.getById(req.user.id, function (apData) {

            //if (apData.remaining_no_of_credits > 0) {

            var maxAllowedCreditLimitPerHead = req.app.locals.settingData.maximum_credit_limit_per_head;
            //var maxAllowedCreditLimitPerHead = 10;

            if (parseInt(req.body.no_of_credits) <= parseInt(maxAllowedCreditLimitPerHead)) {

                var prevRemainingCredits = apData.remaining_no_of_credits;

                var user_id_to_give_credits = req.body.user_id;

                req.where = {
                    user_id: user_id_to_give_credits,
                    franchise_id: req.user.id
                }
                models["UserFranchise"].getFirstValues(req, function (userData) {
                    console.log("------------------------- User Data to give credit ------------------------------------")
                    console.log(userData)
                    console.log("------------------------------ Endsssssssss -------------------------------")


                    if ((req.body.no_of_credits - userData.total_credit) <= prevRemainingCredits) {

                        var new_no_of_credits = userData.total_credit - req.body.no_of_credits;
                        console.log("----------- new total credits ------------ " + new_no_of_credits + " -----------------------")
                        if (userData.available_credit >= new_no_of_credits) {
                            var new_total_credits = userData.total_credit - new_no_of_credits;
                            var new_remaining_credits = userData.available_credit - new_no_of_credits;

                            var updated_data = []
                            updated_data.body = {
                                total_credit: new_total_credits,
                                available_credit: new_remaining_credits
                            }

                            //console.log(userData);

                            if (!userData.offline_date) {
                                updated_data.body.offline_date = req.app.locals.site.momentObj().format('YYYY-MM-DD HH:mm:ss');

                            }

                            updated_data.where = {
                                user_id: user_id_to_give_credits,
                                franchise_id: req.user.id
                            }

                            var ap_updated_data = []
                            console.log("--------------------------- " + (-(new_no_of_credits)) + " ------------------------------------------------")
                            var ap_new_remaining_credits = prevRemainingCredits - (-new_no_of_credits);

                            ap_updated_data.body = {
                                remaining_no_of_credits: ap_new_remaining_credits
                            }
                            ap_updated_data.where = {
                                id: req.user.id
                            }


                            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                            console.log("AP Previous Total Credits -------------------------------- " + apData.no_of_credits)
                            console.log("AP Previous Remaining Credits ---------------------------- " + apData.remaining_no_of_credits)
                            console.log("AP New Total Credits -------------------------------- " + apData.no_of_credits)
                            console.log("AP New Remaining Credits ---------------------------- " + ap_updated_data.body.remaining_no_of_credits)
                            console.log("User Previous Total Credits ----------------------------------- " + userData.total_credit)
                            console.log("User Previous Remaining Credits ----------------------------------- " + userData.available_credit)
                            console.log("User New Total Credits ----------------------------------- " + updated_data.body.total_credit)
                            console.log("User New Remaining Credits ----------------------------------- " + updated_data.body.available_credit)
                            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

                            models["UserFranchise"].updateValues(updated_data, function (getResp) {
                                models.User.update_credits(ap_updated_data, function (saveCreditStatus) {
                                    if (saveCreditStatus.status) {
                                        res.status(200).send({status: true, message: "Updated successfully.", data: [], url: "/admin/franchises/list-deed-writer"});
                                    } else {
                                        res.status(201).send({status: false, message: "Please try Again1.", data: []});
                                    }
                                })
                            })
                        } else {
                            console.log("--------- ERROR -------------- Cannot change ------------------------");
                            res.status(201).send({status: false, message: 'Cannot change', data: []});
                        }
                    } else {
                        res.status(201).send({status: false, message: "You have not sufficient credits in your account.", data: []});
                    }
                })
            } else {
                console.log("--------- ERROR -------------- Max " + maxAllowedCreditLimitPerHead + " credits allowed ------------------------");
                res.status(201).send({status: false, message: "Max " + maxAllowedCreditLimitPerHead + " credits allowed.", data: []});
            }
            //} else {
            //console.log("--------- ERROR -------------- You have not any credit in your account ------------------------");
            //res.status(201).send({status: false, message: "You have not any credit in your account.", data: []});
            //}
        })
    }
});

router.post('/create', function (req, res, next) {
    req.filTypeIs = 'all';
    ImageUpload.uploadFile(req, res, function (err) {
        //res.send(req.body);
        //return false;


         async.forEach(req.files, function (dataValues, callback) {

                if (dataValues.fieldname == 'profile_image') {
                    req.body.image_url = dataValues.filename;
                }
                if (dataValues.fieldname == 'check_img') {
                    req.body.check_img = dataValues.filename;
                }

            }, function (err) {
                //callback(null);
        });


        
        if (req.files.length) {
            req.body.legal_documents = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, message: err, data: []});
        } else {
            console.log(req.body);

            if (req.body.id != '' && req.body.password == '' && req.body.password_confirm == '') {
                delete req.body.password;
                delete req.body.password_confirm;
            }
            console.log('------------------>');
            console.log(req.body.franchise_is);
            if (req.body.franchise_is == 'Individual') {
                delete req.body.user_busines_details
            }
            console.log('------------------>}}}}}');
            console.log(req.body);

            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {
                    //callback(null);
                    var UserBuild = models.User.build(req.body);
                    UserBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null);
                        } else {
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    //callback(null);
                    var UserBusinesDetailBuild = models.UserBusinesDetail.build(req.body.user_busines_details);
                    UserBusinesDetailBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null);
                        } else {
                            callback(null);
                        }

                    });
                },
                function (callback) {
                    //callback(null);
                    var UserBankDetailBuild = models.UserBankDetail.build(req.body.user_bank_details);
                    UserBankDetailBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null);
                        } else {
                            callback(null);
                        }

                    });
                }

            ], function (err) {

                var infoErr = 0;

                if (typeof req.body.franchise_levels !== 'undefined') {
                    console.log('==================+++++++++++++++++++++))))))))))))))))))');
                    promoter = {};
                    promoter = req.body.franchise_levels;
                    //console.log('franchise_' + req.body.franchise_levels.franchise_level.replace('level', 'id'));
                    var levelKey = 'franchise_' + req.body.franchise_levels.franchise_level.replace('level', 'id');

                    if (typeof req.body.franchise_levels[levelKey] === 'undefined') {
                        console.log('errors1');
                        infoErr = 1;
                    }

                    if (typeof req.body.franchise_levels['parent_franchise'] === 'undefined' && req.body.franchise_levels['franchise_level'] != 'country_level') {
                        console.log('errors2');
                        infoErr = 1;
                    }

                    //franchise_levels: { franchise_level: 'country_level', franchise_country_id: '1' },


                    //franchise_levels[parent_franchise]

                    Object.keys(promoter).forEach(function (key) {
                        console.log('errors3');
                        var val = promoter[key];
                        if (!val || val == '') {
                            infoErr = 1;
                        }
                    });
                }
                console.log(infoErr);
                if (errors.length == 0) {

                    if (infoErr == 0) {

                        var otpForEmail = Math.floor((Math.random() * 1000000));
                        req.body.otp_email = otpForEmail;

                        var otpForMobile = Math.floor((Math.random() * 1000000));
                        req.body.otp_mobile = otpForMobile;

                        var editId = req.body.id;

                        var otpMsgForMobile = 'your otp is ' + otpForMobile;
                        models[modelName].saveAllValues(req, function (results) {
                            if (results.status) {


                                if (typeof editId !== 'undefined' && editId != '') {
                                    var msg = 'Edit Successfully';
                                } else {
                                    var msg = 'Added Successfully';



//                                    var msgDateMobile = {otpMsg: otpMsgForMobile, mobile: req.body.mobile}
//                                    otpObj.sendOtpMessage(msgDateMobile);
//
//                                    var fullUrl = 'Your email OTP is : ' + otpForEmail;//req.protocol + '://' + req.get('host') + '/verify-account/' + req.body.token + '/' + results.id;
//                                    var mailData = {email: req.body.email, subject: "Welcome to NAT", list: {name: req.body.first_name, email: req.body.email, password: req.body.password, link: fullUrl}};
//                                    mail.resendOtpMail(mailData);






                                    /* ------------------- Dynamic Mobile startssssssssssssssssssssss ----------------- */
                                    var fields_to_be_replaced_4mobile = {
                                        mobile_otp: otpForMobile
                                    }
                                    var otp_option = {
                                        mobile: req.body.mobile
                                    }
                                    var mobile_template_slug = "registration_mobile_otp",
                                            values_to_be_replaced = fields_to_be_replaced_4mobile,
                                            otp_options = otp_option;
                                    otpObj.dynamicMobileMsg(mobile_template_slug, values_to_be_replaced, otp_options);
                                    /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

                                    // var otp = 'Your email OTP is : ' + otpMsgEmail;
                                    // var mailData = {email: req.body.email, subject: "Welcome to Nat", list: {name: req.body.first_name, email: req.body.email, password: req.body.password, link: otp}};
                                    // mailObj.resendOtpMail(mailData);


                                    /* ------------------- Dynamic Email startssssssssssssssssssssss ----------------- */
                                    var fields_to_be_replaced = {
                                        user_name: req.body.first_name,
                                        email_otp: otpForEmail,
                                        user_email: req.body.email,
                                        user_password: req.body.password
                                    }
                                    var mail_option = {
                                        to: req.body.email
                                    }
                                    var email_template_slug = "registration_template",
                                            values_to_be_replaced = fields_to_be_replaced,
                                            mail_options = mail_option;
                                    mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                                    /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

                                }


                                req.flash('type_messages', 'success');
                                req.flash('messages', msg);
                                res.status(200).send({status: true, url: '/admin/franchises'});
                            } else {
                                res.status(400).send({status: false, message: ' Saved failed', data: results.errors});
                            }
                        });

                    } else {
                        res.status(200).send({status: false, message: 'Please Fill all Promoter Info', data: []});
                    }


                } else {
                    res.status(400).send({status: false, message: ' Saved failed', data: errors});
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

//                    modelBuild.validate().then(function (err) {
//                        if (err != null) {
//                            errors = errors.concat(err.errors);
//                            callback(null, errors);
//                        } else {
                    callback(null, errors);
//                        }
//
//                    });
                }], function (err) {

                if (errors.length == 0) {
                    //console.log(req.body);
                    models[modelName].saveAllValueProvider(req, function (results) {
                        if (results.status) {
                            if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                var msg = 'Added Successfully';
                            } else {
                                var msg = 'Edit Successfully';
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
                    res.status(400).send({status: false, msg: ' saved failed', data: errors});
                }
            });
        }

    });
    console.log(req.body);
});







router.post('/resendOtp', function (req, res, next) {

    console.log('=--=-=--=-=-==-==-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=');
    models['User'].getByEmail(req.body.mobile, function (userData) {
        console.log('=--=-=--=-=-==-==-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=');
        console.log(userData);

        var sendOtp = Math.floor((Math.random() * 1000000));
        req.updateObj = {otp_mobile: sendOtp};
        var otpMsgMobile = 'your otp is ' + sendOtp;

        var msgDateMobile = {otpMsg: otpMsgMobile, mobile: req.body.mobile}
        //otpObj.sendOtpMessage(msgDateMobile);

        /* ----------------------------------- Send sms --------------------------------- */
        var fields_to_be_replaced_4mobile = {
            user_name: userData.first_name,
            ap_name: req.user.first_name,
            mobile_otp: sendOtp
        }
        var otp_option = {
            mobile: userData.mobile
        }

        var userFrId = userData['id'] + '_' + req.user.id;



        var userFrId64 = new Buffer(userFrId).toString('base64');
        var sendOtp64 = new Buffer(sendOtp).toString('base64');


        var fullUrl = req.protocol + '://' + req.get('host');
        var confUrl = fullUrl + '/mapping/' + userFrId64 + '/' + sendOtp;


        console.log(confUrl);


        /* ------------------- Dynamic Email start----------------- */
        var fields_to_be_replaced = {
            user_name: userData.first_name,
            ap_name: req.user.first_name,
            mobile_otp: confUrl
        }
        var mail_option = {
            to: userData.email
        }
        var email_template_slug = "otp_while_mapping_from_ap",
                values_to_be_replaced = fields_to_be_replaced,
                mail_options = mail_option;
        mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
        /* ------------------- End ----------------- */

        var msg = 'Confirmation link sent to user';

        req.where = {email: req.body.mobile};
        req.update = {otp_email: sendOtp};
        models['User'].updateOtp(req, function (results) {
            res.status(200).send({status: true, msg: msg, data: []});
        });
    });

});




router.post('/confirm_otp', function (req, res, next) {

    models[modelName].getById(req.body.id, function (userData) {
        if (userData && userData.otp_mobile == req.body.otp) {

            var currentDate = moment().format("DD-MM-YYYY");

            req.where = {id: req.body.id};
            //req.update = {otp_mobile: '', franchise_id: req.user.id, franchise_date: currentDate};
            req.update = {otp_mobile: ''};


            if (typeof req.body.type != "undefined" && req.body.type == "deed-writer") {
                var redirectUrl = '/admin/franchises/list-deed-writer'

                models['User'].updateOtp(req, function (results) {
                    var user_franchises_data = {body: {user_id: userData.id, franchise_id: req.user.id}}
                    models['UserFranchise'].saveAllValues(user_franchises_data, function (userData) {
                        res.status(200).send({status: true, msg: '', data: {url: redirectUrl}});
                    })
                });
            } else {
                var redirectUrl = '/admin/franchises/list-user'
                models['User'].updateOtp(req, function (results) {
                    var user_franchises_data = {
                        body: {
                            franchise_id: req.user.id
                        },
                        where: {
                            user_id: req.body.id,
                            franchise_id: req.app.locals.settingData.admin_ap
                        }
                    }
                    models['UserFranchise'].updateValues(user_franchises_data, function (userData) {
                        res.status(200).send({status: true, msg: '', data: {url: redirectUrl}});
                    })
                });
            }
        } else {
            res.status(200).send({status: false, msg: 'Invalid OTP', data: []});
        }


    });
});


module.exports = router;
