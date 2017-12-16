var async = require("async");
//translation module with dynamic json storage
var i18n_Validation = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en_valiation']
});

i18n_Validation.setLocale('en_valiation');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var timediff = require('timediff');
var XLSX = require('xlsx');
module.exports = function (sequelize, DataTypes) {
    var myModel = sequelize.define("Stamp",
            {
                user_id: {
                    type: DataTypes.INTEGER,
                },
                stamp_no: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: i18n_Validation.__('required')
                        },
                        isUnique: function (value, next) {
                            var self = this;
                            myModel.find({
                                where: {stamp_no: value},
                                attributes: ['id']
                            })
                                    .then(function (data) {
                                        // reject if a different user wants to use the same email
                                        if (data && Number(self.id) !== data.id) {
                                            return next(i18n_Validation.__('AlreadyExist', 'Stamp Number'));
                                        }
                                        return next();
                                    })
                                    .catch(function (err) {
                                        return next(err);
                                    });

                        }
                    }
                },
                stamp_issue_date: {
                    type: DataTypes.STRING,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
                },
                created_at: {
                    type: DataTypes.STRING,
                },
                penalty: {
                    type: DataTypes.STRING,
                },
                stamp_issue_to: {
                    type: DataTypes.STRING,
//                    validate: {
//                        notEmpty: {
//                            msg: i18n_Validation.__('required')
//                        },
//                    }
                },
                xls_file: {
                    type: DataTypes.VIRTUAL,
                },
                file_path: {
                    type: DataTypes.VIRTUAL,
                }
            },
    {
        tableName: 'stamps',
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
            vaildStamp: function (req, res) {

                var current_time = new moment().format("YYYY-MM-DD HH:mm:ss");
                query = '';
                query += ' select * from arbitration_agreements where stamp_number=? ';
                sequelize.query(query,
                        {replacements: [req.body.stamp_no], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
                    if (data && data.length > 0) {
                        console.log('now', current_time, 'saved', moment(data[0]['added_date']).format("YYYY-MM-DD HH:mm:ss"));
                        var diff = timediff(moment(data[0]['added_date']).format("YYYY-MM-DD HH:mm:ss"), current_time, 'm');
                        var sts = false;
                        //console.log();
                        if (diff.minutes < (parseFloat(req.app.locals.settingData.stamp_add_expire_time) * 60)) {
                            sts = true;
                        }
                        //console.log({status: sts, penalty: req.app.locals.settingData.stamp_add_penalty, diff: diff.minutes});
                        res({status: sts, penalty: req.app.locals.settingData.stamp_add_penalty, diff: diff, ar_id: data[0]['id']});
                    } else {
                        //console.log('else');
                        res({status: true});
                    }

                });
            },
            getAllValuesPaging: function (req, res) {


                query = '';
                query += ' select *,s.id id,ar.is_active pay_status from stamps s left join arbitration_agreements ar on s.stamp_no=ar.stamp_number left join commission_distributions cd on ar.id=cd.arbitration_agreements_id and cd.user_id=? where s.user_id=? order by s.id desc ';
                sequelize.query(query,
                        {replacements: [req.user.id, req.user.id], type: sequelize.QueryTypes.SELECT}
                ).then(function (data) {
//                    console.log(data);
                    res(data);
                });
//                
//                
//
//                var arbitrationAgreement = myModel.hasOne(sequelize.models.ArbitrationAgreements, {foreignKey: 'stamp_id', as: 'arbitration_agreements'});
//                var commisionDistribution = myModel.hasMany(sequelize.models.CommissionDistribution, {foreignKey: 'arbitration_agreements_id', as: 'commision_distribution'});
//


//                myModel.findAndCountAll({
//                    where: req.where,
//                    //include: [
//                    //     mymodelHasOne,
//                    //     include: arbitration_agreements_id
//                    // ],
//                    include: [
//                        {
//                            association: arbitrationAgreement,
//                            include: [
//                                {
//                                    association: commisionDistribution,
//                                    where: {
//                                        user_id: req.where.user_id
//                                    },
//                                    required: false
//                                }
//                            ],
//                            required: false
//                        }
//                    ],
//                    offset: req.offset,
//                    limit: req.limit,
//                    order: 'id DESC'
//                }).then(function (results) {
//                    console.log(results);
//                    res(results);
//                });
            },
            getById: function (id, res) {
                myModel.findOne({where: {id: id}}).then(function (data) {
                    res(data);
                });
            },
            getByValue: function (req, res) {
                myModel.findOne({where: req.where}).then(function (data) {
                    res(data);
                });
            },
            saveAllValues: function (values, res) {

                values.body.user_id = values.user.id;
                myModel.create(values.body).then(function (results) {

                    if (values.results) {
                        sequelize.models.CommissionDistribution.update({user_id: values.user.id}, {where: {arbitration_agreements_id: values.results.ar_id, paid: 0, user_id: null}}).then(function (results) {
                            //res(results);
                        });
                    }

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

                    //console.log(values.results);

                    if (values.results) {
                        sequelize.models.CommissionDistribution.update({user_id: values.user.id}, {where: {arbitration_agreements_id: values.results.ar_id, paid: 0, user_id: null}}).then(function (results2) {

                        });
                    }
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
            xlsUpload: function (req, res) {
                // console.log("---------------- Welcome to the bulk stamp upload ------------------------------------>>>>>>>>>>>>>>")
                // console.log("---------------------------->>>>>>>>>>    <<<<<<<<<<<----------------------------------------")
                var current = this;
                var workbook = XLSX.readFile(req.body.file_path + '/' + req.files[0].filename);

                var sheet_name_list = workbook.SheetNames;
                var validationArr = {};
                var StampNumberArr = ["Stamp Number", "Issue Date", "Issue To"];
                var StampNumber = 'Stamp Number', IssueDate = 'Issue Date', IssueTo = 'Issue To';
                validationArr[StampNumber] = {'empty': 1, 'uniqe': 1, 'duplicate': 1, 'is_date_format': 0, 'ColumnName': 'stamp_no'};
                validationArr[IssueDate] = {'empty': 0, 'uniqe': 0, 'duplicate': 0, 'is_date_format': 1, 'ColumnName': 'stamp_issue_date'};
                validationArr[IssueTo] = {'empty': 0, 'uniqe': 0, 'duplicate': 0, 'is_date_format': 0, 'ColumnName': 'stamp_issue_to'};

                //console.log(req.body);

                var worksheet = workbook.Sheets[sheet_name_list];
                var DataValues = [];
                var DataSave = [];
                var DataSave1 = {};
                var UniqeNameArray = [];
                var UniqeAliasArray = [];
                var DuplicateNameArray = [];
                var DuplicateAliasArray = [];
                var isValidFile = true;
                var CommissionDistributionDataToBeSaved = [];

                try {
                    workbook.SheetNames.forEach(function (sheetName) {
                        // Get headers.
                        var headers = [];
                        var sheet = workbook.Sheets[sheetName];
                        var range = XLSX.utils.decode_range(sheet['!ref']);
                        var C, R = range.s.r;

                        //console.log("->->->->->->->->->->->->->->->->->->->->->"+ range.e.c +"<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-<-")

                        /* start in the first row */
                        /* walk every column in the range */
                        for (C = range.s.c; C <= range.e.c; ++C) {
                            var cell = sheet[XLSX.utils.encode_cell({c: C, r: R})];
                            /* find the cell in the first row */

                            var hdr = "UNKNOWN " + C; // <-- replace with your desired default
                            if (cell && cell.t) {
                                hdr = XLSX.utils.format_cell(cell);
                            }
                            headers.push(hdr);
                        }
                        // console.log("---------------------------------  headers start-------------------->>>>>>>>>>>>>>>>>>>")
                        // console.log(headers);
                        // console.log("<<<<<<<<<<<---------------------------- headers ends ----------------------------------")

                        //For check the heading string 
                        Array.prototype.diff = function (a) {
                            return this.filter(function (i) {
                                return a.indexOf(i) < 0;
                            });
                        };
                        var differ = StampNumberArr.diff(headers)

                        //console.log("========================= DIFFERENCE ============================================")
                        if (differ.length > 0) {
                            // console.log("There is a difference")
                            // var resp = { status: false, err: "Invalid file"}
                            isValidFile = false
                            //res(resp);
                        } else {
                            //console.log("Both are same")
                            // For each sheets, convert to json.
                            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                            //console.log(roa)
                            if (roa.length > 0) {
                                var countRow = 2;
                                roa.forEach(function (row, index) {
                                    // Set empty cell to ''.

                                    //DataSave[index] = {};
                                    var DataSave1 = {};
                                    var innerCounter = 1;
                                    headers.forEach(function (hd) {
                                        if (innerCounter <= 3) {
                                            // console.log("==================== inside loop =====================>>>>>>>")
                                            // console.log(validationArr[hd], hd);
                                            if (validationArr[hd]['empty'] == 1 && (row[hd] == '' || typeof row[hd] == 'undefined')) {
                                                DataValues.push({status: false, errors: hd + ' should not empty in row ' + countRow});
                                            }

                                            if (validationArr[hd]['uniqe'] == 1 && hd == StampNumber) {
                                                UniqeNameArray.push(row[hd]);
                                            }

                                            if (validationArr[hd]['duplicate'] == 1 && hd == StampNumber) {
                                                if (DuplicateNameArray.indexOf(row[hd]) >= 0)
                                                {
                                                    DataValues.push({status: false, errors: hd + ' duplicate value in row ' + countRow});
                                                }
                                                DuplicateNameArray.push(row[hd]);
                                            }

                                            DataSave1[validationArr[hd]['ColumnName']] = row[hd];
                                            DataSave[index] = DataSave1;
                                            DataSave1['user_id'] = req.user.id;
                                            DataSave1['penalty'] = 0.00;
                                            innerCounter++
                                        }
                                    });
                                    DataSave[index] = DataSave1;
                                    countRow++;
                                });
                            }
                        }
                        //console.log("========================= DIFFERENCE ============================================")

                    });


                    // console.log("-------------->>  Here is the values  <<----------------------------")
                    // console.log(DataValues)

                    if (isValidFile) {
                        console.log("------------------- hertttttttttttttttttttt ------------------------------------------------------------->>>>>>>>")
                        console.log(DataSave)
                        console.log("------------------- hertttttttttttttt  ends ------------------------------------------------------------->>>>>>>>")
                        if (DataValues.length < 1) {

                            var objCount = Object.keys(UniqeNameArray).length;
                            console.log("--------------------- Fi")
                            console.log(UniqeNameArray);

                            var counting = 0;
                            async.eachSeries(UniqeNameArray, function (names, callback) {
                                var isWhere = {};
                                isWhere[validationArr[StampNumber]['ColumnName']] = names;
                                myModel.findAll({
                                    where: isWhere
                                }).then(function (data) {
                                    if (data != '') {
                                        console.log("iffffffffffffffffffffffffffffffffffffff")
                                        DataValues.push({status: false, errors: StampNumber + ' ' + names + ' already exist'});
                                        counting++;
                                        callback();
                                    } else {
                                        console.log("elseseeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                                        req.body.stamp_no = names;
                                        myModel.vaildStamp(req, function (checkIsValidStamp) {
                                            console.log("***********************")
                                            console.log(checkIsValidStamp)
                                            if (checkIsValidStamp.status) {
                                                DataSave[counting]["penalty"] = checkIsValidStamp.penalty;
                                                //DataSave[counting]["results"] = checkIsValidStamp;
                                                CommissionDistributionDataToBeSaved.push(checkIsValidStamp)
                                            } else {
                                                DataValues.push({status: false, errors: 'Valid period is expired for ' + StampNumber + ' ' + names});
                                            }
                                            counting++;
                                            callback();
                                        })
                                    }
                                });
                            }, function (err) {
                                if (DataValues.length < 1) {
                                    console.log("--------===============    Finalll Data To Save    ================---------------")
                                    console.log(DataSave)

                                    myModel.bulkCreate(DataSave).then(function (data) {
                                        if (CommissionDistributionDataToBeSaved.length > 0) {
                                            async.forEach(CommissionDistributionDataToBeSaved, function (iterationValues, iterationCallback) {
                                                sequelize.models.CommissionDistribution.update({user_id: req.user.id}, {where: {arbitration_agreements_id: iterationValues.ar_id, paid: 0, user_id: null}}).then(function (resultss) {
                                                    iterationCallback();
                                                });
                                            }, function (errr) {
                                                if (errr) {
                                                    var resp = {status: false, err: []}
                                                } else {
                                                    var resp = {status: true, err: []}
                                                }
                                                res(resp);
                                            });
                                        } else {
                                            var resp = {status: true, err: []}
                                            res(resp);
                                        }
                                    }).catch(function (err) {
                                        var errors = err.errors;
                                        var resp = {status: false, err: errors}
                                        res(resp);
                                    });
                                } else {
                                    var resp = {status: false, err: DataValues}
                                    res(resp);
                                }
                            });
                        } else {
                            var resp = {status: false, err: DataValues}
                            res(resp);
                        }
                    } else {
                        var errrr = {
                            errors: "invalid file"
                        }
                        var resp = {status: false, err: "Invalid file", isFileValid: false}
                        res(resp);
                    }
                }
                catch (catErr) {
                    console.log("---------------- catch error ---------------------------------------->")
                    console.log(catErr.message)
                    var errrr = {
                        errors: "invalid file"
                    }
                    var resp = {status: false, err: "Invalid file", isFileValid: false}
                    res(resp);

                }
            }
        },
        hooks: {
//            beforeCreate: function (values, options) {
//                console.log('values 22222');
//                if (typeof values.is_active === 'undefined') {
//                    values.is_active = 0;
//                }
//            }
        }

    }

    );

    return myModel;
};


//module.exports.login = function (sequelize, DataTypes) {
//    console.log('module.exports.login');
//};
