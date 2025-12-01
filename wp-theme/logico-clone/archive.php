<?php get_header(); ?>
<section class="section">
  <div class="container">
    <h1 class="section-title"><?php the_archive_title(); ?></h1>
    <?php if(have_posts()): ?>
      <div class="grid-3">
      <?php while(have_posts()): the_post(); ?>
        <article class="card">
          <h2 class="title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
          <p class="desc"><?php the_excerpt(); ?></p>
        </article>
      <?php endwhile; ?>
      </div>
    <?php endif; ?>
  </div>
</section>
<?php get_footer(); ?>

