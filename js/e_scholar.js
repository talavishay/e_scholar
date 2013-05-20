Drupal.avishay = {};
Drupal.avishay.biblio_types  = {"journal" : "מאמר מכתב עת","other" : 'שונות', "report" : 'דו"ח ממשלתי',"report" : 'דו"ח', "book" :'ספר', "book" :'פרק מתוך ספר' , "paper" : 'אוסף מאמרים לאחר וועידה', "tiza" : 'עבודת תיזה' };
Drupal.avishay.row = '<div class="views-row "><div class="title_wrap"><span class="views-field views-field-biblio-custom1"><span class="field-content"></span></span><span id="sep">|</span><span class="views-field views-field-biblio-year"><span class="field-content"></span></span></div><div class="type_image journal"></div><div class="views-field views-field-field-biblio-research"><span class="views-label views-label-field-biblio-research">תחום: </span><span class="field-content"></span></div><div class="views-field views-field-field-biblio-qualitive">        <span class="field-content">   <span class="views-label views-label-field-biblio-research">שיטת מחקר: </span>    <span class="field-content">איכותני (ניתוח מקרה)</span></span></div><div class="views-field views-field-biblio-type"><span class="views-label views-label-biblio-type">סוג: </span><span class="field-content"></span></div><div class="views-field views-field-biblio-keywords">    <span class="views-label views-label-biblio-keywords">מילות מפתח: </span>    <span class="field-content"></span>  </div><div></div><div class="actions"><div class="views-field views-field-field-commerce">        <span class="field-content"><a href="" id="" class="free">קרא חינם</a></span>  </div><div class="escholar-color-scheme-front-light-blue show_mlt_wrap"><a class="webform" href="#">מצאתי שגיאה</a></div></div></div>';
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
Drupal.settings.refrsh_view = function(view){
try{Drupal.avishay.my_products();
    Drupal.avishay.incart();
    Drupal.avishay.cartLinks();
//    Drupal.avishay.free_url();
    Drupal.avishay.link_setup_get_productName(jQuery('.buy_url:not(.ajax-processed)'));
    Drupal.avishay.link_setup_get_productName(jQuery('.buy_export:not(.ajax-processed)'));
//    Drupal.avishay.combineActionFields(view);
//    Drupal.avishay.bookmarkExportActionClick();
//    Drupal.avishay.refresh(view);
}catch(e){
    console.log(e);
};
};
Drupal.avishay.incart = function(contexts){
    //  reset links in case  we are running after a cart refresh...
    jQuery('a.cart_export,a.url_export').each(function(i,val){
        if(jQuery(val).hasClass('cart_export')){
            jQuery(val).removeClass('cart_export').addClass('buy_export').text('רכוש ציטוט');
            // Adding a price to the export link
            if(typeof(Drupal.settings.citaion_price) !== "undefined"){
              var price = Drupal.settings.citaion_price.replace(/00.00/i,"").replace(/שח/i,"").trim();
             jQuery(val).append('<span class="price">'+price+'</span>' ).addClass("priceFix");;
            }
        }
        if(jQuery(val).hasClass('cart_url')){
                jQuery(val).removeClass('cart_url').addClass('buy_url').text('רכוש קישור');
        }
    });
    // ittarte over line item rows from the cart 
    jQuery('.commerce-line-item-views-form .views-row').each(function(i, row){
         var productName = jQuery(".views-field-sku", row).text().trim();
         var nid = jQuery(".views-field-field-nid-1", row).text().trim();
         var link = jQuery('.buy_'+productName+'[nid='+nid+']').not('cart_export');
         
         jQuery(link).each(function(i, val){
             jQuery("span.price", val).remove();
             var text = jQuery(val).text().replace(/(.*)רכוש(.*)/i,"$1$2 בעגלה");
             jQuery(val).text(text).addClass('cart_'+productName).removeClass('buy_'+productName);
         });
      
    });
    
    
};
Drupal.avishay.link_setup_get_productName = function(links){	
    jQuery(links).addClass('ajax-processed').each(function (i,val) {
		var element_settings = {};
		var base = jQuery(val).attr('id');
		var productName =  jQuery(val).attr('product');
		element_settings.url = '/' + productName; //jQuery(this).attr('id');
		element_settings.event = 'click.buy';
		element_settings.submit = { "js": true, 
                                            "uid": Drupal.settings.uid, 
                                            "productName" : productName , 
                                            "nid": jQuery(val).attr("nid") };      // ::::: Here we add a query parameter.
		var ajax = new Drupal.ajax(base, val, element_settings);
		Drupal.ajax[base] = ajax;
                if(jQuery(val).parents("#sb-player").length){
                    jQuery(val).bind("click", function(){
                        jQuery.cookie("refresh", "true");
                    });
                }
    });
};
Drupal.avishay.my_products = function(){	
    try{
    if(typeof(Drupal.settings.products.biblio_biblio_export_nodes) === 'object' ){
        jQuery(Drupal.settings.products.biblio_biblio_url_nodes).each(function(i,val){
            var buy_url = jQuery(".buy_url[nid="+val.nid+"]").attr({"href":val.url}).removeClass('buy_url').addClass('get_url').text("קבל קישור");
            if(val.url === ""){
                    jQuery(buy_url).addClass('empty').text("קישור חסר!?");
            }
        });
        jQuery(Drupal.settings.products.biblio_biblio_export_nodes).each(function(i,val){
            var buy_export = jQuery(".buy_export[nid="+val.nid+"]");
            jQuery(buy_export).removeClass("buy_export").removeClass("cart_export").addClass('get_export').text('קבל ביבליו');
        });
    };
    }catch(e){}
};
Drupal.avishay.cartLinks = function(context){
    jQuery("a.cart_url,a.cart_export").unbind("click");
	
};
Drupal.avishay.getCitations = function(nid){
    if(Drupal.settings.username != "anonymous"){
        if(typeof(arguments[0]) === "number"){
            that = Array();
            var url = '/ajax/citation/'+nid+'/style-all';
            jQuery.getJSON(url, function(json) {
                    jQuery.each(json.nodes[0].node , function(key, val){
                            var citation = {"key" : key, "nid": nid, "citation" : val};
                            that.push( citation);
                    });
            });
            return that;
        };
    }
};
Drupal.avishay.bookmarkExportActionClick =  function(e){
	var context = jQuery(e.currentTarget).parents("tr");
	var productName = jQuery(context).attr("cart_export");
	var articleName = jQuery('td.views-field-biblio-custom1 p', context).text();
	var nid = jQuery(context).attr("nid");
	var messages = Array();
	if(jQuery(".cart_export ", context).length === 1 || jQuery(".buy_export ", context).length === 1){
		e.preventDefault();
		jQuery(".buy_export", context ).addClass("getme");
		if(jQuery(".buy_export", context).length != 0){
			messages.push(Drupal.t(	'you must buy this ("גישה ליצוא ביבליוגרפיה") for the article:</a> ("'+articleName+'") before exporting it'));
		}
		if(jQuery(".cart_export", context).length != 0){
			//~ console.log('context');
			messages.push(Drupal.t('<div style="direction: ltr">the ("article export product") <br/>for the article :<br/>("'+articleName+'")<br/> is in your cart..<br/> in order to export it you need to pay .. <br/><a style="width:100%; text-align:center;display:inline-block;color: inherit;direction:ltr;" href="/checkout">checkout now ?</a></div>'));
		}
		//~ Drupal.avishay.msg(messages, jQuery('#block-views-flag-bookmarks-block-2 div.view'),	600,false);

		jQuery(messages).each(function(i,val){
		var notice = '<div class="notice purr avishaycsspurr" ><div class="notice-body">';
			notice += val;
			notice += '</div><div class="notice-bottom"></div></div>';
			jQuery(notice).purr();


		})
		return false;
	} else {
		if(jQuery(e.currentTarget).hasClass("check")){
			jQuery(e.currentTarget).removeClass("check");
		} else {
			jQuery(e.currentTarget).addClass("check");
		}
	}
};
Drupal.avishay.exportControl = function(context){
//    Adding export controls to the "user" page
//    "my purchesd export access "
    context = jQuery('.view-flags.view-display-id-export');
    jQuery('table:not(.bookmarkExportActionTaken)', context ).each(function(i,table){
        var op = jQuery('<div class="input_wrap"><input type="checkbox" class="bookmarkAction" style="margin:0px"/></div>');
        var select = jQuery('<select></select>').attr("id",  "style");
        // check for a table haeder
        jQuery('thead tr', table).each(function(i,val){
                        jQuery(val).append(jQuery('<th class="action">סמן מקורות</th>').addClass('bookmarkExportActionTaken').addClass('all').css({"padding": "0 5px","vertical-align": "middle"}));
        });
        jQuery(' tbody tr', table).each(function(i,val){				// insert a checkbox  in a new  table colum
                jQuery(val).append(jQuery('<td class="action"></td>').append(jQuery(op).clone()
                                        )/*append*/	);/*append*/
                var classs = String(jQuery(val).attr("class"));
                nid = parseInt(classs.replace(/(.*)nid-(\d*)-nid(.*)/g, "$2"));
                jQuery(val).attr("nid",nid);
        });
        jQuery(Array("ama", "apa", "chicago", "classic", "cse", "ieee", "mla", "vancouver")).each(function(i, val){
                var option = jQuery('<option></option>').attr({"value": val}).text(val);
//			if(i===0){
//				option = jQuery('<option></option>').attr({"value": val,"selected" : "selected"}).text(val).attr();
//			}
                jQuery(select).append(option);
        });
        jQuery(select).append(jQuery('<option></option>').attr({"value": "default","selected" : "selected"}).text("-ערך ברירת מחדל-"));
        // add an "action button + select options" to act upon our selected rows
//		var style = '    border: 2px solid green;    border-radius: 7px ;     padding: 2px 7px;  margin-top:3px;  position: absolute;    ';
        jQuery(table).parents(".view.quote").append(jQuery('<div id="export_wrap"><div id="help"></div></div>').prepend(jQuery('<div id="select_wrap"></div>').prepend(select)).append(jQuery('<a href="/get_export" id="bookmarkActionSubmit">צור רשימה ביבליוגרפית</a>')));
        jQuery('body.page-user .view.quote #export_wrap').append(jQuery(''));

        jQuery('input.all:not(input:checked)', table).live("mousedown", function(e){
                        jQuery('input.bookmarkAction:not(input:checked):not(.all)').click();
        });
        jQuery('input:not(.all):not(:checked)', table).live("click", function(e){
                                        Drupal.avishay.bookmarkActionLiveClick(e);
                                        });
    }).addClass('bookmarkExportAction');
};
Drupal.avishay.bookmark_state_checkbox_toggle = function(flags, settings){
//    var nid = parseInt(jQuery(".views-field-nid-1", row).text().trim());
     if(typeof(settings) !== "undefined"){
        Drupal.settings.bookmarks = settings.bookmarks;
     }
    if(jQuery(flags).length){
        var search_view = jQuery('.view-search-api-solr');
        var flagClass = flags.className;
        var flagNid= flagClass.replace(/(.*)flag-bookmarks-(.*)/i, "$2" );
        var flagClassName = "flag-bookmarks-" + flagNid;
        var searchFlag = jQuery("."+flagClassName , search_view).parents(".view-field-bookmark");
        var flag = jQuery("a.flag ", searchFlag );
//        var unflag = jQuery("a.unflag-action ", searchFlag );
        if(jQuery(flag).hasClass("flagged")){
//         jQuery(flag).removeClass("unflag-action flagged").addClass("unflagged flag-action");
        jQuery("input", searchFlag ).attr("checked","checked");
            
        } else {
//         jQuery(unflag).removeClass("unflag-action flagged").addClass("unflagged flag-action");
        jQuery("input", searchFlag ).attr("checked","");
        }
    }
    
//        if(typeof(nid) === "number" && jQuery("a", context).hasClass("unflagged")){
//            Drupal.avishay.bookmark_state_checkbox_toggle();
//        }
	jQuery('.flag_wrap input', searchFlag).each(function(i, val){
		var a = jQuery('a', jQuery(val).parent());
		if(jQuery(a).hasClass("unflag-action")){
                    jQuery(val).attr("checked","checked");
		}
	});	
};

