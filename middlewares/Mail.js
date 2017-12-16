var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var env = require('../config/env');
var models = require('../models');
var async = require("async");


function Mail() {
// create reusable transporter object using the default SMTP transport 
    var transporter = nodemailer.createTransport(env.mail.config);

    console.log('file.........call....................');

    var smtpTransport = require('nodemailer-smtp-transport');

    var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 25,
    auth: {
        user: 'noreply@nyayaportal.in', // my mail
        pass: 'noreply#@!A'
    }
    }));

    


    //var transporter = nodemailer.createTransport(env.mail.config);

    // var transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 25,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: "noreply@nyayaportal.in", // generated ethereal user
    //         pass: "noreply#@!A"  // generated ethereal password
    //     }
    // });

   

    // var mail = {
    // from: '"Nyaya Portal " <noreply@nyayaportal.in>',
    // //config: "smtps://hemant.suman%40planetwebsolution.com:hemant1234@smtp.gmail.com"
    // config:"smtps://noreply%40nyayaportal.in:noreply#@!A@smtp.gmail.com"
    // };



    // var transporter = nodemailer.createTransport(mail);



// send mail with defined transport object 

    var from = env.mail.from;

    this.sendMail = function (data, res) {

            console.log('file.........call....................');

        var mailOptions = {
            from: from,
            to: data.email,
            subject: data.subject,
            text: data.msg,
            //html: data.msg
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }


    this.resendOtpMail = function (data, res) {
        
        var path = require('path');
        var templateDir = path.join(__dirname, '../views', '/front/email/resend_otp');
        
        var mailOptions = {
            from: from,
            to: data.email,
            subject: data.subject,
            text: data.list.link,
            //html: data.msg
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

    this.dynamicEmailMsg = function (email_template_slug, values_to_be_replaced, mail_options, res) {
        var path = require('path')
        var templateDir = path.join(__dirname, '../views', '/front/email/default');
//        console.log(models);
//        if(typeof modelsDy != 'undefined'){
//            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
//            models = modelsDy;
//        }
        var get_template = { where: {slug: email_template_slug } }
        models["EmailTemplate"].getFirstValues(get_template, function (emailTemplateData) {

            if(emailTemplateData){

            var emailTemplateDataFields = emailTemplateData.fields.split(",")
            var emailTemplateContent = emailTemplateData.content;
            var emailTemplateSubject = emailTemplateData.subject;

            async.forEach(emailTemplateDataFields, function (dataValues, callback1) {
                var getFieldValueIndex = (dataValues.replace('<#', '').replace('>', '')).toLowerCase();
                var getValueToBeReplaced = values_to_be_replaced[getFieldValueIndex]
                emailTemplateContent = emailTemplateContent.replace(dataValues, getValueToBeReplaced)
            });

            var mailOptions = {
                from: from,
                to: mail_options.to,
                subject: emailTemplateSubject,
                html: emailTemplateContent,
                //text: data.msg
            };

            transporter.sendMail(mailOptions, function (error, info){
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });

            }

        });

        
        
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         return console.log(error);
        //     }
        //     console.log('Message %s sent: %s', info.messageId, info.response);
        // });

    }

    this.sendHtmlMail = function (data, res) {

        var path = require('path')
        var templateDir = path.join(__dirname, '../views', '/front/email/register')


        var sendPwdReminder = transporter.templateSender(new EmailTemplate(templateDir), {
            from: from,
        });

// use template based sender to send a message 
        sendPwdReminder({
            to: data.email,
            subject: data.subject
        }, {
            data: data.list,
        }, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Password reminder sent');
            }
        });

    }

    /* Reset password mail */
    this.sendResetPasswordMail = function (data, res) {
        var path = require('path')
        var templateDir = path.join(__dirname, '../views', '/front/email/reset_password')

        var sendPwdReminder = transporter.templateSender(new EmailTemplate(templateDir), {
            from: from,
        });

        // use template based sender to send a message 
        sendPwdReminder({
            to: data.email,
            subject: data.subject
        }, {
            data: data.list,
        }, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Password reminder sent');
            }
        });
    }







     /* Techprocess mail */
    this.sendTechprocessMail = function (data, res) {



        // console.log('tech mail..............................');

        // var path = require('path')
        // var fs = require('fs')
        // var templateDir = path.join(__dirname, '../views', '/front/email/techprocess')
        // var htmlstream = fs.createReadStream(templateDir);
        // transporter.sendMail({html: htmlstream}, function(err){
        // if(err){
        // // check if htmlstream is still open and close it to clean up
        // }
        // });


        



        var path = require('path')
        var templateDir = path.join(__dirname, '../views', '/front/email/techprocess')

        var sendPwdReminder = transporter.templateSender(new EmailTemplate(templateDir), {
            from: from,
        });

        var chk_image=data.list.user.check_img;

        console.log(chk_image);

        // use template based sender to send a message 
        sendPwdReminder({
            to:data.email,
            cc:data.list.pay_cc_email,
            subject: data.subject,
            attachments: [
            {   
            filename: data.list.id,
            path:"public/uploads/users/"+chk_image
            },
            {   
            filename: data.list.id,
            path: "public/csv/"+data.list.user.id+".csv"//chk_image
            }
            ]
        }, {
            data: data.list,
        }, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Password reminder sent');
            }
        });



    }







    this.sendHtmlMailAll = function (data, res) {

        var path = require('path')
        var templateDir = path.join(__dirname, '../views', data.temp)


        var EmailTemplate = require('email-templates').EmailTemplate;
        //var send = transporter.templateSender(new EmailTemplate('template/directory'));


        var sendPwdReminder = transporter.templateSender(new EmailTemplate(templateDir), {
            from: from,
        });

// use template based sender to send a message 
        sendPwdReminder({
            to: data.email,
            subject: data.subject
        }, {
            data: data.list,
        }, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Password reminder sent');
            }
        });

    }

    this.sendMailToUsersFromAdmin = function (data, res) {

        var mailOptions = {
            from: from,
            to: data.email,
            subject: data.subject,
            text: data.msg,
            attachments: data.attachments
            //html: data.msg
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }


}
module.exports = new Mail();