//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");
var moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("TurnOverBasedDeal",
            {
                product_id: {
                    type: DataTypes.INTEGER,
                },
                start_date: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                end_date: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isLongEnough: function (val) {
                            var start_date1 = new Date(moment(this.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD')).getTime();
                            var end_date1 = new Date(moment(val, 'DD-MM-YYYY').format('YYYY-MM-DD')).getTime();

                            if (start_date1 > end_date1) {
                                throw new Error(i18n_Validation.__('greater-than', 'start date'))
                            } else {
                                console.log(this.start_date)
                            }
                        }
                    }
                },
                min_amount: {
                    type: DataTypes.DOUBLE,
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
                    type: DataTypes.DOUBLE,
                    validate: {
                        isLongEnough1: function (val) {
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
                        isLongEnough: function (val) {
                            console.log(val, this.min_amount)
                            console.log(typeof val, typeof this.min_amount)
                            if (parseFloat(this.min_amount) >= parseFloat(val)) {
                                throw new Error(i18n_Validation.__('greater-than', 'Minimum Amount'))
                            }
                        }
                    }
                },
                turn_over_discount: {
                    type: DataTypes.DOUBLE,
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
                is_active: {
                    type: DataTypes.INTEGER,
                },
                created: {
                    type: DataTypes.DATE,
                },
                updated: {
                    type: DataTypes.DATE,
                }
            },
    {
        tableName: 'turn_over_based_deals',
        classMethods: {
            associate: function (models) {

                //var mymodelBussinessHasOne = myModel.hasOne(models.BussinessDetail, {foreignKey: 'user_id', as: 'bussiness_detail'})
            },
            method1: function (req, res) {
                myModel.findAll().then(function (users) {
                    res(users);
                });
            },
            getAllValues: function (req, res) {
                myModel.findAll({where: req.where}).then(function (results) {
                    res(results);
                });
            },
            getFirstValues: function (req, res) {
                myModel.findOne({where: req.where}).then(function (results) {
                    res(results);
                });
            },
            getAllValuesPaging: function (req, res) {

                if (req.query.start_date && req.query.end_date) {
                    var start_date = req.app.locals.site.momentObj(req.query.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    var end_date = req.app.locals.site.momentObj(req.query.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD');

                    req.where.start_date = {
                        //$lte: end_date,
                        $gte: start_date
                    }

                    req.where.end_date = {
                        $lte: end_date,
                        //$gte: start_date
                    }

                    //req.where = {$or:{start_date: {$between: [start_date, end_date]}, end_date: {$between: [start_date, end_date]}}};

//                    req.where = {$or: [
//                            {
//                                end_date: {
//                                    $lte: start_date,
//                                    $gte: start_date
//                                }
//                            },
//                            {
//                                start_date: {
//                                    $lte: end_date,
//                                    $gte: end_date
//                                }
//                            }
//                        ]
//                    }
                }

                console.log(req.where);


                myModel.findAndCountAll({
                    where: req.where,
                    offset: req.offset,
                    limit: req.limit,
                    order: 'id DESC'
                }).then(function (results) {
                    res(results);
                });
            },
            getById: function (id, res) {
                myModel.findOne({where: {id: id}}).then(function (data) {
                    res(data);
                });
            },
            saveAllValues: function (values, res) {

                if (values.body.is_active === 'on') {
                    values.body.is_active = 1;
                } else {
                    values.body.is_active = 0;
                }

                myModel.create(values.body).then(function (results) {
                    results.status = 1;
                    res(results);
                }).catch(function (err) {
                    console.log(err);
                    var errors = err;
                    errors.status = false;
                    res(errors);
                });
            },
            updateAllValues: function (values, res) {
                if (values.body.is_active === 'on') {
                    values.body.is_active = 1;
                } else {
                    values.body.is_active = 0;
                }

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
            },
            changeStatus: function (values, res) {
                myModel.update(values.body, {where: values.where}).then(function (results) {
                    res(results);
                });
            },
            checkAlreadyExist: function (values, res) {
                var inp_start_date = values.body.start_date;
                var inp_end_date = values.body.end_date;
                var inp_min_amount = values.body.min_amount;
                var inp_max_amount = values.body.max_amount;

                var qryToCheckAlreadyExist = "select * from turn_over_based_deals "
                qryToCheckAlreadyExist += "where "
                qryToCheckAlreadyExist += "( "

                qryToCheckAlreadyExist += "( "
                //check the date range already exist
                qryToCheckAlreadyExist += "(start_date between ? and ?) OR (end_date between ? and ?) "
                qryToCheckAlreadyExist += "OR "
                qryToCheckAlreadyExist += "(? between start_date and end_date) OR (? between start_date and end_date) "

                qryToCheckAlreadyExist += "OR "
                //check the turnover range already exist
                qryToCheckAlreadyExist += "(min_amount between ? and ?) OR (max_amount between ? and ?) "
                qryToCheckAlreadyExist += "OR "
                qryToCheckAlreadyExist += "(? between min_amount and max_amount) OR (? between min_amount and max_amount) "

                qryToCheckAlreadyExist += ") "

                qryToCheckAlreadyExist += "and product_id = ? "
                if (typeof values.body.id !== 'undefined' && values.body.id != '') {
                    qryToCheckAlreadyExist += "and id != ? ";
                }
                qryToCheckAlreadyExist += ")";

                sequelize.query(qryToCheckAlreadyExist,
                        {replacements: [
                                inp_start_date,
                                inp_end_date,
                                inp_start_date,
                                inp_end_date,
                                inp_start_date,
                                inp_end_date,
                                inp_min_amount,
                                inp_max_amount,
                                inp_min_amount,
                                inp_max_amount,
                                inp_min_amount,
                                inp_max_amount,
                                values.body.product_id,
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
//            beforeCreate: function (values, options) {
//                if (typeof values.is_active === 'undefined') {
//                    values.is_active = 0;
//                }
//            }

        }

    }

    );

    return myModel;
};


//module.exports.login = function (sequelize, DataTypes) {
//    console.log('module.exports.login');
//};
