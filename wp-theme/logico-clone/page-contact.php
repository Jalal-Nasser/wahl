<?php /* Template Name: Contact */ get_header(); ?>
<section class="section">
  <div class="container">
    <h1 class="section-title">Contact Us</h1>
    <div style="max-width:720px">
      <?php echo do_shortcode('[contact-form-7 id="1" title="Contact"]'); ?>
    </div>
    <div class="grid-3" style="margin-top:24px">
      <div class="card"><div class="title">Head Office</div><div class="desc">UA, Kyiv, Miry 45</div></div>
      <div class="card"><div class="title">Phone</div><div class="desc">+1 800 829 1037</div></div>
      <div class="card"><div class="title">Email</div><div class="desc">logico@email.co</div></div>
    </div>
  </div>
</section>
<?php get_footer(); ?>

