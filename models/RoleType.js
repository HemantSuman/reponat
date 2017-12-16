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
    var myModel = sequelize.define("RoleType",
            {
                role_type_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {role_type_name: value, role_id: this.role_id},
                                attributes: ['id']
                            })
                                    .then(function (data) {
                                        // reject if a different user wants to use the same
                                        if (data && Number(self.id) !== data.id) {
                                            return next(i18n_Validation.__('Please_Enter', 'Unique Role Type Name'));
                                        }
                                        return next();
                                    })
                                    .catch(function (err) {
                                        return next(err);
                                    });

                        },
                    }
                },
                role_type_slug: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                role_id: {
                    type: DataTypes.INTEGER
                },
                is_front_registration: {
                    type: DataTypes.INTEGER,
                },
                is_active: {
                    type: DataTypes.INTEGER,
                }
            },
    {
        tableName: 'role_types',
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
            getByType: function (req, res) {
                myModel.findAll({where: req.where}).then(function (users) {
                    res(users);
                });
            },
            getMasterId: function (req, res) {
                myModel.findOne({where: req.where}).then(function (results) {
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

                if (values.body.is_front_registration === 'on') {
                    values.body.is_front_registration = 1;
                } else {
                    values.body.is_front_registration = 0;
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

                if (values.body.is_front_registration === 'on') {
                    values.body.is_front_registration = 1;
                } else {
                    values.body.is_front_registration = 0;
                }

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
            },
            changeStatus: function (values, res) {
                myModel.update(values.body, {where: values.where}).then(function (results) {
                    res(results);
                });
            },
            deleteOldPermissions: function(values, res) {
                //sequelize.models['ModelName']

                sequelize.models['Acl'].getAllValueForDeletePer(values, function (results) {
                    // console.log("oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
                    // console.log(results)
                    if(results.length) {
                        async.each(results, function (acl_data, callback) {
                            console.log("----------------------->>>>>>>>>>>>>> ID ----------------"+acl_data.id)

                            //Mode.destroy({ where: { id: [1,2,3,4] }})
                            var del_cond = { where: { acl_id: acl_data.id } }
                            sequelize.models['AclList'].deleteAllAclLists(del_cond, function (results) {
                                var del_con = { where: { id: acl_data.id } }
                                sequelize.models['Acl'].deleteAllAclLists(del_con, function (results) {
                                    callback();
                                })
                            })
                            //callback();
                        }, function (err) {
                            console.log(err);
                            var resp = { status: 1}
                            res(resp)
                        });    
                    } else {
                        var resp = { status: 1}
                        res(resp)
                    }
                })
            }
        },
        hooks: {
//            beforeCreate: function (values, options) {
//                if (typeof values.is_active === 'undefined') {
//                    values.is_active = 0;
//                }
//            }

        }

    }

    );

    return myModel;
};
