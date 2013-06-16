Drupal.avishay.webform = function(e, form){
    var settings = {"content": form  ,"title" : "", "height" : 600, "width"	:800, "animate" : false};
    Drupal.avishay.shadowbox(settings);
};
Drupal.avishay.refresh_results = function(view){
    if(typeof(Drupal.settings.pager_total) !== "undefined" ){
        // align pager to left 
        if(jQuery('.view-search-api-solr .pager .pager-prev').length === 0){
                jQuery('.view-search-api-solr-view .pager ').css("text-align", "left");
        }
        if(jQuery('.view-search-api-solr .pager .pager-next').length === 0){
                jQuery('.view-search-api-solr-view .pager').css("text-align", "right");
        }
        // adding a total pages to the pager
        jQuery('.view-search-api-solr .pager .pager-next').once().before(jQuery('<li class="counter">מתוך <span>'+Drupal.settings.pager_total+'</span></li>'));
    }
    var mainView = jQuery(view).parents(".view");
    jQuery(".views-row", view).each(function(i, row){
        Drupal.avishay.link_setup_get_productName(jQuery('.buy_url:not(.ajax-processed)', row));
        Drupal.avishay.link_setup_get_productName(jQuery('.buy_export:not(.ajax-processed)', row));    
         // adding a picture to represent the biblio type       
        if(!jQuery(".type_image", row ).length){
            var field_type = jQuery(".views-field-biblio-type .field-content", row);
            jQuery.each( Drupal.avishay.biblio_types , function(name, value) {
                if(value === jQuery(field_type).text()){
                    jQuery(".title_wrap", row).after(jQuery('<div class="type_image"></div>').addClass(name));
                    if(name === "journal"){
                        var journal = jQuery(".views-field-biblio-secondary-title", row);
                        var journal_name = jQuery(journal).text().trim();
                        var link = window.location.hostname+window.location.pathname+"?&f[91]=biblio_secondary_title:"+journal_name ;
                        var journal_filter = jQuery('<div class="journal_filter"><a title="'+journal_name+'" href="http://'+link+'">'+journal_name.substr(0,45)+'...</a></div>');
                        jQuery(field_type).append(journal_filter);
                    }

                }
            });
        };
        // DISAPLY MODE
        if(typeof(Drupal.settings.display_mode) !== "undefined"){
            if(Drupal.settings.display_mode === "min"){
                jQuery('#display_mode #min').click();
            }
        }
        // Adding a price to the urllink
        if(typeof(Drupal.settings.url_price) !== "undefined"){
          var price = Drupal.settings.url_price.replace(/.00/i," ").trim();
          jQuery(".buy_url:not(.priceFix)", row).append('<span class="price">'+price+'</span>' ).addClass("priceFix");
        }
        // Adding a price to the export link
        if(typeof(Drupal.settings.citaion_price) !== "undefined"){
          var price = Drupal.settings.citaion_price.replace(/.00/i," ").trim();
          jQuery(".buy_export:not(.priceFix)", row).append('<span class="price">'+price+'</span>' ).addClass("priceFix");;
        }
        // keywords link
        jQuery('.views-field-biblio-keywords .field-content', row).each(function(i, val){
            var keys =    jQuery(val).text().split(",");
            jQuery(val).text("");
            var keywords = "";
            jQuery.each(keys, function(ii, vv){

                                //vv = jQuery(vv).trim();

                                var link = window.location.hostname+window.location.pathname+"?f[90]=biblio_keywords:"+vv.trim();
                                jQuery(val).append(jQuery('<a href="http://'+link+'">'+vv+'</a><span>, </span>'));
                            });
            jQuery("span", val).last().remove();
        });
        // wrap title & year in a div
    });
    Drupal.avishay.incart();
    Drupal.avishay.cartLinks();
//    Drupal.avishay.bookmark_state_checkbox_toggle();
     
     Drupal.settings.display_mode = jQuery.cookie("display_mode");
    if(Drupal.settings.display_mode === "min"){
            jQuery('#display_mode #min').click();
    }
    jQuery.each(Drupal.settings.bookmarks  , function(i,nid){
            jQuery('.flag-bookmarks-' + nid).each(function(i, val){
                    var flag_wrap = jQuery(val).parents(".view-field-bookmark");
                    var flag = jQuery("a.flag", flag_wrap).addClass("unflag-action flagged").removeClass("unflagged flag-action");
                    jQuery("input", flag_wrap).attr("checked","checked");
        });
    });
};

