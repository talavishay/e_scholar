(function ($) {

  // Adjust the overlay dimensions.
  Drupal.behaviors.myModule = {
   
    attach: function (context) {
      $('#overlay:not(.mymodule-adjusted)', context).each(function() {
        var $test = $(this).find('.node-type-test');
       
        if ($test.length){
          // adjust the overlay
          $(this).css({
            'width'     : '450px',
            'min-width' : '450px'
          });
           
          $('.add-or-remove-shortcuts', this).hide();  // hide "add short-cut" button
          $('#branding', this).hide();  // hide branding container
        } 
      }).addClass('mymodule-adjusted');
    }
   
  };

})(jQuery);
