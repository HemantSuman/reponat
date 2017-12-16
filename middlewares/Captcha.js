var models = require('../models');
var Canvas = require('canvas');
var fs = require('fs');

function CaptchaGenerator() {

    this.CaptchaGenerator = function (req, res) {

        var Canvas = require('canvas');
        var Image = Canvas.Image;
        var canvas = new Canvas(100, 50);
        var ctx = canvas.getContext('2d');
        var currentTimeStamp = req.app.locals.site.momentObj().toDate().getTime();
//        extraVar['currentTimeStamp'] = currentTimeStamp;

        var first_digit = Math.floor((Math.random() * 10));
        var second_digit = Math.floor((Math.random() * 100));
        req.session[currentTimeStamp] = parseInt(first_digit) + parseInt(second_digit);
        var captcha_string = first_digit + '+' + second_digit;
        ctx.font = '20px Impact';
        ctx.rotate(0);
        ctx.fillText(captcha_string, 5, 30);

        var te = ctx.measureText(captcha_string);
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.lineTo(50, 102);
        ctx.lineTo(50 + te.width, 102);
        ctx.stroke();
        var fullUrl = req.protocol + '://' + req.get('host');
        console.log(req.session);

        var base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
        require("fs").writeFile("./public/uploads/captcha/" + currentTimeStamp + ".png", base64Data, 'base64', function (err) {
            console.log(err);
            res(currentTimeStamp);
        });

    }

}
module.exports = new CaptchaGenerator();