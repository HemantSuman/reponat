//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("ServiceDetailDocument",
            {
                service_detail_id: {
                    type: DataTypes.INTEGER,
                },
                documents_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                documents_slug: {
                    type: DataTypes.STRING,
                }
            },
    {
        tableName: 'service_detail_documents',
        classMethods: {
            associate: function (models) {
                //var mymodelBussinessHasOne = myModel.hasOne(models.BussinessDetail, {foreignKey: 'user_id', as: 'bussiness_detail'})
            },
            method1: function (req, res) {
                myModel.findAll().then(function (users) {
                    res(users);
                });
            },
            deleteByValue: function (where, res) {
                myModel.destroy({
                    where: where
                }).then(function (data) {
                    res(data);
                });
            },
            getAllValues: function (req, res) {
                myModel.findAll({where: req.where}).then(function (results) {
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
//            beforeCreate: function (values, options) {
//                if (typeof values.is_active === 'undefined') {
//                    values.is_active = 0;
//                }
//                
//            }
        }

    }

    );

    return myModel;
};


//module.exports.login = function (sequelize, DataTypes) {
//    console.log('module.exports.login');
//};
