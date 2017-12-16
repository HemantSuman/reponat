//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("ServiceDetail",
            {
                product_id: {
                    type: DataTypes.INTEGER,
                },
                service_details_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                document_name: {
                    type: DataTypes.VIRTUAL,
                },
                document_count: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        isLongEnough: function (val) {
                            if (this.document_name != '' && val == '') {
                                throw new Error(i18n_Validation.__('add_doc_button'))
                            } else if (val == '') {
                                throw new Error(i18n_Validation.__('required'))
//                            
                            }
                        }
                    },
                },
                service_details_slug: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                dry_period: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                is_renewable: {
                    type: DataTypes.INTEGER,
                },
                renew_percentage: {
                    type: DataTypes.DOUBLE,
                    validate: {
                        not: {
                            args: ["[a-z]", 'i'],
                            msg: i18n_Validation.__('Please_Enter', 'Numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                age_for_service: {
                    type: DataTypes.INTEGER,
                    validate: {
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
                    type: DataTypes.INTEGER,
                },
                created: {
                    type: DataTypes.DATE,
                },
                updated: {
                    type: DataTypes.DATE,
                }
            },
            {
                tableName: 'service_details',
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
                        var mymodelServiceDetailDocumentHasMany = myModel.hasMany(sequelize.models.ServiceDetailDocument, {foreignKey: 'service_detail_id', as: 'service_detail_documents'});
                        var mymodelServiceDetailDurationWisePercentageHasMany = myModel.hasMany(sequelize.models.ServiceDetailDurationWisePercentage, {foreignKey: 'service_detail_id', as: 'service_detail_duration_wise_percentages'});
                        var mymodelServiceDetailSlabHasMany = myModel.hasMany(sequelize.models.ServiceDetailSlab, {foreignKey: 'service_detail_id', as: 'service_detail_slabs'});
                        myModel.findOne({where: req.where,
                            include: [
                                mymodelServiceDetailDocumentHasMany,
                                mymodelServiceDetailDurationWisePercentageHasMany,
                                mymodelServiceDetailSlabHasMany
                            ]}).then(function (results) {
                            res(results);
                        });
                    },
                    getAllValuesPaging: function (req, res) {
                        myModel.findAndCountAll({
                            where: req.where,
                            offset: req.offset,
                            limit: req.limit,
                            order: 'id DESC'
                        }).then(function (results) {
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

                        if (values.body.is_renewable === 'on') {
                            values.body.is_renewable = 1;
                        } else {
                            values.body.is_renewable = 0;
                        }
                        console.log(values.body);
                        var mymodelServiceDetailDocumentHasMany = myModel.hasMany(sequelize.models.ServiceDetailDocument, {foreignKey: 'service_detail_id', as: 'service_detail_documents'});
                        var mymodelServiceDetailDurationWisePercentageHasMany = myModel.hasMany(sequelize.models.ServiceDetailDurationWisePercentage, {foreignKey: 'service_detail_id', as: 'service_detail_duration_wise_percentages'});
                        var mymodelServiceDetailSlabHasMany = myModel.hasMany(sequelize.models.ServiceDetailSlab, {foreignKey: 'service_detail_id', as: 'service_detail_slabs'});
                        myModel.create(values.body, {include: [
                                mymodelServiceDetailDocumentHasMany,
                                mymodelServiceDetailDurationWisePercentageHasMany,
                                mymodelServiceDetailSlabHasMany
                            ]}).then(function (results) {
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

                        if (values.body.is_renewable === 'on') {
                            values.body.is_renewable = 1;
                        } else {
                            values.body.is_renewable = 0;
                            values.body.renew_percentage = null;
                        }
                        var mymodelServiceDetailDocumentHasMany = myModel.hasMany(sequelize.models.ServiceDetailDocument, {foreignKey: 'service_detail_id', as: 'service_detail_documents'});
                        var mymodelServiceDetailDurationWisePercentageHasMany = myModel.hasMany(sequelize.models.ServiceDetailDurationWisePercentage, {foreignKey: 'service_detail_id', as: 'service_detail_duration_wise_percentages'});
                        var mymodelServiceDetailSlabHasMany = myModel.hasMany(sequelize.models.ServiceDetailSlab, {foreignKey: 'service_detail_id', as: 'service_detail_slabs'});
                        if (typeof values.body.is_active === 'undefined') {
                            values.body.is_active = 0;
                        }

                        var relativeModels = ['ServiceDetailDocument', 'ServiceDetailDurationWisePercentage', 'ServiceDetailSlab'];
                        var relativeRequatAlise = ['service_detail_documents', 'service_detail_duration_wise_percentages', 'service_detail_slabs'];
                        async.forEach(relativeModels, function (value1, callback1) {

                            var where = {'service_detail_id': values.body.id};
                            var indexOfArray = relativeModels.indexOf(value1);

                            sequelize.models[value1].deleteByValue(where, function (results) {
                                sequelize.models[value1].saveBulkData(values.body[relativeRequatAlise[indexOfArray]], function (results) {

                                });
                                callback1(null);
                            });

                        }, function (err) {
                            console.log(values.body);
                            myModel.update(values.body, {
                                where: {id: values.body.id}
                            }).then(function (results) {
                                results.status = 1;
                                res(results);
                            }).catch(function (err) {
                                console.log(err);
                                var errors = err;
                                errors.status = false;
                                res(errors);
                            });
                        });
                    },
                    changeStatus: function (values, res) {
                        myModel.update(values.body, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                },
                hooks: {
                    beforeCreate: function (values, options) {
//                if (typeof values.is_active === 'undefined') {
//                    values.is_active = 0;
//                }

//                console.log('555555555555555555')
//                console.log(typeof values.is_renewable, values.is_renewable)
//                if (typeof values.is_renewable === 'undefined') {
//                    values.is_renewable = 0;
//                }
                    }
                }

            }

    );

    return myModel;
};


//module.exports.login = function (sequelize, DataTypes) {
//    console.log('module.exports.login');
//};
