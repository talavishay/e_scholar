jQuery(document).ready(function(){

    
jQuery("#edit-actions").append(jQuery(".form-item.form-type-checkbox.form-item-status"));

Drupal.settings.url = jQuery("#edit-biblio-url").val();
Drupal.settings.openurl = function(type){
    Drupal.settings.url = jQuery("#edit-biblio-url").val();
    
    if(     Drupal.settings.url.substr(0,4) === "http" ){
        if(type === "tab"){
            window.open( Drupal.settings.url ,'_blank');            
        } else {
            var width = window.outerWidth / 2; 
            var height = window.outerHeight ; 
            var sX = screen.width - width ;    
            window.open(Drupal.settings.url ,"mywin","width="+width+",height="+height+",screenX="+sX+",right=50,screenY=50,top=0,scrollbars=1");
        }
    }
};

jQuery("#edit-biblio-url").bind("blur", Drupal.settings.openurl).bind("change", function(e){
        Drupal.settings.url = jQuery(e.currentTarget).val();
    });

jQuery("a#url_action").unbind();
jQuery("a#url_action").not('#copy_coustom1_to_title').bind("click", function(e){
    e.preventDefault();
    Drupal.settings.openurl("tab");
    return false;
});
jQuery("a#url_action_pop").unbind();
jQuery("a#url_action_pop").not('#copy_coustom1_to_title').bind("click", function(e){
    e.preventDefault();
    Drupal.settings.openurl("popup");
    return false;
});

if(typeof Drupal.settings.url !== "undefined"){
    Drupal.settings.openurl();
    
}
jQuery(".form-item.form-type-select.form-item-biblio-type").before(jQuery('<div id="term_content"></div>').append(jQuery("#edit-field-commerce, .field-type-taxonomy-term-reference")));



// make the "title" multiline by using a fake texarea sync'd to the original "title" field...
var title = jQuery('<textarea id="edit-title-copy" style="width:100%"></textarea>').bind("keydown blur focus change", function(e){
                    jQuery('#edit-title').val(jQuery(e.currentTarget).val());
            }).val(jQuery('#edit-title').val());
jQuery('#edit-title').after(title).css("display","none");
jQuery('div.form-item.form-type-textarea.form-item-biblio-custom1-value').before(jQuery('<a href="#" id="copy_coustom1_to_title" style="float: right">copy Title to Custom1</a>').click(function(e){
					e.preventDefault();
					//~ console.log(e);
				jQuery('#edit-biblio-custom1-value').text(jQuery('#edit-title-copy').val());
					return false;
				}));

jQuery("#edit-submit").bind("submit", function(){
    jQuery('#edit-title-copy').remove();
});
jQuery('#edit-container-1 .fieldset-wrapper').prepend(jQuery(".form-item-biblio-url"));
jQuery('#edit-biblio-custom1-value').addClass("heb");


});
