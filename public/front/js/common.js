//var socket = io.connect('http://192.168.100.160:8081');
//var socket2 = io.connect('http://192.168.100.160:8081/user');
//var stream = ss.createStream();
var randomEleIds = [];
//socket.on('connect', function () {
//
//    console.log('connect is call....');
//
//});

//socket.emit('join', {id: $('#_loginUserId').val()});
//socket.on('msgRecive', function (data) {
//    //alert('you...');
//    console.log(data);
//    isRec(data);
//});
//
//
//socket.on('downloadFile', function (data) {
//    console.log(data);
//    setTimeout(function () {
//
//        var ext = data.file_url.split('.').pop().toLowerCase();
//
//        var my_time = moment().format("h:mm:ss A");
//
//        if (data.chat_type == 'group_') {
//
//            if ($('#loadChat').length && $("#msg_gid").val() == data.group_id) {
//
//                if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'bmp']) == -1) {
//                    var html = '<li class="msg-left clearfix">'
//                    html += '<div class="memberThumb"><span><img src="' + data.user_image + '" alt=" "></span></div>'
//                    html += '<div class="message-col"><div class="message-time">' + my_time + '</div><div class="memberName-col">' + data.user_name + '</div><div class="chatFile"><a href="' + data.file_url + '" target="_blank">' + data.file_name + '</a></div></div></li>';
//
//                } else {
//                    var html = '<li class="msg-left clearfix">'
//                    html += '<div class="memberThumb"><span><img src="' + data.user_image + '" alt=" "></span></div>'
//                    html += '<div class="message-col"><div class="message-time">' + my_time + '</div><div class="memberName-col">' + data.user_name + '</div><div class="chatImg"><img src="' + data.file_url + '" alt=" "></div></div></li>';
//
//                }
//
//                $('#loadChat').append(html);
//            }
//        }
//
//
//
//        if (data.chat_type == 'user_') {
//
//            if ($('#loadChat').length && ($("#_loginUserId").val() == data.rec_id || $("#_loginUserId").val() == data.sender_id)) {
//
//                if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'bmp']) == -1) {
//                    var html = '<li class="msg-left clearfix">'
//                    html += '<div class="memberThumb"><span><img src="' + data.user_image + '" alt=" "></span></div>'
//                    html += '<div class="message-col"><div class="message-time">' + my_time + '</div><div class="memberName-col">' + data.user_name + '</div><div class="chatFile"><a href="' + data.file_url + '" target="_blank">' + data.file_name + '</a></div></div></li>';
//
//                } else {
//                    var html = '<li class="msg-left clearfix">'
//                    html += '<div class="memberThumb"><span><img src="' + data.user_image + '" alt=" "></span></div>'
//                    html += '<div class="message-col"><div class="message-time">' + my_time + '</div><div class="memberName-col">' + data.user_name + '</div><div class="chatImg"><img src="' + data.file_url + '" alt=" "></div></div></li>';
//
//                }
//
//                $('#loadChat').append(html);
//            }
//        }
//
//
//
//        setTimeout(function () {
//            $(".mCustomScrollbar3").mCustomScrollbar("scrollTo", "bottom", {
//                scrollInertia: 1
//            });
//            $('#fileLoadGif1').show();
//            $('#fileLoadGif2').hide();
//        }, 1000);
//
//    }, 10);
//
//    if ($("#_loginUserId").val() == data.rec_id) {
//        Notify.showChat(data.user_name + ' sent file ' + data.file_name, data.user_name, data.user_image);
//    }
//
//});
//
//
//function isRec(data) {
//
//    console.log(data);
//
//    if (data.chat_type == 'group_') {
//
//        if ($('#loadChat').length && $("#msg_gid").val() == data.group_id) {
//
//            if (data.sender_id == $("#_loginUserId").val())
//                return false;
//
//            var my_time = moment().format("h:mm:ss A");
//
//            var html = '<li class="msg-left clearfix">'
//            html += '<div class="memberThumb"><span><img src="' + data.user_image + '" alt=" "></span></div>'
//            html += '<div class="message-col"><div class="message-time">' + my_time + '</div><div class="memberName-col">' + data.user_name + '</div><p>' + data.msg + '</p></div></li>';
//            $('#loadChat').append(html);
//
//            setTimeout(function () {
//                $(".mCustomScrollbar3").mCustomScrollbar("scrollTo", "bottom", {
//                    scrollInertia: 1
//                });
//            }, 10);
//
//        }
//
//    }
//
//
//    if (data.chat_type == 'user_') {
//
//        console.log('enter in user');
//
//        if ($('#loadChat').length && $("#_loginUserId").val() == data.rec_id) {
//
//            console.log('1');
//
//            var my_time = moment().format("h:mm:ss A");
//
//            var html = '<li class="msg-left clearfix">'
//            html += '<div class="memberThumb"><span><img src="' + data.user_image + '" alt=" "></span></div>'
//            html += '<div class="message-col"><div class="message-time">' + my_time + '</div><div class="memberName-col">' + data.user_name + '</div><p>' + data.msg + '</p></div></li>';
//            $('#loadChat').append(html);
//
//            setTimeout(function () {
//                $(".mCustomScrollbar3").mCustomScrollbar("scrollTo", "bottom", {
//                    scrollInertia: 1
//                });
//            }, 10);
//
//        }
//
//    }
//
//
//    //Notify.showChat(data.msg, 'info');
//    Notify.showChat(data.msg, data.user_name, data.user_image);
//    //document.querySelector('.noty_text').innerHTML = wdtEmojiBundle.render(document.querySelector('.noty_text').innerHTML);
//}



