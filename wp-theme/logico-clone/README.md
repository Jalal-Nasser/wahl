# Logico Clone WordPress Theme

## Installation

1. Ensure a WordPress 6.4+ site running PHP 8.1+ and MySQL 8.
2. Copy the `logico-clone` directory to `wp-content/themes/`.
3. In WordPress Admin → Appearance → Themes, activate **Logico Clone**.
4. Go to Appearance → Menus and assign menus to **Primary** and **Footer**.
5. Create sample content:
   - Add Services (`service` post type) with categories under **Service Categories**.
   - Add Testimonials (`testimonial` post type).
   - Set **Homepage**: Create a page named Home and set it as the homepage or use the theme’s front page.
6. Install plugins: Contact Form 7, Yoast SEO, W3 Total Cache, Smush.
7. Create a Contact Form 7 form and update the shortcode in `template-parts/contact-form.php`.

## Notes

- Homepage sections: hero, services grid, stats, testimonials, latest news.
- Styling and layout are built to mirror the Logico Rounded demo.
- Customize colors and branding via `style.css`.

