

function sendMessage(chat_type) {
    console.log('sendMessage click');

    if ($("#msg").val() == '')
        return false;

    var formData = {sender_id: $("#_loginUserId").val(), group_id: $("#msg_gid").val(), rec_id: $("#msg_rid").val(), msg: $("#msg").val(), chat_type: chat_type};

    //console.log(formData);

    socket.emit('send', $("#msg_gid").val(), formData);
    isSend($("#msg").val());
    //document.querySelector('.todo-list').innerHTML = wdtEmojiBundle.render(document.querySelector('.todo-list').innerHTML);
    $("#msg").val('')
}

function isSend(msg) {
    //name=$('#_loginUserName').val();    
    var my_time = moment().format("h:mm:ss A");

    var html = '<li class="msg-right clearfix">'
    html += '<div class="memberThumb"><span><img src="' + $('#_loginUserImage').val() + '" alt=" "></span></div>'
    html += '<div class="message-col"><div class="message-time">' + my_time + '</div><div class="memberName-col">' + $('#_loginUserName').val() + '</div><p>' + msg + '</p></div></li>';
    $('#loadChat').append(html);

    setTimeout(function () {
        $(".mCustomScrollbar3").mCustomScrollbar("scrollTo", "bottom", {
            scrollInertia: 1
        });
    }, 10);


}


// function isRec(msg){
// var html='<div class="receiver-msg clearfix">'
//     html+='<div class="chat-img"><img src="/front/assets/img/chat1.png" alt=""/></div>'
//     html+='<div class="chat-msg">'+msg+'</div></div>';

// $('#loadChat').append(html); 
// document.querySelector('.todo-list').innerHTML = wdtEmojiBundle.render(document.querySelector('.todo-list').innerHTML);
// }


$(document).keypress(function (e) {
//    if (e.which == 13) {
//        sendMessage();
//    }
});



function loadMessage(flag, pageIs) {
    var pageSet = 1;
    if (pageIs == 'nxt') {
        pageSet = $('#myPage').val();
        $('#myPage').val(parseInt(pageSet) + 1);
    }

    if (pageIs == 'pre') {
        var pageSet = $('#myPage').val();
        $('#myPage').val(parseInt(pageSet) - 1);
    }


    if (flag != 1) {

        var formData = {type: $('#msgType').val(), page: $("#lastMsg").val(), pageIs: pageIs, page2: $('#firstMsg').val(), pageSet: $('#myPage').val()};
    } else {
        var formData = {type: 'rec_id', page: '0', pageIs: 1, page2: '0', pageSet: pageSet};
    }

    $.ajax(
            {
                url: '/message/load',
                data: formData,
                dataType: "html",
                method: "POST",
                cache: false,
                success: function (response) {

                    $('#loadMessage').html(response);
                    document.querySelector('.todo-list').innerHTML = wdtEmojiBundle.render(document.querySelector('.todo-list').innerHTML);


                    var total_pages = Math.ceil(parseInt($('#totalMsg').val()) / 10);

                    console.log(total_pages, '----', $('#myPage').val())

                    //hideMe hideMePre
                    $(".hideMe").show();
                    $(".hideMeNxt").show();
                    $(".hideMePre").show();

                    if (total_pages == 1) {
                        $(".hideMe").hide();
                    }

                    if ($('#myPage').val() == 1) {
                        $(".hideMePre").hide();
                    }

                    if (total_pages <= $('#myPage').val()) {
                        //alert('page is over');
                        $(".hideMeNxt").hide();
                        //return false;
                    }

                    if (formData.type != 'sender_id') {
                        $('#sender_id_act').addClass('active');
                        $('#rec_id_act').removeClass('active');
                    } else {
                        $('#sender_id_act').removeClass('active');
                        $('#rec_id_act').addClass('active');
                    }

                    $('#checkAll').prop('checked', false);

                },
                error: function (resData) {
                    Notify.showMessage('Something went wrong', 'error');
                }

            });

}


$(document).ready(function () {
//loadMessage(1);
});


function setFilter(type, page) {

    $('#msgType').val(type);
    loadMessage(2, page);

}


function messageDetails(id, name, msg, rid, sid, pid) {

    $('#msg_sid').val(sid);
    $('#msg_pid').val(pid);
    $('#msg_rid').val(rid);
//$('#msg').val($('#message').val());

    $('#md_setName').text(name);
    $('#md_setMsg').html($('#' + msg).html());
    $('#messageDetails').modal('show');
}



function sendMessageByBox() {
    console.log('sendMessage click');

    if ($('#message').val() == '') {
        Notify.showMessage('Please enter your message', 'error');
        return false;
    }

    var formData = {sender_id: $("#msg_sid").val(), product_id: $("#msg_pid").val(), rec_id: $("#msg_rid").val(), msg: $('#message').val()};
    socket.emit('send', $("#msg_rid").val(), formData);

    //isSend($("#msg").val());
    //document.querySelector('.todo-list').innerHTML = wdtEmojiBundle.render(document.querySelector('.todo-list').innerHTML);
    $('#messageDetails').modal('hide');
    Notify.showMessage('Your message sent successfully', 'done');
    $('#message').val('');
}


$("#checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
});

function deleteMessage(flag, pageIs) {
    var ids = [];
    $('#loadMessage input[type=checkbox]:checked').each(function () {
        ids.push($(this).val());
    });


    var formData = {ids: ids};
    $.ajax(
            {
                url: '/message/delete',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {
                    Notify.showMessage("Something went wrong", 'error');
                },
                error: function (resData) {
                    Notify.showMessage("Something went wrong", 'error');
                }

            });

}