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
var multer = require('multer');
var upload = multer();
var mail = require('../../middlewares/Mail');
//router.use(adminAuth.isAdmin);
var viewDirectory = 'users';
var modelName = 'User';
var titleName = 'User';
var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;
var otpObj = require('../../middlewares/Otp');
/* GET users listing. */
var env = require('../../config/env');


router.get('/tech', function (req, res, next) {



 models[modelName].getUserByEmail("hemant.suman@planetwebsolution.com", function (user) { 

  console.log(user);  

  var pay=env.pay;
  var json2csv = require('json2csv');
  var fs = require('fs');
  var fields = ['Merchant ID', 'Scheme Code', 'Location','','Scheme Name','Scheme Type(Liquid / Non Liquid)','','Bank Name','Bank Branch','Account No','Account Name','','','Flag','IFSC Code'];
 var csvData = [
  {
    "Merchant ID": pay.mid,
    "Scheme Code": user.id,
    "Location": user.district.district_name,
    "Scheme Name": pay.s_code,
    "Scheme Type(Liquid / Non Liquid)": "NA",
    "": "",
    "Bank Name": user.user_bank_details.bank_name,
    "Bank Branch": user.user_bank_details.bank_branch,
    "Account No": user.user_bank_details.account_no,
    "Account Name": user.user_bank_details.account_holder_name,
    "": "",
    "": "",
    "Flag": "M",
    "IFSC Code": user.user_bank_details.ifsc_code
  }
  ];
 var csv = json2csv({ data: csvData, fields: fields });
 
    fs.writeFile('public/csv/'+user.id+'.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
    var mailData = {email:"abhishek.sharma@planetwebsolution.com", subject: "Regarding Map Scheme code for Tutor id 4036", list: {user:user,pay:env.pay}};
    mail.sendTechprocessMail(mailData);
    });

 // var mailData = {email:"abhishek.sharma@planetwebsolution.com", subject: "Regarding Map Scheme code for Tutor id 4036", list: {user:user,pay:env.pay}};
 // mail.sendTechprocessMail(mailData);

res.send({status:true});
 });





});



router.get('/how_to_use', function (req, res, next) {
    //console.log(req.user);
    res.render('admin/' + viewDirectory + '/how_to_use', {extraVar: extraVar, layout: 'admin/layout/layout'});
});
router.get('/how_to_use/:user_type', function (req, res, next) {
    extraVar['user_type'] = req.params.user_type;
    res.render('admin/' + viewDirectory + '/how_to_use', {extraVar: extraVar, layout: 'admin/layout/layout'});
});
router.get('/about_nyaya_card/:user_type', function (req, res, next) {
    extraVar['user_type'] = req.params.user_type;
    res.render('admin/' + viewDirectory + '/about_nyaya_card', {extraVar: extraVar, layout: 'admin/layout/layout'});
});
router.get('/about_membership/:user_type', function (req, res, next) {
    extraVar['user_type'] = req.params.user_type;
    res.render('admin/' + viewDirectory + '/about_membership', {extraVar: extraVar, layout: 'admin/layout/layout'});
});
//router.get('/faq', function (req, res, next) {
//    //console.log(req.user);
//    res.render('admin/' + viewDirectory + '/faq', {extraVar: extraVar, layout: 'admin/layout/layout'});
//});
router.get('/faq/:user_type', function (req, res, next) {
    extraVar['user_type'] = req.params.user_type;
    res.render('admin/' + viewDirectory + '/faq', {extraVar: extraVar, layout: 'admin/layout/layout'});
});
router.get('/guidelines/:user_type', function (req, res, next) {
    extraVar['user_type'] = req.params.user_type;
    res.render('admin/' + viewDirectory + '/guidelines', {extraVar: extraVar, layout: 'admin/layout/layout'});
});
router.get('/model_clause/:user_type', function (req, res, next) {
    extraVar['user_type'] = req.params.user_type;
    res.render('admin/' + viewDirectory + '/model_clause', {extraVar: extraVar, layout: 'admin/layout/layout'});
});

router.get('/dashboard', adminAuth.isAdmin, function (req, res, next) {
    res.render('admin/home/dashboard', {title: 'Express', layout: 'admin/layout/layout'});
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
                req.where = {is_active: 1}
                models.SpecialBonus.getAllValues(req, function (data) {
                    callback(null, data);
                });
            }
        }, function (err, results) {
            results['states'] = [];
            results['divisions'] = [];
            results['districts'] = [];
            results['tehsils'] = [];

            if (req.params.role_id == 1) {
                extraVar['titleName'] = 'Professional Users';
                extraVar['btnName'] = 'Add Professional';
            }

            if (req.params.role_id == 2) {
                extraVar['titleName'] = 'Service Providers';
                extraVar['btnName'] = 'Add Service Provider';
            }

            if (req.params.role_id == 3) {
                extraVar['titleName'] = 'Other Users';
                extraVar['btnName'] = 'Add Other User';
            }
            //res.send(results);
            res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data: results, fromData: []});
        });
    });
});


router.get('/verify-account', function (req, res, next) {
    //console.log(req.user);
    res.render('admin/' + viewDirectory + '/verify_account', {layout: false, userData: req.user});
});

