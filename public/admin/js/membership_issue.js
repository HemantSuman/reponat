$(document).on('submit', '#formSubmitMembershipIssue', function (e) {

//$(document).on('click', '#proceedToView', function () {

    e.preventDefault();
    var thisObj = $(this);
    $('.error_mgs_lable').text('');
    var errorMessageObj = {};
//        randomEleIds = [];
    var errorStatus = false;
    //trim all input values
    $('input[type=text]').each(function (i, v) {
        $(this).val(v.value.trim().replace(/\s\s+/g, ' '));
    });
    var form = $('#formSubmitMembershipIssue')[0];
    var formData = new FormData(form);

    async.parallel([
        function (callback) {
            $('.emptyValidation').each(function (index, value) {
                var thisObj = $(this);
                if (($(thisObj).get(0).tagName == 'SELECT' || $(thisObj).get(0).tagName == 'INPUT') && ($(thisObj).val() == '' || typeof $(thisObj).val() == 'undefined')) {
                    var ids = $(thisObj).attr('id');
                    errorMessageObj[ids] = 'This field is required.';
                    errorStatus = true;
                }
//                else if ($(thisObj).attr('type') == 'checkbox' && !$(thisObj).is(":checked")) {
//                    var ids = $(thisObj).attr('id');
//                    errorMessageObj[ids] = 'This field is required.';
//                    errorStatus = true;
//                }

            });
            callback('', null);
        },
        function (callback) {
            var allEmails = [];
            $('.emailValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if ($(thisObj).val() != '' && !re.test($(thisObj).val())) {
                    errorMessageObj[ids] = 'Please Enter Valid Email';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allEmails.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Email should be unique';
                    errorStatus = true;
                }
                allEmails.push($(thisObj).val());

            });
            callback('', null);
        },
        function (callback) {
            var allAadharNos = [];
            $('.aadharDigitValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && $(thisObj).val().length != 12) {
                    errorMessageObj[ids] = 'Please Enter 12 digit';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allAadharNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Aadhar number should be unique';
                    errorStatus = true;
                }
                allAadharNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var allMobileNos = [];
            $('.mobileDigitValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && $(thisObj).val().length != 10) {
                    errorMessageObj[ids] = 'Please Enter 10 digit';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allMobileNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Mobile number should be unique';
                    errorStatus = true;
                }
                allMobileNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var allGovtidNos = [];
            $('.govtIdValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && allGovtidNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Govt Id should be unique';
                    errorStatus = true;
                }
                allGovtidNos.push($(thisObj).val());
            });
            callback('', null);
        },
    ], function (err) {

        //    errorStatus = false;
        if (errorStatus) {
            $.each(errorMessageObj, function (i, v) {
                bootstrapNotify.showMessageOnField(v, i);
            });
            $('.error_mgs_lable').each(function (i, v) {
                if ($(this).text() != '') {

                    $('html, body').animate({
                        scrollTop: $(this).parent('div').find("label").offset().top
                    }, 1000);

                    return false;
                }
            });
        } else {
            $.ajax({
                type: "POST",
                url: $(thisObj).attr('action'),
                data: formData,
                dataType: "json",
                processData: false,
                contentType: false,
                //json: true,
                cache: false,
                success: function (response) {
                    if (response.status) {
                        window.location.href = response.url;
                    }
                },
                error: function (resData) {

                    if (typeof resData.responseJSON.msgType != 'undefined' && resData.responseJSON.msgType) {
                        bootstrapNotify.showMessage(resData.responseJSON.msg, 'danger');
                    } else {
                        $.each(resData.responseJSON.data, function (key, val) {
                            if (val.param != undefined) {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            } else {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            }
                        });

                        $('.error_mgs_lable').each(function (i, v) {
                            if ($(this).text() != '') {

                                $('html, body').animate({
                                    scrollTop: $(this).parent('div').find("label").offset().top
                                }, 1000);

                                return false;
                            }
                        });
                    }
                }

            });
        }

    });
});

