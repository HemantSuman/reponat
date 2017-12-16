$(document).ready(function () {


});


$(document).on("click", ".clickAction", function () {

    var reqType = $(this).attr("data-action");
    var reqId = $(this).attr("data-action-id");
    var reqClass = $(this).attr("data-action-class");
    var formData = '';

    $ref = $(this);
    if (reqType == 'search') {
        if ($('#searchData').length) {
            var formData = $('#searchData').serializeArray();
        }
        reqType = 'view';
    }
    if (reqType == 'reset') {

        if ($('#searchData').length) {
            var formData = '';
        }
        reqType = 'view';
    }
    if (reqType == 'postsearch') {

        if ($('#searchData').length) {
            var formData = $('#searchData').serializeArray();
        }
        reqType = 'viewPost';
    }

    if (reqType == 'classsearch') {
        if ($('#searchData').length) {
            var formData = $('#searchData').serializeArray();
        }
        reqType = 'viewClass';
    }

    $('#loadingCenter').show();
    if (reqType == 'delete') {
        var ans = noty({
            text: 'Are you sure you want to delete?',
            layout: 'center',
            buttons: [
                {addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {

                        $noty.close();
                        sendAjaxUi($ref);
                    }
                },
                {addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                        $noty.close();
                        $('#loadingCenter').hide();
                        return false;
                    }
                }
            ]
        });


    } else {
        sendAjaxUi($(this));
    }


});



function sendAjaxUi(refsData, isload) {


    if (isload !== undefined) {
//        alert($(location).attr('href'));
        var site_url = $(location).attr('href');

        url_arr = site_url.split('#');
        url_arr2 = url_arr[1].split('/');
        console.log(url_arr2);

        var reqClass = url_arr2[0];
        var reqType = url_arr2[1];
        var reqId = ''
        if (typeof url_arr2[2] != 'undefined') {
            reqId = url_arr2[2];
        }


        //var urlDecode = window.location.href.split('#');
        //var urlDecode2 = urlDecode[1].split('/');




    } else {
        var reqType = refsData.attr("data-action");
        var reqId = refsData.attr("data-action-id");
        var reqClass = refsData.attr("data-action-class");
        var formData = '';

        if (reqType == 'search') {
            if ($('#searchData').length) {
                var formData = $('#searchData').serializeArray();
            }
            reqType = 'view';
        }
        if (reqType == 'reset') {
            if ($('#searchData').length) {
                var formData = '';
            }
            reqType = 'view';
        }
        if (reqType == 'changeStatus') {
            if ($('#searchData').length) {
                var formData = $('#searchData').serializeArray();
            }
            reqType = 'changeStatus';
        }
        if (reqType == 'postsearch') {

            if ($('#searchData').length) {
                var formData = $('#searchData').serializeArray();
            }
            reqType = 'viewPost';
        }

        if (reqType == 'classsearch') {
            if ($('#searchData').length) {
                var formData = $('#searchData').serializeArray();
            }
            reqType = 'viewClass';
        }
    }



    $.ajax({
        url: '/admin/route',
        data: {reqType: reqType, reqId: reqId, reqClass: reqClass, data: formData},
        dataType: 'html',
        method: "GET",
        cache: false,
        success: function (response) {


//$.each(resData.responseJSON.data, function (key, val) {
//                //console.log(val.param);
//                Notify.showMessageOld(val.param, val.msg);
//            });

            try {
                json = $.parseJSON(response);
                loadUiView(json.method, json.class, json.type_id);
                var typEr = 'done';
                if (json.status == false) {
                    var typEr = 'error';
                }
                Notify.showMessage(json.msg, typEr);
            } catch (e) {
                $("#loadUi").html('');
                $("#loadUi").html(response);

//                var typEr = 'error';
//                Notify.showMessage(json.msg, typEr);
//                Notify.showMessage(json.msg, typEr);
            }

            window.history.pushState(null, null, "/admin/dashboard/#" + reqClass + '/' + reqType + '/' + reqId);
            $('#loadingCenter').hide();
            if ($('#news_desc').length)
                CKEDITOR.replace('news_desc');
            //loadLibJs();

        },
        error: function (data) {
            var resData = $.parseJSON(data.responseText)
            if (resData.data == 'forPermission') {
                Notify.showMessage(resData.msg, 'error');
            } else {
                alert('Something went wrong');
            }

            $('#loadingCenter').hide();
        },
        afterSuccess: function () {
            $('#loadingCenter').hide();
        }

    });
}




