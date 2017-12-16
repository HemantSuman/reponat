$(document).on("submit", "#formSubmit", function (e) {
    e.preventDefault();
    var thisObj = $(this);
    
    $('input[type=text]').each(function(i,v){
        $(this).val(v.value.trim());
    });
    
    var form = $(thisObj)[0];
    var formData = new FormData(form);
    $('.error_mgs_lable').html('');
    console.log(formData);
    $.ajax({
        url: $(thisObj).attr('action'),
        data: formData,
        contentType: false,
        processData: false,
        method: "POST",
        cache: false,
        success: function (response) {
            if (response.status) {
                window.location.href = response.url;
            } else {
                bootstrapNotify.showMessage(response.message);
            }
        }, error: function (resData) {
            console.log(resData);
            $.each(resData.responseJSON.data, function (key, val) {
                bootstrapNotify.showMessageOnField(val.message, val.path);
            });
        }
    });
});



function isNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : evt.keyCode

    if (charCode == 9 || charCode == 40 || charCode == 37 || charCode == 39 || charCode == 38) {
        return true;
    }
    if ((charCode != 45 || $(element).val().indexOf('-') != -1) && (charCode != 46 || $(element).val().indexOf('.') != -1) && ((charCode < 48 && charCode != 8) || charCode > 57)) {
        return false;
    } else {
        return true;
    }

}


$(document).on('keypress keyup blur', '.allownumericwithdecimal', (function (event, state) {
    return isNumber(event, this)
}));

$(".allownumericwithoutdecimal").on("keypress keyup blur", function (event) {
    var charCode = (event.which) ? event.which : event.keyCode
    console.log(charCode);
    if (charCode == 9 || charCode == 40 || charCode == 37 || charCode == 39 || charCode == 38) {
        return true;
    }

    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$(document).on("click", ".deleteEntry", function (e) {
    e.preventDefault();

    var txt;
    var r = confirm("Are you sure ?");
    if (r == true) {

    } else {
        return false;
    }




    var thisObj = $(this);
    var statusUpdated = $(this).attr('statusUpdated');
    console.log('statusUpdated');
    console.log(statusUpdated);
    $.ajax({
        url: $(thisObj).attr('action'),
        data: {statusUpdated: statusUpdated, allowChk: true},
        //contentType: false,
        //processData: false,
        method: "POST",
        cache: false,
        success: function (response) {
            if (response.status) {
                window.location.href = response.url;
            } else {
                bootstrapNotify.showMessage(response.message);
            }
        }, error: function (resData) {
            $.each(resData.responseJSON.data, function (key, val) {
                bootstrapNotify.showMessageOnField(val.message, val.path);
            });
        }
    });
});

/*
 * Get value list by
 */
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
                    
                    if (typeof $(thisObj).attr('forStateCode') != 'undefined' && $(thisObj).attr('forStateCode') === 'yes') {
                        $("#" + destinationId).append($('<option></option>').val(ele[arr[1]]).html(ele[arr[1]]).attr('primaryId', ele[arr[0]]).attr('state_code', ele[arr[2]]));
                    } else {
                        $("#" + destinationId).append($('<option></option>').val(ele[arr[1]]).html(ele[arr[1]]).attr('primaryId', ele[arr[0]]));
                    }

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
            $('#' + destinationId).trigger('change');
            //}
        },
        error: function (resData) {
        }

    });
}

function getDbValuesByIdsForEditAgree(thisObj, modelName, whereColumn, whereValues, orderBy, destinationId, fieldsArray, resetIds) {
//    console.log(resetIds, typeof resetIds);
    var arr = Object.keys(fieldsArray).map(function (key) {
        return fieldsArray[key];
    });
    var whereColumn1 = JSON.stringify(whereColumn);
    var whereValues1 = JSON.stringify(whereValues);

    var nextSelectedKey = $(thisObj).attr('nextSelectedKey');
    var party_no = $(thisObj).attr('party_no');
    var member_no = $(thisObj).attr('member_no');

    if (typeof $(thisObj).attr('formtype') != 'undefined' && $(thisObj).attr('formtype') == 'agreement') {

        var primaryId = $("option:selected", thisObj).attr('primaryId');

    } else if (typeof $(thisObj).attr('formtype') != 'undefined' && $(thisObj).attr('formtype') == 'agreementEdit') {

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
            } else if (typeof $(thisObj).attr('formtype') != 'undefined' && $(thisObj).attr('formtype') == 'agreementEdit') {
                $(response).each(function (ind, ele) {

                    if (typeof formValueJson['party_' + party_no + '_member_' + member_no][0] != 'undefined' && formValueJson['party_' + party_no + '_member_' + member_no][0][nextSelectedKey] == ele[arr[0]]) {

                        var selected = true;
                    } else {
                        var selected = false;
                    }
                    $("#" + destinationId).append($('<option></option>').val(ele[arr[1]]).html(ele[arr[1]]).attr('primaryId', ele[arr[0]]).attr('selected', selected));

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
            $('#' + destinationId).trigger('change');
//            console.log(formValueJson['party_'+party_no+'_member_'+member_no]);
            //if ($(thisObj).val() == '') {
            //$('#' + destinationId).trigger('change');
            //}
        },
        error: function (resData) {
        }

    });
}