$(document).on('click', '#saveAsDraft', function () {

    $('.error_mgs_lable').text('');
    var errorStatus = false;
    var errorMessageObj = {};
    //trim all input values
    $('input[type=text]').each(function (i, v) {
        $(this).val(v.value.trim().replace(/\s\s+/g, ' '));
    });

    async.parallel([
        function (callback) {
            var allEmails = [];
            $('.emailValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if ($(thisObj).val() != '' && !re.test($(thisObj).val())) {
                    errorMessageObj[ids] = 'Please Enter Valid Email';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allEmails.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Email should be unique';
                    errorStatus = true;
                }
                allEmails.push($(thisObj).val());

            });
            callback('', null);
        },
        function (callback) {
            var allAadharNos = [];
            $('.aadharDigitValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && $(thisObj).val().length != 12) {
                    errorMessageObj[ids] = 'Please Enter 12 digit';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allAadharNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Aadhar number should be unique';
                    errorStatus = true;
                }
                allAadharNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var allMobileNos = [];
            $('.mobileDigitValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && $(thisObj).val().length != 10) {
                    errorMessageObj[ids] = 'Please Enter 10 digit';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allMobileNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Mobile number should be unique';
                    errorStatus = true;
                }
                allMobileNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var allGovtidNos = [];
            $('.govtIdValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && allGovtidNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Govt Id should be unique';
                    errorStatus = true;
                }
                allGovtidNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var thisObj = $(this);
            var partyFlag = $(this).attr('party');
            var memberFlag = $(this).attr('member');
            var id_number_value = $('.govt_id_number_class' + '_' + partyFlag + '_' + memberFlag).val();
            var id_number_id = $('.govt_id_number_class' + '_' + partyFlag + '_' + memberFlag).attr('id');
            if ($('option:selected', $(thisObj)).val() == 'pan_number') {
                if ((id_number_value != '') && ((id_number_value.length != 10) || !isNaN(id_number_value.substring(0, 5)) || isNaN(id_number_value.substring(5, 9)) || !isNaN(id_number_value.substring(9, 10)))) {
                    errorMessageObj[id_number_id] = 'Please Enter Valid PAN Card Number';
//                 console.log(id_number_value, id_number_id);
                    errorStatus = true;
                }
            }
            callback('', null);
        },
    ], function (err) {

        //    errorStatus = true;
        if (errorStatus) {
            $.each(errorMessageObj, function (i, v) {
                bootstrapNotify.showMessageOnField(v, i);
            });
            $('html, body').animate({
                scrollTop: $("#" + Object.keys(errorMessageObj)[0]).offset().top
            }, 1000);
        } else {
            var form = $('#formSubmitMembershipIssue')[0];
            var formData = new FormData(form);

            $.ajax({
                type: "POST",
                url: '/admin/membership_plans/save_as_draft',
                data: formData,
                dataType: "json",
                processData: false,
                contentType: false,
                //json: true,
                cache: false,
                success: function (response) {
                    if (response.status) {
                        window.location.href = response.url;
                    }
                },
                error: function (resData) {
                    if (typeof resData.responseJSON.msgType != 'undefined' && resData.responseJSON.msgType) {
                        bootstrapNotify.showMessage(resData.responseJSON.msg, 'danger');
                    } else {
                        $.each(resData.responseJSON.data, function (key, val) {
                            if (val.param != undefined) {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            } else {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            }
                        });

                        $('.error_mgs_lable').each(function (i, v) {
                            console.log('$(this).text()')
                            if ($(this).text() != '') {

                                $('html, body').animate({
                                    scrollTop: $(this).parent('div').find("label").offset().top
                                }, 1000);

                                return false;
                            }
                        });
                    }
//                bootstrapNotify.showMessage(resData.responseJSON.msg, 'danger');
                }

            });
        }

    });

});



$(document).on('submit', '#formSubmitMembershipIssueRenew', function (e) {

//$(document).on('click', '#proceedToView', function () {

    e.preventDefault();
    var thisObj = $(this);
    $('.error_mgs_lable').text('');
    var errorMessageObj = {};
    var errorStatus = false;
    
    var form = $('#formSubmitMembershipIssueRenew')[0];
    var formData = new FormData(form);

    async.parallel([
        function (callback) {
            $('.emptyValidation').each(function (index, value) {
                var thisObj = $(this);
                if (($(thisObj).get(0).tagName == 'SELECT' || $(thisObj).get(0).tagName == 'INPUT') && ($(thisObj).val() == '' || typeof $(thisObj).val() == 'undefined')) {
                    var ids = $(thisObj).attr('id');
                    errorMessageObj[ids] = 'This field is required.';
                    errorStatus = true;
                }
            });
            callback('', null);
        },
    ], function (err) {

        //    errorStatus = false;
        if (errorStatus) {
            $.each(errorMessageObj, function (i, v) {
                bootstrapNotify.showMessageOnField(v, i);
            });
            $('.error_mgs_lable').each(function (i, v) {
                if ($(this).text() != '') {

                    $('html, body').animate({
                        scrollTop: $(this).parent('div').find("label").offset().top
                    }, 1000);

                    return false;
                }
            });
        } else {
            $.ajax({
                type: "POST",
                url: $(thisObj).attr('action'),
                data: formData,
                dataType: "json",
                processData: false,
                contentType: false,
                //json: true,
                cache: false,
                success: function (response) {
                    console.log(response);
                    if (response.status) {
                        window.location.href = response.url;
                    }
                },
                error: function (resData) {

                    if (typeof resData.responseJSON.msgType != 'undefined' && resData.responseJSON.msgType) {
                        bootstrapNotify.showMessage(resData.responseJSON.msg, 'danger');
                    } else {
                        $.each(resData.responseJSON.data, function (key, val) {
                            if (val.param != undefined) {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            } else {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            }
                        });

                        $('.error_mgs_lable').each(function (i, v) {
                            if ($(this).text() != '') {

                                $('html, body').animate({
                                    scrollTop: $(this).parent('div').find("label").offset().top
                                }, 1000);

                                return false;
                            }
                        });
                    }
                }

            });
        }

    });
});