router.get('/complete-registration', function (req, res, next) {
    if (typeof req.user != 'undefined') {
        extraVar['view_type'] = 0;
        req.where = {master_type: req.user.role_type_id}
        models[modelName].getById(req.user.id, function (userData) {
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            console.log(userData.user_roles)
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            //console.log(userData);
            //extraVar['masterData'] = masterData;
            extraVar['role_id'] = req.user.role_type_id;
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
                country: function (callback) {
                    req.where = {is_active: 1}
                    models.Country.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                states: function (callback) {
                    req.where = {country_id: req.user.country_id, is_active: 1}
                    models.State.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                divisions: function (callback) {
                    req.where = {state_id: req.user.state_id, is_active: 1}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                districts: function (callback) {
                    req.where = {division_id: req.user.division_id, is_active: 1}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                tehsils: function (callback) {
                    req.where = {district_id: req.user.district_id, is_active: 1}
                    models.Tehsil.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                }
            }, function (err, results) {

                //res.send(userData);
                res.render('admin/' + viewDirectory + '/complete_registration', {layout: false, extraVar: extraVar, data: results, fromData: userData});
            });
        });
    } else {
        res.redirect('/users/login');
    }
});


router.get('/edit/:role_id/:id/:view_type', adminAuth.isAllow, function (req, res, next) {

    extraVar['role_id'] = req.params.role_id;
    extraVar['view_type'] = req.params.view_type;
    req.where = {role_id: req.params.role_id}
    models.RoleType.getMasterId(req, function (masterData) {

        //console.log(masterData);

        extraVar['masterData'] = masterData;
        models[modelName].getById(req.params.id, function (data) {
            //console.log(data);

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
                res.render('admin/' + viewDirectory + '/add', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data: results, fromData: data});
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
                professional: function (callback) {
                    req.where = {role_id: req.params.role_id}
                    models.RoleType.getByType(req, function (data) {
                        callback(null, data);
                    });
                }, country: function (callback) {
                    req.where = {is_active: 1}
                    models.Country.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                states: function (callback) {
                    req.where = {country_id: data.country_id, is_active: 1}
                    models.State.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                divisions: function (callback) {
                    req.where = {country_id: data.country_id, is_active: 1}
                    models.Division.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                districts: function (callback) {
                    req.where = {state_id: data.state_id, is_active: 1}
                    models.District.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                tehsils: function (callback) {
                    req.where = {district_id: data.district_id, is_active: 1}
                    models.Tehsil.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                },
                SpecialBonus: function (callback) {
                    req.where = {is_active: 1}
                    models.SpecialBonus.getAllValues(req, function (data) {
                        callback(null, data);
                    });
                }

            }, function (err, results) {
                //res.send(masterData);
                extraVar.titleName = '';
                res.render('admin/' + viewDirectory + '/profile', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data: results, fromData: data});
            });
        });
    });
});


router.get('/ap_profile/', function (req, res, next) {

    extraVar['role_id'] = req.user.user_type.role_id;
    extraVar['view_type'] = 0;
    req.where = {role_id: req.user.user_type.role_id}
    //req.where = {role_id: req.params.role_id}
    models.RoleType.getMasterId(req, function (masterData) {

        //console.log(masterData);

        extraVar['masterData'] = masterData;
        models.Franchise.getById(req.user.id, function (data) {
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
                res.render('admin/' + viewDirectory + '/ap_profile', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data: results, fromData: data});
            });
        });
    });
});

router.post('/update-ap-profile', function (req, res, next) {
    req.filTypeIs = 'all';
    ImageUpload.uploadFile(req, res, function (err) {
        //res.send(req.body);
        //return false;
        // if (req.files.length) {
        //     req.body.legal_documents = req.files[0].filename;
        // }

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
                    promoter = {};
                    promoter = req.body.franchise_levels;
                    //console.log('franchise_' + req.body.franchise_levels.franchise_level.replace('level', 'id'));
                    var levelKey = 'franchise_' + req.body.franchise_levels.franchise_level.replace('level', 'id');

                    if (typeof req.body.franchise_levels[levelKey] === 'undefined') {
                        infoErr = 1;
                    }

                    Object.keys(promoter).forEach(function (key) {
                        var val = promoter[key];
                        if (!val || val == '') {
                            infoErr = 1;
                        }
                    });
                }

                if (errors.length == 0) {

                    if (infoErr == 0) {

                        models[modelName].saveAllValues(req, function (results) {
                            if (results.status) {
                                if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                    var msg = 'Updated Successfully';
                                } else {
                                    var msg = 'Updated Successfully';
                                }
                                var msg = 'Profile Updated Successfully';
                                req.flash('type_messages', 'success');
                                req.flash('messages', msg);
                                res.status(200).send({status: true, url: '/admin/users/ap_profile'});
                            } else {
                                res.status(400).send({status: false, msg: ' saved failed', data: results.errors});
                            }
                        });

                    } else {
                        res.status(200).send({status: false, msg: 'Please Fill all Promoter Info', data: []});
                    }


                } else {
                    res.status(400).send({status: false, msg: ' saved failed', data: errors});
                }


            });
        }

    });
    console.log(req.body);
})








