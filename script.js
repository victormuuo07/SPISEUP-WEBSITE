// Shared interactive functionality for all SpiseUp pages
document.addEventListener('DOMContentLoaded', function () {

  // Toast notification
  function showMessage(msg, isSuccess = true) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = isSuccess ? '#5c0f10' : '#d4291f';
    toast.style.color = '#fff8ec';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '48px';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'Inter, sans-serif';
    toast.style.boxShadow = '0 12px 22px rgba(0,0,0,0.25)';
    toast.style.textAlign = 'center';
    toast.style.maxWidth = '90vw';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // "See Our Product" button on the homepage scrolls to the product spotlight
  const exploreBtn = document.querySelector('.explore-menu');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      const section = document.querySelector('.menu-preview');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Feature card clicks — light, informative nudge
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3')?.innerText;
      if (title) showMessage(`🌶 ${title} — message us on WhatsApp to learn more.`);
    });
  });

  // Contact form — no backend yet, so confirm receipt locally
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formMessage) {
        formMessage.innerText = "Thanks — for the fastest reply, message us directly on WhatsApp at +254 792 007 986.";
      }
      showMessage('✅ Message noted! We\u2019ll follow up soon.');
      contactForm.reset();
    });
  }

  // ---------------------------------------------------------------
  // Interactive tilt effect on the hero product image
  // ---------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiltWrap = document.getElementById('tiltWrap');
  const tiltTarget = document.getElementById('tiltTarget');
  if (tiltWrap && tiltTarget && !prefersReducedMotion) {
    const maxTilt = 12; // degrees
    function applyTilt(clientX, clientY) {
      const rect = tiltWrap.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;  // 0..1
      const py = (clientY - rect.top) / rect.height;  // 0..1
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      tiltTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    }
    function resetTilt() {
      tiltTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    }
    tiltWrap.addEventListener('mousemove', (e) => applyTilt(e.clientX, e.clientY));
    tiltWrap.addEventListener('mouseleave', resetTilt);
    tiltWrap.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) applyTilt(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    tiltWrap.addEventListener('touchend', resetTilt);
  }

  // ---------------------------------------------------------------
  // Testimonials — rendered from data/testimonials.js
  // ---------------------------------------------------------------
  const testimonialGrid = document.getElementById('testimonialGrid');
  if (testimonialGrid && typeof spiseupTestimonials !== 'undefined') {
    const realOnes = spiseupTestimonials.filter(t => t.quote && !/^PASTE/i.test(t.quote.trim()));
    if (realOnes.length === 0) {
      testimonialGrid.innerHTML = '<div class="testimonials-empty">Customer stories coming soon — check back shortly!</div>';
    } else {
      testimonialGrid.innerHTML = realOnes.map(t => `
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <div class="testimonial-quote">"${t.quote}"</div>
          <div class="testimonial-name">— ${t.name || 'SpiseUp customer'}</div>
        </div>
      `).join('');
    }
  }

  // ---------------------------------------------------------------
  // Gallery — rendered from data/gallery.js, broken/missing files
  // are skipped silently (no broken-image icons on the live site)
  // ---------------------------------------------------------------
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(item) {
    if (!lightbox || !lightboxContent) return;
    lightboxContent.innerHTML = item.type === 'video'
      ? `<video src="${item.src}" controls autoplay playsinline></video>`
      : `<img src="${item.src}" alt="${item.caption || 'SpiseUp gallery photo'}">`;
    lightbox.classList.add('open');
  }
  function closeLightbox() {
    if (!lightbox || !lightboxContent) return;
    lightbox.classList.remove('open');
    lightboxContent.innerHTML = '';
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  if (galleryGrid && typeof spiseupGallery !== 'undefined') {
    spiseupGallery.forEach(item => {
      const cell = document.createElement('div');
      cell.className = 'gallery-item';

      if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.onerror = () => cell.remove();
        cell.appendChild(video);
        const badge = document.createElement('div');
        badge.className = 'play-badge';
        badge.innerText = '▶';
        cell.appendChild(badge);
      } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.caption || 'SpiseUp in use';
        img.onerror = () => cell.remove();
        cell.appendChild(img);
      }

      cell.addEventListener('click', () => openLightbox(item));
      galleryGrid.appendChild(cell);
    });
  }

  // ---------------------------------------------------------------
  // Become a Stockist form — builds a pre-filled WhatsApp message
  // ---------------------------------------------------------------
  const stockistForm = document.getElementById('stockistForm');
  if (stockistForm) {
    stockistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('stkName')?.value || '';
      const business = document.getElementById('stkBusiness')?.value || '';
      const location = document.getElementById('stkLocation')?.value || '';
      const phone = document.getElementById('stkPhone')?.value || '';
      const type = document.getElementById('stkType')?.value || '';
      const message = `Hi SpiseUp, I'd like to become a stockist.%0A%0AName: ${name}%0ABusiness: ${business}%0AType: ${type}%0ALocation: ${location}%0APhone: ${phone}`;
      window.open(`https://wa.me/254792007986?text=${message}`, '_blank');
    });
  }

});