jQuery(document).ready(function(){
if(typeof(Drupal.ajax) !== "undefined"){
    Drupal.ajax.prototype.commands.after_cart_refresh  = function (ajax, response, status){
        Drupal.avishay.incart();
        Drupal.avishay.cartLinks();  
    };
};
//Drupal.avishay.link_setup_get_productName(jQuery('.buy_url[id]:not(.ajax-processed)'));
//Drupal.avishay.link_setup_get_productName(jQuery('.buy_export[id]:not(.ajax-processed)'));
// ##  webform --  מצאתי שגיאה 
jQuery("#block-webform-client-block-456 .block-inner").prepend(jQuery('<span id="close">סגור</span>'));
jQuery("#close").live("click", function(e){
   window.location.reload() ;
//    jQuery("#block-webform-client-block-456").hide();
});
jQuery(".view-search-api-solr .webform").live("click", function(e){
    e.preventDefault();
    var row = jQuery(e.currentTarget).parents(".views-row");
    var details = jQuery(".title_wrap", row).text().trim();
    var nid = jQuery(".mlt_action", row).attr("nid");

    jQuery("#edit-submitted-details").val(details );
    jQuery("#edit-submitted-user").val(Drupal.settings.username );
    jQuery("input#edit-submitted-link").val(nid);
    jQuery("#block-webform-client-block-456").show();
    return false;
});

// ####  collapse unused block-facetapi
jQuery('.block-facetapi').each(function(i,block){
    if(   jQuery("input[type=checkbox]:checked",block).length === 0 ){
        jQuery(".block-title:not(.collapsiblockCollapsed)", block).click();
    }
});
// ####     cart popup -- toaster    
jQuery("#toaster-remove").live("click", function(){
    jQuery('#cart-toaster').css("display","block").animate({"opacity":"0","top":0}, 500,function(){
            jQuery('#cart-toaster').css("display","none");
    });
});
//  ####     DISPLAY MOED


//  ### add to cart message popup
jQuery('#region-preface-third .region-inner').append(jQuery('<div id="cart-toaster"><div id="toaster"><div id="toaster-header"><h5>העגלה עודכנה</h5><a id="toaster-remove"></a><div class="cl"></div></div><div id="toaster-content"><div id="current_msg"></div><a href="/checkout">לקופה</a></div></div></div>'));

var bottom_login = jQuery('#user-login-form').clone();

//jQuery("#shopping-cart", bottom_login).remove();
var bottom_login_menu = jQuery("ul", bottom_login).clone();
jQuery("ul", bottom_login).remove();
jQuery("#block-login-toggle",  bottom_login_menu ).bind("click", function(){
    jQuery("#region-preface-third form").toggle();

});
jQuery('body.not-logged-in #region-preface-third .region-inner').prepend(jQuery('<div class="login"></div>').append(bottom_login_menu).append(bottom_login));
//  ##  hide cart block 
//jQuery('#block-commerce-cart-cart .content .cart-empty-block, #block-commerce-cart-cart .view-content,#block-views-flag-bookmarks-block-2 .view-empty').css("cursor","pointer").bind("click", function(e){    
//    
////    jQuery(".block-title",jQuery(e.currentTarget).parents('.block')).click();
//});




// FACETAPI BLOCKS - region title
jQuery('.region-inner.region-sidebar-first-inner').prepend(jQuery('<div title="חיפוש מתקדם" id="advanced_search_title"><h2>חיפוש מתקדם:</h2></div>'));

// more like this 
jQuery('a.close_mlt').live("click", function(e){
        e.preventDefault();
        jQuery( ".mlt_arrow",jQuery(e.currentTarget).parent()).remove();
        //var nid = jQuery(e.currentTarget).attr("nid");
        //jQuery('#mlt_'+nid).remove();
        var views_row = jQuery(e.currentTarget).parents(".views-row");    
        jQuery(".mlt_wrap,.mlt_arrow", views_row).css("overflow","hidden").hide(500, function () {
//                                jQuery(".mlt_arrow",views_row).remove();
        });
        jQuery(e.currentTarget).text("מאמרים דומים").removeClass("close_mlt loading").addClass("show_mlt");
        return false;
});

jQuery('a.show_mlt').live("click", function(e){
    e.preventDefault();
    jQuery(e.currentTarget).text("טוען מאמרים דומים").removeClass("show_mlt").addClass("close_mlt loading");
    var mlt_cart_block = jQuery(e.currentTarget).parents("#block-commerce-cart-cart").length;
    var mlt_cart_page = jQuery(e.currentTarget).parents(".view-commerce-cart-form").length;
    var mlt_search_page = jQuery(e.currentTarget).parents(".view-search-api-solr").length;
    var nid = jQuery(e.currentTarget).attr("nid").trim();
    var mlt_box = jQuery('<div class="mlt_wrap" id="mlt_'+nid+'" ></div>');
    var url = 'http://scholare.co.il:8080/solr/scholare/mlt?q=item_id:'+nid+'&mlt.mindf=1&mlt.mintf=1&fl=*&wt=json&json.wrf=?';
//    var url = 'http://'+window.location.hostname+':8080/solr/scholare/mlt?q=item_id:'+nid+'&mlt.fl=id,t_title&mlt.mindf=1&mlt.mintf=1&fl=*&wt=json&json.wrf=?';
    
    if(!mlt_cart_page){ url = url + '&rows=5';  }else{  url = url + '&rows=2';}
   
    var originalRow = jQuery(Drupal.avishay.row);
    jQuery.getJSON(url, function(json) {
    if(json.response.numFound === 0){
            jQuery(originalRow).addClass("no_mlt mlt").css("background", "rgba(255,0,0,0.1)");
            jQuery(e.currentTarget).html('<span> אין תוצאות דומות למאמר זה </span>').removeClass("loading");

    } else { 
        jQuery(json.response.docs).each(function(i, val){
            // remove  ":" from objects name 
            jQuery.each(val, function(name, value){
                var reg = /:/i;
                if(name.match(reg)){             

                newname = name.replace(reg, "");
                val[newname] = value;
                //val[name].delete;
             }
            });
            var keywords = "", sep = ', ';

            //make sure we have our title field and genrate a new row for the item
            if(typeof(val.tm_biblio_custom1) !== "undefined"){
                var mltRow = jQuery(originalRow).clone().css({"direction" : "rtl"}).addClass("mlt");
                // BIBLIO CUSTOM1
                jQuery(".views-field-biblio-custom1 .field-content", mltRow).text( val.tm_biblio_custom1[0] );	
                // TYPE
                 jQuery(".views-field-biblio-type .field-content", mltRow).text( val.ss_biblio_type) ;	
                // YEAR
                jQuery(".views-field-biblio-year .field-content", mltRow).text( val.is_biblio_year) ;	
                // RESEARCH field
                jQuery(val.sm_field_biblio_researchname).each(function(i,keyword){        
                    if(jQuery(val.sm_field_biblio_researchname).length === i+1  ){
                        keywords = keywords + keyword ;
                    }else {
                        keywords = keywords+ keyword + sep; 		
                    }
                });
                if(keywords !== ""){
                        jQuery(".views-field-field-biblio-research .field-content", mltRow).text(keywords );	
                }
                // catalog TYPE -- qualitive /quantitive
                keywords = "";
                    // qualitivename
                jQuery(val.sm_field_biblio_qualitivename).each(function(i,keyword){        

                if(jQuery(val.sm_field_biblio_qualitivename).length === i+1  ){
                                keywords = keywords + keyword ;

                        }else {
                                keywords = keywords+ keyword + sep; 		
                        }
                });
                if(keywords !== ""){
                        jQuery(".views-field-field-biblio-qualitive .field-content .field-content", mltRow).text("איכותני ("+keywords+")" );	
                } else {
                     jQuery(".views-field-field-biblio-qualitive", mltRow).remove();
                }
                keywords = "";
                    // quantitative:name
                jQuery(val.sm_field_biblio_quantitativename).each(function(i,keyword){        

                if(jQuery(val.sm_field_biblio_quantitativename).length === i+1  ){
                                keywords = keywords + keyword ;
                        }else {
                                keywords = keywords+ keyword + sep; 		
                        }
                });
                if(keywords !== ""){
                        jQuery(".views-field-field-biblio-quantitative .field-content .field-content", mltRow).text("כמותני ("+keywords+")" );	
                } else {
                     jQuery(".views-field-field-biblio-qualitive", mltRow).remove();
                }
                // KEYWORDS
                keywords = "";
                jQuery(val.sm_biblio_keywords).each(function(i,keyword){
                        if(jQuery(val.sm_biblio_keywords).length === i+1){
                                keywords = keywords + keyword ;
                        }else {
                                keywords = keywords+ keyword + sep; 		
                        }
                });
                jQuery(".views-field-biblio-keywords .field-content", mltRow).text( keywords );	

                // COMMERCE
                if(	parseInt(val.im_field_commerce) === 1 ) {
                        jQuery(".views-field-field-commerce .field-content a", mltRow).attr({
                                                                "class":	"nid_"+val.is_nid+" buy_url",
                                                                "product":	"buy_url",
                                                                "nid":		val.is_nid, 
                                                                "id":		"buy_url_"+val.is_nid,
                                                                "href":		"#"}).text("רכוש קישור").removeClass("ajax-processed");
                } else {
                        jQuery(".views-field-field-commerce .field-content a", mltRow).attr({
                                "href":	"/free/url/" + val.is_nid,
                                "id":		"nid_" + val.is_nid,
                                "class":"free"
                                }).text("קרא בחינם").removeClass("ajax-processed");
                }
                if( mlt_search_page ){
                    jQuery(e.currentTarget).not(".mlt").addClass("mlt").removeClass("loading").text("סגור מאמרים דומים").after(jQuery('<div class="mlt_arrow"></div>'));
                }
                jQuery(mlt_box).append(mltRow);
//               var refreshTimer = window.setTimeout(function(){
                Drupal.avishay.refresh_results(mlt_box);  
//               }, 100);
            }	
    });
    
    if(mlt_search_page ){
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_url[id]:not(.ajax-processed)', mlt_box));		
            jQuery(e.currentTarget).parents('.views-row').append(mlt_box);		
            jQuery('html, body').animate({
                scrollTop: jQuery(mlt_box).offset().top-40
            }, 1000);
            if(typeof(Drupal.settings.display_mode) !== "undefined"){
                if(Drupal.settings.display_mode === "min"){
                        jQuery('#display_mode #min').click();
                }
            }
            var offset = jQuery(mlt_box).offset();
    } else {
            var settings = {"content": jQuery(mlt_box).css("background-color", "#fff").html()  ,"title" : "", "height" : 450, "width"	:650, "animate" : false};
            Drupal.avishay.shadowbox(settings);
    }
    }
    });
    
    return false;
});

        


// ####    on BACK btn BUG FIX
//jQuery('<div id="cart_refresh" style="display:none;"></div>').addClass('ajax-processed').each(function (i,val) {
//    var element_settings = {};
//    var base = jQuery(this).attr('id');
//    element_settings.url = '/get_cart'; //jQuery(this).attr('id');
//    element_settings.event = 'click';
//    element_settings.progress = { 'type': 'throbber' };
//    mltelement_settings.submit = { "js": true, "xx":Array(), "uid": Drupal.settings.uid };      // ::::: Here we add a query parameter.
//
//    var ajax = new Drupal.ajax(base, this, element_settings);
//    ajax.beforeSerialize =  function (response, status) {
//
//    };
//                ajax.success = fu
//		Drupal.ajax[base] = ajax;
//}).click();
//
//jQuery.ajax({
//url: "/get_cart",
//cache: false
//}).done(function( html ) {
//$("#results").append(html);
//});
// ie fixes..
jQuery(".block-commerce-cart h2").css("float","none");
});
