<?php
?>
</main>
<section class="footer-cta">
  <div class="container">
    <h2 class="cta-title">Ready for Digital Transformation?</h2>
    <p class="cta-sub">Let's discuss how our IT solutions can drive your business growth</p>
    <a href="#contact" class="cta-button">CONTACT US TODAY →</a>
  </div>
</section>
<footer class="site-footer">
  <div class="container footer-wrapper">
    <div class="footer-grid">
      <div class="footer-brand">
        <img class="brand-logo" src="<?php echo esc_url(get_template_directory_uri().'/assets/images/logo-shipify.svg'); ?>" alt="Shipify" />
        <div class="underline"></div>
        <p class="brand-text">Trusted shipping partner delivering innovative logistics solutions across the GCC.</p>
        <div class="social">
          <a href="#" aria-label="LinkedIn" class="social-item"><img src="<?php echo esc_url(get_template_directory_uri().'/assets/icons/linkedin.svg'); ?>" alt="LinkedIn"/></a>
          <a href="#" aria-label="Twitter" class="social-item"><img src="<?php echo esc_url(get_template_directory_uri().'/assets/icons/twitter.svg'); ?>" alt="Twitter"/></a>
          <a href="#" aria-label="Facebook" class="social-item"><img src="<?php echo esc_url(get_template_directory_uri().'/assets/icons/facebook.svg'); ?>" alt="Facebook"/></a>
        </div>
      </div>
      <div class="footer-links">
        <div class="footer-heading">Quick Links<div class="underline"></div></div>
        <?php if (has_nav_menu('footer')) { wp_nav_menu(['theme_location'=>'footer','container'=>false,'menu_class'=>'footer-list']); } else { echo '<ul class="footer-list"><li><a class="footer-link" href="/">Home</a></li><li><a class="footer-link" href="/about">About Us</a></li><li><a class="footer-link" href="/services">Services</a></li><li><a class="footer-link" href="#">Our Apps</a></li><li><a class="footer-link" href="/contact">Contact</a></li></ul>'; } ?>
      </div>
      <div class="footer-contact">
        <div class="footer-heading">Contact Information<div class="underline"></div></div>
        <ul class="contact-list">
          <li class="contact-item">
            <span class="contact-icon"><img src="<?php echo esc_url(get_template_directory_uri().'/assets/icons/location.svg'); ?>" alt="Location"/></span>
            <span>Dammam, Saudi Arabia</span>
          </li>
          <li class="contact-item">
            <span class="contact-icon"><img src="<?php echo esc_url(get_template_directory_uri().'/assets/icons/phone.svg'); ?>" alt="Phone"/></span>
            <span>+966 12 345 6789</span>
          </li>
          <li class="contact-item">
            <span class="contact-icon"><img src="<?php echo esc_url(get_template_directory_uri().'/assets/icons/mail.svg'); ?>" alt="Email"/></span>
            <span>info@wahl.sa</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="copy">© <?php echo date('Y'); ?> Shipify. All rights reserved.</div>
      <div class="mini-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
