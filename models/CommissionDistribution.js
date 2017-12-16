var async = require("async");
//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
// setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});
var moment = require('moment');
i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
module.exports = function (sequelize, DataTypes) {

    var myModel = sequelize.define("CommissionDistribution",
            {
                added_date: {
                    type: DataTypes.DATE
                },
                arbitration_agreements_id: {
                    type: DataTypes.STRING
                },
                membership_plan_issue_id: {
                    type: DataTypes.STRING
                },
                activity: {
                    type: DataTypes.STRING
                },
                commission_amount: {
                    type: DataTypes.STRING
                },
                commission_value: {
                    type: DataTypes.STRING
                },
                commission_type: {
                    type: DataTypes.STRING
                },
                bonus_commission_amount: {
                    type: DataTypes.STRING
                },
                bonus_rate: {
                    type: DataTypes.STRING
                },
                commission_tds: {
                    type: DataTypes.STRING
                },
                commission_tds_rate: {
                    type: DataTypes.STRING
                },
                final_commission: {
                    type: DataTypes.STRING
                },
                user_id: {
                    type: DataTypes.STRING
                },
                commission_base_amount: {
                    type: DataTypes.STRING
                },
                activity_type: {
                    type: DataTypes.STRING
                },
                paid_commission_id: {
                    type: DataTypes.STRING
                },
                penalty_rate: {
                    type: DataTypes.STRING
                },
                penalty: {
                    type: DataTypes.STRING
                },
                paid: {
                    type: DataTypes.STRING
                },
                admin_pay: {
                    type: DataTypes.STRING
                }
            },
            {
                tableName: 'commission_distributions',
                classMethods: {
                    associate: function (models) {
                        //var mymodelBussinessHasOne = myModel.hasOne(models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                    },
                    method1: function (req, res) {
                        myModel.findAll().then(function (users) {
                            res(users);
                        });
                    },
                    getAllValues: function (req, res) {

                        var joinIs = sequelize.models.CommissionPaid.hasMany(myModel, {foreignKey: 'paid_commission_id', as: 'list'});
                        var user = myModel.belongsTo(sequelize.models.User, {foreignKey: 'user_id', as: 'user'});
                        var role = sequelize.models.User.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'role'});

                        var issue_m = sequelize.models.CommissionPaid.belongsTo(sequelize.models.MembershipPlanIssue, {foreignKey: 'membership_plan_issue_id', as: 'issue_m'});
                        var issue_ny = sequelize.models.CommissionPaid.belongsTo(sequelize.models.ArbitrationAgreements, {foreignKey: 'arbitration_agreements_id', as: 'issue_ny'});
                        var issue_ny_fee = sequelize.models.ArbitrationAgreements.hasOne(sequelize.models.ArbitrationAgreementFee, {foreignKey: 'arbitration_agreements_id', as: 'issue_ny_fee'});



                        sequelize.models.CommissionPaid.findAll({where: req.where,
                            order: sequelize.fn('FIELD', sequelize.col('list.activity'), ['Stamp Vendor', 'Document Creator', 'Freeze Deal', 'tehsil_level', 'district_level', 'division_level', 'state_level', 'country_level']),
                            include: [
                                //{all: true, nested: true}
                                {association: joinIs, include: [{association: user, include: [{association: role}]}]},
                                //{association: user, include: [{association:role}], required: true},
                                //{association: role, include: [], required: true},
                                {association: issue_m, include: []},
                                {association: issue_ny, include: [{association: issue_ny_fee}]},
                            ]}
                        ).then(function (results) {
                            //console.log(results[0]);
                            res(results);
                        });

                    },
                    commissionCalcMembership: function (req, res) {

//                req.id = 32;
//                req.product_id = 3;
//                req.service_detail_id = 2;

                        var query = '';
                        query += ' SELECT * FROM membership_plan_issues where id=? '
                        sequelize.query(query,
                                {replacements: [req.id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (dataArr) {

                            data = dataArr[0];
                            dataAll = dataArr[0];
                            //req.totalAmount = parseFloat(data.selected_plan_registration_fee) + parseFloat(data.selected_plan_membership_fee);
                            req.totalAmount = parseFloat(data.selected_plan_membership_fee);

                            req.pay = data.selected_plan_total_payable_amount;
                            req.tax = data.selected_plan_total_taxes;



                            //console.log('data=================================1');
                            //console.log(data);


                            arrMain = [];
                            arrMainCom = [];


                            req.act = 'Document Creator';
                            req.type_user_id = 'user_id';
                            req.call_type = 'm';
                            req.professionalUserId = data.user_id;
                            sequelize.models.CommissionDistribution.commissionCalcById(req, function (data3) {
//                        if (Object.keys(data3).length !== 0) {
//                            arrMain.push(data3);
//                        }

                                req.user_id = data.user_id;
                                req.franchise_id = data.franchise_id;
                                data4 = [];
                                req.level_type = 'Document Creator';
                                sequelize.models.CommissionDistribution.franchiseCommissionCalcNyayaCard(req, function (data4) {
                                    //arrMain.push(data4);
                                    //arrMain.concat(data4)
//                            arrMainCom.concat(data4);
//                            console.log('Membership user>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<');
//                            console.log(data4);


                                    if (data4 && Object.keys(data4[0]).length === 0) {
                                        data4 = [];
                                    }

                                    if (data4 && Object.keys(data3).length !== 0) {
                                        data4.unshift(data3);
                                    }

//                                    console.log('data44444444444444');
//                                    console.log(data4);
                                    req.final_data = data4;
                                    sequelize.models.CommissionDistribution.commissionTotal(req, function (total_data) {
                                        res({data: data4, total: total_data});
                                    });




                                });
                            });


                        });

                    },
                    commissionCalc: function (req, res) {
//                req.id = 324;
//                req.product_id = 1;
//                req.service_detail_id = 2;

                        var query = '';
                        query += ' SELECT * FROM arbitration_agreements a left join arbitration_agreement_fees af on a.id=af.arbitration_agreements_id where a.id=? '
                        sequelize.query(query,
                                {replacements: [req.id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (dataArr) {

                            data = dataArr[0];
                            dataAll = dataArr[0];


                            req.feeAllData = dataAll;

                            req.totalAmount = data.arbitration_agreement_total_fees_without_tax;

                            req.pay = data.arbitration_agreement_total_fees;
                            req.tax = parseFloat(data.arbitration_agreement_total_fees_tax) + parseFloat(data.arbitration_agreement_total_fees_cess);

                            //console.log('data=================================1');
                            //console.log(data);


                            arrMain = [];
                            arrMainCom = [];

                            req.act = 'Stamp Vendor';
                            req.type_user_id = 'stamp_user_id';
                            req.call_type = 'n';
                            sequelize.models.CommissionDistribution.commissionCalcById(req, function (data1) {
                                if (Object.keys(data1).length !== 0) {
                                    arrMain.push(data1);
                                }

                                req.act = 'Freeze Deal';
                                req.type_user_id = 'freeze_user_id';
                                sequelize.models.CommissionDistribution.commissionCalcById(req, function (data2) {
                                    if (Object.keys(data2).length !== 0) {
                                        arrMain.push(data2);
                                    }

                                    req.act = 'Document Creator';
                                    req.type_user_id = 'user_id';
                                    sequelize.models.CommissionDistribution.commissionCalcById(req, function (data3) {
                                        if (Object.keys(data3).length !== 0) {
                                            arrMain.push(data3);
                                        }

                                        req.freeze_user_id = dataAll.freeze_user_id;
                                        req.create_user_id = dataAll.user_id;

                                        req.user_id = data.user_id;
                                        req.franchise_id = data.franchise_id;
                                        data4 = [];
                                        req.level_type = 'Document Creator';


                                        req.user_id = dataAll.freeze_user_id;
                                        data5 = [];
                                        req.level_type = 'Document Creator';
                                        sequelize.models.CommissionDistribution.franchiseCommissionCalcNyayaCard(req, function (data5) {
                                            //arrMainCom.concat(data5);

                                            newarr = arrMain.concat(data5);

                                            req.final_data = newarr;
                                            sequelize.models.CommissionDistribution.commissionTotal(req, function (total_data) {
                                                res({data: newarr, total: total_data});
                                            });


                                        });


                                    });
                                });
                            });
                        });
                    },
                    commissionTotal: function (req, res) {

                        totalArr = [];
                        totalObj = {};
                        var commission_amount = 0;
                        var bonus_commission_amount = 0;
                        var commission_tds = 0;
                        var final_commission = 0;

                        var svAmuIfNot = 0;



                        //console.log(req.final_data);
                        //req.final_data.filter(function(e){return e});
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>LPG....');
                        console.log(req.final_data);
                        async.each(req.final_data, function (rows, callback) {

                            //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                            //console.log(rows);
                            //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');

                            if (typeof rows === 'undefined' || Object.keys(rows).length === 0) {
                                return false;
                            }
                            console.log('{OP}');
                            console.log(rows['final_commission'] + '???' + rows['commission_amount']);

                            //final_commission  ---> commission without tds

                            commission_amount = commission_amount + rows['commission_amount'];
                            bonus_commission_amount = bonus_commission_amount + rows['bonus_commission_amount'];
                            commission_tds = commission_tds + rows['commission_tds'];
                            final_commission = final_commission + rows['final_commission'];

                            if (!rows.user_id) {
                                console.log('user--------------------', req.final_data.user_id, rows['final_commission']);
                                svAmuIfNot = rows['final_commission'];
                            }

                            //console.log(rows['commission_amount']+'????'+commission_amount);

                            callback();
                        }, function (err) {
                            console.log(err);
                        });
                        totalObj['commission_base_amount'] = req.totalAmount;
                        totalObj['arbitration_agreements_id'] = req.id;
                        totalObj['commission'] = commission_amount;
                        totalObj['bonus'] = bonus_commission_amount;
                        totalObj['tds'] = commission_tds;
                        totalObj['total'] = final_commission;

                        //Calculate Base Fee

                        var remainAmu = 0;
                        var base_fee = 0;

                        console.log('yerfee-------', req.totalAmount, final_commission);
                        //remainAmu = req.totalAmount - final_commission;
                        remainAmu = req.totalAmount;

                        console.log('remainAmu-------', remainAmu, commission_tds, final_commission);

                        //remainAmu = req.totalAmount - svAmuIfNot;
                        remainAmu = remainAmu - commission_tds;
                        remainAmu = remainAmu - final_commission;
                        //remainAmu = remainAmu - commission_tds;



                        base_fee = ((remainAmu) * parseFloat(req.app.locals.settingData.basic_fee)) / 100

                        totalObj['remian_amu'] = remainAmu;

                        console.log('baseFeeee', svAmuIfNot, base_fee, commission_tds, parseFloat(req.tax));

                        totalObj['base_amount'] = svAmuIfNot + base_fee + commission_tds + parseFloat(req.tax);

                        console.log('baseFeeee', totalObj['base_amount']);

                        totalObj['year_amount'] = remainAmu - base_fee;

                        //console.log('yerfee', remainAmu, base_fee);
                        console.log('yerfee', totalObj['year_amount']);

                        totalObj['pay'] = req.pay;
                        totalObj['tax'] = req.tax;

                        totalObj['base_fee_per'] = req.app.locals.settingData.basic_fee;
                        totalObj['tds_per'] = req.app.locals.settingData.tds;


                        //New Logic For Base & Year Fee---------------------------------

                        if (typeof req.feeAllData !== 'undefined' && typeof req.feeAllData.arbitration_agreement_total_year !== 'undefined') {

                            var yrs = req.feeAllData.arbitration_agreement_total_year
                            var yrsFee = req.feeAllData.arbitration_agreement_per_year_fee * (parseInt(yrs) - 1);

                            var finalBaseFee = req.feeAllData.arbitration_agreement_total_fees + svAmuIfNot - yrsFee - final_commission;

                            totalObj['base_amount'] = finalBaseFee;
                            totalObj['year_amount'] = yrsFee;
                            totalObj['total'] = parseFloat(final_commission) - svAmuIfNot;

                        }
                        //--------------------------------------------------------------


                        console.log('svAmuIfNot===============');
                        console.log(svAmuIfNot);
                        console.log('svAmuIfNot===============');
                        console.log(totalObj);

                        res(totalObj);

                    },
                    commissionCalcById: function (req, res) {

                        console.log('req.act^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*');
                        console.log(req.act);
                        console.log('req.act^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*');

                        var Sequelize = require('sequelize');
                        var sequelize = require('../config/db');


                        allUserArr = [];
                        var totalAmount = 0;
                        var totalAmount = req.totalAmount//data.arbitration_agreement_total_fees_without_tax;


                        commissionDataAll = [];
                        commissionDataObj = {};

                        //req.act = 'Freeze Deal';
                        //req.type_user_id = 'freeze_user_id';

                        if (req.type_user_id == 'stamp_user_id' && req.is_renew)
                        {
                            res(commissionDataObj);
                            return false;
                        }

                        if (data.user_id == data.freeze_user_id && req.act == 'Freeze Deal') {
                            res(commissionDataObj);
                            return false;
                        }



                        if (data.user_id) {
                            //if (1) {
                            //console.log(list.user_id);
                            commissionDataObj = {};
                            var chk_user_id = data[req.type_user_id];

                            var queryAtc = ' select  * from users where id=? '
                            sequelize.query(queryAtc,
                                    {replacements: [chk_user_id], type: sequelize.QueryTypes.SELECT}
                            ).then(function (userAct) {



                                if (!userAct.length || userAct[0]['active_commission'] != 1) {
                                    if (req.type_user_id != 'stamp_user_id' && chk_user_id) {
                                        res(commissionDataObj);
                                        return false;
                                    }
                                }

                                arrParms = [];
                                if (req.type_user_id == 'stamp_user_id' && !chk_user_id && req.call_type == 'n')
                                {
                                    var query = '';
                                    query += ' SELECT * FROM commissions c left join role_types rt on c.role_type_id=rt.id where c.is_active=1 and rt.role_type_slug=?  '

                                    arrParms.push('stamp_vendor');
                                } else {
                                    var query = '';
                                    query += ' SELECT * FROM users u  '
                                    query += ' left join role_types rt on u.role_type_id=rt.id  '
                                    query += ' left join commissions c on rt.id=c.role_type_id and c.is_active=1 where u.id=? and u.active_commission=1 and c.product_id=? and (c.service_detail_id=? or c.service_detail_id IS NULL)'

                                    arrParms.push(chk_user_id, req.product_id, req.service_detail_id);
                                }


                                //console.log(req.type_user_id);
                                //console.log(chk_user_id);

                                //var query = '';
                                //query += ' SELECT * FROM users u  '
                                //query += ' left join role_types rt on u.role_type_id=rt.id  '
                                //query += ' left join commissions c on rt.id=c.role_type_id and c.is_active=1 where u.id=? and c.product_id=? and (c.service_detail_id=? or c.service_detail_id IS NULL)'
                                sequelize.query(query,
                                        {replacements: arrParms, type: sequelize.QueryTypes.SELECT}
                                ).then(function (user_dataArr) {

                                    //console.log('user_dataArr0-0-0-0-0-0-0-0-');
                                    //console.log(user_dataArr);

                                    var stamp_commission = 0;
                                    var commission_type = 0;
                                    var commission_value = 0;

//                        if (!user_dataArr.length) {
//                            res(commissionDataObj);
//                            return false;
//                        }
                                    data_user = {};
                                    if (user_dataArr.length) {
                                        data_user = user_dataArr[0];
                                    }

                                    var special_bonus_id = '';

                                    if (req.call_type == 'n') {
                                        if (userAct.length) {
                                            special_bonus_id = userAct[0]['special_bonus_id'];//data_user.special_bonus_id;
                                        }
                                    }


                                    if (req.call_type == 'm') {
                                        if (userAct.length) {
                                            special_bonus_id = userAct[0]['special_bonus_id_membership'];// data_user.special_bonus_id_membership;
                                        }
                                    }

                                    //if (data_user.commission_value && data_user.commission_value > 0) {
                                    if (1) {
                                        if (data_user && data_user.commission_value) {
                                            commission_type = data_user.commission_type;
                                            commission_value = data_user.commission_value;

                                            if (data_user.commission_type == 0) {
                                                stamp_commission = parseFloat(data_user.commission_value);
                                            } else {
                                                stamp_commission = (parseFloat(totalAmount) * parseFloat(data_user.commission_value)) / 100

                                            }
                                        }

                                        var bonus_commission = 0;
                                        var bonus_value = 0;
                                        console.log('else2/...........');
                                        console.log(special_bonus_id);
                                        console.log(stamp_commission);
                                        console.log('else2/...........================');
                                        if (1) {

                                            var query = '';
                                            query += ' SELECT * FROM special_bonus where id=? and curdate() between start_date and end_date and is_active=1 '
                                            sequelize.query(query,
                                                    {replacements: [special_bonus_id], type: sequelize.QueryTypes.SELECT}
                                            ).then(function (bonus_data_arr) {

                                                console.log('Lock...........================');
                                                if (!user_dataArr.length && !bonus_data_arr.length) {
                                                    res({});
                                                    return false;
                                                }

                                                console.log('Lock2...........================', req.professionalUserId , chk_user_id);

                                                if (bonus_data_arr.length) {
                                                    bonus_data = bonus_data_arr[0]
                                                    bonus_value = bonus_data.bonus_value;
                                                    if (bonus_data.bonus_value) {
                                                        if (req.professionalUserId == chk_user_id) {
                                                            bonus_commission = (parseFloat(totalAmount) * parseFloat(bonus_data.bonus_value)) / 100
                                                        } else {
                                                            bonus_commission = (parseFloat(stamp_commission) * parseFloat(bonus_data.bonus_value)) / 100
                                                        }
                                                    }
                                                }






//                                    console.log(bonus_data.bonus_value);
                                                console.log(bonus_commission);
                                                console.log('}{}{}{{}{}{{{{}{}{}{}');

                                                var total_commission = bonus_commission + stamp_commission;



                                                penalty_amount = 0;
                                                penalty = 0;
                                                if (req.type_user_id == 'stamp_user_id' && !chk_user_id && req.call_type == 'n')
                                                {
                                                    if (req.app.locals.settingData.stamp_add_penalty && req.app.locals.settingData.stamp_add_penalty > 0) {
                                                        penalty = req.app.locals.settingData.stamp_add_penalty;
                                                        var penalty_amount = (total_commission * parseFloat(penalty)) / 100;
                                                        total_commission = total_commission - penalty_amount;
                                                        commissionDataObj['paid'] = 0;
                                                    }
                                                }


                                                commissionDataObj['penalty'] = penalty_amount;
                                                commissionDataObj['penalty_rate'] = penalty;


                                                var tds_amount = 0;
                                                var tds_rate = 0;
                                                if (req.app.locals.settingData.tds && req.app.locals.settingData.tds > 0) {
                                                    tds_rate = req.app.locals.settingData.tds;
                                                    var tds_amount = (total_commission * parseFloat(tds_rate)) / 100;
                                                }

                                                final = total_commission - tds_amount;




                                                commissionDataObj['commission_amount'] = stamp_commission;
                                                commissionDataObj['commission_type'] = commission_type;
                                                commissionDataObj['commission_value'] = commission_value;


                                                commissionDataObj['bonus_rate'] = bonus_value;
                                                commissionDataObj['bonus_commission_amount'] = bonus_commission;

                                                commissionDataObj['commission_tds'] = tds_amount;
                                                commissionDataObj['commission_tds_rate'] = tds_rate;


                                                commissionDataObj['final_commission'] = final;
                                                commissionDataObj['activity'] = req.act;
                                                commissionDataObj['arbitration_agreements_id'] = req.id;
                                                commissionDataObj['user_id'] = chk_user_id;
                                                commissionDataObj['commission_base_amount'] = req.totalAmount;
                                                //console.log(commissionDataObj)

                                                //commissionDataAll.push(commissionDataObj);
                                                //console.log('commissionDataObj______________----');
                                                //console.log(commissionDataObj);
                                                console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$444');
                                                console.log(commissionDataObj);
                                                console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$444');
                                                res(commissionDataObj);

                                            });
                                        }

                                    }
                                });
                            });
                        }

                    },
                    franchiseCommissionCalcNyayaCard: function (req, res) {


                        if (!req.franchise_id) {
                            res([]);
                            return false;
                        }


                        var query = '';
                        query += ' SELECT fl.user_id f1_id,fl.franchise_level f1_name,fl2.user_id f2_id,fl2.franchise_level f2_name,fl3.user_id f3_id,fl3.franchise_level f3_name,fl4.user_id f4_id,fl4.franchise_level f4_name,fl5.user_id f5_id,fl5.franchise_level f5_name '
                        query += ' FROM franchise_levels fl '
                        query += ' left join franchise_levels fl2 on fl.parent_franchise=fl2.user_id '
                        query += ' left join franchise_levels fl3 on fl2.parent_franchise=fl3.user_id '
                        query += ' left join franchise_levels fl4 on fl3.parent_franchise=fl4.user_id '
                        query += ' left join franchise_levels fl5 on fl4.parent_franchise=fl5.user_id '
                        query += ' where fl.franchise_level="tehsil_level" and fl.user_id=? '
                        sequelize.query(query,
                                {replacements: [req.franchise_id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (frCom) {
                            console.log('_++++++++++++++++++++++++++');
                            console.log(frCom);
                            console.log('_++++++++++++++++++++++++++');
                            frComObj = frCom[0];

                            if (!frCom.length) {
                                res();
                                return false;
                            }

                            req.user_id = frComObj['f1_id']
                            req.level = frComObj['f1_name']
                            arr = [];
                            sequelize.models.CommissionDistribution.calCommission(req, function (data) {
                                if (Object.keys(data).length !== 0) {
                                    arr.push(data);
                                }
                                //arr.push(data);
                                req.user_id = frComObj['f2_id']
                                req.level = frComObj['f2_name']
                                sequelize.models.CommissionDistribution.calCommission(req, function (data2) {
                                    if (Object.keys(data2).length !== 0) {
                                        arr.push(data2);
                                    }
                                    req.user_id = frComObj['f3_id']
                                    req.level = frComObj['f3_name']
                                    sequelize.models.CommissionDistribution.calCommission(req, function (data3) {
                                        if (Object.keys(data3).length !== 0) {
                                            arr.push(data3);
                                        }
                                        req.user_id = frComObj['f4_id']
                                        req.level = frComObj['f4_name']
                                        sequelize.models.CommissionDistribution.calCommission(req, function (data4) {
                                            if (Object.keys(data4).length !== 0) {
                                                arr.push(data4);
                                            }

                                            req.user_id = frComObj['f5_id']
                                            req.level = frComObj['f5_name']
                                            sequelize.models.CommissionDistribution.calCommission(req, function (data5) {
                                                arr.push(data5);
                                                res(arr);
                                            });
                                        });
                                    });
                                });


                            });

                        });


                    },
                    franchiseCommissionCalc: function (req, res) {

                        console.log('PPPPPPPPPPPPPPPPPPPPPPPP----------------------------------' + req.user_id);
                        if (!req.user_id) {
                            res([]);
                            return false;
                        }
                        //req.freeze_user_id
                        //req.level_type = 'Creator';


                        if (req.user_id != req.freeze_user_id && req.freeze_user_id && req.level_type == 'Document Creator') {
                            res([]);
                            return false;
                        }


                        if (req.user_id == req.create_user_id && req.level_type == 'Freeze Deal') {
                            res([]);
                            return false;
                        }


                        console.log('PPPPPPPPPPPPPPPPPPPPPPPP----------------------------------');
                        var query = '';
                        //query += ' SELECT * FROM users where id=? '
                        query += ' SELECT *,uf.franchise_id franchise_id FROM users u join user_franchises uf on u.id=uf.user_id where u.id=? limit 1 '
                        sequelize.query(query,
                                {replacements: [req.user_id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (user_data) {

                            if (!user_data.length) {
                                res([]);
                                return false;
                            }

                            user_dataObj = user_data[0];

                            var query = '';
                            query += ' SELECT fl.user_id f1_id,fl.franchise_level f1_name,fl2.user_id f2_id,fl2.franchise_level f2_name,fl3.user_id f3_id,fl3.franchise_level f3_name,fl4.user_id f4_id,fl4.franchise_level f4_name,fl5.user_id f5_id,fl5.franchise_level f5_name '
                            query += ' FROM franchise_levels fl '
                            query += ' left join franchise_levels fl2 on fl.parent_franchise=fl2.user_id '
                            query += ' left join franchise_levels fl3 on fl2.parent_franchise=fl3.user_id '
                            query += ' left join franchise_levels fl4 on fl3.parent_franchise=fl4.user_id '
                            query += ' left join franchise_levels fl5 on fl4.parent_franchise=fl5.user_id '
                            query += ' where fl.franchise_level="tehsil_level" and fl.user_id=? '
                            sequelize.query(query,
                                    {replacements: [user_dataObj.franchise_id], type: sequelize.QueryTypes.SELECT}
                            ).then(function (frCom) {
                                console.log('_++++++++++++++++++++++++++');
                                console.log(frCom);
                                console.log('_++++++++++++++++++++++++++');
                                frComObj = frCom[0];

                                if (!frCom.length) {
                                    res();
                                    return false;
                                }

                                req.user_id = frComObj['f1_id']
                                req.level = frComObj['f1_name']
                                arr = [];
                                sequelize.models.CommissionDistribution.calCommission(req, function (data) {
                                    if (Object.keys(data).length !== 0) {
                                        arr.push(data);
                                    }
                                    //arr.push(data);
                                    req.user_id = frComObj['f2_id']
                                    req.level = frComObj['f2_name']
                                    sequelize.models.CommissionDistribution.calCommission(req, function (data2) {
                                        if (Object.keys(data2).length !== 0) {
                                            arr.push(data2);
                                        }
                                        req.user_id = frComObj['f3_id']
                                        req.level = frComObj['f3_name']
                                        sequelize.models.CommissionDistribution.calCommission(req, function (data3) {
                                            if (Object.keys(data3).length !== 0) {
                                                arr.push(data3);
                                            }
                                            req.user_id = frComObj['f4_id']
                                            req.level = frComObj['f4_name']
                                            sequelize.models.CommissionDistribution.calCommission(req, function (data4) {
                                                if (Object.keys(data4).length !== 0) {
                                                    arr.push(data4);
                                                }

                                                req.user_id = frComObj['f5_id']
                                                req.level = frComObj['f5_name']
                                                sequelize.models.CommissionDistribution.calCommission(req, function (data5) {
                                                    arr.push(data5);
                                                    res(arr);
                                                });
                                            });
                                        });
                                    });


                                });

                            });
                        });

                    },
                    calCommission: function (req, res) {

                        var bonusCol = 'special_bonus_id';
                        if (req.product_id == 3) {
                            var bonusCol = 'special_bonus_id_membership';
                        } else {
                            var bonusCol = 'special_bonus_id';
                        }

                        commissionDataObj = {}
                        var query = 'SELECT *,(select active_commission from users where id=? limit 1) active_commission,fc.is_active com_act '
                        query += 'FROM franchise_commissions fc left join franchise_commission_levels fl '
                        query += 'on fc.franchise_commission_level_id=fl.id where fl.franchise_slug=? and product_id=? limit 1';
                        //query += 'on fc.franchise_commission_level_id=fl.id where fl.franchise_slug=? and product_id=? and fc.is_active = 1 limit 1';
                        sequelize.query(query,
                                {replacements: [req.user_id, req.level, req.product_id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (comData) {
                            req.comData = comData;


                            if (!comData.length) {
                                res({});
                                return false;
                            }

                            if (comData.length && comData[0].active_commission == 0) {
                                res({});
                                return false;
                            }

                            //consol22e.log('}}}}}}}}}}}}}}}}}}}}}}}');
                            data = {};
                            //console.log(req.comData);
                            if (comData.length && comData[0].com_act == 1) {
                                data = req.comData[0];
                            }

                            var amu = req.totalAmount;

                            var total_commission = 0;
                            var stamp_commission = 0;
                            var commission_type = '';
                            var commission_value = 0;

                            if (comData.length && comData[0].com_act == 1) {
                                if (data.commission_type == 1) {
                                    commission_type = data.commission_type;
                                    commission_value = data.commission_value;
                                    stamp_commission = (parseFloat(amu) * parseFloat(data.commission_value)) / 100
                                } else {
                                    stamp_commission = data.commission_value;
                                    commission_value = data.commission_value;
                                }
                            }

//                    console.log('-------------------------------->');
//                    console.log(amu);
//                    
//                    console.log(stamp_commission);
//                    console.log('-------------------------------->#######################################');
//                    //console.log2(stamp_commission);

                            bonus_commission = 0;
                            var query = '';
                            query += ' SELECT * FROM users u left join special_bonus b on u.' + bonusCol + '=b.id where u.id=? and curdate() between start_date and end_date and b.is_active=1 '
                            sequelize.query(query,
                                    {replacements: [req.user_id], type: sequelize.QueryTypes.SELECT}
                            ).then(function (bonus_data_arr) {

                                bonus_data = bonus_data_arr[0]


                                bonus_value = 0;
                                if (bonus_data_arr.length) {

                                    bonus_value = bonus_data.bonus_value;

                                    console.log('------------------------------------------------------');
                                    console.log(req.level);
                                    console.log(commission_value);
                                    console.log('------------------------------------------------------');

                                    if (req.level && req.level != '') {
//                                        bonus_commission = (parseFloat(amu) * parseFloat(bonus_value)) / 100
                                        bonus_commission = (parseFloat(stamp_commission) * parseFloat(bonus_value)) / 100
                                    } else {
//                                        bonus_commission = (parseFloat(amu) * parseFloat(bonus_value)) / 100
                                        bonus_commission = (parseFloat(stamp_commission) * parseFloat(bonus_value)) / 100
                                    }

                                }

                                console.log('------------------------------------------------------');
                                //console.log(commission_value,'To');
                                console.log(stamp_commission, 'To');
                                console.log(bonus_commission, 'bo');
                                console.log('------------------------------------------------------');



                                if (bonus_data_arr.length && bonus_data.bonus_type == 0) {
                                    var total_commission = stamp_commission - bonus_commission;
                                } else {
                                    var total_commission = bonus_commission + stamp_commission;
                                }


                                console.log('------------------------------------------------------');
                                console.log(total_commission);
                                console.log('------------------------------------------------------');


                                var tds_amount = 0;
                                var tds_rate = 0;
                                if (req.app.locals.settingData.tds && req.app.locals.settingData.tds > 0) {
                                    tds_rate = req.app.locals.settingData.tds;
                                    var tds_amount = (total_commission * parseFloat(tds_rate)) / 100;
                                }

                                final = total_commission - tds_amount;

                                commissionDataObj['commission_amount'] = stamp_commission;
                                commissionDataObj['commission_type'] = commission_type;
                                commissionDataObj['commission_value'] = commission_value;


                                commissionDataObj['bonus_rate'] = bonus_value;
                                commissionDataObj['bonus_commission_amount'] = bonus_commission;

                                commissionDataObj['commission_tds'] = tds_amount;
                                commissionDataObj['commission_tds_rate'] = tds_rate;


                                commissionDataObj['final_commission'] = final;
                                commissionDataObj['activity'] = req.level;
                                commissionDataObj['activity_type'] = req.level_type;
                                commissionDataObj['arbitration_agreements_id'] = req.id;
                                commissionDataObj['user_id'] = req.user_id;
                                commissionDataObj['commission_base_amount'] = req.totalAmount;

                                console.log('ssssssssssssssssssssssssssss');
                                console.log(commissionDataObj)
                                res(commissionDataObj);
                            });
                        });
                    },
                    saveCommissionMembership: function (req, res) {

//                req.id = req.id;
//                req.product_id = 3;
//                req.service_detail_id = '';

                        sequelize.models.CommissionDistribution.commissionCalcMembership(req, function (DataSave) {

                            console.log(DataSave);

                            sequelize.models.CommissionDistribution.destroy({
                                where: {
                                    membership_plan_issue_id: DataSave.total.arbitration_agreements_id
                                }
                            }).then(function () {

                                sequelize.models.CommissionPaid.destroy({
                                    where: {
                                        membership_plan_issue_id: DataSave.total.arbitration_agreements_id
                                    }
                                }).then(function () {


                                    DataSave['total']['membership_plan_issue_id'] = req.id;

                                    delete DataSave.total.arbitration_agreements_id;
                                    sequelize.models.CommissionPaid.create(DataSave.total).then(function (results) {

                                        console.log('{}}}}}}}}}}}}}}}}}}}}}}}}}}}}');
                                        async.each(DataSave.data, function (rows, callback) {
                                            rows.paid_commission_id = results.id;
                                            rows['membership_plan_issue_id'] = req.id;//rows.arbitration_agreements_id;
                                            delete rows.arbitration_agreements_id;
                                            sequelize.models.CommissionDistribution.create(rows).then(function (results2) {

                                            });
                                            callback();
                                        }, function (err) {
                                            console.log(err);
                                        });
                                        res(DataSave);
                                    }).catch(function (err) {
                                        console.log(err);
                                    });



                                });
                            });
                        });

                    },
                    saveCommission: function (req, res) {

//                req.id = 291;
//                req.product_id = 1;
//                req.service_detail_id = 1;

                        sequelize.models.CommissionDistribution.commissionCalc(req, function (DataSave) {

                            console.log('DataSave___________________________>')
                            console.log(DataSave)


                            sequelize.models.CommissionDistribution.destroy({
                                where: {
                                    arbitration_agreements_id: DataSave.total.arbitration_agreements_id
                                }
                            }).then(function () {

                                sequelize.models.CommissionPaid.destroy({
                                    where: {
                                        arbitration_agreements_id: DataSave.total.arbitration_agreements_id
                                    }
                                }).then(function () {




                                    sequelize.models.CommissionPaid.create(DataSave.total).then(function (results) {

                                        var loopCount = 0;
                                        async.each(DataSave.data, function (rows, callback) {
                                            if (typeof rows == 'undefined') {
                                                loopCount++;
                                                if (DataSave.data.length == loopCount) {
                                                    callback();
                                                }
                                                return false;
                                            }
                                            if (Object.keys(rows).length !== 0) {
                                                rows.paid_commission_id = results.id;
                                                sequelize.models.CommissionDistribution.create(rows).then(function (results2) {

                                                    if (DataSave.data.length == loopCount) {
                                                        callback();
                                                    }


                                                });
                                            }
                                            loopCount++;
                                            //callback();
                                        }, function (err) {
                                            console.log(err);
                                            console.log('err$$$$$$$$$$$$$$$');
                                            res(DataSave);
                                        });


                                    }).catch(function (err) {
                                        console.log(err);
                                    });

                                });

                            });




                        });

                    },
                    queryPage: function (req, res) {

//                req.c_query = query + ' ' + where;
//                req.query = query + ' ' + where + limit;
//                req.c_query = query + ' ' + where;

                        req.c_query = ' select count(*) total ' + req.c_query;
                        sequelize.query(req.c_query,
                                {replacements: req.serArr, type: sequelize.QueryTypes.SELECT}
                        ).then(function (count) {
                            console.log(count);
                            if (!count) {
                                res({count: 0, data: {}});
                                return false;
                            }
                            sequelize.query(req.query,
                                    {replacements: req.serArr, type: sequelize.QueryTypes.SELECT}
                            ).then(function (data) {
                                res({count: count[0].total, data: data});
                            });
                        });
                    },
                    franchiseList: function (req, res) {

                        if (!req.params.id) {
                            id = req.user.franchise_id
                        } else {
                            id = req.params.id;
                        }

                        console.log(id);
                        var idArray = [];
                        if (id && id != '') {
                            var idArray = id.split(",");
                        }//idArray=[70,70];
                        var query = '';
                        query += ' SELECT '
                        query += ' fl.user_id f1_id,fl.franchise_level f1_name,fl1_user.first_name f1_user_name,fl1_user.email f1_user_email,fl1_user.mobile f1_user_phone,fl1_user.residence_address f1_user_address, '
                        query += ' fl3.user_id f3_id,fl3.franchise_level f3_name,fl3_user.first_name f3_user_name,fl3_user.email f3_user_email,fl3_user.mobile f3_user_phone,fl3_user.residence_address f3_user_address, '
                        query += ' fl4.user_id f4_id,fl4.franchise_level f4_name,fl4_user.first_name f4_user_name,fl4_user.email f4_user_email,fl4_user.mobile f4_user_phone,fl4_user.residence_address f4_user_address, '
                        query += ' fl5.user_id f5_id,fl5.franchise_level f5_name,fl5_user.first_name f5_user_name,fl5_user.email f5_user_email,fl5_user.mobile f5_user_phone,fl5_user.residence_address f5_user_address, '
                        query += ' fl2.user_id f2_id,fl2.franchise_level f2_name,fl2_user.first_name f2_user_name,fl2_user.email f2_user_email,fl2_user.mobile f2_user_phone,fl2_user.residence_address f2_user_address '

                        //query += ' ,max(uf.total_credit) total_credit,max(uf.available_credit) available_credit '

                        query += ' ,(select total_credit from user_franchises where user_id=' + req.user.id + ' and franchise_id=? limit 1 ) total_credit'
                        query += ' ,(select available_credit from user_franchises where user_id=' + req.user.id + ' and franchise_id=? limit 1 ) available_credit'

                        query += ' FROM franchise_levels fl left join users fl1_user on  fl.user_id=fl1_user.id '
                        query += ' left join franchise_levels fl2 on fl.parent_franchise=fl2.user_id left join users fl2_user on  fl2.user_id=fl2_user.id '
                        query += ' left join franchise_levels fl3 on fl2.parent_franchise=fl3.user_id left join users fl3_user on  fl3.user_id=fl3_user.id '
                        query += ' left join franchise_levels fl4 on fl3.parent_franchise=fl4.user_id left join users fl4_user on  fl4.user_id=fl4_user.id '
                        query += ' left join franchise_levels fl5 on fl4.parent_franchise=fl5.user_id left join users fl5_user on  fl5.user_id=fl5_user.id '

                        query += ' left join user_franchises uf on fl.user_id=uf.franchise_id';

                        query += ' where fl.franchise_level="tehsil_level" and fl.user_id=? limit 1 '

                        var arrAll = [];
                        async.each(idArray, function (ids, callback) {
                            sequelize.query(query,
                                    {replacements: [ids, ids, ids], type: sequelize.QueryTypes.SELECT}
                            ).then(function (frCom) {
                                arrAll.push(frCom[0]);
                                callback();
                            });


                        }, function (err) {

                            res(arrAll);
                        });

                    },
                    franchiseTehsilList: function (req, res) {

                        if (!req.params.id) {
                            id = req.user.franchise_id
                        } else {
                            id = req.params.id;
                        }

                        console.log(id);
                        var idArray = [];
                        if (id && id != '') {
                            var idArray = id.split(",");
                        }//idArray=[70,70];
                        var query = '';
                        query += ' SELECT * '
                        query += ' FROM user_franchises uf  '
                        query += ' LEFT JOIN franchise_levels fl ON uf.franchise_id = fl.user_id '
                        query += ' LEFT JOIN users u ON uf.franchise_id = u.id '
                        query += ' where uf.user_id=?  AND uf.franchise_id = ?'

                        var arrAll = [];
                        async.each(idArray, function (ids, callback) {
                            sequelize.query(query,
                                    {replacements: [req.user.id, ids], type: sequelize.QueryTypes.SELECT}
                            ).then(function (frCom) {
                                arrAll.push(frCom[0]);
                                callback();
                            });


                        }, function (err) {
                            console.log(arrAll);
                            res(arrAll);
                        });

                    },
                    franchiseListAdmin: function (req, res) {

                        var id = req.params.id;
                        var type = req.params.type;

                        if (type == 'country_level') {
                            col_slug = 'fl';
                        }
                        if (type == 'state_level') {
                            col_slug = 'fl2';
                        }
                        if (type == 'division_level') {
                            col_slug = 'fl3';
                        }
                        if (type == 'district_level') {
                            col_slug = 'fl4';
                        }
                        if (type == 'tehsil_level') {
                            col_slug = 'fl5';
                        }


                        var query = '';
                        query += ' SELECT '
                        query += ' fl.user_id f1_id,fl.franchise_level f1_name,fl1_user.first_name f1_user_name,fl1_user.email f1_user_email,fl1_user.mobile f1_user_phone,fl1_user.residence_address f1_user_address, '
                        query += ' fl3.user_id f3_id,fl3.franchise_level f3_name,fl3_user.first_name f3_user_name,fl3_user.email f3_user_email,fl3_user.mobile f3_user_phone,fl3_user.residence_address f3_user_address, '
                        query += ' fl4.user_id f4_id,fl4.franchise_level f4_name,fl4_user.first_name f4_user_name,fl4_user.email f4_user_email,fl4_user.mobile f4_user_phone,fl4_user.residence_address f4_user_address, '
                        query += ' fl5.user_id f5_id,fl5.franchise_level f5_name,fl5_user.first_name f5_user_name,fl5_user.email f5_user_email,fl5_user.mobile f5_user_phone,fl5_user.residence_address f5_user_address, '
                        query += ' fl2.user_id f2_id,fl2.franchise_level f2_name,fl2_user.first_name f2_user_name,fl2_user.email f2_user_email,fl2_user.mobile f2_user_phone,fl2_user.residence_address f2_user_address '
                        query += ' FROM franchise_levels fl left join users fl1_user on  fl.user_id=fl1_user.id '
                        query += ' left join franchise_levels fl2 on fl.user_id=fl2.parent_franchise left join users fl2_user on  fl2.user_id=fl2_user.id '
                        query += ' left join franchise_levels fl3 on fl2.user_id=fl3.parent_franchise left join users fl3_user on  fl3.user_id=fl3_user.id '
                        query += ' left join franchise_levels fl4 on fl3.user_id=fl4.parent_franchise left join users fl4_user on  fl4.user_id=fl4_user.id '
                        query += ' left join franchise_levels fl5 on fl4.user_id=fl5.parent_franchise left join users fl5_user on  fl5.user_id=fl5_user.id '
                        query += ' where ' + col_slug + '.franchise_level=? and ' + col_slug + '.user_id=? limit 1'
                        sequelize.query(query,
                                {replacements: [type, id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (frCom) {



                            var sendObj = [];
                            async.each(frCom, function (rows, callback) {
                                if (type == 'country_level') {
                                    col_slug = 'fl';
                                }
                                if (type == 'state_level') {
                                    col_slug = 'fl2';
                                }
                                if (type == 'division_level') {
                                    col_slug = 'fl3';
                                }
                                if (type == 'district_level') {
                                    col_slug = 'fl4';
                                }
                                if (type == 'tehsil_level') {
                                    col_slug = 'fl5';
                                }
                                sendObj.push(rows);
                                callback();
                            }, function (err) {
                                console.log(err);

                            });

                            res(frCom);
                        });
                    },
                    svCommissionTotal: function (req, res) {

                        var idArr = req.body.ids.split(","); 

                        var query = '';
                        query += ' SELECT sum(cd.final_commission) final_commission '
                        query += ' ,group_concat(cd.final_commission order by cd.user_id) pay,'
                        //query += ' group_concat(cd.user_id order by cd.user_id) user_id '

                        //query += ' ,cd.final_commission pay,'
                        query += ' cd.user_id user_id '

                        query += ' FROM paid_commissions pc left join commission_distributions cd on pc.arbitration_agreements_id=cd.arbitration_agreements_id '
                        query += ' where cd.id IN (?) and cd.paid=? group by cd.user_id '
                        //query += ' where cd.user_id IN (?) and cd.paid=? group by cd.user_id '
                        sequelize.query(query,
                                {replacements: [idArr, 0], type: sequelize.QueryTypes.SELECT}
                        ).then(function (frCom) {
                            res(frCom);
                        });

                    },
                    svCommissionDetails: function (req, res) {

                        var query_top = '';
                        var query_mid = '';
                        var query_end = '';
                        serArr = [];





                        where = '';
                        if (req.query.paid) {
                            where += ' and cd.paid=? '
                            serArr.push(req.query.paid);
                            serArr.push(req.query.paid);
                            serArr.push(req.query.paid);
                            serArr.push(req.query.paid);
                            serArr.push(req.query.paid);
                            serArr.push('stamp_vendor');
                            serArr.push(req.query.paid);
                        } else {
                            serArr.push(0);
                            serArr.push(0);
                            serArr.push(0);
                            serArr.push(0);
                            serArr.push(0);
                            serArr.push('stamp_vendor');
                        }



                        if (req.query.first_name) {
                            where += ' and u.first_name like ? '
                            serArr.push('%' + req.query.first_name + '%');
                        }
                        if (req.query.mobile) {
                            where += ' and u.mobile like ? '
                            serArr.push('%' + req.query.mobile + '%');
                        }

                        if (req.query.stamp_number) {
                            where += ' and ar.stamp_number like ? '
                            serArr.push('%' + req.query.stamp_number + '%');
                        }
                        if (req.query.id) {
                            where += ' and ar.id like ? '
                            serArr.push('%' + req.query.id + '%');
                        }



                        query_top += ' SELECT *   '
                        query_top += ' ,sum(if(cd.paid=?,final_commission,0)) final_commission   '
                        query_top += ' ,sum(if(cd.paid=?,penalty,0)) penalty   '
                        query_top += ' ,sum(if(cd.paid=?,commission_tds,0)) commission_tds   '
                        query_top += ' ,sum(if(cd.paid=?,commission_amount,0)) commission_amount   '
                        query_top += ' ,sum(if(cd.paid=?,penalty_rate,0)) penalty_rate   '
                        query_top += ' ,group_concat(stamp_number) stamp_number   '
                        query_top += ' ,group_concat(cd.arbitration_agreements_id) arbitration_agreements_id,cd.user_id user_id, '
                        query_top += ' group_concat(ar.ar_id) ar_id,group_concat(if(cd.paid=0,cd.id,null)) cd_id '


                        query_mid += ' FROM paid_commissions pc left join commission_distributions cd on pc.arbitration_agreements_id=cd.arbitration_agreements_id '
                        query_mid += ' left join arbitration_agreements ar on ar.id=cd.arbitration_agreements_id left join users u on cd.user_id=u.id left join role_types rt on u.role_type_id=rt.id '

                        query_mid += ' where rt.role_type_slug=? and ar.is_active=1  ' + where;

                        query_end += ' group by u.id order by pc.id desc';

                        req.c_query = query_mid;
                        req.query = query_top + query_mid + query_end;
                        req.serArr = serArr;

                        sequelize.models.CommissionDistribution.queryPage(req, function (data) {
                            res(data);
                        });



                    },
                    myCommission: function (req, res) {

                        serObj = req.query;
                        serArr = [];
                        console.log(req.user);

                        if (req.user && req.user.user_type.role_type_slug != 'super_admin') {
                            serArr.push(req.user.id);
                        }
                        var where = '';

                        where += ' where pc.is_active=1 ';

                        if (req.user && req.user.user_type.role_type_slug != 'super_admin') {
                            where += ' and cd.user_id=? ';
                        }

                        if (serObj.start_date && serObj.end_date) {
                            where += ' and date(pc.added_date) between ? and ? '
                            serArr.push(moment(serObj.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                            serArr.push(moment(serObj.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                        }

                        if (serObj.state_id) {
                            where += ' and (mi.business_state_id=? or ar.stamp_state_id=?) '
                            serArr.push(serObj.state_id, serObj.state_id);
                        }


                        if (serObj.type_no && serObj.id) {

                            if (serObj.type_no == 0) {
                                where += ' and (mi.invoice_no like ? or ar.invoice_no like ?) '
                                serArr.push('%' + serObj.id + '%', '%' + serObj.id + '%');
                            }

                            if (serObj.type_no == 1) {
                                where += ' and (mi.ms_id= ? or ar.ar_id=?) '
                                serArr.push(serObj.id, serObj.id);
                            }
                        }


                        if (serObj.type) {
                            if (serObj.type == 0) {
                                where += ' and pc.membership_plan_issue_id IS Null'

                            } else {
                                where += ' and pc.arbitration_agreements_id IS Null'
                            }
                            //serArr.push(serObj.type);
                        }

                        if (serObj.invoice_no) {
                            where += ' and (mi.invoice_no like ? or ar.invoice_no like ?)';
                            serArr.push('%' + serObj.invoice_no + '%', '%' + serObj.invoice_no + '%');
                        }

                        if (serObj.stamp_no) {
                            where += ' and (ar.stamp_number like ?)';
                            serArr.push('%' + serObj.stamp_no + '%');
                        }

                        var limit = '';
                        if (req.offset != '' && req.limit != '') {
                            limit = ' limit ' + req.offset + ' ' + req.limit;
                        }
                        limit = ' limit ' + req.offset + ',' + req.limit;

                        console.log('where-------------------------------------');
                        console.log(where);
                        console.log(serArr);
                        console.log(limit);

                        var query_top = '';
                        var query_mid = '';
                        var query_end = '';


                        query_top += ' select * from (SELECT pc.id order_id,ifnull(cd.arbitration_agreements_id,cd.membership_plan_issue_id) set_id,if(cd.arbitration_agreements_id IS NULL,concat("m_",cd.membership_plan_issue_id),concat("nc_",cd.arbitration_agreements_id)) set_id_group,pc.arbitration_agreements_id,pc.membership_plan_issue_id,pc.pay,cd.final_commission,cd.commission_tds,cd.bonus_commission_amount,cd.commission_tds_rate   '
                        query_top += ' ,pc.added_date,ar.stamp_number '
                        query_top += ' ,pc.tax tax,pc.commission_base_amount commission_base_amount,cd.commission_amount commission_amount,u.pan_no,ifnull(arf.arbitration_agreement_total_fees,mi.selected_plan_total_payable_amount) total_fees,ar.is_active ar_status,cd.penalty penalty '

                        //query_top += ' ,if(mi.invoice_no,mi.invoice_no,ar.invoice_no) invoice_no '
                        query_top += ' ,ifnull(mi.invoice_no,ar.invoice_no) invoice_no,ar_id,ms_id '
                        //query_top += ' ,if(mi.business_state_id,mi.business_state_id,ar.stamp_state_id) invoice_state '
                        query_top += ' ,ifnull(mi.business_state_id,ar.stamp_state_id) invoice_state '

                        query_top += ' ,pc.commission total_commission,pc.bonus total_bonus ';
                        query_top += ' ,pc.tax total_tax,pc.tds total_tds ';
                        query_top += ' ,pc.total total_total,cd.paid cd_paid ';


                        query_top += ' ,sum(if(cd.paid=1,cd.commission_amount,0)) cd_commission_amount ';
                        query_top += ' ,sum(if(cd.paid=1,cd.bonus_commission_amount,0)) cd_bonus_commission_amount ';
                        query_top += ' ,sum(if(cd.paid=1,cd.commission_tds,0)) cd_commission_tds ';
                        query_top += ' ,sum(if(cd.paid=1,cd.final_commission,0)) cd_final_commission ';


                        query_mid += ' FROM paid_commissions pc  '
                        query_mid += ' left join commission_distributions cd on pc.id=cd.paid_commission_id  '
                        query_mid += ' left join arbitration_agreements ar on pc.arbitration_agreements_id=ar.id  '
                        query_mid += ' left join arbitration_agreement_fees arf on pc.arbitration_agreements_id=arf.arbitration_agreements_id  '
                        query_mid += ' left join membership_plan_issues mi on pc.membership_plan_issue_id=mi.id  '
                        query_mid += ' left join user_bank_details u on cd.user_id=u.user_id  '
                        query_mid += where;

                        query_end += ' group by ifnull(mi.invoice_no,ar.invoice_no) order by pc.id desc ';

                        query_end += ' ) tab  group by set_id_group order by order_id desc ';

                        req.c_query = query_mid;
                        req.query = query_top + query_mid + query_end;
                        req.serArr = serArr;

                        sequelize.models.CommissionDistribution.queryPage(req, function (data) {
                            res(data);
                        });

//                sequelize.query(query,
//                        {replacements: serArr, type: sequelize.QueryTypes.SELECT}
//                ).then(function (data) {
//                    res(data);
//                });
                    },
                    myCommissionFor_Pdf: function (req, res) {

                        serObj = req.query;
                        serArr = [];
//                console.log(req.user);

                        var where = '';

                        where += ' where pc.is_active=1 ';

                        if (serObj.user_id != '') {
                            where += ' and cd.user_id=? ';
                            serArr.push(serObj.user_id);
                        }

                        if (serObj.start_date && serObj.end_date) {
                            where += ' and date(pc.added_date) between ? and ? '
                            serArr.push(moment(serObj.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                            serArr.push(moment(serObj.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                        }

                        if (serObj.state_id) {
                            where += ' and (mi.business_state_id=? or ar.stamp_state_id=?) '
                            serArr.push(serObj.state_id, serObj.state_id);
                        }


                        if (serObj.type_no && serObj.id) {

                            if (serObj.type_no == 0) {
                                where += ' and (mi.invoice_no like ? or ar.invoice_no like ?) '
                                serArr.push('%' + serObj.id + '%', '%' + serObj.id + '%');
                            }

                            if (serObj.type_no == 1) {
                                where += ' and (mi.id like ? or ar.id like ?) '
                                serArr.push('%' + serObj.id + '%', '%' + serObj.id + '%');
                            }
                        }


                        if (serObj.type) {
                            if (serObj.type == 0) {
                                where += ' and pc.membership_plan_issue_id IS Null'

                            } else {
                                where += ' and pc.arbitration_agreements_id IS Null'
                            }
                            //serArr.push(serObj.type);
                        }

                        var limit = '';
                        if (req.offset != '' && req.limit != '') {
                            limit = ' limit ' + req.offset + ' ' + req.limit;
                        }
                        limit = ' limit ' + req.offset + ',' + req.limit;

                        console.log('where-------------------------------------');
                        console.log(where);
                        console.log(serArr);
                        console.log(limit);

                        var query_top = '';
                        var query_mid = '';
                        var query_end = '';


                        query_top += ' select * from (SELECT pc.id order_id,ifnull(cd.arbitration_agreements_id,cd.membership_plan_issue_id) set_id,if(cd.arbitration_agreements_id IS NULL,concat("m_",cd.membership_plan_issue_id),concat("nc_",cd.arbitration_agreements_id)) set_id_group,pc.arbitration_agreements_id,pc.membership_plan_issue_id,pc.pay,cd.final_commission,cd.commission_tds,cd.bonus_commission_amount,cd.commission_tds_rate   '
                        query_top += ' ,pc.added_date,ar.stamp_number '
                        query_top += ' ,pc.tax tax,pc.commission_base_amount commission_base_amount,cd.commission_amount commission_amount,u.pan_no,ifnull(arf.arbitration_agreement_total_fees,mi.selected_plan_total_payable_amount) total_fees,ar.is_active ar_status,cd.penalty penalty '

                        //query_top += ' ,if(mi.invoice_no,mi.invoice_no,ar.invoice_no) invoice_no '
                        query_top += ' ,ifnull(mi.invoice_no,ar.invoice_no) invoice_no, ar_id,ms_id '
                        //query_top += ' ,if(mi.business_state_id,mi.business_state_id,ar.stamp_state_id) invoice_state '
                        query_top += ' ,ifnull(mi.business_state_id,ar.stamp_state_id) invoice_state '

                        query_top += ' ,pc.commission total_commission,pc.bonus total_bonus ';
                        query_top += ' ,pc.tax total_tax,pc.tds total_tds ';
                        query_top += ' ,pc.total total_total,cd.paid cd_paid ';
//                query_top += ' ,pc.total total_total, d.district_name';

                        query_mid += ' FROM paid_commissions pc  '
                        query_mid += ' left join commission_distributions cd on pc.id=cd.paid_commission_id  '
                        query_mid += ' left join arbitration_agreements ar on pc.arbitration_agreements_id=ar.id  '
                        query_mid += ' left join arbitration_agreement_fees arf on pc.arbitration_agreements_id=arf.arbitration_agreements_id  '
                        query_mid += ' left join membership_plan_issues mi on pc.membership_plan_issue_id=mi.id  '
                        query_mid += ' left join user_bank_details u on cd.user_id=u.user_id  '
                        query_mid += ' left join users u1 on cd.user_id=u1.id  '
                        query_mid += ' left join districts d on u1.district_id=d.id  '
                        query_mid += where;

                        query_end += ' order by pc.id desc' + limit;

                        query_end += ' ) tab  group by set_id_group order by order_id desc ';

                        req.c_query = query_mid;
                        req.query = query_top + query_mid + query_end;
                        req.serArr = serArr;

                        sequelize.query(req.query,
                                {replacements: serArr, type: sequelize.QueryTypes.SELECT}
                        ).then(function (query_data) {
                            console.log('query_data&&&&&&&&&&&&&&&&&&&&&&&&&&&77');
                            console.log(query_data);
                            res(query_data)
                        })
                    },
                    commisionDistributionMail: function (values, res) {
                        console.log("------------------------------------ Welcome to commision distribution email ----------------------------------->>>>>")

                        var query_condition;
                        if (values.type == "nc") {
                            query_condition = " where ar.id = ? ";
                        }
                        if (values.type == "mp") {
                            query_condition = " where mp.id = ? ";
                        }

                        var query = "";

                        query += ' SELECT u.id,u.email,u.first_name,rt.role_type_slug,cd.final_commission '
                        query += ' ,ar.user_id ar_user_id,ar.stamp_number stamp_number '
                        query += ' ,if(cd.arbitration_agreements_id is null,mp.add_date,ar.added_date) product_creation_date '
                        query += ' ,if(cd.arbitration_agreements_id is null,mp.selected_plan_total_payable_amount,arf.arbitration_agreement_total_fees) amount '
                        query += ' ,right(ub.account_no,4) last_4_digits_of_account_number '
                        query += ' ,mb.parties_name,mb.parties_email '
                        query += ' FROM commission_distributions cd '
                        query += ' left join users u on cd.user_id=u.id '
                        query += ' left join role_types rt on u.role_type_id=rt.id '
                        query += ' left join arbitration_agreements ar on cd.arbitration_agreements_id=ar.id '
                        query += ' left join membership_plan_issues mp on cd.membership_plan_issue_id=mp.id '
                        query += ' left join arbitration_agreement_fees arf on ar.id=arf.arbitration_agreements_id '
                        query += ' left join user_bank_details ub on u.id=ub.user_id '
                        query += ' left join ( '
                        query += ' SELECT group_concat(concat("Party ",arbitration_agreement_party_number," ",member_name)) parties_name,  group_concat(member_email) parties_email'
                        query += ' ,arbitration_agreements_id '
                        query += ' FROM arbitration_agreement_party_members group by arbitration_agreements_id '
                        query += ' ) mb on ar.id=mb.arbitration_agreements_id '
                        query += query_condition;

                        sequelize.query(query,
                                {replacements: [values.id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (query_data) {
                            res(query_data)
                        })


                    }

                }}
    );
    return myModel;
};
//module.exports.login = function (sequelize, DataTypes) {
//    console.log('module.exports.login');
//};
