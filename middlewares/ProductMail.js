var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var env = require('../config/env');
var models = require('../models');
var async = require("async");
var mailObj = require('../middlewares/Mail');




function ProductMail() {

    /*
     * Function to sent product cretion mail to App Users and Parties members
     *
     * product_id,   ID of the product(Nyaya Card, MemberShip Plan
     * product_type,   Type of product whether it is Nyaya Card or Membership Plan (nc, mp)
     * activity_type,   Product creation type (online, offline)
     * sent_to,    email sent to either parties members or app users or both (all, app_users, parties)
     *
     */
    this.sendMail = function(product_id, product_type, activity_type, sent_to, res) {
        
        var parties_emails, parties_name, product_amount, product_number, product_type, product_creation_date, stamp_number;
        product_number = product_id;
        
        var app_user_mail_status = sent_to == "all" || sent_to == "app_users";
        var parties_mail_status = sent_to == "all" || sent_to == "parties";

        var query_json = {
            id: product_id,
            type: product_type
        }
        models.CommissionDistribution.commisionDistributionMail(query_json, function (query_data) {
            
            console.log(query_data);
            
            parties_emails = query_data[0].parties_email;
            parties_names = query_data[0].parties_name;
            product_amount = query_data[0].amount;
            product_creation_date = query_data[0].product_creation_date;
            stamp_number = query_data[0].stamp_number;

            async.forEach(query_data, function (dataValues, callback) {
                
                if(app_user_mail_status) {
                    var fields_to_be_replaced = {
                        user_name: dataValues.first_name,
                        product_number: product_number,
                        product_creation_date: product_creation_date,
                        amount: product_amount,
                        parties_name: parties_names,
                        incentive_amount: dataValues.final_commission,
                        last_4_digits_of_account_number: dataValues.last_4_digits_of_account_number,
                        service_provider_name: dataValues.first_name,
                        product_type: product_type,
                        stamp_number: stamp_number
                    }

                    var emailTemplateSlug = product_type+"_"+activity_type+"_payment_mail_to_"+dataValues.role_type_slug;

                    if(dataValues.id == dataValues.ar_user_id) {
                        emailTemplateSlug += "_creator";                
                    }

                    var mail_option = {
                        to: dataValues.email
                        //to: "sagar.jajoriya@planetwebsolution.com"
                    }
                    
                    var email_template_slug = emailTemplateSlug,
                    values_to_be_replaced =  fields_to_be_replaced,
                    mail_options = mail_option;
                    
                    mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                }
                callback(null);
            }, function (err) {

                if(parties_mail_status) {
                    var get_parties_emails = parties_emails.split(",");

                    async.forEach(get_parties_emails, function (partiesVal, callback1) {

                        var emailTemplateSlug = product_type+"_"+activity_type+"_payment_mail_to_party";
                        var fields_to_be_replaced_for_parties = {
                            product_number: product_number,
                            parties_name: parties_names,
                            amount: product_amount
                        }
                        var mail_option = { to: partiesVal }
                        //var mail_option = { to: "sagar.jajoriya@planetwebsolution.com" }
                        var email_template_slug = emailTemplateSlug,
                            values_to_be_replaced =  fields_to_be_replaced_for_parties,
                            mail_options = mail_option;
                        
                        mailObj.dynamicEmailMsg(email_template_slug, values_to_be_replaced, mail_options);
                        callback1();
                    }, function (err1) {
                        console.log("------------------------ successful --------------------------->")
                    })
                }
                console.log("------------------------ successful --------------------------->")
            });    
        });
    }
}
module.exports = new ProductMail();