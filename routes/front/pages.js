var models = require('../../models');
var express = require('express');
var router = express.Router();
var ImageUpload = require('../../middlewares/ImageUpload');
var async = require("async");

//var extraVar = [];
var viewDirectory = 'pages';
//var modelName = 'State';
//var titleName = 'States';
//
//extraVar['modelName'] = modelName;
//extraVar['viewDirectory'] = viewDirectory;
//extraVar['titleName'] = titleName;

/* GET pages listing. */
router.get('/nyayapeeth', function (req, res, next) {
    res.render('front/' + viewDirectory + '/nyayapeeth');
});


router.get('/arbitration_facilities_centre', function (req, res, next) {

res.render('front/' + viewDirectory + '/arbitration_facilities_centre');    

});

router.get('/pathway_for_professionals', function (req, res, next) {

res.render('front/' + viewDirectory + '/pathway_for_professionals');    

});


router.get('/join_hands_authorised_promoters', function (req, res, next) {

res.render('front/' + viewDirectory + '/join_hands_authorised_promoters');    

});


router.get('/cost_arbitration', function (req, res, next) {

res.render('front/' + viewDirectory + '/cost_arbitration');    

});



router.get('/careers', function (req, res, next) {
    req.where = {is_active:1}
    models['Career'].getAllValues(req, function (results) {
        res.render('front/' + viewDirectory + '/careers', {results:results});
    });
});

router.get('/nyaya-portal', function (req, res, next) {
    res.render('front/' + viewDirectory + '/nyaya_portal');
});

router.get('/privacy_policy', function (req, res, next) {
    res.render('front/' + viewDirectory + '/privacy_policy');
});

router.get('/appealable-orders', function (req, res, next) {
    res.render('front/' + viewDirectory + '/appealable_orders');
});

router.get('/appointment-of-arbitrators', function (req, res, next) {
    res.render('front/' + viewDirectory + '/appointment_of_arbitrators');
});

router.get('/dispute-redressal-system', function (req, res, next) {
    res.render('front/' + viewDirectory + '/dispute_redressal_system');
});

router.get('/enforcement-of-arbitral-award', function (req, res, next) {
    res.render('front/' + viewDirectory + '/enforcement_of_arbitral_award');
});

router.get('/fast-track-procedure', function (req, res, next) {
    res.render('front/' + viewDirectory + '/fast_track_procedure');
});

router.get('/franchisee', function (req, res, next) {
    res.render('front/' + viewDirectory + '/franchisee');
});

router.get('/interim-measures', function (req, res, next) {
    res.render('front/' + viewDirectory + '/interim_measures');
});

router.get('/membership', function (req, res, next) {
     models['MembershipExemptions'].getAllValues(req, function (results) {
        res.render('front/' + viewDirectory + '/membership', {results:results});
    });
});

router.get('/diverting-india-towards-arbitration', function (req, res, next) {
    res.render('front/' + viewDirectory + '/diverting_india_towards_arbitration');
});

router.get('/mous', function (req, res, next) {
    res.render('front/' + viewDirectory + '/mous');
});

router.get('/national-initiative-of-government', function (req, res, next) {
    res.render('front/' + viewDirectory + '/national_initiative_of_government');
});

router.get('/nyaya-card', function (req, res, next) {
    res.render('front/' + viewDirectory + '/nyaya_card');
});

router.get('/prohibited-disputes', function (req, res, next) {
    res.render('front/' + viewDirectory + '/prohibited_disputes');
});

router.get('/property-dispute', function (req, res, next) {
    res.render('front/' + viewDirectory + '/property_dispute');
});

router.get('/recourse-against-arbitral-award', function (req, res, next) {
    res.render('front/' + viewDirectory + '/recourse_against_arbitral_award');
});

router.get('/schedule-of-fees', function (req, res, next) {
    res.render('front/' + viewDirectory + '/schedule_of_fees');
});

router.get('/time-limit-for-arbitral-award', function (req, res, next) {
    res.render('front/' + viewDirectory + '/time_limit_for_arbitral_award');
});

router.get('/two-tier-arbitration', function (req, res, next) {
    res.render('front/' + viewDirectory + '/two_tier_arbitration');
});

router.get('/faq', function (req, res, next) {
    res.render('front/' + viewDirectory + '/faq');
});

router.get('/contact-us', function (req, res, next) {
    res.render('front/' + viewDirectory + '/contact_us');
});

