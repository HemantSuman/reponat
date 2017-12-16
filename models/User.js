var async = require("async");
var colors = require('colors');
//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
// setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});
i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var XLSX = require('xlsx');
module.exports = function (sequelize, DataTypes) {
    console.log('module.exports.login');
    var myModel = sequelize.define("User",
            {
                email: {
                    type: DataTypes.STRING,
                    validate: {
                        isEmail: {
                            msg: i18n_Validation.__('Please_Enter', 'Valid Email Address')
                        },
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {email: value},
                                attributes: ['id']
                            })
                                    .then(function (data) {
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
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                gid: {
                    type: DataTypes.STRING,
                },
                first_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                password: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isMin: function (value) {
                            if (parseInt(value.length) < 6) {
                                throw new Error(i18n_Validation.__('min_characters', '6'))
                            }
                        },
                    }
                },
                password_confirm: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isLongEnough: function (val) {
                            if (val != this.password) {
                                throw new Error(i18n_Validation.__('passwordmatch', 'Confirm Password'))
                            }
                        }
                    }
                },
                role_type_id: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                image_url: {
                    type: DataTypes.STRING,
                    //  validate: {
                    //     isLongEnough: function (val) {
                    //         var ext1 = val.split('.').pop();
                    //         var validExt = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'];
                    //         if (validExt.indexOf(ext1) < 0) {
                    //             throw new Error(i18n_Validation.__('Please_Select', 'Valid image'))
                    //         }
                    //     }
                    // }
                },
                check_img: {
                    type: DataTypes.STRING,
                    validate: {
                        isLongEnough: function (val) {
                            var ext1 = val.split('.').pop();
                            var validExt = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'];
                            // if (val === '') {
                            //     throw new Error(i18n_Validation.__('Please_Select', 'Image'));
                            // }
//                            else if (validExt.indexOf(ext1) < 0) {
//                                throw new Error(i18n_Validation.__('Please_Select', 'Valid Image'));
//                            }
                        }
                    }
                },
                mobile: {
                    type: DataTypes.STRING,
                    validate: {
                        isInt: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        len: {
                            args: [10, 10],
                            msg: i18n_Validation.__('Please_Enter', '10 digit')
                        },
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {mobile: value},
                                attributes: ['id']
                            })
                                    .then(function (data) {
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
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                aadhaar_number: {
                    type: DataTypes.STRING,
                    validate: {
                        isAadharCardValidation: function (val) {
                            ///^\d+$/.test(val)
                            //if (val.length != 0 && val.length != 12 || isNaN(val)) {
                            if (val.length != 0 && val.length != 12 || (/^\d+$/.test(val)) === false) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'valid aadhar number'))
                            }
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                gender: {
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
                active_commission: {
                    type: DataTypes.STRING,
                },
                area: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                nearest_milestone: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                special_bonus_id: {
                    type: DataTypes.STRING,
                },
                trunover_base_deal: {
                    type: DataTypes.STRING,
                },
                country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                tehsil_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                district_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                division_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                provider_type: {
                    type: DataTypes.STRING
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
                residence_address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                otp_email_ap: {
                    type: DataTypes.INTEGER,
                },
                otp_mobile: {
                    type: DataTypes.INTEGER,
                },
                otp_email: {
                    type: DataTypes.INTEGER,
                },
                otp_status_mobile: {
                    type: DataTypes.INTEGER,
                },
                otp_status_email: {
                    type: DataTypes.INTEGER,
                },
                is_complete_registration: {
                    type: DataTypes.STRING
                },
                added_date: {
                    type: DataTypes.DATE
                },
                franchise_type: {
                    type: DataTypes.STRING
                },
                franchise_is: {
                    type: DataTypes.STRING
                },
                profile_description: {
                    type: DataTypes.STRING
                },
                qualification: {
                    type: DataTypes.STRING
                },
                id_type: {
                    type: DataTypes.STRING,
                    validate: {
                        isGovNumberEntered: function (val) {
                            if (this.id_number != "" && val == "") {
                                throw new Error(i18n_Validation.__('required'))
                            }
                        }
                    }
                },
                id_number: {
                    type: DataTypes.STRING,
                    validate: {
                        isPanCardValid: function (val) {
                            if (this.id_type == 'pan_number') {
                                if ((val.length != 10) || !isNaN(val.substring(0, 5)) || isNaN(val.substring(5, 9)) || !isNaN(val.substring(9, 10))) {
                                    throw new Error(i18n_Validation.__('Please_Enter', 'valid PAN number'))
                                }
                            } else if (this.id_type == 'voter_id') {
                                if (val.length == 0) {
                                    throw new Error(i18n_Validation.__('required'))
                                }
                            }
                        }
                    }
                },
                pincode: {
                    type: DataTypes.STRING
                },
                designation: {
                    type: DataTypes.STRING
                },
                franchise_id: {
                    type: DataTypes.STRING
                },
                franchise_date: {
                    type: DataTypes.STRING
                },
                legal_documents: {
                    type: DataTypes.STRING
                },
                no_of_credits: {
                    type: DataTypes.STRING,
                    validate: {
                        isLongEnough: function (val) {
                            if (val < 0) {
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
                remaining_no_of_credits: {
                    type: DataTypes.STRING
                },
                special_bonus_id_membership: {
                    type: DataTypes.STRING
                },
                reset_password_token: {
                    type: DataTypes.STRING
                },
                old_password: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                new_confirm_password: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        isLongEnough: function (val) {
                            if (val != this.password) {
                                throw new Error(i18n_Validation.__('passwordmatch', 'Confirm Password'))
                            }
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                is_terms_condition: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
            },
            {
                tableName: 'users',
                classMethods: {
                    associate: function (models) {
                        //var mymodelBussinessHasOne = myModel.hasOne(models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
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
                    getAllValuesPaging: function (req, res) {

                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserType = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_type'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'});

                        var bonus_n1 = myModel.belongsTo(sequelize.models.SpecialBonus, {foreignKey: 'special_bonus_id', as: 'bonus_n1'});
                        var bonus_m = myModel.belongsTo(sequelize.models.SpecialBonus, {foreignKey: 'special_bonus_id_membership', as: 'bonus_m'});

                        user_type_id = req.where.master_type_id;
                        delete req.where.master_type_id;
                        myModel.findAndCountAll({
                            where: req.where,
                            offset: req.offset,
                            order: 'id desc',
                            limit: req.limit,
                            //include: [UserBankDetail, UserType],
                            include: [{association: UserType, where: {role_id: req.params.role_id}}, UserBankDetail, UserBusinesDetail, bonus_n1, bonus_m]
                        }).then(function (results) {
                            //console.log(results);
                            res(results);
                        });
                    },
                    getUserByEmail: function (email, res) {

                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserType = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_type'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'});
                        var UserRole = sequelize.models.RoleType.belongsTo(sequelize.models.Role, {foreignKey: 'role_id', as: 'user_role'});
                        var Usercity = myModel.belongsTo(sequelize.models.District, {foreignKey: 'district_id', as: 'district'});


//                myModel.findOne({where: {email: email}, include: [UserType, UserBankDetail, UserBusinesDetail,UserRole]}).then(function (users) {
//                        myModel.findOne({where: {email: email}, include: [{all: true, nested: true}]}).then(function (users) {
                        myModel.findOne({where: {email: email},
                            include: [
                                {association: UserBankDetail, include: []},
                                {association: UserType, include: [{association: UserRole, include: []}]},
                                {association: UserBusinesDetail, include: []},
                                {association: Usercity, include: []},
                            ]
                        }).then(function (users) {
                            if (users) {
                                var query_aplevels = '';
                                query_aplevels += ' SELECT group_concat(franchise_id) franchise_id,(SELECT franchise_level FROM franchise_levels where user_id=? limit 1) franchise_level  FROM user_franchises WHERE user_id = ? ';

//                            
                                sequelize.query(query_aplevels,
                                        {replacements: [users.id, users.id], type: sequelize.QueryTypes.SELECT}
                                ).then(function (ap_data) {
                                    users = users.get({plain: true});
                                    users.franchise_id = ap_data[0].franchise_id;
                                    users.franchise_level = ap_data[0].franchise_level;

                                    //console.log(users);
                                    res(users);
                                });
                            } else {
                                res(null);
                            }

                        });
                    },
                    getByMobile: function (mobile, res) {
                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                        var UserRoles = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_roles'});
                        var UserFranchise = myModel.hasMany(sequelize.models.UserFranchise, {foreignKey: 'user_id', as: 'user_franchises'})
                        var UserAssociatedFranchiseRole = sequelize.models.UserFranchise.belongsTo(sequelize.models.User, {foreignKey: 'id', targetKey: 'franchise_id', as: 'user_associated_franchise_role'})
                        //var UserFranchiseUser = sequelize.models.UserFranchise.belongsTo(sequelize.models.User, {foreignKey: 'id', as: 'user_associated_franchise_role'});
                        //var UserFranchiseLevels = myModel.hasMany(sequelize.models.FranchiseLevel, {foreignKey: 'user_id', as: 'user_franchise_levels'})


                        // Issue.find({
                        //     include: [
                        //         {
                        //             model: Invite,
                        //             include: [Group]
                        //         }
                        //     ]
                        // });

                        myModel.findOne({
                            where: {mobile: mobile, role_type_id: [1, 2, 3, 5]},
                            include: [
                                UserBankDetail,
                                UserBusinesDetail,
                                UserRoles,
                                UserFranchise,
                                        //UserFranchiseUser
                            ]
                        }).then(function (users) {
                            res(users);
                        });
                    },
                    getByEmail: function (mobile, res) {
                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                        var UserRoles = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_roles'});
                        var UserFranchise = myModel.hasMany(sequelize.models.UserFranchise, {foreignKey: 'user_id', as: 'user_franchises'})
                        var UserAssociatedFranchiseRole = sequelize.models.UserFranchise.belongsTo(sequelize.models.User, {foreignKey: 'id', targetKey: 'franchise_id', as: 'user_associated_franchise_role'})
                        //var UserFranchiseUser = sequelize.models.UserFranchise.belongsTo(sequelize.models.User, {foreignKey: 'id', as: 'user_associated_franchise_role'});
                        //var UserFranchiseLevels = myModel.hasMany(sequelize.models.FranchiseLevel, {foreignKey: 'user_id', as: 'user_franchise_levels'})


                        // Issue.find({
                        //     include: [
                        //         {
                        //             model: Invite,
                        //             include: [Group]
                        //         }
                        //     ]
                        // });

                        myModel.findOne({
                            //where: {email: mobile, role_type_id: [1, 2, 3, 5]},
                            where: {email: mobile},
                            include: [
                                UserBankDetail,
                                UserBusinesDetail,
                                UserRoles,
                                UserFranchise,
                                        //UserFranchiseUser
                            ]
                        }).then(function (users) {
                            res(users);
                        });
                    },
                    getDeedWriterByMobile: function (mobile, res) {
                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                        var UserRoles = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_roles'});

                        myModel.findOne({where: {mobile: mobile, role_type_id: 5}, include: [UserBankDetail, UserBusinesDetail, UserRoles]}).then(function (users) {
                            res(users);
                        });
                    },
                    getById: function (id, res) {
                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                        var UserRoles = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_roles'});

                        myModel.findOne({where: {id: id}, include: [UserBankDetail, UserBusinesDetail, UserRoles]}).then(function (users) {
                            res(users);
                        });
                    },
                    changeStatus: function (values, res) {
                        myModel.update(values.body, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                    saveCredit: function (values, res) {

                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                        console.log(values.body)
                        console.log(values.where)
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

                        myModel.update(values.body, {
                            where: values.where
                        }).then(function (results) {
                            var results = {}
                            results.status = 1;
                            res(results);
                        }).catch(function (err) {
                            console.log(err);
                            var errors = err;
                            errors.status = false;
                            res(errors);
                        });
                    },
                    saveAPCredit: function (values, res) {

                        console.log("/////////////////////////////////////////////////////////////////////////////////////")
                        console.log(values)
                        console.log("/////////////////////////////////////////////////////////////////////////////////////")


                        async.forEach(values, function (dataValues, callback1) {
                            console.log("?????????????????????????????????????????????????")
                            console.log(dataValues)
                            console.log("..................................................")
                            // var where = {'membership_plan_id': values.body.id};
                            // var indexOfArray = relativeModels.indexOf(value1);


                            myModel.update(dataValues.data, {
                                where: dataValues.where
                            }).then(function (results) {
                                callback1(null);
                            });

                            // sequelize.models[value1].deleteByValue(where, function (results) {
                            //     sequelize.models[value1].saveBulkData(values.body[relativeRequatAlise[indexOfArray]], function (results) {

                            //     });
                            //     callback1(null);
                            // });

                        }, function (err) {
                            var results = {}
                            results.status = 1;
                            res(results);
                            // var errors = err;
                            // errors.status = false;
                            // res(errors);
                        });


                        // myModel.update(values.body, {
                        //     where: values.where
                        // }).then(function (results) {
                        //     var results = {}
                        //     results.status = 1;
                        //     res(results);
                        // }).catch(function (err) {
                        //     console.log(err);
                        //     var errors = err;
                        //     errors.status = false;
                        //     res(errors);
                        // });
                    },
                    updateOtp: function (values, res) {
                        myModel.update(values.update, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                    applyBonus: function (req, res) {
                        col_name = req.body.col
                        updateObj = {};
                        if (req.body.special_bonus_id == 0) {
                            updateObj[col_name] = null;
                        } else {
                            updateObj[col_name] = req.body.special_bonus_id;
                        }

                        async.forEachOf(req.body.ids, function (getData, key, callback) {

                            myModel.update(updateObj, {where: {id: getData}}).then(function (data) {

                            });

                        });
                        results = {};
                        results.status = 1;
                        res(results);
                    },
                    makeUserActive: function (req, res) {

                        console.log(req.params);
                        myModel.findAll(
                                {
                                    where: {token: req.params.token, id: req.params.user_id}
                                }
                        ).then(function (data) {

                            if (data.length) {

                                myModel.update({token: '', is_active: 1}, {where: {id: req.params.user_id}}).then(function (data) {
                                    //res.render('front/home/home',{status:true,msg:'Verifaction process compleate successfully'});  
                                    req.flash('flashMsg', 'Verification process completed successfully. please login your account');
                                    res.redirect('/admin');
                                });
                            } else {
                                //res.render('front/home/home',{status:false,msg:'Invaild process'});  
                                req.flash('flashMsg', 'Verification process failed');
                                res.redirect('/admin');
                            }


                        });
                    },
                    completeRegistration: function (values, res) {

                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})


                        //delete values.body.id;
                        values.body.is_complete_registration = 1;
                        values.body.is_active = 1;
                        myModel.update(values.body, {where: {id: values.user.id}}).then(function (results) {
                            //console.log(values.body.user_busines_details);

                            var statusForOtherUser = true;

//                    if (typeof values.body.user_busines_details === 'undefined') {
//                        values.body.user_busines_details = {id: ''};
//                        statusForOtherUser = false;
//                    }
//                    if (typeof values.body.user_bank_details === 'undefined') {
//                        values.body.user_bank_details = {id: ''};
//                        statusForOtherUser = false;
//                    }


                            async.parallel([
                                function (callback) {

                                    if (typeof values.body.user_bank_details !== 'undefined') {
                                        sequelize.models.UserBankDetail.update(values.body.user_bank_details, {where: {user_id: values.user.id}}).then(function (results) {
                                            callback(null);
                                        }).catch(function (err) {
                                            console.log(err);
                                        });
                                    } else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (typeof values.body.user_busines_details !== 'undefined') {
                                        sequelize.models.UserBusinesDetail.update(values.body.user_busines_details, {where: {user_id: values.user.id}}).then(function (results) {
                                            callback(null);
                                        }).catch(function (err) {
                                            console.log(err);
                                        });
                                    } else {
                                        callback(null);
                                    }
                                }, function (callback) {
                                    var req1 = {};
                                    req1.where = {user_id: values.user.id, franchise_id: values.app.locals.settingData['admin_ap']};
                                    sequelize.models['UserFranchise'].getFirstValues(req1, function (results) {
                                        if (!results) {
                                            sequelize.models.UserFranchise.create({user_id: values.user.id, franchise_id: values.app.locals.settingData['admin_ap']});
                                            callback(null);
                                        } else {
                                            callback(null);
                                        }
                                    });

                                }
                            ], function (err) {
                                results.status = 1;
                                res(results);
                            });



//                    if (typeof values.body.user_bank_details !== 'undefined') {
//                        sequelize.models.UserBankDetail.update(values.body.user_bank_details, {where: {user_id: values.user.id}});
//                    }
//
//
//                    if (typeof values.body.user_busines_details !== 'undefined') {
//                        sequelize.models.UserBusinesDetail.update(values.body.user_busines_details, {where: {user_id: values.user.id}});
//                    }
//
//                    sequelize.models.UserFranchise.create({user_id: values.user.id, franchise_id: values.app.locals.settingData['admin_ap']});
//
//                    results.status = 1;
//                    res(results);



                        }).catch(function (err) {
                            console.log(err);
                        });


                    }
                    ,
                    resendOtpAll: function (req, res) {

                        myModel.update(req.updateObj, {where: {id: req.user_id}}).then(function (data) {
                            results = {}
                            results.status = 1;
                            res(results);
                        });
                    },
                    updateUserProfile: function (values, res) {
                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                        id = values.body.id;
                        if (typeof id !== 'undefined' && id != '') {
                            delete values.body.id;
                            delete values.body.email;
                            delete values.body.mobile;

                            if (!values.body.password && !values.body.password_confirm) {
                                delete values.body.password;
                                delete values.body.password_confirm;
                            }

//                    if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
//                        values.body['is_active'] = 1
//                    } else {
//                        values.body['is_active'] = 0;
//                    }

//                    if (typeof values.body.trunover_base_deal !== 'undefined' && values.body.trunover_base_deal != '') {
//                        values.body['trunover_base_deal'] = 1
//                    } else {
//                        values.body['trunover_base_deal'] = 0;
//                    }
//
//                    if (values.body.special_bonus_id_membership == '') {
//                        values.body.special_bonus_id_membership = null;
//                    }

                            myModel.update(values.body, {where: {id: id}}).then(function (results) {

                                //console.log(typeof values.body.user_bank_details);

                                async.parallel([
                                    function (callback) {

                                        if (typeof values.body.user_bank_details !== 'undefined') {
                                            sequelize.models.UserBankDetail.update(values.body.user_bank_details, {where: {user_id: id}}).then(function (results) {
                                                callback(null);
                                            }).catch(function (err) {
                                                console.log(err);
                                            });
                                        } else {
                                            callback(null);
                                        }
                                    },
                                    function (callback) {
                                        if (typeof values.body.user_busines_details !== 'undefined') {
                                            sequelize.models.UserBusinesDetail.update(values.body.user_busines_details, {where: {user_id: id}}).then(function (results) {
                                                callback(null);
                                            }).catch(function (err) {
                                                console.log(err);
                                            });
                                        } else {
                                            callback(null);
                                        }
                                    },
                                ], function (err) {
                                    results.status = 1;
                                    res(results);
                                });

                            }).catch(function (err) {
                                console.log(err);
                            });

                        }
                    },
                    saveAllValues: function (values, res) {
                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                        id = values.body.id;
                        if (typeof id !== 'undefined' && id != '') {
                            delete values.body.id;
                            delete values.body.email;
                            delete values.body.mobile;

                            if (!values.body.password && !values.body.password_confirm) {
                                delete values.body.password;
                                delete values.body.password_confirm;
                            }

                            if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
                                values.body['is_active'] = 1
                            } else {
                                values.body['is_active'] = 0;
                            }

                            if (typeof values.body.trunover_base_deal !== 'undefined' && values.body.trunover_base_deal != '') {
                                values.body['trunover_base_deal'] = 1
                            } else {
                                values.body['trunover_base_deal'] = 0;
                            }

                            if (values.body.special_bonus_id_membership == '') {
                                values.body.special_bonus_id_membership = null;
                            }

                            myModel.update(values.body, {where: {id: id}}).then(function (results) {


                                if (typeof values.body.user_bank_details !== 'undefined') {
                                    sequelize.models.UserBankDetail.update(values.body.user_bank_details, {where: {user_id: id}});
                                }


                                if (typeof values.body.user_busines_details !== 'undefined') {
                                    sequelize.models.UserBusinesDetail.update(values.body.user_busines_details, {where: {user_id: id}});
                                }
                                //6 sep updfate
//                                if (values.body.chgPar.parent_franchise_old != values.body.chgPar.parent_franchise_new) {
//
//                                    console.log('-------------++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++change parent');
//
//                                    sequelize.models.FranchiseLevel.update({parent_franchise: values.body.chgPar.parent_franchise_new}, {where: {user_id: id, parent_franchise: values.body.chgPar.parent_franchise_old}});
//                                }

                                console.log('data++++++++++++++++++++');
                                sequelize.models.Franchise.findOne({where: {user_id: id}}).then(function (data) {

                                    if (values.body.list_data && values.body.list_data != '') {

                                        async.forEachOf([values.body.list_data], function (getData, key, callback) {
                                            var keyFr = data.franchise_level.replace('level', 'id')
                                            data[keyFr] = getData;
                                            saveObj = {};
                                            saveObj.user_id = data.user_id;
                                            saveObj.franchise_commission_level_id = data.franchise_commission_level_id;
                                            saveObj.franchise_level = data.franchise_level;
                                            saveObj.country_id = data.country_id;
                                            saveObj.state_id = data.state_id;
                                            saveObj.division_id = data.division_id;
                                            saveObj.district_id = data.district_id;
                                            saveObj.tehsil_id = data.tehsil_id;

//                                            if (values.body.chgPar.parent_franchise_old != values.body.chgPar.parent_franchise_new) {
//                                                saveObj.parent_franchise = values.body.chgPar.parent_franchise_new;
//                                            } else {
//                                                saveObj.parent_franchise = data.parent_franchise;
//                                            }

                                            saveObj[keyFr] = getData;
                                            console.log('data++++++++++++++++++++');
                                            console.log(saveObj);
                                            console.log('data++++++++++++++++++++');
                                            sequelize.models.Franchise.create(saveObj).then(function (results) {

                                            }).catch(function (err) {
                                                console.log(err);
                                            });
                                        });

                                    }

                                    console.log('data++++++++++++++++++++');
                                    console.log(data);
                                    console.log('data++++++++++++++++++++');
                                });
                                //6 sep updfate

                                results.status = 1;
                                res(results);
                            }).catch(function (err) {
                                console.log(err);
                            });
                        } else {

                            //6 sep 
//                            console.log('franchise_' + values.body.franchise_levels.franchise_level.replace('level', 'id'));
                            fran_key = 'franchise_' + values.body.franchise_levels.franchise_level.replace('level', 'id');
                            type_key = values.body.franchise_levels.franchise_level.replace('level', 'id');
                            console.log(typeof values.body.franchise_levels[fran_key]);
                            var arrOfVals = [];
                            if (typeof values.body.franchise_levels[fran_key] === 'string') {
                                arrOfVals.push(values.body.franchise_levels[fran_key]);
                            } else {
                                arrOfVals = values.body.franchise_levels[fran_key];
                            }
                            //6 sep 
                            if (values.body.special_bonus_id_membership == '') {
                                values.body.special_bonus_id_membership = null;
                            }
                            delete values.body.id;

                            if (typeof values.body.is_business === 'undefined') {
                                values.body.user_busines_details = {is_active: 1};
                            }

                            if (typeof values.body.is_bank === 'undefined') {
                                values.body.user_bank_details = {is_active: 1};
                            }

                            //value.body.user_busines_details['business_name']='';
                            sequelize.models.Franchise.create(values.body, {include: [UserBankDetail, UserBusinesDetail]}).then(function (results) {
                                //6 sep
                                console.log('+++++++++++++++++++++++++++++');
                                console.log(arrOfVals);
                                async.forEachOf(arrOfVals, function (getData, key, callback) {
                                    console.log(getData);
                                    console.log('+++++++++++++++++++++++++++++');
                                    console.log(type_key);
                                    franchiseObj = {}

                                    franchiseObj.franchise_level = values.body.franchise_levels.franchise_level;
                                    franchiseObj[type_key] = getData;
                                    franchiseObj['user_id'] = results.id;

                                    if (type_key == 'state_id') {
                                        franchiseObj['country_id'] = values.body.franchise_levels.franchise_country_id;
                                        franchiseObj['parent_franchise'] = values.body.franchise_levels.parent_franchise;
                                    }

                                    if (type_key == 'division_id') {
                                        franchiseObj['country_id'] = values.body.franchise_levels.franchise_country_id;
                                        franchiseObj['state_id'] = values.body.franchise_levels.franchise_state_id;
                                        franchiseObj['parent_franchise'] = values.body.franchise_levels.parent_franchise;
                                    }


                                    if (type_key == 'district_id') {
                                        franchiseObj['country_id'] = values.body.franchise_levels.franchise_country_id;
                                        franchiseObj['state_id'] = values.body.franchise_levels.franchise_state_id;
                                        franchiseObj['division_id'] = values.body.franchise_levels.franchise_division_id;
                                        franchiseObj['parent_franchise'] = values.body.franchise_levels.parent_franchise;
                                    }

                                    if (type_key == 'tehsil_id') {
                                        console.log(values.body.franchise_levels.franchise_country_id)
                                        franchiseObj['country_id'] = values.body.franchise_levels.franchise_country_id;
                                        franchiseObj['state_id'] = values.body.franchise_levels.franchise_state_id;
                                        franchiseObj['division_id'] = values.body.franchise_levels.franchise_division_id;
                                        franchiseObj['district_id'] = values.body.franchise_levels.franchise_district_id;
                                        franchiseObj['parent_franchise'] = values.body.franchise_levels.parent_franchise;
                                    }

                                    console.log('franchiseObj....');
                                    console.log(franchiseObj);
                                    sequelize.models.Franchise.create(franchiseObj).then(function (results) {


                                        if (values.body.fr_id && values.body.fr_id != '') {
                                            sequelize.models.FranchiseRequest.update({status: 0}, {where: {id: values.body.fr_id}});
                                        }
                                        results = {};
                                        results.status = 1;
                                        res(results);
                                    }).catch(function (err) {
                                        console.log(err);
                                    });
                                });
                                //6 sep

                                results.status = 1;
                                res(results);
                            }).catch(function (err) {
                                console.log(err);
                                var errors = err;
                                errors.status = false;
                                res(errors);
                            });
                            //6 sep
                            if (values.body.fr_id && values.body.fr_id != '') {
                                sequelize.models.FranchiseRequest.update({status: 0}, {where: {id: values.body.fr_id}});
                            }
                            //6 sep
                        }

                    },

                    saveAllValuesForProf: function (values, res) {
                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                        id = values.body.id;
                        if (typeof id !== 'undefined' && id != '') {
                            delete values.body.id;
                            delete values.body.email;
                            delete values.body.mobile;

                            if (!values.body.password && !values.body.password_confirm) {
                                delete values.body.password;
                                delete values.body.password_confirm;
                            }

                            if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
                                values.body['is_active'] = 1
                            } else {
                                values.body['is_active'] = 0;
                            }

                            if (typeof values.body.trunover_base_deal !== 'undefined' && values.body.trunover_base_deal != '') {
                                values.body['trunover_base_deal'] = 1
                            } else {
                                values.body['trunover_base_deal'] = 0;
                            }

                            if (values.body.special_bonus_id_membership == '') {
                                values.body.special_bonus_id_membership = null;
                            }

                            myModel.update(values.body, {where: {id: id}}).then(function (results) {


                                if (typeof values.body.user_bank_details !== 'undefined') {
                                    sequelize.models.UserBankDetail.update(values.body.user_bank_details, {where: {user_id: id}});
                                }


                                if (typeof values.body.user_busines_details !== 'undefined') {
                                    sequelize.models.UserBusinesDetail.update(values.body.user_busines_details, {where: {user_id: id}});
                                }
                                results.status = 1;
                                res(results);
                            }).catch(function (err) {
                                console.log(err);
                            });
                        } else {

                            if (values.body.special_bonus_id_membership == '') {
                                values.body.special_bonus_id_membership = null;
                            }
                            delete values.body.id;

                            if (typeof values.body.is_business === 'undefined') {
                                values.body.user_busines_details = {is_active: 1};
                            }

                            if (typeof values.body.is_bank === 'undefined') {
                                values.body.user_bank_details = {is_active: 1};
                            }

                            //value.body.user_busines_details['business_name']='';
                            myModel.create(values.body, {include: [UserBankDetail, UserBusinesDetail]}).then(function (results) {
                                results.status = 1;
                                res(results);
                            }).catch(function (err) {
                                console.log(err);
                                var errors = err;
                                errors.status = false;
                                res(errors);
                            });
                        }
                    },
                    registration: function (values, res) {

                        var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                        var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})

                        myModel.create(values.body,
                                {
                                    include: [
                                        UserBankDetail,
                                        UserBusinesDetail,
                                    ]
                                }
                        ).then(function (results) {
                            results.status = 1;
                            res(results);
                        }).catch(function (err) {
                            console.log(err);
                            var errors = err;
                            errors.status = false;
//                    res(errors);
                        });
                    },
                    confirmOtp: function (values, res) {
                        var whr = {};
                        var whr1 = {};
                        var results = {};
                        whr[values.body.otpType] = values.body.otp;
                        whr.id = values.body.user_id;

                        if (values.body.otpType == 'otp_mobile') {
                            var message = 'mobile number';
                            var message1 = 'email address';
                            var firstField = 'otp_status_mobile';
                            var secondField = 'otp_status_email';
                        } else {
                            var message = 'email address';
                            var message1 = 'mobile address';
                            var firstField = 'otp_status_email';
                            var secondField = 'otp_status_mobile';
                        }

                        whr1[secondField] = 1;
                        whr1.id = values.body.user_id;

                        myModel.findOne({where: whr})
                                .then(function (users) {
                                    if (users) {
                                        var newData = {}
                                        newData[values.body.otpType] = '';
                                        newData[firstField] = 1;
                                        myModel.update(newData, {where: {id: values.body.user_id}}).then(function (results1) {

                                            console.log('updated');
                                            myModel.findOne({where: whr1})
                                                    .then(function (users1) {
                                                        if (users1) {
                                                            values.session.varifyOtp = 'yes'
                                                            results.status = true;
                                                            results.complete = true;
                                                            results.messages = 'Verification process completed successfully. please login to your account';
                                                            res(results);
//                                                    res.redirect('/');
                                                        } else {
                                                            results.status = true;
                                                            results.complete = false;
                                                            results.messages = 'Your ' + message + ' has been verified. Please verify your ' + message1 + ' and you can login';
                                                            res(results);
                                                        }

                                                    });
                                        });

                                    } else {
                                        results.status = false;
                                        results.messages = 'Invalid OTP';
                                        res(results);
                                    }

                                });

                    },
                    feesCalc: function (req, res) {

                        var Sequelize = require('sequelize');
                        var sequelize = require('../config/db');

                        // -------
                        var doc_value = req.agreement_value;
                        var doc_type = req.service_details_id;
                        var product_id = req.product_id;
                        var doc_name = req.doc_name;
                        var state = req.state;
                        var parent_arbitration_agreements_id = req.parent_arbitration_agreements_id;

                        var taxQuery = '';
                        //GST Logic --------------------------------------
                        if (state == 'rajasthan' || state == 'Rajasthan') {
                            taxQuery = " and tax_slug != 'igst' ";
                        } else {
                            taxQuery = " and tax_slug !='sgst' and tax_slug!='cgst' ";
                        }
                        //------------------------------------------------
                        services_query = '';
                        services_query += ' SELECT * FROM service_details where id=? and product_id=? ';

                        sequelize.query(services_query,
                                {replacements: [doc_type, product_id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (services_data) {


                            if (!services_data.length) {
                                res({status: false, msg: 'Service detail not found', data: []});
                                return false;
                            }


                            //--------
                            console.log("doc_name==========")
                            console.log(doc_name);
                            console.log("doc_name==========")

                            //Multiplier Check--------
                            if (req.app.locals.settingData.rent_commercial == doc_name) {
                                doc_value = parseFloat(doc_value) * parseFloat(req.app.locals.settingData.rent_commercial_value)
                            }


                            if (req.app.locals.settingData.rent_residential == doc_name) {
                                doc_value = parseFloat(doc_value) * parseFloat(req.app.locals.settingData.rent_residential_value)
                            }

                            //New Multipliers-----------------------------------
                            if (req.app.locals.settingData.lease_licence_commercial.trim() == doc_name.trim()) {
                                doc_value = parseFloat(doc_value) * parseFloat(req.app.locals.settingData.lease_licence_commercial_value)
                            }


                            if (req.app.locals.settingData.lease_licence_residentail == doc_name) {
                                doc_value = parseFloat(doc_value) * parseFloat(req.app.locals.settingData.lease_licence_residentail_value)
                            }


                            console.log("doc_value==========")
                            console.log(doc_value);
                            console.log("doc_value==========")

                            //----------------------------

                            var registration_fee = 0;
                            var arbitration_fee = 0;
                            var default_percentage_value = 0;
                            var slab_id = '';
                            services_discount_obj = {}
                            tax_dataObjMain = {};

                            // STEP 1 ---------------------------------------------------------------------------------------------------

                            var slab_query = '';

                            slab_query += ' SELECT * FROM slab where ? between min_value and max_value and is_active=1 order by min_value asc limit 1 '

                            sequelize.query(slab_query,
                                    {replacements: [doc_value], type: sequelize.QueryTypes.SELECT}
                            ).then(function (slab_data) {

                                if (!slab_data.length) {
                                    res({status: false, msg: 'No slab found', data: []});
                                } else {

                                    slab_obj = slab_data[0]
                                    console.log('________________8888888888');
                                    console.log(slab_obj);
                                    console.log('________________8888888888');

                                    slab_id = slab_obj['id'];
                                    registration_fee = slab_obj['registration_fee'];
                                    arbitration_fee = slab_obj['arbitration_fee'];
                                    default_percentage_value = slab_obj['default_percentage_value'];


                                    //new update logic 17 may
                                    //sum_registrationFee_arbitrationFee = parseFloat(registration_fee) + parseFloat(arbitration_fee);
                                    sum_registrationFee_arbitrationFee = parseFloat(arbitration_fee);

                                    var above_amount_is = 0;
                                    var above_amount_ext = 0;

                                    if (slab_obj['above_amount'] > 0) {
                                        var above_amount_is = parseFloat(doc_value) - parseFloat(slab_obj['above_amount']);
                                        var above_amount_ext = (above_amount_is * parseFloat(slab_obj['percentage_value'])) / 100
                                    }


                                    sum_registrationFee_arbitrationFee = above_amount_ext + sum_registrationFee_arbitrationFee;


                                    // Aceiling of-------------------------------

                                    if (slab_obj['aceiling_amount'] > 0 && sum_registrationFee_arbitrationFee > slab_obj['aceiling_amount']) {
                                        sum_registrationFee_arbitrationFee = slab_obj['aceiling_amount'];
                                    }

                                    //-------------------------------------------

                                    console.log('Aceiling of....');
                                    console.log(sum_registrationFee_arbitrationFee);


                                    default_amu = 0;

                                    if (slab_obj['default_percentage_value'] > 0) {
                                        default_amu = (sum_registrationFee_arbitrationFee * parseFloat(slab_obj['default_percentage_value'])) / 100
                                    }

                                    //New logic 17 may 2017 
                                    //sum_registrationFee_arbitrationFee = default_amu + sum_registrationFee_arbitrationFee;
                                    sum_registrationFee_arbitrationFee = default_amu + sum_registrationFee_arbitrationFee; //+ parseFloat(registration_fee);


                                    console.log('______________________________________________________________________________');
                                    console.log('Step 1 Extra Fee ' + above_amount_ext);
                                    console.log('Step 1 Default amu ' + default_amu);
                                    console.log('Step 1 Total Fees ' + sum_registrationFee_arbitrationFee);
                                    console.log('______________________________________________________________________________');



                                    // STEP 2 ------------------------------------------------------------------------------------

                                    slab_head_query = '';
                                    slab_head_query += ' SELECT  * FROM slab_heads s right join slab_head_fees s_fees '
                                    slab_head_query += ' on s.id=s_fees.slab_heads_id '
                                    slab_head_query += ' where s.slab_id=? and s.service_details_id=? and s.is_active=1 and s.product_id=? '

                                    sequelize.query(slab_head_query,
                                            {replacements: [slab_id, doc_type, product_id], type: sequelize.QueryTypes.SELECT}
                                    ).then(function (slab_head_data) {

                                        if (!slab_head_data.length) {
                                            res({status: false, msg: 'Slab heads not found', data: []});
                                            return false;
                                        }



                                        var slab_head_total = 0;
                                        async.each(slab_head_data, function (slab_head_data_rows, callback) {

                                            //0 is fixed / % 1

                                            if (slab_head_data_rows['fee_type'] == 0) {
                                                slab_head_total = parseFloat(slab_head_total) + parseFloat(slab_head_data_rows['amount']);
                                            } else {
                                                slab_head_total = parseFloat(slab_head_total) + (parseFloat(sum_registrationFee_arbitrationFee) * parseFloat(slab_head_data_rows['amount'])) / 100
                                            }

                                            callback();
                                        }, function (err) {
                                            console.log(err);
                                        });


                                        //Change of logic 17 may 2017 No need add Anx feee to final fee
                                        //sum_registrationFee_arbitrationFee_slabHead = slab_head_total + sum_registrationFee_arbitrationFee;
                                        sum_registrationFee_arbitrationFee_slabHead = slab_head_total;


                                        console.log('______________________________________________________________________________');
                                        console.log(sum_registrationFee_arbitrationFee,'--------------');

                                        console.log('Slab head total ' + slab_head_total);
                                        console.log('Slab head total+ Step 1 fess ' + sum_registrationFee_arbitrationFee_slabHead);
                                        console.log('______________________________________________________________________________');



                                        // STEP 3 ------------------------------------------------------------------------------------

                                        revised_fees_query = '';
                                        revised_fees_query += ' SELECT * FROM revised_fees where product_id=? and is_active=1 and curdate() between start_date and end_date ';
                                        sequelize.query(revised_fees_query,
                                                {replacements: [product_id], type: sequelize.QueryTypes.SELECT}
                                        ).then(function (revised_fees_data) {


                                            revised_fees_obj = revised_fees_data[0];

                                            //1-discount, 2- loading 
                                            if (revised_fees_data.length) {
                                                var revised_fees_amu = (parseFloat(sum_registrationFee_arbitrationFee_slabHead) * parseFloat(revised_fees_obj['revised_value'])) / 100;
                                            } else {
                                                var revised_fees_amu = 0;
                                            }

                                            if (revised_fees_data.length && revised_fees_obj['revised_type'] == 1) {

                                                sum_registrationFee_arbitrationFee_slabHead_revised = parseFloat(sum_registrationFee_arbitrationFee_slabHead) - parseFloat(revised_fees_amu);

                                            } else {
                                                sum_registrationFee_arbitrationFee_slabHead_revised = parseFloat(sum_registrationFee_arbitrationFee_slabHead) + parseFloat(revised_fees_amu);
                                            }


                                            console.log('______________________________________________________________________________');
                                            console.log('revised fee total ' + revised_fees_amu);
                                            console.log('revised total+ Step 1 +Step 2 fess ' + sum_registrationFee_arbitrationFee_slabHead_revised);
                                            console.log('______________________________________________________________________________');



                                            // STEP 4 ------------------------------------------------------------------------------------
                                            var services_discount = 0;
                                            var services_discount_per = 0;
                                            var renew_amu = 0;
                                            var renew_per = 0;
                                            var renew_amu_perYear = 0;
                                            var services_discount_yr1 = 0;
                                            services_discount_query = '';
                                            services_discount_query += ' SELECT * FROM service_detail_slabs where service_detail_id=? and slab_id=? ';
                                            sequelize.query(services_discount_query,
                                                    {replacements: [doc_type, slab_id], type: sequelize.QueryTypes.SELECT}
                                            ).then(function (services_discount_data) {

                                                if (!services_discount_data.length) {
                                                    res({status: false, msg: 'Service detail slabs not found', data: []});
                                                    return false;
                                                }








                                                if (req.is_renew && req.is_renew == 1 && services_data[0]['renew_percentage']) {
                                                    renew_per = services_data[0]['renew_percentage'];


                                                    renew_amu = (parseFloat(sum_registrationFee_arbitrationFee_slabHead_revised) * (parseFloat(services_data[0]['renew_percentage']))) / 100
                                                    //services_discount_yr1 = renew_amu;

                                                    sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount = sum_registrationFee_arbitrationFee_slabHead_revised - renew_amu;
                                                    sum_registrationFee_arbitrationFee_slabHead_revised_serviceNoDiscount = sum_registrationFee_arbitrationFee_slabHead_revised;

                                                } else {

                                                    services_discount_obj = services_discount_data[0];
                                                    //services_discount_obj['discount_to_consumer'];

                                                    services_discount_per = services_discount_obj['discount_to_consumer'];
                                                    services_discount = (parseFloat(sum_registrationFee_arbitrationFee_slabHead_revised) * parseFloat(services_discount_obj['discount_to_consumer'])) / 100
                                                    services_discount_yr1 = services_discount;
                                                    //#45 Card update
                                                    sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount = sum_registrationFee_arbitrationFee_slabHead_revised - services_discount;
                                                    sum_registrationFee_arbitrationFee_slabHead_revised_serviceNoDiscount = sum_registrationFee_arbitrationFee_slabHead_revised;


                                                }





                                                // STEP 5 ------------------------------------------------------------------------------------
                                                tax_query = '';
                                                tax_query += ' SELECT * FROM taxes where is_active=1 ' + taxQuery;
                                                tax_dataObj = {};
                                                tax_data_arr = [];
                                                sequelize.query(tax_query,
                                                        {replacements: [], type: sequelize.QueryTypes.SELECT}
                                                ).then(function (tax_data) {

                                                    var total_tax = 0;
                                                    var total_cess = 0;

                                                    async.each(tax_data, function (tax_data_rows, callback) {
                                                        tax_dataObj = {};
                                                        //1 - Tax, 2 - Cess 

                                                        if (tax_data_rows['tax_type'] == 1) {
                                                            tax_dataObj['tax_value'] = tax_data_rows['tax_value'];
                                                            tax_dataObj['tax_name'] = tax_data_rows['tax_name'];
                                                            tax_dataObj['tax_type'] = tax_data_rows['tax_type'];
                                                            tax_amount_var = (sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * parseFloat(tax_data_rows['tax_value'])) / 100

                                                            tax_dataObj['tax_amount'] = parseFloat(tax_amount_var).toFixed(2);

                                                            tax_data_arr.push(tax_dataObj);

                                                            total_tax = parseFloat(total_tax) + parseFloat(tax_data_rows['tax_value']);
                                                        } else {
                                                            total_cess = parseFloat(total_cess) + parseFloat(tax_data_rows['tax_value']);
                                                        }

                                                        callback();
                                                    }, function (err) {
                                                        console.log(err);
                                                    });

                                                    var total_tax_amu = 0;
                                                    var total_cess_amu = 0;

                                                    if (total_tax > 0) {
                                                        total_tax_amu = (sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * total_tax) / 100

                                                    }

                                                    if (total_cess > 0) {
                                                        //total_cess_amu = (total_tax_amu * total_cess) / 100
                                                        total_cess_amu = (sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * total_cess) / 100
                                                    }



                                                    async.each(tax_data, function (tax_data_rows, callback) {
                                                        tax_dataObj = {};
                                                        //1 - Tax, 2 - Cess 
                                                        //console.log('cess--------------------------------------');
                                                        if (tax_data_rows['tax_type'] == 1) {

                                                        } else {
                                                            //console.log('cess+++++++++++++++++++++++++')
                                                            tax_dataObj['tax_value'] = tax_data_rows['tax_value'];
                                                            tax_dataObj['tax_name'] = tax_data_rows['tax_name'];
                                                            tax_dataObj['tax_type'] = tax_data_rows['tax_type'];

                                                            //tax_amount_var = (total_tax_amu * parseFloat(tax_data_rows['tax_value'])) / 100
                                                            tax_amount_var = (sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * parseFloat(tax_data_rows['tax_value'])) / 100

                                                            tax_dataObj['tax_amount'] = parseFloat(tax_amount_var).toFixed(2);
                                                            tax_data_arr.push(tax_dataObj);
                                                        }

                                                        callback();
                                                    }, function (err) {
                                                        console.log(err);
                                                    });

                                                    tax_dataObjMain["1"] = tax_data_arr;


                                                    sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount_tax = sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount + total_tax_amu + total_cess_amu
                                                    year1_tax = total_tax_amu;
                                                    year1_cess = total_cess_amu;

                                                    console.log('______________________________________________________________________________');
                                                    console.log('tax total ' + total_tax_amu);
                                                    console.log('tax total ' + total_cess_amu);
                                                    console.log('tax+services discount+revised total+ Step 1 +Step 2 fess ' + sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount_tax);
                                                    console.log('______________________________________________________________________________');



                                                    year_fees_query = '';
                                                    year_fees_query += ' SELECT * FROM service_details sd left join service_detail_duration_wise_percentages sdp '
                                                    year_fees_query += ' on sd.id=sdp.service_detail_id '
                                                    year_fees_query += ' where sd.is_active=1 and sd.id=? ';

                                                    var fess_package = {}
                                                    sequelize.query(year_fees_query,
                                                            {replacements: [doc_type], type: sequelize.QueryTypes.SELECT}
                                                    ).then(function (year_fees_data) {

                                                        //fess_package['year'+]
                                                        var planArr = [];


                                                        console.log('Without Tax 1st yr' + sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount)


                                                        //Base Fee ----------------------------

                                                        base_fee_amount_yr1 = (sum_registrationFee_arbitrationFee_slabHead_revised_serviceNoDiscount * req.app.locals.settingData.basic_fee) / 100
                                                        console.log('1 yr fee without discout'.rainbow);
                                                        console.log(sum_registrationFee_arbitrationFee_slabHead_revised_serviceNoDiscount + '%' + req.app.locals.settingData.basic_fee + '=' + base_fee_amount_yr1);
                                                        year_fees_remain_yr1 = sum_registrationFee_arbitrationFee_slabHead_revised_serviceNoDiscount - base_fee_amount_yr1;
                                                        console.log('ye fee ' + year_fees_remain_yr1);
                                                        //-------------------------------------

                                                        // #45 update---------------------
                                                        //var evr_fees = sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount;
                                                        var evr_fees = sum_registrationFee_arbitrationFee_slabHead_revised;

                                                        async.each(year_fees_data, function (year_fees_data_rows, callback) {
                                                            var fess_package = {};
                                                            var yr_fees = 0;
                                                            year_fees_remain = 0;
                                                            base_fee_amount = 0;
                                                            services_discount = 0;
                                                            fees_without_discount = 0;
                                                            yr_fees_for_base = 0;

                                                            console.log('Year ' + year_fees_data_rows['no_of_year']);

                                                            //Update in Fee logic-----------Card #45
                                                            //yr_fees = evr_fees + ((sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * parseFloat(year_fees_data_rows['value_of_percentage'])) / 100);
                                                            yr_fees = evr_fees + ((sum_registrationFee_arbitrationFee_slabHead_revised * parseFloat(year_fees_data_rows['value_of_percentage'])) / 100);

                                                            console.log(year_fees_data_rows['no_of_year'] + ' yr fee without discout'.rainbow);
                                                            console.log(sum_registrationFee_arbitrationFee_slabHead_revised + '%' + year_fees_data_rows['value_of_percentage'] + ' = ' + yr_fees);
                                                            console.log(' --------------------'.rainbow);



                                                            //---------------------upadte 8 Sep 2017----------------------




                                                            if (req.is_renew && req.is_renew == 1) {


                                                                renew_amu_perYear = (parseFloat(yr_fees) * parseFloat(renew_per)) / 100;

                                                                fees_without_discount = yr_fees;
                                                                //Update #45
                                                                yr_fees_for_base = yr_fees;
                                                                yr_fees = yr_fees - renew_amu_perYear;


                                                            } else {

                                                                services_discount = (parseFloat(yr_fees) * parseFloat(services_discount_per)) / 100;

                                                                fees_without_discount = yr_fees;
                                                                //Update #45
                                                                yr_fees_for_base = yr_fees;
                                                                yr_fees = yr_fees - services_discount;

                                                            }







                                                            //---------------------------------------------------------

                                                            console.log(services_discount);
//                                                            fees_without_discount = yr_fees;
//                                                            //Update #45
//                                                            yr_fees_for_base = yr_fees;
//                                                            yr_fees = yr_fees - services_discount;

                                                            //evr_fees = yr_fees;


                                                            console.log(year_fees_data_rows['no_of_year'] + ' yr fee discout'.rainbow);
                                                            console.log(yr_fees);
                                                            console.log(yr_fees);
                                                            console.log(yr_fees);

                                                            console.log('fees ' + yr_fees);

                                                            if (total_tax > 0) {
                                                                total_tax_amu = (yr_fees * total_tax) / 100
                                                            }
                                                            console.log('tax ' + total_tax_amu);
                                                            if (total_cess > 0) {
                                                                //total_cess_amu = (total_tax_amu * total_cess) / 100
                                                                total_cess_amu = (yr_fees * total_cess) / 100
                                                            }
                                                            console.log('tax ' + total_cess_amu);
                                                            yr_fees_tax = yr_fees + total_tax_amu + total_cess_amu;



                                                            //Base Fee ----------------------------

                                                            base_fee_amount = (yr_fees_for_base * req.app.locals.settingData.basic_fee) / 100;


                                                            console.log(year_fees_data_rows['no_of_year'] + ' BASE FEE'.rainbow);
                                                            console.log(yr_fees_for_base + '%' + req.app.locals.settingData.basic_fee + ' = ' + base_fee_amount);
                                                            console.log(' --------------------'.rainbow);


                                                            year_fees_remain = yr_fees_for_base - base_fee_amount;
                                                            year_fees_remain = year_fees_remain / year_fees_data_rows['no_of_year'];

                                                            console.log(year_fees_data_rows['no_of_year'] + ' YEAR FEE'.rainbow);
                                                            console.log(year_fees_remain);
                                                            console.log(' --------------------'.rainbow);

                                                            //-------------------------------------


                                                            //Tax ever year ------------------
                                                            taxArrAll = [];
                                                            async.each(tax_data, function (tax_data_rows, callback) {
                                                                tax_dataObj = {};

                                                                //1 - Tax, 2 - Cess 

                                                                if (tax_data_rows['tax_type'] == 1) {
                                                                    tax_dataObj['tax_value'] = tax_data_rows['tax_value'];
                                                                    tax_dataObj['tax_name'] = tax_data_rows['tax_name'];
                                                                    tax_dataObj['tax_type'] = tax_data_rows['tax_type'];
                                                                    tax_amount_var = (yr_fees * parseFloat(tax_data_rows['tax_value'])) / 100

                                                                    tax_dataObj['tax_amount'] = parseFloat(tax_amount_var).toFixed(2);

                                                                    taxArrAll.push(tax_dataObj);

                                                                }

                                                                callback();
                                                            }, function (err) {
                                                                console.log(err);
                                                            });


                                                            async.each(tax_data, function (tax_data_rows, callback) {
                                                                tax_dataObj = {};
                                                                //1 - Tax, 2 - Cess 
                                                                //console.log('cess--------------------------------------');
                                                                if (tax_data_rows['tax_type'] == 1) {

                                                                } else {
                                                                    //console.log('cess+++++++++++++++++++++++++')
                                                                    tax_dataObj['tax_value'] = tax_data_rows['tax_value'];
                                                                    tax_dataObj['tax_name'] = tax_data_rows['tax_name'];
                                                                    tax_dataObj['tax_type'] = tax_data_rows['tax_type'];

                                                                    //tax_amount_var = (total_tax_amu * parseFloat(tax_data_rows['tax_value'])) / 100
                                                                    tax_amount_var = (yr_fees * parseFloat(tax_data_rows['tax_value'])) / 100
                                                                    tax_dataObj['tax_amount'] = parseFloat(tax_amount_var).toFixed(2);
                                                                    taxArrAll.push(tax_dataObj);
                                                                }

                                                                callback();
                                                            }, function (err) {
                                                                console.log(err);
                                                            });


                                                            tax_dataObjMain[year_fees_data_rows['no_of_year']] = taxArrAll;


                                                            //--------------------------------



                                                            console.log('total ' + yr_fees_tax);

                                                            console.log('----------------------------------------------------');


                                                            fess_package["fees_without_tax"] = parseFloat(yr_fees).toFixed(2);

                                                            //fess_package["fees_without_tax_discount"] = fees_without_discount;

                                                            fess_package["total_fees"] = parseFloat(yr_fees_tax).toFixed();
                                                            fess_package["year"] = year_fees_data_rows['no_of_year'];

                                                            fess_package["tax"] = parseFloat(total_tax_amu).toFixed(2);
                                                            fess_package["cess"] = parseFloat(total_cess_amu).toFixed(2);

                                                            fess_package["base_fee"] = parseFloat(base_fee_amount).toFixed(2);
                                                            fess_package["base_fee_per_year"] = (year_fees_remain).toFixed(2);


                                                            //Send Discount--------------------------------
                                                            fess_package["services_discount"] = services_discount;
                                                            fess_package["renew_discount"] = renew_amu_perYear;
                                                            fess_package["services_discount_per"] = services_discount_per;
                                                            fess_package["renew_discount_per"] = renew_per;
                                                            fess_package["total_discount"] = services_discount + renew_amu_perYear;
                                                            //---------------------------------------------


                                                            planArr.push(fess_package);

                                                            callback();
                                                        }, function (err) {
                                                            console.log(err);
                                                        });


                                                        var fess_package = {};
                                                        fess_package["total_fees"] = (sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount_tax).toFixed();
                                                        fess_package["year"] = 1;
                                                        fess_package["fees_without_tax"] = sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount;
                                                        fess_package["tax"] = year1_tax;
                                                        fess_package["cess"] = year1_cess;
                                                        fess_package["base_fee"] = parseFloat(base_fee_amount_yr1).toFixed(2);
                                                        fess_package["base_fee_per_year"] = (year_fees_remain_yr1).toFixed(2);

                                                        //Send Discount--------------------------------
                                                        fess_package["services_discount"] = services_discount_yr1;
                                                        fess_package["renew_discount"] = renew_amu;
                                                        fess_package["services_discount_per"] = services_discount_per;
                                                        fess_package["renew_discount_per"] = renew_per;
                                                        fess_package["total_discount"] = services_discount_yr1 + renew_amu;
                                                        //---------------------------------------------

                                                        planArr.unshift(fess_package);
                                                        //res.send(planArr);
                                                        finalObj = {};
                                                        finalObj['fees'] = planArr;
                                                        finalObj['tax_data'] = tax_dataObjMain//tax_data_arr;
                                                        //finalObj['data'] = services_discount_obj['0'];

                                                        //planArr.push(services_discount_obj);
                                                        slab_query = '';
                                                        slab_query += ' SELECT * FROM service_details where id=?  '

                                                        sequelize.query(slab_query,
                                                                {replacements: [doc_type], type: sequelize.QueryTypes.SELECT}
                                                        ).then(function (service_slab) {
                                                            finalObj['doc_data'] = Object.assign(services_discount_obj, service_slab[0]);
                                                            //res(finalObj);
                                                            res({status: true, msg: 'Done', data: finalObj});
                                                        });
                                                        //res({status: true, data: planArr});
                                                    });

                                                    //res.send({data: parseFloat(sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount_tax).toFixed(2)});

                                                });
                                            });
                                        });
                                    });


                                }



                            });
                        });
                    },
                    getProfessionalByMobile: function (req, res) {

                        var ex_query = '';
                        ex_query += ' select '
                        ex_query += ' u1.id id, u1.email email, u1.mobile mobile, uf1.franchise_id franchise_id, u1.tehsil_id tehsil_id, '
                        ex_query += ' u1.first_name first_name, u1.residence_address residence_address, '
                        ex_query += ' u2.email franchise_email, u2.is_admin_franchise is_admin_franchise, '
                        ex_query += ' u1.role_type_id role_type_id, u1_rl.role_type_slug role_type_slug, u1_rl.role_type_name role_type_name, '
                        ex_query += ' group_concat(u2_fl.tehsil_id) franchise_tehsils '
                        ex_query += ' from users u1 '
                        ex_query += ' left join user_franchises uf1 on uf1.user_id = u1.id '
                        ex_query += ' left join users u2 on uf1.franchise_id = u2.id '
                        ex_query += ' left join franchise_levels u2_fl on u2_fl.user_id = ? '
                        ex_query += ' left join role_types u1_rl on u1_rl.id = u1.role_type_id '
                        ex_query += ' where u1.mobile = ? and u1.is_active=1 '


                        sequelize.query(ex_query,
                                {replacements: [req.user.id, req.body.mobile], type: sequelize.QueryTypes.SELECT}
                        ).then(function (users) {
                            res(users);
                        })
                    },
                    getProfessionalByEmail: function (req, res) {

                        var ex_query = '';
                        ex_query += ' select '
                        ex_query += ' u1.id id, u1.email email, u1.mobile mobile, uf1.franchise_id franchise_id, u1.tehsil_id tehsil_id,u1.is_complete_registration is_complete_registration, '
                        ex_query += ' u1.first_name first_name, u1.residence_address residence_address, '
                        ex_query += ' u2.email franchise_email, u2.is_admin_franchise is_admin_franchise, '
                        ex_query += ' u1.role_type_id role_type_id, u1_rl.role_type_slug role_type_slug, u1_rl.role_type_name role_type_name, '
                        ex_query += ' group_concat(u2_fl.tehsil_id) franchise_tehsils '
                        ex_query += ' from users u1 '
                        ex_query += ' left join user_franchises uf1 on uf1.user_id = u1.id '
                        ex_query += ' left join users u2 on uf1.franchise_id = u2.id '
                        ex_query += ' left join franchise_levels u2_fl on u2_fl.user_id = ? '
                        ex_query += ' left join role_types u1_rl on u1_rl.id = u1.role_type_id '
                        ex_query += ' where u1.email = ? and u1.is_active=1 '


                        sequelize.query(ex_query,
                                {replacements: [req.user.id, req.body.mobile], type: sequelize.QueryTypes.SELECT}
                        ).then(function (users) {
                            res(users);
                        })
                    },
                    getDWByMobile: function (req, res) {

                        var ex_query = '';
                        ex_query += ' select  u1.id id, u1.email email, u1.mobile mobile, uf1.franchise_id franchise_id,  u1.tehsil_id tehsil_id, '
                        ex_query += ' u1.first_name first_name, u1.residence_address residence_address,  u1.role_type_id role_type_id, '
                        ex_query += ' u1_rl.role_type_slug role_type_slug, '
                        ex_query += ' group_concat(distinct u2_fl.tehsil_id) franchise_tehsils, '
                        ex_query += ' group_concat(distinct uf1.franchise_id) user_franchises '
                        ex_query += ' from users u1 '
                        ex_query += ' left join user_franchises uf1 on uf1.user_id = u1.id '
                        ex_query += ' left join role_types u1_rl on u1_rl.id = u1.role_type_id '
                        ex_query += ' left join franchise_levels u2_fl on u2_fl.user_id = ? '
                        ex_query += ' where u1.mobile = ? and u1_rl.role_type_slug = ? and u1.is_active=1 '



                        sequelize.query(ex_query,
                                {replacements: [req.user.id, req.body.mobile, "deed_writer"], type: sequelize.QueryTypes.SELECT}
                        ).then(function (users) {
                            res(users);
                        })
                    },
                    getDWByEmail: function (req, res) {

                        var ex_query = '';
                        ex_query += ' select  u1.id id, u1.email email, u1.mobile mobile, uf1.franchise_id franchise_id,  u1.tehsil_id tehsil_id,u1.is_complete_registration, '
                        ex_query += ' u1.first_name first_name, u1.residence_address residence_address,  u1.role_type_id role_type_id, '
                        ex_query += ' u1_rl.role_type_slug role_type_slug, '
                        ex_query += ' group_concat(distinct u2_fl.tehsil_id) franchise_tehsils, '
                        ex_query += ' group_concat(distinct uf1.franchise_id) user_franchises '
                        ex_query += ' from users u1 '
                        ex_query += ' left join user_franchises uf1 on uf1.user_id = u1.id '
                        ex_query += ' left join role_types u1_rl on u1_rl.id = u1.role_type_id '
                        ex_query += ' left join franchise_levels u2_fl on u2_fl.user_id = ? '
                        ex_query += ' where u1.email = ? and u1_rl.role_type_slug = ? and u1.is_active=1 '



                        sequelize.query(ex_query,
                                {replacements: [req.user.id, req.body.mobile, "deed_writer"], type: sequelize.QueryTypes.SELECT}
                        ).then(function (users) {
                            res(users);
                        })
                    },
                    update_credits: function (values, res) {
                        myModel.update(values.body, {
                            where: values.where
                        }).then(function (results) {
                            var results = {}
                            results.status = 1;
                            res(results);
                        });
                    },
                    getFirstValues: function (req, res) {
                        myModel.findOne({where: req.where}).then(function (results) {
                            res(results);
                        });
                    },
                    updatePassword: function (values, res) {
                        myModel.update(values.update, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                    updateValues: function (values, res) {
                        console.log("pppppppppppppppppppppppppppp")
                        console.log(values.update)
                        console.log(values.where)
                        myModel.update(values.update, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                    get_an1_fee: function (req, res) {

                        var doc_value = req.params.value;
                        var doc_name = req.params.doc_name;




                        //--------
                        console.log("doc_name==========*****************************************************************")
                        console.log(doc_name);
                        console.log("doc_name==========")

                        //Multiplier Check--------
                        if (req.app.locals.settingData.rent_commercial == doc_name) {
                            doc_value = parseFloat(doc_value) * parseFloat(req.app.locals.settingData.rent_commercial_value)
                        }


                        if (req.app.locals.settingData.rent_residential == doc_name) {
                            doc_value = parseFloat(doc_value) * parseFloat(req.app.locals.settingData.rent_residential_value)
                        }

                        //New Multipliers-----------------------------------
                        //if (req.app.locals.settingData.lease_licence_commercial == doc_name) {
                        if (req.app.locals.settingData.lease_licence_commercial.trim()==doc_name.trim()) {    
                            doc_value = parseFloat(doc_value) * parseFloat(req.app.locals.settingData.lease_licence_commercial_value)
                        }




                        if (req.app.locals.settingData.lease_licence_residentail == doc_name) {
                            doc_value = parseFloat(doc_value) * parseFloat(req.app.locals.settingData.lease_licence_residentail_value)
                        }


                        console.log("new doc value==========")
                        console.log(doc_value);
                        console.log("new doc value==========")


                        var slab_query = '';
                        slab_query += ' SELECT * FROM slab where ? between min_value and max_value and is_active=1 order by min_value asc limit 1 '

                        sequelize.query(slab_query,
                                {replacements: [doc_value], type: sequelize.QueryTypes.SELECT}
                        ).then(function (slab_data) {
                            if (!slab_data.length) {
                                res({status: false, msg: 'No slab found', data: []});
                            } else {
                                slab_obj = slab_data[0]

                                console.log('________________8888888888');
                                console.log(slab_obj);
                                console.log('________________8888888888');


                                slab_id = slab_obj['id'];
                                registration_fee = slab_obj['registration_fee'];
                                arbitration_fee = slab_obj['arbitration_fee'];
                                default_percentage_value = slab_obj['default_percentage_value'];

                                // console.log("--------- Registration Fee : "+registration_fee)
                                // console.log("--------- Arbitration Fee : "+arbitration_fee)

                                //new update logic 17 may
                                //sum_registrationFee_arbitrationFee = parseFloat(registration_fee) + parseFloat(arbitration_fee);
                                sum_registrationFee_arbitrationFee = parseFloat(arbitration_fee);

                                var above_amount_is = 0;
                                var above_amount_ext = 0;

                                if (slab_obj['above_amount'] > 0) {
                                    var above_amount_is = parseFloat(doc_value) - parseFloat(slab_obj['above_amount']);
                                    var above_amount_ext = (above_amount_is * parseFloat(slab_obj['percentage_value'])) / 100
                                }

                                sum_registrationFee_arbitrationFee = above_amount_ext + sum_registrationFee_arbitrationFee;

                                if (slab_obj['aceiling_amount'] > 0 && sum_registrationFee_arbitrationFee > slab_obj['aceiling_amount']) {
                                    sum_registrationFee_arbitrationFee = slab_obj['aceiling_amount'];
                                }

                                console.log('Aceiling of....');
                                console.log(sum_registrationFee_arbitrationFee);

                                default_amu = 0;

                                if (slab_obj['default_percentage_value'] > 0) {
                                    default_amu = (sum_registrationFee_arbitrationFee * parseFloat(slab_obj['default_percentage_value'])) / 100
                                }

                                //New logic 17 may 2017 
                                //sum_registrationFee_arbitrationFee = default_amu + sum_registrationFee_arbitrationFee;
                                sum_registrationFee_arbitrationFee = default_amu + sum_registrationFee_arbitrationFee; //+ parseFloat(registration_fee);

                                var ttt = sum_registrationFee_arbitrationFee;

                                console.log('______________________________________________________________________________');
                                console.log('Step 1 Extra Fee ' + above_amount_ext);
                                console.log('Step 1 Default amu ' + default_amu);
                                console.log('Step 1 Total Fees ' + sum_registrationFee_arbitrationFee);
                                console.log('______________________________________________________________________________');

                                sum_registrationFee_arbitrationFee = sum_registrationFee_arbitrationFee + registration_fee

                                // STEP 5 ------------------------------------------------------------------------------------
                                var taxQuery = " and tax_slug !='sgst' and tax_slug!='cgst' ";

                                tax_query = '';
                                tax_query += ' SELECT sum(tax_value) tax_val FROM taxes where is_active=1 ' + taxQuery;
                                tax_dataObj = {};
                                tax_data_arr = [];
                                var total_tax = 0;
                                sequelize.query(tax_query,
                                        {replacements: [], type: sequelize.QueryTypes.SELECT}
                                ).then(function (tax_data) {

                                    total_tax = (parseFloat(sum_registrationFee_arbitrationFee) * parseFloat(tax_data[0]['tax_val'])) / 100
                                    console.log(total_tax);

                                    final_fee = total_tax + sum_registrationFee_arbitrationFee;
                                    console.log("final_fee: " + final_fee)

                                    var resData = {status: 1, reg_fee: registration_fee, tot_fee: final_fee, arb_fee: arbitration_fee, t_p_amt: total_tax, t_a_fs: ttt}
                                    res(resData);
                                })

                            }
                        })
                    },
                    verify_doc: function (req, res) {

                        var query = '';
                        query += ' select * from ';
                        if (req.body.doc_type == 1) {
                            query += ' arbitration_agreements ar left join arbitration_agreement_fees arf on arf.arbitration_agreements_id = ar.id ';
                        }
                        if (req.body.doc_type == 3) {
                            query += ' membership_plan_issues mp '
                        }

                        query += ' where ';
                        query += (req.body.doc_type == 1) ? ' ar.ar_id = ? ' : ' mp.ms_id = ? ';
                        // query += '';
                        // query += '';
                        // query += '';





                        if (req.body.doc_type == 4) {
                            var query = '';
                            query += ' select * from (select "n" type,invoice_no,ar.added_date created_on,ar.id number,nc_start_date val_from,nc_end_date val_to,service_details_id doc_category,service_detail_documents_id doc_type,"" selected_plan_year from ';
                            query += ' arbitration_agreements ar left join arbitration_agreement_fees arf on arf.arbitration_agreements_id = ar.id ';
                            query += ' union '
                            query += ' select "m" type,invoice_no,add_date created_on,id number,selected_plan_year val_from,selected_plan_year val_to,"" doc_category,"" doc_type,selected_plan_year selected_plan_year from membership_plan_issues mp '
                            query += ' ) tab where tab.invoice_no=? '
                        }




                        sequelize.query(query,
                                {replacements: [req.body.doc_num], type: sequelize.QueryTypes.SELECT}
                        ).then(function (query_data) {
                            res(query_data)
                        })
                    },
                    get_exemption_fee: function (req, res) {

                        var doc_value = req.body.doc_value;
                        var slab_query = '';
                        var results = {};
                        slab_query += ' SELECT * FROM slab where ? between min_value and max_value and is_active=1 order by min_value asc limit 1 '

                        sequelize.query(slab_query,
                                {replacements: [doc_value], type: sequelize.QueryTypes.SELECT}
                        ).then(function (slab_data) {
                            if (!slab_data.length) {
                                res({status: false, msg: 'No slab found', data: []});
                            } else {
                                slab_obj = slab_data[0]

                                console.log('________________Slab_object');
                                console.log(slab_obj);
                                console.log('________________Slab_object');


                                slab_id = slab_obj['id'];
                                registration_fee = slab_obj['registration_fee'];
                                arbitration_fee = slab_obj['arbitration_fee'];
                                default_percentage_value = slab_obj['default_percentage_value'];

                                console.log('arbitration_fee')
                                console.log(arbitration_fee)
                                sum_registrationFee_arbitrationFee = parseFloat(arbitration_fee);

                                var above_amount_is = 0;
                                var above_amount_ext = 0;

                                if (slab_obj['above_amount'] > 0) {
                                    var above_amount_is = parseFloat(doc_value) - parseFloat(slab_obj['above_amount']);
                                    var above_amount_ext = (above_amount_is * parseFloat(slab_obj['percentage_value'])) / 100
                                }

                                sum_registrationFee_arbitrationFee = above_amount_ext + sum_registrationFee_arbitrationFee;

                                if (slab_obj['aceiling_amount'] > 0 && sum_registrationFee_arbitrationFee > slab_obj['aceiling_amount']) {
                                    sum_registrationFee_arbitrationFee = slab_obj['aceiling_amount'];
                                }

                                console.log('Aceiling of....');
                                console.log(sum_registrationFee_arbitrationFee);

                                default_amu = 0;

                                if (slab_obj['default_percentage_value'] > 0) {
                                    default_amu = (sum_registrationFee_arbitrationFee * parseFloat(slab_obj['default_percentage_value'])) / 100
                                }

                                //New logic 17 may 2017 
                                //sum_registrationFee_arbitrationFee = default_amu + sum_registrationFee_arbitrationFee;
                                sum_registrationFee_arbitrationFee = default_amu + sum_registrationFee_arbitrationFee; //+ parseFloat(registration_fee);


                                //Now Add registration Fee
                                var sum_registrationFee_arbitrationFee = sum_registrationFee_arbitrationFee + registration_fee;
                                results.arbitrationFee = sum_registrationFee_arbitrationFee;

                                exe_query = '';
                                exe_query += ' SELECT percentage,min_value FROM membership_exemptions where slab_id=? ';
                                tax_dataObj = {};
                                tax_data_arr = [];
                                var total_tax = 0;
                                sequelize.query(exe_query,
                                        {replacements: [slab_id], type: sequelize.QueryTypes.SELECT}
                                ).then(function (exe_data) {

                                    if (!exe_data.length) {
                                        res({status: false, msg: 'No slab found', data: []});
                                    } else {
                                        var total_exe = (parseFloat(sum_registrationFee_arbitrationFee) * parseFloat(exe_data[0]['percentage'])) / 100
                                        console.log('total_exe');
                                        console.log(total_exe);

                                        if (exe_data[0]['min_value'] > total_exe) {
                                            total_exe = exe_data[0]['min_value'];
                                        }
                                        console.log("total_exe: " + total_exe)

                                        //total_exe1 = currentValueWithRegistrationFee-total_exe;
                                        results.total_exe = total_exe;
                                        results.percentage = exe_data[0]['percentage'];

                                        var resData = {status: 1, results: results}
                                        res(resData);
                                    }
                                })
//                                var final_fee = 
//                                var resData = {status: 1, tot_fee: final_fee}
//                                res(resData);

                            }
                        })
                    },
                    xlsUpload: function (req, res) {
                        var current = this;
                        var workbook = XLSX.readFile(req.body.file_path + '/' + req.files[0].filename);

                        var sheet_name_list = workbook.SheetNames;
                        var validationArr = {};
                        var StampNumberArr = ["Name", "Email", "Mobile"];
                        var StampNumber = 'Name', IssueDate = 'Email', IssueTo = 'Mobile';
                        validationArr[StampNumber] = {'empty': 1, 'uniqe': 0, 'duplicate': 0, 'is_number_format': 0, 'ColumnName': 'first_name'};
                        validationArr[IssueDate] = {'empty': 1, 'uniqe': 1, 'duplicate': 1, 'is_number_format': 0, 'ColumnName': 'email'};
                        validationArr[IssueTo] = {'empty': 1, 'uniqe': 1, 'duplicate': 1, 'is_number_format': 1, 'ColumnName': 'mobile'};

                        //console.log(req.body);

                        var worksheet = workbook.Sheets[sheet_name_list];
                        var DataValues = [];
                        var DataSave = [];
                        var DataSave1 = {};
                        var UniqeNameArray = [];
                        var UniqeAliasArray = [];
                        var DuplicateNameArray = [];
                        var DuplicateAliasArray = [];
                        var isValidFile = true;
                        var CommissionDistributionDataToBeSaved = [];

                        var UniqeEmailArray = [];
                        var UniqeMobileArray = [];
                        var DuplicateEmailArray = [];
                        var DuplicateMobileArray = [];

                        try {
                            workbook.SheetNames.forEach(function (sheetName) {
                                // Get headers.
                                var headers = [];
                                var sheet = workbook.Sheets[sheetName];
                                var range = XLSX.utils.decode_range(sheet['!ref']);
                                var C, R = range.s.r;

                                /* start in the first row */
                                /* walk every column in the range */
                                for (C = range.s.c; C <= range.e.c; ++C) {
                                    var cell = sheet[XLSX.utils.encode_cell({c: C, r: R})];
                                    /* find the cell in the first row */

                                    var hdr = "UNKNOWN " + C; // <-- replace with your desired default
                                    if (cell && cell.t) {
                                        hdr = XLSX.utils.format_cell(cell);
                                    }
                                    headers.push(hdr);
                                }
                                console.log("---------------------------------  headers start-------------------->>>>>>>>>>>>>>>>>>>")
                                console.log(headers);
                                console.log("<<<<<<<<<<<---------------------------- headers ends ----------------------------------")

                                //For check the heading string 
                                Array.prototype.diff = function (a) {
                                    return this.filter(function (i) {
                                        return a.indexOf(i) < 0;
                                    });
                                };
                                var differ = StampNumberArr.diff(headers)

                                //console.log("========================= DIFFERENCE ============================================")
                                if (differ.length > 0) {
                                    // console.log("There is a difference")
                                    // var resp = { status: false, err: "Invalid file"}
                                    isValidFile = false
                                    //res(resp);
                                } else {
                                    // console.log("Both are same")
                                    // For each sheets, convert to json.
                                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                                    //console.log(roa)
                                    if (roa.length > 0) {
                                        var countRow = 2;
                                        roa.forEach(function (row, index) {
                                            // Set empty cell to ''.

                                            //DataSave[index] = {};
                                            var DataSave1 = {};
                                            var innerCounter = 1;
                                            headers.forEach(function (hd) {
                                                if (innerCounter <= 3) {
                                                    // console.log("==================== inside loop =====================>>>>>>>")
                                                    // console.log(validationArr[hd], hd);
                                                    if (validationArr[hd]['empty'] == 1 && (row[hd] == '' || typeof row[hd] == 'undefined')) {
                                                        console.log("------ in empty case ==============" + row[hd])
                                                        DataValues.push({status: false, errors: hd + ' should not empty in row ' + countRow});
                                                    }

                                                    if (validationArr[hd]['uniqe'] == 1 && hd == IssueDate) {
                                                        UniqeEmailArray.push(row[hd]);
                                                    }
                                                    if (validationArr[hd]['uniqe'] == 1 && hd == IssueTo) {
                                                        UniqeMobileArray.push(row[hd]);
                                                    }

                                                    if (validationArr[hd]['duplicate'] == 1 && hd == IssueDate) {
                                                        if (DuplicateEmailArray.indexOf(row[hd]) >= 0)
                                                        {
                                                            DataValues.push({status: false, errors: hd + ' duplicate value in row ' + countRow});
                                                        }
                                                        DuplicateEmailArray.push(row[hd]);
                                                    }

                                                    if (validationArr[hd]['duplicate'] == 1 && hd == IssueTo) {
                                                        if (DuplicateMobileArray.indexOf(row[hd]) >= 0)
                                                        {
                                                            DataValues.push({status: false, errors: hd + ' duplicate value in row ' + countRow});
                                                        }
                                                        DuplicateMobileArray.push(row[hd]);
                                                    }

                                                    if (validationArr[hd]['is_number_format'] == 1 && hd == IssueTo) {
                                                        console.log("------------>>>>>>>> row[hd] >>>>>" + row[hd])
                                                        if (isNaN(row[hd])) {
                                                            DataValues.push({status: false, errors: hd + ' should be in digits in row ' + countRow});
                                                        } else if (row[hd].length != 10) {
                                                            DataValues.push({status: false, errors: hd + ' must be of 10 digits in row ' + countRow});
                                                        }
                                                        // if (DuplicateMobileArray.indexOf(row[hd]) >= 0)
                                                        // {
                                                        //     DataValues.push({status: false, errors: hd + ' should be in digits in row ' + countRow});
                                                        // }
                                                        //DuplicateMobileArray.push(row[hd]);
                                                    }

                                                    DataSave1[validationArr[hd]['ColumnName']] = row[hd];
                                                    DataSave[index] = DataSave1;
                                                    DataSave1['role_type_id'] = req.body.xls_role_type_id;
                                                    DataSave1['password'] = Math.floor((Math.random() * 100000000));
                                                    innerCounter++
                                                }
                                            });
                                            DataSave[index] = DataSave1;
                                            countRow++;
                                        });
                                    }
                                }
                                //console.log("========================= DIFFERENCE ============================================")

                            });


                            console.log("-------------->>  Here is the values  <<----------------------------")
                            console.log(DataValues)

                            if (isValidFile) {
                                console.log("------------------- hertttttttttttttttttttt ------------------------------------------------------------->>>>>>>>")
                                console.log(DataSave)
                                console.log("------------------- hertttttttttttttt  ends ------------------------------------------------------------->>>>>>>>")
                                if (DataValues.length < 1) {

                                    var objCount = Object.keys(UniqeNameArray).length;
                                    console.log("--------------------- UniqeEmailArray UniqeMobileArray <<<<<<<<<<<<---------------------------")
                                    console.log(UniqeEmailArray);
                                    console.log(UniqeMobileArray);

                                    async.parallel([
                                        function (callback_main_1) {
                                            async.eachOfSeries(UniqeEmailArray, function (email, key, callback_main_11) {
                                                var isWhere = {};
                                                isWhere[validationArr[IssueDate]['ColumnName']] = email;
                                                myModel.findAll({
                                                    where: isWhere
                                                }).then(function (get_data) {
                                                    if (get_data.length > 0) {
                                                        console.log("---------------- if data finds by the query [EMAIL] <<<<<<<------------------")
                                                        DataValues.push({status: false, errors: IssueDate + ' ' + email + ' already exist in database'});
                                                    }
                                                    callback_main_11();
                                                })
                                            }, function (err_callback_main_11) {
                                                callback_main_1(null, err_callback_main_11);
                                            });
                                        },
                                        function (callback_main_2) {
                                            async.eachOfSeries(UniqeMobileArray, function (mobile, key, callback_main_22) {
                                                var isWhere = {};
                                                isWhere[validationArr[IssueTo]['ColumnName']] = mobile;
                                                myModel.findAll({
                                                    where: isWhere
                                                }).then(function (get_data) {
                                                    if (get_data.length > 0) {
                                                        console.log("---------------- if data finds by the query [MOBILE] <<<<<<<------------------")
                                                        DataValues.push({status: false, errors: IssueTo + ' ' + mobile + ' already exist in database'});
                                                    }
                                                    callback_main_22();
                                                })
                                            }, function (err_callback_main_22) {
                                                callback_main_2(null, err_callback_main_22);
                                            })
                                        }
                                    ], function (err111) {
                                        // console.log("------------- Final Errors <<<<<<<----------------------------------------")
                                        // console.log(DataValues)
                                        // console.log(err111)
                                        if (DataValues.length < 1) {
                                            console.log("--------===============    Finalll Data To Save    ================---------------")
                                            console.log(DataSave)

                                            var resp = {status: true, data_to_be_saved: DataSave}
                                            res(resp);
                                        } else {
                                            console.log("------------- Final Errors <<<<<<<----------------------------------------")
                                            console.log(DataValues)
                                            var resp = {status: false, err: DataValues}
                                            res(resp);
                                        }
                                    });

                                    // var counting = 0;
                                    // async.eachSeries(UniqeNameArray, function (names, callback) {
                                    //     var isWhere = {};
                                    //     isWhere[validationArr[StampNumber]['ColumnName']] = names;
                                    //     myModel.findAll({
                                    //         where: isWhere
                                    //     }).then(function (data) {
                                    //         if (data != '') {
                                    //             console.log("iffffffffffffffffffffffffffffffffffffff")
                                    //             DataValues.push({status: false, errors: StampNumber + ' ' + names + ' already exist'});
                                    //             counting++;
                                    //             callback();
                                    //         } else {
                                    //             console.log("elseseeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                                    //             counting++;
                                    //             callback();
                                    //             // req.body.stamp_no = names;
                                    //             // myModel.vaildStamp(req, function(checkIsValidStamp) {
                                    //             //     console.log("***********************")
                                    //             //     console.log(checkIsValidStamp)
                                    //             //     if (checkIsValidStamp.status) {
                                    //             //         DataSave[counting]["penalty"] = checkIsValidStamp.penalty;
                                    //             //         //DataSave[counting]["results"] = checkIsValidStamp;
                                    //             //         CommissionDistributionDataToBeSaved.push(checkIsValidStamp)
                                    //             //     } else {
                                    //             //         DataValues.push({status: false, errors: 'Valid period is expired for '+ StampNumber + ' ' + names});
                                    //             //     }
                                    //             //     counting++;
                                    //             //     callback();
                                    //             // })
                                    //         }
                                    //     });
                                    // }, function (err) {
                                    //     if (DataValues.length < 1) {
                                    //         console.log("--------===============    Finalll Data To Save    ================---------------")
                                    //         console.log(DataSave)

                                    //         // myModel.bulkCreate(DataSave).then(function (data) {
                                    //         //     if(CommissionDistributionDataToBeSaved.length > 0) {
                                    //         //         async.forEach(CommissionDistributionDataToBeSaved, function (iterationValues, iterationCallback) {
                                    //         //             sequelize.models.CommissionDistribution.update({user_id: req.user.id}, {where: {arbitration_agreements_id: iterationValues.ar_id, paid: 0}}).then(function (resultss) {
                                    //         //                 iterationCallback();
                                    //         //             });
                                    //         //         }, function (errr) {
                                    //         //             if(errr) {
                                    //         //                 var resp = { status: false, err: []}    
                                    //         //             } else {
                                    //         //                 var resp = { status: true, err: []}    
                                    //         //             }
                                    //         //             res(resp);
                                    //         //         });  
                                    //         //     } else {
                                    //         //         var resp = { status: true, err: []}
                                    //         //         res(resp);
                                    //         //     }
                                    //         // }).catch(function (err) {
                                    //         //     var errors = err.errors;
                                    //         //     var resp = { status: false, err: errors}
                                    //         //     res(resp);
                                    //         // });
                                    //     } else {
                                    //         var resp = { status: false, err: DataValues}
                                    //         res(resp);
                                    //     }
                                    // });
                                } else {
                                    var resp = {status: false, err: DataValues}
                                    res(resp);
                                }
                            } else {
                                var errrr = {
                                    errors: "invalid file"
                                }
                                var resp = {status: false, err: "Invalid file", isFileValid: false}
                                res(resp);
                            }
                        } catch (catErr) {
                            console.log("---------------- catch error ---------------------------------------->")
                            console.log(catErr.message)
                            var errrr = {
                                errors: "invalid file"
                            }
                            var resp = {status: false, err: "Invalid file", isFileValid: false}
                            res(resp);

                        }
                    },
                    getAllValuesSendMail: function (req, res) {
                        //var UserRole = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_role'})
                        var UserRoleType = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_role_type'})
                        var UserRole = sequelize.models.RoleType.belongsTo(sequelize.models.Role, {foreignKey: 'role_id', as: 'user_role'})
                        var UserState = myModel.belongsTo(sequelize.models.State, {foreignKey: 'state_id', as: 'user_state'})
                        var UserDivision = myModel.belongsTo(sequelize.models.Division, {foreignKey: 'division_id', as: 'user_division'})
                        var UserDistrict = myModel.belongsTo(sequelize.models.District, {foreignKey: 'district_id', as: 'user_district'})
                        var UserTehsil = myModel.belongsTo(sequelize.models.Tehsil, {foreignKey: 'tehsil_id', as: 'user_tehsil'})

                        var get_query_role_id = req.query.role_id ? req.query.role_id : "";
                        var get_query_role_type_id = req.query.role_type_id ? req.query.role_type_id : "";

                        var base_cond = {role_slug: {$ne: "super_admin"}}

                        var role_conditions = {
                            association: UserRoleType,
                            include: [{
                                    association: UserRole,
                                    where: {role_slug: {$ne: "super_admin"}}
                                }]
                        }

                        if (get_query_role_id != "") {
                            role_conditions.include[0].where = {
                                id: get_query_role_id
                            }
                        }
                        if (get_query_role_type_id != "") {
                            role_conditions.where = {
                                id: get_query_role_type_id
                            }
                        }

                        console.log("----------------------->>>>>>>> New role condition ------------------>>>>>>>>>>")
                        console.log(role_conditions)

                        myModel.findAll({
                            where: req.where,
                            order: "id asc",
                            include: [
                                role_conditions,
                                UserState,
                                UserDivision,
                                UserDistrict,
                                UserTehsil
                            ]
                        }).then(function (results) {
                            res(results);
                        });
                    },
                },
                hooks: {
                    beforeCreate: function (values, options) {
                        if (typeof values.is_active === 'undefined') {
                            values.is_active = 0;
                        }
                    },
                    afterCreate: function (values, options) {

                    //console.log(values);  
                    var arrNotGive=['1','2','3','5','6','7','22','23','24','25','26']; 

                    if(arrNotGive.indexOf(values.role_type_id) == -1){


                    var query=" SELECT id  FROM special_bonus where product_id in (1) and is_default=1 limit 1 ";

                    sequelize.query(query,
                                {replacements: [], type: sequelize.QueryTypes.SELECT}
                        ).then(function (query_data) {

                            if(query_data.length){
                            myModel.update({special_bonus_id:query_data[0]['id']},{where:{id:values.id}});
                            }

                    });


                    var query2=" SELECT id  FROM special_bonus where product_id in (3) and is_default=1 limit 1 ";

                    sequelize.query(query2,
                                {replacements: [], type: sequelize.QueryTypes.SELECT}
                        ).then(function (query_data2) {

                            if(query_data2.length){
                            myModel.update({special_bonus_id_membership:query_data2[0]['id']},{where:{id:values.id}});
                            }

                    });

                    }    




                    if(values.role_type_id==2){


                     var query=" SELECT id  FROM special_bonus where product_id in (4) and is_default=1 and product_type_id=1 limit 1 ";

                    sequelize.query(query,
                                {replacements: [], type: sequelize.QueryTypes.SELECT}
                        ).then(function (query_data) {

                            if(query_data.length){
                            myModel.update({special_bonus_id:query_data[0]['id']},{where:{id:values.id}});
                            }

                    });


                    var query2=" SELECT id  FROM special_bonus where product_id in (4) and is_default=1 and product_type_id=3 limit 1 ";

                    sequelize.query(query2,
                                {replacements: [], type: sequelize.QueryTypes.SELECT}
                        ).then(function (query_data2) {

                            if(query_data2.length){
                            myModel.update({special_bonus_id_membership:query_data2[0]['id']},{where:{id:values.id}});
                            }

                    });   






                    }



                    //myModel.update({special_bonus_id:1,special_bonus_id_membership:1},{where:{id:values.id}});
                        
                    },
                    afterValidate: function (values, options) {
                        values.password = bcrypt.hashSync(values.password, null, null);
                    }
                }

            }

    );
    return myModel;
};
//module.exports.login = function (sequelize, DataTypes) {
//    console.log('module.exports.login');
//};
