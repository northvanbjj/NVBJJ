const NVB_CONFIG = {
  formEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  bookingUrl: null,
  // Maps JavaScript API — loads the Places library in the browser
  googleMapsApiKey: 'AIzaSyAktREvTTiJA6Ion7T8GMQGkgxx9a3HNIY',
  // Places API (New) — rotate both keys after go-live
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

  function bindTrialForm() {
    const trialForm = document.getElementById('trial-form');
    if (!trialForm || trialForm.dataset.bound) return;
    trialForm.dataset.bound = 'true';

    const formSuccess = trialForm.closest('.form-wrap')?.querySelector('.form-msg.success')
      || document.querySelector('.form-msg.success');
    const formError = trialForm.closest('.form-wrap')?.querySelector('.form-msg.error')
      || document.querySelector('.form-msg.error');

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

  const partialBase = document.body.dataset.partialBase || '';
  Promise.all([
    loadPartial('[data-include="trial-form"]', `${partialBase}partials/trial-form.html`),
    loadPartial('[data-include="trial-copy"]', `${partialBase}partials/trial-copy.html`),
  ]).then(bindTrialForm);
})();
