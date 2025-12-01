<?php get_header(); ?>
<section class="hero">
  <?php 
    $slides = logico_clone_get_slides(); 
    $fallback = [
      'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909212-d5b21d4f0b37?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536323760109-ca8c07450053?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501881298617-2a3d83a65c62?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503236821534-4a0b4f06ce30?q=80&w=2000&auto=format&fit=crop'
    ];
    $images = [];
    if (!empty($slides)) { foreach($slides as $s){ $u = get_the_post_thumbnail_url($s,'full'); if($u){ $images[] = $u; } } }
    if (empty($images)) { $images = $fallback; }
    $count = count($images);
  ?>
  <div class="hero-slides" data-images="<?php echo esc_attr(implode(',', $images)); ?>">
    <?php foreach($images as $u): ?>
      <div class="hero-slide" style="background-image:url('<?php echo esc_url($u); ?>')"></div>
    <?php endforeach; ?>
  </div>
  <div class="container">
    <h1 class="title">CARGO SERVICES<br/>IN OUR COUNTRY</h1>
    <div class="actions">
      <a href="/services" class="btn" style="background:#fff;color:#111827">More</a>
    </div>
  </div>
  <div class="slider-dots">
    <?php for($i=0;$i<$count;$i++): ?>
      <div class="dot<?php echo $i===0?' active':''; ?>"></div>
    <?php endfor; ?>
  </div>
  <div class="chat-bubble">Hello</div>
  <a class="arrow left" href="#">←</a>
  <a class="arrow right" href="#">→</a>
  <div class="slide-count">01/02</div>
  <div class="overlay-panel">
    <div class="track-card">
      <div>Track your order</div>
      <input placeholder="Enter your tracking number" />
    </div>
    <div class="watch-card">
      <div class="play">▶</div>
      <div>Watch video</div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container services-intro">
    <div class="heading">LOGISTIC SERVICES WHICH WE<br/>PROVIDE TO OUR CUSTOMERS</div>
    <div class="grid-3" style="margin-top:24px">
      <article class="card">
        <div class="icon">📦</div>
        <h3 class="title">Sea freight</h3>
        <p class="desc">Efficient ocean cargo solutions.</p>
      </article>
      <article class="card card-dark">
        <h3 class="title">Project cargo</h3>
        <p class="desc">Specialized heavy and oversized logistics.</p>
      </article>
      <article class="card card-accent">
        <h3 class="title">Warehousing</h3>
        <p class="desc">Secure storage and inventory control.</p>
      </article>
    </div>
  </div>
  </section>

<section class="section">
  <div class="container big-number-line">
    <div class="num">79 345</div>
    <div class="text">TONS OF PRODUCTIONS WEF</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="hex-outline">
      <div class="since-outline">Since 2000</div>
    </div>
    <h2 class="section-title" style="margin-top:16px">SPECIAL THINGS WHICH<br/>WE DO FOR OUR CLIENTS</h2>
    <div class="features-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:16px">
      <div class="card"><div class="icon">🚢</div><div class="title">Transport</div><div class="desc">Sea and land</div></div>
      <div class="card"><div class="icon">🏭</div><div class="title">Warehouse</div><div class="desc">Safe and secure</div></div>
      <div class="card"><div class="icon">📦</div><div class="title">Logistics</div><div class="desc">End-to-end</div></div>
    </div>
  </div>
</section>

<section class="tracking-banner">
  <div class="container">
    <div class="label">PROVIDE QUICK<br/>TRACKING YOUR CARGO</div>
    <div class="stats-row">
      <div class="item"><div class="num">7,500</div><div>Packages delivered</div></div>
      <div class="item"><div class="num">2.6 bil</div><div>Miles traveled</div></div>
      <div class="item"><div class="num">100+</div><div>Countries served</div></div>
      <div class="item"><div class="num">550+</div><div>Employees</div></div>
    </div>
    <div class="feature-icons-row"><span>Transport</span><span>Freight</span><span>Warehouse</span><span>Logistics</span></div>
  </div>
</section>

<section class="section">
  <div class="container air-block">
    <div class="image"><img src="https://images.unsplash.com/photo-1512917729352-9f7f0b43e2d1?q=80&w=1200&auto=format&fit=crop" alt="Air freight" /></div>
    <div>
      <h3 class="section-title" style="font-size:20px">AIR FREIGHT FEATURES<br/>ON THIS SERVICE</h3>
      <p class="section-sub">Efficient worldwide air cargo solutions.</p>
      <a class="btn" href="#">Read more</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container counters">
    <div class="counter"><div class="num">05</div><div class="title">Shipping world</div><div class="desc">Global coverage</div></div>
    <div class="counter"><div class="num">06</div><div class="title">Fast transport</div><div class="desc">On-time delivery</div></div>
    <div class="counter"><div class="num">07</div><div class="title">Safe & secure</div><div class="desc">Reliable handling</div></div>
    <div class="counter"><div class="num">08</div><div class="title">Delivery on time</div><div class="desc">Precision logistics</div></div>
  </div>
</section>

<section class="section">
  <div class="container testimonial-dark">
    <div>We design & make it make sense</div>
    <div class="accent" style="font-size:22px;margin:12px 0">❝</div>
    <p>Professional logistics with modern technology and customer-focused operations.</p>
    <div style="margin-top:12px">2021 • ●</div>
  </div>
</section>

<section class="section">
  <div class="container team">
    <?php
      $team = get_posts(['post_type'=>'team_member','posts_per_page'=>3]);
      foreach($team as $m):
        $img = get_the_post_thumbnail($m,'medium');
    ?>
      <div class="member">
        <?php echo $img ?: '<img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop" alt="Member" />'; ?>
        <div class="name"><?php echo esc_html(get_the_title($m)); ?></div>
        <div class="role"><?php echo esc_html(get_the_excerpt($m)); ?></div>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="blog-cards">
      <?php $posts = get_posts(['post_type'=>'post','posts_per_page'=>3]); foreach($posts as $p): ?>
        <article class="card">
          <div class="section-sub">Logistics</div>
          <h3 class="title"><a href="<?php echo esc_url(get_permalink($p)); ?>"><?php echo esc_html(get_the_title($p)); ?></a></h3>
          <p class="desc"><?php echo esc_html(get_the_excerpt($p)); ?></p>
          <a class="btn" href="<?php echo esc_url(get_permalink($p)); ?>">Read more</a>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section" style="padding-top:24px">
  <div class="container gallery">
    <img src="https://images.unsplash.com/photo-1556909212-d5b21d4f0b37?q=80&w=600&auto=format&fit=crop" alt="Ship"/>
    <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=600&auto=format&fit=crop" alt="Container"/>
    <img src="https://images.unsplash.com/photo-1512917729352-9f7f0b43e2d1?q=80&w=600&auto=format&fit=crop" alt="Air"/>
  </div>
</section>
<?php get_footer(); ?>
