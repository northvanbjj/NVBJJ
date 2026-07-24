const NVB_CONFIG = {
  bookingUrl: null,
  googleMapsApiKey: 'AIzaSyAktREvTTiJA6Ion7T8GMQGkgxx9a3HNIY',
  googlePlacesApiKey: 'AIzaSyBxRfna4RgpedQIkEVjrWhTwVL8oHR0RPI',
};

window.NVB_CONFIG = NVB_CONFIG;

(function () {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');

  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      navMobile.classList.toggle('is-open', !open);
      document.body.style.overflow = open ? '' : 'hidden';
    });

    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  function handleTrialClick(e) {
    if (NVB_CONFIG.bookingUrl) {
      e.preventDefault();
      window.open(NVB_CONFIG.bookingUrl, '_blank', 'noopener');
      return;
    }
    const target = document.getElementById('book-trial')
      || document.getElementById('gymdesk-forms-embed');
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  document.querySelectorAll('[data-action="book-trial"]').forEach((btn) => {
    btn.addEventListener('click', handleTrialClick);
  });

  if (window.location.hash === '#book-trial') {
    const target = document.getElementById('book-trial');
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }

  async function loadPartial(selector, url) {
    const mount = document.querySelector(selector);
    if (!mount) return;
    try {
      const res = await fetch(url);
      if (res.ok) mount.innerHTML = await res.text();
    } catch {
      /* partial unavailable offline */
    }
  }

  const partialBase = document.body.dataset.partialBase || '';
  loadPartial('[data-include="trial-copy"]', `${partialBase}partials/trial-copy.html`);
})();
