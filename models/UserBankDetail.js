//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("UserBankDetail",
            {
                account_holder_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                account_no: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                bank_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                bank_branch: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                ifsc_code: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                pan_no: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isPanCardValid: function (val) {
                            if ((val.length != 10) || !isNaN(val.substring(0, 5)) || isNaN(val.substring(5, 9)) || !isNaN(val.substring(9, 10))) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'valid PAN number'))
                            }
                        }
                    }
                },
                account_type: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                }
            },
    {
        tableName: 'user_bank_details',
        classMethods: {
            associate: function (models) {
                //var mymodelBussinessHasOne = myModel.hasOne(models.BussinessDetail, {foreignKey: 'user_id', as: 'bussiness_detail'})
            },
            method1: function (req, res) {
                myModel.findAll().then(function (users) {
                    res(users);
                });
            },
            getAllValues: function (where, res) {
                myModel.findAll({where: where}).then(function (results) {
                    res(results);
                });
            },
            getAllValuesPaging: function (where, res) {
                myModel.findAndCountAll({
                    where: where,
                    offset: 3,
                    limit: 3,
                }).then(function (results) {
                    console.log(results);
                    res(results);
                });
            },
            getUserByEmail: function (email, res) {
                myModel.findOne({where: {email: email}}).then(function (users) {
                    res(users);
                });
            },
            getUserById: function (id, res) {
                myModel.findOne({where: {id: id}}).then(function (users) {
                    res(users);
                });
            },
            saveAllValues: function (values, res) {
                console.log('----------------0000000000');
                console.log(values.body);
                console.log('----------------0000000000');

                var mymodelBussinessHasOne = myModel.hasOne(myModel.BussinessDetail, {foreignKey: 'user_id', as: 'bussiness_detail'})
                myModel.create(values, {include: [mymodelBussinessHasOne]}).then(function (results) {
                    results.status = 1;
                    res(results);
                }).catch(function (err) {

                    var errors = err;
                    errors.status = false;
                    res(errors);
                });

            }
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
