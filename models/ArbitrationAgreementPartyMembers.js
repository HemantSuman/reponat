//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");
var pan = require("../middlewares/pan");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("ArbitrationAgreementPartyMembers",
            {
                arbitration_agreements_id: {
                    type: DataTypes.INTEGER,
                },
                arbitration_agreement_party_number: {
                    type: DataTypes.INTEGER,
                },
                member_no: {
                    type: DataTypes.INTEGER,
                },
                user_type: {
                    type: DataTypes.STRING,
                },
//                role_id: {
//                    type: DataTypes.INTEGER,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        }
//                    }
//                },
                member_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                member_email: {
                    type: DataTypes.STRING,
                    validate: {
                        isEmailValid: function (val) {
                            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            if (val.length != 0 && !re.test(val)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Email'))
                            }
                        },
//                        isEmail: {
//                            msg: i18n_Validation.__('Please_Enter', 'valid email')
//                        },
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        }
                    }
                },
                member_mobile_number: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    isUnique: true,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        len: {
                            args: [10, 10],
                            msg: i18n_Validation.__('Please_Enter', '10 digit')
                        },
                        isNumeric: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
//                        isUnique: sequelize.validateIsUnique('member_mobile_number', i18n_Validation.__('Already_exist', 'Mobile No'))
                    }
                },
                member_address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                member_country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                member_town: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                member_state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                member_division_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                member_district_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                member_tehsil_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                member_block_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                member_pincode: {
                    type: DataTypes.INTEGER,
                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
                    }
                },
                member_country_primary_id: {
                    type: DataTypes.INTEGER,
                },
                member_state_primary_id: {
                    type: DataTypes.INTEGER,
                },
                member_division_primary_id: {
                    type: DataTypes.INTEGER,
                },
                member_district_primary_id: {
                    type: DataTypes.INTEGER,
                },
                member_tehsil_primary_id: {
                    type: DataTypes.INTEGER,
                },
                govt_id_type: {
                    type: DataTypes.STRING,
                    validate: {
                        isGovNumberEntered: function(val) {
                            if(this.govt_id_number != "" && val == "") {
                                throw new Error(i18n_Validation.__('required'))
                            }
                        }
                    }
                },
                govt_id_number: {
                    type: DataTypes.STRING,
                    validate: {
//                        isPanCardValid:pan(this.govt_id_number, '345345')
                        isPanCardValid: function (val) {
                            if (this.govt_id_type_primary_id == 2) {
                                var regxForPAN = new RegExp('^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$');
                                //if ((val.length != 10) || !isNaN(val.substring(0,5)) || isNaN(val.substring(5,9)) || !isNaN(val.substring(9,10))) {
                                if ((val.length != 10) || !regxForPAN.test(val)) {
                                    throw new Error(i18n_Validation.__('Please_Enter', 'Valid PAN Number'))
                                }
                            } else if (this.govt_id_type_primary_id == 1) {
                                if (val.length == 0) {
                                    throw new Error(i18n_Validation.__('required'))
                                }
                            }
                        }
                    }
                },
                contact_person_name: {
                    type: DataTypes.STRING
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                member_relation_of: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                member_relation_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                member_caste: {
                    type: DataTypes.STRING,
                },
                member_age: {
                    type: DataTypes.STRING,
                    validate: {
                        
                        min: {
                            args: 18,
                            msg: i18n_Validation.__('greater-than', 'or equal to 18')
                        },
                        isNumeric: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                member_pan_number: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                member_aadhar: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isAadharCardValidation: function (val) {
                            if (val.length != 0 && val.length != 12 || isNaN(val)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Aadhar Number'))
                            }
                        }
                    }
                },
                govt_id_type_primary_id: {
                    type: DataTypes.INTEGER,
                },
                member_title: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                business_name: {
                    type: DataTypes.STRING,
                },
                designation: {
                    type: DataTypes.STRING,
                },
                on_behalf_of: {
                    type: DataTypes.STRING,
                },
                mobile_otp: {
                    type: DataTypes.INTEGER,
                },
                e_sign:{
                type: DataTypes.STRING    
                },
                member_signature: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isLongEnough: function (val) {

                            var ext1 = val.split('.').pop();
                            var validExt = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'];
                            if (validExt.indexOf(ext1) < 0) {
                                throw new Error(i18n_Validation.__('imageTypeValidation', 'Valid image'))
                            }
                        }
                    }
                }
            },
            {
                tableName: 'arbitration_agreement_party_members',
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
                        var mymodelServiceDetailDocumentHasMany = myModel.hasMany(sequelize.models.ServiceDetailDocument, {foreignKey: 'service_detail_id', as: 'service_detail_documents'});
                        var mymodelServiceDetailDurationWisePercentageHasMany = myModel.hasMany(sequelize.models.ServiceDetailDurationWisePercentage, {foreignKey: 'service_detail_id', as: 'service_detail_duration_wise_percentages'});
                        var mymodelServiceDetailSlabHasMany = myModel.hasMany(sequelize.models.ServiceDetailSlab, {foreignKey: 'service_detail_id', as: 'service_detail_slabs'});
                        myModel.create(values.body, {include: [
                                mymodelServiceDetailDocumentHasMany,
                                mymodelServiceDetailDurationWisePercentageHasMany,
                                mymodelServiceDetailSlabHasMany
                            ]}).then(function (results) {
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
                    deleteByValue: function (where, res) {
                        myModel.destroy({
                            where: where
                        }).then(function (data) {
                            res(data);
                        });
                    },
                    saveBulkData: function (values, res) {
                        myModel.bulkCreate(values).then(function (data) {
                            res(true);
//                            return true;
                        });
                    }
                },
                hooks: {
                    beforeCreate: function (values, options) {
//                if (typeof values.is_active === 'undefined') {
//                values.arbitration_agreement_party_number = parseInt(values.arbitration_agreement_party_number) + 1;
//                values.member_no = parseInt(values.member_no) + 1;
//                }
                    }
                }

            }

    );

    return myModel;
};