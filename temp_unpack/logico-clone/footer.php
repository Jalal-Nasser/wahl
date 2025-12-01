<?php
?>
</main>
<footer class="site-footer">
  <div class="container footer-columns">
    <div>
      <div class="footer-title">About</div>
      <p>Professional logistics solutions with global reach.</p>
    </div>
    <div>
      <div class="footer-title">Services</div>
      <ul>
        <?php foreach(get_terms(['taxonomy'=>'service_category','hide_empty'=>false]) as $term): ?>
          <li><a class="footer-link" href="<?php echo esc_url(get_term_link($term)); ?>"><?php echo esc_html($term->name); ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>
    <div>
      <div class="footer-title">Quick Links</div>
      <?php wp_nav_menu(['theme_location'=>'footer','container'=>false]); ?>
    </div>
    <div>
      <div class="footer-title">Contact</div>
      <p>info@example.com<br/>+1 555 0100</p>
    </div>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>

