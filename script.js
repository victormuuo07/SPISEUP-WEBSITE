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

});
