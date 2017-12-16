var models = require('../../models');
var express = require('express');
var router = express.Router();
var adminAuth = require('../../middlewares/Auth');
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");
var timediff = require('timediff');
//router.use(adminAuth.isAdmin);
var mailObj = require('../../middlewares/Mail');
var Sequelize = require('sequelize');
var sequelize = require('../../config/db');

var extraVar = [];
var viewDirectory = 'arbitration_agreements';
var modelName = 'ArbitrationAgreements';
var titleName = 'Nyaya Card';
var ProductMail = require('../../middlewares/ProductMail');
var otpObj = require('../../middlewares/Otp');

var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var NodeRSA = require('node-rsa');
//var keypair = require('keypair');
var SignedXml = require('xml-crypto').SignedXml;
var env = require('../../config/env');
//var isodate = require("isodate");

var setProductType = function (product_id) {
    extraVar['product_id'] = product_id;
    return true;
    //return extraVar['master_type'];
}

extraVar['modelName'] = modelName;
extraVar['viewDirectory'] = viewDirectory;
extraVar['titleName'] = titleName;



router.get('/water-mark', function (req, res, next) { 

console.log('watermark-logo1.png');
var pdf = require('pdf-write-page');

 
pdf({in:'./public/pdfs/Arbitration-agreement-No-AA081707061040.pdf', out:'./public/pdfs/Arbitration-agreement-No-AA081707061040.pdf', pageNumber:0}).page(1)
.image(80, 300, './public/images/chk.png',{transformation:{width:400,height:400}}).restoreCfg()
.end()




//console.log('watermark-logo1.png');

//var watermark = require('image-watermark');

//watermark.embedWatermark('./public/pdfs/Arbitration-agreement-No-AA081707061014.pdf', {'image' : './public/images/watermark-logo1.png'});
// var options = {
//     'text' : 'sample watermark', 
//     'dstPath' : './public/images/watermark-logo1.png'
// };
// watermark.embedWatermark('./public/pdfs/Arbitration-agreement-No-AA081707061014.pdf', options);   


});



router.get('/pdf-load', function (req, res, next) {

    var pdftojson = require('pdftojson');
    var pathToPdf = "./public/pdfs/Arbitration-agreement-No-AA081707061034.pdf"

    pdftojson(pathToPdf).then((output) => {

    for(var i=0; i<output[1]['words'].length; i++){

    if(output[1]['words'][i]['text']=='Signature_X_1 Signature_X_1')
    {
    console.log(output[1]['words'][i]);
    var llx=output[1]['words'][i]['xMin'];
    var urx=llx+143;//output[1]['words'][i]['xMax'];

    var lly=842-output[1]['words'][i]['yMin']-24;
    var ury=lly+40;

    var digoJson={"llx": llx,"lly":lly,"urx":urx,"ury":ury};

    }    
  
    }    


    });





    // console.log('load pdf call.........');

    // var pdfText = require('pdf-text');

    // var pathToPdf = "./public/pdfs/Arbitration-agreement-No-AA081707061034.pdf"

    // pdfText(pathToPdf, function callback(error, string){
    // console.log(error);    
    // console.log(string);    

    // });



 
// pdfText(pathToPdf, function(err, chunks) {
//     console.log(err);  

//   console.log(chunks);  

// });


// var fs = require('fs');
// var buffer = fs.readFileSync('./public/pdfs/Arbitration-agreement-No-AA081707061034.pdf')
// pdfText(buffer, function(err, chunks) {

//     console.log(chunks);
 
// })


});





router.get('/pdf', function (req, res, next) { 


console.log('pdf..........................................');



    let fs = require('fs'),
        PDFParser = require("pdf2json");
    
    //let inputStream = fs.createReadStream("./public/pdfs/Arbitration-agreement-No-AA081707061026-sign.pdf", {bufferSize: 64 * 1024});
    //let outputStream = fs.createWriteStream("./public/pdfs/pd-json.json");
    
    //inputStream.pipe(new PDFParser()).pipe(new StringifyStream()).pipe(outputStream);

 
    let pdfParser = new PDFParser();
    pdfParser.loadPDF("./public/pdfs/Arbitration-agreement-No-AA081707061031-sign.pdf");

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile("./public/pdfs/pd-json.json", JSON.stringify(pdfData));
    });
 
    


    console.log('pdf end..........................................');


});



router.get('/load-html', function (req, res, next) { 
var HtmlDom = require('htmldom');
var html = new HtmlDom('<div>1</div>');




var $ = html.$;

$('div').addClass('test').attr('k', 'v');



var x = $("test").position();


console.log(x);

console.log(html.html());

});




router.post('/send_otp_for_members', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
//            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            var memberDetail = req.body;
            setProductType(memberDetail.product_id)
            req.where = {id: memberDetail.id, is_active: 1}

            models[modelName].getFirstValuesForRefund(req, function (results) {

                if (!results) {
                    res.status(400).send({status: false, status_flag: 'Not Eligible for Refund'});
                } else {

                    async.forEachOf(results.arbitration_agreement_party_members, function (value, key, callback) {


                        var sendOtp = Math.floor((Math.random() * 1000000));
                        if (sendOtp.toString().length == 5) {
                            sendOtp = sendOtp + '0';
                        }
                        var otpMsgMobile = 'your otp is ' + sendOtp + ' for refund nyayacard ' + results.ar_id;
                        var msgDateMobile = {otpMsg: otpMsgMobile, mobile: value.member_mobile_number}

                        req.where = {id: memberDetail.member_id[key]}
                        req.body = {mobile_otp: sendOtp}
                        models.ArbitrationAgreementPartyMembers.changeStatus(req, function (data) {
//                            otpObj.sendOtpMessage(msgDateMobile);
                            callback('', null);
                        });

                    }, function (err, data) {
                        var msg = 'OTP send Successfully on your registerd mobile number!';
                        res.status(200).send({status: true, message: msg});
                    });
                }
            });

        }
    });
});

router.post('/check_otp_for_members', function (req, res, next) {

    var memberDetail = req.body;

    if(memberDetail.member_id=='w1' || memberDetail.member_id=='w2'){

    var u_type='first_witness_';

    if(memberDetail.member_id=='w2')
        u_type='second_witness_';    


    req.where = {id: memberDetail.id, [u_type+'mobile_otp']: memberDetail.mobile_otp}
    
    models[modelName].getFirstValues(req, function (results) {

        if (!results) {
            res.status(200).send({status: false, message: 'Invalid OTP'});
        } else {
            req.where = {id: memberDetail.id}
            req.body = {[u_type+'mobile_otp']: 1}

            models[modelName].changeStatus(req, function (results) {

            req.where = {id:memberDetail.id}
            req.body = {[u_type+'esign']: 1}

            models[modelName].changeStatus(req, function (data) {

            });


            res.status(200).send({status: true});
            });
        }
    });    



    }else{

    req.where = {id: memberDetail.member_id, mobile_otp: memberDetail.mobile_otp, arbitration_agreements_id: memberDetail.id}
    models.ArbitrationAgreementPartyMembers.getFirstValues(req, function (results) {

        if (!results) {
            res.status(200).send({status: false, message: 'Invalid OTP'});
        } else {
            req.where = {id: memberDetail.member_id, arbitration_agreements_id: memberDetail.id}
            req.body = {mobile_otp: 1}
            models.ArbitrationAgreementPartyMembers.changeStatus(req, function (results) {

            req.where = {id:memberDetail.member_id}
            req.body = {e_sign: 1}
            models.ArbitrationAgreementPartyMembers.changeStatus(req, function (data) {

            });


                res.status(200).send({status: true});
            });
        }
    });

    }
});



router.post('/resend_otp_for_members', function (req, res, next) {


    var memberDetail = req.body;

    //console.log(memberDetail);

    if(memberDetail.member_id=='w1' || memberDetail.member_id=='w2'){
    //second_witness_mobile_otp

    var u_type='first_witness_';

    if(memberDetail.member_id=='w2')
        u_type='second_witness_';

    req.where = {id: memberDetail.id}




    models[modelName].getFirstValues(req, function (results) {    

        console.log(results.id);

        if (!results) {
            res.status(400).send({status: false, message: 'Message not sent, try again later'});
        } else {
            //results=results[0];
            var sendOtp = Math.floor((Math.random() * 1000000));
            if (sendOtp.toString().length == 5) {
                sendOtp = sendOtp + '0';
            }

            console.log(results);
            //console.log([u_type+'mobile']);

            var otpMsgMobile = 'your otp is ' + sendOtp;
            var msgDateMobile = {otpMsg: otpMsgMobile, mobile: results[u_type+'mobile']}

            req.where = {id: memberDetail.id}
            req.body = {[u_type+'mobile_otp']: sendOtp}

            models[modelName].changeStatus(req, function (data) {
                otpObj.sendOtpMessage(msgDateMobile);
                var msg = 'OTP send Successfully on your registerd mobile number!';
                res.status(200).send({status: true, message: msg});
            });

        }
    });



    }else{

    req.where = {id: memberDetail.member_id}
    models.ArbitrationAgreementPartyMembers.getFirstValues(req, function (results) {

        if (!results) {
            res.status(400).send({status: false, message: 'Message not sent, try again later'});
        } else {

            var sendOtp = Math.floor((Math.random() * 1000000));
            if (sendOtp.toString().length == 5) {
                sendOtp = sendOtp + '0';
            }
            var otpMsgMobile = 'your otp is ' + sendOtp;
            var msgDateMobile = {otpMsg: otpMsgMobile, mobile: results.member_mobile_number}

            req.where = {id: memberDetail.member_id}
            req.body = {mobile_otp: sendOtp}
            models.ArbitrationAgreementPartyMembers.changeStatus(req, function (data) {
                otpObj.sendOtpMessage(msgDateMobile);
                var msg = 'OTP send Successfully on your registerd mobile number!';
                res.status(200).send({status: true, message: msg});
            });

        }
    });
    }

});


/* GET users listing. */
router.get('/:product_id', adminAuth.isAllow, adminAuth.productIdChk, function (req, res, next) {
    setProductType(req.params.product_id)

    var limit = req.app.locals.site.pageLimit;
    var currentPage = 1;
    var offset = 1;

    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }
//    console.log('req.user.id 09999999999999999');
//    console.log(req.user.id);
    extraVar['currentPage'] = currentPage;
    extraVar['next'] = currentPage + 1;
    extraVar['pre'] = currentPage - 1;

    if (req.user.user_type.role_type_slug == 'super_admin' || req.user.user_type.user_role.role_slug == 'admin_users') {
        req.where = {product_id: req.params.product_id, is_active: [1, 3]};
    } else if (req.user.user_type.role_type_slug == 'franchise') {

        req.where = {
            product_id: req.params.product_id,
            $or: [
                {franchise_id: req.user.id},
                {franchise_district_id: req.user.id},
                {franchise_division_id: req.user.id},
                {franchise_state_id: req.user.id},
                {franchise_country_id: req.user.id},
            ], is_active: [1, 3]
        };
    } else {

        req.where = {
            product_id: req.params.product_id,
            $and: [{$or: [{user_id: req.user.id}, {freeze_user_id: req.user.id}]}],
//            is_active: [1, 3],
//            is_active: 2, parent_arbitration_agreements_id: 0,
//            $or: [{user_id: req.user.id}, {freeze_user_id: req.user.id }, {$or: [{is_active: 2, parent_arbitration_agreements_id: 0}]}]
            $or: [{is_active: 1}, {is_active: 3}, {is_active: 2, parent_arbitration_agreements_id: 0}],
//            $or: [{user_id: req.user.id, freeze_user_id: req.user.id}, {is_active: 2, parent_arbitration_agreements_id: 0}]
        };
    }
    req.offset = offset;
    req.limit = limit;
    models[modelName].getAllValuesPaging(req, function (results) {
        extraVar['pageCount'] = Math.ceil(results.count / limit);

        req.where = {is_active: 1}
        models.ServiceDetail.getAllValues(req, function (dataDoc) {


            serchData = req.query;
            res.render('admin/' + viewDirectory + '/index', {results: results, serchData: serchData, extraVar: extraVar, layout: 'admin/layout/layout', pid: req.params.product_id, dataDoc: dataDoc});
        });
    });
    //res.render('admin/categories/index', {title: 'Express', layout: 'admin/layout/layout'});
});




