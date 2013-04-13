if(typeof(Drupal.ajax) !== "undefined"){
    Drupal.ajax.prototype.commands.after_cart_refresh  = function (ajax, response, status){
                    Drupal.avishay.incart();
                    Drupal.avishay.cartLinks();
    
    };
};
Drupal.avishay.link_setup_get_productName = function(context){	
    jQuery( context).addClass('ajax-processed').each(function (i,val) {
		
		var element_settings = {};
		var base = jQuery(val).attr('id');
		//~ var productName =  jQuery(val).attr('product');
		var productName =  "buy_url";
		// Clicked links look better with the throbber than the progress bar.      
		element_settings.url = '/' + productName + '/'; //jQuery(this).attr('id');
		element_settings.event = 'click';
		element_settings.submit = { "js": true, 
                                            "uid": Drupal.settings.uid, 
                                            "productName" : productName , 
                                            "nid": jQuery(val).attr("nid") };      // ::::: Here we add a query parameter.
		var ajax = new Drupal.ajax(base, val, element_settings);
		Drupal.ajax[base] = ajax;
    });
};
Drupal.avishay.link_setup_get_export = function(context){
	jQuery('a#bookmarkActionSubmit', context).each(function(i,val) {
		var element_settings = {};
		var base = jQuery(this).attr('id');
		element_settings.url = '/get_export'; //jQuery(this).attr('id');
		element_settings.event = 'click';
		element_settings.progress = { 'type': 'throbber' };
		element_settings.submit = { "js": true,  "uid": Drupal.settings.uid };      // ::::: Here we add a query parameter.
		
		var ajax = new Drupal.ajax(base, this, element_settings);
		ajax.beforeSerialize =  function (response, status) {
			var target = '';
			var len = jQuery('table tr.get_export input:checked').length;
			jQuery('table tr.get_export .bookmarkAction:checked:not(.all)').each(function(i, val){
				var nid = jQuery(val).parent().parent().attr("nid");
				var classs = String(jQuery(val).parent().parent().attr("class"));
				if(typeof(nid) === "undefined" && classs != ""){
					nid = parseInt(classs.replace(/(.*)nid-(\d*)-nid(.*)/g, "$2"));
				}
				if(i === len-1){
					target += nid;
				}	else{
					target += nid+'+';
				}
			});
			var style = jQuery('select#style option:selected').val();
			this.submit.nid = target;
			this.submit.style = style;
		};
		Drupal.ajax[base] = ajax;
	}).addClass('ajax-processed');
};
Drupal.avishay.link_setup_get_checkout = function(context){
	jQuery(context).addClass('ajax-processed').each(function (i,val) {
		var element_settings = {};
		var base = jQuery(this).attr('id');
		element_settings.url = '/get_checkout'; //jQuery(this).attr('id');
		element_settings.event = 'click';
		element_settings.progress = { 'type': 'throbber' };
		element_settings.submit = { "js": true, "xx":Array(), "uid": Drupal.settings.uid };      // ::::: Here we add a query parameter.
		
		var ajax = new Drupal.ajax(base, this, element_settings);
		//~ ajax.old_beforeSend = ajax.beforeSend;
		
		ajax.beforeSerialize =  function (response, status) {
			
		}
		Drupal.ajax[base] = ajax;
	});
};
Drupal.avishay.free_url = function(){
	/*	if the commerce link has a "free_url" class
	 * mark the view row as a free product
	 */
	jQuery('.views-field-field-commerce a.free_url').each(function(i,val){
		// fields style -- search-api-solr-view - view format = fields
		var views_row = jQuery(val).parents(".views-row");
		if(views_row.length != 0){
    		jQuery(views_row).addClass("free_url");
		}
		// table style -- my bookmark block - view format = table
		var table_row = jQuery(val).parents("tr");
		if(table_row.length != 0){
			jQuery(table_row).addClass("free_url");
		}
	});
}
Drupal.avishay.combineActionFields = function(){
	jQuery(".view-search-api-solr-view .views-row:not(.combineActionFields)").each(function(i,val){
		var div = jQuery('<div></div>').addClass("actions");
		jQuery(div).append(jQuery('.views-field.views-field-nid',val));                
		jQuery(div).append(jQuery('.views-field.views-field-field-commerce', val));
		jQuery(div).append(jQuery('.show_mlt_wrap', val));                
		jQuery(val).append(div).addClass('combineActionFields');
	});
};
Drupal.avishay.incart = function(){
		//  reset links in case  we are running after a cart refresh...
	jQuery('a.cart_export,a.url_export').each(function(i,val){
		if(jQuery(val).hasClass('cart_export')){
			jQuery(val).removeClass('cart_export').addClass('buy_export').text('רכוש ביבליו');
		}
		if(jQuery(val).hasClass('cart_url')){
			jQuery(val).removeClass('cart_url').addClass('buy_url').text('רכוש קישור');
		}
	});
	jQuery('.view-commerce-cart-form td.views-field-field-commerce-bibilio-nid, .view-flag-bookmarks.view-display-id-page_1 .views-field-field-commerce-bibilio-nid, #block-commerce-cart-cart td.views-field-field-commerce-bibilio-nid').each(function(i,val){

		var context =   jQuery(val).parent(); // tr
		var classs = jQuery( context).attr("class");
		productName = "";
		var nid = classs.replace(/(.*)nid-(\d*)-nid(.*)/i,"$2");
		var exportLink = jQuery('a.buy_export.nid_'+nid);
		var exportLinkRow = jQuery(exportLink).parent().parent();
		var urlLink = jQuery('a.buy_url.nid_'+nid);
		var urlLinkRow = jQuery(urlLink).parent().parent();
                jQuery(exportLink).text('בעגלה').addClass('cart_export').removeClass("buy_export");
                jQuery(exportLinkRow).addClass('cart_export').removeClass('buy_export').attr("cart_export",productName).attr("nid",nid);
                jQuery(urlLink).text('בעגלה').addClass('cart_url').removeClass('buy_url').unbind("click");
                jQuery(urlLinkRow).addClass('cart_url').removeClass('buy_url').attr("url_export",productName).attr("nid",nid);
	});
        //  TRANSLATION --  items
        jQuery('.view-commerce-cart-block .line-item-quantity-label').text("פריטים");
};
Drupal.avishay.cartLinks = function(context){
	var links = jQuery("a.cart_url,a.cart_export").unbind("click");
	jQuery(links).bind("click.cart", function(e){
		e.preventDefault();
		var text =  'המוצר כבר נמצא בעגלה..  להשלמת הרכישה וקבלת הקישור ';
		text = text+' <a id="checkoutNow" href="/checkout">לחץ כאן</a>';
		var settings = {"content":text ,"title" : "", "height" : 350, "width"	:350, "animate" : false};
		Drupal.avishay.shadowbox(settings);
		
		jQuery(e.currentTarget).addClass('disabled').unbind("click.cart");
		return false;
	});
}
Drupal.avishay.bookmarkFlag = function(context){
	jQuery('.flag_wrap input', context).each(function(i, val){
		var a = jQuery('a', jQuery(val).parent());
		if(jQuery(a).hasClass("unflag-action")){
				jQuery(val).attr("checked","checked");
		}
	});	
};
Drupal.avishay.flags = function(){	
	if(typeof Drupal.settings.laxo_biblio_solr === 'object' ){
		jQuery(Drupal.settings.laxo_biblio_solr.biblio_biblio_url_nodes).each(function(i,val){
			var nid = jQuery(val).attr("nid");
			var buy_url = jQuery(".nid_"+nid+".buy_url").attr({"href":val.url}).removeClass('buy_url').addClass('get_url').text("קבל קישור");
			if(val.url === ""){
				jQuery(".nid_"+nid+".buy_url").addClass('empty').text("קישור חסר!?");
			}
			var views_row = jQuery(buy_url).parents(".views-row");
			if(views_row.length !== 0){
				jQuery(views_row).removeClass('buy_url').addClass('get_url');
			}
			// table style -- my bookmark block - view format = table
			var table_row = jQuery(val).parents("tr").attr("nid", nid);
			if(table_row.length != 0){
				jQuery(table_row).removeClass('buy_url').addClass('get_url');
			}
		});
		jQuery(Drupal.settings.laxo_biblio_solr.biblio_biblio_export_nodes).each(function(i,val){
			//~ jQuery("a.export.nid_"+val.nid).attr("href",val.url)
			var val = jQuery(".nid_"+val.nid+".buy_export").removeClass("buy_export").removeClass("cart_export").addClass('get_export').text('קבל ביבליו');
			var views_row = jQuery(val).parents(".views-row");
			if(views_row.length !== 0){
				jQuery(views_row).removeClass("buy_export").removeClass("cart_export").addClass('get_export');
			}
			// table style -- my bookmark block - view format = table
			var table_row = jQuery(val).parents("tr");
			if(table_row.length !== 0){
				jQuery(table_row).removeClass("buy_export").removeClass("cart_export").addClass('get_export');
			}			//~ console.log(jQuery(".export.nid_"+val.nid));
		});
	}
}
Drupal.avishay.refresh = function(){
    if(typeof(Drupal.settings.pager_total) !== "undefined" && jQuery(".view-search-api-solr-view .fixed").length === 0){
    
    // align pager to left 
    if(jQuery('.view-search-api-solr-view .pager .pager-prev').length === 0){
            jQuery('.view-search-api-solr-view .pager ').css("text-align", "left");
    }
    if(jQuery('.view-search-api-solr-view .pager .pager-next').length === 0){
            jQuery('.view-search-api-solr-view .pager').css("text-align", "right");
    }
    // adding a total pages to the pager
    jQuery('.view-search-api-solr-view .pager .pager-next').once().before(jQuery('<li class="counter">מתוך <span>'+Drupal.settings.pager_total+'</span></li>'));
    //          
    }
     // adding a picture to represent the biblio type   
    var biblio_types = {"journal" : "מאמר מכתב עת","other" : 'שונות', "report" : 'דו"ח ממשלתי', "book" :'ספר' , "paper" : 'אוסף מאמרים לאחר וועידה', "tiza" : 'עבודת תיזה' };
    jQuery('.views-field-biblio-type .field-content').each(function(i, val){
    var field_type = jQuery(val).text();   
    jQuery.each( biblio_types , function(name, value) {
        if(value === field_type){
            jQuery(val).parents(".views-row").prepend(jQuery('<div class="type_image"></div>').addClass(name));
        }
    });

    });
    // DISAPLY MODE
    if(typeof(Drupal.settings.display_mode) !== "undefined"){
    if(Drupal.settings.display_mode === "min"){
        jQuery('#display_mode #min').click();
    }
    }
    // Adding a price to the product link
    if(typeof(Drupal.settings.url_price) !== "undefined"){
    var price =Math.round(Drupal.settings.url_price.replace(/שח/i,""))+" "+"ש\"ח";
    jQuery(".url_price").text(price );
    }
    // keywords link
    jQuery('.views-field-biblio-keywords .field-content').each(function(i, val){
                        var keys =    jQuery(val).text().split(",");
                        jQuery(val).text("");
                        var keywords = "";
                        jQuery.each(keys, function(ii, vv){
                            
                            //vv = jQuery(vv).trim();
                            
                            var link = window.location.hostname+window.location.pathname+"?f[90]=biblio_keywords:"+vv;
                            jQuery(val).append(jQuery('<a href="http://'+link+'">'+vv+'</a><span>, </span>'));
                        });
                    jQuery("span", val).last().remove();
                    });

};
Drupal.ajax.prototype.commands.ajax_buy_response = function (ajax, response, status) {
    	
    		//~ Drupal.avishay.msg(Array(response.data),	jQuery('#header'),	 600);
    		//~ var settings = {"content":response.data ,"title" : "", "height" : 600, "width"	:800, "animate" : false};
			//~ Drupal.avishay.shadowbox(settings);
			Drupal.avishay.incart();
//			var notice = '<div class="notice purr avishaycsspurr" ><div class="notice-body">';
//			notice += response.data;
//			notice += '</div><div class="notice-bottom"></div></div>';
//			jQuery(notice).purr(); 
                        if(typeof(cartTimer) !== "undefined"){
                            jQuery('#cart-toaster').stop(true, true);
                            
                        }
                        
                        jQuery('#cart-toaster').css("display","block");
                        jQuery('#toaster-content #current_msg').html(response.data);
                        var height = jQuery('#toaster').height();
                        
                        var top = (height+12) *-1;
                        jQuery('#cart-toaster').css("display","block").animate({"opacity":"1","top":top,"height":height}, 700);
                        var cartTimer = window.setTimeout(function(){
                            jQuery('#cart-toaster').css("display","block").animate({"opacity":"0","top":0}, 500,function(){
                                jQuery('#cart-toaster').css("display","none");
                            });
                        },5000);
                        


  };
