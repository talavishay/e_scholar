jQuery('#block-facetapi-kxkwn08anhnauiawrsza1koswmvmksnl .facetapi-facetapi-links li.leaf').each(function(i,val){
	if(jQuery(val).text().substr(0,1)!= 0){
	//~ console.log(jQuery(val).text().substr(0,4));
 text += jQuery(val).text().substr(0,4)+',';
}

});

jQuery('#tags').importTags(text);
