var db = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pws@123',
    database: 'nat_blank'
};


var facebook = {
    clientID: '206866863088403',
    clientSecret: 'b163694920e5a3fbde5ecf5c0fe17736',
    callbackURL: 'http://acadonia.planetwebsolution.com:4001/auth/facebook/callback',
    successRedirect: '/dashboard',
    failureRedirect: '/'
};


var google = {
    clientID: '906308791031-3pncpjn5bvjjc3qbpaq6p4p53bfo7ft5.apps.googleusercontent.com',
    clientSecret: 'j_k85dd8IkXXx4yk_s4vFL01',
    callbackURL: 'http://acadonia.planetwebsolution.com:4001/auth/google/callback',
    successRedirect: '/dashboard',
    failureRedirect: '/'
};


var mail = {
    //from: '"Nyaya Portal " <noreply@nyayaportal.in>',
    from: 'Nyaya Portal',
    config: "smtps://hemant.suman%40planetwebsolution.com:hemant1234@smtp.gmail.com"
    //config:"smtps://noreply%40nyayaportal.in:noreply#@!A@smtp.gmail.com"
};

var otp = {
    authkey: "138408AafWEW1cQyP5887191d",
    senderid: "NEWONE"
};

var bbb = {
//url:"http://192.168.100.172/bigbluebutton/",
    url: "http://203.100.77.134/bigbluebutton/",
    key: "91d041360369b58d74834b8f37e60dbc"
};

var pay={
    mid:"T198767",
    s_code:"Lega",
    e_key:"8241820639EXXTIX",
    e4_key:"9868415382IJTPVM",
    email:"abhishek.sharma@planetwebsolution.com",
    cc_email:"abhishek.sharma@planetwebsolution.com",
    base_itemId:"NAT1"
    }

var e_sign={
    token:"QUlWMVA2VTk5NEpDV1Y0NDczSVBaQThSSDlMNUkyNFU6TjY3MkhPTVZYRzVCWkVZSUFPVTM2QkZHVkI5SDRDUDQ="
    }    

module.exports.db = db;
module.exports.facebook = facebook;
module.exports.google = google;
module.exports.mail = mail;
module.exports.bbb = bbb;
module.exports.otp = otp;
module.exports.pay = pay;
module.exports.e_sign = e_sign;