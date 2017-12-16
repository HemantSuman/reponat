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
    var myModel = sequelize.define("SpecialBonus",
            {
                product_type_id:{
                 type: DataTypes.INTEGER,   
                },
                product_id: {
                    type: DataTypes.INTEGER,
                },
                bonus_type: {
                    type: DataTypes.INTEGER,
                },
                start_date: {
                    type: DataTypes.DATE,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                end_date: {
                    type: DataTypes.DATE,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isLongEnough: function (val) {
                            var start_date1 = new Date(moment(this.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD')).getTime();
                            var end_date1 = new Date(moment(val, 'DD-MM-YYYY').format('YYYY-MM-DD')).getTime();

                            if (start_date1 > end_date1) {
                                throw new Error(i18n_Validation.__('greater-than', 'start date'))
                            }
                        }
                    }
                },
                bonus_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                bonus_value: {
                    type: DataTypes.DOUBLE,
                    validate: {
                        isLongEnough: function (val) {
                            if (val <= 0) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Positive value'))
                            }
                        },
                        not: {
                            args: ["[a-z]", 'i'],
                            msg: i18n_Validation.__('Please_Enter', 'Numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
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
                },
                is_default: {
                    type: DataTypes.STRING,
                }
            },
    {
        tableName: 'special_bonus',
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


                if(values.body.product_type_id){


                if (values.body.product_type_id == 1 || values.body.product_type_id == 3) {
                   values.body.is_default = 1;

                myModel.update({is_default:0}, {
                    where: {product_id:values.body.product_id,product_type_id:values.body.product_type_id}
                }).then(function (results) {


                myModel.create(values.body).then(function (results) {
                    results.status = 1;
                    res(results);
                }).catch(function (err) {
                    console.log(err);
                    var errors = err;
                    errors.status = false;
                    res(errors);
                });
                    
                    
                });


                } else {

                    values.body.is_default = 0;

                    myModel.create(values.body).then(function (results) {
                    results.status = 1;
                    res(results);
                }).catch(function (err) {
                    console.log(err);
                    var errors = err;
                    errors.status = false;
                    res(errors);
                });

                }    



                }else{


                if (values.body.is_default === 'on') {
                    values.body.is_default = 1;


                myModel.update({is_default:0}, {
                    where: {product_id:values.body.product_id}
                }).then(function (results) {


                myModel.create(values.body).then(function (results) {
                    results.status = 1;
                    res(results);
                }).catch(function (err) {
                    console.log(err);
                    var errors = err;
                    errors.status = false;
                    res(errors);
                });
                    
                    
                });


                } else {

                    values.body.is_default = 0;

                    myModel.create(values.body).then(function (results) {
                    results.status = 1;
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
            updateAllValues: function (values, res) {

                if (values.body.is_active === 'on') {
                    values.body.is_active = 1;
                } else {
                    values.body.is_active = 0;
                }



                if(values.body.product_type_id){


                if (values.body.product_type_id == 1 || values.body.product_type_id == 3) {
                    values.body.is_default = 1;


                myModel.update({is_default:0}, {
                    where: {product_id:values.body.product_id,product_type_id:values.body.product_type_id}
                }).then(function (results) {


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


                } else {

                    values.body.is_default = 0;

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

                }
    



                }else{    

                if (values.body.is_default === 'on') {
                    values.body.is_default = 1;


                myModel.update({is_default:0}, {
                    where: {product_id:values.body.product_id}
                }).then(function (results) {


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


                } else {

                    values.body.is_default = 0;

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

                }


            }






               
            },
            changeStatus: function (values, res) {
                myModel.update(values.body, {where: values.where}).then(function (results) {
                    res(results);
                });
            },
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
