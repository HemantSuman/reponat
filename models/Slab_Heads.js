//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("SlabHead",
            {
                service_details_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                slab_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                    }
                },
                is_active: {
                    type: DataTypes.INTEGER
                },
                product_id: {
                    type: DataTypes.INTEGER
                }
            },
    {
        tableName: 'slab_heads',
        classMethods: {
            associate: function (models) {
                var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'bussiness_detail'})
            },
            method1: function (req, res) {
                myModel.findAll().then(function (users) {
                    res(users);
                });
            },
            getAllValues: function (where, res) {
                myModel.findAll({where: where}).then(function (results) {
                    res(results);
                });
            }
            ,
            getAllFeesValues: function (req, res) {

//                var relationGet = sequelize.models.SlabHeadFees.belongsTo(myModel, {foreignKey: 'slab_heads_id', as: 'slab_head'});
//                var servicesGet = myModel.belongsTo(sequelize.models.ServiceDetail, {foreignKey: 'service_details_id', as: 'services'});
//                var slabGet = myModel.belongsTo(sequelize.models.Slab, {foreignKey: 'slab_id', as: 'slab'});
//
//                //var slabHead = sequelize.models.SlabHeadFees.belongsTo(sequelize.models.Head, {foreignKey: 'heads_id', as: 'head'});
//
//                whereData = {}//{service_details_name: 'ss'};
//
//                sequelize.models.SlabHeadFees.findAndCountAll({
//                    where: {
//                        $and: [['EXISTS( SELECT * FROM slab_heads WHERE product_id = ? )', req.params.product_id]]
//                    },
//                    order: 'id DESC',
//                    offset: req.offset,
//                    limit: req.limit,
//                    include: [{association: relationGet, include: [servicesGet, slabGet]}]}).then(function (results) {
//                    res(results);
//                });

                var whr = ''
                if (req.query.service_details_id) {
                    whr += " and sh.service_details_id= " + req.query.service_details_id;
                }
                if (req.query.slab_id) {
                    whr += " and sh.slab_id= " + req.query.slab_id;
                }
                //and service_details_id=1 and slab_id=1
                query = '';
                query += " SELECT s_fees.id fee_id,sh.id sh_id,sd.service_details_name, "
                query += " s.name,h.heads_name,sh.is_active,s_fees.amount,s_fees.fee_type "
                query += " FROM slab_head_fees s_fees "
                query += " left join slab_heads sh on s_fees.slab_heads_id=sh.id "
                query += " left join service_details sd on sd.id=sh.service_details_id "
                query += " left join slab s on s.id=sh.slab_id "
                query += " left join heads h on h.id=s_fees.heads_id "
                query += " where sh.product_id=? " + whr
                query += " order by s.name asc,s_fees.id desc "
                sequelize.query(query,
                        {replacements: [req.params.product_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    console.log(data);
                    res(data);
                });
            }
            ,
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
            saveAllValues: function (values, res) {

                var id = values.body.id;

                var heads_id = [];
                var fee_type = [];
                var amount = [];
                var saveArrInc = [];
                var saveArrIncAdd = {};
                var count = 0;
                fee_type = values.body.fee_type.filter(function (n) {
                    return n != undefined
                });
                async.each(values.body.heads_id, function (rowsDate, callback) {
                    //console.log(fee_type); // print the key
                    saveArrIncAdd = {};
                    if (typeof id !== 'undefined' && id != '') {
                        saveArrIncAdd['slab_heads_id'] = id;
                    }
                    saveArrIncAdd['heads_id'] = rowsDate;
                    saveArrIncAdd['fee_type'] = fee_type[count];
                    saveArrIncAdd['amount'] = values.body.amount[count];
                    saveArrInc.push(saveArrIncAdd);
                    count++;
                    callback();

                }, function (err) {
                    console.log('iterating done');
                });

                 console.log('W----------------------------------');
                var saveData = values.body;
                service_details_id_arr = saveData['service_details_id'];
                delete saveData['service_details_id'];
                delete saveData['fee_type'];
                delete saveData['heads_id'];
                delete saveData['amount'];
                delete saveData['id'];
                //saveData['service_details_id'] = 1;
                saveData['slab_head_fees'] = saveArrInc;


                if (typeof id !== 'undefined' && id != '') {
                    delete values.body.id;
                    myModel.update(saveData, {where: {id: id}}).then(function (results) {

                        //sequelize.models.SlabHeadFees.destroy({where: {slab_heads_id: id}});


                        sequelize.models.SlabHeadFees.destroy({where: {slab_heads_id: id}}).then(function (deleteResults) {

                        sequelize.models.SlabHeadFees.bulkCreate(saveArrInc);

                        results.status = 1;
                        res(results);    


                        });




                        //console.log(saveArrInc);
                        
                    }).catch(function (err) {
                        console.log(err);
                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });

                } else {

                    console.log('W----------------------------------');
                    var relationSave = myModel.hasMany(sequelize.models.SlabHeadFees, {foreignKey: 'slab_heads_id', as: 'slab_head_fees'});

                    var id = values.body.id;
                    if (typeof values.body.id !== 'undefined' && values.body.id != '') {

                        myModel.update(saveData, {where: {id: id}}).then(function (results) {
                            results.status = 1;
                            res(results);
                        }).catch(function (err) {
                            console.log(err);
                            var errors = err;
                            errors.status = false;
                            res(errors);
                        });

                    } else {
                        delete values.body.id;
                        console.log('W----------------------------------');
                        async.each(service_details_id_arr, function (ids, callback) {
                            saveData['service_details_id'] = ids;
                            myModel.create(saveData, {include: [relationSave]}).then(function (results) {

                            }).catch(function (err) {
//                                console.log(err);
//                                var errors = err;
//                                errors.status = false;
//                                res(errors);
                            });
                        }, function (err) {
                            console.log('iterating done');
                        });
                        var results = {};
                        results.status = 1;
                        res(results);

                    }

                }

            },
            checkAlreadyExist: function (values, res) {
                var service_details_ids = values.body.service_details_id;
                var slab_id = values.body.slab_id;

                var whereCond = '';

                if (typeof values.body.id !== 'undefined' && values.body.id != '') {
                    whereCond = {
                        id: {
                            $ne: values.body.id
                        },
                        service_details_id: service_details_ids,
                        slab_id: slab_id,
                        product_id: values.body.product_id
                    }
                } else {
                    whereCond = {
                        service_details_id: service_details_ids,
                        slab_id: slab_id,
                        product_id: values.body.product_id
                    }
                }

                myModel.findAndCountAll({
                    where: whereCond
                }).then(function(result) {
                    console.log(result.count);
                    //console.log(result.rows);
                    var results = {}
                    if (result.count > 0) {
                        results.status = false;
                    } else {
                        results.status = true;
                    }
                    res(results);
                });
            },
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
