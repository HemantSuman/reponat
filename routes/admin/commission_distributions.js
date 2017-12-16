var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var otpObj = require('../../middlewares/Otp');
var ProductMail = require('../../middlewares/ProductMail');
//router.use(adminAuth.isAdmin);
var viewDirectory = 'commission_distributions';
var modelName = 'CommissionDistribution';
var titleName = 'CommissionDistribution';

var extraVar = [];
extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;
/* GET users listing. */
var Sequelize = require('sequelize');
var sequelize = require('../../config/db');

var env = require('../../config/env');



router.get('/my_commission', function (req, res, next) {
    serchData = req.query;
    var limit = req.app.locals.site.pageLimit;
    var currentPage = 1;
    var offset = 1;

    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }

    extraVar['currentPage'] = currentPage;
    extraVar['next'] = currentPage + 1;
    extraVar['pre'] = currentPage - 1;
    req.offset = offset;
    req.limit = limit;
    if (serchData.pdf_flag && serchData.pdf_flag == 0) {
        models['CommissionDistribution'].myCommissionFor_Pdf(req, function (results) {
            extraVar.viewDirectory = 'commission_distributions/my_commission';
            extraVar['pageCount'] = Math.ceil(results.count / limit);
            res.render('admin/' + viewDirectory + '/my-commission', {results: results, extraVar: extraVar, layout: false, serchData: serchData});
        });
    } else {
        models['CommissionDistribution'].myCommission(req, function (results) {
            extraVar.viewDirectory = 'commission_distributions/my_commission';
            extraVar['pageCount'] = Math.ceil(results.count / limit);
            res.render('admin/' + viewDirectory + '/my-commission', {results: results.data, extraVar: extraVar, layout: 'admin/layout/layout', serchData: serchData});
        });
    }
});

router.get('/incentive_download', function (req, res, next) {
    serchData = req.query;
    serchData.user_id = req.user.id;
    var fullUrl = req.protocol + '://' + req.get('host');
    var request = require("request");
//            console.log(fullUrl + '/admin/commission_distributions/my_commission?start_date='+serchData.start_date+'&end_date='+serchData.end_date+'&user_id='+serchData.user_id+'&'+'&pdf_flag='+serchData.pdf_flag);
    var options = {method: 'GET',
//        url: fullUrl + '/admin/commission_distributions/my_commission',
        url: fullUrl + '/admin/commission_distributions/my_commission?start_date=' + serchData.start_date + '&end_date=' + serchData.end_date + '&user_id=' + serchData.user_id + '&' + '&pdf_flag=' + serchData.pdf_flag + '&no_pages=' + serchData.no_pages,
        headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
    };
    var fileName = 'Incentive-Details.pdf';

    request(options, function (error, response, body) {
//        console.log(body);
        if (error)
            throw new Error(error);

        var pdf = require('html-pdf');
        var options = {
            format: 'A4',
            "border": {
                "top": "10px",
                "right": "10px",
                "bottom": "10px",
                "left": "2px",
            },
            "header": {
                "height": "0px",
                //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
            },
            "footer": {
                "height": "4mm",
                "contents": {
                    default: '<span style="display: inline-block;text-align: center;width: 100%;"><span style="color: #444;text-align:center;">{{page}} of </span><span>{{pages}}</span></span>',
                }
            }

        };
        html = body;
        pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
            if (err)
                return console.log(err);
            //console.log(res); // { filename: '/app/businesscard.pdf' } 
            res.download('./public/pdfs/' + fileName, fileName);
        });

//        res.send(body);
    });

});


router.get('/state-wise-invoice', adminAuth.isAllow, function (req, res, next) {
    serchData = req.query;
    var limit = 10//req.app.locals.settingData.page_list_limit;
    var currentPage = 1;
    var offset = 1;

    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }

    extraVar['currentPage'] = currentPage;
    extraVar['next'] = currentPage + 1;
    extraVar['pre'] = currentPage - 1;
    req.offset = offset;
    req.limit = limit;
    req.where = {is_active: 1}
    models.State.getAllValues(req, function (state) {

        models['CommissionDistribution'].myCommission(req, function (results) {
            extraVar.viewDirectory = 'commission_distributions/my_commission';
            extraVar['pageCount'] = Math.ceil(results.count / limit);
            //res.send(req.user);
            res.render('admin/reports/state-wise-invoice', {results: results.data, extraVar: extraVar, layout: 'admin/layout/layout', serchData: serchData, state: state});
        });
    });

});