$(document).on("click", ".clickActionByMenu", function () {
    var reqType = $(this).attr("data-action");
    var reqId = $(this).attr("data-action-id");
    $('#loadingCenter').show();
    $.ajax({
        url: '/admin/' + reqType,
        data: {reqType: reqType, reqId: reqId},
        dataType: 'html',
        method: "GET",
        cache: false,
        success: function (response) {
            $("#loadUi").html('');
            $("#loadUi").html(response);
            $('#loadingCenter').hide();
            CKEDITOR.replace('editor1');
            //loadLibJs();

        },
        error: function (data) {
            $('#loadingCenter').hide();
        },
        afterSuccess: function () {
            $('#loadingCenter').hide();
        }

    });
});


var _URL = window.URL || window.webkitURL;

$("#file").change(function (e) {
    var file, img;


    if ((file = this.files[0])) {
        img = new Image();
        img.onload = function () {
            alert(this.width + " " + this.height);
        };
        img.onerror = function () {
            alert("not a valid file: " + file.type);
        };
        img.src = _URL.createObjectURL(file);


    }

});

$(document).on('submit', '#storeData', (function (event, state) {
    randomEleIds = [];
    event.preventDefault();
    $('.errorMsg').remove();

    var data = $(this).serialize();
    var form = $('#storeData')[0];
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
            var typEr = 'done';
            if (response.status == false) {
                var typEr = 'error';
            }

            Notify.showMessage(response.msg, typEr);
            loadUiView(response.method, response.class, response.type_id);
        },
        error: function (resData) {

            $.each(resData.responseJSON.data, function (key, val) {
                //console.log(val.message);
                Notify.showMessageOld(val.path, val.message);

            });
        }

    });
}));

$(document).on('submit', '#resetPass', (function (event, state) {
    event.preventDefault();
    $('.errorMsg').remove();

    var data = $(this).serialize();

    //console.log(data);

    var form = $('#resetPass')[0];
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
            var typEr = 'done';
            if (response.status == false) {
                var typEr = 'error';
            }

            Notify.showMessage(response.msg, typEr);
            loadUiView(response.method, response.class, response.type_id);
        },
        error: function (resData) {
            //console.log(resData);
            $.each(resData.responseJSON.data, function (key, val) {
                //console.log(val.param);
                Notify.showMessageOld(val.param, val.msg);
            });
        }

    });
}));



$(document).on('submit', '#storeDataWithImage', (function (event, state) {
    event.preventDefault();

    $(this).ajaxSubmit({
        error: function (xhr) {
            console.log(xhr.status);
        },
        success: function (response) {

            if (response.status == false) {
                $.each(response.data, function (index, value) {
                    Notify.showMessageUi(value.param, value.msg);
                });
            } else {
                Notify.showMessage(response.msg, 'done');
                loadUiView(response.method, response.class, response.type_id);
            }
        }
    });
    return false;
}));


//Use For search form submit
$(document).on('submit', '#searchData', (function (event, state) {
    event.preventDefault();
    $("#search").trigger("click");
}));
//-----------------------------------------------------------------


function CallAjax(url, data, datatype, method) {
    $.ajax({
        url: url,
        data: data,
        dataType: datatype,
        method: "GET",
        cache: false,
        success: function (response) {

        },
        error: function (data) {
        },
        afterSuccess: function () {

        }

    });
}


