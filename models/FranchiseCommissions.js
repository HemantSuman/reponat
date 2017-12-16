//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("FranchiseCommissions",
            {
                franchise_commission_level_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                commission_type: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                commission_value: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        not: {
                            args : ["[a-z]",'i'],
                            msg: i18n_Validation.__('Please_Enter', 'Numeric value')
                        },
                        isGreaterThanZero: function(value) {
                            if(value <= 0) {
                                throw new Error("Please enter a valid amount.");
                            }
                        }
                    }
                },
                is_active: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                product_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                }
            },
    {
        tableName: 'franchise_commissions',
        classMethods: {
            associate: function (models) {
                var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
            },
            method1: function (req, res) {
                myModel.findAll().then(function (users) {
                    res(users);
                });
            },
//            getAllValues: function (req, res) {
//
//                var join = myModel.belongsTo(sequelize.models.FranchiseCommissionLevel, {foreignKey: 'franchise_commission_level_id', as: 'level'});
//
//                //var join = myModel.belongsTo(sequelize.models.FranchiseCommissionLevel, {foreignKey: 'franchise_commission_level_id', as: 'level'});
//
//
//                myModel.findAndCountAll({where: req.where, include: [modeljoin], offset: req.offset, limit: req.limit}).then(function (results) {
//                    //console.log(results.rows.master);
//                    res(results);
//                });
//            },
            getAllValues: function (req, res) {
                var join = myModel.belongsTo(sequelize.models.FranchiseCommissionLevel, {foreignKey: 'franchise_commission_level_id', as: 'level'});
                myModel.findAll({where: req.where, include: [join]}).then(function (results) {
                    res(results);
                });
            }
            ,
            getAllFeesValues: function (req, res) {

                var relationGet = sequelize.models.SlabHeadFees.belongsTo(myModel, {foreignKey: 'slab_heads_id', as: 'slab_head'});
                var servicesGet = myModel.belongsTo(sequelize.models.ServiceDetail, {foreignKey: 'service_details_id', as: 'services'});
                var slabGet = myModel.belongsTo(sequelize.models.Slab, {foreignKey: 'slab_id', as: 'slab'});

                whereData = {}//{service_details_name: 'ss'};

                sequelize.models.SlabHeadFees.findAndCountAll({
                    where: whereData,
                    offset: req.offset,
                    limit: req.limit,
                    include: [{association: relationGet, include: [servicesGet, slabGet]}]}).then(function (results) {
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
            saveAllValueProvider: function (values, res) {

                id = values.body.id;

                if (typeof id !== 'undefined' && id != '') {
                    delete values.body.id;
                    myModel.update(values.body, {where: {id: id}}).then(function (results) {
                        results.status = 1;
                        res(results);

                    }).catch(function (err) {

                    });


                } else {

                    delete values.body.id;

                    sequelize.models.Commision.destroy();

                    myModel.create(values.body).then(function (results) {
                        results.status = 1;
                        res(results);

                    }).catch(function (err) {

                    });

                }



            },
            checkIfExist: function (values, res) {
                var conditions = {}
                if(values.body.id == '') {
                    conditions = { franchise_commission_level_id: values.body.franchise_commission_level_id, product_id: values.body.product_id }
                } else {
                    conditions = { franchise_commission_level_id: values.body.franchise_commission_level_id, id: { $ne: values.body.id }, product_id: values.body.product_id }
                }

                myModel.count({where: conditions}).then(function (dataCount) {
                    var dataResult = {};
                    if(dataCount == 0) {
                        dataResult.status = 1;    
                    } else {
                        dataResult.status = 0;
                    }
                    res(dataResult);
                });
            },
            saveAllValues: function (values, res) {

                id = values.body.id;

                if (typeof id !== 'undefined' && id != '') {

                    delete values.body.id;
                    values.body.commission_type = values.body.feeType;
                    delete values.body.feeType;

                    if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
                        values.body.is_active = 1
                    } else {
                        values.body.is_active = 0
                    }

                    myModel.update(values.body, {where: {id: id}}).then(function (results) {
                        results.status = 1;
                        res(results);
                    }).catch(function (err) {
                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });

                } else {
                    delete values.body.id;
                    values.body.commission_type = values.body.feeType;
                    delete values.body.feeType;
                    
                    if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
                        values.body.is_active = 1
                    } else {
                        values.body.is_active = 0
                    }

                    myModel.create(values.body, {}).then(function (results) {
                        
                    }).catch(function (err) {

                    });

                    var results = {};
                    results.status = 1;
                    res(results);
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
