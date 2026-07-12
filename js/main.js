const NVB_CONFIG = {
  web3formsKey: '8bb9f88d-9684-46e3-9dd4-ebb557a3473f',
  bookingUrl: null,
  scheduleSheetCsvUrl: 'SCHEDULE_SHEET_CSV_URL',
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

  if (window.location.hash === '#book-trial') {
    const target = document.getElementById('book-trial');
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
        target.querySelector('input[name="name"]')?.focus();
      }, 300);
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

      const accessKey = trialForm.querySelector('input[name="access_key"]')?.value
        || NVB_CONFIG.web3formsKey;
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
        formData.set('access_key', accessKey);
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

  /* Sheet-driven schedule */
  async function initScheduleWidget() {
    const root = document.getElementById('schedule-widget');
    if (!root) return;

    const url = NVB_CONFIG.scheduleSheetCsvUrl;
    const filtersEl = root.querySelector('[data-schedule-filters]');
    const bodyEl = root.querySelector('[data-schedule-body]');
    const fallbackEl = root.querySelector('[data-schedule-fallback]');

    if (!url || url.includes('SCHEDULE_SHEET_CSV_URL')) {
      if (fallbackEl) {
        fallbackEl.hidden = false;
        fallbackEl.textContent = 'Schedule sheet not configured yet. Check back soon or call 604-770-1766.';
      }
      return;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch failed');
      const csv = await res.text();
      const rows = parseCsv(csv);
      if (!rows.length) throw new Error('empty');

      const levels = [...new Set(rows.map((r) => r.Level).filter(Boolean))].sort();
      let active = 'All';

      function renderFilters() {
        if (!filtersEl) return;
        filtersEl.innerHTML = ['All', ...levels].map((level) => (
          `<button type="button" class="schedule-filter${level === active ? ' is-active' : ''}" data-level="${level}">${level}</button>`
        )).join('');
        filtersEl.querySelectorAll('.schedule-filter').forEach((btn) => {
          btn.addEventListener('click', () => {
            active = btn.dataset.level;
            renderFilters();
            renderTable();
          });
        });
      }

      function renderTable() {
        const filtered = active === 'All' ? rows : rows.filter((r) => r.Level === active);
        const byDay = {};
        filtered.forEach((r) => {
          const day = r.Day || 'Other';
          (byDay[day] = byDay[day] || []).push(r);
        });
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const days = Object.keys(byDay).sort((a, b) => {
          const ia = dayOrder.indexOf(a);
          const ib = dayOrder.indexOf(b);
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });

        bodyEl.innerHTML = days.map((day) => `
          <div class="schedule-day">
            <h3>${day}</h3>
            <table class="schedule-table">
              <thead><tr><th>Time</th><th>Class</th><th>Level</th></tr></thead>
              <tbody>
                ${byDay[day].map((r) => `<tr><td>${escapeHtml(r.Time)}</td><td>${escapeHtml(r.Class)}</td><td>${escapeHtml(r.Level)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        `).join('') || '<p class="note-box">No classes match this filter.</p>';
      }

      renderFilters();
      renderTable();
      if (fallbackEl) fallbackEl.hidden = true;
    } catch {
      if (fallbackEl) {
        fallbackEl.hidden = false;
        fallbackEl.textContent = 'Unable to load the live schedule. Please call 604-770-1766 or try again later.';
      }
    }
  }

  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = splitCsvLine(lines[0]).map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const cols = splitCsvLine(line);
      const row = {};
      headers.forEach((h, i) => { row[h] = (cols[i] || '').trim(); });
      return row;
    }).filter((r) => r.Day || r.Time || r.Class);
  }

  function splitCsvLine(line) {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i += 1; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        out.push(cur); cur = '';
      } else cur += ch;
    }
    out.push(cur);
    return out;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const partialBase = document.body.dataset.partialBase || '';
  Promise.all([
    loadPartial('[data-include="trial-form"]', `${partialBase}partials/trial-form.html`),
    loadPartial('[data-include="trial-copy"]', `${partialBase}partials/trial-copy.html`),
  ]).then(bindTrialForm);

  initScheduleWidget();
})();
