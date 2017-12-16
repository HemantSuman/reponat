var async = require("async");
//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
// setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});
i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
module.exports = function (sequelize, DataTypes) {

    var myModel = sequelize.define("CommissionPaid",
            {
                added_date: {
                    type: DataTypes.DATE
                },
                arbitration_agreements_id: {
                    type: DataTypes.STRING
                },
                commission: {
                    type: DataTypes.STRING
                },
                bonus: {
                    type: DataTypes.STRING
                },
                tds: {
                    type: DataTypes.STRING
                },
                total: {
                    type: DataTypes.STRING
                },
                base_amount: {
                    type: DataTypes.STRING
                },
                year_amount: {
                    type: DataTypes.STRING
                },
                commission_base_amount: {
                    type: DataTypes.STRING
                },
                membership_plan_issue_id: {
                    type: DataTypes.STRING
                },
                pay: {
                    type: DataTypes.STRING
                },
                tax: {
                    type: DataTypes.STRING
                },
                base_fee_per: {
                    type: DataTypes.STRING
                },
                tds_per: {
                    type: DataTypes.STRING
                },
                is_active: {
                    type: DataTypes.STRING
                }
            },
    {
        tableName: 'paid_commissions',
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
                myModel.findAll({where: req.where}).then(function (results) {
                    res(results);
                });
            },
            saveCommission: function (req, res) {

                req.id = 277;
                req.product_id = 1;
                sequelize.models.CommissionDistribution.commissionCalc(req, function (DataSave) {
                    sequelize.models.CommissionDistribution.bulkCreate(DataSave).then(function (data) {
                        res(DataSave);
                    }).catch(function (err) {
                        console.log(err);
                    });
                });

            }




        }}
    );
    return myModel;
};
//module.exports.login = function (sequelize, DataTypes) {
//    console.log('module.exports.login');
//};
