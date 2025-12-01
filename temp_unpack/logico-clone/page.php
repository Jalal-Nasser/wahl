<?php get_header(); ?>
<section class="section">
  <div class="container">
    <h1 class="section-title"><?php the_title(); ?></h1>
    <div>
      <?php while(have_posts()): the_post(); the_content(); endwhile; ?>
    </div>
  </div>
</section>
<?php get_footer(); ?>

