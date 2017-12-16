//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
// setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});
i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");
module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("Commision",
            {
                product_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                role_type_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                service_detail_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                commission_type: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                commission_value: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        not: {
                            args: ["[a-z]", 'i'],
                            msg: i18n_Validation.__('Please_Enter', 'Numeric value')
                        },
                        isLongEnough: function (val) {
                            if (val <= 0) {
                                throw new Error(i18n_Validation.__('Please_Enter', 'Positive value'))
                            }
                        },
                    }
                },
                is_active: {
                    type: DataTypes.STRING
                }
            },
    {
        tableName: 'commissions',
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
            getAllValues: function (req, res) {

                query = '';
                query += "SELECT c.id cid,m.role_type_name master_name,c.is_active is_active,c.role_type_id mid, "
                query += "group_concat(s.service_details_name order by c.id) service_details_name, "
                query += "group_concat(c.commission_type order by c.id) commission_type, "
                query += "group_concat(c.commission_value order by c.id) commission_value "
                query += "FROM commissions c "
                query += "left join role_types m on c.role_type_id=m.id "
                query += "left join service_details s on c.service_detail_id=s.id "
                query += "where c.product_id=1 and m.role_id=1 "
                query += "group by c.role_type_id order by c.id desc "

                sequelize.query(query,
                        {replacements: [], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    console.log(data);
                    res(data);
                });
                //var master = myModel.belongsTo(sequelize.models.Master, {foreignKey: 'master_type_id', as: 'master'});

                //myModel.findAndCountAll({where: req.where, order: 'id DESC', include: [{model: master, where: {master_type: 1}}], offset: req.offset, limit: req.limit}).then(function (results) {
                //console.log(results.rows.master);
                //res(results);
                //});
            },
            getUserInc: function (req, res) {

                query = '';
                //franchise_level
                if (req.user.user_type.role_type_slug == 'franchise') {

                    query += " SELECT * FROM franchise_commissions fc "
                    query += " left join franchise_commission_levels fl "
                    query += " on fc.franchise_commission_level_id=fl.id "
                    query += " where franchise_slug=? and product_id=? and fc.is_active =1 "

                    sequelize.query(query,
                            {replacements: [req.user.franchise_level, req.where.product_id], type: sequelize.QueryTypes.SELECT}
                    ).then(function (data) {
                        //console.log(data);
                        res(data);
                    });

                } else {

                    query += "SELECT c.id cid,m.role_type_name master_name,c.is_active is_active,c.role_type_id mid, "
                    query += "group_concat(s.service_details_name order by c.id) service_details_name, "
                    query += "group_concat(c.commission_type order by c.id) commission_type, "
                    query += "group_concat(c.commission_value order by c.id) commission_value "
                    query += "FROM commissions c "
                    query += "left join role_types m on c.role_type_id=m.id "
                    query += "left join service_details s on c.service_detail_id=s.id "
                    query += "where c.product_id=? and c.role_type_id=? and c.is_active = 1 "
                    query += "group by c.role_type_id order by c.id desc "

                    sequelize.query(query,
                            {replacements: [req.where.product_id, req.user.role_type_id], type: sequelize.QueryTypes.SELECT}
                    ).then(function (data) {
                        //console.log(data);
                        res(data);
                    });

                }

                //var master = myModel.belongsTo(sequelize.models.Master, {foreignKey: 'master_type_id', as: 'master'});

                //myModel.findAndCountAll({where: req.where, order: 'id DESC', include: [{model: master, where: {master_type: 1}}], offset: req.offset, limit: req.limit}).then(function (results) {
                //console.log(results.rows.master);
                //res(results);
                //});
            },
            getUserSp: function (req, res) {

                query = '';
                query += " SELECT  "
                query += " sb.bonus_value nc1_b,concat_ws(' To : ',date_format(sb.start_date,'%d-%m-%Y'),date_format(sb.end_date,'%d-%m-%Y')) nc1, "
                query += " sb2.bonus_value nc3_b,concat_ws(' To : ',date_format(sb2.start_date,'%d-%m-%Y'),date_format(sb2.end_date,'%d-%m-%Y')) nc3 "
                query += " FROM users u "
                query += " left join special_bonus sb on  u.special_bonus_id=sb.id "
                query += " left join special_bonus sb2 on  u.special_bonus_id_membership=sb2.id where u.id=? "

                sequelize.query(query,
                        {replacements: [req.user.id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    //console.log(data);
                    res(data);
                });
                //var master = myModel.belongsTo(sequelize.models.Master, {foreignKey: 'master_type_id', as: 'master'});

                //myModel.findAndCountAll({where: req.where, order: 'id DESC', include: [{model: master, where: {master_type: 1}}], offset: req.offset, limit: req.limit}).then(function (results) {
                //console.log(results.rows.master);
                //res(results);
                //});
            },
            checkIfExistServiceProviderCommision: function (values, res) {
                var conditions = {}
                if (values.body.id == '') {
                    conditions = {role_type_id: values.body.role_type_id, product_id: values.body.product_id}
                } else {
                    conditions = {role_type_id: values.body.role_type_id, id: {$ne: values.body.id}, product_id: values.body.product_id}
                }

                myModel.count({where: conditions}).then(function (dataCount) {
                    var dataResult = {};
                    if (dataCount == 0) {
                        dataResult.status = 1;
                    } else {
                        dataResult.status = 0;
                    }
                    res(dataResult);
                });
            },
            checkAlreadyExist: function (values, res) {
                if (values.body.id == '') {
                    var conditions = {role_type_id: values.body.role_type_id, product_id: values.body.product_id}

                    myModel.count({where: conditions}).then(function (dataCount) {
                        var dataResult = {};
                        if (dataCount == 0) {
                            dataResult.status = 1;
                        } else {
                            dataResult.status = 0;
                        }
                        res(dataResult);
                    });
                } else {
                    var dataResult = {};
                    dataResult.status = 1;
                    res(dataResult);
                }
            },
            getAllFeesValues: function (req, res) {

                var relationGet = sequelize.models.SlabHeadFees.belongsTo(myModel, {foreignKey: 'slab_heads_id', as: 'slab_head'});
                var servicesGet = myModel.belongsTo(sequelize.models.ServiceDetail, {foreignKey: 'service_details_id', as: 'services'});
                var slabGet = myModel.belongsTo(sequelize.models.Slab, {foreignKey: 'slab_id', as: 'slab'});
                whereData = {}//{service_details_name: 'ss'};

                sequelize.models.SlabHeadFees.findAndCountAll({
                    where: whereData,
                    offset: req.offset,
                    limit: req.limit,
                    include: [{association: relationGet, include: [servicesGet, slabGet]}]}).then(function (results) {
                    res(results);
                });
            },
            getAllValuesPaging: function (where, res) {
                myModel.findAndCountAll({
                    where: where,
                    offset: 3,
                    limit: 3,
                }).then(function (results) {
                    console.log(results);
                    res(results);
                });
            },
            getByEmail: function (email, res) {
                myModel.findOne({where: {email: email}}).then(function (users) {
                    res(users);
                });
            },
            getById: function (id, res) {
                myModel.findOne({where: {id: id}}).then(function (users) {
                    res(users);
                });
            },
            changeStatus: function (values, res) {
                myModel.update(values.body, {where: values.where}).then(function (results) {
                    res(results);
                });
            },
            saveAllValueProvider: function (values, res) {

                var id = values.body.id;
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
            saveAllValues: function (values, res) {

                id = values.body.id;
                if (typeof id !== 'undefined' && id != '') {
                    sequelize.models.Commision.destroy({
                        where: {role_type_id: values.body.role_type_id}});
                    count = 0;
                    saveArrInc = [];
                    async.each(values.body.service_id, function (rowsDate, callback) {

                        saveArrIncAdd = {};
                        saveArrIncAdd['product_id'] = values.body.product_id;
                        saveArrIncAdd['role_type_id'] = values.body.role_type_id;
                        saveArrIncAdd['service_detail_id'] = rowsDate;
                        saveArrIncAdd['commission_type'] = values.body.feeType[count];
                        saveArrIncAdd['commission_value'] = values.body.commission_value[count];


                        saveArrIncAdd['is_active'] = 0
                        if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
                            saveArrIncAdd['is_active'] = 1
                        }
                        saveArrInc.push(saveArrIncAdd);
                        count++;
                        callback();
                    }, function (err) {
                        console.log(err);
                    });
                    sequelize.models.Commision.bulkCreate(saveArrInc);


                    var results = {};
                    results.status = 1;
                    res(results);
                } else {
                    async.each(values.body.role_type_id, function (master_type_ids, callback2) {
                        count = 0;
                        saveArrInc = [];
                        async.each(values.body.service_id, function (rowsDate, callback) {

                            saveArrIncAdd = {};
                            saveArrIncAdd['product_id'] = values.body.product_id;
                            saveArrIncAdd['role_type_id'] = master_type_ids;//alues.body.master_type_id;
                            saveArrIncAdd['service_detail_id'] = rowsDate;
                            saveArrIncAdd['commission_type'] = values.body.feeType[count];
                            saveArrIncAdd['commission_value'] = values.body.commission_value[count];

                            saveArrIncAdd['is_active'] = 0
                            if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
                                saveArrIncAdd['is_active'] = 1
                            }

                            saveArrInc.push(saveArrIncAdd);
                            count++;
                            callback();
                        }, function (err) {
                            console.log(err);
                        });
                        sequelize.models.Commision.bulkCreate(saveArrInc);

                    }, function (err) {
                        console.log(err);
                    });

                    var results = {};
                    results.status = 1;
                    res(results);
                }





//                var id = values.body.id;
//
//                var heads_id = [];
//                var fee_type = [];
//                var amount = [];
//                var saveArrInc = [];
//                var saveArrIncAdd = {};
//                var count = 0;
//                feeType = values.body.feeType.filter(function (n) {
//                    return n != undefined
//                });
//                async.each(values.body.heads_id, function (rowsDate, callback) {
//                    console.log(feeType); // print the key
//                    saveArrIncAdd = {};
//                    if (typeof id !== 'undefined' && id != '') {
//                        saveArrIncAdd['slab_heads_id'] = id;
//                    }
//                    saveArrIncAdd['heads_id'] = rowsDate;
//                    saveArrIncAdd['fee_type'] = feeType[count];
//                    saveArrIncAdd['amount'] = values.body.amount[count];
//                    saveArrInc.push(saveArrIncAdd);
//                    count++;
//                    callback();
//
//                }, function (err) {
//                    console.log('iterating done');
//                });
//
//
//                var saveData = values.body;
//                service_details_id_arr = saveData['service_details_id'];
//                delete saveData['service_details_id'];
//                delete saveData['feeType'];
//                delete saveData['heads_id'];
//                delete saveData['amount'];
//                delete saveData['id'];
//                saveData['service_details_id'] = 1;
//                saveData['slab_head_fees'] = saveArrInc;
//
//
//                if (typeof id !== 'undefined' && id != '') {
//                    delete values.body.id;
//                    myModel.update(saveData, {where: {id: id}}).then(function (results) {
//
//                        sequelize.models.SlabHeadFees.destroy({where: {slab_heads_id: id}});
//                        console.log(saveArrInc);
//                        sequelize.models.SlabHeadFees.bulkCreate(saveArrInc);
//
//                        results.status = 1;
//                        res(results);
//                    }).catch(function (err) {
//                        console.log(err);
//                        var errors = err;
//                        errors.status = false;
//                        res(errors);
//                    });
//
//                } else {
//
//
//                    var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'slab_head_fees'});
//
//                    var id = values.body.id;
//                    if (typeof values.body.id !== 'undefined' && values.body.id != '') {
//
//                        myModel.update(saveData, {where: {id: id}}).then(function (results) {
//                            results.status = 1;
//                            res(results);
//                        }).catch(function (err) {
//                            console.log(err);
//                            var errors = err;
//                            errors.status = false;
//                            res(errors);
//                        });
//
//                    } else {
//                        delete values.body.id;
//
//                        async.each(service_details_id_arr, function (ids, callback) {
//                            saveData['service_details_id'] = ids;
//                            myModel.create(saveData, {include: [relationSave]}).then(function (results) {
//
//                            }).catch(function (err) {
////                                console.log(err);
////                                var errors = err;
////                                errors.status = false;
////                                res(errors);
//                            });
//                        }, function (err) {
//                            console.log('iterating done');
//                        });
//                        var results = {};
//                        results.status = 1;
//                        res(results);
//
//                    }
//
//                }

            }
        },
        hooks: {
            beforeCreate: function (values, options) {
                if (typeof values.is_active === 'undefined') {
                    values.is_active = 0;
                }

                values.password = bcrypt.hashSync(values.password, null, null);
            }
        }
    }
    );
    return myModel;
};
