//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("Slab",
            {
                category_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
//                        isUnique: function (value, next) {
//                            var self = this;
//                            myModel.find({
//                                where: {email: value},
//                                attributes: ['id']
//                            })
//                                    .then(function (data) {
//                                        // reject if a different user wants to use the same email
//                                        if (data && Number(self.id) !== data.id) {
//                                            return next(i18n_Validation.__('AlreadyExist', i18n_Validation.__('email')));
//                                        }
//                                        return next();
//                                    })
//                                    .catch(function (err) {
//                                        return next(err);
//                                    });
//
//                        },
                    }
                },
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {name: value},
                                attributes: ['id']
                            })
                                    .then(function (data) {
                                        // reject if a different user wants to use the same email
                                        //if (data && Number(self.id) !== data.id) {
                                       
                                        //if (data && self.id != data.id) {
                                        if (data && self.id=='') {
                                            return next(i18n_Validation.__('AlreadyExist', 'Name'));
                                        }
                                        return next();
                                    })
                                    .catch(function (err) {
                                        return next(err);
                                    });

                        },
                    }
                },
                min_value: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                max_value: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                registration_fee: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                arbitration_fee: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                above_amount: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                percentage_value: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                aceiling_amount: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                default_percentage_value: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isLongEnough: function (val) {
                            if (val <= 0) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Positive value'))
                            }
                        },
                        isNumeric: {
//                            args: ["[a-z]", 'i'],
                            msg: i18n_Validation.__('Please_Enter', 'Numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                is_active: {
                    type: DataTypes.INTEGER
                }
            },
    {
        tableName: 'slab',
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
            getAllValuesPaging: function (req, res) {
                myModel.findAndCountAll({
                    where: req.where,
                    offset: req.offset,
                    limit: req.limit,
                    order: 'id DESC'
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
                myModel.findOne({where: {id: id}}).then(function (users) {
                    res(users);
                });
            },
            changeStatus: function (values, res) {
                myModel.update(values.body, {where: values.where}).then(function (results) {
                    res(results);
                });
            },
            saveAllValues: function (values, res) {
                var id = values.body.id;
                if (typeof values.body.id !== 'undefined' && values.body.id != '') {
                    delete values.body.id;
                    myModel.update(values.body, {where: {id: id}}).then(function (results) {
                        results.status = 1;
                        res(results);
                    }).catch(function (err) {
                        console.log(err);
                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });

                } else {
                    myModel.create(values.body).then(function (results) {
                        results.status = 1;
                        res(results);
                    }).catch(function (err) {
                        console.log(err);
                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });
                }

            },
            checkAlreadyExist: function (values, res) {
                var inp_min_amount = values.body.min_value;
                var inp_max_amount = values.body.max_value;

                var qryToCheckAlreadyExist = "select * from slab "
                qryToCheckAlreadyExist += "where "
                qryToCheckAlreadyExist += "( "

                qryToCheckAlreadyExist += "( "

                //check the turnover range already exist
                qryToCheckAlreadyExist += "(min_value between ? and ?) OR (max_value between ? and ?) "
                qryToCheckAlreadyExist += "OR "
                qryToCheckAlreadyExist += "(? between min_value and max_value) OR (? between min_value and max_value) "

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
                if (typeof values.is_active === 'undefined') {
                    values.is_active = 0;
                }

                values.password = bcrypt.hashSync(values.password, null, null);
            }
        }
    }
    );

    return myModel;
};


//module.exports.login = function (sequelize, DataTypes) {
//    console.log('module.exports.login');
//};
