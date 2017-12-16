function custonSelect(){
	$('.custom-select').select2({
		theme:'default'
	});
}
function syncHeight(){
w_width = jQuery(window).width();
	if(w_width > 767){
		jQuery('.arbitrators-block').syncHeight({updateOnResize: true});
		jQuery('.arbitrators-block p').syncHeight({updateOnResize: true});
	}else{
		jQuery('.arbitrators-block').unSyncHeight();
		jQuery('.arbitrators-block p').unSyncHeight();
	}
}

$('.collapse-header').on('click', function () {
        $($(this).data('target')).collapse('toggle');
    });

jQuery(document).ready(function(){

	custonSelect();
	syncHeight();
/*=========testimonial slider==========*/
 var swiper = new Swiper('.swiper1', {
        //nextButton: '.swiper-button-next1',
        //prevButton: '.swiper-button-prev1',
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 12,

		 breakpoints: {
            767: {
                slidesPerView: 1,
                spaceBetween: 0,
				autoHeight:true,
            }
		}

    });
/*=========partner scroller==========*/
var swiper = new Swiper('.swiper2', {
        //nextButton: '.swiper-button-next1',
        //prevButton: '.swiper-button-prev1',
        slidesPerView: 1,
        autoplay:10000,
        loop:true,

        paginationClickable: true,
        spaceBetween: 0,
		 breakpoints: {
            767: {
                slidesPerView: 1,
                spaceBetween: 0,

            },
			568: {
                slidesPerView: 1,
                spaceBetween: 0,

            },
			320: {
                slidesPerView: 1,
                spaceBetween: 0,

            }


		}

    });
/*=========banner scroller==========*/
	var swiper = new Swiper('.swiper3', {
		autoHeight:true,
		autoplay:5000,
		effect:'fade',
		pagination: '.swiper-pagination',
        paginationClickable: true
		})
/*=========DropDowm Menu==========*/
		var w_width = jQuery(window).width();
		if(w_width > 767)
		{
 	 		jQuery('.menuWrap > ul > li').hover(function(){
				jQuery(this).children("div.dropdown-menu").stop().slideDown();
				}, function(){
				 jQuery(this).children("div.dropdown-menu").stop().slideUp();

			});
		}

/*=========responsive menu==========*/

	var mwidth = jQuery('.menuWrap').width();
		function openmenu(){
		jQuery('.menuWrap').animate({
			left:'0px',
			opacity:'1'
			},500)
		//jQuery('.menu-btn').css({left:mwidth-60,top:'-70px'},500)
		}

		function closemenu(){
		jQuery('.menuWrap').animate({
			left:-mwidth,
			opacity:'0',
			},500)
		//jQuery('.menu-btn').css({left:'15px',top:'-50px'},500)
		}



		//alert(distance);
		jQuery('.menu-btn').click(function(){
			jQuery('.menu-icon').toggleClass('close-menu')
			var distance = jQuery('.menuWrap').css('left');
			if(distance >= '0px'){
				//jQuery('.menu-data').toggleClass('menu-show')
				closemenu();}
				else{openmenu();}

			});



	/*=========filer menu==========*/

	jQuery('#image_url1').filer({
		showThumbs: true,
		addMore: true,
		allowDuplicates: false,
                limit:1,
		captions:{
			button:"Browse",
			feedback:" ",

		}
	});
	/*=========DropDown type change==========*/

	 jQuery("select#usertype").bind("change",function() {
	 	if (jQuery(this).val() == "Arbitrator") {
			jQuery("#formData").load("Arbitrator.html")
         }

          else if(jQuery(this).val() == "agents"){
			jQuery("#formData").load("agent.html")
          }
       })
	 /*=========Footer menu toggle on phone==========*/
	 jQuery('.toggle-btn').click(function(){
			$(this).next('.footerlinkWrap').slideToggle();
			$(this).find('i').toggleClass('fa-minus');
		});

	 /*=========smooth scrolling==========*/
	 jQuery('a[href*="#"]:not([href="#"])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = jQuery(this.hash);
	      target = target.length ? target : jQuery('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        jQuery('html, body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	  });

	 /*=========smooth scrolling==========*/
	 jQuery('.experts-form-open').click(function(){
			$('.experts-form-outer').slideToggle();
		});

});
jQuery(window).load(function(){
	syncHeight();
});

//var myCenter=new google.maps.LatLng(26.783886, 75.840901);
//            function initialize()
//            {
//                var mapProp = {
//                	center:myCenter,
//               		scrollwheel: false,
//                	zoom:15,
//                	mapTypeId:google.maps.MapTypeId.ROADMAP
//                };
//                var map=new google.maps.Map(document.getElementById("hasmap"),mapProp);
//                var marker=new google.maps.Marker({
//	                position:myCenter,
//	                animation:google.maps.Animation.BOUNCE,
//	               	icon:'/front/assets/img/map-marker.png',
//	                map: map,
//                });
//                var styles = [
//					{
//						stylers: [
//							{ hue: "#c5c5c5" },
//							{ saturation: -100 }
//						]
//					},
//                ];
//                map.setOptions({styles: styles});
//                marker.setMap(map);
//            }
//            google.maps.event.addDomListener(window, 'load', initialize);
