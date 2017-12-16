//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
// setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});
i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");
var moment = require('moment');
var timediff = require('timediff');
module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("ArbitrationAgreements",
            {
                pay_send_log:{
                type: DataTypes.STRING,    
                },
                ar_id: {
                    type: DataTypes.STRING,
                },
                esign_cord:{
                type: DataTypes.STRING    
                },
                aa_id: {
                    type: DataTypes.STRING,
                },
                product_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_district_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_division_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_state_id: {
                    type: DataTypes.INTEGER,
                },
                franchise_country_id: {
                    type: DataTypes.INTEGER,
                },
                invoice_no: {
                    type: DataTypes.STRING,
                },
                term_conditions: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                parent_arbitration_agreements_id: {
                    type: DataTypes.INTEGER,
                },
                parent_arbitration_agreements_period: {
                    type: DataTypes.STRING,
                },
                agreement_type: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                service_details_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                service_details_primary_id: {
                    type: DataTypes.INTEGER,
                },
                fee: {
                    type: DataTypes.INTEGER,
                },
                year_nayacard: {
                    type: DataTypes.INTEGER,
                },
                service_detail_documents_id: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                document_valid_from: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                document_valid_to: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
//                        isLongEnough: function (val) {
//                            var document_valid_from1 = new Date(moment(this.document_valid_from, 'DD-MM-YYYY').format('YYYY-MM-DD')).getTime();
//                            var document_valid_to1 = new Date(moment(val, 'DD-MM-YYYY').format('YYYY-MM-DD')).getTime();
//                            if (document_valid_from1 >= document_valid_to1) {
//                                throw new Error(i18n_Validation.__('greater-than', 'start date'))
//                            } else {
//                                console.log(this.document_valid_from)
//                            }
//                        },
//                        oneYearRequired: function (val) {
//                            var diff = timediff(this.document_valid_from, val, 'Y');
//                            if (diff.years <= 0) {
//                                throw new Error(i18n_Validation.__('Please_Enter', 'Minimum 1 year duration'))
//                            } else {
//                                //console.log(this.document_valid_from)
//                            }
//                        }
                    }
                },
                agreement_value: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isNumeric: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                agreement_duration_month: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
