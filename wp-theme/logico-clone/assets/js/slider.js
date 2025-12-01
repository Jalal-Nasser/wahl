document.addEventListener('DOMContentLoaded',function(){
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  if(!slides.length) return;
  // If server rendered fewer slides, build from data-images
  var container = document.querySelector('.hero-slides');
  if (container && slides.length < 2 && container.dataset.images){
    var urls = container.dataset.images.split(',').filter(Boolean);
    urls.forEach(function(u){
      var d = document.createElement('div');
      d.className = 'hero-slide';
      d.style.backgroundImage = 'url("'+u+'")';
      container.appendChild(d);
    });
    slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  }
  var i = 0;
  function setActive(idx){
    slides.forEach(function(s,k){
      if(k===idx){ s.style.opacity = 1; s.classList.add('active'); }
      else { s.style.opacity = 0; s.classList.remove('active'); }
    });
    var dots = Array.prototype.slice.call(document.querySelectorAll('.slider-dots .dot'));
    dots.forEach(function(d,k){ d.classList.toggle('active',k===idx); });
    var sc = document.querySelector('.slide-count');
    if(sc){ sc.textContent = String(idx+1).padStart(2,'0') + '/' + String(slides.length).padStart(2,'0'); }
  }
  setActive(0);
  var left = document.querySelector('.arrow.left');
  var right = document.querySelector('.arrow.right');
  if(left) left.addEventListener('click',function(e){ e.preventDefault(); i=(i-1+slides.length)%slides.length; setActive(i); });
  if(right) right.addEventListener('click',function(e){ e.preventDefault(); i=(i+1)%slides.length; setActive(i); });
  var dots = Array.prototype.slice.call(document.querySelectorAll('.slider-dots .dot'));
  dots.forEach(function(d,k){ d.addEventListener('click',function(){ i=k; setActive(i); }); });
  if(slides.length>1){ setInterval(function(){ i=(i+1)%slides.length; setActive(i); }, 5000); }
});
