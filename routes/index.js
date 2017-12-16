var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    models.Category.getAllValues(req, function (data) {
        console.log(data[0]);
        res.render('front/index', {data: data, layout: 'front/layout/layout'});
    });

});



module.exports = router;
