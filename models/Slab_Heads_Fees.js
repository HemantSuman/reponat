//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("SlabHeadFees",
            {
                slab_heads_id: {
                    type: DataTypes.STRING,
                },
                heads_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                fee_type: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                amount: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isLongEnough: function (val) {
                            if (val < 0) {
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
                }
            },
    {
        tableName: 'slab_head_fees',
        classMethods: {
            associate: function (models) {
                //var mymodelBussinessHasOne = myModel.hasOne(models.BussinessDetail, {foreignKey: 'user_id', as: 'bussiness_detail'})
            },
            method1: function (req, res) {
                myModel.findAll().then(function (users) {
                    res(users);
                });
            },
            getByHeads: function (req, res) {
                myModel.findAll({where: {slab_heads_id: req.params.id}}).then(function (results) {
                    res(results);
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
                    console.log('-=========================');
                    console.log(values.body);
                    console.log('-=========================');

                    var heads_id = [];
                    var fee_type = [];
                    var amount = [];
                    var saveArrInc = [];
                    var saveArrIncAdd = {};
                    var count = 0;
                    feeType = values.body.feeType.filter(function (n) {
                        return n != undefined
                    });
                    async.each(values.body.heads_id, function (rowsDate, callback) {
                        console.log(feeType); // print the key
                        saveArrIncAdd = {};
//                        heads_id.push(rowsDate);
//                        fee_type.push(rowsDate);
//                        amount.push(values.body.amount[count]);

                        saveArrIncAdd['heads_id'] = rowsDate;
                        saveArrIncAdd['fee_type'] = feeType[count];
                        saveArrIncAdd['amount'] = values.body.amount[count];
                        saveArrInc.push(saveArrIncAdd);
                        count++;
                        callback();

                    }, function (err) {
                        console.log('iterating done');
                    });
                    //saveArrInc['heads_id'] = heads_id;
                    //saveArrInc['amount'] = amount;

                    console.log('-=========================');
                    console.log(saveArrInc);
                    console.log('-=========================');


                    myModel.create(req.body, {include: [relationSave]}).then(function (results) {
                        results.status = 1;
                        res(results);
                    }).catch(function (err) {
                        console.log(err);
                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });


                }

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
