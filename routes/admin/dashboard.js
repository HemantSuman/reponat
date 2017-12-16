var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var otpObj = require('../../middlewares/Otp');
router.use(adminAuth.isAdmin);
var viewDirectory = 'freeze_deals';
var modelName = 'FreezeDeal';
var titleName = 'FreezeDeal';

var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;
/* GET users listing. */
var Sequelize = require('sequelize');
var sequelize = require('../../config/db');


router.get('/com', function (req, res, next) {
    models['CommissionDistribution'].commissionCalcMembership(req, function (dataArr) {
        res.send(dataArr);
    });
});


router.get('/save', function (req, res, next) {

    models['CommissionDistribution'].saveCommission(req, function (dataArr) {
        res.send(dataArr);
    });

});

router.get('/', function (req, res, next) {

    var serchFromStampDash = req.query;
    if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {
        var cond_user_id = '(ag.franchise_id =? OR ag.franchise_district_id = ? OR  ag.franchise_division_id = ? OR ag.franchise_state_id = ? OR ag.franchise_country_id = ?)';
        var user_id = req.user.id;
    } else if (req.app.locals.loginUser.user_type.role_type_slug == 'super_admin') {
        var cond_user_id = '1 = ? ';
        var user_id = 1;
    } else {
        var cond_user_id = 'user_id = ? ';
        var user_id = req.user.id;
    }

    async.parallel({
        total_nc: function (callback) {
            var query = ' /* **********total_nc*********** */ ';
            query += 'SELECT sum(if(DATE_FORMAT(ag.added_date,"%c-%y")=DATE_FORMAT(curdate(),"%c-%y"),1,0)) current_month_value, ';
            query += ' sum(if(DATE_FORMAT(ag.added_date,"%y")=DATE_FORMAT(curdate(),"%y"),1,0)) current_year_value ';
            query += ' FROM arbitration_agreements ag LEFT JOIN users u ON u.id = ag.user_id ';
            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {

                query += ' where 1=1 AND ag.is_active in (1,3) AND (' + cond_user_id + ' or ag.freeze_user_id=?) ';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });

            } else {
                query += ' OR 0=u.id ';
                query += ' where (' + cond_user_id + ' or ag.freeze_user_id=?) AND ag.is_active in (1,3) ';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }
        },
        total_membership: function (callback) {

            var query = ' /* **********total_membership*********** */ ';
            query += 'SELECT sum(if(DATE_FORMAT(mpi.created,"%c-%y")=DATE_FORMAT(curdate(),"%c-%y"),1,0)) current_month_value, ';
            query += ' sum(if(DATE_FORMAT(mpi.created,"%y")=DATE_FORMAT(curdate(),"%y"),1,0)) current_year_value ';
            query += ' FROM membership_plan_issues mpi LEFT JOIN users u ON u.id = mpi.user_id ';

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {

                query += ' where (mpi.franchise_id =? OR mpi.franchise_district_id = ? OR  mpi.franchise_division_id = ? OR mpi.franchise_state_id = ? OR mpi.franchise_country_id = ? ) ';
                query += ' AND mpi.is_active = 1';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });

            } else {
                query += ' OR 0=u.id ';
                query += ' where ' + cond_user_id + ' AND ';

                query += ' mpi.is_active = 1';
                sequelize.query(query,
                        {replacements: [user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }
        },
        total_users: function (callback) {

            var query = ' /* **********total_users*********** */ ';
            query += 'SELECT sum(if(rt.role_type_slug = "deed_writer",1,0)) total_deed_writer, ';
            query += ' sum(if(r.role_slug = "professional",1,0)) total_professional ';
            query += ' FROM users u LEFT JOIN role_types rt ON u.role_type_id=rt.id';
            query += ' LEFT JOIN roles r ON rt.role_id=r.id';
            query += ' LEFT JOIN user_franchises uf ON uf.user_id=u.id';

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {

                req.user_id = user_id;
                models['Franchise'].getTehsilId(req, function (dataArr) {
                    dyAp_user_id = dataArr;
                    query += ' where uf.franchise_id=? ';
                    sequelize.query(query,
                            {replacements: [dyAp_user_id], type: sequelize.QueryTypes.SELECT}
                    ).then(function (data) {
                        callback(null, data);
                    });
                });
            } else {
                sequelize.query(query,
                        {replacements: [], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }

        },
        total_renewal: function (callback) {

            var current_with_after_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).add(req.app.locals.settingData.renewal_after_days, 'days').format('YYYY-MM-DD');
            var current_with_before_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).subtract(req.app.locals.settingData.renewal_after_days, 'days').format('YYYY-MM-DD');

            var query = ' /* **********total_renewal*********** */ ';
            query += 'SELECT sum(if(DATE_FORMAT(ag.document_valid_to,"%c-%y-%d %H:%i:%s") < DATE_FORMAT(curdate(),"%c-%y-%d %H:%i:%s"),1,0)) total_renewal ';
            query += ' FROM arbitration_agreements ag LEFT JOIN users u ON u.id = ag.user_id ';
            query += ' LEFT JOIN arbitration_agreement_fees agf ON ag.id = agf.arbitration_agreements_id  ';
            query += '  ';

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {

                query += ' where  agf.nc_end_date < ? AND agf.nc_end_date > ? AND ' + cond_user_id + ' AND ag.is_active=1 ';
                sequelize.query(query,
                        {replacements: [current_with_after_days, current_with_before_days, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            } else {

                query += ' where  agf.nc_end_date < ? AND agf.nc_end_date > ? AND ' + cond_user_id + ' AND ag.is_active=1 ';
                sequelize.query(query,
                        {replacements: [current_with_after_days, current_with_before_days, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }

        },
        total_sale: function (callback) {

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {

                req.user_id = user_id;
                models['Franchise'].getTehsilId(req, function (dataArr) {
                    dyAp_user_id = dataArr;
                    var query = ' /* **********total_sale IF *********** */ ';
                    query += 'select sum(current_year_value) current_year_value, sum(current_month_value) current_month_value from (';
                    query += 'SELECT ag.user_id user_id, arbitration_agreement_total_fees  amu, ';
                    query += 'sum(if(DATE_FORMAT(ag.added_date,"%c-%y")=DATE_FORMAT(curdate(),"%c-%y"),arbitration_agreement_total_fees,0)) current_year_value, ';
                    query += 'sum(if(DATE_FORMAT(ag.added_date,"%y")=DATE_FORMAT(curdate(),"%y"),arbitration_agreement_total_fees,0)) current_month_value ';
                    query += ' FROM arbitration_agreements ag  left join arbitration_agreement_fees af on ag.id=af.arbitration_agreements_id ';
                    query += ' LEFT JOIN users u ON u.id = ag.user_id ';
                    query += ' where ag.is_active in (1,3) AND (' + cond_user_id + ' or ag.freeze_user_id=?) ';
                    query += ' union all select  user_id, sum(selected_plan_total_payable_amount) amu, ';
                    query += ' sum(if(DATE_FORMAT(add_date,"%c-%y")=DATE_FORMAT(curdate(),"%c-%y"),selected_plan_total_payable_amount,0)) current_year_value,';
                    query += ' sum(if(DATE_FORMAT(add_date,"%y")=DATE_FORMAT(curdate(),"%y"),selected_plan_total_payable_amount,0)) current_month_value ';
                    query += ' from membership_plan_issues mpi LEFT JOIN users u ON u.id = mpi.user_id ';
                    query += ' where mpi.franchise_id =? OR mpi.franchise_district_id = ? OR  mpi.franchise_division_id = ? OR mpi.franchise_state_id = ? OR mpi.franchise_country_id = ? ';
                    query += ' AND mpi.is_active=1) current_year_value';
                    sequelize.query(query,
                            {replacements: [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                    ).then(function (data) {
                        callback(null, data);
                    });

                });
            } else {

                var query = ' /* **********total_sale ELSE *********** */ ';
                query += 'select sum(current_year_value) current_year_value, sum(current_month_value) current_month_value from (';
                query += 'SELECT a.user_id user_id, arbitration_agreement_total_fees  amu, ';
                query += 'sum(if(DATE_FORMAT(added_date,"%c-%y")=DATE_FORMAT(curdate(),"%c-%y"),arbitration_agreement_total_fees,0)) current_month_value , ';
                query += 'sum(if(DATE_FORMAT(added_date,"%y")=DATE_FORMAT(curdate(),"%y"),arbitration_agreement_total_fees,0)) current_year_value ';
                query += ' FROM arbitration_agreements a  left join arbitration_agreement_fees af on a.id=af.arbitration_agreements_id ';
                query += ' where a.is_active in (1,3) AND (' + cond_user_id + ' or a.freeze_user_id=?) ';
                query += ' union all select  user_id, sum(selected_plan_total_payable_amount) amu, ';
                query += ' sum(if(DATE_FORMAT(add_date,"%c-%y")=DATE_FORMAT(curdate(),"%c-%y"),selected_plan_total_payable_amount,0)) current_month_value, ';
                query += ' sum(if(DATE_FORMAT(add_date,"%y")=DATE_FORMAT(curdate(),"%y"),selected_plan_total_payable_amount,0)) current_year_value ';
                query += ' from membership_plan_issues where ' + cond_user_id + ' AND is_active=1) current_year_value';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }
        },
        total_commission_bonus: function (callback) {

            var query = ' /* **********total_commission_bonus*********** */ ';
            query += 'SELECT id, ';
            query += ' sum(if(DATE_FORMAT(added_date,"%c-%y") = DATE_FORMAT(curdate(),"%c-%y"), ';
            query += ' commission_amount,0)) commission_for_month, ';
            query += ' sum(if(DATE_FORMAT(added_date,"%y") = DATE_FORMAT(curdate(),"%y"), ';
            query += ' commission_amount,0)) commission_for_year, ';
            query += ' sum(if(DATE_FORMAT(added_date,"%c-%y") = DATE_FORMAT(curdate(),"%c-%y"), ';
            query += ' bonus_commission_amount,0)) bonus_for_month, ';
            query += ' sum(if(DATE_FORMAT(added_date,"%y") = DATE_FORMAT(curdate(),"%y"), ';
            query += ' bonus_commission_amount,0)) bonus_for_year, ';
            query += ' sum(if(DATE_FORMAT(added_date,"%y") = DATE_FORMAT(curdate(),"%y"), ';
            query += ' commission_tds,0)) tds_for_year ';
            //query += ' FROM paid_commissions pc LEFT JOIN commission_distributions cd ON pc.id = cd.paid_commission_id ';

            query += ' FROM ( '
            query += ' select cd.commission_tds,cd.id id,pc.added_date added_date,commission_amount,commission_tds_rate, '
            query += ' concat(if(commission_tds < ((commission_amount*commission_tds_rate)/100),"-",""),bonus_commission_amount) bonus_commission_amount '
            query += ' from '
            query += ' paid_commissions pc '
            query += ' LEFT JOIN commission_distributions cd '
            query += ' ON pc.id = cd.paid_commission_id  '
            query += ' LEFT JOIN users u ON u.id = cd.user_id  '
            query += ' LEFT JOIN user_franchises uf ON uf.user_id=u.id '
            query += ' where cd.user_id =? AND pc.is_active=1 group by cd.id) tab '

            sequelize.query(query,
                    {replacements: [user_id], type: sequelize.QueryTypes.SELECT}
            ).then(function (data) {
                callback(null, data);
            });


//            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {
//
//                req.user_id = user_id;
//                models['Franchise'].getTehsilId(req, function (dataArr) {
//                    dyAp_user_id = dataArr;
//
//                    query += ' LEFT JOIN users u ON u.id = cd.user_id ';
//                    query += ' LEFT JOIN user_franchises uf ON uf.user_id=u.id';
////                    query += ' where uf.franchise_id =? AND pc.is_active=1';
//                    query += ' where cd.user_id =? AND pc.is_active=1';
//                    sequelize.query(query,
//                            {replacements: [dyAp_user_id], type: sequelize.QueryTypes.SELECT}
//                    ).then(function (data) {
//                        callback(null, data);
//                    });
//                });
//                
//            } else {
//
//                query += ' where ' + cond_user_id + ' AND is_active=1';
//                sequelize.query(query,
//                        {replacements: [user_id], type: sequelize.QueryTypes.SELECT}
//                ).then(function (data) {
//                    callback(null, data);
//                });
//
//            }

        },
        total_due_payment: function (callback) {

            var query = ' /* **********total_due_payment*********** */ ';
            query += 'SELECT sum(agf.arbitration_agreement_total_fees) due_payment ';
            query += 'FROM arbitration_agreements ag LEFT JOIN arbitration_agreement_fees agf ON ag.id=agf.arbitration_agreements_id';
            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {

                query += ' LEFT JOIN users u ON u.id = ag.user_id ';
                query += ' where (' + cond_user_id + ') AND ag.is_active=3';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            } else {
                query += ' where (' + cond_user_id + ' or ag.freeze_user_id=?) AND ag.is_active=3';
                sequelize.query(query,
                        {replacements: [user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }


        },
        freeze_deal: function (callback) {

            if (req.app.locals.loginUser.user_type.role_type_slug == 'super_admin') {
                req.where = {verify: 1};
            } else {
                req.where = {user_id: req.user.id, verify: 1};
            }
            models['FreezeDeal'].getAllValuesDash(req, function (data) {
                callback(null, data);
            });
        },
        list_nc_per_week: function (callback) {

            var query = ' /* **********list_nc_per_week*********** */ ';
            query += 'SELECT ag.stamp_number, rt.role_type_name, u.mobile,u.first_name, ag.service_details_id, agf.arbitration_agreement_total_fees, ';
            query += ' ag.added_date, cd.commission_amount commission,cd.commission_tds commission_tds,cd.final_commission final_commission, ';
            query += ' cd.bonus_commission_amount bonus, r.role_slug, ';
            query += ' ag.id ag_id, ag.ar_id ar_id, ag.aa_id aa_id,u_fz.first_name fz_name,ag.invoice_no invoice_no,cd.bonus_commission_amount bonus,u.id u_id,u.first_name u_first_name,u.mobile u_mobile,ag.paid_on paid_on,ag.is_active ';
            query += ' FROM arbitration_agreements ag LEFT JOIN users u ON ag.user_id = u.id ';
            query += ' LEFT JOIN role_types rt ON u.role_type_id = rt.id ';
            query += ' LEFT JOIN roles r ON r.id = rt.role_id ';
            query += ' LEFT JOIN arbitration_agreement_fees agf ON ag.id = agf.arbitration_agreements_id ';
            query += ' LEFT JOIN commission_distributions cd ON ag.id = cd.arbitration_agreements_id and cd.user_id=? ';

            query += ' LEFT JOIN users u_fz ON ag.freeze_user_id=u_fz.id ';
            query += ' LEFT JOIN users u_ap ON ag.franchise_id=u_ap.id ';

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {

                query += ' where (' + cond_user_id + ') AND ag.is_active in (1,3) AND DATE_FORMAT(ag.added_date,"%u")=DATE_FORMAT(curdate(),"%u") ';
                query += ' group by ag.id order by ag.id desc LIMIT 5';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            } else {

                if (req.app.locals.loginUser.user_type.role_type_slug == 'super_admin') {
                    query += ' where ' + cond_user_id + ' AND ' + cond_user_id + ' AND ag.is_active=1 AND DATE_FORMAT(ag.added_date,"%u")=DATE_FORMAT(curdate(),"%u") ';
                } else {
                    query += ' where (ag.' + cond_user_id + ' or ag.freeze_user_id=?) AND ag.is_active in (1,3) AND DATE_FORMAT(ag.added_date,"%u")=DATE_FORMAT(curdate(),"%u") ';
                }

                query += ' group by ag.id order by ag.id desc LIMIT 5';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }

        },
        list_nc_per_week_offline: function (callback) {

            var query = ' /* **********list_nc_per_week_offline *********** */ ';
            query += 'SELECT ag.stamp_number, rt.role_type_name, u.mobile,u.first_name, ag.service_details_id, agf.arbitration_agreement_total_fees, ';
            query += ' ag.added_date, ag.payment_duedate_deed_writer, cd.commission_amount commission, ';
            query += ' cd.bonus_commission_amount bonus,u_pay.first_name pay_first_name, ';
            query += ' ag.id ag_id, ag.ar_id ar_id, ag.aa_id aa_id,u_fz.first_name fz_name,ag.invoice_no invoice_no,cd.bonus_commission_amount bonus,u.id u_id,u.first_name u_first_name,u.gid gid,u.mobile u_mobile,ag.paid_on paid_on ';
            query += ' FROM arbitration_agreements ag LEFT JOIN users u ON ag.user_id = u.id ';
            query += ' LEFT JOIN role_types rt ON u.role_type_id = rt.id ';
            query += ' LEFT JOIN arbitration_agreement_fees agf ON ag.id = agf.arbitration_agreements_id ';
            query += ' LEFT JOIN commission_distributions cd ON ag.id = cd.arbitration_agreements_id and cd.user_id=? ';

            query += ' LEFT JOIN users u_fz ON ag.freeze_user_id=u_fz.id ';
            query += ' LEFT JOIN users u_ap ON ag.franchise_id=u_ap.id ';
            query += ' LEFT JOIN users u_pay ON ag.paid_by=u_pay.id ';

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {

                query += ' where (' + cond_user_id + ') AND ag.is_active in (1,3) AND DATE_FORMAT(ag.paid_on,"%u")=DATE_FORMAT(curdate(),"%u") ';
                query += ' and paid_on IS NOT NULL group by ag.id order by ag.id desc ';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            } else {

                if (req.app.locals.loginUser.user_type.role_type_slug == 'super_admin') {
                    query += ' where ' + cond_user_id + ' AND ' + cond_user_id + ' AND ag.is_active=1 AND DATE_FORMAT(ag.paid_on,"%u")=DATE_FORMAT(curdate(),"%u") ';
                } else {
                    query += ' where (ag.' + cond_user_id + ' or ag.freeze_user_id=?) AND ag.is_active in (1,3)  AND DATE_FORMAT(ag.paid_on,"%u")=DATE_FORMAT(curdate(),"%u") ';
                }

                query += ' and paid_on IS NOT NULL group by ag.id order by ag.id desc ';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }

        },
        list_membership_per_week: function (callback) {

            var query = ' /* **********list_membership_per_week*********** */ ';
            query += 'SELECT mpi.id,mpi.authority_mobile authority_mobile, mpi.franchise_id, mpi.business_name, u.first_name, rt.role_type_slug,u.mobile, mpi.plan_name, ';
            query += ' mpi.selected_plan_total_payable_amount, cd.commission_amount commission,ms_id ms_id, ';
            query += ' (cd.bonus_commission_amount) bonus, ';
            query += ' mpi.add_date, mpi.selected_plan_year, mpi.invoice_no ';
            query += ' FROM membership_plan_issues mpi LEFT JOIN users u ON  u.id = mpi.user_id ';
            query += ' LEFT JOIN role_types rt ON  rt.id = u.role_type_id ';
            query += ' LEFT JOIN commission_distributions cd ON  mpi.id = cd.membership_plan_issue_id AND cd.user_id=? ';

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {
                query += ' where (mpi.franchise_id =? OR mpi.franchise_district_id = ? OR  mpi.franchise_division_id = ? OR mpi.franchise_state_id = ? OR mpi.franchise_country_id = ?) AND ';
                query += ' mpi.is_active = 1 AND DATE_FORMAT(mpi.add_date,"%u")=DATE_FORMAT(curdate(),"%u") order by mpi.id desc ';
                query += ' LIMIT 5 ';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });

            } else if (req.app.locals.loginUser.user_type.user_role.role_slug == 'super_admin') {


                query += ' where mpi.is_active = 1 AND DATE_FORMAT(mpi.add_date,"%u")=DATE_FORMAT(curdate(),"%u") order by mpi.id desc ';
                query += ' LIMIT 5 ';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });


            } else {
                query += 'where mpi.user_id=? AND';
                query += ' mpi.is_active = 1 AND DATE_FORMAT(mpi.add_date,"%u")=DATE_FORMAT(curdate(),"%u") order by mpi.id desc ';
                query += ' LIMIT 5 ';
                sequelize.query(query,
                        {replacements: [user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }

        },
        list_membership_due: function (callback) {

            var current_with_after_days = req.app.locals.settingData.membership_renewal_after_days;
            var current_with_before_days = req.app.locals.settingData.membership_renewal_before_days;
//            var current_with_after_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).add(req.app.locals.settingData.membership_renewal_after_days, 'days').format('YYYY-MM-DD');
//            var current_with_before_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).subtract(req.app.locals.settingData.membership_renewal_before_days, 'days').format('YYYY-MM-DD');


            var query = ' /* **********list_membership_Due For Renewal=-=-=-=-==-=-=-=-=-*********** */ ';
            query += 'SELECT mpi.id,mpi.authority_mobile authority_mobile, mpi.franchise_id, mpi.business_name, u.first_name, rt.role_type_slug,u.mobile, mpi.plan_name, ';
            query += ' mpi.selected_plan_total_payable_amount, cd.commission_amount commission,ms_id ms_id, ';
            query += ' (cd.bonus_commission_amount) bonus, ';
            query += ' mpi.add_date, mpi.selected_plan_year, mpi.invoice_no ';
            query += ' FROM membership_plan_issues mpi LEFT JOIN users u ON  u.id = mpi.user_id ';
            query += ' LEFT JOIN role_types rt ON  rt.id = u.role_type_id ';
            query += ' LEFT JOIN commission_distributions cd ON  mpi.id = cd.membership_plan_issue_id AND cd.user_id=? ';

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {
                query += ' where (mpi.franchise_id =? OR mpi.franchise_district_id = ? OR  mpi.franchise_division_id = ? OR mpi.franchise_state_id = ? OR mpi.franchise_country_id = ?) AND ';
                query += ' mpi.is_active = 1 '
                query += ' AND (mpi.add_date + interval mpi.selected_plan_year year) between (now() - interval ' + current_with_after_days + ' day) and (curdate() + interval ' + current_with_before_days + ' day)'

                query += ' order by mpi.id desc ';
                query += ' LIMIT 5 ';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });

            } else if (req.app.locals.loginUser.user_type.user_role.role_slug == 'super_admin') {


                query += ' where mpi.is_active = 1 '
                query += ' AND (mpi.add_date + interval mpi.selected_plan_year year) between (now() - interval ' + current_with_after_days + ' day) and (curdate() + interval ' + current_with_before_days + ' day)'
                query += ' order by mpi.id desc '
                query += ' LIMIT 5 ';
                sequelize.query(query,
                        {replacements: [user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });


            } else {
                query += ' where mpi.is_active = 1 '
//                query += ' AND (mpi.add_date + interval mpi.selected_plan_year year) between (now() - interval ' + current_with_after_days + ' day) and (curdate() + interval ' + current_with_before_days + ' day)'
                query += ' AND end_date between (curdate() - interval ' + current_with_after_days + ' day) and (curdate() + interval ' + current_with_before_days + ' day)'
                query += ' AND is_renewed = 0 order by mpi.id desc '
                query += ' LIMIT 5 ';
                sequelize.query(query,
                        {replacements: [user_id, user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            }

        },
        list_due_payment: function (callback) {

            var query = ' /* **********list_due_payment*********** */ ';
            query += 'SELECT u.first_name,rt.role_type_slug,u.mobile,ag.stamp_number,ag.service_details_id,ag.added_date, ';
            query += ' agf.arbitration_agreement_total_fees, ag.payment_duedate_ap, ag.payment_duedate_deed_writer,ag.ar_id ar_id, ';
            query += ' cd.commission_amount - ((cd.commission_amount * cd.commission_tds_rate) / 100) commission, ';
            query += ' cd.final_commission, cd.bonus_commission_amount, ';
            query += ' (cd.bonus_commission_amount - ((cd.bonus_commission_amount * cd.commission_tds_rate) / 100)) bonus, ';
            query += ' if(ag.payment_duedate_deed_writer < now(), 1,0) red_deed_writer, ';
            query += ' if(ag.payment_duedate_ap < now(), 1,0) red_ap, ';
            query += ' u_fz.first_name fz_name, u_fz.mobile fz_mobile,u_ap.first_name ap_name ,u_ap.mobile ap_mobile,ag.invoice_no,ag.is_active is_active,ag.id ag_id';
            query += ' FROM arbitration_agreements ag ';
            query += ' LEFT JOIN arbitration_agreement_fees agf ON ag.id=agf.arbitration_agreements_id ';



//            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {
//                query += ' LEFT JOIN users u ON u.id=ag.user_id AND (' + cond_user_id + ') ';
//            } else if (req.app.locals.loginUser.user_type.user_role.role_slug == 'professional') {
//                query += ' LEFT JOIN users u ON u.id=ag.user_id ';
//            } else {
//                query += ' LEFT JOIN users u ON u.id=ag.user_id ';
//            }
            query += ' LEFT JOIN commission_distributions cd ON  ag.id = cd.arbitration_agreements_id AND cd.user_id=? ';
            query += ' LEFT JOIN users u_fz ON ag.freeze_user_id=u_fz.id ';
            query += ' LEFT JOIN users u_ap ON ag.franchise_id=u_ap.id ';
            query += ' LEFT JOIN users u ON ag.user_id=u.id ';
            query += ' LEFT JOIN role_types rt ON  rt.id = u.role_type_id ';


            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {
                query += ' where (' + cond_user_id + ') AND ';
            } else if (req.app.locals.loginUser.user_type.user_role.role_slug == 'professional') {
                query += ' where ag.freeze_user_id = ? AND ';
            } else if (req.app.locals.loginUser.user_type.role_type_slug == 'deed_writer') {
                query += ' where ag.' + cond_user_id + ' AND ';
            } else if (req.app.locals.loginUser.user_type.role_type_slug == 'super_admin') {
                query += ' where ' + cond_user_id + ' AND ';
            } else {
                query += ' where ag.' + cond_user_id + ' AND ';
            }
            query += ' ag.is_active=3 ';
            query += ' order by ag.id desc LIMIT 5 ';
            sequelize.query(query,
                    {replacements: [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
            ).then(function (data) {
                callback(null, data);
            });
        },
        list_due_renewal: function (callback) {

            var current_with_after_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).add(req.app.locals.settingData.renewal_after_days, 'days').format('YYYY-MM-DD');
            var current_with_before_days = req.app.locals.site.momentObj(req.app.locals.site.momentObj()).subtract(req.app.locals.settingData.renewal_after_days, 'days').format('YYYY-MM-DD');

            var query = ' /* **********list_due_renewal*********** */ ';
            query += 'SELECT u_f.id freez_id, u_f.first_name freez_first_name, u_f.mobile freez_mobile ,r.role_slug,group_concat(agpm.member_name) member_name,group_concat(agpm.member_mobile_number) member_mobile, '
            query += ' ag.id ag_id,ag.ar_id ar_id, ag.aa_id aa_id, ag_p.invoice_no p_invoice_no, u.first_name,rt.role_type_slug,u.mobile,ag.stamp_number, ag.service_details_id, ';
            query += ' agf.arbitration_agreement_total_fees, ag.added_date, ag.payment_duedate_ap, ';
            query += ' ag_p.invoice_no p_invoice_no, agf.arbitration_agreement_renew_discount, agf.nc_end_date ';
            query += ' FROM arbitration_agreements ag ';
            query += ' LEFT JOIN arbitration_agreement_fees agf ON ag.id=agf.arbitration_agreements_id ';
            //query += ' AND (curdate() >= DATE_SUB(nc_end_date, INTERVAL '+req.app.locals.settingData.renewal_before_days+' DAY) AND curdate() <= DATE_ADD(nc_end_date, INTERVAL '+req.app.locals.settingData.renewal_after_days+' DAY)) ';
            query += ' LEFT JOIN arbitration_agreements ag_p ON ag.id=ag_p.parent_arbitration_agreements_id ';
            query += ' LEFT JOIN arbitration_agreement_party_members agpm ON agpm.arbitration_agreements_id=ag.id ';
            query += ' LEFT JOIN users u ON u.id=ag.user_id ';
            query += ' LEFT JOIN users u_f ON u_f.id = ag.freeze_user_id ';
            query += ' LEFT JOIN user_franchises uf ON uf.user_id=u.id ';
            query += ' LEFT JOIN role_types rt ON  rt.id = u.role_type_id ';
            query += ' LEFT JOIN roles r ON r.id = rt.role_id  ';

            if (req.app.locals.loginUser.user_type.user_role.role_slug == 'franchise') {
                query += ' where (' + cond_user_id + ') ';
            } else if (req.app.locals.loginUser.user_type.role_type_slug != 'super_admin') {
                query += ' where (ag.user_id = ? OR ag.freeze_user_id = ?) ';
            } else {
                query += ' where ' + cond_user_id + ' ';
            }
            //query += ' agf.nc_end_date < "' + current_with_after_days + '" AND agf.nc_end_date > "' + current_with_before_days + '" ';
            //query += '  AND ag.is_active=1 AND ag.is_renewed=0 ';
            query += '  AND ag.is_active=1 AND ag.is_renewed=0  AND (curdate() >= DATE_SUB(nc_end_date, INTERVAL '+req.app.locals.settingData.renewal_before_days+' DAY) AND curdate() <= DATE_ADD(nc_end_date, INTERVAL '+req.app.locals.settingData.renewal_after_days+' DAY))';
            query += ' group by ag.id LIMIT 5 ';
            sequelize.query(query,
                    {replacements: [user_id, user_id, user_id,user_id, user_id, user_id, user_id, user_id, user_id,user_id, user_id, user_id], type: sequelize.QueryTypes.SELECT}
            ).then(function (data) {
                callback(null, data);
            });
        },
        stampVendor: function (callback) {

            if (typeof serchFromStampDash != 'undefined') {
                var serchWhr = '  ';
                if (typeof serchFromStampDash.start_date_search != 'undefined' && serchFromStampDash.start_date_search != '') {
                    serchWhr += ' AND str_to_date(s.stamp_issue_date,"%d-%m-%Y") >= "' + req.app.locals.site.momentObj(serchFromStampDash.start_date_search, 'DD-MM-YYYY').format('YYYY-MM-DD') + '"';
                }
                if (typeof serchFromStampDash.end_date_search != 'undefined' && serchFromStampDash.end_date_search != '') {
                    serchWhr += ' AND str_to_date(s.stamp_issue_date,"%d-%m-%Y") <= "' + req.app.locals.site.momentObj(serchFromStampDash.end_date_search, 'DD-MM-YYYY').format('YYYY-MM-DD') + '"';
                }
                if (typeof serchFromStampDash.stamp_status != 'undefined' && serchFromStampDash.stamp_status != '') {
//                    if(serchFromStampDash.stamp_status == 0){
                    serchWhr += ' AND cd.paid = ' + serchFromStampDash.stamp_status;
//                    } else if(serchFromStampDash.stamp_status == 1) {
//                        serchWhr += ' AND ar.is_active = ' + serchFromStampDash.stamp_status ;
//                    }
                }
            }
            var query = ' /* **********stampVendor*********** */ ';
            query += ' select *,ar.is_active pay_status,ar.added_date added_date,cd.paid paid,s.id id '
            query += ' from '
            query += ' stamps s left join arbitration_agreements ar on s.stamp_no=ar.stamp_number and (ar.is_active=1 or ar.is_active=3) '
            query += ' left join commission_distributions cd on ar.id=cd.arbitration_agreements_id and cd.user_id=? '
            query += ' where s.user_id=? ' + serchWhr + ' group by s.stamp_no  order by s.id desc ';
            //and concat(WEEK(curdate()),"-",year(curdate()))=WEEK(s.created_at)
            sequelize.query(query,
                    {replacements: [req.user.id, req.user.id, req.user.id], type: sequelize.QueryTypes.SELECT}
            ).then(function (data) {
                callback(null, data);
            });

        },
        stampVendorTotal: function (callback) {

            var query = ' /* **********stampVendorTotal*********** */ ';
            query += ' select count(distinct s.id) count_stamp, sum(if((ar.is_active=1),1,0)) total_matured_stamp, sum(ar.agreement_value) total_stamp,sum(if(cd.paid=1, cd.final_commission, 0)) total_com, (sum(if(cd.paid=1, cd.final_commission, 0))+sum(if(cd.paid=1, cd.commission_tds, 0))) total_com_with_tds,'
            query += ' sum(if(cd.paid=1, cd.commission_tds, 0)) total_tds '
            query += ' from '
            query += ' stamps s left join arbitration_agreements ar on s.stamp_no=ar.stamp_number '
            query += ' left join commission_distributions cd on ar.id=cd.arbitration_agreements_id and cd.user_id=? '
            query += ' where s.user_id=?  order by s.id desc ';
            sequelize.query(query,
                    {replacements: [req.user.id, req.user.id, req.user.id], type: sequelize.QueryTypes.SELECT}
            ).then(function (data) {
                callback(null, data);
            });

        },
        total_offline: function (callback) {

            var query = ' /* **********stampVendorTotal*********** */ ';
            query += ' SELECT ifnull(sum(available_credit),0) offline_limit FROM user_franchises where user_id=?'

            sequelize.query(query,
                    {replacements: [req.user.id], type: sequelize.QueryTypes.SELECT}
            ).then(function (data) {
                callback(null, data);
            });

        },
        total_no_sp_alloted_off_facility: function (callback) {

            req.user_id = user_id;
            models['Franchise'].getTehsilId(req, function (dataArr) {
                dyAp_user_id = dataArr;
                var query = ' /* **********total_no_sp_alloted_off_facility*********** */ ';
                query += ' SELECT count(id) no_of_sp FROM user_franchises where total_credit > 0 AND franchise_id=?'
                sequelize.query(query,
                        {replacements: [dyAp_user_id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    callback(null, data);
                });
            });

//            sequelize.query(query,
//                    {replacements: [req.user.id], type: sequelize.QueryTypes.SELECT}
//            ).then(function (data) {
//                callback(null, data);
//            });

        }
    }, function (err, results) {
        console.log();
//        res.send(results.total_no_sp_alloted_off_facility[0].no_of_sp);
        res.render('admin/dashboard/dashboard', {results: results, layout: 'admin/layout/layout', serchFromStampDash: serchFromStampDash});
    });
});

router.get('/professional', function (req, res, next) {
    req.where = '';
    models[modelName].getAllValues(req, function (results) {

        var query = '';
        query += 'SELECT count(a.id) total_no,ifnull(sum(ifnull(af.arbitration_agreement_total_fees,0)),0) total_fee,sum(if(DATE_FORMAT(added_date,"%c-%y")=DATE_FORMAT(curdate(),"%c-%y"),ifnull(af.arbitration_agreement_total_fees,0),0)) current_month_fee '
        query += ' FROM arbitration_agreements a left join arbitration_agreement_fees af on a.id=af.arbitration_agreements_id where user_id=? '
        sequelize.query(query,
                {replacements: [req.user.id], type: sequelize.QueryTypes.SELECT}
        ).then(function (data) {


            var query3 = '';
            query3 += 'SELECT count(id) count,sum(ifnull(selected_plan_total_payable_amount,0)) total FROM membership_plan_issues where user_id=? ';
            sequelize.query(query3,
                    {replacements: [req.user.id], type: sequelize.QueryTypes.SELECT}
            ).then(function (membership) {


                models['FreezeDeal'].getAllValuesDash(req, function (dataArr) {

                    //res.send(data[0]);
                    res.render('admin/dashboard/professional', {results: data[0], layout: 'admin/layout/layout', dataArr: dataArr, membership: membership[0]});
                });
            });
        });
    }, function (err, resultSearch) {
        //res.send(results);
    });
});
module.exports = router;