Drupal.avishay.msg = function(text, context, speed, title){
//TODO:  .stop(true, true) --  animation stop ?
		clearTimeout(this.timer);
		if(jQuery("div#messages").length !== 0 ){

			jQuery(text).each(function(i,val){

				jQuery("div.messages ul").prepend('<li>'+val+'</li>');
			});
			jQuery('div#messages').show(speed);
		} else {
			var container = jQuery('<div id="messages"><div class="section clearfix sectionClearWidth"><div class="messages status"><h2 class="element-invisible">Status message</h2><ul></ul></div></div></div>');
			if(title === true){
				if(jQuery("div#messages h4", container).length  === 0){
						jQuery("div.messages", container).prepend('<h4>'+Drupal.t('Some items have not been selected, details')+':</h4>');
					};
			}

			jQuery(text).each(function(i,val){
				jQuery("div.messages ul",	container).append(jQuery('<li>'+val+'</li>'));
			});

			jQuery('div#messages',		container).show(speed);

			var settings = {"content": jQuery(container).html() ,"title" : "", "height" : 450, "width"	:800, "animate" : true};


			jQuery(context).before(container);
			//~ Drupal.avishay.shadowbox(settings);
		}
		this.timer = setTimeout(function(){
					jQuery('div#messages:not(.stop)').hide(1000);
						jQuery("div.messages ul li").addClass("old");
		},5000);
};
Drupal.avishay.shadowbox = function(settings){
    Shadowbox.init({skipSetup: true });
    Shadowbox.open({
        content:    settings.content,
        player:     "html",
        //overlayColor : "#f00"
        title:      settings.title,
        height:     settings.height,
        width:      settings.width,
        animate:    settings.animate,
        options:    
            {onClose : function() {
                if(jQuery("body.page-cart")){
                    jQuery('a.close_mlt').text("מאמרים דומים").removeClass("close_mlt loading").addClass("show_mlt");
                    if(jQuery.cookie("refresh")){
                        jQuery.removeCookie("refresh");
                        var cart_form = jQuery("#views-form-commerce-cart-form-default");
                        if(cart_form.length){
                            cart_form.html('<h2>מעדכן עגלת קניות . . </h2>') ;
                            var timer = window.setInterval(function(){
                                jQuery("h2", cart_form).append(" . ") ;
                            }, 100);
                            window.location.reload();
                        }
                    }
               }
            },
            onFinish: function(elm){
                        var notice = '<div class="notice purr avishaycsspurr" id="shadowbox_buy_url_bug" ><div class="notice-body">';
                        notice += '</div><div class="notice-bottom"></div></div>';
                        Drupal.avishay.incart();
                        Drupal.avishay.cartLinks();
                        Drupal.avishay.link_setup_get_productName(jQuery('#sb-player .buy_url'));
                        
            }}
    });
};
Drupal.behaviors.e_scholar = {
    attach: function(context, settings){
         
        var view_commerce_cart_block = jQuery('.view-commerce-cart-block');
        var commerce_line_item_views_form = jQuery(".commerce-line-item-views-form", context);
        var flag = jQuery(context).hasClass("flag-wrapper");
        var view_search_api_solr = jQuery(".view-search-api-solr .view-content", context);
        var view_flag_bookmarks  = jQuery(".view-flag-bookmarks .view-content", context);
        if(commerce_line_item_views_form.length){
            jQuery(".delete-line-item.form-submit", context).attr("title", "  הסר מהעגלה  ").val("x").bind("click", function(e){
                jQuery(e.currentTarget).addClass("loading");
            });
            // cart more like this 
            jQuery('td.views-field-field-nid', commerce_line_item_views_form).each(function(i, val){
                var nid = jQuery(val).text().trim();
                jQuery(val).text("").append(jQuery('<a href="#" nid="'+nid+'" class="show_mlt mlt_action">מאמרים דומים</a>'));
            });
            // purches links setup
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_url:not(.ajax-processed)', commerce_line_item_views_form));
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_export:not(.ajax-processed)', commerce_line_item_views_form));  
            Drupal.avishay.incart(commerce_line_item_views_form);
            Drupal.avishay.cartLinks(commerce_line_item_views_form);
            
        }
        if(flag){
            Drupal.avishay.bookmark_state_checkbox_toggle(context, settings);
        }
        if(view_commerce_cart_block.length ){
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_url:not(.ajax-processed)', view_commerce_cart_block ));
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_export:not(.ajax-processed)', view_commerce_cart_block ));  
        }
        if(view_flag_bookmarks.length ){
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_url:not(.ajax-processed)', view_flag_bookmarks));
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_export:not(.ajax-processed)', view_flag_bookmarks));  
        }
        if(jQuery( context).hasClass("view-flag-bookmarks")){
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_url:not(.ajax-processed)', context));
            Drupal.avishay.link_setup_get_productName(jQuery('.buy_export:not(.ajax-processed)', context));  
            Drupal.avishay.incart(context);
            Drupal.avishay.cartLinks(context);
        };
        if( jQuery( context).hasClass("view-search-api-solr")){
            Drupal.avishay.refresh_results(context);
        };
        if( view_search_api_solr.length ){
            Drupal.avishay.refresh_results(view_search_api_solr);
        };
        if(typeof(jQuery.cookie) === "function"){

      Drupal.settings.display_mode = jQuery.cookie("display_mode");
          // Display mode  toggle
       
        if(Drupal.settings.display_mode === "min"){
                jQuery('#display_mode #min').click();
        }
        }
        //  TRANSLATION -bugfix-  "items" => פריטים
        if(view_commerce_cart_block.length){
            jQuery(".line-item-quantity-label", view_commerce_cart_block).text("פריטים");
        }
        
     

    }
};
Drupal.avishay.bind_events = function (){
    // Cart links -- purches link allready in cart ...
    jQuery("a.cart_url,a.cart_export").live("click.cart", function(e){
                    e.preventDefault();
                    var settings = {
                        "content"   :  '<div id="in_cart">המוצר כבר נמצא בעגלה.. <br/>'+
                                        'להשלמת הרכישה וקבלת הקישור  <a id="checkoutNow" href="/checkout">לחץ כאן</a></div>',
                        "title"     : "",
                        "height"    : 350,
                        "width"     :350,
                        "animate" : false};
                    Drupal.avishay.shadowbox(settings);
                    jQuery(e.currentTarget).addClass('disabled').unbind("click.cart");
                    return false;
    });
    
    // adding a checkbox indection for the bookmark flags
    jQuery('.view-field-bookmark input:checked').live("click", function(e){
            var a = jQuery('a', jQuery(e.currentTarget).parent());
            if(jQuery(a).hasClass("flag-action")){
                    jQuery(a).click();
            } else {
                    e.preventDefault();
                    return false;
            }
    });	
    jQuery('.view-field-bookmark input:not(:checked)').live("click", function(e){
            var a = jQuery('a', jQuery(e.currentTarget).parent());
            if(jQuery(a).hasClass("unflag-action")){
                    jQuery(a).click();
            } else {
                    e.preventDefault();
                    return false;
            }
    });
    jQuery('a.free_url,a.free').live("click",function(e){
        e.preventDefault();
        jQuery.getJSON(jQuery(e.currentTarget).attr("href"), function(data){
           jQuery(data.nodes).each(function(i, val){
               window.open(val.node.URL) ;
               ;
           });

        });
        return false;

    });
    jQuery('a.empty').unbind("click").die("click").live("click", function(e){
            e.preventDefault();
            return false;
    });
    jQuery('#display_mode #min' ).live("click",  function(e){
        jQuery(".view-search-api-solr .views-row").each(function(i, val){
            jQuery('.views-field-field-biblio-lang, .type_image,.views-field-field-biblio-research, .views-field-field-biblio-qualitive, .views-field-biblio-type, .views-field-biblio-keywords, .views-field-field-biblio-quantitative', val).hide(); 
        }).addClass("min");
        Drupal.settings.display_mode = "min";
        jQuery.cookie('display_mode', "min");
    });
    jQuery('#display_mode #max' ).live("click",  function(e){
        jQuery(".view-search-api-solr .views-row").each(function(i, val){
            jQuery('.views-field-field-biblio-lang, .type_image,.views-field-field-biblio-research, .views-field-field-biblio-qualitive, .views-field-biblio-type, .views-field-biblio-keywords, .views-field-field-biblio-quantitative', val).show();  
        }).removeClass("min");
        Drupal.settings.display_mode = "max";
        jQuery.cookie('display_mode', "max");
    });
    jQuery("#block-views-flag-bookmarks-block-2 .views-field-nothing span ").live("click", function(e){
        
        jQuery(e.currentTarget).addClass("flag-throbber");
        var row = jQuery(e.currentTarget).parents(".views-row").addClass("flag-waiting ");
        var nid = jQuery(".views-field-nothing span", row).attr("nid");
        var view_search_api_solr_flag =  jQuery('.view-search-api-solr .flag-bookmarks-'+ nid + ' a');
        if( view_search_api_solr_flag.length ){
            jQuery(view_search_api_solr_flag).click();
        }else{
            jQuery(".flag-bookmarks a", row ).click();
        }
    });
    jQuery("#sb-player .buy_url").live("click", function(){
            jQuery("body").css("background","red").children().hide();
            console.log("xxxx");
            jQuery.cookie("refresh", "true");
    });
};

