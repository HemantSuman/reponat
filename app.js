var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var passport = require('passport');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var moment = require('moment');
var moment = require('moment-timezone');
moment.tz.setDefault('Asia/Kolkata');
var formatCurrency = require('format-currency');
var timediff = require('timediff');
var index = require('./routes/front/index');
var users = require('./routes/front/users');
var pages = require('./routes/front/pages');
var franchise_request = require('./routes/front/franchise_request');
//var admin_users = require('./routes/admin/admin_users');
var admin_nc1_heads = require('./routes/admin/nc1_heads');
var admin_nc1_slab = require('./routes/admin/nc1_slab');
var admin_service_details = require('./routes/admin/service_details');
var admin_revised_fees = require('./routes/admin/revised_fees');
var admin_turn_over_based_deals = require('./routes/admin/turn_over_based_deals');
var admin_special_bonus = require('./routes/admin/special_bonus');
var admin_masters = require('./routes/admin/masters');
var admin_countries = require('./routes/admin/countries');
var admin_states = require('./routes/admin/states');
var admin_districts = require('./routes/admin/districts');
var admin_tehsils = require('./routes/admin/tehsils');
var admin_divisions = require('./routes/admin/divisions');
var admin_taxes = require('./routes/admin/taxes');
var admin_business_types = require('./routes/admin/business_types');
var admin_business_categories = require('./routes/admin/business_categories');
var admin_role_types = require('./routes/admin/role_types');
var admin_arbitration_agreements = require('./routes/admin/arbitration_agreements');
var numberToWord = require("npm-number-to-word");
var admin_slab_heads = require('./routes/admin/slab_heads');

var admin_commisions = require('./routes/admin/commisions');
var common = require('./routes/common');

var admin_users = require('./routes/admin/users');
var admin_login = require('./routes/admin/login');

var stamps = require('./routes/admin/stamps');
var membership_exemptions = require('./routes/admin/membership_exemptions');
var panel_of_arbitrators = require('./routes/admin/panel_of_arbitrators');
var careers = require('./routes/admin/careers');
var news = require('./routes/admin/news');
var admin_dashboard = require('./routes/admin/dashboard');

var admin_franchise_commissions = require('./routes/admin/franchise_commissions');

var admin_freeze_deals = require('./routes/admin/freeze_deals');
var admin_settings = require('./routes/admin/settings');
var admin_franchise_requests = require('./routes/admin/franchise_request');
var admin_membership_plans = require('./routes/admin/membership_plans');
var admin_membership_plan_fees = require('./routes/admin/membership_plan_fees');

var admin_franchises = require('./routes/admin/franchises');


var commission_distributions = require('./routes/admin/commission_distributions');
var admin_benches = require('./routes/admin/benches');
var admin_email_templates = require('./routes/admin/email_templates');
var contact_enquiries = require('./routes/admin/contact_enquiries');
var dispute_details = require('./routes/admin/dispute_details');
var file_disputes = require('./routes/admin/file_disputes');

var adminAuth = require('./middlewares/Auth');

var flash = require('express-flash')
var app = express();
require('./config/passport')(passport);
// require('./config/adminpassport')(adminPassport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'front/layout/homeLayout');
app.set("layout extractScripts", true);
app.use(expressLayouts);
var env = require('./config/env');

var modelsAll = require('./models');