router.get('/client', function (req, res, next) {
    res.render('front/' + viewDirectory + '/client');
});

router.get('/terms-condition', function (req, res, next) {
    res.render('front/' + viewDirectory + '/terms');
});

router.get('/disclaimer', function (req, res, next) {
    res.render('front/' + viewDirectory + '/disclaimer');
});

router.get('/refund-policies', function (req, res, next) {
    res.render('front/' + viewDirectory + '/refund_cancellation_policy');
});

router.get('/intellectual-policies', function (req, res, next) {
    res.render('front/' + viewDirectory + '/intellectual_ property_policy');
});

router.get('/national-arbitral-tribunal', function (req, res, next) {
    res.render('front/' + viewDirectory + '/national_arbitral_tribunal');
});

router.get('/e-facilities', function (req, res, next) {
    res.render('front/' + viewDirectory + '/e_eacilities');
});

router.get('/panel-of-arbitrators', function (req, res, next) {
    req.order = ' position ASC '
    req.where = {is_active:1}
    models['PanelOfArbitrators'].getAllValues(req, function (results) {
        res.render('front/' + viewDirectory + '/panel_of_arbitrators', {results:results});
    });
});

router.get('/videos', function (req, res, next) {
    res.render('front/' + viewDirectory + '/video');
});

router.get('/join-authorised-promoter', function (req, res, next) {
    res.render('front/' + viewDirectory + '/join_authorised_promoter');
});

router.get('/accelerating-non-litigation-practice', function (req, res, next) {
    res.render('front/' + viewDirectory + '/accelerating_non_litigation_practice');
});

router.get('/adopt-arbitration-adapt-future', function (req, res, next) {
    res.render('front/' + viewDirectory + '/adopt_arbitration_adapt_future');
});

router.get('/port-your-litigation-arbitration', function (req, res, next) {
    res.render('front/' + viewDirectory + '/port_your_litigation_arbitration');
});

router.get('/field-for-professionals', function (req, res, next) {
    res.render('front/' + viewDirectory + '/join_nyaya_portal');
});

router.get('/our-service-area', function (req, res, next) {
    res.render('front/' + viewDirectory + '/our_service_area');
});

router.get('/fee-exemptions', function (req, res, next) {
//    req.order = ' '
//    req.where = {is_active:1}
    models['MembershipExemptions'].getAllValues(req, function (results) {
        res.render('front/' + viewDirectory + '/fee_exemptions', {results:results});
    });
});

router.get('/arbitration-conciliation-act', function (req, res, next) {
    res.render('front/' + viewDirectory + '/arbitration_conciliation_act');
});

router.get('/what-is-arbitration', function (req, res, next) {
    res.render('front/' + viewDirectory + '/what_is_arbitration');
});

router.get('/institutional-vs-adhoc', function (req, res, next) {
    res.render('front/' + viewDirectory + '/institutional_vs_adhoc');
});

router.get('/dispute-settled-by-arbitrations', function (req, res, next) {
    res.render('front/' + viewDirectory + '/dispute_settled_by_arbitrations');
});

router.get('/rules', function (req, res, next) {
    res.render('front/' + viewDirectory + '/rules');
});
router.get('/fee-calculator', function (req, res, next) {
    async.parallel({
        professional: function (callback) {
            req.where = {is_active: 1}
            models.ServiceDetail.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        res.render('front/' + viewDirectory + '/fee_calculator', {data: results});
    });
});
        
router.get('/fee-calculator-sh1', function (req, res, next) {
    async.parallel({
        professional: function (callback) {
            req.where = {is_active: 1}
            models.ServiceDetail.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        res.render('front/' + viewDirectory + '/fee_calculator_sh1', {data: results});
    });
});

router.get('/verify-document', function (req, res, next) {
    res.render('front/' + viewDirectory + '/verify_document');
});

router.get('/payment-terms', function (req, res, next) {
    res.render('front/' + viewDirectory + '/payment_terms');
});

router.get('/file-disputes', function (req, res, next) {
    res.render('front/' + viewDirectory + '/file_dispute');
});


router.get('/exemptions_membership', function (req, res, next) {
    async.parallel({
        professional: function (callback) {
            req.where = {is_active: 1}
            models.ServiceDetail.getAllValues(req, function (data) {
                callback(null, data);
            });
        }
    }, function (err, results) {
        //res.send(results);
        res.render('front/' + viewDirectory + '/exemptions_membership', {data: results});
    });
});

module.exports = router;
