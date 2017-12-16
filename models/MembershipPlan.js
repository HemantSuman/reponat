//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("MembershipPlan",
            {
                plan_title: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                min_amount: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isLongEnough: function (val) {
                            if (val <= 0) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Positive value'))
                            }
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
                max_amount: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isLongEnough: function (val) {
                            console.log(val, this.min_amount)
                            console.log(typeof val, typeof this.min_amount)
                            if (parseFloat(this.min_amount) >= parseFloat(val)) {
                                throw new Error(i18n_Validation.__('greater-than', 'Minimum Amount'))
                            }
                        },
                        isPositive: function (val) {
                            if (val <= 0) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Positive value'))
                            }
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
                registration_fee: {
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
                // duration: {
                //     type: DataTypes.INTEGER,
                //     // validate: {
                //     //     notEmpty: {
                //     //         msg: i18n_Validation.__('required')
                //     //     },
                //     // }
                // },
                is_active: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
            },
            {
                tableName: 'membership_plans',
                classMethods: {
                    associate: function (models) {
                        //var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
                    },
                    getAllValues: function (req, res) {
                        var mymodelMembershipPlanFeeHasMany = myModel.hasMany(sequelize.models.MembershipPlanFee, {foreignKey: 'membership_plan_id', as: 'membership_plan_fees'});
                        myModel.findAll({where: req.where,include:mymodelMembershipPlanFeeHasMany}).then(function (results) {
                            res(results);
                        });

                        // myModel.findAll({where: req.where,
                        //     include: [{association: mymodelMembershipPlanFeeHasMany, where: req.where}]
                        // }).then(function (results) {
                        //     res(results);
                        // });
                    },
                    getFirstValues: function (req, res) {
                        var mymodelMembershipPlanFeeHasMany = myModel.hasMany(sequelize.models.MembershipPlanFee, {foreignKey: 'membership_plan_id', as: 'membership_plan_fees'});
                        myModel.findOne({where: req.where,
                            include: [
                                mymodelMembershipPlanFeeHasMany
                            ]}).then(function (results) {
                            res(results);
                        });
                    },
                    getAllValuesPaging: function (req, res) {
                        var mymodelMembershipPlanFeeHasMany = myModel.hasMany(sequelize.models.MembershipPlanFee, {foreignKey: 'membership_plan_id', as: 'membership_plan_fees'});


                        myModel.findAndCountAll({
                            where: req.where,
                            offset: req.offset,
                            limit: req.limit,
                            //order: 'id DESC',
                            order: [['max_amount', 'ASC'], 'number_of_years'],
                            include: [{association: mymodelMembershipPlanFeeHasMany, where: {}, required: false}]
                            //include: [{association: mymodelMembershipPlanFeeHasMany, where: {is_active: 1}, required: false}]
                            // include: [{
                            //         association: mymodelMembershipPlanFeeHasMany
                            //     }]
                        }).then(function (results) {
                            console.log(results);
                            res(results);
                        });
                    },
                    getByEmail: function (email, res) {
                        myModel.findOne({where: {email: email}}).then(function (users) {
                            res(users);
                        });
                    },
                    getById: function (id, res) {
                        myModel.findOne({where: {id: id}}).then(function (result) {
                            res(result);
                        });
                    },
                    getBy: function (req, res) {
                        myModel.findAll({where: req.where}).then(function (data) {
                            res(data);
                        });
                    },
                    changeStatus: function (values, res) {
                        myModel.update(values.body, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                    saveAllValues: function (values, res) {
                        if (values.body.is_active === 'on') {
                            values.body.is_active = 1;
                        } else {
                            values.body.is_active = 0;
                        }
                        var mymodelMembershipPlanFeeHasMany = myModel.hasMany(sequelize.models.MembershipPlanFee, {foreignKey: 'membership_plan_id', as: 'membership_plan_fees'});
                        myModel.create(values.body, {include: [
                                mymodelMembershipPlanFeeHasMany
                            ]}).then(function (results) {
                            results.status = 1;
                            res(results);
                        }).catch(function (err) {
                            var errors = err;
                            errors.status = false;
                            res(errors);
                        });
                    },
                    updateAllValues: function (values, res) {
                        console.log(values.body.membership_plan_fees)
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
                    checkAlreadyExist: function (values, res) {
                        var inp_min_amount = values.body.min_amount;
                        var inp_max_amount = values.body.max_amount;

                        var qryToCheckAlreadyExist = "select * from membership_plans "
                        qryToCheckAlreadyExist += "where "
                        qryToCheckAlreadyExist += "( "

                        qryToCheckAlreadyExist += "( "

                        //check the turnover range already exist
                        qryToCheckAlreadyExist += "(min_amount between ? and ?) OR (max_amount between ? and ?) "
                        qryToCheckAlreadyExist += "OR "
                        qryToCheckAlreadyExist += "(? between min_amount and max_amount) OR (? between min_amount and max_amount) "

                        qryToCheckAlreadyExist += ") "

                        if (typeof values.body.id !== 'undefined' && values.body.id != '') {
                            qryToCheckAlreadyExist += "and id != ? ";
                        }
                        qryToCheckAlreadyExist += ")";

                        sequelize.query(qryToCheckAlreadyExist,
                                {replacements: [
                                        inp_min_amount,
                                        inp_max_amount,
                                        inp_min_amount,
                                        inp_max_amount,
                                        inp_min_amount,
                                        inp_max_amount,
                                        values.body.id
                                    ], type: sequelize.QueryTypes.SELECT}
                        ).then(function (resultData) {
                            var results = {}
                            if (resultData.length > 0) {
                                results.status = false;
                            } else {
                                results.status = true;
                            }
                            res(results);
                        })
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