Drupal.ajax.prototype.commands.ajax_buy_response_shadowbox = function (ajax, response, status) {
                    jQuery("#buy_url_" + response.data).replaceWith(jQuery('<a class="cart_url" href="#">בעגלה</a>'));
            };
Drupal.ajax.prototype.commands.ajax_get_export_output = function (ajax, response, status) {
                    var settings = {"content":response.data ,"title" : "", "height" : 600, "width"	:800, "animate" : false};
                    Drupal.avishay.shadowbox(settings);
};
Drupal.behaviors.avishay = {
            attach : function(context, settings ){
                
                    if(typeof(context) === "object"){
                            if(jQuery(context).parent().parent().attr("id") === "block-views-flag-bookmarks-block-2"){
                                    Drupal.avishay.bookmarkAttach(context);
                            } 
                            if(jQuery(context).parents("#block-system-main").length === 1  && jQuery(context).hasClass("view-search-api-solr-view")){
                                    //~ Drupal.avishay.combineActionFields();
                            }
                    } else {
                        Drupal.avishay.bookmarkAttach();
                    }
                    // TODO: make this context releveant
                    if(typeof(Drupal.avishay.flags) !== "undefined"){Drupal.avishay.flags();};

                    Drupal.avishay.incart();
                    Drupal.avishay.cartLinks();
                    Drupal.avishay.free_url();
                    Drupal.avishay.link_setup_get_productName(jQuery('.buy_url[id]:not(.ajax-processed)'));
                    Drupal.avishay.link_setup_get_productName(jQuery('.buy_export[id]:not(.ajax-processed)'));
                    Drupal.avishay.combineActionFields();
                    Drupal.avishay.bookmarkFlag();
                    //var refreshTimer = window.setTimeout(function(){
                                           Drupal.avishay.refresh();  
                                           
//                                   }, 3000);
            }
            
    };
