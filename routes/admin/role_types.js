var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

router.use(adminAuth.isAdmin);
var extraVar = [];

var viewDirectory = 'role_types';
var modelName = 'RoleType';
//var titleName = 'Professional Types';

var setRoleType = function (role_id) {
    console.log("----------------->>>>>>>>>>>>>>>> role id ------------------------>>>>>>>>>>>>>>>>" + role_id)
    if (role_id == 1) {
        extraVar['role_id'] = 1;    //1 - profession type 
        extraVar['titleName'] = 'Professional Types';
    } else if (role_id == 2) {
        extraVar['role_id'] = 2;    //1 - service provider types 
        extraVar['titleName'] = 'Service Provider Types';
    } else if (role_id == 3) {
        extraVar['role_id'] = 3;    //1 - business type
        extraVar['titleName'] = 'Business Types';
    } else if (role_id == 4) {
        extraVar['role_id'] = 4;    //1 - business category
        extraVar['titleName'] = 'Business Category';
    } else if (role_id == 7) {
        extraVar['role_id'] = 7;    //1 - business category
        extraVar['titleName'] = 'Admin Users Types';
    }
    return true;
    //return extraVar['role_type'];
}


extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
//extraVar['titleName'] = titleName;




router.get('/allow', function (req, res, next) {


    models.Acl.getAllValuesRole(req, function (rolesData) {
        //res.send(rolesData);
        //console.log(rolesData[0]['role_list'][0]);
        res.render('admin/' + viewDirectory + '/allow', {layout: 'admin/layout/layout', rolesData: rolesData});
    });



//res.render('admin/' + viewDirectory + '/allow', {layout: 'admin/layout/layout'});

});



/* GET users listing. */
router.get('/:role_id', adminAuth.isAllow, function (req, res, next) {
    setRoleType(req.params.role_id)

    var limit = 100;
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
    req.where = {role_id: req.params.role_id};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});


