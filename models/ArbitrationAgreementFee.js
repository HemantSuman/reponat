//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("ArbitrationAgreementFee",
            {
                holiday_period: {
                    type: DataTypes.STRING,
                },
                renew_percentage: {
                    type: DataTypes.STRING,
                },
                examption_fee_payable: {
                    type: DataTypes.STRING,
                },
                examption_appeal_payable: {
                    type: DataTypes.STRING,
                },
                examption_disputes: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_start_year: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_total_fees_without_tax: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_total_fees_tax: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_total_fees_cess: {
                    type: DataTypes.STRING,
                },
                arbitration_agreements_id: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_total_fees: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_total_year: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_basic_fee: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_per_year_fee: {
                    type: DataTypes.STRING,
                },
                is_active: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_renew_discount: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_renew_discount_per: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_services_discount: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_services_discount_per: {
                    type: DataTypes.STRING,
                },
                arbitration_agreement_total_discount: {
                    type: DataTypes.STRING,
                },
                nc_start_date: {
                    type: DataTypes.STRING,
                },
                nc_end_date: {
                    type: DataTypes.STRING,
                },
            },
            {
                tableName: 'arbitration_agreement_fees',
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
                    getById: function (id, res) {
                        myModel.findOne({where: {id: id}}).then(function (data) {
                            res(data);
                        });
                    },
                    saveAllValues: function (values, res) {
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
//                console.log(values.body);
                        myModel.update(values.body, {where: values.where}).then(function (results) {
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
                    deleteByValue: function (where, res) {
                        myModel.destroy({
                            where: where
                        }).then(function (data) {
                            res(data);
                        });
                    },
                },
                hooks: {
                    beforeCreate: function (instance) {
//                instance.set('tax_slug', slugify(instance.get('tax_name')));
                    }
                }

            }

    );

    return myModel;
};
