<?php /* Template Name: Services */ get_header(); ?>
<section class="section">
  <div class="container">
    <h1 class="section-title">Services</h1>
    <div class="grid-3">
      <?php foreach(logico_clone_get_services(-1) as $service): ?>
        <article class="card">
          <?php echo get_the_post_thumbnail($service,'medium'); ?>
          <h3 class="title"><a href="<?php echo esc_url(get_permalink($service)); ?>"><?php echo esc_html(get_the_title($service)); ?></a></h3>
          <p class="desc"><?php echo esc_html(get_the_excerpt($service)); ?></p>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php get_footer(); ?>

