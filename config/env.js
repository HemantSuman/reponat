var db = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'nat_blank'
};


var facebook = {
    clientID: '',
    clientSecret: '',
    callbackURL: '',
    successRedirect: '/dashboard',
    failureRedirect: '/'
};


var google = {
    clientID: '',
    clientSecret: '',
    callbackURL: '',
    successRedirect: '/dashboard',
    failureRedirect: '/'
};


var mail = {
    //from: '"Nyaya Portal " <noreply@nyayaportal.in>',
    from: '',
    config: "smtps://hemantsuman177%40gmail.com:password@smtp.gmail.com"
};

var otp = {
    authkey: "",
    senderid: ""
};

var bbb = {
//url:"http://192.168.100.172/bigbluebutton/",
    url: "",
    key: ""
};

var pay={
    mid:"T1983453,
    s_code:"L345",
    e_key:"82418243543534IX",
    e4_key:"98684153345345VM",
    email:"",
    cc_email:"",
    base_itemId:"456etet4
    }

var e_sign={
    token:"QUlWMVA2Vtyrtggdgdg5t45t45yyfb bfghMNUkyNFU6TjY3MkhPTVZYRzVCWkVZSUFPVTM2QkZHVkI5SDRDUDQ="
    }    

module.exports.db = db;
module.exports.facebook = facebook;
module.exports.google = google;
module.exports.mail = mail;
module.exports.bbb = bbb;
module.exports.otp = otp;
module.exports.pay = pay;
module.exports.e_sign = e_sign;