router.get('/add/:role_id', adminAuth.isAllow, function (req, res, next) {
    setRoleType(req.params.role_id)
    async.parallel({
//        products: function (callback) {
//            req.where = {'product_slug': 'nyaya-card-1'}
//            models.Product.getAllValues(req, function (data) {
//                callback(null, data);
//            });
//        }
    }, function (err, results) {
        res.render('admin/' + viewDirectory + '/add', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.get('/edit/:role_id/:id', adminAuth.isAllow, function (req, res, next) {
    setRoleType(req.params.role_id)
    var id = req.params.id;
    async.parallel({
        my_model: function (callback) {
            req.where = {'id': id}
            models[modelName].getFirstValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        console.log(results);
        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.post('/delete/:role_id/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    setRoleType(req.params.role_id)
    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + extraVar['role_id']});
    });

});

router.post('/create', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            req.body.product_id = 1;

            if (typeof req.body.revised_type === 'undefined') {
                req.body.revised_type = '';
            }
            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {

                    modelBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null, errors);
                        } else {
                            callback(null, errors);
                        }

                    });
                }], function (err) {
//                    console.log(errors, 'req.body 7777');

                if (errors.length == 0) {

                    //create slug for the role type name
                    var sameAs = '';
                    if (req.body.role_id == 1) {
                        req.body.role_type_slug = 'ca';
                        sameAs = 4;
                    } else if (req.body.role_id == 2) {
                        req.body.role_type_slug = 'deed_writer';
                        sameAs = 6;
                    } else {
                        req.body.role_type_slug = ((req.body.role_type_name.trim()).toLowerCase()).replace(" ", "_");
                    }

                    models[modelName].saveAllValues(req, function (results) {
                        if (results.status) {

                            /* Set permissions begins
                             ****************************************************/
                            var new_created_role_type_id = results.id;
                            var get_acl_condition = {};
                            get_acl_condition.where = {role_type_id: sameAs}

                            models['Acl'].getAllRecords(get_acl_condition, function (acl_data) {
                                async.eachOfSeries(acl_data, function (iterate_acl_data, iteration_key, callback) {
                                    var set_acl_data_to_be_saved = {};
                                    set_acl_data_to_be_saved.body = {
                                        role_id: iterate_acl_data.role_id,
                                        role_type_id: new_created_role_type_id,
                                        name: iterate_acl_data.name,
                                        slug: iterate_acl_data.slug,
                                        url: iterate_acl_data.url,
                                        icon: iterate_acl_data.icon,
                                        position: iterate_acl_data.position,
                                        show: iterate_acl_data.show,
                                        allow: iterate_acl_data.allow,
                                        slug_value: iterate_acl_data.slug_value,
                                        slug_name: iterate_acl_data.slug_name,
                                        type: iterate_acl_data.type
                                    }

                                    var get_acl_list_condition = {}
                                    get_acl_list_condition.where = {acl_id: iterate_acl_data.id}

                                    models['Acl'].saveAllValues(set_acl_data_to_be_saved, function (acl_data_saved) {
                                        if (acl_data_saved.status) {

                                            var hold_last_saved_acl_id = acl_data_saved.id

                                            models['AclList'].getAllRecords(get_acl_list_condition, function (acl_list_data) {
                                                if (acl_list_data) {
                                                    async.eachOfSeries(acl_list_data, function (iterate_acl_list_data, s_iteration_key, callback_inner) {
                                                        var set_acl_list_data_to_be_saved = {}

                                                        set_acl_list_data_to_be_saved.body = {
                                                            acl_id: hold_last_saved_acl_id,
                                                            acl_list_name: iterate_acl_list_data.acl_list_name,
                                                            icon: iterate_acl_list_data.icon,
                                                            acl_list_slug: iterate_acl_list_data.acl_list_slug,
                                                            acl_list_icon: iterate_acl_list_data.acl_list_icon,
                                                            acl_list_url: iterate_acl_list_data.acl_list_url,
                                                            position: iterate_acl_list_data.position,
                                                            show: iterate_acl_list_data.show,
                                                            allow: iterate_acl_list_data.allow,
                                                            slug_value: iterate_acl_list_data.slug_value,
                                                            slug_name: iterate_acl_list_data.slug_name,
                                                            type: iterate_acl_list_data.type
                                                        }

                                                        models['AclList'].saveAllValues(set_acl_list_data_to_be_saved, function (acl_list_data_saved) {
                                                            if (acl_data_saved.status) {
                                                                callback_inner();
                                                            } else {
                                                                res.status(400).send({status: false, msg: ' saved d failed', data: acl_list_data_saved.errors});
                                                            }
                                                        })
                                                    }, function (err) {
                                                        if (err) {
                                                            console.log("----------->>>>>>>%%%%%%%%%%%%%%%%%%%%%%%%%%% Error %%%%%%%%%%%%%%%%%%%%%%>>>>>>>>>>>>>")
                                                            console.log(err)
                                                        } else {
                                                            callback();
                                                        }
                                                    });
                                                } else {
                                                    callback();
                                                }
                                            })

                                        } else {
                                            res.status(400).send({status: false, msg: ' saved d failed', data: acl_data_saved.errors});
                                        }
                                    })
                                }, function (err) {
                                    if (err) {
                                        console.log("----------->>>>>>>%%%%%%%%%%%%%%%%%%%%%%%%%%% Error %%%%%%%%%%%%%%%%%%%%%%>>>>>>>>>>>>>")
                                        console.log(err)
                                    } else {
                                        req.flash('type_messages', 'success');
                                        req.flash('messages', 'Added successfully!');
                                        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body.role_id});
                                    }
                                });
                            })
                            /************** ENDS ********************************/


//                            req.flash('type_messages', 'success');
//                            req.flash('messages', 'Added successfully!');
//                            res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body.role_id}); 

                        } else {
                            res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                        }
                    });

                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
});

router.post('/update', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            console.log(req.body);
            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {

                    modelBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null, errors);
                        } else {
                            callback(null, errors);
                        }

                    });
                },
                function (callback) {
                    callback(null, errors);
                }], function (err) {
                if (errors.length == 0) {

                    req.body.start_date = req.app.locals.site.momentObj(req.body.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    req.body.end_date = req.app.locals.site.momentObj(req.body.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    models[modelName].updateAllValues(req, function (results) {
                        if (results.status) {
                            req.flash('type_messages', 'success');
                            req.flash('messages', 'Updated successfully!');
                            res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + req.body.role_id});
                        } else {
                            res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                        }
                    });

                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
});

