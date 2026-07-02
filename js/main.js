const NVB_CONFIG = {
  formEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  bookingUrl: null,
};

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

  const heroMedia = document.querySelector('.hero-media');
  const heroPlay = document.querySelector('.hero-play');
  const heroVideo = document.querySelector('.hero-video');

  if (heroPlay && heroVideo && heroMedia) {
    heroPlay.addEventListener('click', () => {
      heroMedia.classList.add('is-playing');
      heroVideo.play();
    });
  }

  document.querySelectorAll('.schedule-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;
      document.querySelectorAll('.schedule-tab').forEach((t) => t.classList.remove('is-active'));
      document.querySelectorAll('.schedule-panel').forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.getElementById(`schedule-${day}`)?.classList.add('is-active');
    });
  });

  function handleTrialClick(e) {
    if (NVB_CONFIG.bookingUrl) {
      e.preventDefault();
      window.open(NVB_CONFIG.bookingUrl, '_blank', 'noopener');
      return;
    }
    const target = document.getElementById('book-trial') || document.getElementById('trial-form');
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      const input = target.querySelector('input[name="name"]');
      if (input) setTimeout(() => input.focus(), 500);
    }
  }

  document.querySelectorAll('[data-action="book-trial"]').forEach((btn) => {
    btn.addEventListener('click', handleTrialClick);
  });

  const trialForm = document.getElementById('trial-form');
  const formSuccess = document.querySelector('.form-msg.success');
  const formError = document.querySelector('.form-msg.error');

  if (trialForm) {
    trialForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formSuccess?.classList.remove('is-visible');
      formError?.classList.remove('is-visible');

      const endpoint = trialForm.getAttribute('action') || NVB_CONFIG.formEndpoint;
      if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
        if (formError) {
          formError.textContent = 'TODO: Add your Formspree ID in js/main.js';
          formError.classList.add('is-visible');
        }
        return;
      }

      const submitBtn = trialForm.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(trialForm),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          trialForm.reset();
          formSuccess?.classList.add('is-visible');
        } else throw new Error();
      } catch {
        if (formError) {
          formError.textContent = 'Something went wrong. Call 604-770-1766 or email info@northvanbjj.com';
          formError.classList.add('is-visible');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
})();
