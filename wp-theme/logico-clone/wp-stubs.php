<?php
// Local IDE-only stubs: declare only if WP core functions are missing
if (!function_exists('esc_url')){ function esc_url($u){return $u;} }
if (!function_exists('esc_html')){ function esc_html($s){return $s;} }
if (!function_exists('get_template_directory_uri')){ function get_template_directory_uri(){return '';} }
if (!function_exists('get_terms')){ function get_terms($args=[]){return [];} }
if (!function_exists('get_term_link')){ function get_term_link($t){return '#';} }
if (!function_exists('wp_nav_menu')){ function wp_nav_menu($args=[]){return '';} }
if (!function_exists('wp_footer')){ function wp_footer(){} }
if (!function_exists('get_header')){ function get_header(){} }
if (!function_exists('get_footer')){ function get_footer(){} }
if (!function_exists('get_posts')){ function get_posts($args=[]){return [];} }
if (!function_exists('get_the_post_thumbnail_url')){ function get_the_post_thumbnail_url($p,$size='full'){return '';} }
if (!function_exists('get_the_post_thumbnail')){ function get_the_post_thumbnail($p,$size='thumbnail'){return '';} }
if (!function_exists('get_the_title')){ function get_the_title($p=null){return '';} }
if (!function_exists('get_the_excerpt')){ function get_the_excerpt($p=null){return '';} }
if (!function_exists('get_permalink')){ function get_permalink($p=null){return '#';} }
if (!function_exists('have_posts')){ function have_posts(){return false;} }
if (!function_exists('the_post')){ function the_post(){} }
if (!function_exists('the_content')){ function the_content(){return '';} }
if (!function_exists('do_shortcode')){ function do_shortcode($s){return '';} }
if (!function_exists('wp_remote_get')){ function wp_remote_get($url,$args=[]){return ['body'=>''];} }
if (!function_exists('wp_remote_retrieve_body')){ function wp_remote_retrieve_body($res){return is_array($res)?($res['body']??''):'';} }