router.get('/renewable_list/:product_id', adminAuth.productIdChk, function (req, res, next) {
    setProductType(req.params.product_id)

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

    if (req.user.user_type.role_type_slug == 'super_admin' || req.user.user_type.user_role.role_slug == 'admin_users') {
        req.where = {product_id: req.params.product_id};
    } else {
        req.where = {
            product_id: req.params.product_id, is_active: 1, is_renewed: 0,
            $or: [{freeze_user_id: req.user.id}, {user_id: req.user.id, }],
        };
    }
    req.whereCondiForRenew = {is_renewable: 1};

    srhData = req.query;
    if (typeof srhData.start_date != 'undefined' && typeof srhData.end_date != 'undefined') {

        req.whereCondiForRenewDate = sequelize.where(
                sequelize.fn('DATE_ADD', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_after_days + ' DAY')),
                {
                    $gte: req.app.locals.site.momentObj(srhData['start_date'], 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    $lte: req.app.locals.site.momentObj(srhData['end_date'], 'DD-MM-YYYY').format('YYYY-MM-DD')
                });
    } else {

        req.whereCondiForRenewDate = sequelize.where(sequelize.fn('curdate'), {
            $gte: sequelize.fn('DATE_SUB', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_before_days + ' DAY')),
            $lte: sequelize.fn('DATE_ADD', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_after_days + ' DAY'))
        });
    }



    req.offset = offset;
    req.limit = limit;
    models[modelName].getRenewValuesPaging(req, function (results) {
//        console.log(results.rows)
        serchData = req.query;
        extraVar['pageCount'] = Math.ceil(results.count / limit);

        res.render('admin/' + viewDirectory + '/renew_list', {results: results, serchData: serchData, extraVar: extraVar, pid: req.params.product_id, layout: 'admin/layout/layout'});
    });
});


router.get('/renewable_list_pdf/:product_id', adminAuth.productIdChk, function (req, res, next) {
    setProductType(req.params.product_id)
    srhData = req.query;
    console.log('&&&&&&&&&&')
    console.log(srhData.start_date)
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

    req.where = {
        product_id: req.params.product_id, is_active: 1, is_renewed: 0,
        $or: [{freeze_user_id: req.query.user_id}, {user_id: req.query.user_id, }],
    };
    req.whereCondiForRenew = {is_renewable: 1};


    if (srhData.start_date != '' && typeof srhData.start_date != 'undefined' && srhData.end_date != '' && typeof srhData.end_date != 'undefined') {

        req.whereCondiForRenewDate = sequelize.where(
                sequelize.fn('DATE_ADD', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_after_days + ' DAY')),
                {
                    $gte: req.app.locals.site.momentObj(srhData['start_date'], 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    $lte: req.app.locals.site.momentObj(srhData['end_date'], 'DD-MM-YYYY').format('YYYY-MM-DD')
                });
    } else {
        req.whereCondiForRenewDate = sequelize.where(sequelize.fn('curdate'), {
            $gte: sequelize.fn('DATE_SUB', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_before_days + ' DAY')),
            $lte: sequelize.fn('DATE_ADD', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_after_days + ' DAY'))
        });
    }
    req.offset = offset;
    req.limit = limit;
    models[modelName].getRenewValuesPaging(req, function (results) {
//        console.log(results.rows)
        extraVar['pageCount'] = Math.ceil(results.count / limit);
        res.render('admin/' + viewDirectory + '/renew_list', {results: results, serchData: serchData, extraVar: extraVar, pid: req.params.product_id, layout: false});
    });
});

