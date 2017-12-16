//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var slugify = require('slugify')

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("FranchiseLevel",
            {
                user_id: {
                    type: DataTypes.STRING
                },
                parent_franchise: {
                    type: DataTypes.STRING
                },
                franchise_commission_level_id: {
                    type: DataTypes.STRING
                },
                franchise_level: {
                    type: DataTypes.STRING
                },
                country_id: {
                    type: DataTypes.INTEGER,
                },
                state_id: {
                    type: DataTypes.INTEGER
                },
                division_id: {
                    type: DataTypes.INTEGER
                },
                district_id: {
                    type: DataTypes.INTEGER
                },
                tehsil_id: {
                    type: DataTypes.INTEGER
                },
                tehsil_id: {
                    type: DataTypes.INTEGER
                },
            },
            {
                tableName: 'franchise_levels',
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
                        if (values.body.is_active === 'on') {
                            values.body.is_active = 1;
                        } else {
                            values.body.is_active = 0;
                        }
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
                    getAllParentFromTehsilId: function (req, res) {
                        console.log(req.body);
                        var qry = " SELECT ";
                        qry += " user_id tehsil_level, ";
                        qry += " (select parent_franchise from franchise_levels where user_id = tehsil_level limit 1) district_level, ";
                        qry += " (select parent_franchise from franchise_levels where user_id = district_level limit 1) division_level, ";
                        qry += " (select parent_franchise from franchise_levels where user_id = division_level limit 1) state_level, ";
                        qry += " (select parent_franchise from franchise_levels where user_id = state_level limit 1) country_level ";
                        qry += " FROM franchise_levels where user_id = ? limit 1 ";

                        sequelize.query(qry,
                                {replacements: [req.body.tehsil_ap], type: sequelize.QueryTypes.SELECT}
                        ).then(function (results) {

                            res(results);
                        })
                    },
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