function loadUiView(reqType, reqClass, reqId) {

    $('#loadingCenter').show();
    $.ajax({
        url: '/admin/route',
        data: {reqType: reqType, reqId: reqId, reqClass: reqClass},
        dataType: 'html',
        method: "GET",
        cache: false,
        success: function (response) {
            $("#loadUi").html('');
            $("#loadUi").html(response);
            //console.log(response);
            //window.history.pushState(null, null, "/dashboard/#" + reqType + '/' + reqClass);
            $('#loadingCenter').hide();
            //loadLibJs();

        },
        error: function (data) {
            $('#loadingCenter').hide();
        },
        afterSuccess: function () {
            $('#loadingCenter').hide();
        }

    });
}

$(document).on('click', '.changePage', (function (event, state) {
    event.preventDefault();
    $.ajax({
        url: $(this).attr('href'),
        data: [],
        dataType: 'html',
        method: "GET",
        cache: false,
        success: function (response) {
            $("#loadUi").html('');
            $("#loadUi").html(response);
        },
        error: function (data) {
        },
        afterSuccess: function () {

        }

    });
}));


function loadLibJs() {

    //Initialize Select2 Elements
    $(".select2").select2();

    //Datemask dd/mm/yyyy
    $("#datemask").inputmask("dd/mm/yyyy", {"placeholder": "dd/mm/yyyy"});
    //Datemask2 mm/dd/yyyy
    $("#datemask2").inputmask("mm/dd/yyyy", {"placeholder": "mm/dd/yyyy"});
    //Money Euro
    $("[data-mask]").inputmask();

    //Date range picker
    $('#reservation').daterangepicker();
    //Date range picker with time picker
    $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30, format: 'MM/DD/YYYY h:mm A'});
    //Date range as a button
    $('#daterange-btn').daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                startDate: moment().subtract(29, 'days'),
                endDate: moment()
            },
    function (start, end) {
        $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }
    );

    //Date picker
    $('#datepicker').datepicker({
        autoclose: true
    });

    //iCheck for checkbox and radio inputs
    $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass: 'iradio_minimal-blue'
    });
    //Red color scheme for iCheck
    $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red'
    });
    //Flat red color scheme for iCheck
    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });

    //Colorpicker
    //$(".my-colorpicker1").colorpicker();
    //color picker with addon
    //$(".my-colorpicker2").colorpicker();

    //Timepicker
    // $(".timepicker").timepicker({
    //   showInputs: false
    // });

}