router.get('/commission/:id', function (req, res, next) {

    var limit = req.app.locals.site.pageLimit;
    var currentPage = 1;
    var offset = 1;

    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }

    extraVar['currentPage'] = currentPage;
    extraVar['next'] = currentPage + 1;
    extraVar['pre'] = currentPage - 1;
    req.where = {$or: {arbitration_agreements_id: req.params.id}};
    //req.offset = offset;
    //req.limit = limit;
    models['CommissionDistribution'].getAllValues(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        //res.send(results);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.all('/pay-to-sv', adminAuth.isAllow, function (req, res, next) {
    serchData = req.query;
    var limit = req.app.locals.site.pageLimit;
    var currentPage = 1;
    var offset = 1;

    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }

    extraVar['currentPage'] = currentPage;
    extraVar['next'] = currentPage + 1;
    extraVar['pre'] = currentPage - 1;
    models['CommissionDistribution'].svCommissionDetails(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
//        res.send(results);
        res.render('admin/' + viewDirectory + '/sv-pay', {results: results, extraVar: extraVar, layout: 'admin/layout/layout', serchData: serchData});
    });
});


router.get('/commission_plan/:id', function (req, res, next) {

    var limit = req.app.locals.site.pageLimit;
    var currentPage = 1;
    var offset = 1;

    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }

    extraVar['currentPage'] = currentPage;
    extraVar['next'] = currentPage + 1;
    extraVar['pre'] = currentPage - 1;
    req.where = {$or: {membership_plan_issue_id: req.params.id}};
    //req.offset = offset;
    //req.limit = limit;
    models['CommissionDistribution'].getAllValues(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        //res.send(results);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});


router.post('/pay-sv', function (req, res, next) {

    //res.send(req.body);

    models['CommissionDistribution'].svCommissionTotal(req, function (results) {

        //res.send(results);

        if (results.length) {

            //if (req.body.total == results[0]['final_commission']) {

            payObj = {};
            payArr = [];

            userArr = [];
            payArr = [];
            payArrMain = [];

            //userArr = results[0].user_id.split(',');
            //payArr = results[0].pay.split(',');
            var count = 0;
            var total = 0;
            var payUsers = [];
            async.each(results, function (rows, callback) {
                payObj = {};
                payObj['itemId'] = rows['user_id'];
                payObj['amount'] = rows['final_commission'].toString();
                payObj['comAmt'] = '0';
                total = total + parseFloat(payObj['amount']);
                payArrMain.push(payObj);

                payUsers.push(rows['user_id']);

                count++;
                callback();
            }, function (err) {
                console.log(err);
            });

            var fullUrl = req.protocol + '://' + req.get('host');
            var urlCancel = fullUrl + '/admin/commission_distributions/pay-to-sv?paid=0'
            var urlDone = fullUrl + '/admin/commission_distributions/sv-pay-done'

            var payUserStr = req.body.cd_id.replace(/,/g , "_");

            var hashKey = '';

            var payStr = env.pay.mid+"|" + payUserStr + "|" + total + "||||||||||||||"+env.pay.e_key;

            var sha512 = require('sha512');
            var hashKey = sha512(payStr)
            hashKey = hashKey.toString('hex');

            res.render('admin/' + viewDirectory + '/pay', {layout: false, pay: payArrMain, data: [], urlCancel: urlCancel, urlDone: urlDone, id: payUserStr, hashKey: hashKey,mid:env.pay.mid});


        } else {

        }




    });

});


router.post('/sv-pay-done', function (req, res, next) {

    payData = req.body.msg;
    var payDataArray = payData.split("|");
    var id = payDataArray[3];
    var idArr = id.split("_");

    //res.send(idArr);

    if (payDataArray[1] == 'success') {
        req.where = {id: idArr, paid: 0};
        //req.data = {paid: 1, payment_detail: JSON.stringify(req.body)};
        models['CommissionDistribution'].update({paid: 1, admin_pay: 1, payment_detail: JSON.stringify(req.body)}, {where: req.where}).then(function (data) {
            req.flash('type_messages', 'success');
            req.flash('messages', 'Payment successfully done');
            res.redirect('/admin/commission_distributions/pay-to-sv?paid=0');
        });

    } else {
        req.flash('type_messages', 'error');
        req.flash('messages', 'Payment Failed');
        res.redirect('/admin/commission_distributions/pay-to-sv?paid=0');
    }



});


router.get('/pay/:id/:type', function (req, res, next) {

    var fullUrl = req.protocol + '://' + req.get('host');
    if (req.params.type == 1) {
        urlCancel = fullUrl + '/admin/arbitration_agreements/1'
        urlDone = fullUrl + '/admin/commission_distributions/pay_r'
        req.where = {arbitration_agreements_id: req.params.id};
        p_id = 'n-' + req.params.id;
    } else {
        urlCancel = fullUrl + '/admin/membership_plans/issue_listings'
        urlDone = fullUrl + '/admin/commission_distributions/pay_m'
        req.where = {membership_plan_issue_id: req.params.id};
        p_id = 'm-' + req.params.id;
    }
    models['CommissionDistribution'].getAllValues(req, function (results) {

        var total = 0;
        payObj = {};
        payArr = [];
        async.each(results[0].list, function (rows, callback) {

            if(rows['user_id']){
            payObj = {};
            payObj['itemId'] = rows['user_id'];
            payObj['amount'] = rows['final_commission'].toString();
            payObj['comAmt'] = '0';
            payArr.push(payObj);
            total = total + parseFloat(payObj['amount']);
            }

            callback();
        }, function (err) {
            console.log(err);
        });


        console.log(total);

        //Base or Yearly Amount distibution------------------------
        if(req.params.type == 1){
        payObj = {};
        payObj['itemId'] = env.pay.base_itemId;
        payObj['amount'] = results[0]['year_amount'].toString();
        payObj['comAmt'] = results[0]['base_amount'].toString();
        total = total + parseFloat(payObj['amount']) + parseFloat(payObj['comAmt']);
        }else{

        var baseAmu=parseFloat(results[0]['pay'])-parseFloat(results[0]['total']);
        payObj = {};
        payObj['itemId'] = env.pay.base_itemId;
        payObj['amount'] = '0'
        payObj['comAmt'] = baseAmu.toString();
        total = total + parseFloat(payObj['comAmt']);    

        }
        payArr.push(payObj);
        //---------------------------------------------


        var totalPay=results[0]['pay']

        var hashKey = '';
        //total=8
        var payStr = env.pay.mid+"|" + p_id + "|" + totalPay + "||||||||||||||"+env.pay.e_key;

        var sha512 = require('sha512');
        var hashKey = sha512(payStr)
        hashKey = hashKey.toString('hex');


        console.log(payStr);
        console.log(payArr);
        console.log(totalPay);
        console.log(total);


        if(total!=totalPay){

         var urlTO = '/admin/arbitration_agreements/edit/' + req.params.id + '/1';
         req.flash('type_messages', 'success');
         req.flash('messages', 'Invaild total amount');
         res.redirect(urlTO);    

        console.log(payStr);
        console.log(payArr);
        console.log(totalPay);
        console.log(total);

        }else{

        var pay_send_log={};
        pay_send_log['hash_sts']=payStr;
        pay_send_log['hash']=hashKey;
        pay_send_log['items']=payArr;

        if (req.params.type == 1) {
        models['ArbitrationAgreements'].update({pay_send_log: JSON.stringify(pay_send_log)}, {where: {id: req.params.id}});
        }else{
        models['MembershipPlanIssue'].update({pay_send_log: JSON.stringify(pay_send_log)}, {where: {id: req.params.id}});    
        }    
        res.render('admin/' + viewDirectory + '/pay', {layout: false, pay: payArr, data: results[0], urlCancel: urlCancel, urlDone: urlDone, id: p_id, hashKey: hashKey,mid:env.pay.mid});    
        
        }


    });
});


router.post('/pay_r', function (req, res, next) {

    payData = req.body.msg;


    //res.send(payData);


    var payDataArray = payData.split("|");
    var id = payDataArray[3];
    var idArr = id.split("-");
    id = idArr[1];
    
    if (payDataArray[1] == 'success') {
    //if (1) {    
        req.where = {id: id};
        req.data = {is_active: 1, payment_detail: JSON.stringify(req.body)};
        //var urlTO = '/admin/arbitration_agreements/view_agreement/' + id + '/1';
        var urlTO = '/admin/arbitration_agreements/e_sign_step1/' + id;
        

        models['ArbitrationAgreements'].getAllValues(req, function (data_ar) {

            req.state = data_ar[0]['stamp_state_id']; //'Rajasthan';
            var stampNo = data_ar[0]['stamp_number']; //'Rajasthan';
            models['ArbitrationAgreements'].getInvoiceNo(req, function (invoice_no) {

                //req.data['invoice_no'] = invoice_no;

                if (data_ar[0]['is_active'] == 3) {
                    delete req.data['invoice_no'];
                    var Sequelize = require('sequelize');
                    var sequelize = require('../../config/db');
                    //models['UserFranchise'].update({available_credit: 0}, {where: {user_id: data_ar[0]['user_id'], franchise_id: data_ar[0]['franchise_id']}});
                    var updateQuery = ' update user_franchises set available_credit= available_credit+1 where user_id=? and franchise_id=? ';
                    sequelize.query(updateQuery,
                            {replacements: [data_ar[0]['user_id'], data_ar[0]['franchise_id']]}
                    );
                    urlTO = '/admin/arbitration_agreements/1';

                    req.data['paid_by'] = req.user.id;
                    req.data['paid_on'] = req.app.locals.site.momentObj().format('YYYY-MM-DD HH:mm:ss');
                    ProductMail.sendMail(id, "nc", "offline", "app_users");
                } else {

                    ProductMail.sendMail(id, "nc", "online", "parties");
                    ProductMail.sendMail(id, "nc", "online", "app_users");

                }


                models['ArbitrationAgreements'].updatePayment(req, function (dataArr) {

                    models['CommissionPaid'].update({is_active: 1}, {where: {arbitration_agreements_id: id}});

                    models['CommissionDistribution'].update({paid: 1}, {where: {arbitration_agreements_id: id, user_id: {$ne: null}, penalty: '0.00'}});

                    models['FreezeDeal'].update({deal_status: 1}, {where: {stamp_no: stampNo, deal_status: 2, verify: 1}});
                    
                    if (data_ar[0]['parent_arbitration_agreements_id'] != 0) {
                        urlTO = '/admin/arbitration_agreements/naya_card/'+id+'/1';
                        req.data = {is_renewed:1};
                        req.where = {id: data_ar[0]['parent_arbitration_agreements_id']};
                        models['ArbitrationAgreements'].updatePayment(req, function (dataArr) {
                            
                        });
                    }
                    
                    req.flash('type_messages', 'success');
                    req.flash('messages', 'Payment successfully done');
                    res.redirect(urlTO);
                });

            });

        });

    } else {
        //res.send(req.body);
        var urlTO = '/admin/arbitration_agreements/edit/' + id + '/1';
        req.flash('type_messages', 'success');
        req.flash('messages', 'Payment Failed');
        res.redirect(urlTO);
    }


});

router.get('/iv', function (req, res, next) {
    req.state = 'Rajasthan';
    models['ArbitrationAgreements'].getInvoiceNo(req, function (dataArr) {
        res.send(dataArr);
    });
});

router.post('/pay_m', function (req, res, next) {

    payData = req.body.msg;
    var payDataArray = payData.split("|");
    var id = payDataArray[3];


    var idArr = id.split("-");
    id = idArr[1];
    if (payDataArray[1] == 'success') {
        req.where = {id: id};
        req.data = {is_active: 1, payment_detail: JSON.stringify(req.body)};
        models['MembershipPlanIssue'].getAllValues(req, function (data_ar) {
            req.state = data_ar[0]['business_state_id']; //'Rajasthan';
            models['ArbitrationAgreements'].getInvoiceNo(req, function (invoice_no) {

                //req.data['invoice_no'] = invoice_no;

                console.log(data_ar)
                console.log(req.data)
                console.log(req.where)
                models['MembershipPlanIssue'].updatePayment(req, function (dataArr) {
                    //models['CommissionPaid'].update({membership_plan_issue_id: 1}, {where: {id: id}});
                    models['CommissionPaid'].update({is_active: 1}, {where: {membership_plan_issue_id: id}});

                    models['CommissionDistribution'].update({paid: 1}, {where: {membership_plan_issue_id: id, user_id: {$ne: null}}});

                    if (data_ar[0]['parent_membership_id'] != null) {
                        req.data = {is_renewed:1};
                        req.where = {id: data_ar[0]['parent_membership_id']};
                        models['MembershipPlanIssue'].updatePayment(req, function (dataArr) {
                            
                        });
                    }
                    req.flash('type_messages', 'success');
                    req.flash('messages', 'Payment successfully done');
                    res.redirect('/admin/membership_plans/certificate/' + id + '/1');
                });
            });
        });
    } else {
        var urlTO = '/admin/membership_plans/issue_listings';
        req.flash('type_messages', 'success');
        req.flash('messages', 'Payment Failed');
        res.redirect(urlTO);
    }
    //res.render('admin/' + viewDirectory + '/pay', {layout: false});
});


router.get('/com', function (req, res, next) {
    models['CommissionDistribution'].commissionCalc(req, function (dataArr) {
        res.send(dataArr);
    });
});

router.get('/my-franchise', function (req, res, next) {
//    models['CommissionDistribution'].franchiseList(req, function (dataArr) {
//        //res.send(dataArr);
//        res.render('admin/' + viewDirectory + '/my-franchise', {layout: 'admin/layout/layout', dataAll: dataArr});
//    });
    models['CommissionDistribution'].franchiseTehsilList(req, function (dataArr) {
        //res.send(dataArr);
        res.render('admin/' + viewDirectory + '/my-franchise', {layout: 'admin/layout/layout', dataAll: dataArr});
    });
});

router.get('/my-franchise/:id/:type', function (req, res, next) {
    models['CommissionDistribution'].franchiseListAdmin(req, function (dataArr) {
        //res.send(dataArr);
        res.render('admin/' + viewDirectory + '/my-franchise', {layout: 'admin/layout/layout', dataAll: dataArr});
    });
});


router.get('/save', function (req, res, next) {

    models['CommissionDistribution'].saveCommission(req, function (dataArr) {
        res.send(dataArr);
    });

});


router.get('/com_m', function (req, res, next) {
    models['CommissionDistribution'].commissionCalcMembership(req, function (dataArr) {
        res.send(dataArr);
    });
});


router.get('/save_m/:id', function (req, res, next) {

    models['CommissionDistribution'].saveCommissionMembership(req, function (dataArr) {
        res.send(dataArr);
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

                var query2 = '';
                query2 += ' SELECT ifnull(sum(ifnull(fee,0)),0) item1,DATE_FORMAT(added_date,"%Y-%h") y,DATE_FORMAT(added_date,"%c") mh  FROM arbitration_agreements where user_id=? and DATE_FORMAT(added_date,"%Y")=DATE_FORMAT(curdate(),"%Y") group by DATE_FORMAT(added_date,"%Y-%h") ';
                sequelize.query(query2,
                        {replacements: [req.user.id], type: sequelize.QueryTypes.SELECT}
                ).then(function (graphData) {


                    async.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], function (rows, callback) {



                        callback();
                    }, function (err) {
                        console.log(err);
                    });



                    models['FreezeDeal'].getAllValuesDash(req, function (dataArr) {

                        //res.send(data[0]);
                        res.render('admin/dashboard/professional', {results: data[0], layout: 'admin/layout/layout', graphData: graphData, dataArr: dataArr, membership: membership[0]});
                    });
                });
            });
        });


    }, function (err, resultSearch) {
        //res.send(results);
    });
});





module.exports = router;
