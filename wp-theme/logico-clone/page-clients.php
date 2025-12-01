<?php /* Template Name: Clients */ get_header(); ?>
<section class="section">
  <div class="container">
    <h1 class="section-title">Our Clients</h1>
    <div class="grid-3">
      <?php $clients = get_posts(['post_type'=>'client','posts_per_page'=>-1]); foreach($clients as $c): ?>
        <article class="card" style="text-align:center">
          <?php echo get_the_post_thumbnail($c,'medium'); ?>
          <div class="title"><?php echo esc_html(get_the_title($c)); ?></div>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php get_footer(); ?>

