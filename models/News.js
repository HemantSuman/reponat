//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
//var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("News",
            {
                first_news: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                second_news: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                is_active: {
                    type: DataTypes.STRING,
                },
            },
            {
                tableName: 'news',
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
                        myModel.findAll({where: req.where, order: req.order}).then(function (results) {
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
                    saveAllValues: function (req, res) {

                        myModel.create(req.body).then(function (results) {
                            results.status = 1;
                            res(results);
                        }).catch(function (err) {
                            var errors = err;
                            errors.status = false;
                            res(errors);
                        });

                    },
                    updateAllValues: function (req, res) {

                        req.where = {id: req.body.id};
                        myModel.update(req.body, {where: req.where}).then(function (data) {
                            var results = {};
                            results = req.body;
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
                        
                        myModel.update({is_active:0}, {where: {}}).then(function (results) {
                            myModel.update(values.body, {where: values.where}).then(function (results) {
                                res(results);
                            });
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
