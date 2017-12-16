//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("UsersType",
            {
                user_type_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                user_type_slug: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                is_active: {
                    type: DataTypes.INTEGER,
                }
            },
    {
        tableName: 'user_types',
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
            changeStatus: function (values, res) {
                myModel.update(values.body, {where: values.where}).then(function (results) {
                    res(results);
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
