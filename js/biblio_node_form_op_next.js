jQuery(document).ready(function(){
	console.log('biblio_node_form_op_next');		
	console.log(jQuery("#biblio-node-form div.vertical-tabs").length);		
	if(jQuery("#biblio-node-form div.vertical-tabs").length == 0){
		jQuery(".field-type-taxonomy-term-reference").hide();
	}
	jQuery("#biblio-node-form").prepend(jQuery('#edit-actions'));
	//set default tab ... by "faking a click on it"
	
	
	//~ jQuery('form#biblio-node-form.node-form div div.vertical-tabs ul.vertical-tabs-list li.vertical-tab-button.last a').click();
	
})
