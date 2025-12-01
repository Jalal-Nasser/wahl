<?php
add_action('after_setup_theme', function(){
add_theme_support('title-tag');
add_theme_support('post-thumbnails');
register_nav_menus(['primary'=>'Primary Menu','footer'=>'Footer Menu']);
});

add_action('wp_enqueue_scripts', function(){
wp_enqueue_style('logico-clone-style', get_stylesheet_uri(), [], '1.0.0');
});

add_action('init', function(){
register_post_type('service', [
 'label'=>'Services','public'=>true,'show_in_rest'=>true,'has_archive'=>true,
 'rewrite'=>['slug'=>'services'],'supports'=>['title','editor','thumbnail','excerpt']
]);
register_post_type('testimonial', [
 'label'=>'Testimonials','public'=>true,'show_in_rest'=>true,'has_archive'=>false,
 'rewrite'=>['slug'=>'testimonials'],'supports'=>['title','editor','thumbnail','excerpt']
]);
register_post_type('team_member', [
 'label'=>'Team','public'=>true,'show_in_rest'=>true,'has_archive'=>false,
 'rewrite'=>['slug'=>'team'],'supports'=>['title','editor','thumbnail','excerpt']
]);
register_taxonomy('service_category','service',[
 'label'=>'Service Categories','public'=>true,'show_in_rest'=>true,'rewrite'=>['slug'=>'service-category']
]);
});

function logico_clone_get_services($count=6){
return get_posts(['post_type'=>'service','posts_per_page'=>$count]);
}

function logico_clone_get_testimonials($count=3){
return get_posts(['post_type'=>'testimonial','posts_per_page'=>$count]);
}
