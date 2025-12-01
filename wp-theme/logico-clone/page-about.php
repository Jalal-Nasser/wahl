<?php /* Template Name: About */ get_header(); ?>
<section class="section">
  <div class="container">
    <h1 class="section-title">About Us</h1>
    <div>
      <?php while(have_posts()): the_post(); the_content(); endwhile; ?>
    </div>
    <div class="team" style="margin-top:24px">
      <?php $team = get_posts(['post_type'=>'team_member','posts_per_page'=>-1]); foreach($team as $m): ?>
        <div class="member">
          <?php echo get_the_post_thumbnail($m,'medium'); ?>
          <div class="name"><?php echo esc_html(get_the_title($m)); ?></div>
          <div class="role"><?php echo esc_html(get_the_excerpt($m)); ?></div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php get_footer(); ?>

