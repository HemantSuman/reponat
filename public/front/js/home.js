var $captchaEle = $('<label id="captcha_error" class="errorMsg"></label>');
//User register
$(document).on('submit', '#register', (function (event, state) {
    $('#loadingCenter').show();

    event.preventDefault();
    $('.errorMsg').text('');
    var data = $(this).serialize();
//    var gresponse = grecaptcha.getResponse();

    var form = $('#register')[0];
    var formData = new FormData(form);
    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        //json: true,
        cache: false,
        success: function (response) {

//            var typEr = 'done';
//            if (response.status == false) {
//                var typEr = 'error';
//            }

            if (response.status) {

                $.ajax({
                    url: response.url,
                    data: {user_id: response.user_id},
                    dataType: 'html',
                    method: "POST",
                    cache: false,
                    success: function (response) {
                        console.log(response);
                        $('.sectionForOtp').html(response);
                        $('#loadingCenter').hide();
                        setTimer(60, "timer_rem_time_1", "resendOtpLink_1")
                        setTimer(60, "timer_rem_time_2", "resendOtpLink_2")
                    },
                    error: function (data) {
                        $('#loadingCenter').hide();
                    },
                    afterSuccess: function () {
                        $('#loadingCenter').hide();
                    }

                });
            }
            bootstrapNotify.showMessage(response.msg, 'success');
        },
        error: function (resData) {
            console.log(resData)
            $.each(resData.responseJSON.data, function (key, val) {
                if (val.path != undefined) {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                } else {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                }
            });
        }

    });

}));


function getDbValuesByIds(thisObj, modelName, whereColumn, whereValues, orderBy, destinationId, fieldsArray, resetIds) {
//    console.log(resetIds, typeof resetIds);
    var arr = Object.keys(fieldsArray).map(function (key) {
        return fieldsArray[key];
    });
    var whereColumn1 = JSON.stringify(whereColumn);
    var whereValues1 = JSON.stringify(whereValues);

    if (typeof $(thisObj).attr('formtype') != 'undefined' && $(thisObj).attr('formtype') == 'agreement') {

        var primaryId = $("option:selected", thisObj).attr('primaryId');
    } else {
        var primaryId = $(thisObj).val();
    }

    var formData = {
        'valueId': primaryId,
        'modelName': modelName,
        'whereColumn': whereColumn1,
        'whereValues': whereValues1,
        'orderBy': orderBy,
    };
    $.ajax({
        url: '/common/get-db-values',
        data: formData,
        dataType: "json",
        method: "POST",
        cache: false,
        success: function (response) {
            $("#" + destinationId).html('');
            $("#" + destinationId).append($('<option></option>').val('').html('--Please Select--'));

            if (typeof $(thisObj).attr('formtype') != 'undefined' && $(thisObj).attr('formtype') == 'agreement') {
                
                $(response).each(function (ind, ele) {
                    $("#" + destinationId).append($('<option></option>').val(ele[arr[1]]).html(ele[arr[1]]).attr('primaryId', ele[arr[0]]));

                });
            } else {
                $(response).each(function (ind, ele) {
                    $("#" + destinationId).append($('<option></option>').val(ele[arr[0]]).html(ele[arr[1]]));

                });
            }

            $.each(resetIds, function (index, value) {
                $("#" + value).html('');
                $("#" + value).append($('<option></option>').val('').html('--Please Select--'));
            });
            //if ($(thisObj).val() == '') {
            //$('#' + destinationId).trigger('change');
            //}
        },
        error: function (resData) {
        }

    });
}




/*
 * Get form data by User_Type
 */
function getFormData(alias_name) {

    $("#loading").show();
    $("#formData").load("/users/" + alias_name, function () {
        $("#loading").hide();
        $("#register").find('.errorMsg').html('');
        
        $('.profession_type_element_destination .profession_type_element').remove();
        $(".profession_type_element").appendTo(".profession_type_element_destination");
        //custom select
        custonSelect();
    });

}



$(window).load(function () {
    //$("#role_id").val(1).trigger('change');
});


$(document).on('change', '#role_id', function () {

    var alias_name = $("#role_id option:selected").attr('alias');
    if (alias_name != 'select') {
        getFormData(alias_name);
    }
    //console.log(alias_name);

});

function resendOtp(user_id, type) {


    $.ajax({
        url: '/admin/users/resendOtp',
        data: {user_id: user_id, type: type},
        dataType: "json",
        method: "POST",
        cache: false,
        success: function (response) {
            if (response.status) {
                //window.location.href = response.url;
                bootstrapNotify.showMessage(response.msg);
                if(type == 'mobile') {
                    setTimer(60, "timer_rem_time_1", "resendOtpLink_1")
                }
                if(type == 'email') {
                    setTimer(60, "timer_rem_time_2", "resendOtpLink_2")
                }
            } else {
                bootstrapNotify.showMessage(response.msg);
            }
        }, error: function (resData) {
            console.log(resData);
            
        }
    });


}

$(document).on('submit', '#franchise-request-form', (function (event, state) {
    event.preventDefault()
    $('.errorMsg').text('');
    var data = $(this).serialize();
//    var gresponse = grecaptcha.getResponse();

    
    var form = $('#franchise-request-form')[0];
    var formData = new FormData(form);
    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        //json: true,
        cache: false,
        success: function (response) {
            if (response.status) {
                $("#franchise-request-form")[0].reset()
                bootstrapNotify.showMessage(response.msg, 'success');
                setTimeout(function(){ 
                    window.location.href = response.url;
                }, 5000);
                
            }
            
        },
        error: function (resData) {
            console.log(resData)
            $.each(resData.responseJSON.data, function (key, val) {
                if (val.path != undefined) {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                } else {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                }
            });
        }

    });
}))

