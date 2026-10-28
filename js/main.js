const NVB_CONFIG = {
  bookingUrl: null,
  googleMapsApiKey: 'AIzaSyAktREvTTiJA6Ion7T8GMQGkgxx9a3HNIY',
  googlePlacesApiKey: 'AIzaSyBxRfna4RgpedQIkEVjrWhTwVL8oHR0RPI',
};

window.NVB_CONFIG = NVB_CONFIG;

function normalizeGitHubPagesLinks() {
  const pagePath = window.location.pathname.replace(/\/+$/, '');
  const isNestedPage = /\/(programs|blog)(?:\/|$)/.test(pagePath);

  const toRelative = (href) => {
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('data:')) return href;
    if (href.startsWith('#')) return href;
    if (href.startsWith('/#')) return href.slice(1);

    const normalized = href.replace(/\/+$/, '');
    const mapping = {
      '/': './',
      '/index.html': './',
      '/new-to-jiu-jitsu': isNestedPage ? '../new-to-jiu-jitsu.html' : 'new-to-jiu-jitsu.html',
      '/new-to-jiu-jitsu.html': isNestedPage ? '../new-to-jiu-jitsu.html' : 'new-to-jiu-jitsu.html',
      '/programs': isNestedPage ? 'index.html' : 'programs/index.html',
      '/programs/': isNestedPage ? 'index.html' : 'programs/index.html',
      '/programs/index.html': isNestedPage ? 'index.html' : 'programs/index.html',
      '/programs/combatives': isNestedPage ? 'combatives.html' : 'programs/combatives.html',
      '/programs/combatives.html': isNestedPage ? 'combatives.html' : 'programs/combatives.html',
      '/programs/bullyproof': isNestedPage ? 'bullyproof.html' : 'programs/bullyproof.html',
      '/programs/bullyproof.html': isNestedPage ? 'bullyproof.html' : 'programs/bullyproof.html',
      '/programs/women-empowered': isNestedPage ? 'women-empowered.html' : 'programs/women-empowered.html',
      '/programs/women-empowered.html': isNestedPage ? 'women-empowered.html' : 'programs/women-empowered.html',
      '/programs/master-cycle': isNestedPage ? 'master-cycle.html' : 'programs/master-cycle.html',
      '/programs/master-cycle.html': isNestedPage ? 'master-cycle.html' : 'programs/master-cycle.html',
      '/schedule': isNestedPage ? '../schedule.html' : 'schedule.html',
      '/schedule.html': isNestedPage ? '../schedule.html' : 'schedule.html',
      '/blog': isNestedPage ? 'index.html' : 'blog/index.html',
      '/blog/': isNestedPage ? 'index.html' : 'blog/index.html',
      '/blog/index.html': isNestedPage ? 'index.html' : 'blog/index.html',
      '/about': isNestedPage ? '../about.html' : 'about.html',
      '/about.html': isNestedPage ? '../about.html' : 'about.html',
      '/faq': isNestedPage ? '../faq.html' : 'faq.html',
      '/faq.html': isNestedPage ? '../faq.html' : 'faq.html',
      '/pricing': isNestedPage ? '../pricing.html' : 'pricing.html',
      '/pricing.html': isNestedPage ? '../pricing.html' : 'pricing.html',
      '/contact': isNestedPage ? '../contact.html' : 'contact.html',
      '/contact.html': isNestedPage ? '../contact.html' : 'contact.html',
    };

    if (normalized in mapping) return mapping[normalized];
    if (normalized.startsWith('/assets/') || normalized.startsWith('/css/') || normalized.startsWith('/js/')) {
      const relative = normalized.replace(/^\/+/, '');
      return isNestedPage ? `../${relative}` : relative;
    }
    if (normalized.startsWith('/')) {
      return isNestedPage ? `.${normalized}` : normalized;
    }

    return href;
  };

  const rewriteAttribute = (selector, attr) => {
    document.querySelectorAll(selector).forEach((node) => {
      const raw = node.getAttribute(attr);
      if (!raw) return;
      const next = toRelative(raw);
      if (next && next !== raw) {
        node.setAttribute(attr, next);
      }
    });
  };

  rewriteAttribute('a[href^="/"]', 'href');
  rewriteAttribute('link[href^="/"]', 'href');
  rewriteAttribute('script[src^="/"]', 'src');
  rewriteAttribute('img[src^="/"]', 'src');
  rewriteAttribute('source[src^="/"]', 'src');
  rewriteAttribute('source[srcset^="/"]', 'srcset');
  rewriteAttribute('iframe[src^="/"]', 'src');
  rewriteAttribute('video[poster^="/"]', 'poster');
  rewriteAttribute('form[action^="/"]', 'action');

  document.querySelectorAll('meta[content^="/"]').forEach((node) => {
    const raw = node.getAttribute('content');
    if (!raw) return;
    const next = toRelative(raw);
    if (next && next !== raw) {
      node.setAttribute('content', next);
    }
  });
}

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

  function bindTrialForm() {
    const trialForm = document.getElementById('trial-form');
    if (!trialForm || trialForm.dataset.bound) return;
    trialForm.dataset.bound = 'true';

    const formWrap = trialForm.closest('.form-wrap');
    const formSuccess = formWrap?.querySelector('.form-msg.success');
    const formError = formWrap?.querySelector('.form-msg.error');

    trialForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formSuccess?.classList.remove('is-visible');
      formError?.classList.remove('is-visible');

      const accessKey = trialForm.querySelector('input[name="access_key"]')?.value;
      if (!accessKey || accessKey.includes('YOUR_WEB3FORMS_KEY')) {
        if (formError) {
          formError.textContent = 'TODO: Add your Web3Forms access key in partials/trial-form.html';
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
        const formData = new FormData(trialForm);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success !== false) {
          trialForm.classList.add('is-hidden');
          formSuccess?.classList.add('is-visible');
        } else {
          throw new Error(data.message || 'Submit failed');
        }
      } catch {
        if (formError) {
          formError.textContent = 'Something went wrong. Call 604-770-1766 or email northvanbjj@gmail.com';
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

  normalizeGitHubPagesLinks();
})();