//                agreement_country_id: {
//                    type: DataTypes.INTEGER,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required', 'Country')
//                        },
//                    }
//                },
//                agreement_state_id: {
//                    type: DataTypes.INTEGER,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
//                },
//                agreement_division_id: {
//                    type: DataTypes.INTEGER,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
//                },
//                agreement_district_id: {
//                    type: DataTypes.INTEGER,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
//                },
//                agreement_tehsil_id: {
//                    type: DataTypes.INTEGER,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
//                },
                first_witness_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                first_witness_email: {
                    type: DataTypes.STRING,
                    validate: {
//                        isEmail: {
//                            msg: i18n_Validation.__('Please_Enter', 'valid email')
//                        },
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        }
                    }
                },
                first_witness_title: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                first_witness_relation: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                first_witness_relation_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                first_witness_aadhar_no: {
                    type: DataTypes.STRING,
                    validate: {
                        isAadharCardValidation: function (val) {
                            if (val.length != 0 && val.length != 12 || isNaN(val)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Aadhar Number'))
                            }
                        }
                    }
                },
                first_witness_mobile: {
                    type: DataTypes.STRING,
                    validate: {
                        ismobileNo: function (val) {
                            if (val.length != 0 && val.length != 10 || isNaN(val)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Mobile Number'))
                            }
                        }
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                        len: {
//                            args: [10, 10],
//                            msg: i18n_Validation.__('Please_Enter', '12 digit')
//                        },
//                        isInt: {
//                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
//                        }
                    }
                },
                first_witness_address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                first_witness_age: {
                    type: DataTypes.STRING,
                    validate: {
                        isNumeric: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        min: {
                            args: 18,
                            msg: i18n_Validation.__('greater-than', 'or equal to 18')
                        },
                    }
                },
                first_witness_caste: {
                    type: DataTypes.STRING,
                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        }
                    }
                },
                first_witness_country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                first_witness_state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                first_witness_district_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                first_witness_tehsil_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                first_witness_town: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                first_witness_block_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                first_witness_pincode: {
                    type: DataTypes.INTEGER,
                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
                    }
                },
                first_witness_country_primary_id: {
                    type: DataTypes.INTEGER,
                },
                first_witness_state_primary_id: {
                    type: DataTypes.INTEGER,
                },
                first_witness_division_primary_id: {
                    type: DataTypes.INTEGER,
                },
                first_witness_district_primary_id: {
                    type: DataTypes.INTEGER,
                },
                first_witness_tehsil_primary_id: {
                    type: DataTypes.INTEGER,
                },
                first_witness_govt_identity_types_id: {
                    type: DataTypes.INTEGER,
                },
                first_witness_govt_id_number: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isPanCardValid: function (val) {
                            if (this.first_witness_govt_identity_types_primary_id == 2) {
                                if ((val.length != 10) || !isNaN(val.substring(0, 5)) || isNaN(val.substring(5, 9)) || !isNaN(val.substring(9, 10))) {
                                    throw new Error(i18n_Validation.__('Please_Enter', 'Valid PAN Number'))
                                }
                            } else if (this.first_witness_govt_identity_types_primary_id == 1) {
                                if (val.length == 0) {
                                    throw new Error(i18n_Validation.__('required'))
                                }
                            }
                        }
                    }
                },
                first_witness_govt_identity_types_primary_id: {
                    type: DataTypes.INTEGER,
                },
                second_witness_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                second_witness_email: {
                    type: DataTypes.STRING,
                    validate: {
//                        isEmail: {
//                            msg: i18n_Validation.__('Please_Enter', 'valid email')
//                        },
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        }
                    }
                },
                second_witness_title: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                second_witness_relation: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                second_witness_relation_name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                second_witness_aadhar_no: {
                    type: DataTypes.STRING,
                    validate: {
                        isAadharCardValidation: function (val) {
                            if (val.length != 0 && val.length != 12 || isNaN(val)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Aadhar Number'))
                            }
                        }
                    }
                },
                second_witness_mobile: {
                    type: DataTypes.STRING,
                    validate: {
                        ismobileNo: function (val) {
                            if (val.length != 0 && val.length != 10 || isNaN(val)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Mobile Number'))
                            }
                        }
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                        len: {
//                            args: [10, 10],
//                            msg: i18n_Validation.__('Please_Enter', '10 digit')
//                        },
//                        isInt: {
//                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
//                        }
                    }
                },
                second_witness_age: {
                    type: DataTypes.STRING,
                    validate: {
                        isInt: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        min: {
                            args: 18,
                            msg: i18n_Validation.__('greater-than', 'or equal to 18')
                        },
                    }
                },
                second_witness_caste: {
                    type: DataTypes.STRING,
                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        }
                    }
                },
                second_witness_address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                second_witness_country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                second_witness_state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                first_witness_division_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                second_witness_district_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                second_witness_tehsil_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                second_witness_block_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                second_witness_town: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                second_witness_pincode: {
                    type: DataTypes.INTEGER,
                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
                    }
                },
                second_witness_country_primary_id: {
                    type: DataTypes.INTEGER,
                },
                second_witness_state_primary_id: {
                    type: DataTypes.INTEGER,
                },
                second_witness_division_primary_id: {
                    type: DataTypes.INTEGER,
                },
                second_witness_district_primary_id: {
                    type: DataTypes.INTEGER,
                },
                second_witness_tehsil_primary_id: {
                    type: DataTypes.INTEGER,
                },
                second_witness_govt_identity_types_id: {
                    type: DataTypes.INTEGER,
                },
                second_witness_govt_id_number: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isPanCardValid: function (val) {
                            if (this.second_witness_govt_identity_types_primary_id == 2) {
                                if ((val.length != 10) || !isNaN(val.substring(0, 5)) || isNaN(val.substring(5, 9)) || !isNaN(val.substring(9, 10))) {
                                    throw new Error(i18n_Validation.__('Please_Enter', 'Valid PAN Number'))
                                }
                            } else if (this.second_witness_govt_identity_types_primary_id == 1) {
                                if (val.length == 0) {
                                    throw new Error(i18n_Validation.__('required'))
                                }
                            }
                        }
                    }
                },
                second_witness_govt_identity_types_primary_id: {
                    type: DataTypes.INTEGER,
                },
                agreement_fee: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                user_id: {
                    type: DataTypes.INTEGER,
                },
                stamp_number: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isUnique: function (value, next) {
                            var self = this;
                            //this is renew case
                            if (typeof this.parent_arbitration_agreements_period != 'undefined') {
                                console.log('5345345345345345345');
                                return next();
                            } else {

                                myModel.find({
                                    where: {stamp_number: value, is_active: [1, 3]},
                                    attributes: ['id'],
                                })
                                        .then(function (data) {
                                            // reject if a different user wants to use the same email
                                            if (data && Number(self.id) !== data.id) {
                                                console.log(Number(self.id), data.id);
                                                return next(i18n_Validation.__('AlreadyExist', 'Stamp Number'));
                                            } else {
                                                //get current user role
                                                var query = '';
                                                query += ' SELECT r.role_slug from users u LEFT JOIN role_types rt ON u.role_type_id = rt.id '
                                                query += ' LEFT JOIN roles r ON r.id = rt.role_id where u.id = ? ';
                                                sequelize.query(query,
                                                        {replacements: [self.user_id], type: sequelize.QueryTypes.SELECT}
                                                ).then(function (data) {
                                                    // if professional then check, freeze by user and created user should be same
                                                    if (data[0].role_slug == 'professional') {
                                                        var req2 = {};
                                                        var current_time = new moment().format("YYYY-MM-DD HH:mm:ss");
                                                        req2.where = {stamp_no: value, verify: 1, expire_date: {$gt: current_time}}
                                                        req2.order = ' id desc ';
                                                        sequelize.models['FreezeDeal'].getByValue(req2, function (stamp_data) {
                                                            //console.log ( stamp_data.user_id , parseInt(self.user_id))
                                                            if (stamp_data && stamp_data.user_id !== parseInt(self.user_id)) {
                                                                return next(i18n_Validation.__('This Stamp is already freezed by another professional'));
                                                            } else {
                                                                return next();
                                                            }

                                                        });
                                                        //res(data);
                                                    } else {
                                                        return next();
                                                    }
                                                });
                                            }
//                                            return next();
                                        })
                                        .catch(function (err) {
                                            return next(err);
                                        });
                            }
                        },
