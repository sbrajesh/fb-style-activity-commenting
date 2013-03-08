jQuery(document).ready(function(){
 var jq=jQuery;
 //we do no want to keep the value to mess our layout, and we do not want to do the complex calculations too
 jq("form.ac-form textarea").val('');
 
 jq(".has-comments form.ac-form").show();//make all the activity comment form visible whose parent have at least 1 previous comment.
 //if you want to show the activity comment form for all the activities , irrespective of whether there are already comments or not, comment the above line and uncomment the below line
 //jq("form.ac-form").show();
 
 //comment text area autogrow
 jq('.ac-textarea textarea').autogrow();
 
 //on focus, add remove active class
 jq(document).on('focus','.ac-textarea textarea', function(){
     var ac_form=jq(this).parent().parent().parent();//parent form
         ac_form.addClass('active');
		
         jq('.ac-textarea').parents('form.ac-form').not(ac_form).removeClass('active');
                
               
  });

     
   /* Handle the ESC/ENTER key with more specific element and cancel even bubbling for these actions to void bp-default's way of handling this */
jq(document).on('keydown','.ac-textarea textarea', function(e) {
	 element = e.target;
		
	//if meta keys, don't do anything	
          if( e.ctrlKey == true || e.altKey == true || e.metaKey == true )
		return;

            var keyCode = (e.keyCode) ? e.keyCode : e.which;
                
         
                    //if ESC key was pressed
           if ( keyCode == 27 ) {
                   jq(element).animate({'height':'13px'});//reset back to its original height

                   return false;              

                }
            else if(keyCode==13){//if enter pressed
                //jq(element).parent().next().click();//since we have not removed the submit button
                  ac_post_comment(element);
                return false;

            }      
                   
});//end of ESC/enter handling code
  
 
  /**post activity comment*/
  //just a copy fo bp-default activity comment posting with very slight modification to avoid hiding the forms
  function ac_post_comment(target){
    target=jq(target);
   
    	/* Activity comment posting */
		if ( target.hasClass('ac-input') ) {
			var form = target.parent().parent().parent();
			var form_parent = form.parent();
			var form_id = form.attr('id').split('-');

			if ( !form_parent.hasClass('activity-comments') ) {
				var tmp_id = form_parent.attr('id').split('-');
				var comment_id = tmp_id[1];
			} else {
				var comment_id = form_id[2];
			}

			/* Hide any error messages */
			jq( 'form#' + form.attr('id') + ' div.error').hide();
			target.next('.loader').addClass('loading').end().prop('disabled', true);

			jq.post( ajaxurl, {
				action: 'new_activity_comment',
				'cookie': encodeURIComponent(document.cookie),
				'_wpnonce_new_activity_comment': jq("input#_wpnonce_new_activity_comment").val(),
				'comment_id': comment_id,
				'form_id': form_id[2],
				'content': jq('form#' + form.attr('id') + ' textarea').val()
			},
			function(response)
			{
				target.next('.loader').removeClass('loading');

				/* Check for errors and append if found. */
				if ( response[0] + response[1] == '-1' ) {
					form.append( response.substr( 2, response.length ) ).hide().fadeIn( 200 );
				} else {
					form.fadeOut( 200,
						function() {
							if ( 0 == form.parent().children('ul').length ) {
								if ( form.parent().hasClass('activity-comments') )
									form.parent().prepend('<ul></ul>');
								else
									form.parent().append('<ul></ul>');
							}

							form.parent().children('ul').append(response).hide().fadeIn( 200 );
							form.children('textarea').val('');
							form.parent().parent().addClass('has-comments');
						}
					);//form hiding
					jq( 'form#' + form.attr('id') + ' textarea').val('');
                                        target.height(20);
                                      //  form.removeClass('active');
                                        form.fadeIn(200);
                                        
					/* Increase the "Reply (X)" button count */
					jq('li#activity-' + form_id[2] + ' a.acomment-reply span').html( Number( jq('li#activity-' + form_id[2] + ' a.acomment-reply span').html() ) + 1 );
				}

				jq(target).prop("disabled", false);
			});

			return false;
		}
}

/* You can avoid the code blow if you want to change a line in global.js, if you don't, then this code does it for you*/
//the code below is taken from bp-default activity comment link clicking code, I have attached the evnt to more specific element and also remoded the form hiding code
jq('div.activity .acomment-reply').click( function(event) {
		var target = jq(event.target);
		
                var id = target.attr('id');
                ids = id.split('-');

                var a_id = ids[2]
                var c_id = target.attr('href').substr( 10, target.attr('href').length );
                var form = jq( '#ac-form-' + a_id );

                form.css( 'display', 'none' );
                form.removeClass('root');
                //jq('.ac-form').hide();//you can just comment out this line in the global.js of bp-default and avoid this whole block of code

                /* Hide any error messages */
                form.children('div').each( function() {
                        if ( jq(this).hasClass( 'error' ) )
                                jq(this).hide();
                });

                if ( ids[1] != 'comment' ) {
                        jq('div.activity-comments li#acomment-' + c_id).append( form );
                } else {
                        jq('li#activity-' + a_id + ' div.activity-comments').append( form );
                }

                if ( form.parent().hasClass( 'activity-comments' ) )
                        form.addClass('root');

                form.slideDown( 200 );
                jq.scrollTo( form, 500, { offset:-100, easing:'easeOutQuad' } );
                jq('#ac-form-' + ids[2] + ' textarea').focus();

                return false;
		
});

});