//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("UserFranchise",
            {
                user_id: {
                    type: DataTypes.STRING
                },
                offline_date: {
                    type: DataTypes.STRING
                },
                franchise_id: {
                    type: DataTypes.STRING
                },
                total_credit: {
                    type: DataTypes.STRING
                },
                available_credit: {
                    type: DataTypes.INTEGER,
                },
                created: {
                    type: DataTypes.INTEGER
                }
            },
            {
                tableName: 'user_franchises',
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
                        if (values.body.is_active === 'on') {
                            values.body.is_active = 1;
                        } else {
                            values.body.is_active = 0;
                        }
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
                    updateValues: function (values, res) {
                        myModel.update(values.body, {
                            where: values.where
                        }).then(function (results) {
                            var results = {}
                            results.status = 1;
                            res(results);
                        });
                    },
                    getCreditPoints: function (req, res) {

                        var query = '';
                        query += ' SELECT sum(total_credit) total_credit, sum(available_credit) available_credit, (sum(total_credit) - sum(available_credit)) used_credit, ';
                        query += ' (SELECT available_credit from user_franchises where user_id = ? and franchise_id = ?) credit_avil_franchise ';
                        query += ' FROM user_franchises WHERE user_id = ? ';

                        sequelize.query(query,
                                {replacements: [req.user.id, req.ProfessinalAPid, req.user.id], type: sequelize.QueryTypes.SELECT}
                        ).then(function (data) {
                            res(data);
                        });
                    },
                    updateAvailCreditPoints: function (req, res) {

                        var updateQuery = '';
                        updateQuery = ' update user_franchises set available_credit=available_credit-1 where user_id=? and franchise_id=? ';
                        sequelize.query(updateQuery,
                                {replacements: [req.user.id, req.ProfessinalAPid]}
                        ).then(function (data) {
                            res(data);
                        });
                    }
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
