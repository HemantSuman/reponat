//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("FranchiseCommissionLevel",
            {
                franchise_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                franchise_slug: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                is_active: {
                    type: DataTypes.INTEGER
                }
            },
    {
        tableName: 'franchise_commission_levels',
        classMethods: {
            associate: function (models) {
                var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
            },
            method1: function (req, res) {
                myModel.findAll().then(function (users) {
                    res(users);
                });
            },
            getAllValues: function (req, res) {
                myModel.findAndCountAll({where: req.where, offset: req.offset, limit: req.limit}).then(function (results) {
                    res(results);
                });
            }
            ,
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
            getBy: function (req, res) {
                myModel.findAll({where: req.where}).then(function (data) {
                    res(data);
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
            getByType: function (req, res) {
                myModel.findAll({where: req.where}).then(function (users) {
                    res(users);
                });
            },
            saveAllValues: function (values, res) {

                var id = values.body.id;

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
                    if (typeof id !== 'undefined' && id != '') {
                        saveArrIncAdd['slab_heads_id'] = id;
                    }
                    saveArrIncAdd['heads_id'] = rowsDate;
                    saveArrIncAdd['fee_type'] = feeType[count];
                    saveArrIncAdd['amount'] = values.body.amount[count];
                    saveArrInc.push(saveArrIncAdd);
                    count++;
                    callback();

                }, function (err) {
                    console.log('iterating done');
                });


                var saveData = values.body;
                service_details_id_arr = saveData['service_details_id'];
                delete saveData['service_details_id'];
                delete saveData['feeType'];
                delete saveData['heads_id'];
                delete saveData['amount'];
                delete saveData['id'];
                saveData['service_details_id'] = 1;
                saveData['slab_head_fees'] = saveArrInc;


                if (typeof id !== 'undefined' && id != '') {
                    delete values.body.id;
                    myModel.update(saveData, {where: {id: id}}).then(function (results) {

                        sequelize.models.SlabHeadFees.destroy({where: {slab_heads_id: id}});
                        console.log(saveArrInc);
                        sequelize.models.SlabHeadFees.bulkCreate(saveArrInc);

                        results.status = 1;
                        res(results);
                    }).catch(function (err) {
                        console.log(err);
                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });

                } else {


                    var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'slab_head_fees'});

                    var id = values.body.id;
                    if (typeof values.body.id !== 'undefined' && values.body.id != '') {

                        myModel.update(saveData, {where: {id: id}}).then(function (results) {
                            results.status = 1;
                            res(results);
                        }).catch(function (err) {
                            console.log(err);
                            var errors = err;
                            errors.status = false;
                            res(errors);
                        });

                    } else {
                        delete values.body.id;

                        async.each(service_details_id_arr, function (ids, callback) {
                            saveData['service_details_id'] = ids;
                            myModel.create(saveData, {include: [relationSave]}).then(function (results) {

                            }).catch(function (err) {
//                                console.log(err);
//                                var errors = err;
//                                errors.status = false;
//                                res(errors);
                            });
                        }, function (err) {
                            console.log('iterating done');
                        });
                        var results = {};
                        results.status = 1;
                        res(results);

                    }

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
