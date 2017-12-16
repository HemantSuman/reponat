//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("Country",
            {
                country_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {country_name: value},
                                attributes: ['id']
                            })
                                    .then(function (data) {
                                        // reject if a different user wants to use the same email
                                        if (data && Number(self.id) !== data.id) {
                                            return next(i18n_Validation.__('Please_Enter', 'Unique Country Name'));
                                        }
                                        return next();
                                    })
                                    .catch(function (err) {
                                        return next(err);
                                    });

                        },
                    }
                },
                country_slug: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                country_code: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {country_code: value},
                                attributes: ['id']
                            })
                                    .then(function (data) {
                                        // reject if a different user wants to use the same email
                                        if (data && Number(self.id) !== data.id) {
                                            return next(i18n_Validation.__('Please_Enter', 'Unique Country Code'));
                                        }
                                        return next();
                                    })
                                    .catch(function (err) {
                                        return next(err);
                                    });

                        },
                    }
                },
                is_active: {
                    type: DataTypes.INTEGER,
                },
                currency_id: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                }
            },
    {
        tableName: 'countries',
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
                var mymodelCurrencybelongsTo = myModel.belongsTo(sequelize.models.Currency, {foreignKey: 'currency_id'})
                myModel.findAndCountAll({
                    where: req.where,
                    offset: req.offset,
                    limit: req.limit,
                    order: 'id DESC',
                    include:[mymodelCurrencybelongsTo]
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
                if (values.body.is_active === 'on') {
                    values.body.is_active = 1;
                } else {
                    values.body.is_active = 0;
                }
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
                if (values.body.is_active === 'on') {
                    values.body.is_active = 1;
                } else {
                    values.body.is_active = 0;
                }
                myModel.update(values.body, {where: {id: values.body.id}}).then(function (results) {
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
        },
        hooks: {
            beforeCreate: function (instance) {
//                instance.set('country_slug', slugify(instance.get('country_name')));
            }
        }

    }

    );

    return myModel;
};