$(document).on("change", ".franchise_request_type", function(e) {
    console.log($(this).val())
    if($(this).val() == 2) {
        $(".for_businessfirm_type").addClass("hide")
        $(".for_businessfirm_type input").attr("disabled", "disabled")

        $(".for_individual_type").removeClass("hide")
        $(".for_individual_type input").removeAttr("disabled")
        $(".contact_person_div").toggleClass("col-md-6 col-md-12")
    }
    if($(this).val() == 1) {
        $(".for_individual_type").addClass("hide")
        $(".for_individual_type input").attr("disabled", "disabled")

        $(".for_businessfirm_type").removeClass("hide")
        $(".for_businessfirm_type input").removeAttr("disabled")
        $(".contact_person_div").toggleClass("col-md-12 col-md-6")
    }
})

/*
 * function to set the timer
 */
function setTimer(duration, timer_display_block_id, hyperlink_id) {
    var duration = parseInt(duration);
    if(duration < 0) {
        return false;
    }
    $("#"+hyperlink_id).hide();
    var interval = setInterval(function() {
        if(duration < 0) {
            clearInterval(interval)
            $("#"+timer_display_block_id).parent().hide()
            $("#"+hyperlink_id).show();
        } else {
            $("#"+timer_display_block_id).text(duration);
            $("#"+timer_display_block_id).parent().show()
        }
        duration -= 1;
    }, 1000)
}

$(document).on('submit', '#forgot-password', (function (e, s) {
    //$('#loadingCenter').show();
    e.preventDefault();
    $('.errorMsg').text('');
    var data = $(this).serialize();
    
    var form = $('#forgot-password')[0];
    var formData = new FormData(form);
    console.log(formData)
    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        //json: true,
        cache: false,
        success: function (response) {
            if(response.status) {
                $("#forgot-password")[0].reset()
                bootstrapNotify.showMessage(response.msg, 'success');
            } else {
                bootstrapNotify.showMessageOnField(response.msg, "email");
            }
        },
        error: function (resData) {
            console.log("errorrrrrrrrrrrrrrr")
        }

    });
}))

$(document).on('submit', '#reset-password', (function (e, s) {
    //$('#loadingCenter').show();
    e.preventDefault();
    $('.errorMsg').text('');
    var data = $(this).serialize();
    
    var form = $('#reset-password')[0];
    var formData = new FormData(form);
    console.log(formData)
    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        //json: true,
        cache: false,
        success: function (response) {
            if(response.status) {
                $("#reset-password")[0].reset()
                bootstrapNotify.showMessage(response.msg, 'success');
                setTimeout(function() {
                    window.location.href = response.url;
                }, 5000)
            } else {
                bootstrapNotify.showMessage(response.msg, 'error');
            }
        },
        error: function (resData) {
            $.each(resData.responseJSON.data, function (key, val) {
                if (val.path != undefined) {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                } else {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                }
            });
        }

    });
}))

$(document).on('submit', '.contact-enquiries-form', (function (event, state) {

    event.preventDefault()
    $('.errorMsg').text('');
    var data = $(this).serialize();
    
    var form = $('.contact-enquiries-form')[0];
    var formData = new FormData(form);
    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        //json: true,
        cache: false,
        success: function (response) {
            if (response.status) {
                $(".contact-enquiries-form")[0].reset()
                bootstrapNotify.showMessage(response.msg, 'success');
                setTimeout(function(){ 
                    window.location.href = response.url;
                }, 5000);
                
            }
            
        },
        error: function (resData) {
            console.log(resData)
            $.each(resData.responseJSON.data, function (key, val) {
                if (val.path != undefined) {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                } else {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                }
            });
        }

    });
}))

$(document).on('submit', '#property-dispute-form', (function (event, state) {

    event.preventDefault()
    $('.errorMsg').text('');
    var data = $(this).serialize();
    
    var form = $('#property-dispute-form')[0];
    var formData = new FormData(form);
    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        //json: true,
        cache: false,
        success: function (response) {
            if (response.status) {
                $("#property-dispute-form")[0].reset()
                bootstrapNotify.showMessage(response.msg, 'success');
                setTimeout(function(){ 
                    window.location.href = response.url;
                }, 5000);
                
            }
            
        },
        error: function (resData) {
            console.log(resData)
            $.each(resData.responseJSON.data, function (key, val) {
                if (val.path != undefined) {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                } else {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                }
            });
        }

    });
}))

$(document).on('submit', '#file-dispute-form', (function (event, state) {

    event.preventDefault()
    $('.errorMsg').text('');
    var data = $(this).serialize();
    
    var form = $('#file-dispute-form')[0];
    var formData = new FormData(form);
    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        //json: true,
        cache: false,
        success: function (response) {
            if (response.status) {
                $("#file-dispute-form")[0].reset()
                bootstrapNotify.showMessage(response.msg, 'success');
                setTimeout(function(){ 
                    window.location.href = response.url;
                }, 5000);
                
            }
            
        },
        error: function (resData) {
            console.log(resData)
            $.each(resData.responseJSON.data, function (key, val) {
                if (val.path != undefined) {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                } else {
                    bootstrapNotify.showMessageOnField(val.message, val.path);
                }
            });
        }

    });
}))