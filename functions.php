<?php

//prevent multilevel commenting, after all we are making facebook like stream
add_filter( 'bp_activity_can_comment_reply', '__return_false' );

//include the javascript, change it as you want
add_action( 'wp_print_scripts', 'bp_fbstyle_comment_js' );

function bp_fbstyle_comment_js() {

	if( ! is_user_logged_in() )
        return ;//we do not want to include the js
    
	wp_enqueue_script( 'bpfb-comment-js', get_stylesheet_directory_uri() . '/_inc/comment.js', array( 'jquery', 'dtheme-ajax-js' ) );
  
	wp_enqueue_script( 'bpfb-comment-autogrow-js', get_stylesheet_directory_uri() . '/_inc/jquery.autogrow-textarea.js', array( 'jquery' ) );
}
