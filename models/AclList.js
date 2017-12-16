//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");
var moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("AclList",
            {
                acl_id: {
                    type: DataTypes.STRING,
                },
                acl_list_name: {
                    type: DataTypes.STRING,
                },
                acl_list_slug: {
                    type: DataTypes.STRING,
                },
                acl_list_icon: {
                    type: DataTypes.STRING,
                },
                acl_list_url: {
                    type: DataTypes.STRING,
                },
                position: {
                    type: DataTypes.STRING,
                },
                show: {
                    type: DataTypes.STRING,
                },
                allow: {
                    type: DataTypes.STRING,
                },
                slug_value: {
                    type: DataTypes.STRING,
                },
                slug_name: {
                    type: DataTypes.STRING,
                },
                type: {
                    type: DataTypes.STRING,
                },
                icon: {
                    type: DataTypes.STRING,
                }
            },
    {
        tableName: 'acl_lists',
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
                //console.log(req.users.role_type_id);
                var role_list = myModel.hasMany(models.BussinessDetail, {foreignKey: 'acl_id', as: 'role_list'})
                myModel.findAll({where: {role_type_id: req.user.role_type_id}, include: [role_list]}).then(function (results) {
                    res(results);
                });
            },
            saveValuesPermission: function(values, res) {
                console.log("------------->>>>>>>>>>>>>>> AT saveValuesPermission <<<<<<<<<<<<<<<--------------------")
                console.log(values)

                async.each(values.acl_list_arrays, function (dataValue, callback3) {
                    myModel.findOne({where: { id: dataValue }}).then(function (getData) {
                        var data_to_be_saved = {
                            acl_id: values.acl_id,
                            acl_list_name: getData.acl_list_name,
                            icon: getData.icon,
                            acl_list_slug: getData.acl_list_slug,
                            acl_list_icon: getData.acl_list_icon,
                            acl_list_url: getData.acl_list_url,
                            position: getData.position,
                            //show: (getData.type == "view") ? 1 : 0,
                            show: getData.show,
                            allow: 1,
                            slug_value: getData.slug_value,
                            slug_name: getData.slug_name,
                            type: getData.type
                        };

                        myModel.create(data_to_be_saved).then(function (saveStatus) {
                            callback3();
                        }).catch(function (err) {
                            console.log(err);
                            callback3();
                        });
                        //callback3();
                    })
                }, function (err) {
                    console.log(err);
                    if(err) {

                    } else {}
                        var response = {};
                        response.status = 1;
                        res(response);
                });
            },
            deleteAllAclLists: function(values, res) {
                myModel.destroy({
                    where: values.where
                }).then(function (results) {
                    res(results);
                });
            },
            getAllRecords: function (values, res) {
                myModel.findAll({where: values.where}).then(function (results) {
                    res(results);
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
        }

    }

    );

    return myModel;
};
