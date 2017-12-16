//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
// setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});
var moment = require('moment');
i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");
module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("FreezeDeal",
            {
                user_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                stamp_no: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isUnique: function (value, next) {
                            var current_time = new moment().format("YYYY-MM-DD HH:mm:ss");
                            var self = this;
                            myModel.find({
                                where: {stamp_no: value, verify: 1, expire_date: {$gt: current_time}, deal_status: 0}
                            })
                                    .then(function (data) {
                                        if (data) {
                                            //return next(i18n_Validation.__('AlreadyExist', 'Stamp No'));
                                            //return next('Deal is freezed by another professional.');
                                            return next('Deal is already freezed');
                                        }
                                        return next();
                                    })
                                    .catch(function (err) {
                                        return next(err);
                                    });
                        },
                        isUnique1: function (value, next) {
                            var self = this;
                            sequelize.models.ArbitrationAgreements.find({
                                where: {stamp_number: value, is_active: {$ne: 2}}
                            })
                                    .then(function (data) {
                                        if (data) {
                                            return next(i18n_Validation.__('AlreadyExist', 'Stamp No'));
                                            //return next('Nyaya card already created on this stamp number ');
                                        }
                                        return next();
                                    })
                                    .catch(function (err) {
                                        return next(err);
                                    });
                        }
                    }

                },
                service_details_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                service_detail_documents_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
