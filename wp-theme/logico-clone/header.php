<?php
?><!doctype html>
<html <?php language_attributes(); ?>
<head>
<meta charset="<?php bloginfo('charset'); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<header class="site-header">
  <div class="container">
    <nav class="nav">
      <a href="<?php echo esc_url(home_url('/')); ?>" aria-label="Home">
        <img src="<?php echo esc_url(get_template_directory_uri().'/assets/images/logo-shipify.svg'); ?>" alt="Shipify" style="height:28px"/>
      </a>
      <?php 
        if (has_nav_menu('primary')) {
          wp_nav_menu(['theme_location'=>'primary','container'=>false,'menu_class'=>'menu']); 
        } else {
          echo '<ul class="menu"><li><a href="/">Home</a></li><li><a href="#">Pages ▾</a><ul class="submenu"><li><a href="/about">About</a></li><li><a href="/contact">Contacts</a></li></ul></li><li><a href="#">Services ▾</a><ul class="submenu"><li><a href="/services">All Services</a></li></ul></li><li><a href="#">Shop ▾</a></li><li><a href="/blog">Blog</a></li><li><a href="/contact">Contacts</a></li></ul>';
        }
      ?>
      <div class="nav-actions">
        <a class="btn-quote" href="#">Get a quote</a>
      </div>
    </nav>
  </div>
</header>
<main>
