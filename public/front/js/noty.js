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


    var showChat = function (msg, name, image) {
        console.log(image);
        $.notify({
            icon: image,
            title: name,
            message: msg
        }, {
            type: 'minimalist',
            delay: 12000,
            icon_type: 'image',
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                    '<img data-notify="icon" class="img-circle pull-left">' +
                    '<span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span>' +
                    '</div>',
            placement: {
                from: "bottom",
                align: "right"
            },
            animate: {
                enter: 'animated bounceInRight',
                exit: 'animated bounceOutRight'
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

        if (type == 'error')
            type = 'danger';


        $.notify({
        // options
        message:text 
        },{
        // settings
        type:type,
        delay: 3000
        });



    }










    // var showMessage = function (text, type) {

    //     if (type == 'black')
    //         type = 'twilight';

    //     if (type == 'done')
    //         type = 'success';

    //     if (type == 'warning')
    //         type = 'warning';

    //     if (type == 'info')
    //         type = 'information';



    //     var n = noty({
    //         text: text,
    //         timeout: 9000,
    //         type: type,
    //         dismissQueue: true,
    //         layout: 'topRight',
    //         closeWith: ['click'],
    //         theme: 'relax',
    //         maxVisible: 10,
    //         killer: true,
    //         animation: {
    //             open: 'animated bounceInRight',
    //             close: 'animated bounceOutRight',
    //             easing: 'swing',
    //             speed: 500
    //         }
    //     });
    //     setTimeout(function () {
    //         $.noty.closeAll();
    //     }, 3000);
    // }

    

    var showMessageOld = function (id, msg) {

         var randomEleIds = [];
        
       if($('#'+id).prop("tagName")=='SELECT'){
        id = id+'_error';
        }

        if (randomEleIds.indexOf(id) < 0) {
            console.log('23', id);
           $("#" + id).after("<label class='errorMsg'>" + msg + "</label>");         
           $("#" + id).addClass('errMsg');
        }

         randomEleIds.push(id);


        
    }

     var showMessageOldNew = function (id, msg) {

         var randomEleIds = [];
        
        if (randomEleIds.indexOf(id) < 0) {
            console.log("#" + id+'_error')
           $("#" + id+'_error').text(msg);
//           $("#" + id).addClass('errMsg');
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
        showChat: function (msg, name, image) {
            showChat(msg, name, image);
        },
        showMessage: function (msg, type) {
            showMessage(msg, type);
        },
        showMessageOld: function (id, msg) {
            showMessageOld(id, msg);
        },
        showMessageOldNew: function (id, msg) {
            showMessageOldNew(id, msg);
        },
        trans: function (msg) {

            return trans(msg);
        }

    };

}();