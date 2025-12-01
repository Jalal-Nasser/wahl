<?php
if (!function_exists('esc_url')) {
  require_once __DIR__.'/wp-stubs.php';
}
add_action('after_setup_theme', function(){
add_theme_support('title-tag');
add_theme_support('post-thumbnails');
register_nav_menus(['primary'=>'Primary Menu','footer'=>'Footer Menu']);
});

add_action('wp_enqueue_scripts', function(){
wp_enqueue_style('logico-clone-style', get_stylesheet_uri(), [], '1.0.0');
wp_enqueue_script('logico-clone-slider', get_template_directory_uri().'/assets/js/slider.js', [], '1.0.0', true);
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
register_post_type('hero_slide', [
 'label'=>'Hero Slides','public'=>true,'show_in_rest'=>true,'has_archive'=>false,
 'rewrite'=>['slug'=>'slides'],'supports'=>['title','thumbnail','excerpt']
]);
register_post_type('client', [
 'label'=>'Clients','public'=>true,'show_in_rest'=>true,'has_archive'=>false,
 'rewrite'=>['slug'=>'clients'],'supports'=>['title','thumbnail']
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

function logico_clone_get_slides(){
$slides = get_posts(['post_type'=>'hero_slide','posts_per_page'=>-1,'orderby'=>'menu_order','order'=>'ASC']);
return $slides;
}

// ensure demo ship/cargo slides exist (runs once on init)
add_action('init', function(){
  if (get_option('logico_clone_demo_slides_added')) return;
  if (!defined('ABSPATH')) return;
  require_once ABSPATH.'wp-admin/includes/media.php';
  require_once ABSPATH.'wp-admin/includes/file.php';
  require_once ABSPATH.'wp-admin/includes/image.php';
  $base = get_template_directory_uri().'/assets/images/';
  $urls = [
    $base.'ship1.jpg',
    $base.'ship2.jpg',
    $base.'ship3.jpg',
    $base.'ship4.jpg'
  ];
  foreach($urls as $ix=>$u){
    $sid = wp_insert_post(['post_type'=>'hero_slide','post_title'=>'Ship Slide '.($ix+1),'post_status'=>'publish']);
    if($sid && function_exists('media_sideload_image')){
      $att = media_sideload_image($u,$sid,null,'id');
      if(!is_wp_error($att)) set_post_thumbnail($sid,$att);
    }
  }
  update_option('logico_clone_demo_slides_added', 1);
});

// one-time demo content seeding (runs in admin once)
add_action('admin_init', function(){
  if (get_option('logico_clone_seeded')) return;
  if (!current_user_can('manage_options')) return;
  require_once ABSPATH.'wp-admin/includes/media.php';
  require_once ABSPATH.'wp-admin/includes/file.php';
  require_once ABSPATH.'wp-admin/includes/image.php';

  // helper: create page by slug with template
  $create_page = function($title,$slug,$template=''){ $existing = get_page_by_path($slug); if($existing) return $existing->ID; return wp_insert_post(['post_title'=>$title,'post_name'=>$slug,'post_status'=>'publish','post_type'=>'page']); };
  $set_template = function($page_id,$template){ if($template){ update_post_meta($page_id,'_wp_page_template',$template); } };

  // pages
  $home_id = $create_page('Home','home');
  $about_id = $create_page('About Us','about'); $set_template($about_id,'page-about.php');
  $services_id = $create_page('Services','services'); $set_template($services_id,'page-services.php');
  $clients_id = $create_page('Our Clients','clients'); $set_template($clients_id,'page-clients.php');
  $contact_id = $create_page('Contact Us','contact'); $set_template($contact_id,'page-contact.php');

  // set homepage
  update_option('show_on_front','page');
  update_option('page_on_front',$home_id);

  // menu
  $menu_name = 'Main Menu';
  $menu_id = wp_get_nav_menu_object($menu_name) ? wp_get_nav_menu_object($menu_name)->term_id : wp_create_nav_menu($menu_name);
  $add_menu_item = function($menu_id,$title,$url){ wp_update_nav_menu_item($menu_id,0,['menu-item-title'=>$title,'menu-item-url'=>$url,'menu-item-status'=>'publish']); };
  $add_menu_item($menu_id,'Home',home_url('/'));
  $add_menu_item($menu_id,'Pages',home_url('/about'));
  $add_menu_item($menu_id,'Services',get_permalink($services_id));
  $add_menu_item($menu_id,'Shop','#');
  $add_menu_item($menu_id,'Blog',home_url('/blog'));
  $add_menu_item($menu_id,'Contacts',get_permalink($contact_id));
  $locations = get_theme_mod('nav_menu_locations'); if(!is_array($locations)) $locations=[]; $locations['primary']=$menu_id; $locations['footer']=$menu_id; set_theme_mod('nav_menu_locations',$locations);

  // sample services
  if (!get_posts(['post_type'=>'service','posts_per_page'=>1])){
    $svc = [
      ['Sea Freight','Efficient ocean cargo solutions.','https://images.unsplash.com/photo-1536323760109-ca8c07450053?q=80&w=1200&auto=format&fit=crop'],
      ['Project Cargo','Heavy & oversized logistics.','https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop'],
      ['Warehousing','Secure storage and inventory control.','https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop'],
    ];
    foreach($svc as $s){
      $id = wp_insert_post(['post_type'=>'service','post_title'=>$s[0],'post_excerpt'=>$s[1],'post_status'=>'publish']);
      if($id){ $img = media_sideload_image($s[2],$id,null,'id'); if(!is_wp_error($img)) set_post_thumbnail($id,$img); }
    }
  }

  // sample hero slides
  if (!logico_clone_get_slides()){
    $imgs = [
      'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536323760109-ca8c07450053?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917729352-9f7f0b43e2d1?q=80&w=1600&auto=format&fit=crop'
    ];
    foreach($imgs as $ix=>$u){
      $sid = wp_insert_post(['post_type'=>'hero_slide','post_title'=>'Slide '.($ix+1),'post_status'=>'publish']);
      if($sid){ $img = media_sideload_image($u,$sid,null,'id'); if(!is_wp_error($img)) set_post_thumbnail($sid,$img); }
    }
  }

  // sample clients
  if (!get_posts(['post_type'=>'client','posts_per_page'=>1])){
    $logos = [
      'https://dummyimage.com/300x150/00c6af/ffffff.png&text=Client+A',
      'https://dummyimage.com/300x150/00c6af/ffffff.png&text=Client+B',
      'https://dummyimage.com/300x150/00c6af/ffffff.png&text=Client+C'
    ];
    foreach($logos as $ix=>$u){
      $cid = wp_insert_post(['post_type'=>'client','post_title'=>'Client '.chr(65+$ix),'post_status'=>'publish']);
      if($cid){ $img = media_sideload_image($u,$cid,null,'id'); if(!is_wp_error($img)) set_post_thumbnail($cid,$img); }
    }
  }

  update_option('logico_clone_seeded', 1);
});

// optional: import content from destination.com.sa (best-effort)
add_action('admin_init', function(){
  if (get_option('logico_clone_imported_destination')) return;
  if (!current_user_can('manage_options')) return;
  $map = [
    'about' => 'https://destination.com.sa/about/',
    'services' => 'https://destination.com.sa/services/',
    'clients' => 'https://destination.com.sa/clients/',
    'contact' => 'https://destination.com.sa/contact/',
    'home' => 'https://destination.com.sa/'
  ];
  foreach($map as $slug=>$url){
    $page = get_page_by_path($slug);
    if (!$page) continue;
    $res = wp_remote_get($url, ['timeout'=>10]);
    if (is_wp_error($res)) continue;
    $html = wp_remote_retrieve_body($res);
    if (!$html) continue;
    $content = '';
    if (preg_match('/<main[\s\S]*?>([\s\S]*?)<\/main>/i',$html,$m)) { $content = $m[1]; }
    else if (preg_match('/<article[\s\S]*?>([\s\S]*?)<\/article>/i',$html,$m)) { $content = $m[1]; }
    else if (preg_match('/<body[\s\S]*?>([\s\S]*?)<\/body>/i',$html,$m)) { $content = $m[1]; }
    if ($content){
      $content = wp_kses_post($content);
      wp_update_post(['ID'=>$page->ID,'post_content'=>$content]);
    }
  }
  update_option('logico_clone_imported_destination', 1);
});

// branding: rename Logico -> Shipify; set site name and hero images from demo URL
add_action('admin_init', function(){
  if (get_option('logico_clone_brand_applied')) return;
  if (!current_user_can('manage_options')) return;
  update_option('blogname','Shipify');
  update_option('blogdescription','Reliable shipping and logistics');

  // replace occurrences in pages/posts
  $posts = get_posts(['post_type'=>['page','post','service','testimonial'],'posts_per_page'=>-1]);
  foreach($posts as $p){
    $title = str_replace('Logico','Shipify',$p->post_title);
    $content = str_replace('Logico','Shipify',$p->post_content);
    if ($title !== $p->post_title || $content !== $p->post_content){
      wp_update_post(['ID'=>$p->ID,'post_title'=>$title,'post_content'=>$content]);
    }
  }

  // import hero images from demo (best effort)
  $demo = 'https://demo.artureanec.com/themes/logico-rounded/home-3/';
  $res = wp_remote_get($demo, ['timeout'=>10]);
  if (!is_wp_error($res)){
    $html = wp_remote_retrieve_body($res);
    if ($html){
      preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $m);
      if (!empty($m[1])){
        $imported = 0;
        foreach($m[1] as $src){
          if ($imported >= 5) break;
          if (!preg_match('/\.(jpg|jpeg|png)$/i',$src)) continue;
          $sid = wp_insert_post(['post_type'=>'hero_slide','post_title'=>'Slide '.($imported+1),'post_status'=>'publish']);
          if($sid){ $img = media_sideload_image($src,$sid,null,'id'); if(!is_wp_error($img)) { set_post_thumbnail($sid,$img); $imported++; } }
        }
      }
    }
  }

  update_option('logico_clone_brand_applied', 1);
});