jQuery(document).ready(function(){
    Drupal.avishay.bind_events();
    // checkout page -- "term of service"
    jQuery("#edit-buttons").prepend(jQuery(".form-item-extra-pane--node--446-termsofservice"));
    if(typeof(Drupal.ajax) !== "undefined"){
        Drupal.ajax.prototype.commands.ajax_buy_response = function (ajax, response, status) {
            var cart_form = jQuery(ajax.element).parents("#views-form-commerce-cart-form-default");
            if(cart_form.length){
                cart_form.html('<h2>מעדכן עגלת קניות..</h2>') ;
                var timer = window.setInterval(function(){
                    jQuery("h2", cart_form).append(" . ") ;
                }, 100);
                window.location.reload();
            }
            jQuery('#toaster-content #current_msg').html(response.data);
            var toaster = jQuery('#cart-toaster').show().css("display","block");
            var height = 200;
            var top = (height+12) *-1;
            Drupal.avishay.incart();
            if(typeof(Drupal.settings.cartTimer ) !== "undefined"){
                jQuery('#cart-toaster').stop(true, true);
            }

            jQuery('#cart-toaster').css("display","block").animate({"opacity":"1","top":top,"height":height}, 700);
                Drupal.settings.cartTimer = window.setTimeout(function(){
            //            console.log(cartTimer);
                jQuery('#cart-toaster').css("display","block").animate({"opacity":"0","top":0}, 500,function(){
                    jQuery('#cart-toaster').css("display","none");
                    delete  Drupal.settings.cartTimer ;
            });},5000);//    console.log(cartTimer);
        };
        Drupal.ajax.prototype.commands.ajax_buy_response_shadowbox = function (ajax, response, status) {
                        jQuery("#buy_url_" + response.data +':not(.priceFix)').replaceWith(jQuery('<a class="cart_url" href="#">בעגלה</a>'));
                };
        Drupal.ajax.prototype.commands.ajax_get_export_output = function (ajax, response, status) {
                        var settings = {"content":response.data,
                                    "title" : "", "height" : 600, "width"	:800, "animate" : false};
                        Drupal.avishay.shadowbox(settings);
    };
}
// #####    main search input behaviour
Drupal.settings.search_text = "הקלד מילה או ביטוי";
if(jQuery("#edit-text").val() === "" ){
     jQuery("#views-exposed-form-search-api-solr-page #edit-text").val(Drupal.settings.search_text);
 }
jQuery("#views-exposed-form-search-api-solr-page #edit-text").live("click focus", function(e){
    if(jQuery(e.currentTarget).val() === Drupal.settings.search_text){
        jQuery("#views-exposed-form-search-api-solr-page #edit-text").val("");
    }
});
jQuery("form#views-exposed-form-search-api-solr-page input[type=submit]").bind("click", function(e){
    var input_text = jQuery("#views-exposed-form-search-api-solr-page #edit-text");
    if(jQuery(input_text).val() === Drupal.settings.search_text){
       jQuery(input_text).val("");
    }
});
// #####    MENU - user menu <= zone-header => region-user-second
    jQuery('body.page-user  ul.tabs li').each(function(i,val){
        var a = jQuery("a", val);
        var match = /צור איתנו קשר/i;
        var match2 = /ערוך/i;
         if(jQuery(a).text().match(match)){
             jQuery( val).remove();
         }
         if(jQuery(a).text().match(match2)){
             jQuery("a", val).text("פרטים אישיים");
         }
    });

    jQuery('#section-header .region-user-second-inner li').each(function(i,val){
        var a = jQuery("a", val);
        var match = /לקופה/i;
        var match2 = /חידוש סיסמה/i;
        var match3 = /Log out/i;
         if(jQuery(a).text().match(match)){
             jQuery( val).attr({"id":"shopping-cart"}).addClass("shopping-cart").children('a').attr("href", "/cart");
            jQuery(a).css("color","rgba(255,255,255,0)").text(".");

            jQuery(val).addClass("showme");
            jQuery('.block-login .item-list ul').append(val);
         }
         if(jQuery(a).text().match(match2)){
             jQuery(val).remove();
         }
         if(jQuery(a).text().match(match3)){
             jQuery(a).text("יציאה");
         }
     });
    jQuery('#region-user-second .item-list ul').prepend(   jQuery('<li><a id="block-login-toggle" title="" href="#">כניסה</a></li>'));
    jQuery('#region-user-second  .block-login #block-login-toggle').bind("click", function(e){
             jQuery('.block-login #user-login-form .form-item,.block-login #user-login-form .form-submit').toggle(500);
    });
    var ulMenu = jQuery("body.not-logged-in #block-system-user-menu ul.menu");
    if(jQuery("li", ulMenu ).length === 0){
        jQuery(ulMenu).remove();
    }
    jQuery('#region-user-second ul').parent().not(".contextual-links-wrapper").append(jQuery('<div id="menu_bg_grad_left"></div>')).prepend(jQuery('<div id="menu_bg_grad_right"></div>'));

   // ####  CITATION EXPORT  -START
    // - help div toggle
    jQuery('.quote #export_wrap #help').live("click", function(e){
        jQuery('.quote .view-footer').toggle('fast');

     });
    jQuery('a#bookmarkActionSubmit').live("click", function(e){
		e.preventDefault();
		var target = '';
		//~ var len = jQuery('table tr.get_export input:checked').length;
		var len = jQuery('table tr input:checked').length;
		//~ jQuery('table tr.get_export .bookmarkAction:checked:not(.all)').each(function(i, val){
		jQuery('table tr .bookmarkAction:checked:not(.all)').each(function(i, val){
			var nid = jQuery(val).parents("tr").attr("nid");
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
		if(typeof(target) === "string" && target != ""){
		//~ jQuery(e.currentTarget).attr("href", '/get_export?style='+style+'&target='+target);
			window.location = '/get_export?style='+style+'&target='+target;
		}
		return false;
	});
    // ####  CITATION EXPORT  - END
//    document.title =  document.title+' | '+Drupal.settings.username;
    jQuery('#header h2.element-invisible').removeClass('element-invisible');
    if(typeof(Drupal.avishay.my_products) !== "undefined"){Drupal.avishay.my_products();};

    //  ####  TRANSLATION  -- cart summary -- "Order total" on /checkout
	jQuery('.cart_contents .component-title, .commerce-order-commerce-order  .component-title').text('סה"כ');
    //  ####  citation export feature on page-orders 
    if(jQuery('body.page-user-').length === 1){
        Drupal.avishay.exportControl();
    }

    //homepage layout change - block services
    
    jQuery('body.front #region-sidebar-first').removeClass('suffix-1').removeClass('grid-3').addClass('grid-4');
    
    // search page - research page - block un -collapse
    jQuery('body.page-search-biblio-research #block-facetapi-teg6sxevoi6j1spgksf3t0fons374p0k h2').click();

    
//  CONTACT FORM 
jQuery('body.page-contact #contact-site-form .form-item:visible"').each(function(i,val){
    jQuery("span", val).remove();
    var label = jQuery("label", val).text();
    if(typeof(jQuery("input", val).attr("value")) === "string"){
        if(jQuery("input", val).attr("value").length === 0){                
            jQuery("input", val).attr("value",label).bind("focus", function(e){
                jQuery(e.currentTarget).attr("value","");
            });
        }
    }
});

jQuery('body.page-contact #contact-site-form .form-item-message').each(function(i,val){
    jQuery("span", val).remove();
    var label = jQuery("label", val).text();
    if(jQuery("textarea", val).text().length === 0){
    jQuery("textarea", val).text(label).bind("focus", function(e){                
                jQuery(e.currentTarget).text("");
            });;
    }
    
});



 // homepage slideshow pager style
var timer =     window.setTimeout(function(){
    var ul_width = 0;
        jQuery('.view-id-homepage_banner  .jcarousel-navigation li').each(function(i,val){
            ul_width = ul_width  + 40;
        });
        jQuery('.view-id-homepage_banner  ul.jcarousel-navigation').css({"width":ul_width ,"visibility":"visible"});
},500);
//jQuery('section#block-system-main-menu.block div.block-inner div.content').show();       
if(typeof(jQuery.cookie) === "function"){
Drupal.settings.display_mode = jQuery.cookie("display_mode");
          // Display mode  toggle
       
        if(Drupal.settings.display_mode === "min"){
                jQuery('#display_mode #min').click();
        }
}
});
jQuery(document).ajaxStart(function () {
/* * 		setup global ajax event listeners*/
        }).ajaxSend(function (e, xhr, opts) {
        }).ajaxError(function (e, xhr, opts) {
        }).ajaxSuccess(function (e, xhr, opts) {
        }).ajaxComplete(function (e, xhr, opts) {
    window.setTimeout(function(){jQuery('img.views_flag_refresh-throbber').remove();},1000);
});
