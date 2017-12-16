//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var async = require("async");
var moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("Acl",
            {
                role_id: {
                    type: DataTypes.STRING,
                },
                role_type_id: {
                    type: DataTypes.STRING,
                },
                name: {
                    type: DataTypes.STRING,
                },
                slug: {
                    type: DataTypes.STRING,
                },
                url: {
                    type: DataTypes.STRING,
                },
                icon: {
                    type: DataTypes.STRING,
                },
                position: {
                    type: DataTypes.STRING,
                },
                show: {
                    type: DataTypes.STRING,
                },
                allow: {
                    type: DataTypes.STRING,
                },
                slug_value: {
                    type: DataTypes.STRING,
                },
                slug_name: {
                    type: DataTypes.STRING,
                },
                type: {
                    type: DataTypes.STRING,
                }
            },
    {
        tableName: 'acl',
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

                if (typeof req.user.user_type !== 'undefined') {
                    console.log(req.user);

                    console.log('userData------------------------');
                    //console.log(userData);
                    var role_list = myModel.hasMany(sequelize.models.AclList, {foreignKey: 'acl_id', as: 'role_list'})
                    myModel.findAll({
                        where: {role_type_id: req.user.role_type_id},
                        //where: ["role_type_id = "+req.user.role_type_id+" and role_list.sh ow like '%oo%'"],
                        //where: {role_type_id: req.user.role_type_id},
                        order: 'position,role_list.position',
                        //include: [role_list],
                        include: [{association: role_list, where: {show: 1}, required: false, order: 'position'}]
                    }).then(function (results) {
                        res(results);
                        //console.log(results);
                    });
                } else {
                    res({});
                }
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
            getFirstValues: function (req, res) {
                myModel.findOne({where: req.where}).then(function (results) {
                    res(results);
                });
            },
            getAllValuesRole: function (req, res) {

                if (typeof req.user.user_type !== 'undefined') {
                    //console.log(req.user);

                    console.log('userData222222------------------------');
                    //console.log(userData);
                    var role_list = myModel.hasMany(sequelize.models.AclList, {foreignKey: 'acl_id', as: 'role_list'})
                    myModel.findAll({
                        where: {role_type_id: req.user.role_type_id},
                        order: 'Acl.position, max(role_list.position)',
                        include: [
                            {association: role_list, attributes: [
                                    'id',
                                    'acl_list_name',
                                    'acl_id',
                                    'acl_list_slug',
                                    'acl_list_url',
                                    'position',
                                    'show',
                                    'allow',
                                    'slug_value',
                                    'slug_name',
                                    'type',
                                    'icon',
                                    [sequelize.fn('group_concat', sequelize.literal('role_list.id order by role_list.type')), 'icon'],
                                    [sequelize.fn('group_concat', sequelize.literal('role_list.type order by role_list.type')), 'position'],
                                ],
                                where: {
                                    acl_list_slug : {
                                        $notIn: ['admin-users-role-types', 'admin-users'],
                                    }
                                },
                                //order: sequelize.literal('order by role_list.position asc'),
                                //group: 'acl_list_slug'
                            }],
                        group: 'acl_list_slug',
                        //raw: true
                        //include: [{association: role_list, where: {role_id: req.user.user_type.role_id}}]
                    }).then(function (results) {

                        //results1 = results.get({plain: true});

                        //results = results.get({plain: true});
                        //console.log(results[0].role_list);
                        res(results);
                        //console.log(results);
                    });
                } else {
                    res({});
                }
            },
            getAssignRoles: function (role_type_id, res) {
                var query = '';

                query += ' select a1.id, a1.slug, a2.acl_list_slug, a2.type from acl a1 ';
                query += ' left join acl_lists a2 on a1.id = a2.acl_id ';
                query += ' where role_type_id = ? ';

                sequelize.query(query,
                        {replacements: [role_type_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    res(data)
                })
            },
            getAllValueForDeletePer: function (values, res) {
                myModel.findAll({where: values.where}).then(function (results) {
                    res(results);
                });
            },
            deleteAllAclLists: function (values, res) {
                myModel.destroy({
                    where: values.where
                }).then(function (results) {
                    res(results);
                });
            },
            getAllRecords: function (values, res) {
                myModel.findAll({where: values.where}).then(function (results) {
                    res(results);
                });
            },
        }

    }

    );

    return myModel;
};