//                purchase_date: {
//                    type: DataTypes.STRING,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
//                },
//                party_father_name: {
//                    type: DataTypes.STRING,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
//                },
                party_name: {
                    type: DataTypes.STRING
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
                },
                party_mobile_no: {
                    type: DataTypes.STRING,
                    validate: {
                        isUnique2: function (value, next) {

                            console.log(value + '==' + this.chkNo);

                            if (value == this.chkNo) {
                                return next('Please enter party mobile number ');
                            } else {
                                return next();
                            }

                        },
                        len: {
                            args: [10, 10],
                            msg: i18n_Validation.__('phone_vaild')
                        },
                        isInt: {
                            msg: i18n_Validation.__('Please_Enter', 'Valid mobile no.')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                otp: {type: DataTypes.STRING},
                chkNo: {type: DataTypes.VIRTUAL},
                expire_date: {type: DataTypes.STRING},
                verify: {type: DataTypes.STRING},
                deal_status: {type: DataTypes.STRING},
                fee: {type: DataTypes.STRING},
                year: {type: DataTypes.STRING},
                document_value: {type: DataTypes.STRING},
            },
            {
                tableName: 'freeze_deals',
                classMethods: {
                    associate: function (models) {
                        var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
                    },
                    method1: function (req, res) {
                        myModel.findAll().then(function (users) {
                            res(users);
                        });
                    },
                    getAllValuesProviderOrm: function (req, res) {
                        var master = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'master'});
                        myModel.findAndCountAll({where: {product_id: req.params.product_id}, order: 'id DESC', include: [{association: master, where: {role_id: req.where.role_type_id}}], offset: req.offset, limit: req.limit}).then(function (results) {
                            console.log(results.rows.master);
                            res(results);
                        });
                    },
                    getAllValuesProvider: function (req, res) {
                        var master = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'master'});
                        myModel.findAndCountAll({where: req.where, order: 'id DESC', include: [master], offset: req.offset, limit: req.limit}).then(function (results) {
                            console.log(results.rows.master);
                            res(results);
                        });
                    },
                    getAllValuesDash: function (req, res) {

                        var master = myModel.belongsTo(sequelize.models.ServiceDetail, {foreignKey: 'service_details_id', as: 'master'});
                        myModel.findAll({
                            where: req.where,
//                            where: {user_id: req.user.id, verify: 1},
                            order: 'id DESC',
                            include: [master],
                            offset: 0, limit: 5
                        }).then(function (results) {
                            //console.log(results.rows.master);
                            res(results);
                        });

                    },
                    getAllValues: function (req, res) {

                        console.log('*********************');
                        console.log(req.where);
                        console.log('*********************');




                        var current_time = new moment().format("YYYY-MM-DD HH:mm:ss");

                        if (req.query.deal_status && req.query.deal_status == 3) {
                            req.where += ' and "' + current_time + '" > fd.expire_date and deal_status=0 ';
                        }

                        if (req.query.deal_status && req.query.deal_status == 0) {
                            req.where += ' and "' + current_time + '" < fd.expire_date and deal_status=0 ';
                        }

                        var slab_query = '';
                        slab_query += ' SELECT *,fd.id id,ar.id ar_id, '
                        //slab_query += ' if(TIME_TO_SEC(TIMEDIFF(now(),fd.created))/3600 > ?,1,0) as is_expire, '
                        slab_query += ' if(? > fd.expire_date,1,0) as is_expire '

                        slab_query += ' ,fd.fee fee,fd.created created FROM freeze_deals fd  LEFT OUTER JOIN service_details sd '
                        slab_query += ' ON fd.service_details_id = sd.id  left join arbitration_agreements ar on fd.stamp_no=ar.stamp_number ';
                        slab_query += ' left join users u on ar.user_id=u.id ';
                        slab_query += ' where fd.verify=1 and fd.user_id=? ' + req.where + ' group by fd.id ORDER BY fd.id DESC  ';
                        sequelize.query(slab_query,
                                {replacements: [current_time, req.user.id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (data) {
                            //console.log(data);
                            res(data);
                        });
                    },
                    getById: function (id, res) {
                        myModel.findOne({where: {id: id}}).then(function (data) {
                            res(data);
                        });
                    },
                    getByValue: function (req, res) {

                        var freezDealUserBelongsTo = myModel.belongsTo(sequelize.models.User, {foreignKey: 'user_id', as: 'users'});
                        var freezDealUserBelongsToRoleType = sequelize.models.User.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'users_role_type'});
                        var freezDealUserBelongsToUserFranchise = sequelize.models.User.hasOne(sequelize.models.UserFranchise, {foreignKey: 'user_id', as: 'user_franchises'});
                        if (req.order && req.order != 'undefined') {
                            var orderStr = req.order;
                        } else {
                            var orderStr = '';
                        }
                        myModel.findOne({
                            where: req.where,
                            order: orderStr,
                            include: [
                                {
                                    association: freezDealUserBelongsTo, include: [freezDealUserBelongsToRoleType, freezDealUserBelongsToUserFranchise],
//                                    association: freezDealUserBelongsToUserFranchise, include: [],
                                },
                            ],
//                            include: [
//                                freezDealUserBelongsTo,
//                                freezDealUserBelongsToRoleType
//                            ]
                        }).then(function (data) {
                            res(data);
                        });
                    },
                    updateByValue: function (req, res) {
                        myModel.update(req.body, {where: req.where}).then(function (data) {
                            res(data);
                        });
                    },
                    saveAllValueProvider: function (values, res) {

                        id = values.body.id;
                        if (typeof id !== 'undefined' && id != '') {
                            delete values.body.id;
                            if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
                                values.body['is_active'] = 1
                            } else {
                                values.body['is_active'] = 0;
                            }
                            myModel.update(values.body, {where: {id: id}}).then(function (results) {
                                results.status = 1;
                                res(results);
                            }).catch(function (err) {

                            });
                        } else {

                            delete values.body.id;
                            if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
                                values.body['is_active'] = 1
                            } else {
                                values.body['is_active'] = 0;
                            }

                            myModel.create(values.body).then(function (results) {
                                results.status = 1;
                                res(results);
                            }).catch(function (err) {

                            });
                        }



                    },
                    changeStatus: function (values, res) {

                        myModel.update(values.update, {where: values.where}).then(function (results) {
                            res(results);
                        });
                    },
                    saveAllValues: function (values, res) {

                        id = values.body.id;
                        delete values.body.id
                        values.body.user_id = values.user.id;
                        console.log(values.body)

                        if (typeof id !== 'undefined' && id != '') {

                        } else {
                            values.body.expire_date = values.app.locals.site.momentObj(new Date()).utcOffset("+05:30").add(values.app.locals.settingData.freezed_deal_expire_time, 'hours').format('YYYY-MM-DD HH:mm:ss');
                            console.log('-------------------')
                            console.log(values.body);

                            console.log(values.app.locals.site.momentObj(new Date()).format('YYYY-MM-DD HH:mm:ss'));

                            // myModel.create(values.body).then(function (results) {
                            //     results.status = 1;
                            //     results.id = results.id;
                            //     res(results);
                            // }).catch(function (err) {
                            //     console.log(err);
                            //     var errors = err;
                            //     errors.status = false;
                            //     res(errors);
                            // }); 
                        }

                    }
                },
                hooks: {
                }
            }
    );
    return myModel;
};