router.get('/renew_list_download/:product_id', function (req, res, next) {
    serchData = req.query;

    serchData.user_id = req.user.id;
    var fullUrl = req.protocol + '://' + req.get('host');
    var request = require("request");
    var options = {method: 'GET',
        url: fullUrl + '/admin/arbitration_agreements/renewable_list_pdf/1?start_date=' + serchData.start_date + '&end_date=' + serchData.end_date + '&user_id=' + serchData.user_id + '&' + '&pdf_flag=' + serchData.pdf_flag,
        headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
    };
    var fileName = 'renew-list.pdf';
    request(options, function (error, response, body) {
        if (error)
            throw new Error(error);
        var pdf = require('html-pdf');
        var options = {
            format: 'A4',
            "border": {
                "top": "30px",
                "right": "10px",
                "bottom": "30px",
                "left": "2px"
            },
            "header": {
                "height": "0px",
                //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
            },
            "footer": {
                "height": "10mm",
                "contents": {
                    default: '<p style="height:20px;"></p><span style="display: inline-block;text-align: center;width: 100%;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span>  Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
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
        //res.send(body);
    });
});

router.get('/add/:product_id', adminAuth.isAllow, function (req, res, next) {
    setProductType(req.params.product_id)
    async.parallel({
        products: function (callback) {
            req.where = {'product_slug': 'nyaya-card-1'}
            models.Product.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        console.log(req.app.locals.loginUser.user_type)
        res.render('admin/' + viewDirectory + '/add', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

//router.get('/add/:product_id', function (req, res, next) {
//
//    var fs = require('fs');
//    var content = "<html><body>TEST!</body></html>";
//
//    config = {
//        url: 'https://docraptor.com/docs',
//        encoding: null, //IMPORTANT! This produces a binary body response instead of text
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        json: {
//            user_credentials: "YOUR_API_KEY_HERE",
//            doc: {
//                document_content: content,
//                type: "pdf",
//                test: true,
//                // prince_options: {
//                //   media:   "screen",          // use screen styles instead of print styles
//                //   baseurl: "http://hello.com" // URL to use for generating absolute URLs for assets from relative URLs
//                // }
//            }
//        }
//    };
//
//    fs.writeFile('doc_raptor_sample.pdf', body, "binary", function (writeErr) {
//        console.log('Saved!');
//    });
//
//
//});
router.get('/add2/:product_id', function (req, res, next) {

    var select = require('xml-crypto').xpath
            , dom = require('xmldom').DOMParser
            , SignedXml = require('xml-crypto').SignedXml
            , FileKeyInfo = require('xml-crypto').FileKeyInfo
            , fs = require('fs')

    var xml = fs.readFileSync("signed.xml").toString()
    var doc = new dom().parseFromString(xml)

    var signature = select(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]
    var sig = new SignedXml()
    sig.keyInfoProvider = new FileKeyInfo("client_public.pem")
    sig.loadSignature(signature)
    var res = sig.checkSignature(xml)
    if (!res)
        console.log(sig.validationErrors)

    console.log(res)

});

router.get('/edit/:id/:product_id', adminAuth.isAllow, function (req, res, next) {
    setProductType(req.params.product_id)
    var id = req.params.id;

    req.where = {'id': id}
    models[modelName].getFirstValues(req, function (results) {

        if (results.is_active != 2) {
            res.redirect('/admin/arbitration_agreements/' + results.product_id);
            return false;
        }
        //var formValue = data;
        async.parallel({
            service_details: function (callback) {
                req.where = {}
                models.ServiceDetail.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            service_detail_documents: function (callback) {
                req.where = {service_detail_id: results.service_details_primary_id}
                models.ServiceDetailDocument.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            countries: function (callback) {
                req.where = {}
                models.Country.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            stamp_states: function (callback) {
                req.where = {country_id: 1}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            stamp_divisions: function (callback) {
                req.where = {}
                models.Division.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            stamp_district: function (callback) {
                req.where = {}
                models.District.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            stamp_tehsil: function (callback) {
                req.where = {}
                models.Tehsil.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            witness_1_states: function (callback) {
                req.where = {country_id: results.first_witness_country_primary_id}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            witness_1_divisions: function (callback) {
                req.where = {state_id: results.first_witness_state_primary_id}
                models.Division.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            witness_1_district: function (callback) {
                req.where = {division_id: results.first_witness_division_primary_id}
                models.District.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            witness_1_tehsil: function (callback) {
                req.where = {district_id: results.first_witness_district_primary_id}
                models.Tehsil.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            witness_2_states: function (callback) {
                req.where = {country_id: results.second_witness_country_primary_id}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            witness_2_divisions: function (callback) {
                req.where = {state_id: results.second_witness_state_primary_id}
                models.Division.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            witness_2_district: function (callback) {
                req.where = {division_id: results.second_witness_division_primary_id}
                models.District.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            witness_2_tehsil: function (callback) {
                req.where = {district_id: results.second_witness_district_primary_id}
                models.Tehsil.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            government_id_types: function (callback) {
                req.where = {}
                models.GovernmentIdType.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            states_is_business: function (callback) {
                req.where = {is_business_available: 1}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            invoice_countries: function (callback) {
                req.where = {}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            invoice_states: function (callback) {
                req.where = {country_id: 1}
                models.State.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            invoice_divisions: function (callback) {
                req.where = {state_id: results.invoice_state_id_primary_id}
                models.Division.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            invoice_district: function (callback) {
                req.where = {division_id: results.invoice_division_id_primary_id}
                models.District.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
            invoice_tehsil: function (callback) {
                req.where = {district_id: results.invoice_district_id_primary_id}
                models.Tehsil.getAllValues(req, function (data) {
                    callback(null, data);
                });
            },
        }, function (err, data) {
            var objectOfArray = {};
            var arrayOfParty = [];
            var arrayOfMember = [];
            async.forEachOf(results.arbitration_agreement_party_members, function (value, key, callback) {

//                    arrayOfParty.push(value.arbitration_agreement_party_number);
//                    arrayOfMember.push(value.member_no);
//                objectOfArray['party_' + value.arbitration_agreement_party_number + '_member_' + value.member_no] = [];
                objectOfArray['party_' + value.arbitration_agreement_party_number + '_member_' + value.member_no] = [];

                if (typeof objectOfArray['party_' + value.arbitration_agreement_party_number + '_member_' + value.member_no] != 'undefined') {
                    objectOfArray['party_' + value.arbitration_agreement_party_number + '_member_' + value.member_no].push(value.dataValues);
//                    Object.assign(objectOfArray['party_' + value.arbitration_agreement_party_number + '_member_' + value.member_no],value.dataValues);
                }
            });
            var formValueJson = JSON.stringify(objectOfArray)

//            prNo = '';
//            prObj = {}
////            console.log(results.arbitration_agreement_party_members);
//            async.forEachOf(results.arbitration_agreement_party_members, function (value, key, callback) {
//
//                if (value.arbitration_agreement_party_number == prNo) {
//                    arrayOfMember.push(value);
//                    if (results.arbitration_agreement_party_members.length == key + 1) {
//                        var count = parseInt(prNo);
//                        prObj[count] = arrayOfMember;
//                    }
//                } else {
//                    if (prNo == '') {
//                        arrayOfMember.push(value);
//                    }
//                    else {
//                        prObj[prNo] = arrayOfMember;
//                        arrayOfMember = [];
//                        arrayOfMember.push(value);
//                        if (results.arbitration_agreement_party_members.length == key + 1) {
//                            var count = parseInt(prNo) + 1;
//                            prObj[count] = arrayOfMember;
//                        }
//                    }
//                }
//                prNo = value.arbitration_agreement_party_number;
//            });


//            console.log('results.countries.length');
//            console.log(prObj);

            arrayForParties = [];
            arrayForMembers = {};
            async.forEachOf(results.arbitration_agreement_party_members, function (value, key, callback) {

                if (arrayForParties.indexOf(value.arbitration_agreement_party_number) < 0) {

                    arrayForParties.push(value.arbitration_agreement_party_number);
                    arrayForMembers[value.arbitration_agreement_party_number] = [];
                    arrayForMembers[value.arbitration_agreement_party_number].push(value);
                } else {
                    arrayForMembers[value.arbitration_agreement_party_number].push(value);
                }

            });

//            res.send(data);
            res.render('admin/' + viewDirectory + '/edit', {results: results, formValueJson: formValueJson, formValue: arrayForMembers, data: data, extraVar: extraVar, layout: 'admin/layout/layout'});
        });
//        callback(null, data);
    });



});

router.post('/delete/:id/:product_id', function (req, res, next) {
    var id = req.params.id;
    setProductType(req.params.product_id)
    req.where = {'id': id};
    req.body = {'is_active': req.body.statusUpdated};
    models[modelName].changeStatus(req, function (data) {
        req.flash('type_messages', 'success');
        req.flash('messages', 'Status updated!');
        res.status(200).send({status: true, url: '/admin/' + viewDirectory + '/' + extraVar['product_id']});
//        res.render('admin/' + viewDirectory + '/edit', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });

});

router.post('/proceed_to_view', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            var newMemberObj = [];
            var extraObjToView = {};
            var countForSignature = 0;

            if (req.body.document_valid_from != '') {
                req.body.document_valid_from = req.app.locals.site.momentObj(req.body.document_valid_from, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            if (req.body.document_valid_to != '') {
                req.body.document_valid_to = req.app.locals.site.momentObj(req.body.document_valid_to, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            if (req.body.stamp_date != '') {
                req.body.stamp_date = req.app.locals.site.momentObj(req.body.stamp_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            if (req.body.term_conditions === 'on') {
                req.body.term_conditions = 1;
            } else {
                req.body.term_conditions = '';
            }

            if (req.body.invoice_country_id == '') {
                req.body.invoice_country_id = '';
                req.body.invoice_country_id_primary_id = null;
            }
            if (req.body.invoice_state_id == '') {
                req.body.invoice_state_id = '';
                req.body.invoice_state_id_primary_id = null;
            }
            if (req.body.invoice_division_id == '') {
                req.body.invoice_division_id = '';
                req.body.invoice_division_id_primary_id = null;
            }
            if (req.body.invoice_district_id == '') {
                req.body.invoice_district_id = '';
                req.body.invoice_district_id_primary_id = null;
            }
            if (req.body.invoice_tehsil_id == '') {
                req.body.invoice_tehsil_id = '';
                req.body.invoice_tehsil_id_primary_id = null;
            }

            req.body.arbitration_agreement_fees = {is_active: 1};
            req.body.parent_arbitration_agreements_id = 0;
            req.body.added_date = req.app.locals.site.momentObj().format('YYYY-MM-DD HH:mm:ss');

            var role_type_slug = req.user.user_type.role_type_slug;

            async.forEach(req.body.arbitration_agreement_party_members, function (value, callback) {
                if (typeof value != 'undefined') {

                    async.forEach(value, function (value1, callback1) {
                        if (typeof value1 != 'undefined') {
                            newMemberObj.push(value1);
                        }
                    });
                }
                callback(null, '');

            });
            var modelBuild = models[modelName].build(req.body);
//            var ServiceDetailDocumentBuild = models.ServiceDetailDocument.build(req.body.service_detail_documents);
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
                    async.forEach(newMemberObj, function (value1, callback1) {
                        var arbitrationAgreementsMember = models.ArbitrationAgreementPartyMembers.build(value1);

                        arbitrationAgreementsMember.validate().then(function (err) {

                            if (err != null) {
                                async.forEach(err.errors, function (errObj, callback2) {
                                    errObj.path = errObj.path + '_' + value1.party_no + '_' + value1.member_no;
                                    errors = errors.concat(errObj);
                                });
                            }
                            callback1(null, errors);

                        });
                    }, function (err) {
                        callback(null, errors);
                    });
                }
            ], function (err) {

                if (errors.length == 0) {
                    req.product_id = req.body.product_id;
                    req.service_details_id = req.body.service_details_primary_id;
                    req.agreement_value = req.body.agreement_value;
                    req.doc_name = req.body.service_detail_documents_id;
                    req.state = req.body.invoice_state_id;

                    var yearDurationStamp = timediff(req.body.document_valid_from, req.body.document_valid_to, 'YD');
//                    if (yearDurationStamp.years < 5 && yearDurationStamp.days > 0) {
//                        var yearDurationStampPlus = parseInt(yearDurationStamp.years) + 1;
//                    } else if (yearDurationStamp.years < 5 && yearDurationStamp.days == 0) {
//                        var yearDurationStampPlus = yearDurationStamp.years;
//                    } else {
//                        var yearDurationStampPlus = 5;
//                    }

                    models['User'].feesCalc(req, function (data1) {

                        if (!data1.status) {
                            res.status(400).send({status: false, msgType: true, msg: data1.msg, data: []});
                            return false;
                        } else {
                            data1 = data1.data;
                            var yearWiseFee = [];
//                            var selectedYear = 0;
                            var creditPaymentStatus;
                            async.forEachOf(data1.fees, function (value1, key, callback1) {
                                if (value1['year']) {
                                    yearWiseFee[value1['year']] = req.app.locals.site.formatCurrencyObj(value1['total_fees']);
                                    callback1(null);
                                }
                            }, function (err) {
                                var req1 = {};
                                var current_time = new req.app.locals.site.momentObj().format("YYYY-MM-DD HH:mm:ss");
                                req1.where = {'stamp_no': req.body.stamp_number, verify: 1, expire_date: {$gt: current_time}}
                                models['FreezeDeal'].getByValue(req1, function (freez_data) {
                                    console.log(freez_data);

                                    var saveDocumentYear = parseInt(yearWiseFee.length) - 1;

                                    if (yearDurationStamp.years < saveDocumentYear && yearDurationStamp.days > 0) {
                                        var yearDurationStampPlus = parseInt(yearDurationStamp.years) + 1;
                                    } else if (yearDurationStamp.years < saveDocumentYear && yearDurationStamp.days == 0) {
                                        var yearDurationStampPlus = yearDurationStamp.years;
                                    } else {
                                        var yearDurationStampPlus = saveDocumentYear;
                                    }
                                    extraObjToView.settingData = req.app.locals.settingData;
                                    //check prof. AP and deedwriter AP ids
                                    if (freez_data) {
                                        console.log(req.app.locals.loginUser.franchise_id);
                                        if (req.app.locals.loginUser.franchise_id && req.app.locals.loginUser.franchise_id != '' && req.app.locals.loginUser.franchise_id.indexOf(',') >= 0) {

                                            var apIdsArr = req.app.locals.loginUser.franchise_id.split(',');
                                            if (apIdsArr.indexOf(freez_data.users.user_franchises.franchise_id.toString()) >= 0) {
                                                creditPaymentStatus = true;
                                                console.log('ProfessinalAPid-', freez_data.users.user_franchises.franchise_id)
                                            } else {
                                                creditPaymentStatus = false;
                                            }
                                        } else {
                                            var apIdsArr = req.app.locals.loginUser.franchise_id;
                                            if (freez_data && apIdsArr == freez_data.users.user_franchises.franchise_id) {
                                                creditPaymentStatus = true;
                                                console.log('ProfessinalAPid-', freez_data.users.user_franchises.franchise_id)
                                            } else {
                                                creditPaymentStatus = false;
                                            }
                                        }
                                        extraObjToView.ProfessinalAPid = freez_data.users.user_franchises.franchise_id;
                                        extraObjToView.creditPaymentStatus = creditPaymentStatus;

                                        console.log('CurrentUserAPid-', apIdsArr)
                                    } else {
                                        //if stamp is not freeze then ap id will be consider to professional 
                                        // but in case of DW no will be update 
                                        if (req.user.user_type.user_role.role_slug == 'professional') {
                                            extraObjToView.ProfessinalAPid = req.user.franchise_id;
                                        }
                                    }
                                    console.log(extraObjToView);
                                    if (req.body.id) {
                                        models[modelName].updateAllValues(req, function (results) {
                                            if (results.status) {
                                                res.status(200).send({status: true, results: results, data: yearWiseFee, role_type_slug: role_type_slug, yearDurationStampPlus: yearDurationStampPlus, extraObjToView: extraObjToView});
                                            } else {
                                                res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                                            }
                                        });
                                    } else {
                                        models[modelName].saveAllValues(req, function (results) {
                                            if (results.status) {
                                                res.status(200).send({status: true, results: results, data: yearWiseFee, role_type_slug: role_type_slug, yearDurationStampPlus: yearDurationStampPlus, extraObjToView: extraObjToView});
                                            } else {
                                                res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                                            }
                                        });
                                    }
                                });

                            });
                        }
                    });

                } else {
                    res.status(400).send({status: false, msg: ' saved d failed', data: errors});
                }
            });
        }

    });
});



router.post('/load_agreement_view_details', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            var data1 = {};
            data1 = req.body;

            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%');

            data1.arbitration_agreement_party_members = req.body.arbitration_agreement_party_members;
            var modelNamesArray = ['countries', 'states', 'divisions', 'districts', 'tehsils', 'service_details', 'service_detail_documents'];

            async.parallel({
                countries: function (callback) {
                    if (modelNamesArray.indexOf('countries') >= 0) {
                        models['Country'].getAllValues(req, function (result) {

                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.country_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }

                },
                states: function (callback) {
                    if (modelNamesArray.indexOf('states') >= 0) {
                        models['State'].getAllValues(req, function (result) {

                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.state_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }

                },
                divisions: function (callback) {
                    if (modelNamesArray.indexOf('divisions') >= 0) {
                        models['Division'].getAllValues(req, function (result) {

                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.district_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }

                },
                districts: function (callback) {
                    if (modelNamesArray.indexOf('districts') >= 0) {
                        models['District'].getAllValues(req, function (result) {

                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.district_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }

                },
                tehsils: function (callback) {
                    if (modelNamesArray.indexOf('tehsils') >= 0) {
                        models['Tehsil'].getAllValues(req, function (result) {

                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.tehsil_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }

                },
                role_types: function (callback) {
                    if (modelNamesArray.indexOf('role_types') >= 0) {
                        models['RoleType'].getAllValues(req, function (result) {
                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.role_type_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }
                },
                roles: function (callback) {
                    if (modelNamesArray.indexOf('role_name') >= 0) {
                        models['Role'].getAllValues(req, function (result) {
                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.role_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }
                },
                service_details: function (callback) {
                    if (modelNamesArray.indexOf('service_details') >= 0) {
                        models['ServiceDetail'].getAllValues(req, function (result) {
                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.service_details_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }
                },
                service_detail_documents: function (callback) {
                    if (modelNamesArray.indexOf('service_detail_documents') >= 0) {
                        models['ServiceDetailDocument'].getAllValues(req, function (result) {
                            var data = {};
                            result.map(function (value) {
                                data[value.id] = value.documents_name
                                return data;
                            });
                            callback(null, data);
                        });
                    } else {
                        callback(null, true);
                    }
                },
            }, function (err, data) {

//                data.formValue = data1;
                console.log(data);
                console.log(data1);
                res.render('admin/' + viewDirectory + '/view_detail', {status: true, msg: '', data: data1, all_data: data, layout: false});
            });
        }

    });
});

router.post('/get_complete_bank_details', function (req, res, next) {

    var modelNamesArray = ['countries', 'states', 'divisions', 'districts', 'tehsils'];

    async.parallel({
        countries: function (callback) {
            if (modelNamesArray.indexOf('countries') >= 0) {
                models['Country'].getAllValues(req, function (result) {

                    var data = {};
                    result.map(function (value) {
                        data[value.id] = value.country_name
                        return data;
                    });
                    callback(null, data);
                });
            } else {
                callback(null, true);
            }

        },
        states: function (callback) {
            if (modelNamesArray.indexOf('states') >= 0) {
                req.where = {country_id: req.user.country_id}
                models['State'].getAllValues(req, function (result) {

//                    var data = {};
//                    result.map(function (value) {
//                        data[value.id] = value.state_name
//                        return data;
//                    });
                    callback(null, result);
                });
            } else {
                callback(null, true);
            }

        },
        divisions: function (callback) {
            if (modelNamesArray.indexOf('divisions') >= 0) {
                req.where = {state_id: req.user.state_id}
                models['Division'].getAllValues(req, function (result) {

//                    var data = {};
//                    result.map(function (value) {
//                        data[value.id] = value.division_name
//                        return data;
//                    });
                    callback(null, result);
                });
            } else {
                callback(null, true);
            }

        },
        districts: function (callback) {
            if (modelNamesArray.indexOf('districts') >= 0) {
                req.where = {division_id: req.user.division_id}
                models['District'].getAllValues(req, function (result) {

//                    var data = {};
//                    result.map(function (value) {
//                        data[value.id] = value.district_name
//                        return data;
//                    });
                    callback(null, result);
                });
            } else {
                callback(null, true);
            }

        },
        tehsils: function (callback) {
            if (modelNamesArray.indexOf('tehsils') >= 0) {
                req.where = {district_id: req.user.district_id}
                models['Tehsil'].getAllValues(req, function (result) {

//                    var data = {};
//                    result.map(function (value) {
//                        data[value.id] = value.tehsil_name
//                        return data;
//                    });
                    callback(null, result);
                });
            } else {
                callback(null, true);
            }

        },
    }, function (err, data) {

        res.status(200).send({status: true, bank_detail: data, user_detail: req.user});
//        console.log(data1);
//                res.render('admin/' + viewDirectory + '/view_detail', {status: true, msg: '', data: data1, all_data: data, layout: false});
    });

});

router.post('/update_fee', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
//        if (req.files.length) {
//            req.body.profile_image = req.files[0].filename;
//        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            var service_details_name;
            var serviceDetailId;
            var arbitrationId;
            var product_id;
            var agreement_value;
            var doc_name;
            var state;

            var req1 = {};
            var req2 = {};
            var arbitrationGetId = req.body.id;
            if (req.body.ProfessinalAPid !== 'undefined') {
                var ProfessinalAPid = req.body.ProfessinalAPid;
            } else {
                var ProfessinalAPid = null;
            }

            req1.where = {'id': req.body.id};
            models[modelName].getFirstValues(req1, function (results1) {

                var time_to_pay = new Date(req.app.locals.site.momentObj()).getTime();
                var time_to_pay1 = new Date(req.app.locals.site.momentObj(time_to_pay).add(1, 'hours')).getTime();
                var time_to_pay2 = new Date(req.app.locals.site.momentObj(time_to_pay).add(364, 'days')).getTime();
                parent_arbitration_agreements_id = results1.parent_arbitration_agreements_id;

                if (parent_arbitration_agreements_id == 0) {
                    req2.where = {stamp_number: results1.stamp_number, $or: [{is_active: [1, 3]}, {is_active: 2, user_id: {$ne: req.user.id}, time_to_pay: {$gt: time_to_pay}}]};
                } else {
                    req2.where = {stamp_number: results1.stamp_number, is_active: 1, is_renewed: {$ne: 0}, time_to_pay: {$gt: time_to_pay1}};
                }
                models[modelName].getAllValues(req2, function (results_to_pay) {
//                    console.log(results_to_pay);
                    var plainTextData = results1.get({plain: true});
                    service_details_name = results1.service_details_id;
                    arbitrationId = results1.id;
                    product_id = results1.product_id;
                    agreement_value = results1.agreement_value;
                    serviceDetailId = results1.service_details_primary_id;
                    doc_name = results1.service_detail_documents_id;
                    state = results1.invoice_state_id;


                    var parent_data;
                    if (parent_arbitration_agreements_id != 0) {
                        var req2 = {};
                        req2.where = {id: parent_arbitration_agreements_id};
                        models[modelName].getFirstValues(req2, function (parent) {
                            parent_data = parent.get({plain: true});
                        });
                    }


                    //                var dataForFee = {};
                    req.product_id = product_id;
                    req.service_details_id = serviceDetailId;
                    req.agreement_value = agreement_value;
                    req.doc_name = doc_name;
                    req.state = state;
                    req.parent_arbitration_agreements_id = parent_arbitration_agreements_id;
                    if (parent_arbitration_agreements_id != 0) {
                        req.is_renew = 1;
                    }

                    if (plainTextData.arbitration_agreement_party_members.length < 2) {
                        req.flash('type_messages', 'info');
                        req.flash('messages', 'Something went worng, Please try again');
                        res.status(200).send({status: true, msg: '', url: '/admin/arbitration_agreements/' + plainTextData['product_id']});
                        return false;
                    } else if (results_to_pay.length != 0) {
                        req.flash('type_messages', 'info');
                        req.flash('messages', 'Something went worng, Please try again after some time');
                        res.status(200).send({status: true, msg: '', url: '/admin/arbitration_agreements/' + plainTextData['product_id']});
                        return false;
                    } else {
                        models['User'].feesCalc(req, function (data1) {
                            if (!data1.status) {
                                res.status(400).send({status: false, msg: '23424242', data: data1.msg});
                                return false;
                            }
//                            console.log('data1')
//                            console.log(data1.data.fees)
                            data1 = data1.data;
                            var allData = {};
                            var yearWiseFee = {};
                            var yearWiseTax = {};
                            yearWiseFee['arbitration_agreements_id'] = req.body.id;

                            yearWiseFee['examption_disputes'] = data1['doc_data'].examption_disputes;
                            yearWiseFee['examption_appeal_payable'] = data1['doc_data'].examption_appeal_payable;
                            yearWiseFee['examption_fee_payable'] = data1['doc_data'].examption_fee_payable;
                            yearWiseFee['renew_percentage'] = data1['doc_data'].renew_percentage;
                            yearWiseFee['holiday_period'] = data1['doc_data'].dry_period;

                            async.forEachOf(data1.fees, function (value1, key, callback1) {

                                if (value1['year']) {
                                    if (value1['year'] == req.body.year_nayacard) {
                                        yearWiseFee['arbitration_agreement_total_year'] = req.body.year_nayacard;
                                        yearWiseFee['arbitration_agreement_basic_fee'] = value1['base_fee'];
                                        yearWiseFee['arbitration_agreement_per_year_fee'] = value1['base_fee_per_year'];
                                        yearWiseFee['arbitration_agreement_total_fees_cess'] = value1['cess'];
                                        yearWiseFee['arbitration_agreement_total_fees_tax'] = value1['tax'];
                                        yearWiseFee['arbitration_agreement_total_fees_without_tax'] = value1['fees_without_tax'];
                                        yearWiseFee['arbitration_agreement_total_fees'] = value1['total_fees'];
                                        yearWiseFee['arbitration_agreement_start_year'] = req.app.locals.site.momentObj().format('YYYY');
                                        yearWiseFee['arbitration_agreement_services_discount'] = value1['services_discount'];
                                        yearWiseFee['arbitration_agreement_renew_discount'] = value1['renew_discount'];
                                        yearWiseFee['arbitration_agreement_services_discount_per'] = value1['services_discount_per'];
                                        yearWiseFee['arbitration_agreement_renew_discount_per'] = value1['renew_discount_per'];
                                        yearWiseFee['arbitration_agreement_total_discount'] = value1['total_discount'];

                                        if (parent_arbitration_agreements_id != 0) {
                                            yearWiseFee['nc_start_date'] = req.app.locals.site.momentObj(parent_data.arbitration_agreement_fees.nc_end_date).add(1, 'days').format('YYYY-MM-DD');
                                            yearWiseFee['nc_end_date'] = req.app.locals.site.momentObj(yearWiseFee['nc_start_date']).add(req.body.year_nayacard, 'years').subtract(1, 'days').format('YYYY-MM-DD');
                                            var document_valid_to_timestamp = new Date(req.app.locals.site.momentObj(parent_data.document_valid_to)).getTime();
                                            var nc_end_date_timestamp = new Date(req.app.locals.site.momentObj(yearWiseFee['nc_end_date'])).getTime();
                                            console.log('------Start Date With Holiday-----');
                                            console.log(results1.document_valid_from, ',,,,', yearWiseFee['nc_start_date']);
                                            if (nc_end_date_timestamp > document_valid_to_timestamp) {
                                                console.log('------Document valid To-----');
                                                console.log('-------------------------', results1.document_valid_to);
                                                console.log('------End Date-----');
                                                console.log(yearWiseFee['nc_end_date']);
                                                yearWiseFee['nc_end_date'] = req.app.locals.site.momentObj(parent_data.document_valid_to).add(data1['doc_data'].dry_period, 'months').format('YYYY-MM-DD');
                                            }
                                        } else {

                                            yearWiseFee['nc_start_date'] = req.app.locals.site.momentObj(results1.document_valid_from).add(data1['doc_data'].dry_period, 'months').format('YYYY-MM-DD');
                                            yearWiseFee['nc_end_date'] = req.app.locals.site.momentObj(yearWiseFee['nc_start_date']).add(req.body.year_nayacard, 'years').subtract(1, 'days').format('YYYY-MM-DD');
                                            var document_valid_to_timestamp = new Date(req.app.locals.site.momentObj(results1.document_valid_to)).getTime();
                                            var nc_end_date_timestamp = new Date(req.app.locals.site.momentObj(yearWiseFee['nc_end_date'])).getTime();
                                            console.log('------Start Date With Holiday-----');
                                            console.log(results1.document_valid_from, ',,,,', yearWiseFee['nc_start_date']);
                                            if (nc_end_date_timestamp > document_valid_to_timestamp) {
                                                console.log('------Document valid To-----');
                                                console.log('-------------------------', results1.document_valid_to);
                                                console.log('------End Date-----');
                                                console.log(yearWiseFee['nc_end_date']);
                                                yearWiseFee['nc_end_date'] = req.app.locals.site.momentObj(results1.document_valid_to).add(data1['doc_data'].dry_period, 'months').format('YYYY-MM-DD');
                                            }
                                        }

                                    }

                                    callback1(null);
                                    console.log('yearWiseFee');
                                }

                            }, function (err) {
                                yearWiseTax = data1.tax_data[req.body.year_nayacard];

                                var req3 = {};
                                req3.where = {arbitration_agreements_id: req.body.id};
                                req3.body = yearWiseFee;
                                var professionalUserId = null;

                                models['ArbitrationAgreementFee'].updateAllValues(req3, function (data) {

                                    async.parallel([
                                        function (callback) {
                                            var taxWithAll = [];
                                            async.forEachOf(yearWiseTax, function (value1, key, callback1) {
                                                value1.arbitration_agreements_id = req.body.id;
                                                taxWithAll = taxWithAll.concat(value1);
                                                callback1(null);
                                            }, function (err) {
                                                var req4 = {};
                                                req4.body = taxWithAll;
                                                models['ArbitrationAgreementTax'].createAllBulkValues(req4, function (data1) {
                                                    callback(null);
                                                });
                                            });
                                        },
                                        function (callback) {
                                            if (parent_arbitration_agreements_id == 0) {
                                                console.log('pppppppppppp)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))');
                                                var current_time = new req.app.locals.site.momentObj().format("YYYY-MM-DD HH:mm:ss");
                                                req.where = {'stamp_no': results1.stamp_number, verify: 1, expire_date: {$gt: current_time}}
                                                req.order = ' id desc '
                                                models['FreezeDeal'].getByValue(req, function (stamp_data) {

//                                                    console.log(stamp_data);
                                                    if (stamp_data) {
                                                        updateFreezValues = {}
                                                        updateFreezValues.deal_status = 1;
                                                        req.body = updateFreezValues;
                                                        req.where = {id: stamp_data.id};
                                                        models['FreezeDeal'].updateByValue(req, function (update_data) {

                                                            updateArbArg = {};
                                                            updateArbArg.freeze_id = stamp_data.id;
                                                            updateArbArg.freeze_user_id = stamp_data.user_id;
                                                            req.body = updateArbArg;
                                                            req.where = {id: results1.id};
                                                            models[modelName].updateFee(req, function (data) {
                                                                callback(null);
                                                            });
                                                        });
                                                    } else {
                                                        callback(null);
                                                    }
                                                });
                                            } else {
                                                callback(null);
                                            }
                                        },
                                        function (callback) {
                                            if (results1.create.create_role_type.create_roles.role_slug == 'professional') {
                                                professionalUserId = results1.user_id;
                                            }

                                            var current_time = new req.app.locals.site.momentObj().format("YYYY-MM-DD HH:mm:ss");
                                            req.where = {'stamp_no': results1.stamp_number, verify: 1, expire_date: {$gt: current_time}}
                                            req.order = ' id desc '

                                            models['FreezeDeal'].getByValue(req, function (stamp_data) {

                                                if (stamp_data) {
                                                    professionalUserId = stamp_data.user_id;
                                                    callback(null);
                                                } else {
                                                    callback(null);
                                                }
                                            });

                                        },
                                        function (callback) {

                                            updateArbArg = {};
                                            updateArbArg.time_to_pay = time_to_pay1;
                                            req.body = updateArbArg;
                                            req.where = {id: results1.id};
                                            models[modelName].updateFee(req, function (data) {
                                                callback(null);
                                            });
                                        },
                                        function (callback) {
                                            if (parent_arbitration_agreements_id == 0) {
                                                req.where = {'stamp_no': results1.stamp_number}
                                                models['Stamp'].getByValue(req, function (stamp_data) {
                                                    if (stamp_data) {
                                                        updateArbArg = {};
                                                        updateArbArg.stamp_id = stamp_data.id;
                                                        updateArbArg.stamp_user_id = stamp_data.user_id;
                                                        req.body = updateArbArg;
                                                        req.where = {id: results1.id};
                                                        models[modelName].updateFee(req, function (data) {
                                                            callback(null);
                                                        });
                                                    } else {
                                                        callback(null);
                                                    }
                                                });
                                            } else {
                                                callback(null);
                                            }
                                        },
                                        function (callback) {
                                            if (parent_arbitration_agreements_id == 0) {
                                                if (ProfessinalAPid) {
                                                    var current_time = new req.app.locals.site.momentObj().format("YYYY-MM-DD HH:mm:ss");
                                                    req.where = {'stamp_no': results1.stamp_number, verify: 1, expire_date: {$gt: current_time}}
                                                    req.order = ' id desc '
                                                    models['FreezeDeal'].getByValue(req, function (freezed_data) {
                                                        req.body.tehsil_ap = ProfessinalAPid;
                                                        models['FranchiseLevel'].getAllParentFromTehsilId(req, function (ap_chain) {

                                                            console.log('ap_chain---------------=---==--=-=-==-=-==-');
                                                            console.log(ap_chain);
                                                            console.log(ProfessinalAPid);
                                                            if (freezed_data || req.user.user_type.user_role.role_slug == 'professional') {
                                                                updateArbArg = {};
                                                                updateArbArg.franchise_id = ProfessinalAPid;
                                                                updateArbArg.franchise_district_id = ap_chain[0].district_level;
                                                                updateArbArg.franchise_division_id = ap_chain[0].division_level;
                                                                updateArbArg.franchise_state_id = ap_chain[0].state_level;
                                                                updateArbArg.franchise_country_id = ap_chain[0].country_level;
                                                            } else {
                                                                updateArbArg = {};
                                                                updateArbArg.franchise_id = null;
                                                                updateArbArg.franchise_district_id = null;
                                                                updateArbArg.franchise_division_id = null;
                                                                updateArbArg.franchise_state_id = null;
                                                                updateArbArg.franchise_country_id = null;
                                                                updateArbArg.freeze_user_id = null;
                                                                updateArbArg.freeze_id = null;
                                                            }

                                                            req.body = updateArbArg;
                                                            req.where = {id: results1.id};
                                                            console.log('updateArbArg@@@@@@@@@@@@')
                                                            console.log(ap_chain)
                                                            models[modelName].updateFee(req, function (data) {
                                                                callback(null);
                                                            });
                                                        });
                                                    });

                                                } else {
                                                    updateArbArg = {};
                                                    updateArbArg.franchise_id = null;
                                                    updateArbArg.franchise_district_id = null;
                                                    updateArbArg.franchise_division_id = null;
                                                    updateArbArg.franchise_state_id = null;
                                                    updateArbArg.franchise_country_id = null;
                                                    updateArbArg.freeze_user_id = null;
                                                    updateArbArg.freeze_id = null;
                                                    req.body = updateArbArg;
                                                    req.where = {id: results1.id};
                                                    models[modelName].updateFee(req, function (data) {
                                                        callback(null);
                                                    });
//                                                callback(null);
                                                }
                                            } else {
                                                callback(null);
                                            }
                                        }
                                    ], function () {
                                        if (parent_arbitration_agreements_id != 0) {
                                            req.is_renew = 1;
                                        }
                                        req.id = arbitrationGetId;
                                        req.professionalUserId = professionalUserId;
                                        req.product_id = product_id;
                                        req.service_detail_id = serviceDetailId;
                                        models['CommissionDistribution'].saveCommission(req, function (data2) {
                                            console.log(professionalUserId)
                                            res.status(200).send({status: true, 'url': '/admin/commission_distributions/pay/' + arbitrationGetId + '/1'});
                                        });

                                    });

                                });
                            });

                        });

                    }


                });
            });
        }
    });
});


router.get('/complete_payment/:arbitration_id/:year_nayacard', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
//        if (req.files.length) {
//            req.body.profile_image = req.files[0].filename;
//        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {
            console.log(req.body)
            res.render('admin/' + viewDirectory + '/', {status: true, msg: '', data: req.body});
//            res.render('admin/' + viewDirectory + '/complete_payment', {status: true, msg: '', data: req.body});
        }
    });
});


router.get('/view_agreement/:id/:show', function (req, res, next) {

    var layoutIS = false;
    if (req.params.show == 1) {
        layoutIS = 'admin/layout/layout';
    }

    req.where = {id: req.params.id};
    models[modelName].getAgreementView(req, function (results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/view_agreement', {status: true, msg: '', data: results, layout: layoutIS, show: req.params.show});
    });
});


router.get('/view_agreement/:id/:show/:ismanul', function (req, res, next) {

    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {

    var fullUrl = req.protocol + '://' + req.get('host');

    var request = require("request");

    var options = {method: 'GET',
        url: fullUrl + '/admin/arbitration_agreements/download_agreement/' + req.params.id + '/0',
        headers:
               {
               'cache-control': 'no-cache',
               'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
    };
        var fileName = 'Arbitration-agreement-No-' + results.aa_id + '-sign.pdf';

        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);

            var pdf = require('html-pdf');
            var options = {
                format: 'A4',
                "border": {
                    "top": "30px",
                    "right": "10px",
                    "bottom": "0.7in",
                    "left": "2px"
                },
                "header": {
                    "height": "0px",
                    //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
                },
                "footer": {
                    "height": "120px",
                    "contents": {
                        default: '<p style="height:100px;" ></p><span style="display: inline-block;text-align: center;width: 100%;height:20px;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of Agreement Id <span>' + results.aa_id + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
                    }
                }

            };
            html = body;
            pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
                if (err)
                    return console.log(err);

            var pdftojson = require('pdftojson');    
            pdftojson('./public/pdfs/' + fileName).then((output) => {
                
            var totalPageCount=output.length;     

            var pdf = require('pdf-write-page');

            for(var i=0; i<totalPageCount; i++){

            var y=100;   

            if(i==0)
             y=300   

            pdf({in:'./public/pdfs/'+fileName, out:'./public/pdfs/'+fileName,pageNumber:i})
            .page(i)
            .image(80, y, './public/images/chk.png',{transformation:{width:400,height:400}})
            .restoreCfg()
            .end()    

            }       


                var layoutIS = false;
    if (req.params.show == 1) {
        layoutIS = 'admin/layout/layout';
    }

    req.where = {id: req.params.id};
    models[modelName].getAgreementView(req, function (results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/view_agreement', {status: true, msg: '', data: results, layout: layoutIS, show: req.params.show,ismanul:1});
    });


    });



                //console.log(res); // { filename: '/app/businesscard.pdf' } 
                //res.download('./public/pdfs/' + fileName, fileName);
            });

            //res.send(body);
        });
    });



});

router.get('/view_detail/:id', function (req, res, next) {

    req.where = {id: req.params.id};
    models[modelName].getAgreementView(req, function (results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/view_detail', {status: true, msg: '', data: results, layout: false});
    });
});


router.get('/invoice/:id/:show', function (req, res, next) {

    var layoutIS = false;
    if (req.params.show == 1) {
        layoutIS = 'admin/layout/layout';
    }


    req.where = {id: req.params.id};
    models[modelName].getAgreementView(req, function (results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/invoice', {status: true, msg: '', data: results, layout: layoutIS, show: req.params.show});
    });
});



router.get('/naya_card/:id/:show', function (req, res, next) {

    var layoutIS = false;
    if (req.params.show == 1) {
        layoutIS = 'admin/layout/layout';
    }

    req.where = {id: req.params.id};
    models[modelName].getAgreementView(req, function (results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/naya_card', {status: true, msg: '', data: results, layout: layoutIS, show: req.params.show});
    });
});



router.get('/download_agreement/:id/:show', function (req, res, next) {

    req.where = {id: req.params.id};
    models[modelName].getAgreementView(req, function (results) {
        //res.send(results);
        res.render('admin/' + viewDirectory + '/view_agreement', {status: true, msg: '', data: results, layout: false, show: req.params.show});
    });

});


router.get('/e_sign_step1/:id', function (req, res, next) {


    var fullUrl = req.protocol + '://' + req.get('host');

    var request = require("request");
    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {

    var options = {method: 'GET',
    url: fullUrl + '/admin/arbitration_agreements/download_agreement/' + req.params.id + '/' + req.params.show,
    headers:
               {
               'cache-control': 'no-cache',
               'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
    };
    
    var fileName = 'Arbitration-agreement-No-' + results.aa_id + '.pdf';

    request(options, function (error, response, body) {
            if (error)
                throw new Error(error);

             var pdf = require('html-pdf');

            var options = {
                format: 'A4',
                "border": {
                    "top": "30px",
                    "right": "10px",
                    "bottom": "0.7in",
                    "left": "2px"
                },
                "header": {
                    "height": "0px",
                    //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
                },
                "footer": {
                    "height": "120px",
                    "contents": {
                        default: '<p style="height:100px;" ></p><span style="display: inline-block;text-align: center;width: 100%;height:20px;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of Agreement Id <span>' + results.aa_id + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
                    }
                }

            };


            html = body;
            pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
                if (err)
                    return console.log(err);

        var pdftojson = require('pdftojson');        
        pdftojson('./public/pdfs/' + fileName).then((output) => {

            var totalPageCount=output.length;     

            var pdf = require('pdf-write-page');

            for(var i=0; i<totalPageCount; i++){

            var y=100;   

            if(i==0)
             y=300   

            pdf({in:'./public/pdfs/'+fileName, out:'./public/pdfs/'+fileName,pageNumber:i})
            .page(i)
            .image(80, y, './public/images/chk.png',{transformation:{width:400,height:400}})
            .restoreCfg()
            .end()    

            }    
    
        });



            req.where = {id: req.params.id};
        models[modelName].getAgreementView(req, function (results) {
            //res.send(results);
            res.render('admin/' + viewDirectory + '/e_sign_page1', {status: true, msg: '', data: results, layout: 'admin/layout/layout'});
        });  

        });
    }); 


    });








});

router.get('/e_sign/:id', function (req, res, next) {

    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {

    // var fullUrl = req.protocol + '://' + req.get('host');

    // var request = require("request");

    // var options = {method: 'GET',
    //     url: fullUrl + '/admin/arbitration_agreements/download_agreement/' + req.params.id + '/' + req.params.show,
    //     headers:
    //            {
    //            'cache-control': 'no-cache',
    //            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    //             },
    // };
    //     var fileName = 'Arbitration-agreement-No-' + results.aa_id + '.pdf';

    //     request(options, function (error, response, body) {
    //         if (error)
    //             throw new Error(error);

    //          var pdf = require('html-pdf');

    //         var options = {
    //             format: 'A4',
    //             "border": {
    //                 "top": "30px",
    //                 "right": "10px",
    //                 "bottom": "0.7in",
    //                 "left": "2px"
    //             },
    //             "header": {
    //                 "height": "0px",
    //                 //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
    //             },
    //             "footer": {
    //                 "height": "120px",
    //                 "contents": {
    //                     default: '<p style="height:100px;" ></p><span style="display: inline-block;text-align: center;width: 100%;height:20px;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of Agreement Id <span>' + results.aa_id + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
    //                 }
    //             }

    //         };


    //         html = body;
    //         pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
    //             if (err)
    //                 return console.log(err);

            req.where = {id: req.params.id};
            models[modelName].getAgreementView(req, function (results) {
            //res.send(results);
            res.render('admin/' + viewDirectory + '/e_sign', {status: true, msg: '', data: results, layout: 'admin/layout/layout'});
            });    

    //         });

            
    //     });
    });


});


router.get('/e_sign_api_download/:id/:aid',function(req,res,next){

 var request = require("request");
 var options = { 
    method: 'GET',
    url: 'https://ext.digio.in:444/v2/client/document/download',
    qs: { document_id: req.params.id },
    headers:{ 
        authorization: 'Basic '+env.e_sign.token
    } 
    };
    request(options, function (error, response, body) {

        if (error) 
        throw new Error(error);  
        res.send({status:true});
    }).pipe(fs.createWriteStream('./public/pdfs/Arbitration-agreement-No-'+req.params.aid+'-sign.pdf')
);
});


router.post('/e_sign_verify/:id/:ar_id',function(req,res,next){

    if(req.params.id=='w1' || req.params.id=='w2'){

    var col='first_witness_esign'; 

    if(req.params.id=='w2')   
    col='second_witness_esign';    

    req.where = {id:req.params.ar_id}
    req.body = {[col]: 1}
    models[modelName].changeStatus(req, function (data) {
    res.status(200).send({status: true, message: ''});
    });


    }else{

    req.where = {id:req.params.id}
    req.body = {e_sign: 1}
    models.ArbitrationAgreementPartyMembers.changeStatus(req, function (data) {
    res.status(200).send({status: true, message: ''});
    });

    }

});


 router.post('/e_sign_cord_save',function(req,res,next){


    var pdftojson = require('pdftojson');
    
    var digoJson={};
    var firstSignPage='';
 //var boxData=JSON.parse(req.body.data);
 
 var cordJson={
        "1":{
                "llx": 42.18,
                "lly": 126.57,
                "urx": 183.97,
                "ury": 162.48
            },
        "2":{
                "llx": 217.18,
                "lly": 126.57,
                "urx": 358.97,
                "ury": 162.48
        },            
        "3":{
                "llx": 396.67,
                "lly": 126.57,
                "urx": 538.46,
                "ury": 162.48
            },
        "4":{
                "llx": 42.18,
                "lly": 67.32,
                "urx": 183.97,
                "ury": 103.23
            }, 
        "5":{
                "llx": 217.18,
                "lly": 67.32,
                "urx": 358.97,
                "ury": 103.23
            },         
        "6":{
                "llx": 396.67,
                "lly": 67.32,
                "urx": 538.46,
                "ury": 103.23
            }
    }
    
    var finalCord={};
    sequelize.query("SELECT group_concat(member_mobile_number order by arbitration_agreement_party_number,member_no) mobile , "
        +" (SELECT first_witness_mobile FROM arbitration_agreements where id=?) f_w, "
        +" (SELECT second_witness_mobile FROM arbitration_agreements where id=?) s_w, "
        +" (SELECT aa_id FROM arbitration_agreements where id=?) aa_id "
        +" FROM arbitration_agreement_party_members arp where arbitration_agreements_id=? ",
    {replacements: [req.body.id,req.body.id,req.body.id,req.body.id], type: sequelize.QueryTypes.SELECT}
    ).then(function (data) {


    var pathToPdf = "./public/pdfs/Arbitration-agreement-No-"+data[0].aa_id+".pdf"    


    var mobileArr=data[0]['mobile'].split(',');

    var mobileArrAll=mobileArr;


    if(data[0]['f_w'])
    mobileArrAll.push(data[0]['f_w']);


    if(data[0]['s_w'])
    mobileArrAll.push(data[0]['s_w']);


    console.log('mobileArr=============================');
    console.log(mobileArr);

    var finalObj2={};
   


    pdftojson(pathToPdf).then((output) => {

    //console.log('output=============');
    //console.log(JSON.stringify(output)); 


    var totalPageCount=output.length;   


    mobileArrAll.forEach(function(mob) {
    var pageCount=1;
    
    output.forEach(function(words) {


    //console.log('words====================');        
    //console.log(words);    
    //console.log('words====================');        

    if(words['words']){
    words['words'].forEach(function(textObj) {

    //console.log(textObj['text']);


    var matchArr=textObj['text'].split(' ');


    var matchIndex=matchArr.indexOf('Signature_X_'+mob);


    if(matchIndex > -1)
    {
    var paddingX=0; 

    if(matchIndex > 0)
    paddingX=250;   
    
    var llx=textObj['xMin']+paddingX;
    var urx=llx+143;//output[1]['words'][i]['xMax'];

    var lly=842-textObj['yMin']-24;
    var ury=lly+40;

    var digoJson={"llx": llx,"lly":lly,"urx":urx,"ury":ury};


    //console.log(digoJson);

    if(firstSignPage==''){
    firstSignPage=pageCount;    
    }

    var tempObj={};
    var tempArr=[];
    tempArr.push(digoJson);
    tempObj[pageCount]=tempArr;



    finalObj2[mob]=tempObj;

    }  


    });

    }


    pageCount++;
    });    
    
    }); 



    console.log('finalObj2-=-=-==-=-=-=-=-=-=');
    console.log(firstSignPage);
    console.log(JSON.stringify(finalObj2));
    console.log('finalObj2-=-=-==-=-=-=-=-=-=');



    

    boxData=finalObj2;



    //console.log(mobileArr);
 
    //"{\"7737774330\":{\"2\":[{\"llx\":57,\"lly\":615.25,\"urx\":257,\"ury\":665.25}]},\"9950736033\":{\"2\":[{\"llx\":310,\"lly\":615.25,\"urx\":510,\"ury\":665.25}]},\"9667588668\":{\"2\":[{\"llx\":57,\"lly\":427.75,\"urx\":257,\"ury\":477.75}]},\"9658695865\":{\"2\":[{\"llx\":310,\"lly\":427.75,\"urx\":510,\"ury\":477.75}]},\"7014773849\":{\"2\":[{\"llx\":57,\"lly\":240.25,\"urx\":257,\"ury\":290.25}]},\"7737774335\":{\"2\":[{\"llx\":57,\"lly\":102.25,\"urx\":257,\"ury\":152.25}]}}"
    var pageObj={};
    var cordArr=[]; 
    var pageSet={};
    var index=1;

    mobileArr.forEach(function(element) {


    if(element==data[0]['f_w'] || element==data[0]['s_w']){


    pageObj[element]=boxData[element];    

    }else{


    pageSet={}    

    for(var i=1; i<totalPageCount+1; i++){

    
    cordArr=[];

    if(boxData[element] && boxData[element][i]){
    cordArr.push(boxData[element][i][0]);
    }
    if(firstSignPage > i){
    cordArr.push(cordJson[index]);    
    }

    if(cordArr.length)
    pageSet[i]=cordArr;
    
}

    //if(Object.keys(pageSet).length)
    pageObj[element]=pageSet; 
    
    index++;    


    }




    });



    // var winesBox=boxData;
    // mobileArr.forEach(function(element) {

    // if(winesBox[element]){
    // delete winesBox[element]    
    // }   

    // }); 

    // console.log('winesBox------------------');
    // console.log(winesBox);
    // console.log('winesBox------------------');

    //var pageObj = Object.assign(winesBox,pageObj);


    finalCord=JSON.stringify(pageObj);

     console.log('final data.................sign');
     console.log(JSON.stringify(pageObj));
     console.log('final data.................sign');



    //console.log(req.body.data);
    req.where = {id: req.body.id};

    models[modelName].getFirstValues(req, function (results) {
        //console.log(results.esign_cord);
    if(! results.esign_cord){    
    //if(1){        
    req.where = {'id': req.body.id};
    //req.body = {'esign_cord':JSON.stringify(req.body.data)}; 
    req.body = {'esign_cord':finalCord}; 
    models[modelName].changeStatus(req, function (data) {
    res.send({status:true,msg:'',data:[]});
    }); 
    }else{
    res.send({status:false,msg:'',data:[]});    
    }

    });

    });


    }); 

 });    



router.post('/e_sign_api/:id',function(req,res,next){

req.where = {aa_id: req.params.id}
models[modelName].getFirstValues(req, function (results) {


console.log(results.esign_cord);    


var aa_id=req.params.id;

console.log(req.body.formData);  

var sendApiData={};  


sendApiData['signers']=req.body.formData;
sendApiData['expire_in_days']=10;
sendApiData['display_on_page']="custom";

//sendApiData['sign_coordinates']={"signer_1 identifier":{"2":[{"llx":600,"lly":276,"urx":700,"ury":376}]},"signer_2 identifier":{"2":[{"llx":600,"lly":749,"urx":700,"ury":849}]},"signer_3 identifier":{"2":[{"llx":1535,"lly":276,"urx":1635,"ury":376}]}};

//"sign_coordinates":{ "xyz@abc.com":{ "1":[{ "llx":315,"lly":20, "urx":455,"ury":60}]}}
var esign_cord=JSON.parse(results.esign_cord);
sendApiData['sign_coordinates']=esign_cord//JSON.parse(esign_cord);

// {
//         "7014773849": {
//             "2": [{
//                 "llx":57,"lly":240.25,"urx":257,"ury":280.25
//             }]
//         },
//         "7737774335": {
//             "2": [{
//                 "llx":57,"lly":102.25,"urx":257,"ury":142.25
//             }]
//         }
//     }




console.log('sendApiData=========================');
console.log(sendApiData); 
console.log('sendApiData=========================');

var fs = require("fs");
var request = require("request");

 var options = { 
    method: 'POST',
    url: 'https://ext.digio.in:444/v2/client/document/upload',
    headers:{ 
        authorization: 'Basic '+env.e_sign.token,
        //authorization: 'Basic QUk3RFc1UVJFSDIzWlMzUlNDWTk2TTZPTFc4MkhaODc6Sk0yWkUxTFU4N0lFSkc4Sjc3OUJET0VPVVBFM1hBRlk=',
        //'content-type': 'multipart/form-data' 
    },
    formData:
    { 
    request:JSON.stringify(sendApiData),
    file:
    { 
    value: fs.createReadStream("public/pdfs/Arbitration-agreement-No-"+aa_id+".pdf"),
    options: { filename: 'Arbitration-agreement-No-'+aa_id+'.pdf', contentType: null } } } };

    request(options, function (error, response, body) {

    console.log('all log-----------------------------');    
    console.log(error); 
    //console.log(response); 
    console.log(body);    
    console.log('all log-----------------------------'); 



    console.log('all log-----------------------------^^^^^^^^^^^^^^^^^^^^^');


    //if (error) throw new Error(error);
    //console.log('body-----------------------------');
    //console.log(body);
    //console.log(body.id);

    var p_body=JSON.parse(body);
    //console.log(p_body.id);

    if(p_body.id){
    req.where = {'aa_id': req.params.id};
    req.body = {'esign_res':body,esign_id:p_body.id}; 
    models[modelName].changeStatus(req, function (data) {

    });    
    res.send({status:true,msg:'',data:p_body.id});
    }else{
    res.send({status:false,msg:'',data:''});
    }   

    

    });

    });


    });



router.get('/agreement_download/:id/:show', function (req, res, next) {

    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {

        var fullUrl = req.protocol + '://' + req.get('host');

        var request = require("request");

        var options = {method: 'GET',
            url: fullUrl + '/admin/arbitration_agreements/download_agreement/' + req.params.id + '/' + req.params.show,
            headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    },
        };
        var fileName = 'Arbitration-agreement-No-' + results.aa_id + '.pdf';

        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);

             var pdf = require('html-pdf');
            // var options = {
            //     format: 'A4',
            //     "border": {
            //         "top": "30px",
            //         "right": "10px",
            //         "bottom": "30px",
            //         "left": "2px"
            //     },
            //     "header": {
            //         "height": "0px",
            //         //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
            //     },
            //     "footer": {
            //         "height": "10mm",
            //         "contents": {
            //             default: '<p style="height:20px;"></p><span style="display: inline-block;text-align: center;width: 100%;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of Agreement Id <span>' + results.aa_id + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
            //         }
            //     }

            // };
            var options = {
                format: 'A4',
                "border": {
                    "top": "30px",
                    "right": "10px",
                    "bottom": "0.7in",
                    "left": "2px"
                },
                "header": {
                    "height": "0px",
                    //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
                },
                "footer": {
                    "height": "120px",
                    "contents": {
                        default: '<p style="height:100px;" ></p><span style="display: inline-block;text-align: center;width: 100%;height:20px;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of Agreement Id <span>' + results.aa_id + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
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

            //res.send(body);
        });
    });

});






router.get('/download_naya_card/:id/:show', function (req, res, next) {

    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {

        var fullUrl = req.protocol + '://' + req.get('host');

        var request = require("request");

        var options = {method: 'GET',
            url: fullUrl + '/admin/arbitration_agreements/naya_card/' + req.params.id + '/' + req.params.show,
            headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    },
        };
        var fileName = 'naya_card' + req.params.id + '.pdf';

        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);

            var pdf = require('html-pdf');
            var options = {
                format: 'A4',
                "border": {
                    "top": "30px",
                    "right": "10px",
                    "bottom": "30px",
                    "left": "2px"
                },
                "header": {
                    "height": "0px",
                    //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
                },
                "footer": {
                    "height": "10mm",
                    "contents": {
                        default: '<p style="height:30px;"></p><span style="display: inline-block;text-align: center;width: 100%;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of Nyaya Card No. <span>' + results.ar_id + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
                    }
                }
            };
            // var options = {
            //     format: 'A4',
            //     "border": {
            //         "top": "30px",
            //         "right": "10px",
            //         "bottom": "0.7in",
            //         "left": "2px"
            //     },
            //     "header": {
            //         "height": "0px",
            //         //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
            //     },
            //     "footer": {
            //         "height": "120px",
            //         "contents": {
            //             default: '<p style="height:100px;" ></p><span style="display: inline-block;text-align: center;width: 100%;height:20px;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of Agreement Id <span>' + results.aa_id + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
            //         }
            //     }

            // };
            html = body;
            pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
                if (err)
                    return console.log(err);
                //console.log(res); // { filename: '/app/businesscard.pdf' } 
                res.download('./public/pdfs/' + fileName, fileName);
            });

            //res.send(body);
        });
    });

});




router.get('/download_invoice/:id/:show', function (req, res, next) {

    req.where = {id: req.params.id}
    models[modelName].getFirstValues(req, function (results) {
        var Invoice_no = results.invoice_no;
        var fullUrl = req.protocol + '://' + req.get('host') //+ req.originalUrl;
        var request = require("request");

        var options = {method: 'GET',
            url: fullUrl + '/admin/arbitration_agreements/invoice/' + req.params.id + '/' + req.params.show,
            headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    },
        };
        var fileName = 'invoice' + req.params.id + '.pdf';

        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);

            var pdf = require('html-pdf');
            var options = {
                format: 'A4',
                "border": {
                    "top": "30in",
                    "right": "10in",
                    "bottom": "30in",
                    "left": "2in"
                },
                "header": {
                    "height": "0px",
                    //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
                },
                "footer": {
                    "height": "1mm",
                    "contents": {
                        default: '</p><span style="display: inline-block;text-align: center;width: 100%;"><span style="color: #444;text-align:center;">{{page}} of </span><span>{{pages}}</span>of Invoice No. <span>' + Invoice_no + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
                    }
                }
            };

            // var options = {
            //     format: 'A4',
            //     "border": {
            //         "top": "30px",
            //         "right": "10px",
            //         "bottom": "0.7in",
            //         "left": "2px"
            //     },
            //     "header": {
            //         "height": "0px",
            //         //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
            //     },
            //     "footer": {
            //         "height": "120px",
            //         "contents": {
            //             default: '<p style="height:100px;" ></p><span style="display: inline-block;text-align: center;width: 100%;height:20px;"><span style="color: #444;text-align:center;">Page {{page}} of </span><span>{{pages}}</span> of Agreement Id <span>' + results.aa_id + '</span> Dated ' + req.app.locals.site.momentObj().format('DD-MM-YYYY') + '</span>',
            //         }
            //     }

            // };

            html = body;
            console.log(html);
            pdf.create(html, options).toFile('./public/pdfs/' + fileName, function (err, res2) {
                if (err)
                    return console.log(err);
                //console.log(res); // { filename: '/app/businesscard.pdf' } 
                res.download('./public/pdfs/' + fileName, fileName);
            });

            //res.send(body);
        });
    });

});


router.post('/save_as_draft', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
//            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            setProductType(req.body.product_id)
            console.log(req.body);
//            res.send();

            var newMemberObj = [];
            if (req.body.document_valid_from != '') {
                req.body.document_valid_from = req.app.locals.site.momentObj(req.body.document_valid_from, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            if (req.body.document_valid_to != '') {
                req.body.document_valid_to = req.app.locals.site.momentObj(req.body.document_valid_to, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            if (req.body.stamp_date != '') {
                req.body.stamp_date = req.app.locals.site.momentObj(req.body.stamp_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            if (req.body.term_conditions === 'on') {
                req.body.term_conditions = 1;
            } else {
                req.body.term_conditions = '';
            }

            req.body.added_date = req.app.locals.site.momentObj().format('YYYY-MM-DD HH:mm:ss');
            async.parallel([
                function (callback) {
                    async.forEachOf(req.body.arbitration_agreement_party_members, function (value, key, callback0) {

                        async.forEachOf(value, function (value1, key1, callback1) {
                            async.forEachOf(value1, function (value2, key2, callback2) {

                                if (value2 == '' || value2 == 'undefined') {
                                    delete req.body.arbitration_agreement_party_members[key][key1][key2];
                                }
                            });
                        });
                        callback0(null);

                    }, function (err) {
                        callback(null);
                    });
                },
                function (callback) {
                    var invoiceFieldsEmpty = [
                        'invoice_state_code',
                        'invoice_gst_no',
                        'invoice_address',
                        'invoice_town',
                        'invoice_division_id',
                        'invoice_district_id',
                        'invoice_tehsil_id',
                    ];
                    async.forEachOf(req.body, function (value, key, callback0) {
                        if (key != 'arbitration_agreement_party_members') {

                            if (key == 'place_of_arbitration' && value == '') {
                                req.body.place_of_arbitration = 'select';
                                req.body.place_of_arbitration_primary_id = null;
                            } else if (key == 'place_of_appeal' && value == '') {
                                req.body.place_of_appeal = 'select';
                                req.body.place_of_appeal_primary_id = null;
                            } else if (invoiceFieldsEmpty.indexOf(key) >= 0 && value == '') {
                                if (key == 'invoice_division_id') {
                                    req.body.invoice_division_id = '';
                                    req.body.invoice_division_id_primary_id = null;
                                } else if (key == 'invoice_district_id') {
                                    req.body.invoice_district_id = '';
                                    req.body.invoice_district_id_primary_id = null;
                                } else if (key == 'invoice_tehsil_id') {
                                    req.body.invoice_tehsil_id = '';
                                    req.body.invoice_tehsil_id_primary_id = null;
                                } else {
                                    req.body[key] = '';
                                }

                            } else if (value == '' || value == 0 || value == 'undefined') {
                                delete req.body[key];
                            }
                        }
                        callback0(null);
                    }, function (err) {
                        callback(null);
                    });
                }
            ], function (err) {
//                console.log(req.body);
                if (req.body.id) {
//                    console.log(req.body);
                    models[modelName].updateAllValues(req, function (results) {
                        if (results.status) {
//                            console.log(viewDirectory, extraVar);
                            res.status(200).send({status: true, results: results, url: '/admin/' + viewDirectory + '/' + extraVar['product_id']});

                        } else {
                            res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                        }
                    });
                } else {
                    req.body.arbitration_agreement_fees = {is_active: 1};
                    models[modelName].saveAllValues(req, function (results) {
                        if (results.status) {

                            res.status(200).send({status: true, results: results, url: '/admin/' + viewDirectory + '/' + extraVar['product_id']});

                        } else {
                            res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                        }
                    });
                }

            });
        }
    });
});


router.post('/pre_stamp_check', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
//            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            setProductType(req.body.product_id)
            var req1 = {};
            var current_time = new req.app.locals.site.momentObj().format("YYYY-MM-DD HH:mm:ss");
            req1.where = {'stamp_no': req.body.pre_stamp_number, verify: 1, expire_date: {$gt: current_time}}
            req1.order = ' id desc '
            models['FreezeDeal'].getByValue(req1, function (freez_data) {
//                console.log(freez_data.users.first_name);
                req.where = {stamp_number: req.body.pre_stamp_number, is_active: [1, 3]}
                models[modelName].getFirstValues(req, function (results) {

                    if (results) {

                        res.status(400).send({status: false, status_flag: 'exists'});

                    } else if (freez_data) {

                        var req2 = {};
                        req2.where = {'service_detail_id': freez_data.service_details_id}
                        models['ServiceDetailDocument'].getAllValues(req2, function (service_detail_document) {
                            res.status(200).send({status: true, freez_data: freez_data, service_detail_document: service_detail_document});
                        });
                    } else {
                        res.status(400).send({status: false, status_flag: 'exists_not'});
                    }

                });



            });
        }
    });
});


router.get('/renew_agreement/:id/:product_id', function (req, res, next) {
    setProductType(req.params.product_id)
    var id = req.params.id;

//    req.where = {'id': id, is_active: 1}

    req.where = {
        id: id,
        product_id: req.params.product_id, is_active: 1, is_renewed: 0,
        $or: [{freeze_user_id: req.user.id}, {user_id: req.user.id, }],
    };
    req.whereCondiForRenewDate = sequelize.where(sequelize.fn('curdate'), {
        $gte: sequelize.fn('DATE_SUB', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_before_days + ' DAY')),
        $lte: sequelize.fn('DATE_ADD', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_after_days + ' DAY'))
    });
    req.whereCondiForRenew = {is_renewable: 1};
    models[modelName].getFirstValuesForRenew(req, function (results) {

        if (!results) {
            req.flash('type_messages', 'info');
            req.flash('messages', 'Not Eligible for Renewable');
            res.redirect('/admin/arbitration_agreements/renewable_list/' + extraVar['product_id']);
            return false;
        }
        //var formValue = data;

        arrayForParties = [];
        arrayForMembers = {};
        async.forEachOf(results.arbitration_agreement_party_members, function (value, key, callback) {

            if (arrayForParties.indexOf(value.arbitration_agreement_party_number) < 0) {

                arrayForParties.push(value.arbitration_agreement_party_number);
                arrayForMembers[value.arbitration_agreement_party_number] = [];
                arrayForMembers[value.arbitration_agreement_party_number].push(value);
            } else {
                arrayForMembers[value.arbitration_agreement_party_number].push(value);
            }

        });

        res.render('admin/' + viewDirectory + '/renew', {results: results, formValue: arrayForMembers, extraVar: extraVar, layout: 'admin/layout/layout'});
    });



});


router.post('/renew_agreement_create', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
        if (req.files.length) {
            req.body.profile_image = req.files[0].filename;
        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            //check again valid for renewable or not
            req.where = {
                id: req.body.id,
//                product_id: req.params.product_id,
                is_active: 1, is_renewed: 0,
//                $or: [{freeze_user_id: req.user.id}, {user_id: req.user.id, }],
            };
//            req.whereCondiForRenewDate = sequelize.where(sequelize.fn('curdate'), {
//                $gte: sequelize.fn('DATE_SUB', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_before_days + ' DAY')),
//                $lte: sequelize.fn('DATE_ADD', sequelize.col('nc_end_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.renewal_after_days + ' DAY'))
//            });
//            req.whereCondiForRenew = {is_renewable: 1};
            models[modelName].getFirstValuesForRenew(req, function (results) {
                console.log(results);
                if (!results) {
                    res.status(400).send({status: false, msg: 'Not Eligible for Renewable', msgType:'danger'});
                    return false;
                } else {

                    var parent_arbitration_agreements_period = req.body.parent_arbitration_agreements_period;
                    var document_valid_from = req.body.document_valid_from;
                    var document_valid_to = req.body.document_valid_to;

                    var role_type_slug = req.user.user_type.role_type_slug;
                    req.where = {id: req.body.id}
                    models[modelName].getFirstValues(req, function (data) {

                        req.body = data.get({plain: true});
                        var parent_arbitration_agreements_data = data;
                        var newMemberObj = [];
                        async.forEach(req.body.arbitration_agreement_party_members, function (value, callback) {
                            if (typeof value != 'undefined') {
                                delete(value.id);
                                delete(value.arbitration_agreements_id);

                            }
                            callback(null, '');

                        }, function (err) {
                            req.body.arbitration_agreement_fees = {is_active: 1};
                            req.body.added_date = req.app.locals.site.momentObj().format('YYYY-MM-DD HH:mm:ss');

                            req.body.user_id = req.user.id;
                            req.body.parent_arbitration_agreements_id = req.body.id;
                            req.body.parent_arbitration_agreements_period = parent_arbitration_agreements_period;
                            req.body.is_active = 2;
                            req.body.time_to_pay = new Date(req.app.locals.site.momentObj()).getTime();
                            delete req.body.ar_id;
                            //delete req.body.aa_id;
                            delete req.body.invoice_no;
//                    delete req.body.freeze_user_id;
//                    delete req.body.freeze_id;
                            delete req.body.stamp_user_id;
                            delete req.body.stamp_id;
                            delete req.body.payment_duedate_deed_writer;
                            delete req.body.payment_duedate_ap;
                            delete req.body.payment_detail;
                            delete req.body.paid_on;
                            delete req.body.paid_by;
                            delete req.body.service_details;
                            delete req.body.freeze;
                            delete(req.body.id);

                            req.product_id = data.product_id;
                            req.service_details_id = data.service_details_primary_id;
                            req.agreement_value = data.agreement_value;
                            req.doc_name = data.service_detail_documents_id;
                            req.state = data.invoice_state_id;
//                    req.document_valid_from = document_valid_from;
//                    req.document_valid_to = data.document_valid_to;
                            req.is_renew = 1;
                            var extraObjToView = {};
                            extraObjToView.settingData = req.app.locals.settingData;
                            console.log(req.body);
                            models['User'].feesCalc(req, function (data1) {

                                if (!data1.status) {
                                    res.status(400).send({status: false, msgType: true, msg: data1.msg, data: []});
                                    return false;
                                } else {
                                    data1 = data1.data;
                                    var yearWiseFee = [];
                                    var selectedYear = 0;
                                    async.forEachOf(data1.fees, function (value1, key, callback1) {
                                        if (value1['year']) {
                                            yearWiseFee[value1['year']] = req.app.locals.site.formatCurrencyObj(value1['total_fees']);
                                            callback1(null);
                                        }
                                    }, function (err) {
                                        var yearDurationRemaining = timediff(parent_arbitration_agreements_data.arbitration_agreement_fees.nc_end_date, req.body.document_valid_to, 'YD');
                                        if (yearDurationRemaining.days > 0 && yearDurationRemaining.years == 0) {
                                            var yearDurationStampPlus = 1;
                                        } else if (yearDurationRemaining.days > 0 && yearDurationRemaining.years != 0) {
                                            var yearDurationStampPlus = parseInt(yearDurationRemaining.years) + 1;
                                        } else {
                                            var yearDurationStampPlus = yearDurationRemaining.years;
                                        }
                                        console.log('parent_arbitration_agreements_data.arbitration_agreement_fees.nc_end_date, req.body.document_valid_to, yearDurationStampPlus%%%%%%%%%%%%%%%')
                                        console.log(parent_arbitration_agreements_data.arbitration_agreement_fees.nc_end_date, req.body.document_valid_to, yearDurationStampPlus, yearDurationRemaining)
                                        extraObjToView.settingData = req.app.locals.settingData;
                                        models[modelName].saveRenewValues(req, function (results) {
                                            if (results.status) {
                                                res.status(200).send({status: true, results: results, data: yearWiseFee, selectedYear: selectedYear, yearDurationStampPlus: yearDurationStampPlus, role_type_slug: role_type_slug, extraObjToView: extraObjToView});
                                            } else {
                                                res.status(400).send({status: false, msg: ' saved d failed', data: results.errors});
                                            }
                                        });

                                    });
                                }
                            });
                        });

                    });
                }

            });
        }

    });
});

router.post('/stamp_exist', function (req, res, next) {

    req.where = {stamp_number: req.body.stamp_number, is_active: 1}
    models[modelName].getFirstValues(req, function (results) {

        if (!results) {
            res.status(200).send({status: true, results: results});
        } else {
            res.status(400).send({status: false, msg: 'Nayaya card already exist with this stamp number', data: results});
        }

    });
});


router.post('/payment_on_credit', function (req, res, next) {

    ImageUpload.uploadFile(req, res, function (err) {
//        if (req.files.length) {
//            req.body.profile_image = req.files[0].filename;
//        }
        if (err) {
            res.send({status: false, msg: err, data: []});
        } else {

            var service_details_name;
            var serviceDetailId;
            var arbitrationId;
            var product_id;
            var agreement_value;
            var doc_name;
            var state;

            var req1 = {};
            var arbitrationGetId = req.body.id;
            var ProfessinalAPidForNoComission;
//            req.ProfessinalAPid = req.body.ProfessinalAPid;
            req1.where = {'id': req.body.id};
            if (req.body.ProfessinalAPid !== 'undefined') {
                var ProfessinalAPid = req.body.ProfessinalAPid;
                req.ProfessinalAPid = req.body.ProfessinalAPid;
                ProfessinalAPidForNoComission = req.body.ProfessinalAPid;
            } else {
                var ProfessinalAPid = null;
                ProfessinalAPidForNoComission = null;
            }
//            req11.where = {user_id: req.user.id, is_active: 3, id: {$ne: arbitrationGetId}};

            models['UserFranchise'].getCreditPoints(req, function (results11) {
                console.log('settingValue', '<=', '', '>=', results11[0].credit_avil_franchise);
                console.log(req.app.locals.settingData.maximum_credit_limit_used_by_deed_writer, '<=', results11[0].used_credit && results11[0].used_credit, '>=', results11[0].credit_avil_franchise);

                if (req.app.locals.settingData.maximum_credit_limit_used_by_deed_writer <= results11[0].used_credit || results11[0].credit_avil_franchise <= 0) {
                    res.status(400).send({status: false, message: 'You have consumed all credit of associated promotor and professinal with this Nyaya Card'});
//                    res.status(400).send({status: false, message: 'Dont have the sufficient credit balance'});
                } else {

                    models[modelName].getFirstValues(req1, function (results1) {

                        var plainTextData = results1.get({plain: true});

                        service_details_name = results1.service_details_id;
                        arbitrationId = results1.id;
                        product_id = results1.product_id;
                        agreement_value = results1.agreement_value;
                        serviceDetailId = results1.service_details_primary_id;
                        doc_name = results1.service_detail_documents_id;
                        stamp_state_id = results1.stamp_state_id;
                        state = results1.invoice_state_id;

//                var dataForFee = {};
                        req.product_id = product_id;
                        req.service_details_id = serviceDetailId;
                        req.agreement_value = agreement_value;
                        req.doc_name = doc_name;
                        req.state = state;

                        if (plainTextData.arbitration_agreement_party_members.length < 2) {
                            req.flash('type_messages', 'info');
                            req.flash('messages', 'Something went worng, Please try again');
                            res.status(200).send({status: true, msg: '', url: '/admin/arbitration_agreements/' + plainTextData['product_id']});
                            return false;
                        } else {
                            models['User'].feesCalc(req, function (data1) {
                                if (!data1.status) {
                                    res.status(400).send({status: false, msg: '23424242', data: data1.msg});
                                    return false;
                                }

                                data1 = data1.data;
                                var allData = {};
                                var yearWiseFee = {};
                                var yearWiseTax = {};
                                yearWiseFee['arbitration_agreements_id'] = req.body.id;

                                yearWiseFee['examption_disputes'] = data1['doc_data'].examption_disputes;
                                yearWiseFee['examption_appeal_payable'] = data1['doc_data'].examption_appeal_payable;
                                yearWiseFee['examption_fee_payable'] = data1['doc_data'].examption_fee_payable;
                                yearWiseFee['renew_percentage'] = data1['doc_data'].renew_percentage;
                                yearWiseFee['holiday_period'] = data1['doc_data'].dry_period;

                                async.forEachOf(data1.fees, function (value1, key, callback1) {
                                    if (value1['year']) {
                                        if (value1['year'] == req.body.year_nayacard) {
                                            yearWiseFee['arbitration_agreement_total_year'] = req.body.year_nayacard;
                                            yearWiseFee['arbitration_agreement_basic_fee'] = value1['base_fee'];
                                            yearWiseFee['arbitration_agreement_per_year_fee'] = value1['base_fee_per_year'];
                                            yearWiseFee['arbitration_agreement_total_fees_cess'] = value1['cess'];
                                            yearWiseFee['arbitration_agreement_total_fees_tax'] = value1['tax'];
                                            yearWiseFee['arbitration_agreement_total_fees_without_tax'] = value1['fees_without_tax'];
                                            yearWiseFee['arbitration_agreement_total_fees'] = value1['total_fees'];
                                            yearWiseFee['arbitration_agreement_start_year'] = req.app.locals.site.momentObj().format('YYYY');
                                            yearWiseFee['arbitration_agreement_services_discount'] = value1['services_discount'];
                                            yearWiseFee['arbitration_agreement_renew_discount'] = value1['renew_discount'];
                                            yearWiseFee['arbitration_agreement_services_discount_per'] = value1['services_discount_per'];
                                            yearWiseFee['arbitration_agreement_renew_discount_per'] = value1['renew_discount_per'];
                                            yearWiseFee['arbitration_agreement_total_discount'] = value1['total_discount'];

//                                        yearWiseFee['nc_start_date'] = req.app.locals.site.momentObj(results1.added_date).add(data1['doc_data'].dry_period, 'months').format('YYYY-MM-DD');
                                            yearWiseFee['nc_start_date'] = req.app.locals.site.momentObj(results1.document_valid_from).add(data1['doc_data'].dry_period, 'months').add(1, 'days').format('YYYY-MM-DD');
                                            yearWiseFee['nc_end_date'] = req.app.locals.site.momentObj(yearWiseFee['nc_start_date']).add(req.body.year_nayacard, 'years').format('YYYY-MM-DD');

                                            var document_valid_to_timestamp = new Date(req.app.locals.site.momentObj(results1.document_valid_to)).getTime();
                                            var nc_end_date_timestamp = new Date(req.app.locals.site.momentObj(yearWiseFee['nc_end_date'])).getTime();
                                            console.log('------Start Date With Holiday-----');
                                            console.log(results1.document_valid_from, ',,,,', yearWiseFee['nc_start_date']);

                                            if (nc_end_date_timestamp > document_valid_to_timestamp) {
                                                console.log('------Document valid To-----');
                                                console.log('-------------------------', results1.document_valid_to);
                                                console.log('------End Date-----');
                                                console.log(yearWiseFee['nc_end_date']);
                                                yearWiseFee['nc_end_date'] = req.app.locals.site.momentObj(results1.document_valid_to).add(data1['doc_data'].dry_period, 'months').format('YYYY-MM-DD');
                                            }
                                            console.log(yearWiseFee);
                                        }
                                        callback1(null);
                                    }

                                }, function (err) {
                                    yearWiseTax = data1.tax_data[req.body.year_nayacard];
                                    var professionalUserId = null;
                                    var req3 = {};
                                    req3.where = {arbitration_agreements_id: req.body.id};
                                    req3.body = yearWiseFee;
                                    models['ArbitrationAgreementFee'].updateAllValues(req3, function (data) {

                                        async.parallel([
                                            function (callback) {
                                                var taxWithAll = [];
                                                async.forEachOf(yearWiseTax, function (value1, key, callback1) {
                                                    value1.arbitration_agreements_id = req.body.id;
                                                    taxWithAll = taxWithAll.concat(value1);
                                                    callback1(null);
                                                }, function (err) {
                                                    var req4 = {};
                                                    req4.body = taxWithAll;
                                                    models['ArbitrationAgreementTax'].createAllBulkValues(req4, function (data1) {
                                                        callback(null);
                                                    });
                                                });
                                            },
                                            function (callback) {

                                                if (results1.create.create_role_type.create_roles.role_slug == 'professional') {
                                                    professionalUserId = results1.user_id;
                                                }

                                                var current_time = new req.app.locals.site.momentObj().format("YYYY-MM-DD HH:mm:ss");
                                                req.where = {'stamp_no': results1.stamp_number, verify: 1, expire_date: {$gt: current_time}}
                                                req.order = ' id desc '
                                                models['FreezeDeal'].getByValue(req, function (stamp_data) {
                                                    if (stamp_data) {
                                                        professionalUserId = stamp_data.user_id;

                                                        updateFreezValues = {}
                                                        updateFreezValues.deal_status = 2;
                                                        req.body = updateFreezValues;
                                                        req.where = {id: stamp_data.id};
                                                        models['FreezeDeal'].updateByValue(req, function (update_data) {

                                                            updateArbArg = {};
                                                            updateArbArg.freeze_id = stamp_data.id;
                                                            updateArbArg.freeze_user_id = stamp_data.user_id;
                                                            req.body = updateArbArg;
                                                            req.where = {id: results1.id};
                                                            models[modelName].updateFee(req, function (data) {
                                                                callback(null);
                                                            });
                                                        });
                                                    } else {
                                                        //If offline payment and deal expired then - comission will not go to all Ap's
                                                        ProfessinalAPidForNoComission = null;
                                                        callback(null);
                                                    }
                                                });
                                            },
                                            function (callback) {
                                                req.where = {'stamp_no': results1.stamp_number}
                                                models['Stamp'].getByValue(req, function (stamp_data) {
                                                    if (stamp_data) {
                                                        updateArbArg = {};
                                                        updateArbArg.stamp_id = stamp_data.id;
                                                        updateArbArg.stamp_user_id = stamp_data.user_id;
                                                        req.body = updateArbArg;
                                                        req.where = {id: results1.id};
                                                        models[modelName].updateFee(req, function (data) {
                                                            callback(null);
                                                        });
                                                    } else {
                                                        callback(null);
                                                    }
                                                });
                                            },
                                            function (callback) {
                                                req.state = stamp_state_id;
                                                models['ArbitrationAgreements'].getInvoiceNo(req, function (invoice_no) {
                                                    updateArbArg = {};
                                                    updateArbArg.is_active = 3;
                                                    updateArbArg.invoice_no = invoice_no;
                                                    updateArbArg.franchise_id = req.ProfessinalAPid;
                                                    updateArbArg.payment_duedate_deed_writer = req.app.locals.site.momentObj(new Date()).add(req.app.locals.settingData.deed_writer_due_clearance_hours_for, 'hours').format('YYYY-MM-DD HH:mm:ss');
                                                    updateArbArg.payment_duedate_ap = req.app.locals.site.momentObj(new Date()).add(req.app.locals.settingData.ap_due_clearance_hours_for, 'hours').format('YYYY-MM-DD HH:mm:ss');
                                                    req.body = updateArbArg;
                                                    req.where = {id: results1.id};
                                                    models[modelName].updateFee(req, function (data) {
                                                        callback(null);
                                                    });
                                                });
                                            },
                                            function (callback) {
//                                            req.user.id, req.ProfessinalAPid;
                                                models['UserFranchise'].updateAvailCreditPoints(req, function (results) {
                                                    callback(null);
                                                });
                                            },
                                            function (callback) {
                                                req.body.tehsil_ap = ProfessinalAPid;
                                                if (ProfessinalAPid) {
                                                    models['FranchiseLevel'].getAllParentFromTehsilId(req, function (ap_chain) {
                                                        updateArbArg = {};
                                                        updateArbArg.franchise_id = ProfessinalAPid;
                                                        updateArbArg.franchise_district_id = ap_chain[0].district_level;
                                                        updateArbArg.franchise_division_id = ap_chain[0].division_level;
                                                        updateArbArg.franchise_state_id = ap_chain[0].state_level;
                                                        updateArbArg.franchise_country_id = ap_chain[0].country_level;
                                                        req.body = updateArbArg;
                                                        req.where = {id: results1.id};
                                                        console.log('updateArbArg@@@@@@@@@@@@')
                                                        console.log(ap_chain)
                                                        models[modelName].updateFee(req, function (data) {
                                                            callback(null);
                                                        });
                                                    });
                                                } else {
                                                    callback(null);
                                                }
                                            }
                                        ], function () {
                                            req.id = arbitrationGetId;
                                            req.product_id = product_id;
                                            req.service_detail_id = serviceDetailId;
                                            req.ProfessinalAPid = ProfessinalAPidForNoComission;
                                            req.professionalUserId = professionalUserId;
                                            console.log('data255555555555555555')
                                            models['CommissionDistribution'].saveCommission(req, function (data2) {
                                                console.log('data255555555555555555')
                                                console.log(data2)
                                                ProductMail.sendMail(arbitrationGetId, "nc", "offline", "parties");
                                                res.status(200).send({status: true, 'url': '/admin/arbitration_agreements/e_sign_step1/' + arbitrationGetId});
                                            });

                                        });

                                    });
                                });

                            });
                        }


                    });

                }

            });

        }
    });
});

router.post('/reminder_to_professional', function (req, res, next) {
    req.where = {id: req.body.agid}
    models[modelName].getFirstValues(req, function (data) {
        if (data.freeze_id) {
            var fields_to_be_replaced = {
                nyayacard_no: req.body.agid,
                profession_name: data.freeze.first_name,
                due_date: req.app.locals.site.momentObj(data.arbitration_agreement_fees.nc_end_date).format('YYYY-MM-DD')
            }
            var mail_option = {
                to: data.freeze.email
            }
            var email_template_slug = "reminder_mail_to_professional",
                    values_to_be_replaced = fields_to_be_replaced,
                    mail_options = mail_option;
            mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
            res.status(200).send({status: true, message: 'Notification Sent successfully'});
        } else {
            var fields_to_be_replaced = {
                nyayacard_no: req.body.agid,
                profession_name: data.create.first_name,
                due_date: req.app.locals.site.momentObj(data.arbitration_agreement_fees.nc_end_date).format('YYYY-MM-DD')
            }
            var mail_option = {
                to: data.create.email
            }
            var email_template_slug = "reminder_mail_to_professional",
                    values_to_be_replaced = fields_to_be_replaced,
                    mail_options = mail_option;
            mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
            res.status(200).send({status: true, message: 'Notification Sent successfully'});
        }
    })
})

router.post('/:product_id', adminAuth.productIdChk, function (req, res, next) {
    res.redirect('/admin/arbitration_agreements/' + req.params.product_id);
});

router.get('/refund/:id/:product_id', function (req, res, next) {
    setProductType(req.params.product_id)
    var id = req.params.id;

    req.where = {}
//    req.where = sequelize.where(sequelize.fn('curdate'), {
//        $lt: sequelize.fn('DATE_ADD', sequelize.col('ArbitrationAgreements.added_date'), sequelize.literal('INTERVAL ' + req.app.locals.settingData.refund_nc_after_in_days + ' DAY'))
//    });
    req.where.id = id;
    req.where.is_active = 1;
//    req.whereCondiForRefund = {is_renewable: 1};
    models[modelName].getFirstValuesForRefund(req, function (results) {

//        console.log(results.arbitration_agreement_party_members)
        if (!results) {
            req.flash('type_messages', 'info');
            req.flash('messages', 'Not Eligible for Refund');
            res.redirect('/admin/arbitration_agreements/' + extraVar['product_id']);
            return false;
        }
        res.render('admin/' + viewDirectory + '/refund', {results: results, extraVar: extraVar, layout: 'admin/layout/layout'});
    });



});







module.exports = router;
