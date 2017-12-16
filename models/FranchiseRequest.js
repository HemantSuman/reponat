//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("FranchiseRequest",
            {
                franchise_request_type: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                business_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                contact_person: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                email: {
                    type: DataTypes.STRING,
                    validate: {
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {email: value},
                                attributes: ['id']
                            }).then(function (data) {
                                // reject if a different user wants to use the same email
                                if (data && Number(self.id) !== data.id) {
                                    return next(i18n_Validation.__('AlreadyExist', 'Email'));
                                }
                                return next();
                            })
                                    .catch(function (err) {
                                        return next(err);
                                    });
                        },
                        isEmail: {
                            msg: i18n_Validation.__('Please_Enter', 'Valid Email Address')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                mobile: {
                    type: DataTypes.STRING,
                    validate: {
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {mobile: value},
                                attributes: ['id']
                            }).then(function (data) {
                                // reject if a different user wants to use the same email
                                if (data && Number(self.id) !== data.id) {
                                    return next(i18n_Validation.__('AlreadyExist', 'Mobile No.'));
                                }
                                return next();
                            })
                                    .catch(function (err) {
                                        return next(err);
                                    });
                        },
                        isInt: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                profile_desc: {
                    type: DataTypes.STRING,
                    validate: {
                        len: {
                            args: [100, 500],
                            msg: i18n_Validation.__('length', 'It must be between 100 and 500 characters in length')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                franchise_address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                town: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                division_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                district_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                tehsil_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                qualification: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                apply_for: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                working_interest: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                info_about_arbitration: {
                    type: DataTypes.STRING,
                    validate: {
                        len: {
                            args: [100, 500],
                            msg: i18n_Validation.__('length', 'It must be between 100 and 500 characters in length')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                interest_to_become_authorized: {
                    type: DataTypes.STRING,
                    validate: {
                        len: {
                            args: [100, 500],
                            msg: i18n_Validation.__('length', 'It must be between 100 and 500 characters in length')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                captcha_ans: {
                    type: DataTypes.VIRTUAL,
                },
                captcha_client: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isLongEnough: function (val) {
                            if (val != this.captcha_ans) {
                                throw new Error(i18n_Validation.__('g_captcha'));
                            }
                        }
                    }
                },
//                'g-recaptcha-response': {
//                    type: DataTypes.VIRTUAL,
//                    validate: {
//                        isLongEnough: function (val) {
//                            if (val == '') {
//                                throw new Error(i18n_Validation.__('g_captcha', 'captcha error.....'))
//                            }
//                        }
//                    }
//                },
                status: {
                    type: DataTypes.STRING
                }
            },
            {
                tableName: 'franchise_requests',
                classMethods: {
                    associate: function (models) {
                        //var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
                    },
//            getAllValues: function (req, res) {
//
//                var join = myModel.belongsTo(sequelize.models.FranchiseCommissionLevel, {foreignKey: 'franchise_commission_level_id', as: 'level'});
//
//                //var join = myModel.belongsTo(sequelize.models.FranchiseCommissionLevel, {foreignKey: 'franchise_commission_level_id', as: 'level'});
//
//
//                myModel.findAndCountAll({where: req.where, include: [modeljoin], offset: req.offset, limit: req.limit}).then(function (results) {
//                    //console.log(results.rows.master);
//                    res(results);
//                });
//            },
                    getAllValues: function (req, res) {
                        var join = myModel.belongsTo(sequelize.models.FranchiseCommissionLevel, {foreignKey: 'franchise_commission_level_id', as: 'level'});
                        myModel.findAll({where: req.where, include: [join]}).then(function (results) {
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
                            //console.log(results);
                            res(results);
                        });
                    },
                    getByEmail: function (email, res) {
                        myModel.findOne({where: {email: email}}).then(function (users) {
                            res(users);
                        });
                    },
                    getFirstValues: function (req, res) {
                        myModel.findOne({where: req.where}).then(function (results) {
                            res(results);
                        });
                    },
                    getById: function (id, res) {
                        myModel.findOne({where: {id: id}}).then(function (result) {
                            res(result);
                        });
                    },
                    getBy: function (req, res) {
                        myModel.findAll({where: req.where}).then(function (data) {
                            res(data);
                        });
                    },
                    changeStatus: function (values, res) {
                        myModel.update(values.body, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                    saveAllValues: function (values, res) {

                        myModel.create(values.body, {}).then(function (results) {

                        }).catch(function (err) {

                        });

                        var results = {};
                        results.status = 1;
                        res(results);
                    }
                },
                hooks: {
                    beforeCreate: function (values, options) {
                        // if (typeof values.is_active === 'undefined') {
                        //     values.is_active = 0;
                        // }
                    }
                }
            }
    );

    return myModel;
};