Drupal.avishay.row = '<div class="views-row "><div class="type_image journal"></div><span class="views-field views-field-biblio-custom1"><span class="field-content"></span></span><span id="sep">|</span><span class="views-field views-field-biblio-year"><span class="field-content"></span></span><div class="views-field views-field-field-biblio-research"><span class="views-label views-label-field-biblio-research">תחום: </span><span class="field-content"></span></div><div class="views-field views-field-field-biblio-qualitive">        <span class="field-content">   <span class="views-label views-label-field-biblio-research">שיטת מחקר: </span>    <span class="field-content">איכותני (ניתוח מקרה)</span></span></div><div class="views-field views-field-biblio-type"><span class="views-label views-label-biblio-type">סוג: </span><span class="field-content"></span></div><div class="views-field views-field-biblio-keywords">    <span class="views-label views-label-biblio-keywords">מילות מפתח: </span>    <span class="field-content"></span>  </div><div></div><div class="actions"><div class="views-field views-field-field-commerce">        <span class="field-content"><a href="" id="" class="free">קרא חינם</a></span>  </div><div class="escholar-color-scheme-front-light-blue show_mlt_wrap"><a href="#">מצאתי שגיאה</a></div></div></div>';
jQuery(document).ready(function(){
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

jQuery('#display_mode #min').live("click",  function(e){
   jQuery('.type_image,.views-field-field-biblio-research, .views-field-field-biblio-qualitive, .views-field-biblio-type, .views-field-biblio-keywords, .views-field-field-biblio-quantitative').hide(); 
   Drupal.settings.display_mode = "min";
   
});
jQuery('#display_mode #max').live("click",  function(e){
   jQuery('.type_image,.views-field-field-biblio-research, .views-field-field-biblio-qualitive, .views-field-biblio-type, .views-field-biblio-keywords, .views-field-field-biblio-quantitative').show();  
   Drupal.settings.display_mode = "max";
});

//  ### add to cart message popup
jQuery('#region-preface-third .region-inner').append(jQuery('<div id="cart-toaster"><div id="toaster"><div id="toaster-header"><h5>העגלה עודכנה</h5><a id="toaster-remove"></a><div class="cl"></div></div><div id="toaster-content"><div id="current_msg"></div><a href="/checkout">לקופה</a></div></div></div>'));

var bottom_login = jQuery('#user-login-form').clone();

jQuery("#shopping-cart", bottom_login).remove();
var bottom_login_menu = jQuery("ul", bottom_login).clone();
jQuery("ul", bottom_login).remove();
jQuery("#block-login-toggle",  bottom_login_menu ).bind("click", function(){
    jQuery("#region-preface-third form").toggle();

});
jQuery('body.not-logged-in #region-preface-third .region-inner').prepend(jQuery('<div class="login"></div>').append(bottom_login_menu).append(bottom_login));
jQuery('#block-commerce-cart-cart .content .cart-empty-block, #block-commerce-cart-cart .view-content,#block-views-flag-bookmarks-block-2 .view-empty').css("cursor","pointer").bind("click", function(e){    
    
    jQuery(".block-title",jQuery(e.currentTarget).parents('.block')).click();
});

// FACETAPI BLOCKS - region title
jQuery('.region-inner.region-sidebar-first-inner').prepend(jQuery('<div title="חיפוש מתקדם" id="advanced_search_title"><h2>חיפוש מתקדם:</h2></div>'));

// adding a checkbox indection for the bookmark flags
jQuery('.flag_wrap input:checked').live("click", function(e){
        var a = jQuery('a', jQuery(e.currentTarget).parent());
        if(jQuery(a).hasClass("flag-action")){
                jQuery(a).click();
        } else {
                e.preventDefault();
                return false;
        }
});	
jQuery('.flag_wrap input:not(:checked)').live("click", function(e){
        var a = jQuery('a', jQuery(e.currentTarget).parent());
        if(jQuery(a).hasClass("unflag-action")){
                jQuery(a).click();
        } else {
                e.preventDefault();
                return false;
        }
});
jQuery('a.free_url,a.buy_url,a.get_url').live("mouseup",function(e){
                jQuery(".buy_export", jQuery(e.currentTarget).parent()).show();
});
jQuery('a.empty').unbind("click").die("click").live("click", function(e){
        e.preventDefault();
        return false;
});




// cart more like this 
jQuery('.view-commerce-cart-form td.views-field-field-commerce-bibilio-nid').each(function(i, val){
//        var nid = parseInt(jQuery(val).text());
        var nid = jQuery(val).text();

        var mlt_action = jQuery('<a href="#" nid="'+nid+'" class="show_mlt mlt_action">מאמרים דומים</a>');
        jQuery(val).text("").append(mlt_action);
});

// more like this 
Drupal.avishay.not_cart_page = jQuery('body').hasClass("page-search");//indivation to change change number of resulte for the cart page
jQuery('a.close_mlt').live("click", function(e){
        e.preventDefault();
        jQuery( ".mlt_arrow",jQuery(e.currentTarget).parent()).remove();
        //var nid = jQuery(e.currentTarget).attr("nid");
        //jQuery('#mlt_'+nid).remove();
        jQuery( ".mlt",jQuery(e.currentTarget).parents(".views-row")).css("overflow","hidden").hide(500, function () {
                                                                                        jQuery(this).parent().remove();
                                                                                    });
        jQuery(e.currentTarget).text("מאמרים דומים").removeClass("close_mlt").addClass("show_mlt");
        return false;
});

jQuery('a.show_mlt').live("click", function(e){
    e.preventDefault();
    jQuery(e.currentTarget).text("טוען מאמרים דומים").removeClass("show_mlt").addClass("close_mlt loading").after(jQuery('<div class="mlt_arrow"></div>'));
    var nid = jQuery(e.currentTarget).attr("nid");

    var mlt_box = jQuery('<div class="mlt_wrap" id="mlt_'+nid+'" ></div>');
    var url = 'http://devel.avishay.tk:8080/solr/dev/mlt?q=item_id:'+nid+'&mlt.fl=id,t_title&mlt.mindf=1&mlt.mintf=1&fl=*&wt=json&json.wrf=?';
    if(Drupal.avishay.not_cart_page){
            url = url + '&rows=5';
    }else{
            url = url + '&rows=2';
    }

    //~ var originalRow = jQuery(e.currentTarget).parents('.views-row');
    var originalRow = jQuery(Drupal.avishay.row);

    jQuery.getJSON(url, function(json) {
            if(json.response.numFound === 0){
                    jQuery(originalRow).addClass("no_mlt").css("background", "rgba(255,0,0,0.1)");
                    jQuery(e.currentTarget).after(jQuery('<span> אין תוצאות דומות למאמר זה </span>')).remove();
            } 
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
                    if(typeof(val.t_biblio_custom1) !== "undefined"){
                            
                            var mltRow = jQuery(originalRow).clone().css({"direction" : "rtl"}).addClass("mlt");
                            // BIBLIO CUSTOM1
                            jQuery(".views-field-biblio-custom1 .field-content", mltRow).text( val.t_biblio_custom1[0] );	
                            // TYPE
                            
                             jQuery(".views-field-biblio-type .field-content", mltRow).text( val.f_ss_biblio_type) ;	
                            // YEAR
                            jQuery(".views-field-biblio-year .field-content", mltRow).text( val.is_biblio_year) ;	
                           
                            // RESEARCH field
                            jQuery(val.f_sm_field_biblio_researchname).each(function(i,keyword){        
                                if(jQuery(val.f_sm_field_biblio_researchname).length === i+1  ){
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
                            jQuery(val.f_sm_field_biblio_qualitivename).each(function(i,keyword){        
                            
                            if(jQuery(val.f_sm_field_biblio_qualitivename).length === i+1  ){
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
                            jQuery(val.f_sm_field_biblio_quantitativename).each(function(i,keyword){        
                            
                            if(jQuery(val.f_sm_field_biblio_quantitativename).length === i+1  ){
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
                            
                            jQuery(val.f_sm_biblio_keywords).each(function(i,keyword){
                                    if(jQuery(val.f_sm_biblio_keywords).length === i+1){
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
                                                                            "href":		"#"}).text("קרא \\ רכוש").removeClass("ajax-processed");
                            } else {
                                    jQuery(".views-field-field-commerce .field-content a", mltRow).attr({
                                            "href":	"/free/url/" + val.is_nid,
                                            "id":		"nid_" + val.is_nid,
                                            "class":"free"
                                            }).text("קרא בחינם").removeClass("ajax-processed");
                            }
                            // MLT_ACTION
                            jQuery("a.mlt_action", mltRow).text("תוצאות דומות").removeClass("close_mlt").addClass("show_mlt").attr(	"nid", val.is_nid );

                            //~ Drupal.avishay.combineActionFields();
                            if(jQuery('body').hasClass("page-search")){
                                    Drupal.avishay.bookmarkAttach();
                                    Drupal.avishay.incart();
                                    Drupal.avishay.free_url();
                                    Drupal.avishay.cartLinks();
                                    Drupal.avishay.bookmarkFlag();
                                    
                                    jQuery(e.currentTarget).text("סגור מאמרים דומים");

                            }
                                    jQuery(e.currentTarget).removeClass("loading");
                                    jQuery(mlt_box).append(mltRow);
                                   var refreshTimer = window.setTimeout(function(){
                                           Drupal.avishay.refresh();  
                                           
                                   }, 100);
                    }	

            });

    if(Drupal.avishay.not_cart_page){

            Drupal.avishay.link_setup_get_productName(jQuery('.buy_url[id]:not(.ajax-processed)', mlt_box));		
//			jQuery(e.currentTarget).parents('.views-row').append(mlt_box);		
            jQuery(e.currentTarget).parents('.views-row').append(mlt_box);		
            
            if(typeof(Drupal.settings.display_mode) !== "undefined"){
                if(Drupal.settings.display_mode === "min"){
                        jQuery('#display_mode #min').click();
                }
            }
            var offset = jQuery(mlt_box).offset();
            window.scroll(0,offset.top-10);

    } else {
//~ 
            var settings = {"content": jQuery(mlt_box).css("background-color", "#fff").html()  ,"title" : "", "height" : 450, "width"	:650, "animate" : false};
            Drupal.avishay.shadowbox(settings);
    //~ 
    }

    });

    //~ console.log(mltRow);
    return false;

});

	Drupal.avishay.combineActionFields();
	Drupal.avishay.bookmarkAttach();
	Drupal.avishay.incart();
	Drupal.avishay.free_url();
	Drupal.avishay.cartLinks();
	Drupal.avishay.bookmarkFlag();
        Drupal.avishay.refresh();
        


// ####    on BACK btn BUG FIX
jQuery('<div id="cart_refresh" style="display:none;"></div>').addClass('ajax-processed').each(function (i,val) {
		var element_settings = {};
		var base = jQuery(this).attr('id');
		element_settings.url = '/get_cart'; //jQuery(this).attr('id');
		element_settings.event = 'click';
		element_settings.progress = { 'type': 'throbber' };
		element_settings.submit = { "js": true, "xx":Array(), "uid": Drupal.settings.uid };      // ::::: Here we add a query parameter.
		
		var ajax = new Drupal.ajax(base, this, element_settings);
		ajax.beforeSerialize =  function (response, status) {

		};
//                ajax.success = fu
//		Drupal.ajax[base] = ajax;
}).click();

// ie fixes..
jQuery(".block-commerce-cart h2").css("float","none");
});