app.get('*',function(req,res,next){  
    if((req.headers.host == 'nyayaportal.in' || req.headers.host == 'www.nyayaportal.in') && req.protocol == 'http'){
        res.redirect('https://www.nyayaportal.in'+req.url);
//        res.redirect(['https://', req.get('Host'), req.url].join(''))
    } else {
        next();
    }
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sessionStore = new MySQLStore(env.db);
app.use(session({
    secret: 'hemantSumanNatProjectAdminTheme',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use(adminPassport.initialize({ userProperty: "admin" }));
// app.use(adminPassport.session());
var converter = require('number-to-words');

app.locals.site = {
    logoName: "Nyaya Portal",
    logoUrl: "/images/nat_logo.png",
    siteTitle: "NyayaPortal",
    pageTitle: "Nat",
    author: "Nat",
    description: "Nat",
    page: 10,
    theme: 'skin-blue sidebar-mini',
    logo: '',
    copyRight: '© 2017  Legal Resolution Centre Pvt. Ltd. All rights reserved.',
    version: '1.0',
    momentObj: moment,
    numberToWord: numberToWord,
    timediffObj: timediff,
    formatCurrencyObj: formatCurrency,
    converterObj: converter,
    pageLimit: 12,
    currentPage: 1,
}

var passView = function (req, res, next) {
    app.locals.site.fullUrl = req.protocol + '://' + req.get('host');
    app.locals.site.requestUrl = req.originalUrl;

    //console.log(req.originalUrl);

    modelsAll.Setting.getAll(req, function (Data) {
//        res.send(Data);
        if (typeof req.query.page !== 'undefined') {
            app.locals.site.currentPage = parseInt(req.query.page);
        } else {
            app.locals.site.currentPage = parseInt(1);
        }
        app.locals.settingData = Data;
        app.locals.site.pageLimit = parseInt(app.locals.settingData.page_list_limit);
        if (typeof req.user !== 'undefined') {

            modelsAll['User'].getUserByEmail(req.user.email, function (reLogin) {

                req.logIn(reLogin, function (error) {

                    if (!error) {
                        if (reLogin.is_active == 0 && reLogin.is_complete_registration == 1) {
                            res.redirect('/admin/logout');
                        } else {
                            req.app.locals.loginUser = reLogin;
                            app.locals.loginUser = reLogin;
                        }
                    } else {
                        console.log(error);
                    }

                });


                //app.locals.loginUser = req.user;
                modelsAll.Acl.getAllValues(req, function (rolesData) {
                    app.locals.rolesData = rolesData;
                    next();
                });
            });

        } else {

            next();
        }
    });
};

app.use(passView);

app.locals.dateFormate = function (date) {
    var dateNew = app.locals.site.momentObj(date, 'DD-MM-YYYY').format('DD-MM-YYYY')
    return (dateNew);
}

app.locals.dateTimeConvert = function (date) {
    date = new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
//    date = new Date(date).toUTCString();
//    date = date.split(' ').slice(0, 5).join(' ')
    return (date);
}


app.use('/', index);
app.use('/users', users);
app.use('/pages', pages);
app.use('/franchise_request', franchise_request);
//app.use('/admin', admin_homes);

app.use('/admin', admin_login);
app.use('/admin/nc1_heads', admin_nc1_heads);
app.use('/admin/nc1-slab', admin_nc1_slab);
app.use('/admin/service_details', admin_service_details);
app.use('/admin/revised_fees', admin_revised_fees);
app.use('/admin/turn_over_based_deals', admin_turn_over_based_deals);
app.use('/admin/special_bonus', admin_special_bonus);
app.use('/admin/masters', admin_masters);
app.use('/admin/countries', admin_countries);
app.use('/admin/states', admin_states);
app.use('/admin/districts', admin_districts);
app.use('/admin/tehsils', admin_tehsils);
app.use('/admin/divisions', admin_divisions);
app.use('/admin/taxes', admin_taxes);
app.use('/admin/business_types', admin_business_types);
app.use('/admin/business_categories', admin_business_categories);
app.use('/admin/role_types', admin_role_types);
app.use('/admin/arbitration_agreements', admin_arbitration_agreements);

app.use('/admin/slab-heads', admin_slab_heads);

app.use('/admin/commisions', admin_commisions);
app.use('/common', common);

app.use('/admin/franchise-commissions', admin_franchise_commissions);

app.use('/admin/stamps', stamps);
app.use('/admin/membership_exemptions', membership_exemptions);
app.use('/admin/panel_of_arbitrators', panel_of_arbitrators);
app.use('/admin/careers', careers);
app.use('/admin/news', news);
app.use('/admin/users', admin_users);
app.use('/admin/freeze-deal', admin_freeze_deals);
app.use('/admin/dashboard', admin_dashboard);
app.use('/admin/settings', admin_settings);
app.use('/admin/franchise_requests', admin_franchise_requests);
app.use('/admin/membership_plans', admin_membership_plans);
app.use('/admin/membership_plan_fees', admin_membership_plan_fees);

app.use('/admin/franchises', admin_franchises);


app.use('/admin/commission_distributions', commission_distributions);
app.use('/admin/benches', admin_benches);
app.use('/admin/contact-enquiries', contact_enquiries);
app.use('/admin/dispute-details', dispute_details);
app.use('/admin/file-disputes', file_disputes);
app.use('/admin/email_templates', admin_email_templates);


//http://stackoverflow.com/questions/26037755/where-to-place-common-functions-in-express-js
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render('error', {layout: false});
});



module.exports = app;
