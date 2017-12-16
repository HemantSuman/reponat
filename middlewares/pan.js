/* global module */

'use strict';
function validatePanNumber (value, msg) {
    
    msg = (!msg) ? value + ' InValid PAN Number' : msg;
    return function (value, next) {
        console.log('@@@@@@@@@@@@@@@@', value, msg);
        if ((value.length != 10) || !isNaN(value.substring(0,5)) || isNaN(value.substring(5,9)) || !isNaN(value.substring(9,10))) {
//            
            next(msg);
        } else {
            next(msg);
        }
    };
};

module.exports = new validatePanNumber();