//                        isFreezByAnotherProf: function (value, next) {
//                            var self = this;
//                            //this is renew case
//                            if (typeof self.parent_arbitration_agreements_period != 'undefined') {
//                                console.log('5345345345345345345');
//                            } else {
//                                //get current user role
//                                var query = '';
//                                query += ' SELECT r.role_slug from users u LEFT JOIN role_types rt ON u.role_type_id = rt.id '
//                                query += ' LEFT JOIN roles r ON r.id = rt.role_id where u.id = ? ';
//                                sequelize.query(query,
//                                        {replacements: [self.user_id], type: sequelize.QueryTypes.SELECT}
//                                ).then(function (data) {
//                                    // if professional then check, freeze by user and created user should be same
//                                    if (data[0].role_slug == 'professional') {
//                                        var req2 = {};
//                                        var current_time = new moment().format("YYYY-MM-DD HH:mm:ss");
//                                        req2.where = {stamp_no: value, verify: 1, expire_date: {$gt: current_time}}
//                                        req2.order = ' id desc ';
//                                        sequelize.models['FreezeDeal'].getByValue(req2, function (stamp_data) {
//                                            //console.log ( stamp_data.user_id , parseInt(self.user_id))
//                                            if (stamp_data && stamp_data.user_id !== parseInt(self.user_id)) {
//                                                return next(i18n_Validation.__('This Stamp is already freezed by another professional'));
//                                            } else {
//                                                return next();
//                                            }
//
//                                        });
//                                        //res(data);
//                                    } else {
//                                        return next();
//                                    }
//                                });
//                            }
//                        },
                    }
                },
                stamp_date: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                stamp_state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                stamp_division_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                stamp_district_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                stamp_town: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                stamp_state_primary_id: {
                    type: DataTypes.INTEGER,
                },
                stamp_division_primary_id: {
                    type: DataTypes.INTEGER,
                },
                stamp_district_primary_id: {
                    type: DataTypes.INTEGER,
                },
                agreement_place: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isAlphaWithSpace: function (val) {
                            var val1 = val.replace(/ /g, '');
                            if (!/^[a-zA-Z]*$/.test(val1)) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Valid Place'))
                            }
                        }
                    }
                },
                place_of_arbitration: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isLongEnough: function (val) {
                            if (val == 'select') {
                                return true;
//                                throw new Error(i18n_Validation.__('required'))
                            }
                        }
                    }
                },
                place_of_appeal: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isLongEnough: function (val) {
                            if (val == 'select') {
                                return true;
                            }
                        }
                    }
                },
                place_of_arbitration_primary_id: {
                    type: DataTypes.INTEGER,
                },
                place_of_appeal_primary_id: {
                    type: DataTypes.INTEGER,
                },
                added_date: {
                    type: DataTypes.STRING,
                },
                freeze_user_id: {
                    type: DataTypes.INTEGER,
                },
                freeze_id: {
                    type: DataTypes.INTEGER,
                },
                stamp_user_id: {
                    type: DataTypes.INTEGER,
                },
                stamp_id: {
                    type: DataTypes.INTEGER,
                },
                is_active: {
                    type: DataTypes.INTEGER,
                },
                payment_duedate_deed_writer: {
                    type: DataTypes.STRING,
                },
                payment_duedate_ap: {
                    type: DataTypes.STRING,
                },
                payment_detail: {
                    type: DataTypes.STRING,
                },
                invoice_billing_to: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                invoice_state_code: {
                    type: DataTypes.STRING,
                },
                invoice_gst_no: {
                    type: DataTypes.STRING,
                },
                invoice_address: {
                    type: DataTypes.STRING,
                },
                invoice_town: {
                    type: DataTypes.STRING,
                },
                invoice_country_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                invoice_state_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                invoice_division_id: {
                    type: DataTypes.STRING,
                },
                invoice_district_id: {
                    type: DataTypes.STRING,
                },
                invoice_tehsil_id: {
                    type: DataTypes.STRING,
                },
                invoice_country_id_primary_id: {
                    type: DataTypes.STRING,
                },
                invoice_state_id_primary_id: {
                    type: DataTypes.STRING,
                },
                invoice_division_id_primary_id: {
                    type: DataTypes.STRING,
                },
                invoice_district_id_primary_id: {
                    type: DataTypes.STRING,
                },
                invoice_tehsil_id_primary_id: {
                    type: DataTypes.STRING,
                },
                paid_on: {
                    type: DataTypes.STRING,
                },
                paid_by: {
                    type: DataTypes.STRING,
                },
                time_to_pay: {
                    type: DataTypes.STRING,
                },
                first_witness_mobile_otp:{
                 type: DataTypes.STRING,   
                },
                second_witness_mobile_otp:{
                 type: DataTypes.STRING,   
                },
                esign_id:{
                 type: DataTypes.STRING,   
                },
                first_witness_esign:{
                 type: DataTypes.STRING,   
                },
                second_witness_esign:{
                 type: DataTypes.STRING,   
                },
                esign_res:{
                 type: DataTypes.STRING,   
                },
                is_renewed: {
                    type: DataTypes.INTEGER,
                },
