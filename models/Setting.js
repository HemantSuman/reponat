//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
// setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});
i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");
module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("Setting",
            {
                position: {
                    type: DataTypes.STRING,
                },
                setting_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                setting_slug: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }

                },
                setting_value: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                created_at: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                }
            },
    {
        tableName: 'settings',
        classMethods: {
            associate: function (models) {
            },
            getAll: function (req, res) {
                myModel.findAll().then(function (data) {
                    objNew = {};
                    arr = [];
                    async.forEachOf(data, function (data, key, callback) {
                        objNew[data.setting_slug] = data.setting_value;
                        //arr.push(objNew);
                    });
                    res(objNew);
                    //res(data);
                });
            },
            getById: function (id, res) {
                myModel.findOne({where: {id: id}}).then(function (data) {
                    res(data);
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
                    order: 'position ASC'
                }).then(function (results) {
                    console.log(results);
                    res(results);
                });
            },
            getAllValues: function (req, res) {
                myModel.findAll({where: req.where}).then(function (results) {
                    res(results);
                });
            },
            updateAllValues: function (values, res) {
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
            saveAllValues: function (values, res) {

                id = values.body.id;
                delete values.body.id
                values.body.user_id = values.user.id;
                console.log(values.body)

                if (typeof id !== 'undefined' && id != '') {

                } else {
                    console.log('-------------------')
                    console.log(values.body);
                    myModel.create(values.body).then(function (results) {
                        results.status = 1;
                        results.id = results.id;
                        res(results);
                    }).catch(function (err) {
                        console.log(err);
                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });
                }

            }
        },
        hooks: {
        }
    }
    );
    return myModel;
};
