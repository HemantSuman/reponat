var async = require("async");
//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
// setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});
i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
module.exports = function (sequelize, DataTypes) {
    console.log('module.exports.login');
    var myModel = sequelize.define("Franchise",
            {
                franchise_commission_level_id: {
                    type: DataTypes.STRING
                },
                country_id: {
                    type: DataTypes.STRING
                },
                state_id: {
                    type: DataTypes.STRING
                },
                division_id: {
                    type: DataTypes.STRING
                },
                district_id: {
                    type: DataTypes.STRING
                },
                tehsil_id: {
                    type: DataTypes.STRING
                },
                parent_franchise: {
                    type: DataTypes.STRING
                },
                user_id: {
                    type: DataTypes.STRING
                },
                franchise_level: {
                    type: DataTypes.STRING
                }
            },
    {
        tableName: 'franchise_levels',
        classMethods: {
            associate: function (models) {
                //var mymodelBussinessHasOne = myModel.hasOne(models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
            },
            method1: function (req, res) {
                myModel.findAll().then(function (users) {
                    res(users);
                });
            },
            getDataByLevel: function (req, res) {
                var query = '';
                var table = '';
                var col = '';
                var selCol = '';
                var parCol = '';

                if (req.data && req.data.franchise.franchise_level == 'state_level') {
                    table = 'states';
                    col = 'state_id';
                    selCol = 'state_name';
                    parCol = 'country_id';
                }

                if (req.data && req.data.franchise.franchise_level == 'division_level') {
                    table = 'divisions';
                    col = 'division_id';
                    selCol = 'division_name';
                    parCol = 'state_id';
                }

                if (req.data && req.data.franchise.franchise_level == 'district_level') {
                    table = 'districts';
                    col = 'district_id';
                    selCol = 'district_name';
                    parCol = 'division_id';
                }

                if (req.data && req.data.franchise.franchise_level == 'tehsil_level') {
                    table = 'tehsils';
                    col = 'tehsil_id';
                    selCol = 'tehsil_name';
                    parCol = 'district_id';
                }
                query += ' SELECT id, ' + selCol + ' name FROM ' + table + ' where ' + parCol + ' in (SELECT ' + parCol + ' FROM franchise_levels where user_id=? ) and id not in (SELECT ' + col + ' FROM franchise_levels where user_id=? ) ';
                if (req.data && req.data.franchise.franchise_level == 'country_level') {
                    table = 'countries';
                    col = 'country_id';
                    selCol = 'country_name';
                    parCol = 'country_id';
                    query = '';
                    query += ' SELECT id, ' + selCol + ' name FROM ' + table + ' where id not in (SELECT ' + col + ' FROM franchise_levels where user_id=? ) ';
                }

                sequelize.query(query,
                        {replacements: [req.data.id, req.data.id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    res(data);
                });
            },
            getTehsilByAp: function (req, res) {
                query = '';
                query += ' SELECT * FROM franchise_levels fl left join tehsils th on fl.tehsil_id=th.id where user_id=?';
                sequelize.query(query,
                        {replacements: [req.user.id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    res(data);
                });
            },
            getTehsilId: function (req, res) {

                console.log(req.user_id);

                if (!req.user_id || req.user_id == '') {
                    req.user_id = req.user.id;
                }

                query = '';
                query += ' select * from franchise_levels where parent_franchise=? limit 1';
                sequelize.query(query,
                        {replacements: [req.user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {

                    console.log('^^^^^^^^^^^^^^');
                    console.log(data);
                    data = data[0];
                    if (data) {
                        if (data.franchise_level == 'tehsil_level') {
                            console.log(data);
                            console.log('data...................................ITS DONE......................');
                            console.log(data.user_id);
                            res(data.user_id);
                        } else {
                            req.user_id = data.user_id;
                            console.log(req.user_id);
                            sequelize.models.Franchise.getTehsilId(req, function (results) {
                                res(results);
                            });
                        }
                    } else {
                        res(req.user_id);
                    }
                });

            },
            getAllValues: function (where, res) {
                myModel.findAll({where: where}).then(function (results) {
                    res(results);
                });
            },
            getList: function (req, res) {

                console.log(req.query);
                var whr = '';
                whrArr = [];



                if (req.query && req.query.franchise_level) {
                    whr += ' and franchise_level=? ';
                    whrArr.push(req.query.franchise_level);
                }

                if (req.query && req.query.franchise_type) {
                    whr += ' and franchise_type=? ';
                    whrArr.push(req.query.franchise_type);
                }
                if (req.query && req.query.first_name) {
                    whr += ' and first_name like ? ';
                    whrArr.push('%' + req.query.first_name + '%');
                }

                if (req.query && req.query.mobile) {
                    whr += ' and mobile like ? ';
                    whrArr.push('%' + req.query.mobile + '%');
                }

                if (req.query && req.query.state_id) {
                    whr += ' and fl.state_id=? ';
                    whrArr.push(req.query.state_id);
                }


                if (req.query && req.query.division_id) {
                    whr += ' and fl.division_id=? ';
                    whrArr.push(req.query.division_id);
                }


                if (req.query && req.query.district_id) {
                    whr += ' and fl.district_id=? ';
                    whrArr.push(req.query.district_id);
                }

                if (req.query && req.query.tehsil_id) {
                    whr += ' and fl.tehsil_id=? ';
                    whrArr.push(req.query.tehsil_id);
                }



                slab_query = '';
                slab_query += ' SELECT '
                slab_query += ' *,u.id id FROM '
                slab_query += '  users u left join franchise_levels fl on u.id=fl.user_id '
                slab_query += ' left join countries c on fl.country_id=c.id   '
                slab_query += ' left join states s on fl.state_id=s.id '
                slab_query += ' where franchise_type in (0,1) group by u.id order by fl.id desc '



                slab_query = '';
                slab_query += ' SELECT '
                slab_query += ' *,u.id id,u.is_active is_active,spb.bonus_name b_name_ny,spb.bonus_value b_rate_ny,spb2.bonus_name b_name_ny2,spb2.bonus_value b_rate_ny2, '
                slab_query += ' concat_ws("/",c.country_name,s.state_name,dv.division_name,ds.district_name) p_location, '

                slab_query += ' (SELECT '
                slab_query += ' group_concat( '
                slab_query += ' CASE  '
                slab_query += ' WHEN fl_sub.franchise_level ="country_level" THEN c.country_name '
                slab_query += ' WHEN fl_sub.franchise_level ="state_level" THEN s.state_name '
                slab_query += ' WHEN fl_sub.franchise_level ="division_level" THEN dv.division_name '
                slab_query += ' WHEN fl_sub.franchise_level ="district_level" THEN ds.district_name '
                slab_query += ' ELSE t.tehsil_name '

                slab_query += ' END) as mesto_utovara '
                slab_query += ' FROM  '
                slab_query += ' franchise_levels fl_sub left join countries c on fl_sub.country_id=c.id '
                slab_query += ' left join states s on fl_sub.state_id=s.id '
                slab_query += ' left join divisions dv on fl_sub.division_id=dv.id '
                slab_query += ' left join districts ds on fl_sub.district_id=ds.id '
                slab_query += ' left join tehsils t on fl_sub.tehsil_id=t.id '
                slab_query += ' where user_id=fl.user_id '
                slab_query += ' group by user_id limit 1 ) ap_areas '

                slab_query += '  FROM users u left join franchise_levels fl on u.id=fl.user_id '
                slab_query += ' left join countries c on fl.country_id=c.id   '
                slab_query += ' left join states s on fl.state_id=s.id '
                slab_query += ' left join divisions dv on fl.division_id=dv.id '
                slab_query += ' left join districts ds on fl.district_id=ds.id '
                slab_query += ' left join special_bonus spb on u.special_bonus_id=spb.id '
                slab_query += ' left join special_bonus spb2 on u.special_bonus_id_membership=spb2.id '

                slab_query += ' where franchise_type in (0,1) ' + whr + ' group by u.id order by fl.id desc '





                sequelize.query(slab_query,
                        {replacements: whrArr, type: sequelize.QueryTypes.SELECT}
                ).then(function (service_slab) {
                    res(service_slab);
                });


            },
            getApScale: function (req, res) {

                var apScale = req.params.type;
                var apScaleJoin = req.params.type;
                var apScalePlus = parseInt(apScale) + 1;

                if (req.params.user_id) {
                    var user_id = req.params.user_id;
                } else {
                    var user_id = req.user.id;
                    var apScale = req.params.type;
                    //var apScalePlus = 4;
                    //var apScaleJoin = parseInt(apScale) + 1;
                    noObj = {'country_level': 5, 'state_level': 4, 'division_level': 3, 'district_level': 2};


                    var apScalePlus = noObj[req.user.franchise_level];
                }


                var level1 = 'franchise_state_id';
                var level2 = 'franchise_country_id';
                var locJoin = ' left join states l on fl4.state_id=l.id ';
                var locJoinCol = ' ,group_concat(distinct l.state_name) loc_list ';

                if (apScale == 3) {
                    var level1 = 'franchise_division_id';
                    var level2 = 'franchise_state_id';
                    var locJoin = ' left join divisions l on fl3.division_id=l.id ';
                    var locJoinCol = ' ,group_concat(distinct l.division_name) loc_list ';
                }
                if (apScale == 2) {
                    var level1 = 'franchise_district_id';
                    var level2 = 'franchise_division_id';
                    var locJoin = ' left join districts l on fl2.district_id=l.id ';
                    var locJoinCol = ' ,group_concat(distinct l.district_name) loc_list ';
                }
                if (apScale == 1) {
                    var level1 = 'franchise_id';
                    var level2 = 'franchise_district_id';
                    var locJoin = ' left join tehsils l on fl1.tehsil_id=l.id ';
                    var locJoinCol = ' ,group_concat(distinct l.tehsil_name) loc_list ';
                }

                var orderby = '';
                if (req.query && req.query.nc_order && req.query.nc_order != '') {
                    orderby += '  order by total_ar ' + req.query.nc_order;
                } else
                if (req.query && req.query.m_order && req.query.m_order != '') {
                    orderby += '  order by  total_mp ' + req.query.m_order;
                }
                var loginType = 'franchise_' + req.user.franchise_level;

                if (loginType == 'tehsil_level') {
                    loginType = 'franchise_id'
                }

                loginType = loginType.replace('level', 'id');

                query = '';

                query += ' select * from ( select ap_data.user_id,ap4,ap3,ap2,ap1,fl1,fl2,fl3,fl4, '
                query += ' count(distinct ar.id) total_ar,count(distinct mp.id) total_mp,ap_th_ids,total_pro,first_name,mobile,join_date,email,loc_list, business_name1,gid '
                query += ' from '
                query += ' ( '
                query += ' SELECT fl' + apScale + '.user_id user_id,fl4.user_id fl4,fl3.user_id fl3,fl2.user_id fl2,fl1.user_id fl1, '
                query += ' count(distinct fl4.user_id) ap4,  '
                query += ' count(distinct fl3.user_id) ap3,  '
                query += ' count(distinct fl2.user_id) ap2,  '
                query += ' count(distinct fl1.user_id) ap1, '
                query += ' group_concat(distinct fl1.user_id) ap_th_ids, '
                query += ' count(distinct uf.id) total_pro,u.first_name first_name,u.gid gid,u.mobile mobile,u.added_date join_date,u.email email, ubd.business_name business_name1 '
                query += locJoinCol
                query += ' FROM  '
                query += ' franchise_levels fl5 '
                query += ' left join franchise_levels fl4 on fl5.user_id=fl4.parent_franchise '
                query += ' left join franchise_levels fl3 on fl4.user_id=fl3.parent_franchise '
                query += ' left join franchise_levels fl2 on fl3.user_id=fl2.parent_franchise '
                query += ' left join franchise_levels fl1 on fl2.user_id=fl1.parent_franchise '
                query += ' left join user_franchises uf on fl1.user_id=uf.franchise_id '
                query += ' left join users u on fl' + apScaleJoin + '.user_id=u.id '
                query += ' left join user_busines_details ubd on fl' + apScaleJoin + '.user_id=ubd.user_id '
                query += locJoin
                query += ' where fl' + apScalePlus + '.user_id=' + user_id + ' group by fl' + apScaleJoin + '.user_id '
                query += ' ) ap_data '
                //query += ' left join arbitration_agreements ar on ap_data.user_id=ar.' + level1 + ' and ar.is_active=1 and ar.' + level2 + '= ' + user_id
                //query += ' left join membership_plan_issues mp on ap_data.user_id=mp.' + level1 + ' and mp.is_active=1 and mp.' + level2 + '= ' + user_id

                query += ' left join arbitration_agreements ar on ap_data.user_id=ar.' + level1 + ' and ar.is_active=1 and ar.' + loginType + '= ' + req.user.id
                query += ' left join membership_plan_issues mp on ap_data.user_id=mp.' + level1 + ' and mp.is_active=1 and mp.' + loginType + '= ' + req.user.id

                query += ' group by ap_data.user_id ) final_data where final_data.user_id is not null '
                query += orderby;




                sequelize.query(query,
                        {replacements: [], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    console.log(data);
                    res(data);
                });

            },
            getMyUsers: function (where, res) {

//                console.log(where);
//
                var whr = '';
                var orderby = '';
                var whrArr = [];


                whrArr.push(where.franchise_id, where.role_slug, where.franchise_id,where.franchise_id,where.franchise_id,where.franchise_id, where.role_slug);

                if (where.query && where.query.mobile && where.query.mobile != '') {
                    whr += ' and users.mobile like ? ';
                    whrArr.push('%' + where.query.mobile + '%');
                }
                if (where.query && where.query.area && where.query.area != '') {
                    whr += ' and users.area like ? ';
                    whrArr.push('%' + where.query.area + '%');
                }
                if (where.query && where.query.first_name && where.query.first_name != '') {
                    whr += ' and users.first_name like ? ';
                    whrArr.push('%' + where.query.first_name + '%');
                }
                console.log(where.query);
                if (where.query && where.query.order_by && where.query.order_by != '') {
                    orderby += '  order by users.id ' + where.query.order_by;
                } else
                if (where.query && where.query.nc_order && where.query.nc_order != '') {
                    orderby += '  order by no_card ' + where.query.nc_order;
                } else
                if (where.query && where.query.m_order && where.query.m_order != '') {
                    orderby += '  order by  no_membership ' + where.query.m_order;
                }
                
                var query = '';
                query += ' select *,uf.created franchise_date,uf.user_id id,uf.created created,(select count(users.id) from users users left join user_franchises uf on users.id=uf.user_id left join role_types rt on users.role_type_id=rt.id left join roles r on rt.role_id=r.id  where uf.franchise_id=? and role_slug= ? ) total_user, '
                query += ' ifnull((SELECT sum(if(ar.is_active =1,1,0 )) '
                query += ' FROM arbitration_agreements ar left join arbitration_agreement_fees fee on ar.id=fee.arbitration_agreements_id '
                query += ' where franchise_id = ? AND  user_id=users.id '
                query += ' group by user_id),0) no_card, '
                query += ' ifnull((SELECT sum(arbitration_agreement_total_fees) '
                query += ' FROM arbitration_agreements ar left join arbitration_agreement_fees fee on ar.id=fee.arbitration_agreements_id '
                query += ' where user_id=users.id AND franchise_id = ? '
                query += ' group by user_id),0) card_total, '
                query += ' ifnull((SELECT sum(if(mip.is_active=1,1,0)) '
                query += ' FROM membership_plan_issues mip '
                query += ' where user_id=users.id AND franchise_id = ? '
                query += ' ),0) no_membership '
                query += ' from users users left join user_franchises uf on users.id=uf.user_id left join role_types rt on users.role_type_id=rt.id left join roles r on rt.role_id=r.id  where uf.franchise_id=? '
                query += ' and role_slug= ? ' + whr + ' ' + orderby;
                sequelize.query(query,
                        {replacements: whrArr, type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    res(data);
                });
            },
            getAssociatedDeedWriters: function (where, res) {

//                console.log(where);
//
                var whr = '';
                var orderby = '';
                var whrArr = [];


                whrArr.push(where.franchise_id, where.franchise_id, where.role_type_id);

                if (where.query && where.query.mobile && where.query.mobile != '') {
                    whr += ' and users.mobile like ? ';
                    whrArr.push('%' + where.query.mobile + '%');
                }
                if (where.query && where.query.area && where.query.area != '') {
                    whr += ' and users.area like ? ';
                    whrArr.push('%' + where.query.area + '%');
                }
                if (where.query && where.query.first_name && where.query.first_name != '') {
                    whr += ' and users.first_name like ? ';
                    whrArr.push('%' + where.query.first_name + '%');
                }
                if (where.query && where.query.created && where.query.created != '') {
                    whr += ' and date(uf.created) = ' + 'str_to_date("' + where.query.created + '","%d-%m-%Y")';
//                    whrArr.push();
                }
                if (where.query && where.query.order_by && where.query.order_by != '') {
                    orderby += ' order by users.id ' + where.query.order_by;
                    //whrArr.push('%' + where.query.first_name + '%');
                }


                var query = '';
                query += ' select *,uf.user_id id,uf.created created,added_date,(select count(id) from users where franchise_id=?) total_user, '
                query += ' ifnull((SELECT count(ar.id) '
                query += ' FROM arbitration_agreements ar left join arbitration_agreement_fees fee on ar.id=fee.arbitration_agreements_id '
                query += ' where user_id=users.id '
                query += ' group by user_id),0) no_card, '
                query += ' ifnull((SELECT sum(arbitration_agreement_total_fees) '
                query += ' FROM arbitration_agreements ar left join arbitration_agreement_fees fee on ar.id=fee.arbitration_agreements_id '
                query += ' where user_id=users.id  '
                query += ' group by user_id),0) card_total '
                query += ' from users left join user_franchises uf on users.id=uf.user_id left join role_types rt on users.role_type_id=rt.id  where uf.franchise_id=? '
                query += ' and role_type_slug = ? ' + whr + ' ' + orderby;

                sequelize.query(query,
                        {replacements: whrArr, type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    res(data);
                });
//                sequelize.models.User.findAll({where: where}).then(function (results) {
//                    res(results);
//                });
            },
            getParent: function (req, res) {

                req.body.tehsil_ap = req.app.locals.settingData.admin_ap;//admin_ap//Admin Authorized Promoter (Other than Lawyers) For Tehsil Level (USER ID)
                if(req.body.franchise_type==1){
                req.body.tehsil_ap = req.app.locals.settingData.admin_ap_lawyers;//admin_ap_lawyers//Admin Authorized Promoter (Lawyers) For Tehsil Level (USER ID)
                }
                
                
                sequelize.models['FranchiseLevel'].getAllParentFromTehsilId(req, function (ap_chain) {

                var ap_chain_obj=ap_chain[0];  


                console.log(ap_chain_obj); 



                var uId=ap_chain_obj[req.body.franchise_level];

                console.log(uId); 


                slab_query = '';
                slab_query += ' SELECT * FROM users u join franchise_levels fl on u.id=fl.user_id  where (u.franchise_type=? and fl.' + req.body.key + '=? and fl.franchise_level=? ) or fl.user_id=? group by fl.user_id  '
                //slab_query += ' SELECT * FROM users u join franchise_levels fl on u.id=fl.user_id left join franchise_levels fl2 on u.id=fl2.parent_franchise where u.franchise_type=? and fl.' + req.body.key + '=? and fl.franchise_level=? and fl2.user_id is null '

                sequelize.query(slab_query,
                        {replacements: [req.body.franchise_type, req.body.value, req.body.franchise_level,uId], type: sequelize.QueryTypes.SELECT}
                ).then(function (service_slab) {
                
                res(service_slab);

                    // [ { tehsil_level: 50,
                    //     district_level: 49,
                    //     division_level: 48,
                    //     state_level: 47,
                    //     country_level: 46 } ]

                    // req.body.tehsil_ap = 50;
                    // sequelize.models['FranchiseLevel'].getAllParentFromTehsilId(req, function (ap_chain) {

                    // console.log(ap_chain);    


                    // });    

                 });

                }); 
            },
            getAllValuesPaging: function (req, res) {

                var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                var UserType = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_type'})
                var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'});
                user_type_id = req.where.master_type_id;
                delete req.where.master_type_id;
                myModel.findAndCountAll({
                    where: req.where,
                    offset: req.offset,
                    order: 'id desc',
                    limit: req.limit,
                    //include: [UserBankDetail, UserType],
                    include: [{association: UserType, where: {role_id: req.params.role_id}}, UserBankDetail, UserBusinesDetail]
                }).then(function (results) {
                    //console.log(results);
                    res(results);
                });
            },
            getUserByEmail: function (email, res) {

                var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                var UserType = myModel.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_type'})
                var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'});
                myModel.findOne({where: {email: email}, include: [UserType, UserBankDetail, UserBusinesDetail]}).then(function (users) {
                    res(users);
                });
            },
            getById: function (id, res) {

                var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                var UserBusinesDetail = myModel.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})

                var UserRolesType = sequelize.models.User.belongsTo(sequelize.models.RoleType, {foreignKey: 'role_type_id', as: 'user_roles_type'});
                var UserRoles = sequelize.models.RoleType.belongsTo(sequelize.models.Role, {foreignKey: 'role_id', as: 'user_roles'});


                var Franchise = sequelize.models.User.hasOne(sequelize.models.Franchise, {foreignKey: 'user_id', as: 'franchise'})


                sequelize.models.User.findOne({where: {id: id},
                    include: [
                        {association: Franchise, include: []},
                        {association: UserBankDetail, include: []},
                        {association: UserBusinesDetail, include: []},
                        {association: UserRolesType, include: [{association: UserRoles}]},
                    ]
                }).then(function (users) {

                    slab_query = '';
                    slab_query += ' SELECT '
                    slab_query += ' u.id id,u.is_active is_active, '
                    slab_query += ' concat_ws("/",c.country_name,s.state_name,dv.division_name,ds.district_name) p_location,concat(u_par.first_name," (Mobile - ",u_par.mobile," , Id - ", u_par.id, ") ") p_name, '

                    slab_query += ' (SELECT '
                    slab_query += ' group_concat( '
                    slab_query += ' CASE  '
                    slab_query += ' WHEN fl_sub.franchise_level ="country_level" THEN c.country_name '
                    slab_query += ' WHEN fl_sub.franchise_level ="state_level" THEN s.state_name '
                    slab_query += ' WHEN fl_sub.franchise_level ="division_level" THEN dv.division_name '
                    slab_query += ' WHEN fl_sub.franchise_level ="district_level" THEN ds.district_name '
                    slab_query += ' ELSE t.tehsil_name '

                    slab_query += ' END) as mesto_utovara '
                    slab_query += ' FROM  '
                    slab_query += ' franchise_levels fl_sub left join countries c on fl_sub.country_id=c.id '
                    slab_query += ' left join states s on fl_sub.state_id=s.id '
                    slab_query += ' left join divisions dv on fl_sub.division_id=dv.id '
                    slab_query += ' left join districts ds on fl_sub.district_id=ds.id '
                    slab_query += ' left join tehsils t on fl_sub.tehsil_id=t.id '
                    slab_query += ' where user_id=fl.user_id '
                    slab_query += ' group by user_id limit 1 ) ap_areas '

                    slab_query += '  FROM users u left join franchise_levels fl on u.id=fl.user_id '
                    slab_query += '  left join  users u_par on u_par.id=fl.parent_franchise '
                    slab_query += ' left join countries c on fl.country_id=c.id   '
                    slab_query += ' left join states s on fl.state_id=s.id '
                    slab_query += ' left join divisions dv on fl.division_id=dv.id '
                    slab_query += ' left join districts ds on fl.district_id=ds.id '

                    slab_query += ' where u.franchise_type in (0,1) and u.id=?  group by u.id order by fl.id desc '


                    sequelize.query(slab_query,
                            {replacements: [id], type: sequelize.QueryTypes.SELECT}
                    ).then(function (service_slab) {
                        //res(service_slab);
                        //res(users);
                        var user = {};
                        user = users.get({plain: true});
                        if (service_slab.length) {
                            user.p_location = service_slab[0].p_location;
                            user.ap_areas = service_slab[0].ap_areas;
                            user.p_name = service_slab[0].p_name;
                        } else {
                            user.p_location = '';
                            user.ap_areas = '';
                            user.p_name = '';
                        }
                        //console.log(user);
                        res(user);
                    });

                });
            },
            changeStatus: function (values, res) {
                myModel.update(values.update, {where: values.where}).then(function (results) {
                    res(results);
                });
            },
            applyBonus: function (req, res) {
                async.forEachOf(req.body.ids, function (getData, key, callback) {

                    myModel.update({special_bonus_id: req.body.special_bonus_id}, {where: {id: getData}}).then(function (data) {

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

                if (1) {
                    delete values.body.id;
                    values.body.is_complete_registration = 1
                    myModel.update(values.body, {where: {id: values.user.id}}).then(function (results) {
                        console.log(values.body.user_busines_details);
                        if (typeof values.body.user_busines_details === 'undefined') {
                            values.body.user_busines_details = {id: ''};
                        }
                        if (typeof values.body.user_bank_details === 'undefined') {
                            values.body.user_bank_details = {id: ''};
                        }

                        sequelize.models.UserBusinesDetail.update(values.body.user_busines_details, {where: {user_id: values.user.id}}).then(function (results) {
                            sequelize.models.UserBankDetail.update(values.body.user_bank_details, {where: {user_id: values.user.id}}).then(function (results) {
                                results.status = 1;
                                res(results);
                            });
                        });
                    }).catch(function (err) {
                        console.log(err);
                    });
                } else {

                    delete values.body.id;
                    myModel.create(values.body, {include: [UserBankDetail, UserBusinesDetail]}).then(function (results) {
                        results.status = 1;
                        res(results);
                    }).catch(function (err) {

                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });
                }

            }
            ,
            resendOtpAll: function (req, res) {

                myModel.update(req.updateObj, {where: {id: req.user_id}}).then(function (data) {
                    results = {}
                    results.status = 1;
                    res(results);
                });
            },
            saveAllValues: function (values, res) {
                var UserBankDetail = myModel.hasOne(sequelize.models.UserBankDetail, {foreignKey: 'user_id', as: 'user_bank_details'})
                var UserBusinesDetail = sequelize.models.User.hasOne(sequelize.models.UserBusinesDetail, {foreignKey: 'user_id', as: 'user_busines_details'})
                id = values.body.id;
                if (typeof id !== 'undefined' && id != '') {
                    delete values.body.id;
                    delete values.body.email;
                    //delete values.body.mobile;


//                    if (typeof values.body.is_active !== 'undefined' && values.body.is_active != '') {
//                        values.body['is_active'] = 1
//                    } else {
//                        values.body['is_active'] = 0;
//                    }

                    sequelize.models.User.update(values.body, {where: {id: id}}).then(function (results) {

                        if (values.body.user_busines_details) {
                            sequelize.models.UserBusinesDetail.update(values.body.user_busines_details, {where: {user_id: id}}).then(function (results) {
                                //results.status = 1;
                                //res(results);
                            });
                        }
                        if (values.body.user_bank_details) {
                            sequelize.models.UserBankDetail.update(values.body.user_bank_details, {where: {user_id: id}}).then(function (results) {
                                //results.status = 1;
                                //res(results);
                            });
                        }


                        if (values.body.chgPar.parent_franchise_old != values.body.chgPar.parent_franchise_new) {

                            console.log('-------------++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++change parent');

                            sequelize.models.FranchiseLevel.update({parent_franchise: values.body.chgPar.parent_franchise_new}, {where: {user_id: id, parent_franchise: values.body.chgPar.parent_franchise_old}});
                        }

                        console.log('data++++++++++++++++++++');
                        myModel.findOne({where: {user_id: id}}).then(function (data) {

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

                                    if (values.body.chgPar.parent_franchise_old != values.body.chgPar.parent_franchise_new) {
                                        saveObj.parent_franchise = values.body.chgPar.parent_franchise_new;
                                    } else {
                                        saveObj.parent_franchise = data.parent_franchise;
                                    }

                                    saveObj[keyFr] = getData;
                                    console.log('data++++++++++++++++++++');
                                    console.log(saveObj);
                                    console.log('data++++++++++++++++++++');
                                    myModel.create(saveObj).then(function (results) {

                                    }).catch(function (err) {
                                        console.log(err);
                                    });
                                });

                            }

                            console.log('data++++++++++++++++++++');
                            console.log(data);
                            console.log('data++++++++++++++++++++');
                        });
                        results.status = 1;
                        res(results);
                    }).catch(function (err) {
                        console.log(err);
                    });
                } else {

                    console.log('franchise_' + values.body.franchise_levels.franchise_level.replace('level', 'id'));
                    fran_key = 'franchise_' + values.body.franchise_levels.franchise_level.replace('level', 'id');
                    type_key = values.body.franchise_levels.franchise_level.replace('level', 'id');
                    console.log(typeof values.body.franchise_levels[fran_key]);
                    var arrOfVals = [];
                    if (typeof values.body.franchise_levels[fran_key] === 'string') {
                        arrOfVals.push(values.body.franchise_levels[fran_key]);
                    } else {
                        arrOfVals = values.body.franchise_levels[fran_key];
                    }

                    //values.body.user_bank_details = {is_active: 1}
                    delete values.body.id;
                    sequelize.models.User.create(values.body, {include: [UserBusinesDetail, UserBankDetail]}).then(function (results) {
//                        results.status = 1;
//                        res(results);
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
                            myModel.create(franchiseObj).then(function (results) {


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
                    }).catch(function (err) {

                        var errors = err;
                        errors.status = false;
                        res(errors);
                    });


                    if (values.body.fr_id && values.body.fr_id != '') {
                        sequelize.models.FranchiseRequest.update({status: 0}, {where: {id: values.body.fr_id}});
                    }



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
//                                                    results.messages = 'Verification process completed successfully. please login your account';
                                                    res(results);
//                                                    res.redirect('/');
                                                } else {
                                                    results.status = true;
                                                    results.complete = false;
                                                    results.messages = 'Your ' + message + ' has been verified. Please verify your ' + message1 + ' or you can login';
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
                        sum_registrationFee_arbitrationFee = parseFloat(registration_fee) + parseFloat(arbitration_fee);
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

                        sum_registrationFee_arbitrationFee = default_amu + sum_registrationFee_arbitrationFee;
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
                            sum_registrationFee_arbitrationFee_slabHead = slab_head_total + sum_registrationFee_arbitrationFee;
                            console.log('______________________________________________________________________________');
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
                                var revised_fees_amu = (parseFloat(sum_registrationFee_arbitrationFee_slabHead) * parseFloat(revised_fees_obj['revised_value'])) / 100;
                                if (revised_fees_obj['revised_type'] == 1) {

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
                                services_discount_query = '';
                                services_discount_query += ' SELECT * FROM service_detail_slabs where service_detail_id=? and slab_id=? ';
                                sequelize.query(services_discount_query,
                                        {replacements: [doc_type, slab_id], type: sequelize.QueryTypes.SELECT}
                                ).then(function (services_discount_data) {

                                    if (!services_discount_data.length) {
                                        res({status: false, msg: 'Service detail slabs not found', data: []});
                                        return false;
                                    }
                                    services_discount_obj = services_discount_data[0];
                                    services_discount_obj['discount_to_consumer'];
                                    services_discount = (parseFloat(sum_registrationFee_arbitrationFee_slabHead_revised) * parseFloat(services_discount_obj['discount_to_consumer'])) / 100


                                    sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount = sum_registrationFee_arbitrationFee_slabHead_revised - services_discount;
                                    console.log('______________________________________________________________________________');
                                    console.log('services discount ' + services_discount);
                                    console.log('services discount+revised total+ Step 1 +Step 2 fess ' + sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount);
                                    console.log('______________________________________________________________________________');
                                    // STEP 5 ------------------------------------------------------------------------------------
                                    tax_query = '';
                                    tax_query += ' SELECT * FROM taxes where is_active=1 ';
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
                                            total_cess_amu = (total_tax_amu * total_cess) / 100
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
                                                tax_amount_var = (total_tax_amu * parseFloat(tax_data_rows['tax_value'])) / 100

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

                                            base_fee_amount_yr1 = (sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * req.app.locals.settingData.basic_fee) / 100

                                            year_fees_remain_yr1 = sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount - base_fee_amount_yr1;
                                            //-------------------------------------


                                            var evr_fees = sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount;
                                            async.each(year_fees_data, function (year_fees_data_rows, callback) {
                                                var fess_package = {};
                                                var yr_fees = 0;
                                                year_fees_remain = 0;
                                                base_fee_amount = 0;
                                                console.log('Year ' + year_fees_data_rows['no_of_year']);
                                                yr_fees = evr_fees + ((sum_registrationFee_arbitrationFee_slabHead_revised_serviceDiscount * parseFloat(year_fees_data_rows['value_of_percentage'])) / 100);
                                                //evr_fees = yr_fees;

                                                console.log('fees ' + yr_fees);
                                                if (total_tax > 0) {
                                                    total_tax_amu = (yr_fees * total_tax) / 100
                                                }
                                                console.log('tax ' + total_tax_amu);
                                                if (total_cess > 0) {
                                                    total_cess_amu = (total_tax_amu * total_cess) / 100
                                                }
                                                console.log('tax ' + total_cess_amu);
                                                yr_fees_tax = yr_fees + total_tax_amu + total_cess_amu;
                                                //Base Fee ----------------------------

                                                base_fee_amount = (yr_fees * req.app.locals.settingData.basic_fee) / 100

                                                year_fees_remain = yr_fees - base_fee_amount;
                                                year_fees_remain = year_fees_remain / year_fees_data_rows['no_of_year'];
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
                                                        tax_amount_var = (total_tax_amu * parseFloat(tax_data_rows['tax_value'])) / 100
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
                                                fess_package["total_fees"] = parseFloat(yr_fees_tax).toFixed(2);
                                                fess_package["year"] = year_fees_data_rows['no_of_year'];
                                                fess_package["tax"] = parseFloat(total_tax_amu).toFixed(2);
                                                fess_package["cess"] = parseFloat(total_cess_amu).toFixed(2);
                                                fess_package["base_fee"] = parseFloat(base_fee_amount).toFixed(2);
                                                fess_package["base_fee_per_year"] = (year_fees_remain).toFixed(2);
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
            },
            xlsUpload: function (values, res) {


            }
        },
        hooks: {
            beforeCreate: function (values, options) {
                if (typeof values.is_active === 'undefined') {
                    values.is_active = 0;
                }

                //values.password = bcrypt.hashSync(values.password, null, null);
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