$(document).ajaxStart(function () {
    showLoad();
});

$(document).ajaxStop(function () {
    hideLoad();
});

function showLoad() {
//$('.btn-file').block({ message:$('#displayBox') });
    $.blockUI({
        message: $('#displayBox'),
        css: {
            top: ($(window).height() - 75) / 2 + 'px',
            left: ($(window).width() - 75) / 2 + 'px',
            width: '75px',
            border: 'none',
            backgroundColor: 'none'
        }
    });

}


function hideLoad() {
    $.unblockUI();
}


//function isRec(data) {
//    if ($('#loadChat').length && $("#msg_pid").val() == data.product_id) {
//        var html = '<div class="receiver-msg clearfix">'
//        html += '<div class="chat-img"><img src="/front/assets/img/chat1.png" alt=""/></div>'
//        html += '<div class="chat-msg">' + data.msg + '</div></div>';
//
//        $('#loadChat').append(html);
//        document.querySelector('.todo-list').innerHTML = wdtEmojiBundle.render(document.querySelector('.todo-list').innerHTML);
//    }
//
//    Notify.showChat(data.msg, 'info');
//    document.querySelector('.noty_text').innerHTML = wdtEmojiBundle.render(document.querySelector('.noty_text').innerHTML);
//}


$(document).ready(function () {
    if ($(".categoryChanged").length) {
        loadSubCat($(".categoryChanged").val());
    }
});



function loadSubCat(id) {

    var formData = {id: id};
    $.ajax(
            {
                url: '/product/loadSubCategory',
                data: formData,
                dataType: "html",
                method: "POST",
                cache: false,
                success: function (response) {
                    $("#sub_category_id").html(response);
                },
                error: function (resData) {
                    Notify.showMessage("Something went wrong", 'error');
                }

            });
}

$(document).on('change', '.categoryChanged', (function (event, state) {
    loadSubCat($(".categoryChanged").val());
}));

$(document).on('change', '.countryChanged', (function (event, state) {
    loadState($(".countryChanged").val());
}));

$(document).on('change', '.stateChanged', (function (event, state) {
    loadCity($(".stateChanged").val());
}));


$(document).on('click', '.addWishlist', (function (event, state) {
    loadSubCat($(".categoryChanged").val());
}));