function requestStatus(type, type_user_id, type_id, n_id, status, group_type, attrval) {

    if (typeof group_type === "undefined")
        group_type = '';

    $ref = $(attrval);
    var formData = {type: type, type_id: type_id, type_user_id: type_user_id, status: status, n_id: n_id, group_type: group_type};
    $.ajax(
            {
                url: '/request-status-admin',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {


                    if (response.status === true) {
                        Notify.showMessage(response.msg, 'success');
                        $("#notyUiId" + n_id).hide();
                        sendAjaxUi($ref);
                        //$('#actMe' + post_id).addClass('active');
                        //var totCount=$('#likeCounter' + post_id).text();
                        //$('#likeCounter' + post_id).text(parseInt(totCount)+1);

                    } else {
                        Notify.showMessage(response.msg, 'error');
                        //$('#actMe' + post_id).removeClass('active');
                        //var totCount=$('#likeCounter' + post_id).text();
                        //$('#likeCounter' + post_id).text(parseInt(totCount)-1);
                    }

                },
                error: function (resData) {
                    //data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });

}

function notyDelete(n_id, attrval) {


    var formData = {n_id: n_id};
    $ref = $(attrval);
    $.ajax(
            {
                url: '/notification-delete-admin',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {


                    if (response.status === true) {
                        Notify.showMessage(response.msg, 'success');
                        $("#notyUiId" + n_id).hide();
                        sendAjaxUi($ref);
                    } else {
                        Notify.showMessage(response.msg, 'error');
                    }

                },
                error: function (resData) {
                    data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });

}


var _URL = window.URL || window.webkitURL;

$(document).on("change", "#image", function (e) {
    var file, img;
    var width = $("#width").val();
    var height = $("#height").val();
    if ((file = this.files[0])) {
        img = new Image();
        img.onload = function () {
            if (width !== undefined) {
                if (this.width != width && this.height != height) {
                    alert("Not a valid file: " + this.width + " x " + this.height);
                    $("#image").val('');
                }
            }


        };
        img.src = _URL.createObjectURL(file);


    }

});

$(document).on("keydown", "#searchData input,#searchData select", function (e) {
    if (e.keyCode === 13) {
        $('#clickAction').trigger('click');
    }
});
$(document).on('click', '.main_chk', function () {
    var thisObj = $(this);
    var model_name = $(thisObj).attr('model_name');

    if (thisObj.is(':checked')) {
        $('.childChk_' + model_name).prop('checked', true);
    } else {
        $('.childChk_' + model_name).prop('checked', false);
    }

});

$(document).on('click', '.childBox', function () {
    var thisObj = $(this);
    var model_name = $(thisObj).attr('model_name');
    var chkStatus = false;
    if (thisObj.is(':checked')) {


        $('.childChk_' + model_name).each(function (index, value) {
            if (!$(this).is(':checked')) {
                chkStatus = true;
            }
        });

        if (!chkStatus) {
            $('.mainChk_' + model_name).prop('checked', true);
        } else {
            //var chkStatus = false;
        }

    } else {
        $('.mainChk_' + model_name).prop('checked', false);
    }

});

$(document).on('change', '#country_id', function () {

    var thisObj = $(this);
    var country_id = $(this).val();
    $("#state_id").html('');
    $("#state_id").append($('<option></option>').val('').html('--Please Select--'));
    $("#district_id").html('');
    $("#district_id").append($('<option></option>').val('').html('--Please Select--'));
    $("#tehsil_id").html('');
    $("#tehsil_id").append($('<option></option>').val('').html('--Please Select--'));
    $.ajax(
            {
                url: '/get-states',
                data: {'country_id': country_id},
                method: "POST",
                cache: false,
                success: function (response) {

                    $(response.data).each(function (ind, ele) {
                        $("#state_id").append($('<option></option>').val(ele.id).html(ele.state_name));
                    });
                }
//                    error: function (resData) {
//                        //data = JSON.parse(resData.responseText);
//                        Notify.showMessage(data.msg, 'error');
//                    }
            });
});

$(document).on('change', '#state_id', function () {

    var thisObj = $(this);
    var state_id = $(this).val();
    $("#district_id").html('');
    $("#district_id").append($('<option></option>').val('').html('--Please Select--'));
    $("#tehsil_id").html('');
    $("#tehsil_id").append($('<option></option>').val('').html('--Please Select--'));
    $.ajax(
            {
                url: '/get-district',
                data: {'state_id': state_id},
                method: "POST",
                cache: false,
                success: function (response) {

                    $(response.data).each(function (ind, ele) {
                        $("#district_id").append($('<option></option>').val(ele.id).html(ele.district_name));
                    });
                }
//                    error: function (resData) {
//                        //data = JSON.parse(resData.responseText);
//                        Notify.showMessage(data.msg, 'error');
//                    }
            });
});

$(document).on('change', '#district_id', function () {

    var thisObj = $(this);
    var district_id = $(this).val();
    $("#tehsil_id").html('');
    $("#tehsil_id").append($('<option></option>').val('').html('--Please Select--'));
    $.ajax(
            {
                url: '/get-tehsil',
                data: {'district_id': district_id},
                method: "POST",
                cache: false,
                success: function (response) {

                    $(response.data).each(function (ind, ele) {
                        $("#tehsil_id").append($('<option></option>').val(ele.id).html(ele.tehsil_name));
                    });
                }
//                    error: function (resData) {
//                        //data = JSON.parse(resData.responseText);
//                        Notify.showMessage(data.msg, 'error');
//                    }
            });
});
