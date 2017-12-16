//Product manager
var arr=[];
$(document).on('submit', '#product', (function (event, state) {
	$('.errorMsg').remove();   
    $("#product .form-group input, #product .form-group select").removeClass('errMsg');
    event.preventDefault();
    var form = $('#product')[0];
    var formData = new FormData(form);
    formData.files=arr;

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

                   // Notify.showMessage(response.msg, 'success');

					if(response.status==true){
					   Notify.showMessage(response.msg, 'success');
                       //$('.errorMsg').remove();   
                       //$("#product .form-group input, #product .form-group select").removeClass('errMsg');
                       //set delay for sucess message
                       setTimeout(function(){
                            window.location = '/product';
                       },2500);
					}else{
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

//----

$('#upload_cover').click(function() {
    $('#upload_cover_file').trigger('click');
});


$("#upload_cover_file").change(function (){
var ext = $('#upload_cover_file').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
        Notify.showMessage('Please select vaild image file', 'error');
        return false;
    } else {
        readURL(this);
    }

});


function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);


        var formData = new FormData($('#coverFrom')[0]);
        $.ajax(
            {
                url: $('#coverFrom').attr("action"),
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



function selectRole(roleId){

    //event.preventDefault();
    //var form = $('#register')[0];
    var formData = {role_id:roleId};
    $.ajax(
            {
                url: 'select-role',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if(response.status==true){
                       Notify.showMessage(response.msg, 'success');
                       $('#selectRole').modal('hide');
                    }else{
                       Notify.showMessage(response.msg, 'error');   
                    }
                    

                },
                error: function (resData) {
                 
                }

            });

}


function deleteProductImage(id,p_id){

   var formData = {id:id,p_id:p_id};
    $.ajax(
            {
                url: '/product/deleteImage',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if(response.status==true){
                       $("#"+id).hide(); 
                       Notify.showMessage(response.msg, 'success');

                       setTimeout(function(){
                           location.reload(); 
                       },1500);


                    }else{
                       Notify.showMessage(response.msg, 'error');   
                    }
                    
                },
                error: function (resData) {
                //console.log(typeof resData.responseText);
                data=JSON.parse(resData.responseText);   
                Notify.showMessage(data.msg, 'error'); 
                }

            });

}