/* GET users listing. */
router.get('/admin-users-role-types/:role_id', adminAuth.isAllow, function (req, res, next) {
    setRoleType(req.params.role_id)

    var limit = 100;
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
    req.where = {role_id: req.params.role_id};
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/index_admin_users_role_type', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });
});

router.get('/add-admin-user-role-type/:role_id', adminAuth.isAllow, function (req, res, next) {
    setRoleType(req.params.role_id)
    async.parallel({
        acl_data: function (callback) {
            models.Acl.getAllValuesRole(req, function (rolesData) {
                callback(null, rolesData);
            })
        }
    }, function (err, results) {
        //res.send(results.acl_data);
        res.render('admin/' + viewDirectory + '/add_admin_user_role_type', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.get('/edit-admin-user-role-type/:role_id/:id', adminAuth.isAllow, function (req, res, next) {
    setRoleType(req.params.role_id)
    var id = req.params.id;
    async.parallel({
        my_model: function (callback) {
            req.where = {'id': id}
            models[modelName].getFirstValues(req, function (data) {
                callback(null, data);
            });
        },
        acl_data: function (callback) {
            models.Acl.getAllValuesRole(req, function (rolesData) {
                callback(null, rolesData);
            })
        },
        assigned_roles: function (callback) {
            models.Acl.getAssignRoles(id, function (assignedRoles) {
                callback(null, assignedRoles);
            })
        }
    }, function (err, results) {
        console.log(results);
        //res.send(results.user_roles)
        //res.send(results)
        res.render('admin/' + viewDirectory + '/edit_admin_user_role_type', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.post('/delete-admin-user-role-type/:role_id/:id', adminAuth.isAllow, function (req, res, next) {
    var id = req.params.id;
    setRoleType(req.params.role_id)
    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/admin-users-role-types/' + extraVar['role_id']});
    });

});

router.post('/create-admin-user-role-types', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            console.log("------------------------------ here is the data ------------------------------------>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(req.body)

            var roleID = req.body.role_id;
            var hold_acl_id = '';
            var perms_data = req.body.perms_data
            delete req.body.perms_data;
            console.log(req.body)



            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {

                    modelBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null, errors);
                        } else {
                            callback(null, errors);
                        }

                    });
                }], function (err) {
                if (errors.length == 0) {

                    //create slug for the role type name
                    req.body.role_type_slug = ((req.body.role_type_name.trim()).toLowerCase()).replace(" ", "_");

                    models[modelName].saveAllValues(req, function (saved_role_type_data) {

                        var saved_role_type_id = saved_role_type_data.id;

                        async.eachOfSeries(perms_data, function (perms_value, perms_key, perms_data_callback) {
                            //console.log("----------------------- first loop iteration starts ----------------------------->>>>>>>>>>>>>>>>>")
                            //console.log(perms_key)
                            //console.log(perms_value)

                            var get_acl_condition = {};
                            get_acl_condition.where = {slug: perms_key, role_id: roleID}

                            models['Acl'].getFirstValues(get_acl_condition, function (acl_data) {
                                //console.log("------------------------------- here is the acl data -------------------------->>>>>>>>>>>>>>>>>>>")
                                //console.log(acl_data)


                                if (acl_data) {
                                    hold_acl_id = acl_data.id;

                                    var acl_list_data_to_be_saved = {
                                        acl_id: hold_acl_id,
                                        acl_list_arrays: perms_value
                                    }
                                    models['AclList'].saveValuesPermission(acl_list_data_to_be_saved, function (acl_list_saved) {
                                        if (acl_list_saved.status) {
                                            perms_data_callback();
                                        } else {
                                            console.log("----------((((((((( ERORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                                        }
                                        //perms_data_callback();
                                    })
                                } else {
                                    var get_acl_id = perms_key.split("___")[1]
                                    //console.log("+++++++++++++++++++++++++++++++++++++++>>>>>>>>>>>>>>>    "+get_acl_id)

                                    var get_acl_condition_for_clone = {};
                                    get_acl_condition_for_clone.where = {id: get_acl_id}
                                    models['Acl'].getFirstValues(get_acl_condition_for_clone, function (acl_data) {
                                        console.log("-------------------->>>>>>>>>>> ACL data if not found <<<<<<<<<<<------------------")
                                        console.log(acl_data)
                                        console.log("------------ ROLE IDDDDDDDDD " + roleID)
                                        console.log("------------ saved_role_type_id <<<<<<<<<<<<<<        " + saved_role_type_id)
                                        var acl_data_to_be_saved = {}
                                        acl_data_to_be_saved.body = {
                                            role_id: roleID,
                                            role_type_id: saved_role_type_id,
                                            name: acl_data.name,
                                            slug: acl_data.slug,
                                            url: acl_data.url,
                                            icon: acl_data.icon,
                                            position: acl_data.position,
                                            show: 1,
                                            allow: acl_data.allow,
                                            slug_value: acl_data.slug_value,
                                            slug_name: acl_data.slug_name,
                                            type: acl_data.type
                                        };


                                        //perms_data_callback();

                                        models['Acl'].saveAllValues(acl_data_to_be_saved, function (saved_acl_data) {
                                            console.log("------------- here is the saved acl data ------------------->>>>>>>>>>>>>>>>>>>")
                                            console.log(saved_acl_data.id)

                                            var acl_list_data_to_be_saved = {
                                                acl_id: saved_acl_data.id,
                                                acl_list_arrays: perms_value
                                            }
                                            console.log(acl_list_data_to_be_saved)
                                            models['AclList'].saveValuesPermission(acl_list_data_to_be_saved, function (acl_list_saved) {
                                                if (acl_list_saved.status) {
                                                    perms_data_callback();
                                                } else {
                                                    console.log("----------((((((((( ERORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                                                }

                                            })


                                            //perms_data_callback();
                                        })

                                    })
                                }
                            })
                        }, function (err) {
                            if (err) {
                                console.log("----------->>>>>>>%%%%%%%%%%%%%%%%%%%%%%%%%%% Error %%%%%%%%%%%%%%%%%%%%%%>>>>>>>>>>>>>")
                                console.log(err)
                            } else {
                                req.flash('type_messages', 'success');
                                req.flash('messages', 'Added successfully!');
                                res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/admin-users-role-types/' + req.body.role_id});
                            }
                        });
                    })
                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
});

router.post('/update-admin-user-role-types', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            console.log("------------------------------ here is the data ------------------------------------>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(req.body)

            var roleID = req.body.role_id;
            var hold_acl_id = '';
            var perms_data = req.body.perms_data
            delete req.body.perms_data;
            //console.log(req.body)

            var modelBuild = models[modelName].build(req.body);
            var errors = [];
            async.parallel([
                function (callback) {

                    modelBuild.validate().then(function (err) {
                        if (err != null) {
                            errors = errors.concat(err.errors);
                            callback(null, errors);
                        } else {
                            callback(null, errors);
                        }

                    });
                }], function (err) {
                if (errors.length == 0) {
                    //create slug for the role type name
                    req.body.role_type_slug = ((req.body.role_type_name.trim()).toLowerCase()).replace(" ", "_");
                    console.log("--------------------------- Here is the request data --------------------------->>>>>>>>>>>>>>>>>>>>>")
                    console.log(req.body)

                    models[modelName].updateAllValues(req, function (saved_role_type_data) {

                        var delete_cond = {where: {role_type_id: req.body.id}}
                        models[modelName].deleteOldPermissions(delete_cond, function (delete_old_permissions_status) {
                            if (delete_old_permissions_status.status) {
                                var saved_role_type_id = req.body.id;

                                async.eachOfSeries(perms_data, function (perms_value, perms_key, perms_data_callback) {
                                    //console.log("----------------------- first loop iteration starts ----------------------------->>>>>>>>>>>>>>>>>")
                                    //console.log(perms_key)
                                    //console.log(perms_value)

                                    var get_acl_condition = {};
                                    get_acl_condition.where = {slug: perms_key, role_id: roleID}

                                    models['Acl'].getFirstValues(get_acl_condition, function (acl_data) {
                                        //console.log("------------------------------- here is the acl data -------------------------->>>>>>>>>>>>>>>>>>>")
                                        //console.log(acl_data)


                                        if (acl_data) {
                                            hold_acl_id = acl_data.id;

                                            var acl_list_data_to_be_saved = {
                                                acl_id: hold_acl_id,
                                                acl_list_arrays: perms_value
                                            }
                                            models['AclList'].saveValuesPermission(acl_list_data_to_be_saved, function (acl_list_saved) {
                                                if (acl_list_saved.status) {
                                                    perms_data_callback();
                                                } else {
                                                    console.log("----------((((((((( ERORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                                                }
                                                //perms_data_callback();
                                            })
                                        } else {
                                            var get_acl_id = perms_key.split("___")[1]
                                            //console.log("+++++++++++++++++++++++++++++++++++++++>>>>>>>>>>>>>>>    "+get_acl_id)

                                            var get_acl_condition_for_clone = {};
                                            get_acl_condition_for_clone.where = {id: get_acl_id}
                                            models['Acl'].getFirstValues(get_acl_condition_for_clone, function (acl_data) {
                                                console.log("-------------------->>>>>>>>>>> ACL data if not found <<<<<<<<<<<------------------")
                                                console.log(acl_data)
                                                console.log("------------ ROLE IDDDDDDDDD " + roleID)
                                                console.log("------------ saved_role_type_id <<<<<<<<<<<<<<        " + saved_role_type_id)
                                                //console.log("============ req.body.role_type_id ===================== "+req.body.role_type_id)
                                                var acl_data_to_be_saved = {}
                                                acl_data_to_be_saved.body = {
                                                    role_id: roleID,
                                                    role_type_id: saved_role_type_id,
                                                    name: acl_data.name,
                                                    slug: acl_data.slug,
                                                    url: acl_data.url,
                                                    icon: acl_data.icon,
                                                    position: acl_data.position,
                                                    show: 1,
                                                    allow: acl_data.allow,
                                                    slug_value: acl_data.slug_value,
                                                    slug_name: acl_data.slug_name,
                                                    type: acl_data.type
                                                };


                                                //perms_data_callback();

                                                models['Acl'].saveAllValues(acl_data_to_be_saved, function (saved_acl_data) {
                                                    console.log("------------- here is the saved acl data ------------------->>>>>>>>>>>>>>>>>>>")
                                                    console.log(saved_acl_data.id)

                                                    var acl_list_data_to_be_saved = {
                                                        acl_id: saved_acl_data.id,
                                                        acl_list_arrays: perms_value
                                                    }
                                                    console.log(acl_list_data_to_be_saved)
                                                    models['AclList'].saveValuesPermission(acl_list_data_to_be_saved, function (acl_list_saved) {
                                                        if (acl_list_saved.status) {
                                                            perms_data_callback();
                                                        } else {
                                                            console.log("----------((((((((( ERORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                                                        }

                                                    })


                                                    //perms_data_callback();
                                                })

                                            })
                                        }
                                    })
                                }, function (err) {
                                    if (err) {
                                        console.log("----------->>>>>>>%%%%%%%%%%%%%%%%%%%%%%%%%%% Error %%%%%%%%%%%%%%%%%%%%%%>>>>>>>>>>>>>")
                                        console.log(err)
                                    } else {
                                        req.flash('type_messages', 'success');
                                        req.flash('messages', 'Updated successfully!');
                                        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/admin-users-role-types/' + req.body.role_id});
                                    }
                                });
                            } else {
                                console.log("----------------- Error in deletion process of old permissions ------------------>>>>>>>>>>>>>")
                                res.status(400).send({status: false, msg: ' saved d failed', data: []});
                            }
                        })
                    })
                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
});


module.exports = router;