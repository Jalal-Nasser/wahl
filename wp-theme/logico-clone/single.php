<?php get_header(); ?>
<section class="section">
  <div class="container">
    <?php while(have_posts()): the_post(); ?>
      <article>
        <h1 class="section-title"><?php the_title(); ?></h1>
        <div><?php the_content(); ?></div>
      </article>
    <?php endwhile; ?>
  </div>
</section>
<?php get_footer(); ?>