router.post('/delete/:id/:user_type', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {id: id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');

        var url = '/admin/' + viewDirectory + '/' + req.params.user_type;
        if (req.params.user_type == '5') {
            var url = '/admin/franchises';
        }

        res.status(200).send({status: true, url: url});
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

router.post('/active_commission/:id/:user_type', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {id: id};
    var sts = req.body.statusUpdated;
    req.body = {active_commission: req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        var showMsg = 'Commission Deactivated';
        if (sts == 1) {
            showMsg = 'Commission Activated';
        }

        req.flash('type_messages', 'success');
        req.flash('messages', showMsg);

        var url = '/admin/' + viewDirectory + '/' + req.params.user_type;
        if (req.params.user_type == 'ap' || req.params.user_type == 5) {
            var url = '/admin/franchises';
        }

        res.status(200).send({status: true, url: url});
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
            console.log(req.files);

            async.forEach(req.files, function (dataValues, callback) {

                if (dataValues.fieldname == 'profile_image') {
                    req.body.image_url = dataValues.filename;
                }
                if (dataValues.fieldname == 'check_img') {
                    req.body.check_img = dataValues.filename;
                }

            }, function (err) {
                callback(null);
            });

        }
        if (err) {
            res.send({status: false, message: err, data: []});
        } else {
            if (req.user.user_type.user_role.role_slug != 'admin_users') {
                if (typeof req.body.check_img == 'undefined' || req.body.check_img == '') {
                    req.body.check_img = '';
                }
            }
            if (typeof req.body.is_business === 'undefined') {
                req.body.user_busines_details = {};
            }

            console.log('req.##########');
            console.log(req.user.user_type.user_role.role_slug);
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
                    if(req.body.user_bank_details.account_holder_name !='' || req.body.user_bank_details.account_no !='' || req.body.user_bank_details.bank_name !='' || req.body.user_bank_details.pan_no !=''){
                    var UserBankDetailBuild = models.UserBankDetail.build(req.body.user_bank_details);
                    UserBankDetailBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null);
                        } else {
                            callback(null);
                        }

                    });
                    }else{
                    delete req.body.user_bank_details;    
                    callback(null);    
                    }

                }], function (err) {

                if (errors.length == 0) {
                    //console.log(req.body);
                    if (typeof req.body.is_business === 'undefined') {
                        delete req.body.user_busines_details;
                    }
                    req.body.token = randomstring.generate();
                    models[modelName].completeRegistration(req, function (results) {
                        if (results.status) {
                            if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                                var msg = 'Profile completed successfully';
                            } else {
                                //var fullUrl = req.protocol + '://' + req.get('host') + '/verify-account/' + req.body.token + '/' + results.id;
                                //var mailData = {email: req.body.email, subject: "Welcome to NAT", list: {name: req.body.first_name, email: req.body.email, password: req.body.password, link: fullUrl}};
                                //mail.sendHtmlMail(mailData);
                                var msg = 'Added Successfully';
                            }


                            req.flash('type_messages', 'success');
                            req.flash('messages', msg);
                            //res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body.role_id});

                            models[modelName].getUserByEmail(req.user.email, function (reLogin) {

                                /* ----------------------------------- Send mail --------------------------------- */
                                var fields_to_be_replaced = {
                                    user_name: req.user.first_name,
                                    profession_name: req.user.user_type.role_type_name,
                                    user_id: reLogin.gid
                                }
                                var mail_option = {
                                    to: req.user.email
                                }
                                var email_template_slug = "profile_completion",
                                        values_to_be_replaced = fields_to_be_replaced,
                                        mail_options = mail_option;
                                mail.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                                /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

                                req.logIn(reLogin, function (error) {
                                    if (!error) {
                                        // successfully serialized user to session
                                        var msg = 'Profile Updated Successfully';



                                    models[modelName].getUserByEmail(req.user.email, function (user) { 


                                          var pay=env.pay;
                                          var json2csv = require('json2csv');
                                          var fs = require('fs');
                                          var fields = ['Merchant ID', 'Scheme Code', 'Location','','Scheme Name','Scheme Type(Liquid / Non Liquid)','','Bank Name','Bank Branch','Account No','Account Name','','','Flag','IFSC Code'];
                                         var csvData = [
                                          {
                                            "Merchant ID": pay.mid,
                                            "Scheme Code": user.id,
                                            "Location": user.district.district_name,
                                            "Scheme Name": pay.s_code,
                                            "Scheme Type(Liquid / Non Liquid)": "NA",
                                            "": "",
                                            "Bank Name": user.user_bank_details.bank_name,
                                            "Bank Branch": user.user_bank_details.bank_branch,
                                            "Account No": user.user_bank_details.account_no,
                                            "Account Name": user.user_bank_details.account_holder_name,
                                            "": "",
                                            "": "",
                                            "Flag": "M",
                                            "IFSC Code": user.user_bank_details.ifsc_code
                                          }
                                          ];
                                        var csv = json2csv({ data: csvData, fields: fields });
 
                                            fs.writeFile('public/csv/'+user.id+'.csv', csv, function(err) {
                                            if (err) throw err;
                                            console.log('file saved');
                                            var mailData = {email:pay.email, subject: "Regarding Map Scheme code for User id "+user.id, list: {user:user,pay:env.pay}};
                                            mail.sendTechprocessMail(mailData);
                                        
                                        });

                                    });





                                    res.status(200).send({status: true, url: '/admin/dashboard'});
                                    } else {
                                        console.log(error);
                                    }

                                });
                            });

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




router.post('/send-bank',upload.array(), function (req, res, next) {

    console.log(req.body);

models[modelName].getUserByEmail(req.body.email, function (user) { 


                                          var pay=env.pay;
                                          var json2csv = require('json2csv');
                                          var fs = require('fs');
                                          var fields = ['Merchant ID', 'Scheme Code', 'Location','','Scheme Name','Scheme Type(Liquid / Non Liquid)','','Bank Name','Bank Branch','Account No','Account Name','','','Flag','IFSC Code'];
                                         var csvData = [
                                          {
                                            "Merchant ID": pay.mid,
                                            "Scheme Code": user.id,
                                            "Location": user.district.district_name,
                                            "Scheme Name": pay.s_code,
                                            "Scheme Type(Liquid / Non Liquid)": "NA",
                                            "": "",
                                            "Bank Name": user.user_bank_details.bank_name,
                                            "Bank Branch": user.user_bank_details.bank_branch,
                                            "Account No": user.user_bank_details.account_no,
                                            "Account Name": user.user_bank_details.account_holder_name,
                                            "": "",
                                            "": "",
                                            "Flag": "M",
                                            "IFSC Code": user.user_bank_details.ifsc_code
                                          }
                                          ];
                                        var csv = json2csv({ data: csvData, fields: fields });
 
                                            fs.writeFile('public/csv/'+user.id+'.csv', csv, function(err) {
                                            if (err) throw err;
                                            console.log('file saved');
                                            var mailData = {email:pay.email, subject: "Regarding Map Scheme code for User id "+user.id, list: {user:user,pay:env.pay}};
                                            mail.sendTechprocessMail(mailData);

                                            res.status(200).send({status: true,message:'Mail Sent Successfully to TPSL'});

                                        
                                        });


});

});





router.post('/create', function (req, res, next) {
    ImageUpload.uploadUserProfilePic(req, res, function (err) {
        
        // if (req.files.length) {
        //     req.body.image_url = req.files[0].filename;
        // }

        // if (dataValues.fieldname == 'check_img') {
        //             req.body.check_img = dataValues.filename;
        // }

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


        var getFieldsToSkip = []
        if (req.body.id != '') {
            getFieldsToSkip.push("email", "mobile")
            if (!req.body.password && !req.body.password_confirm) {
                getFieldsToSkip.push("password", "password_confirm");
            }
        }

        var skipFields = {}
        skipFields = {skip: getFieldsToSkip}

        if (err) {
            res.send({status: false, message: err, data: []});
        } else {

            if (typeof req.body.is_business === 'undefined') {
                delete req.body.user_busines_details;
            }

            if (typeof req.body.is_bank === 'undefined') {
                delete req.body.user_bank_details;
            }



            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {

                    modelBuild.validate(skipFields).then(function (err) {
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



                    if (req.body.id == '') {
                        // var otpForMobile = Math.floor((Math.random() * 1000000));
                        // var otpMsgForMobile = 'your otp is ' + otpForMobile;

                        // var otpForEmail = Math.floor((Math.random() * 1000000));

                        // req.body.otp_mobile = otpForMobile;
                        // req.body.otp_email = otpForEmail; //randomstring.generate();
                        var is_update = 0;
                        req.body.otp_status_mobile = 1;
                        req.body.otp_status_email = 1;
                    } else {
                        var is_update = 1;
                    }
                    if (req.body.special_bonus_id == '') {
                        req.body.special_bonus_id = null;
                    }
                    models[modelName].saveAllValuesForProf(req, function (results) {
                        if (results.status) {
                            if (is_update == 0) {
                                var msg = 'Added successfully';
                            } else {
                                var msg = 'Edit successfully';
                            }
                            // if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                            //     var msg = 'Added Successfully';
                            // } else {

                            //     // var msgDateMobile = {otpMsg: otpMsgForMobile, mobile: req.body.mobile}
                            //     // otpObj.sendOtpMessage(msgDateMobile);

                            //     // var fullUrl = 'Your email OTP is : ' + otpForEmail;//req.protocol + '://' + req.get('host') + '/verify-account/' + req.body.token + '/' + results.id;
                            //     // var mailData = {email: req.body.email, subject: "Welcome to NAT", list: {name: req.body.first_name, email: req.body.email, password: req.body.password, link: fullUrl}};
                            //     // mail.sendHtmlMail(mailData);

                            //     var msg = 'Edit Successfully';
                            // }

                            req.flash('type_messages', 'success');
                            req.flash('messages', msg);
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body.role_id});
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




router.post('/update-profile', function (req, res, next) {


    ImageUpload.uploadFile(req, res, function (err) {
        if (req.body.password == '' && req.body.password_confirm == '') {
            delete req.body.password;
            delete req.body.password_confirm;
        }

        if (!req.body.is_terms_condition) {
            req.body.is_terms_condition = '';
        }
        
        // if (req.files.length) {
        //     req.body.image_url = req.files[0].filename;
        // }


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



        if (err) {
            res.send({status: false, message: err, data: []});
        } else {

            console.log(req.body);
            console.log(req.body.is_business);
            console.log('req.body===================');

            if (typeof req.body.is_business === 'undefined') {
                delete req.body.user_busines_details;
            }

            if (typeof req.body.is_bank === 'undefined') {
                delete req.body.user_bank_details;
            }

            console.log(req.body);
            console.log('req.body===================');
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
                    var otp = Math.floor((Math.random() * 1000000));
                    req.body.otp_email = otp; //randomstring.generate();
                    //models[modelName].saveAllValues(req, function (results) {
                    models[modelName].updateUserProfile(req, function (results) {

                        if (results.status) {


                            var msg = 'Profile Updated Successfully';
                            req.flash('type_messages', 'success');
                            req.flash('messages', msg);

                            models[modelName].getUserByEmail(req.user.email, function (reLogin) {

                                req.logIn(reLogin, function (error) {

                                    if (!error) {
                                        req.app.locals.loginUser = {};
                                        req.app.locals.loginUser = reLogin;
                                        // successfully serialized user to session
                                        res.status(200).send({status: true, url: '/admin/users/profile'});
                                    } else {
                                        console.log(error);
                                    }

                                });

                            });



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


router.post('/add_provider', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.image_url = req.files[0].filename;
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
    console.log(req.user);
    if (typeof req.user !== 'undefined') {
        id = req.user.id;
    } else {
        id = req.body.user_id;
    }

    models[modelName].getById(id, function (userData) {
        console.log('userData----------------------------------');
        console.log(userData.email);

        var sendOtp = Math.floor((Math.random() * 1000000));
        if (req.body.type == 'email') {

            var otp = 'Your email OTP is : ' + sendOtp;
            var mailData = {email: userData.email, subject: "Welcome to NAT", list: {name: userData.first_name, email: userData.email, password: userData.password, link: otp}};
            mail.resendOtpMail(mailData);
            req.updateObj = {otp_email: sendOtp};
            var msg = 'OTP send Successfully on your registerd email address!';

            /* ------------------- Dynamic Email startssssssssssssssssssssss ----------------- */
            // var fields_to_be_replaced = {
            //     user_name: userData.first_name,
            //     email_otp: sendOtp,
            //     user_email: userData.email,
            //     user_password: req.body.password
            // }   
            // var mail_option = {
            //     to: results.email
            // }
            // var email_template_slug = "registration_template",
            //     values_to_be_replaced =  fields_to_be_replaced,
            //     mail_options = mail_option;
            // mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
            /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */
        } else {
            req.updateObj = {otp_mobile: sendOtp};
            var otpMsgMobile = 'your otp is ' + sendOtp;

            var msgDateMobile = {otpMsg: otpMsgMobile, mobile: userData.mobile}
            otpObj.sendOtpMessage(msgDateMobile);
            var msg = 'OTP send Successfully on your registerd mobile number!';

            /* ------------------- Dynamic Mobile startssssssssssssssssssssss ----------------- */
            // var fields_to_be_replaced_4mobile = {
            //     mobile_otp: sendOtp
            // }   
            // var otp_option = {
            //     mobile: userData.mobile
            // }
            // var mobile_template_slug = "registration_mobile_otp",
            //     values_to_be_replaced =  fields_to_be_replaced_4mobile,
            //     otp_options = otp_option;
            // otpObj.dynamicMobileMsg(mobile_template_slug, values_to_be_replaced, otp_options);
            /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */
        }

        req.user_id = id;

        models[modelName].resendOtpAll(req, function (results) {
            res.status(200).send({status: true, msg: msg, data: []});
        });
    });

});

router.get('/change-password', function (req, res, next) {
    extraVar['titleName'] = "Change Password"
    res.render('admin/' + viewDirectory + '/change_password', {data: [], layout: 'admin/layout/layout', extraVar: extraVar});
})

router.get('/send-sms-mail', function (req, res, next) {
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    // console.log(req.params)
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    extraVar['role_id'] = req.params.role_id;
    //extraVar['page_id'] = req.params.role_id;
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
    //req.where = {user_type_id: req.params.role_id};
    req.offset = offset;
    req.limit = limit;
    async.parallel({
        roles: function (callback) {
            req.where = {role_slug: {$ne: "super_admin"}}
            models.Role.getAllValues(req, function (data) {
                callback(null, data);
            });
        }, role_types: function (callback) {
            //req.where = (req.query !== "undefined" && req.query.role_type_id) != "" ?  {id: req.query.role_type_id} : {};
            req.where = {role_id: req.query.role_id}
            models.RoleType.getAllValues(req, function (data) {
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
        }
    }, function (err, data) {

        var serObj = {}
        var searchStr = '';
        async.forEachOf(req.query, function (getData, key, callback) {
            // console.log("--------------------- Query params iteration -------------------->>>>>>>>>>>")
            // console.log(key +" =================================== "+ getData)
            if (key != 'page') {
                searchStr += '&' + key + '=' + getData;
            }
            if (getData != '' && key != 'page') {
                if (key != "role_id" && key != "role_type_id") {
                    serObj[key] = {$like: '%' + getData + '%'};
                }
            }
        });

        //serObj['role_type_id'] = {$like: '%' + getData + '%'};
        // console.log("--------------------------------------- req where ----------------------->>>>>>>>>>>>>>>>")
        // console.log(serObj)
        extraVar['searchStr'] = searchStr;
        req.where = serObj;

        console.log("--------------------------- serObj ----------------------------")
        console.log(serObj)

        models[modelName].getAllValuesSendMail(req, function (results) {
            //res.send(results)
            extraVar['query'] = req.query;
            //extraVar['pageCount'] = Math.ceil(results.count / limit);
            extraVar['titleName'] = 'Send Mail/SMS';
            res.render('admin/' + viewDirectory + '/send_sms_mail', {results: results, layout: 'admin/layout/layout', extraVar: extraVar, data: data});
        }, function (err, resultSearch) {
            //res.send(results);
        });
    });
})


router.get('/:role_id', adminAuth.isAllow, function (req, res, next) {
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    // console.log(req.params)
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    extraVar['role_id'] = req.params.role_id;
    //extraVar['page_id'] = req.params.role_id;
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
    //req.where = {user_type_id: req.params.role_id};
    req.offset = offset;
    req.limit = limit;
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
            if (req.params.role_id == 2) {
                req.where = {product_id: 1, is_active: 1}
            } else {
                req.where = {product_id: [1, 3], is_active: 1}
            }

            models.SpecialBonus.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, data) {

        var serObj = {}
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
        //req.where['user_type_id'] = req.params.role_id;

        console.log("==========================>")
        console.log(req.where)
        console.log("==========================>")

        models[modelName].getAllValuesPaging(req, function (results) {

            extraVar['query'] = req.query;
            extraVar['pageCount'] = Math.ceil(results.count / limit);
            //console.log(extraVar);
            //res.send(results);
            if (req.params.role_id == 1) {
                extraVar['titleName'] = 'Professional Users';
                extraVar['btnName'] = 'Add Professional';
                extraVar['viewSlug'] = 'professional';
            }

            if (req.params.role_id == 2) {
                extraVar['titleName'] = 'Service Providers';
                extraVar['btnName'] = 'Add Service Provider';
                extraVar['viewSlug'] = 'provider';
            }

            if (req.params.role_id == 3) {
                extraVar['titleName'] = 'Other Users';
                extraVar['btnName'] = 'Add Other User';
                extraVar['viewSlug'] = 'other';
            }
            //res.send(results);
            res.render('admin/' + viewDirectory + '/index', {results: results.rows, layout: 'admin/layout/layout', extraVar: extraVar, data: data});
        }, function (err, resultSearch) {
            //res.send(results);
        });
    });
});

router.post('/credit', upload.array(), function (req, res, next) {
    var user_id_to_give_credits = req.body.user_id;
    req.where = {id: req.body.user_id};
    delete req.body.user_id;
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
            models[modelName].getById(user_id_to_give_credits, function (userData) {

                var old_total_credits = userData.no_of_credits;
                var old_remaining_credits = userData.remaining_no_of_credits;

                // var old_total_credits = 5;
                // var old_remaining_credits = 1;

                var new_total_credits = req.body.no_of_credits;
                var new_total_remaining_credits;

                var isValid = false;

                if (new_total_credits >= old_total_credits) {
                    new_total_credits = new_total_credits;
                    new_total_remaining_credits = (new_total_credits - old_total_credits) + old_remaining_credits;
                    isValid = true;

                } else {
                    if ((old_total_credits - old_remaining_credits) <= new_total_credits) {
                        new_total_credits = new_total_credits;
                        new_total_remaining_credits = new_total_credits - (old_total_credits - old_remaining_credits)
                        isValid = true;
                    } else {
                        console.log("{{{{{{{{{{{{{{{{{{{{ -------------------- Cannot change -------------------- }}}}}}}}}}}}}}}}}}}}}")
                        isValid = false;
                    }
                }

                console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                console.log("Old Total Credits ----------------------------------- " + old_total_credits)
                console.log("Old Remaining Credits ------------------------------- " + old_remaining_credits)
                console.log("New Total Credits ----------------------------------- " + new_total_credits)
                console.log("New Remaining Credits ------------------------------- " + new_total_remaining_credits)
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

                if (isValid) {

                    req.body.remaining_no_of_credits = new_total_remaining_credits;
                    console.log(req.body)
                    models[modelName].saveCredit(req, function (data) {
                        req.flash('type_messages', 'success');
                        req.flash('messages', 'Updated Successfully');
                        res.status(200).send({status: true, url: '/admin/franchises'});
                    });
                } else {
                    res.status(201).send({status: false, message: 'Cannot change', data: []});
                }
            })
        } else {
            res.status(400).send({status: false, msg: ' saved d failed', data: errors});
        }
    });
});

router.get('/admin-users/:role_id', adminAuth.isAllow, function (req, res, next) {
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    // console.log(req.params)
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    extraVar['role_id'] = req.params.role_id;
    //extraVar['page_id'] = req.params.role_id;
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
    //req.where = {user_type_id: req.params.role_id};
    req.offset = offset;
    req.limit = limit;
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
            if (req.params.role_id == 2) {
                req.where = {product_id: 1}
            } else {
                req.where = {product_id: [1, 3]}
            }
            models.SpecialBonus.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, data) {
        var serObj = {}
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
        //req.where['user_type_id'] = req.params.role_id;
        console.log("==========================>")
        console.log(req.where)
        console.log("==========================>")
        models[modelName].getAllValuesPaging(req, function (results) {
            extraVar['query'] = req.query;
            extraVar['pageCount'] = Math.ceil(results.count / limit);
            //console.log(extraVar);
            //res.send(results);
            if (req.params.role_id == 1) {
                extraVar['titleName'] = 'Professional Users';
                extraVar['btnName'] = 'Add Professional';
                extraVar['viewSlug'] = 'professional';
            }
            if (req.params.role_id == 2) {
                extraVar['titleName'] = 'Service Providers';
                extraVar['btnName'] = 'Add Service Provider';
                extraVar['viewSlug'] = 'provider';
            }
            if (req.params.role_id == 3) {
                extraVar['titleName'] = 'Other Users';
                extraVar['btnName'] = 'Add Other User';
                extraVar['viewSlug'] = 'other';
            }
            if (req.params.role_id == 7) {
                extraVar['titleName'] = 'Admin Users';
                extraVar['btnName'] = 'Add Admin User';
                extraVar['viewSlug'] = 'admin-users';
            }
            //res.send(results);
            res.render('admin/' + viewDirectory + '/admin_users_index', {results: results.rows, layout: 'admin/layout/layout', extraVar: extraVar, data: data});
        }, function (err, resultSearch) {
            //res.send(results);
        });
    });
});
router.get('/add-admin-users/:role_id', adminAuth.isAllow, function (req, res, next) {
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
            professional: function (callback) {
                req.where = {role_id: req.params.role_id, is_active: 1}
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
            if (req.params.role_id == 1) {
                extraVar['titleName'] = 'Professional Users';
                extraVar['btnName'] = 'Add Professional';
            }
            if (req.params.role_id == 2) {
                extraVar['titleName'] = 'Service Providers';
                extraVar['btnName'] = 'Add Service Provider';
            }
            if (req.params.role_id == 3) {
                extraVar['titleName'] = 'Other Users';
                extraVar['btnName'] = 'Add Other User';
            }
            if (req.params.role_id == 7) {
                extraVar['titleName'] = 'Admin Users';
                extraVar['btnName'] = 'Add Admin User';
            }
            //res.send(results);
            res.render('admin/' + viewDirectory + '/add_admin_users', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data: results, fromData: []});
        });
    });
});
router.post('/create-admin-users', function (req, res, next) {
    ImageUpload.uploadUserProfilePic(req, res, function (err) {
        if (req.files.length) {
            req.body.image_url = req.files[0].filename;
        }
        var getFieldsToSkip = []
        if (req.body.id != '') {
            getFieldsToSkip.push("email", "mobile")
            if (!req.body.password && !req.body.password_confirm) {
                getFieldsToSkip.push("password", "password_confirm");
            }
        }
        var skipFields = {}
        skipFields = {skip: getFieldsToSkip}
        if (err) {
            res.send({status: false, message: err, data: []});
        } else {
            if (typeof req.body.is_business === 'undefined') {
                delete req.body.user_busines_details;
            }
            if (typeof req.body.is_bank === 'undefined') {
                delete req.body.user_bank_details;
            }
            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {
                    modelBuild.validate(skipFields).then(function (err) {
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
                    if (req.body.id == '') {
                        // var otpForMobile = Math.floor((Math.random() * 1000000));
                        // var otpMsgForMobile = 'your otp is ' + otpForMobile;
                        // var otpForEmail = Math.floor((Math.random() * 1000000));
                        // req.body.otp_mobile = otpForMobile;
                        // req.body.otp_email = otpForEmail; //randomstring.generate();
                        var is_update = 0;
                        req.body.otp_status_mobile = 1;
                        req.body.otp_status_email = 1;
                    } else {
                        var is_update = 1;
                    }
                    if (req.body.special_bonus_id == '') {
                        req.body.special_bonus_id = null;
                    }
                    models[modelName].saveAllValuesForProf(req, function (results) {
                        if (results.status) {
                            if (is_update == 0) {
                                var msg = 'Added successfully';
                            } else {
                                var msg = 'Edit successfully';
                            }
                            // if (typeof req.body.id !== 'undefined' && req.body.id != '') {
                            //     var msg = 'Added Successfully';
                            // } else {
                            //     // var msgDateMobile = {otpMsg: otpMsgForMobile, mobile: req.body.mobile}
                            //     // otpObj.sendOtpMessage(msgDateMobile);
                            //     // var fullUrl = 'Your email OTP is : ' + otpForEmail;//req.protocol + '://' + req.get('host') + '/verify-account/' + req.body.token + '/' + results.id;
                            //     // var mailData = {email: req.body.email, subject: "Welcome to NAT", list: {name: req.body.first_name, email: req.body.email, password: req.body.password, link: fullUrl}};
                            //     // mail.sendHtmlMail(mailData);
                            //     var msg = 'Edit Successfully';
                            // }
                            req.flash('type_messages', 'success');
                            req.flash('messages', msg);
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/admin-users/' + req.body.role_id});
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
router.get('/edit-admin-users/:role_id/:id/:view_type', adminAuth.isAllow, function (req, res, next) {
    extraVar['role_id'] = req.params.role_id;
    extraVar['view_type'] = req.params.view_type;
    req.where = {role_id: req.params.role_id}
    models.RoleType.getMasterId(req, function (masterData) {
        //console.log(masterData);
        extraVar['masterData'] = masterData;
        models[modelName].getById(req.params.id, function (data) {
            //console.log(data);
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
                res.render('admin/' + viewDirectory + '/add_admin_users', {data: [], layout: 'admin/layout/layout', extraVar: extraVar, data: results, fromData: data});
            });
        });
    });
});
router.post('/delete-admin-users/:id/:user_type', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    req.where = {id: id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        var url = '/admin/' + viewDirectory + '/admin-users/' + req.params.user_type;
        res.status(200).send({status: true, url: url});
//        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    })
})

router.get('/get-an1-fee/:value/:doc_name', function (req, res, next) {
    console.log(req.params.value);
    models[modelName].get_an1_fee(req, function (data) {
        console.log("-------------------------0000000000000000000000000000")
        console.log(data)
        if (data.status) {
            res.status(200).send({status: true, data: data});
        } else {
            res.status(201).send({status: false, msg: data.msg});
        }

    })
})

router.post('/verify-doc', function (req, res, next) {
    ImageUpload.uploadUserProfilePic(req, res, function (err) {
        if (req.files.length) {

        }
        if (err) {
            res.send({status: false, message: err, data: []});
        } else {
            // console.log("-------------- here data <<<<<<<<<----------------------------")
            // console.log(req.body);
            models[modelName].verify_doc(req, function (data) {
                //console.log("------------------------- Query Data <<<??????????????-------------------")
                // console.log(data)
                var doc_data = {};
                if (data.length) {
                    if (req.body.doc_type == 1) {
                        doc_data.created_on = req.app.locals.site.momentObj(data[0].added_date).format("DD-MM-YYYY");
                        doc_data.number = data[0].id
                        doc_data.val_from = req.app.locals.site.momentObj(data[0].nc_start_date).format("DD-MM-YYYY")
                        doc_data.val_to = req.app.locals.site.momentObj(data[0].nc_end_date).format("DD-MM-YYYY")
                        doc_data.doc_category = data[0].service_details_id;
                        doc_data.doc_type = data[0].service_detail_documents_id;
                    } else if (req.body.doc_type == 3) {
                        //moment(data[0].add_date).format("YYYY DD MM")
                        //selected_plan_year:
                        doc_data.created_on = req.app.locals.site.momentObj(data[0].add_date).format("DD-MM-YYYY");
                        doc_data.number = data[0].id;
                        doc_data.val_from = req.app.locals.site.momentObj(data[0].add_date).format("DD-MM-YYYY");
                        doc_data.val_to = req.app.locals.site.momentObj(data[0].add_date).add(data[0].selected_plan_year, 'years').format("DD-MM-YYYY");
                    } else {


                        doc_data.created_on = req.app.locals.site.momentObj(data[0].created_on).format("DD-MM-YYYY");
                        doc_data.number = data[0].number

                        if (data[0].type == 'n') {
                            doc_data.val_from = req.app.locals.site.momentObj(data[0].val_from).format("DD-MM-YYYY");
                            doc_data.val_to = req.app.locals.site.momentObj(data[0].val_to).format("DD-MM-YYYY");
                        } else {
                            doc_data.val_from = req.app.locals.site.momentObj(data[0].add_date).format("DD-MM-YYYY");
                            doc_data.val_to = req.app.locals.site.momentObj(data[0].add_date).add(data[0].selected_plan_year, 'years').format("DD-MM-YYYY");
                        }


                        doc_data.doc_category = data[0].doc_category;
                        doc_data.doc_type = data[0].doc_type;
                        doc_data.type = data[0].type;

                        console.log(doc_data);

                    }

                    console.log("------------------------- Doc Data <<<??????????????-------------------")
                    //console.log(doc_data)
                    res.status(200).send({status: true, data: doc_data});
                } else {
                    res.status(201).send({status: false, msg: "Record not found"});
                }
            })
        }
    })
});

router.post('/get_exemption_fee', function (req, res, next) {
    models[modelName].get_exemption_fee(req, function (data) {
        if (data.status) {
            res.status(200).send({status: true, data: data});
        } else {
            res.status(201).send({status: false, msg: data.msg});
        }

    })
})







router.post('/xls-upload', function (req, res, next) {
    console.log("-------->>>>>>>>>>>>>>>> HERE IS THE REQ DATA <<<<<<<<<<<<<<--------------------")
    console.log(req.body)
    console.log("----------->>>>>>>>>>>>>>>>>>> ENDS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--------------")
    XlsUpload.uploadUsers(req, res, function (err) {
        adminAuth.isAllow(req, res, function (err) {
            if (err) {
                res.send({status: false, message: err, data: []});
            } else {
                console.log("-------->>>>>>>>>>>>>>>> HERE IS THE REQ DATA <<<<<<<<<<<<<<--------------------")
                console.log(req.body)
                var get_role_id = req.body.role_id;
                console.log("----------->>>>>>>>>>>>>>>>>>> ENDS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--------------")
                models[modelName].xlsUpload(req, function (results) {
                    console.log("------------- return from function ------------------------->  ")
                    console.log(results)
                    if (typeof results.isFileValid !== "undefined" && results.isFileValid === false) {
                        res.status(201).send({status: false, message: "Invalid file"});
                    } else {
                        if (results.status) {
                            console.log("------------ Finally data is ready for insert <<<<//////////////////")
                            console.log(results.data_to_be_saved)
                            var get_data = results.data_to_be_saved;
                            async.eachOfSeries(get_data, function (data_values, data_key, callback_iteration) {
                                var mobile_OTP = Math.floor((Math.random() * 1000000));
                                var email_OTP = Math.floor((Math.random() * 1000000));

                                var get_data_values = {};
                                get_data_values.body = data_values;
                                get_data_values.body.otp_mobile = mobile_OTP;
                                get_data_values.body.otp_email = email_OTP;
                                get_data_values.body.user_bank_details = {is_active: 1}
                                get_data_values.body.user_busines_details = {is_active: 1}
                                console.log("---------------- final data bunch ------------------>>>>>>>>>>>>>>>>>>>>>>>>")
                                console.log(get_data_values)


                                models[modelName].registration(get_data_values, function (reg_status) {
                                    if (reg_status.status) {
                                        /* ------------------- Dynamic Mobile startssssssssssssssssssssss ----------------- */
                                        var fields_to_be_replaced_4mobile = {
                                            mobile_otp: mobile_OTP
                                        }
                                        var otp_option = {
                                            mobile: get_data_values.body.mobile
                                        }
                                        var mobile_template_slug = "registration_mobile_otp",
                                                values_to_be_replaced = fields_to_be_replaced_4mobile,
                                                otp_options = otp_option;
                                        otpObj.dynamicMobileMsg(mobile_template_slug, values_to_be_replaced, otp_options);
                                        /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */


                                        /* ------------------- Dynamic Email startssssssssssssssssssssss ----------------- */
                                        var fields_to_be_replaced = {
                                            user_name: get_data_values.body.first_name,
                                            email_otp: email_OTP,
                                            user_email: get_data_values.body.email,
                                            user_password: get_data_values.body.password
                                        }
                                        var mail_option = {
                                            to: get_data_values.body.email
                                        }
                                        var email_template_slug = "registration_template",
                                                values_to_be_replaced = fields_to_be_replaced,
                                                mail_options = mail_option;
                                        mail.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                                        /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */

                                        callback_iteration();
                                    } else {

                                    }
                                })
                            }, function (iteration_com_callback) {
                                console.log("------------->>>>>>>>>>>>>||||||||||||| DATA SAVED ||||||||||||||<<<<<<<<<<<<<<--------------")
                                req.flash('type_messages', 'success');
                                req.flash('messages', 'Added successfully!');
                                url = '/admin/users/' + get_role_id;

                                res.status(200).send({status: true, url: url});
                            })
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
});
router.post('/xls-upload-ap', function (req, res, next) {
    console.log("-------->>>>>>>>>>>>>>>> HERE IS THE REQ DATA <<<<<<<<<<<<<<--------------------")
    console.log(req.body)
    console.log("----------->>>>>>>>>>>>>>>>>>> ENDS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--------------")
    XlsUpload.uploadUsers(req, res, function (err) {
        if (err) {
            res.send({status: false, message: err, data: []});
        } else {
            console.log("-------->>>>>>>>>>>>>>>> HERE IS THE REQ DATA <<<<<<<<<<<<<<--------------------")
            console.log(req.body)
            var get_role_id = req.body.role_id;
            console.log("----------->>>>>>>>>>>>>>>>>>> ENDS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--------------")
            models[modelName].xlsUpload(req, function (results) {
                console.log("------------- return from function ------------------------->  ")
                console.log(results)
                if (typeof results.isFileValid !== "undefined" && results.isFileValid === false) {
                    res.status(201).send({status: false, message: "Invalid file"});
                } else {
                    if (results.status) {
                        console.log("------------ Finally data is ready for insert <<<<//////////////////")
                        console.log(results.data_to_be_saved)
                        var get_data = results.data_to_be_saved;
                        async.eachOfSeries(get_data, function (data_values, data_key, callback_iteration) {
                            var mobile_OTP = Math.floor((Math.random() * 1000000));
                            var email_OTP = Math.floor((Math.random() * 1000000));

                            var get_data_values = {};
                            get_data_values.body = data_values;
                            get_data_values.body.otp_mobile = mobile_OTP;
                            get_data_values.body.otp_email = email_OTP;


                            get_data_values.body.country_id = req.body.country_id;
                            get_data_values.body.state_id = req.body.state_id;
                            get_data_values.body.division_id = req.body.division_id;
                            get_data_values.body.district_id = req.body.district_id;
                            get_data_values.body.tehsil_id = req.body.tehsil_id;


                            get_data_values.body.user_bank_details = {is_active: 1}
                            get_data_values.body.user_busines_details = {is_active: 1}
                            console.log("---------------- final data bunch ------------------>>>>>>>>>>>>>>>>>>>>>>>>")
                            console.log(get_data_values)


                            models[modelName].registration(get_data_values, function (reg_status) {
                                if (reg_status.status) {
                                    /* ------------------- Dynamic Mobile startssssssssssssssssssssss ----------------- */
                                    var fields_to_be_replaced_4mobile = {
                                        mobile_otp: mobile_OTP
                                    }
                                    var otp_option = {
                                        mobile: get_data_values.body.mobile
                                    }
                                    var mobile_template_slug = "registration_mobile_otp",
                                            values_to_be_replaced = fields_to_be_replaced_4mobile,
                                            otp_options = otp_option;
                                    otpObj.dynamicMobileMsg(mobile_template_slug, values_to_be_replaced, otp_options);
                                    /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */


                                    /* ------------------- Dynamic Email startssssssssssssssssssssss ----------------- */
                                    var fields_to_be_replaced = {
                                        user_name: get_data_values.body.first_name,
                                        email_otp: email_OTP,
                                        user_email: get_data_values.body.email,
                                        user_password: get_data_values.body.password
                                    }
                                    var mail_option = {
                                        to: get_data_values.body.email
                                    }
                                    var email_template_slug = "registration_template",
                                            values_to_be_replaced = fields_to_be_replaced,
                                            mail_options = mail_option;
                                    mail.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                                    /* ------------------- Endssssssssssssssssssssssssssssssssssssss ----------------- */







                                    console.log('=--=-=--=-=-==-==-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=');
                                    models['User'].getByEmail(get_data_values.body.email, function (userData) {
                                        console.log('=--=-=--=-=-==-==-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=');
                                        console.log(userData);

                                        var sendOtp = Math.floor((Math.random() * 1000000));

                                        /* ----------------------------------- Send Mail --------------------------------- */
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
                                        var confUrl = fullUrl + '/mapping-ap/' + userFrId64 + '/' + sendOtp;


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
                                        mail.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                                        /* ------------------- End ----------------- */

                                        var msg = 'Confirmation link sent to user';

                                        req.where = {email: get_data_values.body.email};
                                        req.update = {otp_email_ap: sendOtp};
                                        models['User'].updateOtp(req, function (results) {
                                            //res.status(200).send({status: true, msg: msg, data: []});
                                        });
                                    });

                                    callback_iteration();
                                } else {

                                }
                            })
                        }, function (iteration_com_callback) {
                            console.log("------------->>>>>>>>>>>>>||||||||||||| DATA SAVED ||||||||||||||<<<<<<<<<<<<<<--------------")
                            req.flash('type_messages', 'success');
                            req.flash('messages', 'Added successfully!');
                            url = '/admin/franchises/list-user';

                            res.status(200).send({status: true, url: url});
                        })
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
});


router.post('/verify_doc_file', function (req, res, next) {
    console.log(req.body)
    models[modelName].verify_doc(req, function (data) {
        console.log("------------------------- Query Data <<<??????????????-------------------")
        console.log(data)
        var doc_data = {};
        if (data.length) {
            if (req.body.doc_type == 1) {
                doc_data.created_on = req.app.locals.site.momentObj(data[0].added_date).format("DD-MM-YYYY");
                doc_data.number = data[0].ar_id
                doc_data.val_from = req.app.locals.site.momentObj(data[0].nc_start_date).format("DD-MM-YYYY")
                doc_data.val_to = req.app.locals.site.momentObj(data[0].nc_end_date).format("DD-MM-YYYY")
                doc_data.doc_category = data[0].service_details_id;
                doc_data.doc_type = data[0].service_detail_documents_id;
            } else if (req.body.doc_type == 3) {
                doc_data.created_on = req.app.locals.site.momentObj(data[0].add_date).format("DD-MM-YYYY");
                doc_data.number = data[0].ms_id;
                doc_data.val_from = req.app.locals.site.momentObj(data[0].add_date).format("DD-MM-YYYY");
                doc_data.val_to = req.app.locals.site.momentObj(data[0].add_date).add(data[0].selected_plan_year, 'years').format("DD-MM-YYYY");
            }
            res.status(200).send({status: true, data: doc_data});
        } else {
            res.status(201).send({status: false, msg: "Record not found"});
        }
    })
})

router.post('/change-password', function (req, res, next) {
    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {

        }
        if (err) {
            res.send({status: false, message: err, data: []});
        } else {
            console.log("---------------------------------- req data --------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(req.body)
            //req.body.email = req.user.email;
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
                }], function (err) {

                if (errors.length == 0) {
                    req.where = {id: req.user.id}
                    models[modelName].getFirstValues(req, function (user_data) {
                        if (bcrypt.compareSync(req.body.old_password, user_data.password) === true) {
                            var data_to_be_saved = {}
                            data_to_be_saved.update = {password: req.body.password}
                            data_to_be_saved.where = {id: req.user.id}
                            models[modelName].updatePassword(data_to_be_saved, function (results) {
                                req.flash('type_messages', 'success');
                                req.flash('messages', "Password updated successfully");
                                res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/change-password'});
                            });
                        } else {
                            res.status(201).send({status: false, message: 'Please enter your correct old password'});
                        }
                    })
                } else {
                    res.status(400).send({status: false, msg: ' saved failed', data: errors});
                }
            });
        }
    })
})

router.post('/send-mail-sms', function (req, res, next) {
    ImageUpload.mailAttachment(req, res, function (err) {
        if (req.files.length) {
            req.body.file_name = req.files[0].filename;
            req.body.file_orig_name = req.files[0].originalname;
        }
        if (err) {
            console.log("=================== IMAGE ERROR ===============================================================")
            console.log(err)
            res.status(201).send({status: false, message: err});
        } else {
            var com_type = req.body.msg_type;
            var mailLists = req.body.user_data;

            var parse_mailing_string = JSON.parse(mailLists)

            console.log(parse_mailing_string)
            async.forEachOf(parse_mailing_string, function (get_user_data, key, callback) {
                console.log("--------------------------- Iteration data ----------------------->>>>>>>>>>>>>>>>>")
                if (key < 25) {
                    if (com_type == "email") {
                        console.log("==================== In email section")
                        var file_path = req.app.locals.site.fullUrl + '/uploads/mail-attachments/' + req.body.file_name;

                        var attachments = req.files.length ? [{filename: req.body.file_orig_name, path: file_path}] : [];
                        var set_content = {email: get_user_data.email,
                            subject: req.body.subject,
                            msg: req.body.message,
                            attachments: attachments,
                            list: {email: get_user_data.email}
                        };
                        console.log(set_content)
                        mail.sendMailToUsersFromAdmin(set_content);
                    }
                    if (com_type == "mobile") {
                        console.log("==================== In sms section")
                        console.log("---------- sms sent to ---------------------------->" + get_user_data.mobile)
                        var set_content = {otpMsg: req.body.message, mobile: get_user_data.mobile}
                        console.log(set_content)
                        otpObj.sendOtpMessage(set_content);
                    }
                }
            });

            req.flash('type_messages', 'success');
            req.flash('messages', "Sent successfully");
            res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/send-sms-mail'});
        }
    })
})

module.exports = router;