function addWishlist(id, actCls) {

    var formData = {id: id};
    $.ajax(
            {
                url: '/product/addWishlist',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {
                    Notify.showMessage(response.msg, 'success');

                    if (response.status === true) {
                        $('#' + actCls).addClass('active');
                    } else {
                        $('#' + actCls).removeClass('active');
                    }

                },
                error: function (resData) {
                    data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });
}





function loadState(id, setValue) {

    var formData = {id: id};
    $.ajax(
            {
                url: '/loadState',
                data: formData,
                dataType: "html",
                method: "POST",
                cache: false,
                success: function (response) {
                    $(".stateChanged").html(response);

                    if (typeof setValue !== 'undefined' && setValue != '') {
                        $(".stateChanged").val(setValue);
                        loadCity($(".stateChanged").val(), $("#cityIs").val());
                    }


                },
                error: function (resData) {
                    Notify.showMessage("Something went wrong", 'error');
                }

            });
}


function loadCity(id, setValue) {

    var formData = {id: id};
    $.ajax(
            {
                url: '/loadCity',
                data: formData,
                dataType: "html",
                method: "POST",
                cache: false,
                success: function (response) {
                    $(".cityChanged").html(response);
                    if (typeof setValue !== 'undefined' && setValue != '') {
                        $(".cityChanged").val(setValue);
                    }
                },
                error: function (resData) {
                    Notify.showMessage("Something went wrong", 'error');
                }

            });
}


$(document).on('submit', '#registerForm', (function (event, state) {
    $('.errorMsg').remove();
    $("#registerForm").removeClass('errMsg');
    event.preventDefault();
    var form = $('#registerForm')[0];
    var formData = new FormData(form);

    $.ajax(
            {
                url: $(this).attr("action"),
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if (response.status == true) {
                        Notify.showMessage(response.msg, 'success');
                        setTimeout(function () {
                            window.location = '/post';
                        }, 2500);
                    } else {
                        $('.errorMsg').remove();
                        Notify.showMessage(response.msg, 'error');
                        Notify.showMessageOld('email_address', response.msg);
                        $(".errorMsg").prev().addClass('errMsg');
                    }


                },
                error: function (resData) {
                    $.each(resData.responseJSON.data, function (key, val) {
                        Notify.showMessageOld(val.param, val.msg);
                    });
                }

            });
}));



$(document).on('submit', '#loginForm', (function (event, state) {
    $('.errorMsg').remove();
    
    randomEleIds = [];
    $("#loginForm").removeClass('errMsg');
    event.preventDefault();
    var form = $('#loginForm')[0];
    var formData = new FormData(form);

    $.ajax(
            {
                url: $(this).attr("action"),
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if (response.status == true) {
                        //Notify.showMessage(response.msg, 'success');
                        if ($('#type').length && $('#type').val() == 'admin') {
                            window.location = '/admin/dashboard/';
                        } else {
                            window.location = '/post';
                        }


                    } else {
                        Notify.showMessage(response.msg, 'error');
                    }


                },
                error: function (resData) {
                    $.each(resData.responseJSON.data, function (key, val) {
                        Notify.showMessageOld(val.param, val.msg);
                    });
                }

            });
}));



$(document).on('submit', '#contactForm', (function (event, state) {
    $('.errorMsg').remove();
    $("#contactForm").removeClass('errMsg');
    event.preventDefault();
    var form = $('#contactForm')[0];
    var formData = new FormData(form);

    $.ajax(
            {
                url: $(this).attr("action"),
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if (response.status == true) {
                        Notify.showMessage(response.msg, 'success');
                        $('#contactForm')[0].reset();
                    } else {
                        Notify.showMessage(response.msg, 'success');
                    }


                },
                error: function (resData) {
                    $.each(resData.responseJSON.data, function (key, val) {
                        Notify.showMessageOld(val.param, val.msg);
                    });
                }

            });
}));


$(document).on('submit', '#updateProfile', (function (event, state) {
    $('.errorMsg').remove();
    $("#updateProfile").removeClass('errMsg');
    event.preventDefault();
    var form = $('#updateProfile')[0];
    var formData = new FormData(form);

    $.ajax(
            {
                url: $(this).attr("action"),
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if (response.status == true) {
                        Notify.showMessage(response.msg, 'success');
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    } else {
                        Notify.showMessage(response.msg, 'success');
                    }


                },
                error: function (resData) {
                    $.each(resData.responseJSON.data, function (key, val) {
                        Notify.showMessageOld(val.param, val.msg);
                    });
                }

            });
}));

$(document).on('submit', '#setInterest', (function (event, state) {
    $('.errorMsg').remove();
    event.preventDefault();
    var form = $('#setInterest')[0];
    var formData = new FormData(form);

    $.ajax(
            {
                url: $(this).attr("action"),
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {
                    if (response.status == true) {
                        Notify.showMessage(response.msg, 'success');
                        setTimeout(function () {
                            $('#SelectInterest').modal('hide');
                        }, 1500);
                    } else {
                        $('.errorMsg').remove();
                        Notify.showMessage(response.msg, 'error');
                        $(".errorMsg").prev().addClass('errMsg');
                    }


                },
                error: function (resData) {
                    $.each(resData.responseJSON.data, function (key, val) {
                        Notify.showMessageOld(val.param, val.msg);
                    });
                }

            });
}));

