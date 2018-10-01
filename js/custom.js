$(document).ready(function(){
  $('.showBtn').click(function(){
    $('.grid_last').show();
  });
});


 /*------------------------------------------*/
  /*          /*. page scroll /*
  /*------------------------------------------*/
//Run function when document ready
  $(document).ready(function ()
  {
    init_pagescroll();
  });

  function init_pagescroll()
  {
    $('a.page-scroll').on('click', function (e)
    {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname)
      {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length)
        {
          $('html,body').animate(
          {
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  }

// GO TO TOP
$(window).scroll(function () {
	if ($(this).scrollTop() > 100) {
		$('.scrollup').fadeIn();
	} else {
		$('.scrollup').fadeOut();
	}
});

$('.scrollup').click(function () {
	$("html, body").animate({
		scrollTop: 0
	}, 600);
	return false;
});



// Curve Text
  var $headline = $('#headline').hide();
       $headline.show().arctext({radius: 1600});

      var $headline1 = $('#headline1').hide();
       $headline1.show().arctext({radius: 1600});
// End TExt



var items = 30;
 
for (var i=0; i<=items; i++) {
    var moveVal = Math.ceil( Math.random()*50 );
    var posVal = Math.ceil( Math.random()*50 );
    var scaleVal = Math.ceil( Math.random()*10 );
    var shakeVal = Math.ceil( Math.random()*5 );
    $(".field").append('<div class="move'+moveVal+' pos'+posVal+'"><div class="scale'+scaleVal+'"><div class="item shake'+shakeVal+'"></div></div>');
}