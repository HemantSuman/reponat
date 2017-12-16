var env = require('../config/env');
var msg91 = require('msg91-sms');
var models = require('../models');
var async = require("async");

function Otp() {

    var authkey = env.otp.authkey;
    var senderid = env.otp.senderid;


    this.sendOtpMessage = function (data, res) {

        msg91.sendOne(authkey, data.mobile, data.otpMsg, 'NEWONE', '', '', function (response) {

            //Returns Message ID, If Sent Successfully or the appropriate Error Message 
            console.log(response);
        });

    }

    this.dynamicMobileMsg = function(mobile_template_slug, values_to_be_replaced, otp_options, res) {

    	var get_template = { where: {slug: mobile_template_slug } }
    	models["EmailTemplate"].getFirstValues(get_template, function (emailTemplateData) {
    		var emailTemplateDataFields = emailTemplateData.fields.split(",")
            var emailTemplateContent = emailTemplateData.content;

            async.forEach(emailTemplateDataFields, function (dataValues, callback1) {
                var getFieldValueIndex = (dataValues.replace('<#', '').replace('>', '')).toLowerCase();
                var getValueToBeReplaced = values_to_be_replaced[getFieldValueIndex]
                emailTemplateContent = emailTemplateContent.replace(dataValues, getValueToBeReplaced)
            });

            msg91.sendOne(authkey, otp_options.mobile, emailTemplateContent, 'NEWONE', '', '', function (response) {
	            //Returns Message ID, If Sent Successfully or the appropriate Error Message 
	            console.log(response);
	        });
    	})

    	
    }

   

}
module.exports = new Otp();