$(document).on("submit", "#formSubmitXls", function (e) {
    e.preventDefault();
    var thisObj = $(this);
    var form = $(thisObj)[0];
    var formData = new FormData(form);
    $('.error_xlsDiv').html('');

    $.ajax({
        url: $(thisObj).attr('action'),
        data: formData,
        contentType: false,
        processData: false,
        method: "POST",
        cache: false,
        success: function (response) {
            if (response.status) {
//                window.location.href = response.url;
            } else {
                var htmlErrors = '';



            }
        }, error: function (resData) {
            if (resData.responseJSON.data.type_err) {
                $('.error_xlsDiv').html(resData.responseJSON.messages);
            } else {
//                $.each(response.messages, function (key, val) {
//                    htmlErrors += '<span> <i class="fa fa-info-circle" aria-hidden="true"></i> ' + val.errors + '<span></br>';
//                });
//                $('.error_xlsDiv').html(htmlErrors);
            }
        }
    });
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
                if (type == 'mobile') {
                    setTimer(60, "timer_rem_time_1", "resendOtpLink_1")
                }
                if (type == 'email') {
                    setTimer(60, "timer_rem_time_2", "resendOtpLink_2")
                }
            } else {
                bootstrapNotify.showMessage(response.msg);
            }
        }, error: function (resData) {
            console.log(resData);
            $.each(resData.responseJSON.data, function (key, val) {
                bootstrapNotify.showMessageOnField(val.message, val.path);
            });
        }
    });


}

$(document).on('change', '.onChangeForPrimaryId', function () {

    var thisObj = $(this);
    var primary_id_text = $(this).attr('id');
    console.log(primary_id_text);
    var id_value = $('option:selected', this).attr('primaryid');
    $('#' + primary_id_text + '_primary_id').val(id_value);
});

$(document).on('keydown', '.srchByEnterPressInput', (function (event, state) {
    if (event.which == 13) {
        $("form[name='serchFrom']").submit();
    }
}));

function heightAdjust() {
    if ($(window).width() < 480) {
        $('.party-col-height').unSyncHeight();
    } else {
        $('.party-col-height').syncHeight({updateOnResize: true});
    }
}
$(document).ready(function () {
    heightAdjust();

})
$(window).resize(function () {
    heightAdjust();
})
var newNo = $('#newSerialStartNo').val();
console.log(newNo)

if (typeof newNo != 'undefined') {
    $('.table-bordered > tbody > tr').each(function (index, value) {

        if (!$(this).hasClass('noSerialNo')) {
            if ($(this).find('input[type="checkbox"] :first td').height() != null) {
                if (index == 0) {
                    $(this).find("th:nth-child(2)").before($('<th>S.No.</th>'));
                } else {
                    newNo = parseInt(newNo);
                    $(this).find("td:nth-child(2)").before($("<td>" + newNo + "</td>"));
                    newNo = parseInt(newNo) + 1;
                }
            } else {
                if (index == 0) {
                    $("<th>S.No.</th>").prependTo($(this));
                } else {
                    if (!$(this).find("select").height() || $(this).find("select").hasClass('noSerialNoSelect')) {
                        newNo = parseInt(newNo);
                        $("<td>" + newNo + "</td>").prependTo($(this));
                        newNo = parseInt(newNo) + 1;
                    } else {
                        $("<th></th>").prependTo($(this));
                    }
                }
            }
        } else {
            if ($(this).hasClass('th')) {
                $("<th></th>").prependTo($(this));
            }
        }
    });

}


/*
 * function to set the timer
 */
function setTimer(duration, timer_display_block_id, hyperlink_id) {
    var duration = parseInt(duration);
    if (duration < 0) {
        clearInterval(interval)
    }
    $("#" + hyperlink_id).hide();
    window.interval = setInterval(function () {
        if (duration < 0) {
            clearInterval(interval)
            $("#" + timer_display_block_id).parent().hide()
            $("#" + hyperlink_id).show();
        } else {
            $("#" + timer_display_block_id).text(duration);
            $("#" + timer_display_block_id).parent().show()
        }
        duration -= 1;
    }, 1000);
}

$('.treeview-menu').each(function (index, values) {
    if ($('li', values).hasClass('active-menu')) {
        $(this).show();
        $(this).parent('.treeview').addClass('active');

    }

});

$(document).on('change', '.onChangeForStateCode', function () {
    var state_code = $('option:selected', this).attr('state_code');
    $('#invoice_state_code').val(state_code);
});


 
 function sendBank(email){

    var txt;
    var r = confirm("Are you sure");
    if (r == true) {

        $.ajax({
                url:'/admin/users/send-bank',
                data:{email:email},
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {
                    
                    bootstrapNotify.showMessage(response.message);

                }, error: function (resData) {
                    
                    bootstrapNotify.showMessage(response.message);

                }
            });       
    } 



    

 }