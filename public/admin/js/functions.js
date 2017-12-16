//function adjustHeight(){
		//var sidebarHeight = $('.sidebar-menu').outerHeight();
		//$('.content-wrapper').css({'min-height' : sidebarHeight + 'px'});
//}



$(document).ready(function (e) {
   $('aside.main-sidebar').css('padding-top', $('header.main-header').height());

//   $('.content-wrapper').css('height', $('aside').height());

	$('select').on('select2:open', function(e) {
		$('.select2-search input').prop('focus',false);
	});
	//adjustHeight();
});


//$('.treeview').on('click', function(){

	//setTimeout(function(){
		//adjustHeight();
	//},550);

//});

(function($) {
   $.fn.fixMe = function() {
      return this.each(function() {
         var $this = $(this),
            $t_fixed;
         function init() {
            $this.wrap('<div class="ftb-container" />');
            $t_fixed = $this.clone();
            $t_fixed.find("tbody").remove().end().addClass("fixed").insertBefore($this);
            resizeFixed();
         }
         function resizeFixed() {
            $t_fixed.find("th").each(function(index) {
               $(this).css("width",$this.find("th").eq(index).outerWidth()+"px");
            });
         }
         function scrollFixed() {
            var offset = $(this).scrollTop(),
            tableOffsetTop = $this.offset().top,
            tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead").height();
            if(offset < tableOffsetTop || offset > tableOffsetBottom)
               $t_fixed.hide();
            else if(offset >= tableOffsetTop && offset <= tableOffsetBottom && $t_fixed.is(":hidden"))
               $t_fixed.show();
         }
         $('.box-body').resize(resizeFixed);
         $('.box-body').scroll(scrollFixed);
         init();
      });
   };
})(jQuery);

$(document).ready(function(){
   $("#fd-tbl").fixMe();
   $(".up").click(function() {
      $('.full-tbl').animate({ 'scrollTop': '0'}, 2000);
 });
});
