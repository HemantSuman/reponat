var Notify = function () {

    var defaultHeights = {
        atomic: 70,
        chicchat: 120,
        legacy: 90,
        materialish: 48,
        timeout: 2500,
        dismissQueue: true,
        layout: 'topRight',
        closeWith: ['click'],
        theme: 'relax',
        maxVisible: 10,
        killer: true,
        animation: {
            open: 'animated bounceInRight',
            close: 'animated bounceOutRight',
            easing: 'swing',
            speed: 500
        }
    };


    var showChat = function (text, type) {

        if (type == 'black')
            type = 'twilight';

        if (type == 'done')
            type = 'success';

        if (type == 'warning')
            type = 'warning';

        if (type == 'info')
            type = 'information';



        var n = noty({
            text: text,
            timeout: 25000,
            type: type,
            dismissQueue: true,
            layout: 'bottomRight', //bottom
            closeWith: ['click'],
            theme: 'relax',
            maxVisible: 10,
            killer: true,
            animation: {
                open: 'animated bounceInRight',
                close: 'animated bounceOutRight',
                easing: 'swing',
                speed: 500
            },
            callback: {
                onShow: function () {
                },
                afterShow: function () {
                },
                onClose: function () {
                },
                afterClose: function () {
                },
                onCloseClick: function () {
                    window.location = "/message";
                },
            }
        });
    }









    var showMessage = function (text, type) {

        if (type == 'black')
            type = 'twilight';

        if (type == 'done')
            type = 'success';

        if (type == 'warning')
            type = 'warning';

        if (type == 'info')
            type = 'information';


        var n = noty({
            text: text,
            timeout: 500,
            type: type,
            dismissQueue: true,
            layout: 'topRight',
            closeWith: ['click'],
            theme: 'relax',
            maxVisible: 10,
            killer: true,
            animation: {
                open: 'animated bounceInRight',
                close: 'animated bounceOutRight',
                easing: 'swing',
                speed: 500
            },
        });
        setTimeout(function () {
            $.noty.closeAll();
        }, 3000);

    }


    var showMessageOld = function (id, msg) {

        if ($('#' + id).prop("tagName") == 'SELECT') {
            id = id + '_error';
        }
        
        if (randomEleIds.indexOf(id) < 0) {
            $("#" + id).after("<label class='errorMsg'>" + msg + "</label>");
            $("#" + id).addClass('errMsg');
        }

        randomEleIds.push(id);




    }

    var trans = function (msg) {
        lang = $('#setLanguageByUser').val();
        var jsonData = jsonMsg.lang;
        if (typeof (jsonData[msg]) != "undefined" && jsonData[msg] !== null) {
            msg = jsonData[msg][lang];
        }
        //console.log(msg);
        return msg;

    }

    return {
        showChat: function (msg, type) {
            showChat(msg, type);
        },
        showMessage: function (msg, type) {
            showMessage(msg, type);
        },
        showMessageOld: function (id, msg) {
            showMessageOld(id, msg);
        },
        trans: function (msg) {

            return trans(msg);
        }

    };

}();