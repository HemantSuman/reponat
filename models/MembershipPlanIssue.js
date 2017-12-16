var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("MembershipPlanIssue",
            {
                pay_send_log:{
                 type: DataTypes.STRING   
                },    
                ms_id: {
                    type: DataTypes.STRING,
                },
                franchise_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_district_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_division_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_state_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_country_id: {
                    type: DataTypes.INTEGER,
                },
                selected_plan_year: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                plan_name: {
                    type: DataTypes.STRING,
                },
                selected_plan_registration_fee: {
                    type: DataTypes.STRING,
                },
                selected_plan_membership_fee: {
                    type: DataTypes.STRING,
                },
                selected_plan_total_taxes: {
                    type: DataTypes.STRING,
                },
                selected_plan_total_payable_amount: {
                    type: DataTypes.STRING,
                },
                business_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_type: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_type_primary_id: {
                    type: DataTypes.INTEGER,
                },
                gstin: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_category: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_category_primary_id: {
                    type: DataTypes.INTEGER,
                },
                business_pan_number: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isPanCardValid: function (val) {
                            var regxForPAN = new RegExp('^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$');
                            //if ((val.length != 10) || !isNaN(val.substring(0, 5)) || isNaN(val.substring(5, 9)) || !isNaN(val.substring(9, 10))) {
                            if ((val.length != 10) || !regxForPAN.test(val)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid PAN Number'))
                            }
                        },
                    }
                },
                business_registration_number: {
                    type: DataTypes.STRING,
                    // validate: {
                    //     notEmpty: {
                    //         msg: i18n_Validation.__('required')
                    //     },
                    // }
                },
                business_address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_email: {
                    type: DataTypes.STRING,
                    validate: {
                        isEmail: {
                            msg: i18n_Validation.__('Please_Enter', 'Valid Email Address')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_mobile: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
//                        len: {
//                            args: [10, 10],
//                            msg: i18n_Validation.__('Please_Enter', '10 digit')
//                        },
                        isNumeric: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                    }
                },
                business_kasba: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_division_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_district_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_tehsil_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_country_primary_id: {
                    type: DataTypes.INTEGER,
                },
                business_state_primary_id: {
                    type: DataTypes.INTEGER,
                },
                business_division_primary_id: {
                    type: DataTypes.INTEGER,
                },
                business_district_primary_id: {
                    type: DataTypes.INTEGER,
                },
                business_tehsil_primary_id: {
                    type: DataTypes.INTEGER,
                },
                business_pincode: {
                    type: DataTypes.INTEGER,
                },
                business_turn_over: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_turn_over_primary_id: {
                    type: DataTypes.STRING,
                },
                place_of_arbitration: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_relation_of: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_designation: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_age: {
                    type: DataTypes.STRING,
                    validate: {
                        min: {
                            args: 18,
                            msg: i18n_Validation.__('less-than', '18')
                        },
                        not: {
                            args: ["[a-z]", 'i'],
                            msg: i18n_Validation.__('Please_Enter', 'Numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_caste: {
                    type: DataTypes.STRING,
                    // validate: {
                    //     notEmpty: {
                    //         msg: i18n_Validation.__('required')
                    //     },
                    // }
                },
                authority_address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_kasba: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_division_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_district_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_tehsil_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_country_primary_id: {
                    type: DataTypes.INTEGER,
                },
                authority_state_primary_id: {
                    type: DataTypes.INTEGER,
                },
                authority_division_primary_id: {
                    type: DataTypes.INTEGER,
                },
                authority_district_primary_id: {
                    type: DataTypes.INTEGER,
                },
                authority_tehsil_primary_id: {
                    type: DataTypes.INTEGER,
                },
                authority_pincode: {
                    type: DataTypes.INTEGER,
                },
                authority_government_type: {
                    type: DataTypes.STRING,
                    validate: {
                        isGovNumberEntered: function (val) {
                            if (this.authority_government_id_number != "" && val == "") {
                                throw new Error(i18n_Validation.__('required'))
                            }
                        }
                    }
                },
                authority_government_id_number: {
                    type: DataTypes.STRING,
                    validate: {
                        isPanCardValid: function (val) {
                            if (this.authority_government_type == "PAN Number") {
                                if ((val.length != 10) || !isNaN(val.substring(0, 5)) || isNaN(val.substring(5, 9)) || !isNaN(val.substring(9, 10))) {
                                    throw new Error(i18n_Validation.__('Please_Enter', 'Valid PAN Number'))
                                }
                            }
                        },
                        isAuthorityGovernmentType: function (val) {
                            if (this.authority_government_type != "" && val == "") {
                                throw new Error(i18n_Validation.__('required'))
                            }
                        }
                        // notEmpty: {
                        //     msg: i18n_Validation.__('required')
                        // },
                    }
                },
                authority_pan_number: {
                    type: DataTypes.STRING,
                    // validate: {
                    //     notEmpty: {
                    //         msg: i18n_Validation.__('required')
                    //     },
                    // }
                },
                authority_mobile: {
                    type: DataTypes.INTEGER,
                    validate: {
                        not: {
                            args: ["[a-z]", 'i'],
                            msg: i18n_Validation.__('Please_Enter', 'Numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_email: {
                    type: DataTypes.STRING,
                    validate: {
                        isEmail: {
                            msg: i18n_Validation.__('Please_Enter', 'valid email')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                authority_aadhar: {
                    type: DataTypes.STRING,
                    validate: {
                        isAadharCardValidation: function (val) {
                            if (val.length != 0 && val.length != 12 || isNaN(val)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Aadhar Number'))
                            }
                        }
                    }
                },
                add_date: {
                    type: DataTypes.STRING,
                },
                end_date: {
                    type: DataTypes.STRING,
                },
                invoice_no: {
                    type: DataTypes.STRING,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                },
                is_active: {
                    type: DataTypes.STRING,
                },
                payment_detail: {
                    type: DataTypes.STRING,
                },
                invoice_billing_to: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                invoice_state_code: {
                    type: DataTypes.STRING,
                },
                invoice_gst_no: {
                    type: DataTypes.STRING,
                },
                invoice_address: {
                    type: DataTypes.STRING,
                },
                invoice_town: {
                    type: DataTypes.STRING,
                },
                invoice_country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                invoice_state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                invoice_division_id: {
                    type: DataTypes.STRING,
                },
                invoice_district_id: {
                    type: DataTypes.STRING,
                },
                invoice_tehsil_id: {
                    type: DataTypes.STRING,
                },
                invoice_state_id_primary_id: {
                    type: DataTypes.INTEGER,
                },
                parent_membership_id: {
                    type: DataTypes.INTEGER,
                },
                parent_membership_period: {
                    type: DataTypes.STRING,
                },
                is_renewed: {
                    type: DataTypes.INTEGER,
                },
            },
            {
                tableName: 'membership_plan_issues',
                classMethods: {
                    associate: function (models) {
                        //var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
                    },
                    getAllValues: function (req, res) {
                        myModel.findAll({where: req.where}).then(function (results) {
                            res(results);
                        });
                    },
                    getFirstValuesForEditIssue: function (req, res) {
//                        var mymodelMembershipPlanFeeHasMany = myModel.hasMany(sequelize.models.MembershipPlanFee, {foreignKey: 'membership_plan_id', as: 'membership_plan_fees'});
                        var resultsWithFee = {};
                        myModel.findOne({where: req.where,
                            include: [
//                                mymodelMembershipPlanFeeHasMany
                            ]}).then(function (results) {
                            resultsWithFee['results'] = results;
                            if (results && typeof results.selected_plan_year != 'undefined') {
                                req.body.membership_id = results.business_turn_over_primary_id;
                                req.body.state_id = results.invoice_state_id;
                                this.getFee(req, function (data) {
                                    resultsWithFee['fee'] = data;
                                    res(resultsWithFee);
                                });

                            } else {
                                res(resultsWithFee);
                            }
                        });
                    },
                    getAllValuesPaging: function (req, res) {

                        var com = myModel.hasOne(sequelize.models.CommissionDistribution, {foreignKey: 'membership_plan_issue_id', as: 'com'})
                        var creator = myModel.belongsTo(sequelize.models.User, {foreignKey: 'user_id', as: 'user'});


                        var ap_level_1 = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_1', foreignKey: 'franchise_id'});
                        var ap_level_2 = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_2', foreignKey: 'franchise_district_id'});
                        var ap_level_3 = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_3', foreignKey: 'franchise_division_id'});
                        var ap_level_4 = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_4', foreignKey: 'franchise_state_id'});


                        var ap_level_1_level = myModel.belongsTo(sequelize.models.FranchiseLevel, {as: 'ap_level_1_level', foreignKey: 'franchise_state_id'});

                        srhData = req.query;


                        //serchObj = {user_id: req.user.id};

                        if (srhData.gstin) {
                            req.where.gstin = {$like: '%' + srhData.gstin + '%'};

                        }

                        if (srhData.business_name) {
                            req.where.business_name = {$like: '%' + srhData.business_name + '%'};
                        }

                        if (srhData.authority_name) {
                            req.where.authority_name = {$like: '%' + srhData.authority_name + '%'};
                        }

                        if (srhData.id) {
                            req.where['ms_id'] = {$like: '%' + srhData.id + '%'};
//                            req.where.ms_id = srhData.id;//{$like: '%' + srhData.id + '%'};
                        }


                        if (srhData.start_date && srhData.end_date) {
                            var start_date = req.app.locals.site.momentObj(srhData.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                            var end_date = req.app.locals.site.momentObj(srhData.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD');

                            req.where.add_date = {
                                $lte: end_date,
                                $gte: start_date
                            }
                        }



                        var whrObj = {};
                        if (req.user.user_type.role_type_slug != 'super_admin') {
                            whrObj = {user_id: req.user.id};
                        }

                        var apSrchObj = {};

                        if (srhData.scale && srhData.ap_name) {
                            apSrchObj[srhData.scale] = {first_name: {$like: '%' + srhData.ap_name + '%'}};
                        }


                        //req.where['ap_level_1.first_name'] = {$like: '%ggggg%'};

                        myModel.findAndCountAll({
                            where: req.where,
                            offset: req.offset,
                            limit: req.limit,
                            order: 'id DESC',
                            group: 'MembershipPlanIssue.id',
                            //include: [com, creator, ap_level_1, ap_level_2, ap_level_3, ap_level_4, ap_level_1_level],
                            include: [
                                {association: com},
                                {association: creator},
                                {association: ap_level_1, where: apSrchObj[1]},
                                {association: ap_level_2, where: apSrchObj[2]},
                                {association: ap_level_3, where: apSrchObj[3]},
                                {association: ap_level_4, where: apSrchObj[4]},
                                {association: ap_level_1_level},
                            ]



//                    include: [{association: com, where: whrObj}]
                        }).then(function (results) {

                            if (results) {
                                var query_aplevels = '';
                                query_aplevels += " SELECT user_id,  "
                                query_aplevels += " CASE franchise_level "
                                query_aplevels += " WHEN 'state_level' THEN group_concat(state_name)  "
                                query_aplevels += " WHEN 'division_level' THEN group_concat(division_name) "
                                query_aplevels += " WHEN 'district_level' THEN group_concat(district_name) "
                                query_aplevels += " ELSE group_concat(tehsil_name) "
                                query_aplevels += " END as location "
                                query_aplevels += " FROM  "
                                query_aplevels += " franchise_levels fl left join states s on fl.state_id=s.id "
                                query_aplevels += " left join divisions dv on fl.division_id=dv.id "
                                query_aplevels += " left join districts ds on fl.district_id=ds.id "
                                query_aplevels += " left join tehsils t on fl.tehsil_id=t.id "
                                query_aplevels += " group by user_id "

                                sequelize.query(query_aplevels,
                                        {replacements: [], type: sequelize.QueryTypes.SELECT}
                                ).then(function (ap_data) {
                                    //results = results.get({plain: true});
                                    //results.franchise_id = ap_data[0].franchise_id;
                                    //results.franchise_level = ap_data[0].franchise_level;

                                    var apLoc = {};

                                    async.each(ap_data, function (rows, callback) {

                                        apLoc[rows.user_id] = rows.location;

                                        //console.log(apLoc);
                                        callback();
                                    }, function (err) {
                                        console.log(err);
                                    });





                                    //console.log(users);
                                    res({apLoc: apLoc, results: results});
                                });
                            } else {
                                res({apLoc: null, results: null});
                            }

                            //console.log(results);
                            //res(results);
                        });
                    },
//                    getByEmail: function (email, res) {
//                        myModel.findOne({where: {email: email}}).then(function (users) {
//                            res(users);
//                        });
//                    },
//                    getById: function (id, res) {
//                        myModel.findOne({where: {id: id}}).then(function (result) {
//                            res(result);
//                        });
//                    },
                    getBy: function (req, res) {
                        myModel.findAll({where: req.where}).then(function (data) {
                            res(data);
                        });
                    },
                    updatePayment: function (values, res) {
                        myModel.update(values.data, {where: values.where}, {
                        }).then(function (data) {
                            var results = {};
                            results = values.body;
                            results.status = 1;
                            res(results);
                        }).catch(function (err) {
                            console.log(err);
                            var errors = err;
                            errors.status = false;
                            res(errors);
                        });
                    },
                    getAllPlanData: function (req, res) {

                        var query = '';
                        query += ' SELECT mp.*, mt.*, u.*, rt.*,mp.id id, p_mpi.ms_id parent_membership_id_parent '
                        query += 'FROM membership_plan_issues mp left join membership_plan_issue_taxes mt '
                        query += 'on mp.id=mt.membership_plan_issue_id '
                        query += 'left join users u on mp.user_id=u.id '
                        query += 'left join role_types rt on u.role_type_id=rt.id '
                        query += 'left join membership_plan_issues p_mpi on p_mpi.id=mp.parent_membership_id '
                        query += 'WHERE mp.id = ? '
                        sequelize.query(query,
                                {replacements: [req.params.id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (data) {
                            res(data);
                        });
                    },
                    changeStatus: function (values, res) {
                        myModel.update(values.body, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                    saveAllValues: function (values, res) {

                        values.body.membership_id = values.body.business_turn_over_primary_id;
                        values.body.state_id = values.body.invoice_state_id;
                        values.body.add_date = values.app.locals.site.momentObj().format('YYYY-MM-DD');
                        values.body.end_date = values.app.locals.site.momentObj(values.body.add_date).add(values.body.selected_plan_year, 'years').subtract(1, 'days').format('YYYY-MM-DD');

                        this.getFee(values, function (data) {

                            values.body.membership_plan_issue_taxes = {};
                            async.forEachOf(data, function (results, key, callback) {

                                if (results.number_of_years == values.body.selected_plan_year) {


                                    values.body.selected_plan_registration_fee = results.registration_fee;
                                    values.body.selected_plan_membership_fee = results.fees;
                                    values.body.selected_plan_total_taxes = results.total_tax;
                                    values.body.selected_plan_total_payable_amount = results.pay_amount;


                                    values.body.membership_plan_issue_taxes = results.taxArr;
                                    async.forEachOf(results.taxArr, function (results1, key1, callback1) {

                                        results1.membership_plan_id = values.body.membership_id;

                                    });

                                }
                                callback(null, true);

                            }, function (errors, results) {
                                if (values.body.id) {
                                    sequelize.models['MembershipPlanIssueTax'].destroy({
                                        where: {membership_plan_issue_id: values.body.id}
                                    }).then(function (data) {

                                        values.where = {id: values.body.id};
                                        myModel.update(values.body, {where: values.where}).then(function (results1) {
                                            results1 = values.body;
                                            async.forEachOf(values.body.membership_plan_issue_taxes, function (results3, key3, callback3) {
                                                results3.membership_plan_issue_id = results1.id;
                                                callback3(null, '');

                                            }, function (error) {

                                                sequelize.models['MembershipPlanIssueTax'].saveBulkData(values.body.membership_plan_issue_taxes, function (results2) {

                                                });

                                                results1.status = 1;
                                                res(results1);
                                            });

                                        }).catch(function (err) {
                                            var errors = err;
                                            errors.status = false;
                                            res(errors);
                                        });
                                    });
                                } else {

                                    myModel.create(values.body).then(function (results1) {

                                        async.forEachOf(values.body.membership_plan_issue_taxes, function (results3, key3, callback3) {
                                            results3.membership_plan_issue_id = results1.id;
                                            callback3(null, '');

                                        }, function (error) {

                                            sequelize.models['MembershipPlanIssueTax'].saveBulkData(values.body.membership_plan_issue_taxes, function (results2) {

                                            });
                                            results1.status = 1;
                                            res(results1);
                                        });

                                    }).catch(function (err) {
                                        var errors = err;
                                        errors.status = false;
                                        res(errors);
                                    });

                                }

                            });
                        });


                    },
                    saveAllValuesRenew: function (values, res) {

                        values.body.membership_id = values.body.business_turn_over_primary_id;
                        values.body.state_id = values.body.invoice_state_id;
                        values.body.is_renew = 1;
//                        values.body.add_date = values.app.locals.site.momentObj().format('YYYY-MM-DD');
                        values.body.end_date = values.app.locals.site.momentObj(values.body.add_date).add(values.body.selected_plan_year, 'years').subtract(1, 'days').format('YYYY-MM-DD');
//                        console.log('values.body');
//                        console.log(values.body);
                        this.getFee(values, function (data) {

                            values.body.membership_plan_issue_taxes = {};
                            async.forEachOf(data, function (results, key, callback) {

                                if (results.number_of_years == values.body.selected_plan_year) {


                                    values.body.selected_plan_registration_fee = results.registration_fee;
                                    values.body.selected_plan_membership_fee = results.fees;
                                    values.body.selected_plan_total_taxes = results.total_tax;
                                    values.body.selected_plan_total_payable_amount = results.pay_amount;


                                    values.body.membership_plan_issue_taxes = results.taxArr;
                                    async.forEachOf(results.taxArr, function (results1, key1, callback1) {

                                        results1.membership_plan_id = values.body.membership_id;

                                    });

                                }
                                callback(null, true);

                            }, function (errors, results) {

//                                console.log(values.body);
                                myModel.create(values.body).then(function (results1) {

                                    async.forEachOf(values.body.membership_plan_issue_taxes, function (results3, key3, callback3) {
                                        results3.membership_plan_issue_id = results1.id;
                                        callback3(null, '');

                                    }, function (error) {

                                        sequelize.models['MembershipPlanIssueTax'].saveBulkData(values.body.membership_plan_issue_taxes, function (results2) {

                                        });
                                        results1.status = 1;
                                        res(results1);
                                    });

                                }).catch(function (err) {
                                    var errors = err;
                                    errors.status = false;
                                    res(errors);
                                });


                            });
                        });


                    },
                    saveDraftIssue: function (req, res) {

                        if (req.body.id) {

                            myModel.update(req.body, {
                                where: {id: req.body.id}
                            }).then(function (results) {
                                results.status = 1;
                                res(results);
                            }).catch(function (err) {
                                console.log(err);
                                var errors = err;
                                errors.status = false;
                                res(errors);
                            });

                        } else {



                            myModel.create(req.body).then(function (results1) {
                                results1.status = 1;
                                res(results1);
                            }).catch(function (err) {
                                var errors = err;
                                errors.status = false;
                                res(errors);
                            });

                        }

                    },
                    getFee: function (req, res) {

                        var query = '';
                        query += ' SELECT * FROM membership_plans m left join membership_plan_fees f on m.id=f.membership_plan_id where m.id=? AND m.is_active=1 AND f.is_active=1 order by f.number_of_years asc'
                        sequelize.query(query,
                                {replacements: [req.body.membership_id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (data) {

                            var state = req.body.state_id;
                            var taxQuery = '';
                            //GST Logic --------------------------------------
                            if (state == 'rajasthan' || state == 'Rajasthan') {
                                taxQuery = " and tax_slug != 'igst' ";
                            } else {
                                taxQuery = " and tax_slug !='sgst' and tax_slug!='cgst' ";
                            }
                            //------------------------------------------------


                            console.log(state);
                            console.log(taxQuery);


                            tax_query = '';
                            tax_query += ' SELECT * FROM taxes where is_active=1 ' + taxQuery;
                            tax_dataObj = {};
                            tax_data_arr = [];
                            sequelize.query(tax_query,
                                    {replacements: [], type: sequelize.QueryTypes.SELECT}
                            ).then(function (tax_data) {


                                console.log(tax_data);
                                console.log('tax_data---------------------------------');



                                retObj = {};
                                retArr = [];
                                async.each(data, function (plan_data, callback) {
                                    retObj = {};
                                    var total_tax = 0;
                                    var total_cess = 0;
                                    console.log('req.body.is_renew');
                                    console.log(req.body.is_renew);
                                    if(req.body.is_renew && req.body.is_renew == 1){
                                        plan_data['registration_fee'] = 0;
                                    }

                                    var total_plan = parseFloat(plan_data['fees']) + parseFloat(plan_data['registration_fee']);
                                    retObj['total'] = total_plan;
                                    retObj['number_of_years'] = plan_data['number_of_years'];
                                    retObj['plan_title'] = plan_data['plan_title'];
                                    retObj['registration_fee'] = plan_data['registration_fee'];
                                    retObj['fees'] = plan_data['fees'];


                                    tax_data_arr = [];
                                    async.each(tax_data, function (tax_data_rows, callback) {
                                        tax_dataObj = {};

                                        //1 - Tax, 2 - Cess 

                                        if (tax_data_rows['tax_type'] == 1) {

                                            tax_dataObj['tax_value'] = tax_data_rows['tax_value'];
                                            tax_dataObj['tax_name'] = tax_data_rows['tax_name'];
                                            tax_dataObj['tax_type'] = tax_data_rows['tax_type'];
                                            tax_amount_var = (total_plan * parseFloat(tax_data_rows['tax_value'])) / 100

                                            tax_dataObj['tax_amount'] = parseFloat(tax_amount_var).toFixed(2);

                                            tax_data_arr.push(tax_dataObj);

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

                                    console.log('tax ' + total_tax);
                                    console.log('cess ' + total_cess_amu);

                                    if (total_tax > 0) {
                                        total_tax_amu = (total_plan * total_tax) / 100

                                    }

                                    if (total_cess > 0) {
                                        total_cess_amu = (total_plan * total_cess) / 100
                                    }


                                    async.each(tax_data, function (tax_data_rows, callback) {
                                        tax_dataObj = {};
                                        //1 - Tax, 2 - Cess 
                                        //console.log('cess--------------------------------------');
                                        if (tax_data_rows['tax_type'] == 1) {

                                        } else {
                                            //console.log('cess+++++++++++++++++++++++++')
                                            tax_dataObj['tax_value'] = tax_data_rows['tax_value'];
                                            tax_dataObj['tax_name'] = tax_data_rows['tax_name'];
                                            tax_dataObj['tax_type'] = tax_data_rows['tax_type'];

                                            tax_amount_var = (total_plan * parseFloat(tax_data_rows['tax_value'])) / 100

                                            tax_dataObj['tax_amount'] = parseFloat(tax_amount_var).toFixed(2);
                                            tax_data_arr.push(tax_dataObj);
                                        }

                                        callback();
                                    }, function (err) {
                                        console.log(err);
                                    });



                                    retObj['taxArr'] = tax_data_arr;
                                    retObj['tax'] = total_tax_amu;
                                    retObj['cess'] = total_cess_amu;
                                    retObj['total_tax'] = total_tax_amu + total_cess_amu;
                                    retObj['pay_amount'] = total_plan + total_tax_amu + total_cess_amu;
                                    retArr.push(retObj);
                                }, function (err) {
                                    console.log(err);
                                });
                                res(retArr);

                            });


                        });
                    },
                    updateAllValues: function (values, res) {
                        if (values.body.is_active === 'on') {
                            values.body.is_active = 1;
                        } else {
                            values.body.is_active = 0;
                        }
                        var mymodelMembershipPlanFeeHasMany = myModel.hasMany(sequelize.models.MembershipPlanFee, {foreignKey: 'membership_plan_id', as: 'membership_plan_fees'});
                        if (typeof values.body.is_active === 'undefined') {
                            values.body.is_active = 0;
                        }

                        var relativeModels = ['MembershipPlanFee'];
                        var relativeRequatAlise = ['membership_plan_fees'];
                        async.forEach(relativeModels, function (value1, callback1) {

                            var where = {'membership_plan_id': values.body.id};
                            var indexOfArray = relativeModels.indexOf(value1);

                            sequelize.models[value1].deleteByValue(where, function (results) {
                                sequelize.models[value1].saveBulkData(values.body[relativeRequatAlise[indexOfArray]], function (results) {

                                });
                                callback1(null);
                            });

                        }, function (err) {

                            myModel.update(values.body, {
                                where: {id: values.body.id}
                            }).then(function (results) {
                                results.status = 1;
                                res(results);
                            }).catch(function (err) {
                                console.log(err);
                                var errors = err;
                                errors.status = false;
                                res(errors);
                            });
                        });
                    },
                    getMembershipForRenewReminder: function (req, res) {
                        var creator = myModel.belongsTo(sequelize.models.User, {foreignKey: 'user_id', as: 'user'});
                        myModel.findOne({
                            where: req.where,
                            include: [
                                {association: creator}
                            ]
                        }).then(function (get_data) {
                            res(get_data)
                        })
                    },
                    getRenewValuesPaging: function (req, res) {

                        var MemhasOne = myModel.hasOne(myModel, {as: 'parent_ms', foreignKey: 'parent_membership_id'});
//                        req.where['$parent_ms.id$']={$eq: null}
                        myModel.findAndCountAll({
                            where: req.where,
                            offset: req.offset,
                            limit: req.limit,
                            order: 'id DESC',
                            include: [{association: MemhasOne}],
                        }).then(function (results) {
                            res(results);
                        });
                    },
                    getFirstValuesForRenew: function (req, res) {
                        console.log(req.where);
                        myModel.findOne({
                            where: req.where,
                        }).then(function (results) {
                            res(results);
                        });
                    },
                },
                hooks: {
                    beforeCreate: function (values, options) {
                        // if (typeof values.is_active === 'undefined') {
                        //     values.is_active = 0;
                        // }
                    }
                }
            }
    );

    return myModel;
};
