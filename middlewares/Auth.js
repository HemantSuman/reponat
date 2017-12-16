//var PermissionRole = require('../model/PermissionRole');
var models = require('../models');
function MyModelClass() {

    this.isLogin = function (req, res, next) {
        if (req.isAuthenticated()) {

            if (req.user.is_profile_complete == 0) {
                res.redirect('/complete-profile');
            }

            if (typeof req.session.siteUser != 'undefined') {
                next();
            } else {
                res.redirect('/');
            }

        } else {
            if (req.xhr) {
                res.status(400).send({status: false, msg: 'Please login first', data: []});
            } else {
                //res.status(404).send('Page not found');   
                res.redirect('/');
            }

        }
    }



    this.isAllow = function (req, res, next) {

        var async = require("async");
        //next();
        if (req.xhr) {
            //next();

            console.log("-------->>>>>>>>>>>>>>>> Auth page <<<<<<<<<<<<<<--------------------")
            console.log(req.body)
            console.log("----------->>>>>>>>>>>>>>>>>>> ENDS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--------------")

            if (!req.body.allowChk) {

                console.log('mai toh aa gaya....................')
                next();
                //return;
            }

            var finalUrl = req.originalUrl;
            finalUrl = finalUrl;
            console.log(req.params);
            var url = require('url');
            console.log(url.parse(req.originalUrl).pathname);
            console.log('req.params-------======================');
            finalUrl = url.parse(req.originalUrl).pathname
            finalUrlWithParm = finalUrl;
            var removInurl = '';
            var serQur = '';
            var count = 1;
            var slugCon = '';

            if (req.body.role_id) {
                req.params['role_id'] = req.body.role_id;
            }


            async.forEachOf(Object.keys(req.params), function (item, key, callback) {



                console.log(item); // print the key

                removInurl += '/' + req.params[item];
                if (item == 'id') {
                    return false;
                }

                if (count > 1) {
                    slugCon = 'or';
                }


                serQur += slugCon + ' ( al.slug_value' + '="' + req.params[item] + '") ';
                count++;
                callback();
            }, function (err) {
                console.log('iterating done');
            });
            finalUrl = finalUrl.replace(removInurl, '');
            if (serQur != '') {
                serQur = '(' + serQur + ')';
                serQur = ' and  ' + serQur;
            }

            finalUrl = finalUrl.replace('/delete', '/edit');
            finalUrl = finalUrl.replace('/active_commission', '/edit');
            finalUrl = finalUrl.replace('/xls-upload', '/add');





            console.log(serQur);
            var Sequelize = require('sequelize');
            var sequelize = require('../config/db');
            slab_query = ' SELECT al.acl_list_url,al.show,al.allow,al.slug_value,al.slug_name,al.type FROM acl a left join acl_lists al on a.id=al.acl_id where a.role_type_id=? and ( al.acl_list_url=? or al.acl_list_url=? or concat(al.acl_list_url,"/")=?) ' + serQur;
            sequelize.query(slab_query,
                    {replacements: [req.user.role_type_id, finalUrl, finalUrlWithParm, finalUrlWithParm], type: sequelize.QueryTypes.SELECT}
            ).then(function (data) {
                //console.log(data);
                //res(data);
                if (data.length) {
                    var allowData = data[0];
                    console.log(allowData);
                    if (allowData.allow == 1) {


                        //console.log(req.params[allowData.slug_name]);
//                        if (allowData.slug_value == '' || req.params[allowData.slug_name] == allowData.slug_value) {
//                            next();
//                        } else {
//
//                            res.status(404).send({status: false, message: 'Page not found2'});
//                        }
                        next();

                    } else {
                        res.status(201).send({status: false, message: "You don't have permission to access this page"});
                    }
                } else {
                    res.status(201).send({status: false, message: "You don't have permission to access this page"});
                }

            });






        } else {

            if (!req.isAuthenticated()) {
                res.redirect('/admin/logout');
            } else {
                var finalUrl = req.originalUrl;
                finalUrl = finalUrl;
                console.log(req.params);
                var url = require('url');
                console.log(url.parse(req.originalUrl).pathname);
                console.log('req.params-------======================');
                finalUrl = url.parse(req.originalUrl).pathname
                finalUrlWithParm = finalUrl;
                var removInurl = '';
                var serQur = '';
                var serQur2 = '';
                var count = 1;
                var slugCon = '';
                async.forEachOf(Object.keys(req.params), function (item, key, callback) {



                    console.log(item); // print the key

                    removInurl += '/' + req.params[item];
                    if (item == 'id') {
                        return false;
                    }

                    if (count > 1) {
                        slugCon = 'or';
                    }


                    serQur += slugCon + ' ( al.slug_name="' + item + '" and al.slug_value' + '=' + req.params[item] + ') ';
                    serQur2 += slugCon + ' ( a.slug_name="' + item + '" and a.slug_value' + '=' + req.params[item] + ') ';
                    //serQur += slugCon + ' (a.slug_name="' + item + '" and a.slug_value' + '=' + req.params[item] + ') ';

                    count++;
                    callback();
                }, function (err) {
                    console.log('iterating done');
                });
                finalUrl = finalUrl.replace(removInurl, '');

                finalUrl = finalUrl.replace('franchises', 'users');
                finalUrlWithParm = finalUrlWithParm.replace('franchises', 'users');

                console.log(finalUrl);
                console.log('finalUrl=====+++++++++++');

                if (serQur != '') {
                    serQur = '(' + serQur + 'OR' + serQur2 + ')';
                    serQur = ' and  ' + serQur;
                }


                console.log(serQur);
                var Sequelize = require('sequelize');
                var sequelize = require('../config/db');
                slab_query = ' SELECT a.allow allow_acl,al.acl_list_url,al.show,al.allow,al.slug_value,al.slug_name,al.type FROM acl a left join acl_lists al on a.id=al.acl_id where a.role_type_id=? and (al.acl_list_url=? or al.acl_list_url=? or concat(al.acl_list_url,"/")=? or a.url=? or a.url=? or concat(a.url,"/")=?) ' + serQur;
                sequelize.query(slab_query,
                        {replacements: [req.user.role_type_id, finalUrl, finalUrlWithParm, finalUrlWithParm, finalUrl, finalUrlWithParm, finalUrlWithParm], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    //console.log(data);
                    //res(data);
                    if (data.length) {
                        var allowData = data[0];
                        console.log(allowData);
                        if (allowData.allow == 1 || allowData.allow_acl == 1) {


                            console.log(req.params[allowData.slug_name]);
                            if (allowData.slug_value == '' || req.params[allowData.slug_name] == allowData.slug_value) {
                                next();
                            } else {


                                res.render('admin/error/error', {layout: 'admin/layout/layout', msg: "You don't have permission to access this page"});
                            }


                        } else {
                            res.render('admin/error/error', {layout: 'admin/layout/layout', msg: "You don't have permission to access this page"});
                        }
                    } else {
                        res.render('admin/error/error', {layout: 'admin/layout/layout', msg: "You don't have permission to access this page"});
                    }

                });
                console.log(req.params)

                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                console.log(req.originalUrl)

                //res.status(404).send('Page not found');   
                //res.redirect('/');
            }
        }


    }


    this.isAdmin = function (req, res, next) {
        //var scope_urls = ['/login']
        //console.log(req);

        if (req.isAuthenticated()) {
            if (req.user.otp_status_mobile == 0 || req.user.otp_status_email == 0) {
                models['User'].getById(req.user.id, function (userData) {

                    if (userData.otp_status_mobile == 0 || userData.otp_status_email == 0) {
                        res.redirect('/admin/users/verify-account');
                        return false;
                    }
                    return next();
                });
            } else if (req.user.is_complete_registration == 0) {
                models['User'].getById(req.user.id, function (userData) {
                    if (userData.is_complete_registration == 0) {
                        res.redirect('/admin/users/complete-registration');
                        return false;
                    }
                    return next();
                });
            } else {
                return next();
            }
            //return next();
        } else {

            console.log('else');
            res.redirect('/admin/logout');
        }

//        if (req.url.indexOf(scope_urls) >= 0) {
//            console.log('url');
//            return next();
//        }


    }

    this.productIdChk = function (req, res, next) {

        //console.log(req.params.product_id);

        if (req.params.product_id) {

            models['Product'].getDataById(req.params.product_id, function (results) {

                console.log(results);
                if (results) {
                    return next();
                } else {
                    //res.redirect('/admin/users/logout');
                }


            });
        } else {
            console.log('------------+++++++++++');
            res.redirect('/admin/users/logout');
        }
    }


}

module.exports = new MyModelClass();