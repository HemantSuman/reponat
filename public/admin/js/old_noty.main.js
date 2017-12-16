var Notify = function () {

    var defaultHeights = {
        atomic: 70,
        chicchat: 120,
        legacy: 90,
        materialish: 48,
        relax: 52,
    };


    var showMessage = function (text, type) {

        if (type == 'black') {
            type = 'twilight';
            classType = 'twilight'
            iconType = 'fa-check';
        }


        if (type == 'done') {
            type = 'success';
            classType = 'success'
            iconType = 'fa fa-thumbs-up';
        }


        if (type == 'warning') {
            type = 'warning';
            classType = 'warning'
            iconType = 'fa-warning';
        }


        if (type == 'info') {
            type = 'information';
            classType = 'info'
            iconType = 'fa-info';
        }

        if (type == 'error') {
            type = 'error';
            classType = 'danger';
            iconType = 'fa-ban';
        }



        var htmlUi = '<div class="alert alert-noty alert-' + classType + ' alert-dismissible" style="padding:5px">';
        htmlUi += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
        htmlUi += '<h5><i class="icon fa ' + iconType + '"></i>' + text + '</h5>';
        //htmlUi+='Danger alert preview. This alert is dismissable.';
        htmlUi += '</div>';

        // var n = noty({
        //     text        : '',
        //     timeout: 3000,
        //     type        : type,
        //     template:htmlUi,
        //     dismissQueue: true,
        //     layout      : 'topRight',
        //     closeWith   : ['click'],
        //     theme       : 'relax',
        //     maxVisible  : 10,
        //     animation   : {
        //         open  : 'animated bounceInRight',
        //         close : 'animated bounceOutRight',
        //         easing: 'swing',
        //         speed : 500
        //     }
        // });

        var n = noty({
            layout: 'topRight',
            theme: 'materialish', // or 'relax'
            type: type,
            //text: '', // can be html or string
            dismissQueue: true, // If you want to use queue feature set this true
            template: htmlUi,
            animation: {
                open: 'animated fadeInUp', // or Animate.css class names like: 'animated bounceInLeft'
                close: 'animated fadeOutUp', // or Animate.css class names like: 'animated bounceOutLeft'
                easing: 'swing',
                speed: 500 // opening & closing animation speed
            },
            timeout: 2000, // delay for closing event. Set false for sticky notifications
            force: false, // adds notification to the beginning of queue when set to true
            modal: false,
            maxVisible: 5, // you can set max visible notification for dismissQueue true option,
            killer: false, // for close all notifications before show
            closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
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
                },
            },
            buttons: false // an array of buttons
        });
        n.setTimeout(3000);

    }


    var showMessageUi = function (id, msg) {
        //$('.errorMsg').remove();  
        $("#" + id).after("<p class='errorMsg top'>" + msg + "</p>");

    }

    return {
        showMessage: function (msg, type) {
            showMessage(msg, type);
        },
        showMessageUi: function (id, msg) {
            showMessageUi(id, msg);
        }

    };

}();