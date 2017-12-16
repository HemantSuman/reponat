//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("ArbitrationAgreementTax",
            {
                arbitration_agreements_id: {
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
                    type: DataTypes.STRING,
                },
                is_active: {
                    type: DataTypes.STRING,
                },
            },
            {
                tableName: 'arbitration_agreement_taxes',
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
                    createAllBulkValues: function (values, res) {

                        myModel.bulkCreate(values.body).then(function (results) {
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
