jQuery(document).ready(function () {
    jQuery("#block-views-exp-editor-page h2").removeClass("element-invisible");

    jQuery(".views-field-field-commerce-bibilio-nid-1").live("mouseup", function(e){			
             var txt = jQuery(e.currentTarget).text().trim();			
             jQuery("#edit-nid").val(txt).trigger("keyup");	
    }); 
    jQuery(".views-field-line-item-label").live("mouseup", function(e){			
             var txt = jQuery(e.currentTarget).text().trim().replace(/\((.*)\)/,'$1');			
             jQuery("#edit-line-item-label").val(txt).trigger("keyup");	
             jQuery("#edit-submit-orders-stats").click();
    }); 
});