$(document).on('submit', '#setCompleteProfile', (function (event, state) {
	/*if(($('input[name=role_id]:checked', '#setCompleteProfile').val() == undefined) && ($('#getrole').val() == '')){
		alert("Please select role first.");
		return false;
	}*/
    $('.errorMsg').remove();
    event.preventDefault();
    var form = $('#setCompleteProfile')[0];
    var formData = new FormData(form);
    $.ajax(
            {
                url: $(this).attr("action"),
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {
                    if (response.status == true) {
                        Notify.showMessage(response.msg, 'success');
                        setTimeout(function () {
                            $('#custommodal2').modal('hide');
							window.location = '/post';
                        }, 2000);
                    } else {
                        $('.errorMsg').remove();
                        Notify.showMessage(response.msg, 'error');
                        $(".errorMsg").prev().addClass('errMsg');
                    }


                },
                error: function (resData) {
                    $.each(resData.responseJSON.data, function (key, val) {
                        Notify.showMessageOld(val.param, val.msg);
                    });
                }

            });
}));


function addLike(post_id, post_user_id) {

    var formData = {post_id: post_id, post_user_id: post_user_id};
    $.ajax(
            {
                url: '/class/add-like',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {
                    //Notify.showMessage(response.msg, 'success');

                    if (response.status === true) {
                        $('#actMe' + post_id).addClass('active');
                        var totCount = $('#likeCounter' + post_id).text();
                        $('#likeCounter' + post_id).text(parseInt(totCount) + 1);

                    } else {
                        $('#actMe' + post_id).removeClass('active');
                        var totCount = $('#likeCounter' + post_id).text();
                        $('#likeCounter' + post_id).text(parseInt(totCount) - 1);
                    }

                },
                error: function (resData) {
                    data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });



}




function joinClass(class_id, class_user_id) {


    var formData = {class_id: class_id, class_user_id: class_user_id};
    $.ajax(
            {
                url: '/class/request',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {


                    if (response.status === true) {
                        Notify.showMessage(response.msg, 'success');
                        //$('#actMe' + post_id).addClass('active');
                        //var totCount=$('#likeCounter' + post_id).text();
                        //$('#likeCounter' + post_id).text(parseInt(totCount)+1);
                        setTimeout(function () {
                            location.reload();
                        }, 1000);

                    } else {
                        Notify.showMessage(response.msg, 'error');
                        //$('#actMe' + post_id).removeClass('active');
                        //var totCount=$('#likeCounter' + post_id).text();
                        //$('#likeCounter' + post_id).text(parseInt(totCount)-1);
                    }

                },
                error: function (resData) {
                    data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });

}




function requestStatus(type, type_user_id, type_id, n_id, status, group_type) {

    if (typeof group_type === "undefined")
        group_type = '';

    var formData = {type: type, type_id: type_id, type_user_id: type_user_id, status: status, n_id: n_id, group_type: group_type};
    $.ajax(
            {
                url: '/request-status',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {


                    if (response.status === true) {
                        Notify.showMessage(response.msg, 'success');
                        $("#notyUiId" + n_id).hide();
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
                    data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });

}





function notyDelete(n_id) {

    var x = confirm("Are you sure you want to delete?");
    if (x) {
        var formData = {n_id: n_id};
        $.ajax(
                {
                    url: '/notification-delete',
                    data: formData,
                    dataType: "json",
                    method: "POST",
                    cache: false,
                    success: function (response) {


                        if (response.status === true) {
                            Notify.showMessage(response.msg, 'success');
                            $("#notyUiId" + n_id).hide();
                        } else {
                            Notify.showMessage(response.msg, 'error');
                        }

                    },
                    error: function (resData) {
                        data = JSON.parse(resData.responseText);
                        Notify.showMessage(data.msg, 'error');
                    }

                });
    } else {

        return false;
    }

}


function addComment(post_id, post_user_id, comment) {

    if (typeof comment === 'undefined') {
        comment = $('.sendComment').val();
    }

    if (comment == '')
        return false;

    var formData = {post_id: post_id, post_user_id: post_user_id, comment: comment};
    $.ajax(
            {
                url: '/class/add-comment',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if (response.status === true) {
                        //Notify.showMessage(response.msg, 'success');
                        //$("#notyUiId"+n_id).hide();       


                        var commentHtml = '<div class="postComttop">'
                        commentHtml += '<div class="postComtImg"><img src="' + userImage + '" width="37px" height="37px"></div>'
                        commentHtml += '<div class="postComtName"><strong>' + userName + '</strong></div>'
                        commentHtml += '<div class="postComtDesc">' + comment + '</div>'
                        commentHtml += '<div class="postComtTime"></div>'
                        commentHtml += '</div>';

                        $('#loadComment' + post_id).append(commentHtml);
                        var commentCounter = parseInt($('#getCommentCount').text());

                        $('#getCommentCount').text(commentCounter + 1);

                        $('.sendComment').val('');

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

$(document).on('keydown', '.sendComment', (function (event, state) {
//$( ".sendComment" ).on( "keydown", function(event) {
    if (event.which == 13) {
        //console.log($(this).val()); 
        //console.log($(this).attr("data-comment")); 
        if ($(this).val() == '')
            return false;

        var dataArr = $(this).attr("data-comment").split('##');
        addComment(dataArr[0], dataArr[1], $(this).val());
        $(this).val('');
    }
}));





function friendRequest(rec_id, clickRef, status) {

    if (status == 0) {
        if (confirm("Are you sure you want to delete?"))
        {
            var formData = {rec_id: rec_id, status: status};
            $.ajax(
                    {
                        url: '/friend-request',
                        data: formData,
                        dataType: "json",
                        method: "POST",
                        cache: false,
                        success: function (response) {
                            Notify.showMessage(response.msg, 'success');
                            location.reload();
                            if (response.status === true) {
                                if (status == 1) {
                                    $('#myFrndLi' + rec_id).hide();
                                    //$(clickRef).text('Request pending');
                                    $(clickRef).prop("onclick", null);
                                    location.reload();
                                } else {
                                    $(clickRef).text('Send Request');
                                    $(clickRef).prop("onclick", null);
                                }

                            } else {

                            }

                        },
                        error: function (resData) {
                            data = JSON.parse(resData.responseText);
                            Notify.showMessage(data.msg, 'error');
                        }

                    });
        }
        else
        {
            e.preventDefault();
        }
    } else {

        var formData = {rec_id: rec_id, status: status};
        $.ajax(
                {
                    url: '/friend-request',
                    data: formData,
                    dataType: "json",
                    method: "POST",
                    cache: false,
                    success: function (response) {
                        Notify.showMessage(response.msg, 'success');
                        //location.reload();
                        if (response.status === true) {
                            if (status == 1) {
                                //$('#myFrndLi' + rec_id).hide();
                                //$(clickRef).text('Request pending');
                                //$(clickRef).prop("onclick", null);
                                //location.reload();
                            } else {
                                //$(clickRef).text('Send Request');
                                //$(clickRef).prop("onclick", null);
                            }

                        } else {

                        }

                    },
                    error: function (resData) {
                        data = JSON.parse(resData.responseText);
                        Notify.showMessage(data.msg, 'error');
                    }

                });
    }







}


function groupRequest(group_id, group_user_id, clickRef, isExit) {

    if (typeof isExit === "undefined") {
        isExit = 0;
    }

    var formData = {group_id: group_id, group_user_id: group_user_id, isExit: isExit};
    $.ajax(
            {
                url: '/group-request',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {
                    Notify.showMessage(response.msg, 'success');

                    if (response.status === true) {
                        $(clickRef).text('Request pending');
                        $(clickRef).prop("onclick", null);

                        if (isExit == 1) {
                            setTimeout(function () {
                                location.reload();
                            }, 2500);
                        }

                    } else {
                    }

                },
                error: function (resData) {
                    data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });

}

//To update Profile pic
$('.edit-pic').click(function () {
    $('#upload_pic_file').trigger('click');
});

$("#upload_pic_file").change(function () {
    var ext = $('#upload_pic_file').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
        Notify.showMessage('Please select vaild image file', 'error');
        return false;
    } else {
        readURLPic(this);
    }

});


function readURLPic(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#picLoad').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);


        var formData = new FormData($('#picFrom')[0]);
        $.ajax(
                {
                    url: '/picUpload',
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    method: "POST",
                    cache: false,
                    success: function (response) {
                        Notify.showMessage(response.msg, 'done');
                    },
                    error: function (data) {
                        $('#loading').hide();
                    }

                });



    }
}

function deleteUserDocument(id, u_id) {

    var formData = {id: id, u_id: u_id};
    var x = confirm("Are you sure you want to delete?");
    if (x) {
        $.ajax(
                {
                    url: '/deleteDocument',
                    data: formData,
                    dataType: "json",
                    method: "POST",
                    cache: false,
                    success: function (response) {

                        if (response.status == true) {
                            $("#" + id).hide();
                            Notify.showMessage(response.msg, 'success');

                            /* setTimeout(function(){
                             location.reload(); 
                             },1500);*/


                        } else {
                            Notify.showMessage(response.msg, 'error');
                        }

                    },
                    error: function (resData) {
                        //console.log(typeof resData.responseText);
                        data = JSON.parse(resData.responseText);
                        Notify.showMessage(data.msg, 'error');
                    }

                });
    } else {
        return false;
    }

}


function startClass(id, type) {

    var formData = {id: id, type: type};
    $.ajax(
            {
                url: '/startClass',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    Notify.showMessage(response.msg, 'success');

                    if (response.status === true) {
                        window.location.replace(response.data);
                    } else {

                    }

                },
                error: function (resData) {
                    data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });


}



function deletePost(post_id, type) {


    if (confirm("Are you sure you want to delete?"))
    {

        var formData = {post_id: post_id, post_user_id: type};
        $.ajax(
                {
                    url: '/delete-post',
                    data: formData,
                    dataType: "json",
                    method: "POST",
                    cache: false,
                    success: function (response) {

                        if (response.status === true) {
                            $('#hideMe' + post_id).hide();
                            Notify.showMessage(response.msg, 'success');
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
    else
    {
        return false;
    }



}



function startGroupCall(id, type) {

    var formData = {id: id, type: type};
    $.ajax(
            {
                url: '/startGroupCall',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    Notify.showMessage(response.msg, 'success');

                    if (response.status === true) {
                        window.location.replace(response.data);
                    } else {

                    }

                },
                error: function (resData) {
                    data = JSON.parse(resData.responseText);
                    Notify.showMessage(data.msg, 'error');
                }

            });


}


/* Handle Forgot Password Ajax Form Request
 ===========================================*/
$(document).on('submit', '#frgt-pswrd-frm', (function (event, state) {
    event.preventDefault();
    var form = $('#frgt-pswrd-frm')[0];
    var formData = new FormData(form);
    $.ajax({
        url: $(this).attr("action"),
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        method: "POST",
        cache: false,
        success: function (response) {
            $('#fp-email-error').text('')
            if (response.status == true) {
                $('#forgotPasswordPopup').modal("hide")
                Notify.showMessage(response.msg, 'success');
            } else {
                Notify.showMessage(response.msg, 'error');
            }
        },
        error: function (resData) {
            $.each(resData.responseJSON.data, function (key, val) {
                // Notify.showMessageOld(val.param, val.msg);
                $('#fp-email-error').text(val.msg)
            });
        }

    });
}));


/* Handle Reset Password Ajax Form Request
 ===========================================*/
$(document).on('submit', '#resetPasswordForm', (function (event, state) {
    event.preventDefault();
    var form = $('#resetPasswordForm')[0];
    var formData = new FormData(form);
    $.ajax({
        url: $(this).attr("action"),
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        method: "POST",
        cache: false,
        success: function (response) {
            //console.log(response)
            if (response.status == true) {
                Notify.showMessage(response.msg, 'success');
                setTimeout(function () {
                    window.location = '/post';
                }, 3000);
            } else {
                console.log("heree")
                Notify.showMessage(response.msg, 'error');
            }
        },
        error: function (resData) {
            //console.log(resData);
            console.log("hereeeeee")
            Notify.showMessage(resData.responseJSON.msg, 'error');
            // $.each(resData.responseJSON.data, function (key, val) {
            //    // Notify.showMessageOld(val.param, val.msg);
            //    // console.log("eee : "+val.msg)
            //    Notify.showMessage(val.msg, 'error');
            //    //$('#rst-pswrd-errr').text(val.msg)
            //    //Notify.showMessage(val.msg, 'warning');
            // });
            // $.each(resData.responseJSON.data, function (key, val) {
            //     Notify.showMessageOld(val.param, val.msg);
            // });
        }

    });
}));



function deleteGroup(group_id, type) {

    if (confirm("Are you sure you want to delete?"))
    {

        var formData = {group_id: group_id, type: type};
        $.ajax(
                {
                    url: '/delete-group',
                    data: formData,
                    dataType: "json",
                    method: "POST",
                    cache: false,
                    success: function (response) {

                        if (response.status === true) {
                            //$('#hideMe' + post_id).hide();
                            //Notify.showMessage(response.msg, 'success');
                            window.location = '/my-groups';
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
    else
    {
        return false;
    }



}




