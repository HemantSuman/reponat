//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("MembershipPlanIssueTax",
            {
                membership_plan_id: {
                    type: DataTypes.INTEGER,
                },
                membership_plan_issue_id: {
                    type: DataTypes.INTEGER,
                },
                tax_name: {
                    type: DataTypes.STRING,
                },
                tax_value: {
                    type: DataTypes.STRING,
                },
                tax_amount: {
                    type: DataTypes.STRING,
                },
                tax_type: {
                    type: DataTypes.INTEGER,
                },
                is_active: {
                    type: DataTypes.INTEGER,
                }
            },
    {
        tableName: 'membership_plan_issue_taxes',
        classMethods: {
            associate: function (models) {
                //var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
            },
            getAllValues: function (req, res) {
                myModel.findAll({where: req.where}).then(function (results) {
                    res(results);
                });
            },
            getFirstValues: function (req, res) {
//                        var mymodelMembershipPlanFeeHasMany = myModel.hasMany(sequelize.models.MembershipPlanFee, {foreignKey: 'membership_plan_id', as: 'membership_plan_fees'});
//                        myModel.findOne({where: req.where,
//                            include: [
//                                mymodelMembershipPlanFeeHasMany
//                            ]}).then(function (results) {
//                            res(results);
//                        });
            },
            getAllValuesPaging: function (req, res) {

                myModel.findAndCountAll({
                    where: req.where,
                    offset: req.offset,
                    limit: req.limit,
                    order: 'id DESC',
                }).then(function (results) {
                    console.log(results);
                    res(results);
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
            changeStatus: function (values, res) {
                myModel.update(values.body, {where: values.where}).then(function (results) {
                    res(results);
                });
            },
            saveBulkData: function (values, res) {
                myModel.bulkCreate(values).then(function (data) {
                    return true;
                });
            }
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
