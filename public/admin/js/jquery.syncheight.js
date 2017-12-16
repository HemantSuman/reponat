/* syncheight-mp - v1.5.0
* https://github.com/mpneuried/syncheight-mp
* Copyright (c) 2015 mpneuried;
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html */
(function(e){var t=function(){var e=0,t=[["min-height","0px"],["height","1%"]],n=/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase())||[],i=n[1]||"",h=n[2]||"0";return"msie"===i&&7>h&&(e=1),{name:t[e][0],autoheightVal:t[e][1]}};e.getSyncedHeight=function(n){var i=0,h=t();return e(n).each(function(){e(this).css(h.name,h.autoheightVal);var t=parseInt(e(this).css("height"),10);t>i&&(i=t)}),Math.ceil(i+1)},e.fn.syncHeight=function(n){var i={updateOnResize:!1,height:!1},h=e.extend(i,n),s=this,c=0,a=t().name;return c="number"==typeof h.height?h.height:e.getSyncedHeight(this),e(this).each(function(){e(this).css(a,c+"px")}),h.updateOnResize===!0&&e(window).bind("resize.syncHeight",function(){e(s).syncHeight()}),this},e.fn.unSyncHeight=function(){e(window).unbind("resize.syncHeight");var n=t().name;e(this).each(function(){e(this).css(n,"")})}})(jQuery);