//                agreement_file_id: {
//                    type: DataTypes.STRING,
//                    validate: {
//                        isLongEnough: function (val) {
//                            var ext1 = val.split('.').pop();
//                            var validExt = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'];
//                            if (validExt.indexOf(ext1) < 0) {
//                                throw new Error(i18n_Validation.__('imageTypeValidation', 'Valid image'))
//                            }
//                        }
//                    }
//                }
            },
            {
                tableName: 'arbitration_agreements',
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
                        var ArbitrationAgreementPartyMembershasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementPartyMembers, {as: 'arbitration_agreement_party_members', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementTaxhasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementTax, {as: 'arbitration_agreement_taxes', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementFeehasOne = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {as: 'arbitration_agreement_fees', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementServiceDetails = myModel.belongsTo(sequelize.models.ServiceDetail, {as: 'service_details', foreignKey: 'service_details_primary_id'});
                        var freeze = myModel.belongsTo(sequelize.models.User, {as: 'freeze', foreignKey: 'freeze_user_id'});
                        var create = myModel.belongsTo(sequelize.models.User, {as: 'create', foreignKey: 'user_id'});
                        var create_role_type = sequelize.models.User.belongsTo(sequelize.models.RoleType, {as: 'create_role_type', foreignKey: 'role_type_id'});
                        var create_roles = sequelize.models.RoleType.belongsTo(sequelize.models.Role, {as: 'create_roles', foreignKey: 'role_id'});
                        myModel.findOne({where: req.where,
                            include: [
                                ArbitrationAgreementPartyMembershasMany,
                                ArbitrationAgreementServiceDetails,
//                                ArbitrationAgreementTaxhasMany,
                                ArbitrationAgreementFeehasOne,
                                freeze,
//                                create
                                {association: create, include: [{association: create_role_type, include: [create_roles]}]},
                            ]}).then(function (results) {
//                            console.log(results.create.create_role_type.create_roles.role_slug + ' == professional')
                            res(results);
                        });
                    },
                    getFirstValuesForRenew: function (req, res) {
                        var where_date_nc = {};
                        var where_date_nc_flag = false;
                        if (req.whereCondiForRenewDate) {
                            where_date_nc = req.whereCondiForRenewDate;
                            where_date_nc_flag = true;
                        }

                        var where_service_details = {};
                        var where_service_details_flag = false;
                        if (req.whereCondiForRenew) {
                            where_service_details = req.whereCondiForRenew;
                            where_service_details_flag = true;
                        }

                        var ArbitrationAgreementPartyMembershasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementPartyMembers, {as: 'arbitration_agreement_party_members', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementTaxhasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementTax, {as: 'arbitration_agreement_taxes', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementFeehasOne = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {as: 'arbitration_agreement_fees', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementServiceDetails = myModel.belongsTo(sequelize.models.ServiceDetail, {as: 'service_details', foreignKey: 'service_details_primary_id'});
                        myModel.findOne({
                            where: req.where,
                            include: [
                                {association: ArbitrationAgreementPartyMembershasMany, include: [], required: true},
                                {association: ArbitrationAgreementTaxhasMany, include: [], required: true},
                                {association: ArbitrationAgreementFeehasOne, include: [], where: where_date_nc, required: where_date_nc_flag},
                                {association: ArbitrationAgreementServiceDetails, include: [], where: where_service_details, required: where_service_details_flag},
//                                ArbitrationAgreementPartyMembershasMany,
//                                ArbitrationAgreementServiceDetails,
//                                ArbitrationAgreementFeehasOne
                            ]}).then(function (results) {
                            res(results);
                        });
                    },
                    getFirstValuesForRefund: function (req, res) {
//                        var query = '';
//                        query += '  select * FROM arbitration_agreements ag ';
//                        query += '  LEFT JOIN arbitration_agreement_party_members agm ON ag.id = agm.arbitration_agreements_id ';
//                        query += '  WHERE ag.id = ? AND curdate() < DATE_ADD(ag.added_date, INTERVAL 30 DAY ';
//                        sequelize.query(query,
//                                {replacements: [req.state], type: sequelize.QueryTypes.SELECT}
//                        ).then(function (dataCount) {
//                            //console.log(data);
//                            //res(data);
//                            
//                        });

                        var ArbitrationAgreementPartyMembershasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementPartyMembers, {as: 'arbitration_agreement_party_members', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementTaxhasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementTax, {as: 'arbitration_agreement_taxes', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementFeehasOne = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {as: 'arbitration_agreement_fees', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementServiceDetails = myModel.belongsTo(sequelize.models.ServiceDetail, {as: 'service_details', foreignKey: 'service_details_primary_id'});
                        myModel.findOne({
                            where: req.where,
                            include: [
                                {association: ArbitrationAgreementPartyMembershasMany, include: []},
//                                {association: ArbitrationAgreementTaxhasMany, include: []},
//                                {association: ArbitrationAgreementFeehasOne, include: []},
//                                {association: ArbitrationAgreementServiceDetails, include: []},
//                                ArbitrationAgreementPartyMembershasMany,
//                                ArbitrationAgreementServiceDetails,
//                                ArbitrationAgreementFeehasOne
                            ]}).then(function (results) {
                            res(results);
                        });
                    },
                    getAllValuesPaging: function (req, res) {

                        srhData = req.query;
                        c_name = {};
                        c_flag = false;
                        f_flag = false;
                        if (srhData['c_name']) {
                            c_name = {first_name: {$like: '%' + srhData['c_name'] + '%'}};
                            c_flag = true;
                        }

                        f_name = {};



                        if (srhData['stamp_number']) {
                            req.where['stamp_number'] = {$like: '%' + srhData['stamp_number'] + '%'};
                        }

                        if (srhData['is_active']) {
                            req.where['is_active'] = srhData['is_active'];
                        }


                        console.log('c_name-------------');
                        console.log(c_name);
                        var where_franchise_id = {};
                        var where_franchise_flag = false;
                        if (req.whereCondiForAp) {
                            where_franchise_id = req.whereCondiForAp;
                            where_franchise_flag = true;
                        }

                        var where_service_details = {};
                        var where_service_details_flag = false;
                        if (req.whereCondiForRenew) {
                            where_service_details = req.whereCondiForRenew;
//                            where_service_details_flag = true;
                        }

                        var where_date_nc = {};
                        var where_date_nc_flag = false;
                        if (req.whereCondiForRenewDate) {
                            where_date_nc = req.whereCondiForRenewDate;
//                            where_date_nc_flag = true;
                        }


                        if (srhData['id']) {
//                            f_name = {where_date_nc:srhData['id']};
//                            f_flag = true;
                            //where_date_nc = {id: srhData['id']};
//                            req.where.ar_id = srhData['id'];
                            req.where['ar_id'] = {$like: '%' + srhData['id'] + '%'};
                            //where_date_nc_flag = true;
                        }

                        if (srhData.start_date && srhData.end_date) {
                            var start_date = req.app.locals.site.momentObj(srhData.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                            var end_date = req.app.locals.site.momentObj(srhData.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD');

                            req.where.added_date = {
                                $lte: end_date + ' 23:59:59',
                                $gte: start_date + ' 00:00:00'
                            }

                        }

                        if (srhData['service_details_id']) {
                            req.where.service_details_id = srhData['service_details_id'];
                        }

                        var apSrchObj = {};

                        if (srhData.scale && srhData.ap_name) {
                            apSrchObj[srhData.scale] = {first_name: {$like: '%' + srhData.ap_name + '%'}};
                        }


                        var ArbitrationAgreementServiceDetailhasOne = myModel.belongsTo(sequelize.models.ServiceDetail, {as: 'arbitration_agreement_service_details', foreignKey: 'service_details_id'});
                        var ArbitrationAgreementArbitrationAgreementFeehasOne = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {as: 'arbitration_agreement_fee', foreignKey: 'arbitration_agreements_id'});
                        var create = myModel.belongsTo(sequelize.models.User, {as: 'create', foreignKey: 'user_id'});
                        var create_role_type = sequelize.models.User.belongsTo(sequelize.models.RoleType, {as: 'create_role_type', foreignKey: 'role_type_id'});
                        var create_roles = sequelize.models.RoleType.belongsTo(sequelize.models.Role, {as: 'create_roles', foreignKey: 'role_id'});
                        var freeze = myModel.belongsTo(sequelize.models.User, {as: 'freeze', foreignKey: 'freeze_user_id'});
                        var ap_levels = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_users', foreignKey: 'user_id'});
                        var ap_level_1 = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_1', foreignKey: 'franchise_id'});
                        var ap_level_2 = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_2', foreignKey: 'franchise_district_id'});
                        var ap_level_3 = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_3', foreignKey: 'franchise_division_id'});
                        var ap_level_4 = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_4', foreignKey: 'franchise_state_id'});
                        var ap_level_1_business = sequelize.models.User.hasOne(sequelize.models.UserBusinesDetail, {as: 'ap_level_1_business', foreignKey: 'user_id'});
                        var ap_level_2_business = sequelize.models.User.hasOne(sequelize.models.UserBusinesDetail, {as: 'ap_level_2_business', foreignKey: 'user_id'});
                        var ap_level_3_business = sequelize.models.User.hasOne(sequelize.models.UserBusinesDetail, {as: 'ap_level_3_business', foreignKey: 'user_id'});
                        var ap_level_4_business = sequelize.models.User.hasOne(sequelize.models.UserBusinesDetail, {as: 'ap_level_4_business', foreignKey: 'user_id'});
                        myModel.findAndCountAll({
                            where: req.where,
                            offset: req.offset,
                            limit: req.limit,
                            order: 'added_date DESC',
//                            include: [ArbitrationAgreementServiceDetailhasOne, ArbitrationAgreementArbitrationAgreementFeehasOne, create, freeze]
                            include: [
//                                {
//                                    association: freeze,
//                                    where: f_name
//                                },
//                                {
//                                    association: create,
//                                    where: c_name
//                                },
//                                ArbitrationAgreementServiceDetailhasOne,
//                                ArbitrationAgreementArbitrationAgreementFeehasOne
//
//                            ]
                                {association: ArbitrationAgreementServiceDetailhasOne, include: [], where: where_service_details, required: where_service_details_flag},
                                {association: ArbitrationAgreementArbitrationAgreementFeehasOne, include: [], where: where_date_nc, required: where_date_nc_flag},
                                {association: create, include: [{association: create_role_type, include: [create_roles]}], where: c_name, required: c_flag},
                                {association: freeze, include: [], where: f_name, required: f_flag},
                                {association: ap_levels, include: [], where: where_franchise_id, required: where_franchise_flag},
                                {association: ap_level_1, where: apSrchObj[1], include: [{association: ap_level_1_business, include: []}]},
                                {association: ap_level_2, where: apSrchObj[2], include: [{association: ap_level_2_business, include: []}]},
                                {association: ap_level_3, where: apSrchObj[3], include: [{association: ap_level_3_business, include: []}]},
                                {association: ap_level_4, where: apSrchObj[4], include: [{association: ap_level_4_business, include: []}]},
                            ],
                        }).then(function (results) {
//                            console.log(results.rows[0].ap_level_1)
                            res(results);
                        });
                    },
                    getRenewValuesPaging: function (req, res) {

                        var where_service_details = {};
                        var where_service_details_flag = false;
                        if (req.whereCondiForRenew) {
                            where_service_details = req.whereCondiForRenew;
                            where_service_details_flag = true;
                        }

                        var where_date_nc = {};
                        var where_date_nc_flag = false;
                        if (req.whereCondiForRenewDate) {
                            where_date_nc = req.whereCondiForRenewDate;
                            where_date_nc_flag = true;
                        }
                        var ArbitrationAgreementPartyMembershasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementPartyMembers, {as: 'arbitration_agreement_party_members', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementServiceDetailhasOne = myModel.belongsTo(sequelize.models.ServiceDetail, {as: 'arbitration_agreement_service_details', foreignKey: 'service_details_primary_id'});
                        var ArbitrationAgreementArbitrationAgreementFeehasOne = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {as: 'arbitration_agreement_fee', foreignKey: 'arbitration_agreements_id'});
                        var ap_levels = myModel.belongsTo(sequelize.models.User, {as: 'ap_level_users', foreignKey: 'user_id'});
                        var self_model = myModel.hasOne(myModel, {as: 'parent_data', foreignKey: 'parent_arbitration_agreements_id'});
                        myModel.findAndCountAll({
                            where: req.where,
                            offset: req.offset,
                            limit: req.limit,
                            order: 'id DESC',
                            include: [
                                {association: ArbitrationAgreementPartyMembershasMany, include: []},
                                {association: ArbitrationAgreementServiceDetailhasOne, include: [], where: where_service_details, required: where_service_details_flag},
                                {association: ArbitrationAgreementArbitrationAgreementFeehasOne, include: [], where: where_date_nc, required: where_date_nc_flag},
                                {association: self_model, include: [], where: {id: null}, required: false},
                            ],
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
                        var ArbitrationAgreementPartyMembershasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementPartyMembers, {as: 'arbitration_agreement_party_members', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementTaxhasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementTax, {as: 'arbitration_agreement_taxes', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementFeehasOne = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {as: 'arbitration_agreement_fees', foreignKey: 'arbitration_agreements_id'});
                        var newMemberObj = [];
                        var partyCount = 1;
                        async.forEach(values.body.arbitration_agreement_party_members, function (value, callback) {

                            if (typeof value != 'undefined') {

                                var memberCount = 1;
                                async.forEach(value, function (value1, callback1) {
                                    if (typeof value1 != 'undefined') {
                                        value1.arbitration_agreement_party_number = partyCount;
                                        value1.member_no = memberCount;
                                        memberCount++;
                                        newMemberObj.push(value1);
                                    }
                                });
                                partyCount++;
                            }
                            callback(null, '');
                        }, function (err, results) {
                            values.body.arbitration_agreement_party_members = newMemberObj;
                            values.body.user_id = values.user.id;
//                            console.log(values.body.arbitration_agreement_party_members);
//                            return true;
                            myModel.create(values.body, {
                                include: [
                                    ArbitrationAgreementPartyMembershasMany,
                                    ArbitrationAgreementTaxhasMany,
                                    ArbitrationAgreementFeehasOne
                                ]
                            }).then(function (results) {
//                                results.results = values.body;
                                results.status = 1;
                                console.log(results);
                                res(results);
                            }).catch(function (err) {
                                console.log(err);
                                var errors = err;
                                errors.status = false;
                                res(errors);
                            });
                        });
                    },
                    updateAllValues: function (values, res) {
                        var ArbitrationAgreementPartyMembershasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementPartyMembers, {as: 'arbitration_agreement_party_members', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementTaxhasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementTax, {as: 'arbitration_agreement_taxes', foreignKey: 'arbitration_agreements_id'});
                        var ArbitrationAgreementFeehasOne = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {as: 'arbitration_agreement_fees', foreignKey: 'arbitration_agreements_id'});
                        var newMemberObj = [];
                        var partyCount = 1;
                        console.log('values.body.arbitration_agreement_party_members ((((((((((((');
//                        console.log(values.body);
                        async.forEach(values.body.arbitration_agreement_party_members, function (value, callback) {

                            if (typeof value != 'undefined') {

                                var memberCount = 1;
                                async.forEach(value, function (value1, callback1) {
                                    if (typeof value1 != 'undefined') {
                                        value1.arbitration_agreements_id = values.body.id;
                                        value1.arbitration_agreement_party_number = partyCount;
                                        value1.member_no = memberCount;
                                        memberCount++;
                                        newMemberObj.push(value1);
                                    }
                                });
                                partyCount++;
                            }
                            callback(null, '');
                        }, function (err, results) {
                            values.body.arbitration_agreement_party_members = newMemberObj;
                            var where = {'arbitration_agreements_id': values.body.id};
                            sequelize.models['ArbitrationAgreementPartyMembers'].deleteByValue(where, function (results) {
                                sequelize.models['ArbitrationAgreementTax'].deleteByValue(where, function (results) {
//                                    sequelize.models['ArbitrationAgreementFee'].deleteByValue(where, function (results) {
                                    sequelize.models['ArbitrationAgreementPartyMembers'].saveBulkData(values.body.arbitration_agreement_party_members, function (results) {
//                                            console.log(results,'errRRRRRRRRRRRRRRRRRRRR');

                                        values.where = {id: values.body.id};
                                        myModel.update(values.body, {where: values.where}, {
                                            include: [
                                                ArbitrationAgreementPartyMembershasMany,
//                                        ArbitrationAgreementTaxhasMany,
//                                        ArbitrationAgreementFeehasOne
                                            ]
                                        }).then(function (data) {
                                            var results = {};
                                            results = values.body;
                                            results.status = 1;
                                            res(results);
                                        }).catch(function (err) {
                                            console.log(err);
                                            var errors = err;
                                            errors.status = false;
                                            res(errors);
                                        });
                                    });
//                                    });
                                });
                            });
                        });
                    },
                    getAgreementView: function (req, res) {
                        var mymodelServiceDetailDocument = myModel.belongsTo(sequelize.models.ServiceDetailDocument, {foreignKey: 'service_detail_documents_id', as: 'service_detail_documents'});
                        var ArbitrationAgreementServiceDetailhasOne = myModel.belongsTo(sequelize.models.ServiceDetail, {as: 'service_details', foreignKey: 'service_details_id'});
                        var ArbitrationAgreementPartyMembers = myModel.hasMany(sequelize.models.ArbitrationAgreementPartyMembers, {as: 'members', foreignKey: 'arbitration_agreements_id'});
                        var Tax = myModel.hasMany(sequelize.models.ArbitrationAgreementTax, {as: 'tax', foreignKey: 'arbitration_agreements_id'});
                        var fess = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {foreignKey: 'arbitration_agreements_id', as: 'fess'});
                        var user = myModel.belongsTo(sequelize.models.User, {foreignKey: 'user_id', as: 'user'});
                        var user_busines = sequelize.models.User.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines'});
                        var user_role = sequelize.models.User.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_role'});
                        var role = sequelize.models.RoleType.belongsTo(sequelize.models.Role, {foreignKey: 'role_id', as: 'role'});
                        var user_freeze = myModel.belongsTo(sequelize.models.User, {foreignKey: 'freeze_user_id', as: 'user_freeze'});
                        var user_role_freeze = sequelize.models.User.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_role_freeze'});
                        var parent_data = myModel.belongsTo(sequelize.models.ArbitrationAgreements, {foreignKey: 'parent_arbitration_agreements_id', as: 'parent_date'});
                        myModel.find({
                            where: req.where,
                            //, nested: true
                            include:
//                             [{all: true}, modal:[]]
                                    //mymodelServiceDetailDocument,ArbitrationAgreementServiceDetailhasOne,ArbitrationAgreementPartyMembers,
//                            Tax,fess,user_busines,user_freeze,user_role_freeze,
                                            [
                                                {association: mymodelServiceDetailDocument, include: []},
                                                {association: ArbitrationAgreementServiceDetailhasOne, include: []},
                                                {association: ArbitrationAgreementPartyMembers, include: []},
                                                {association: Tax, include: []},
                                                {association: fess, include: []},
                                                {association: user, include: [{association: user_role, include: [{association: role}]}]},
                                                {association: user_busines, include: []},
                                                {association: user_freeze, include: [user_role_freeze]},
                                                {association: parent_data, include: []}
                                            ]
                                }).then(function (results) {
                                    console.log(results);
                                    res(results);
                                });
                            },
                            changeStatus: function (values, res) {
                                myModel.update(values.body, {where: values.where}).then(function (results) {
                                    res(results);
                                });
                            },
                            getInvoiceNo: function (req, res) {


                                var query = '';
                                query += '  select count(id) count from ( ';
                                query += '  select id,invoice_no,stamp_state_id from arbitration_agreements ';
                                query += '  union all ';
                                query += '  select id,invoice_no,business_state_id from membership_plan_issues ';
                                query += '  ) invoice_tbl ';
                                query += '  where invoice_no is not null and invoice_no !="" and stamp_state_id=? ';
                                sequelize.query(query,
                                        {replacements: [req.state], type: sequelize.QueryTypes.SELECT}
                                ).then(function (dataCount) {
                                    //console.log(data);
                                    //res(data);

                                    var state_query = '';
                                    state_query += ' select state_slug from states where state_name=?';
                                    sequelize.query(state_query,
                                            {replacements: [req.state], type: sequelize.QueryTypes.SELECT}
                                    ).then(function (data) {
                                        var nxt_no = parseInt(dataCount[0]['count']) + 1;
                                        var iv_no = data[0]['state_slug'] + '/' + nxt_no;
                                        res(iv_no);
                                    });
                                });
                            },
                            updateFee: function (values, res) {
                                console.log(values.body);
                                myModel.update(values.body, {where: values.where}).then(function (results) {
                                    res(results);
                                });
                            },
                            updatePayment: function (values, res) {
                                myModel.update(values.data, {where: values.where}, {
                                }).then(function (data) {
                                    var results = {};
                                    results = values.body;
                                    results.status = 1;
                                    res(results);
                                }).catch(function (err) {
                                    console.log(err);
                                    var errors = err;
                                    errors.status = false;
                                    res(errors);
                                });
                            },
                            saveRenewValues: function (values, res) {
                                var ArbitrationAgreementPartyMembershasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementPartyMembers, {as: 'arbitration_agreement_party_members', foreignKey: 'arbitration_agreements_id'});
                                var ArbitrationAgreementTaxhasMany = myModel.hasMany(sequelize.models.ArbitrationAgreementTax, {as: 'arbitration_agreement_taxes', foreignKey: 'arbitration_agreements_id'});
                                var ArbitrationAgreementFeehasOne = myModel.hasOne(sequelize.models.ArbitrationAgreementFee, {as: 'arbitration_agreement_fees', foreignKey: 'arbitration_agreements_id'});

                                myModel.create(values.body, {
                                    include: [
                                        ArbitrationAgreementPartyMembershasMany,
                                        ArbitrationAgreementTaxhasMany,
                                        ArbitrationAgreementFeehasOne
                                    ]}
                                ).then(function (results) {
                                    results.status = 1;
                                    res(results);
                                }).catch(function (err) {
                                    console.log(err);
                                    var errors = err;
                                    errors.status = false;
                                    res(errors);
                                });
                            },
                        },
                        hooks: {
                            beforeCreate: function (values, options) {
//                if (typeof values.is_active === 'undefined') {
//                    values.is_active = 0;
//                }
                            }
                        }

                    }

                    );
                    return myModel;
                };