//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("ContactEnquiry",
            {
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                mobile: {
                    type: DataTypes.STRING,
                    validate: {
                        len: {
                            args: [10, 10],
                            msg: i18n_Validation.__('Please_Enter', '10 digit')
                        },
                        isValidPhoneNumber: function(val) {
                            //    /^\d+$/.test(val);
                            if (/^\d+$/.test(val) === false) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Mobile Number'))
                            }
                        },
                        // isInt: {
                        //     msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        // },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                email: {
                    type: DataTypes.STRING,
                    validate: {
                        isEmail: {
                            msg: i18n_Validation.__('Please_Enter', 'Valid Email Address')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                enquiry_detail: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                created: {  
                    type: DataTypes.STRING,
                },
                remark: {  
                    type: DataTypes.STRING,
                },
                responded_date: {  
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                status: {  
                    type: DataTypes.STRING,
                },
            },
    {
        tableName: 'contact_enquiries',
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
                    order: 'id DESC'
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
                // if (values.body.is_active === 'on') {
                //     values.body.is_active = 1;
                // } else {
                //     values.body.is_active = 0;
                // }
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
                // if (values.body.is_active === 'on') {
                //     values.body.is_active = 1;
                // } else {
                //     values.body.is_active = 0;
                // }
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
