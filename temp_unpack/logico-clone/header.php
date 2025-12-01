<?php
?><!doctype html>
<html <?php language_attributes(); ?>>
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
        <span style="font-weight:700;color:var(--color-primary)">LOGICO</span>
      </a>
      <?php wp_nav_menu(['theme_location'=>'primary','container'=>false,'menu_class'=>'menu']); ?>
      <div class="nav-icons">
        <a class="icon" href="#" aria-label="Search">🔍</a>
        <a class="icon" href="#" aria-label="Account">👤</a>
        <a class="icon" href="#" aria-label="Cart">🛒</a>
        <button class="icon" aria-label="Toggle navigation">☰</button>
      </div>
    </nav>
  </div>
</header>
<main>
