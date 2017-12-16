//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
//var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("MembershipExemptions",
            {
                slab_id: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isUnique: function (value, next) {
                            var self = this;

                            myModel.find({
                                where: {slab_id: value},
                                attributes: ['id'],
                            })
                                    .then(function (data) {
                                        if (data && Number(self.id) !== data.id) {
                                            return next(i18n_Validation.__('AlreadyExist', 'Slab'));
                                        }
                                        return next();
                                    })
                                    .catch(function (err) {
                                        return next(err);
                                    });
                        },
                    }
                },
                min_value: {
                    type: DataTypes.STRING,
                    validate: {
                        isNumeric: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
                percentage: {
                    type: DataTypes.STRING,
                    validate: {
                        isFloat: {
                            msg: i18n_Validation.__('Please_Enter', 'numeric value')
                        },
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        }
                    }
                },
            },
            {
                tableName: 'membership_exemptions',
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
                        var MembershipExemptionsBelongsToSlab = myModel.belongsTo(sequelize.models.Slab, {as: 'slabs', foreignKey: 'slab_id'});
                        myModel.findAll(
                                {
                                    where: req.where,
                                    include: [
                                        {association: MembershipExemptionsBelongsToSlab}
                                    ]
                                }).then(function (results) {
                            res(results);
                        });
                    },
                    getFirstValues: function (req, res) {
                        myModel.findOne({where: req.where}).then(function (results) {
                            res(results);
                        });
                    },
                    getAllValuesPaging: function (req, res) {
                        var MembershipExemptionsBelongsToSlab = myModel.belongsTo(sequelize.models.Slab, {as: 'slabs', foreignKey: 'slab_id'});
                        myModel.findAndCountAll({
                            where: req.where,
                            offset: req.offset,
                            limit: req.limit,
                            order: 'id DESC',
                            include: [
                                {association: MembershipExemptionsBelongsToSlab}
                            ],
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
                    saveAllValues: function (req, res) {
                        console.log(req.body)
                        myModel.create(req.body).then(function (results) {
                            results.status = 1;
                            res(results);
                        }).catch(function (err) {
                            var errors = err;
                            errors.status = false;
                            res(errors);
                        });
                    },
                    updateAllValues: function (req, res) {

                        req.where = {id: req.body.id};
                        myModel.update(req.body, {where: req.where}).then(function (data) {
                            var results = {};
                            results = req.body;
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
//                instance.set('tax_slug', slugify(instance.get('tax_name')));
                    }
                }

            }

    );

    return myModel;
};
