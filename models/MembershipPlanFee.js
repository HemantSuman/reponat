//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("MembershipPlanFee",
            {
                membership_plan_id: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                number_of_years: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                fees: {
                    type: DataTypes.STRING,
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
                    type: DataTypes.INTEGER
                },
            },
    {
        tableName: 'membership_plan_fees',
        classMethods: {
            associate: function (models) {
                //var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
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
            },
            deleteByValue: function (where, res) {
                myModel.destroy({
                    where:  where
                }).then(function (data) {
                    res(data);
                });
            },
            saveBulkData: function (values, res) {
                myModel.bulkCreate(values).then(function (data) {
                    return true;
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
            getById: function (id, res) {
                myModel.findOne({where: {id: id}}).then(function (result) {
                    res(result);
                });
            },
            getBy: function (values, res) {
                myModel.findAll({where: values.where}).then(function (data) {
                    res(data);
                });
            },
            saveAllValues: function (values, res) {

                myModel.create(values.body, {}).then(function (results) {
                    
                }).catch(function (err) {

                });

                var results = {};
                results.status = 1;
                res(results);
            },
            changeStatus: function (values, res) {
                myModel.update(values.body, {where: values.where}).then(function (results) {
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
