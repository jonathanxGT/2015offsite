var currentSlide = 0, $slides, winHeight, scroller;
( function( $ ) {

  /////////////////////////////
  ///////// FUNCTIONS /////////
  /////////////////////////////

  var toggleNav = function(){
    if(scroller.getScrollTop() == 0){
      $('.previous').fadeOut();
    }else{
      $('.previous').fadeIn();
    }

    if(scroller.getScrollTop() >= $('body').height() - winHeight){
      $('.next').fadeOut();
    }else{
      $('.next').fadeIn();
    }
  }

  var getStopForSlide = function(slide){
    var anchor = slide.find('.anchor');
    //grabs anchor position?
    return (anchor.length > 0) ? anchor : slide;
  }

  var getClosestStop = function(){
    var closestElement, 
        closestDistance, 
        signedDistance,
        distance;

    $slides.each(function(i, e){
      var $stop = getStopForSlide($(e));
      distance = $stop.offset().top - scroller.getScrollTop();
      var thisDistance = Math.abs( distance );
      if((typeof closestDistance === 'undefined') || (closestDistance > thisDistance)){
        closestElement = $stop;
        closestDistance = thisDistance;
        signedDistance = distance;
      }
    });
    return {element:closestElement, distance:signedDistance};
  }

  var navigateToNearestSlide = function(direction){
    var closestStop = getClosestStop(),
        targetStop,
        slide,
        adjacentSlide,
        top;
     
    $('.previous, .next').stop().hide();
    scroller.stopAnimateTo();

    slide = closestStop.element.hasClass('anchor') ? closestStop.element.parents('.slide') : closestStop.element;
    adjacentSlide = slide[direction].call(slide, '.slide');

    if(direction == 'prev' && closestStop.distance >= 0 && adjacentSlide.length > 0){
      targetStop = getStopForSlide(slide.prev('.slide'));
    }else if(direction == 'next' && closestStop.distance <= 0 && adjacentSlide.length > 0){
      targetStop = getStopForSlide(slide.next('.slide'));
    }else{
      targetStop = closestStop.element;
    }

    top = targetStop.offset().top;
    scroller.animateTo(top, {duration:Math.abs(top - scroller.getScrollTop()) + 1500, easing:'swing'})
  };

  //////////////////////////////////
  ///////// EVENT HANDLERS /////////
  //////////////////////////////////

  $('body').imagesLoaded(function(){

    ///////// SKROLLR SETUP /////////

    // hide loading animation and init skrollr
    scroller = skrollr.init({
      forceHeight: false,
        render: function(data) {
        }
    });

    $slides =  $('.slide')
    
    // Get window size
    winHeight = $(window).height();
    
    // Keep minimum height 550
    if(winHeight <= 550) {
      winHeight = 550;
    } 
    
    // Resize our slides
    // Scale is a multiplier. 
    // If the desired slide height is twice that of the window, 
    // scale should be set to 2.
    
    $slides.each(function(i, slide){
      var $slide = $(slide);
       scale = $slide.data('scale');
      if(typeof scale === 'undefined'){
        scale = 1
      }
      $slide.height(winHeight * scale);
    })
    
    // Refresh Skrollr after resizing our sections
    scroller.refresh($slides);


    //////// NAV ////////

    $('.next').click(function(){
      navigateToNearestSlide('next');
    });

    $('.previous').click(function(){
      navigateToNearestSlide('prev');
    });

    $(window).scroll(function(){
      // TODO: consider setting a timeout so this doesn't run on every scroll event
      if(Math.abs(getClosestStop().distance) < 80){
        $('.previous, .next').stop().fadeIn(700);
      }else{
        $('.previous, .next').stop().fadeOut(5);
      }
    });

  });


} )( jQuery );