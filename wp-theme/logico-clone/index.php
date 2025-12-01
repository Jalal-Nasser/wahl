<?php get_header(); ?>
<section class="section">
  <div class="container">
    <?php if(have_posts()): ?>
      <?php while(have_posts()): the_post(); ?>
        <article class="card">
          <h2 class="title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
          <p class="desc"><?php the_excerpt(); ?></p>
        </article>
      <?php endwhile; ?>
    <?php else: ?>
      <p>No content found.</p>
    <?php endif; ?>
  </div>
</section>
<?php get_footer(); ?>

