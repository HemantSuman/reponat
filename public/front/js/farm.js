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

					if(response.status==true){
					   Notify.showMessage(response.msg, 'success');
                       setTimeout(function(){
                            window.location = '/farm/view-farmer';
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


function farmDelete(id){

    var result = confirm("Want to delete?");
    if (result) {
    
   var formData = {id:id};
    $.ajax(
            {
                url: '/farm/delete',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if(response.status==true){
                       $("#hideMe"+id).hide(); 
                       Notify.showMessage(response.msg, 'success');
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

}



function farmRequest(id,status){

    var result = confirm("Want to this?");
    if (result) {
    
   var formData = {id:id,status:status};
    $.ajax(
            {
                url: '/farm/request',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if(response.status==true){
                       Notify.showMessage(response.msg, 'success');
                       setTimeout(function(){
                            window.location = '/farm/visit-requests';
                       },2500);
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

}



/*======================= /Google Map (Visit farm page) =======================*/

var map;

function searchFarmByLocation(){

   if($("#lng").val()=='' || $("#lat").val()=='' || $("#distance").val()==''){
   Notify.showMessage('Please fill all information', 'error');  
   return false;
   }

   var formData = {lat:$("#lat").val(),lng:$("#lng").val(),distance:$("#distance").val()};
    $.ajax(
            {
                url: '/farm/search-farm-by-location',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if(response.status==true){
                    initMap(response);   
                    }else{
                       Notify.showMessage(response.msg, 'error');   
                    }
                    
                },
                error: function (resData) {
                data=JSON.parse(resData.responseText);   
                Notify.showMessage(data.msg, 'error'); 
                }

            });
}


function initMap(data) {

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({
    suppressPolylines: true
  });
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {
      lat:parseInt($("#lat").val()),
      lng:parseInt($("#lng").val())
    }
  });

  directionsDisplay.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsDisplay,data);

}



function calculateAndDisplayRoute(directionsService, directionsDisplay,data) {

var row=data.data;
row.forEach(function(rows) {
//console.log(rows.lat);

var marker1 = new Marker({
  map: map,
  zIndex: 10,
  title: 'Map Icons',
  position:  new google.maps.LatLng(rows.lat, rows.lng),
  icon: {
    path: MAP_PIN,
    fillColor: 'rgba(0, 0, 0, 0)',
    fillOpacity: 1,
    strokeColor: '',
    strokeWeight: 0,
    scale: 1/4,
  },
  label: '<i class="map-icon-funeral-home"><img src="'+rows.farm_image_url_one+'_200.jpg" width="50" height="50" alt=""></i>'
}); 


var infowindow1 = new google.maps.InfoWindow({
  content:"<div class='maptooltip'><span class='map-farm-title'>"+rows.farm_name+"</span><span class='farm-sm-info'> <span class='farm-info-label'> Address : </span><span class='farm-info-value'>"+rows.address+"</span> </span><span class='farm-sm-info'> <span class='farm-info-label'> Price : </span><span class='farm-info-value'>$"+rows.visit_price_per_person+"</span> </span><span class='farm-sm-info'> <span class='farm-info-label'> Months visited : </span><span class='farm-info-value'>"+rows.months_tobe_visited+"</span> </span><div class='facilitie-panel'><h3>Facilities</h3><ul class='facilitie-list map-facilitie-list'><li><div class='facilitie-content'><h4>"+rows.facility_description+"</h4></div></li></ul></div><div class='infowindow-footer'><a class='main-btn defaultbtn' href='javascript:void(0)' onclick='sendRequestFarm("+rows.id+")'>Send Request</a></div></div>"
});
google.maps.event.addListener(marker1, 'click', function() {
    infowindow1.open(map, this);
});
});

}

//google.maps.event.addDomListener(window, "load",initMap([]));






function sendRequestFarm(id){


var formData = {id:id};
    $.ajax(
            {
                url: '/farm/send-request-farm',
                data: formData,
                dataType: "json",
                method: "POST",
                cache: false,
                success: function (response) {

                    if(response.status==true){
                       Notify.showMessage(response.msg, 'success');
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



function deleteProductImage(p_id,id){

   var formData = {id:id,col_name:p_id};
    $.ajax(
            {
                url: '/farm/deleteImage',
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




