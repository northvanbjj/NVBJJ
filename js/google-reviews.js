/**
 * Loads live Google reviews (with reviewer names) via Maps JavaScript Places API.
 * Set NVB_CONFIG.googleMapsApiKey in main.js — free tier covers typical site traffic.
 * Falls back to static HTML quotes when no key is configured.
 */
(function () {
  'use strict';

  const PLACE_ID = 'ChIJezQrZcxxhlQRkT0V4mtYgeE';
  const MAX_REVIEWS = 5;
  const MAX_CHARS = 280;

  function trimReview(text) {
    if (!text || text.length <= MAX_CHARS) return text;
    return `${text.slice(0, MAX_CHARS).trim()}…`;
  }

  function stars(rating) {
    const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 5)));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderReviews(reviews) {
    const grid = document.querySelector('[data-reviews-grid]');
    if (!grid || !reviews.length) return;

    grid.innerHTML = reviews.slice(0, MAX_REVIEWS).map((review) => {
      const text = trimReview(review.text || '');
      const name = review.authorAttribution?.displayName || 'Google Review';
      const profile = review.authorAttribution?.uri || '';
      const rating = review.rating || 5;
      const author = profile
        ? `<a href="${escapeHtml(profile)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>`
        : escapeHtml(name);

      return `<blockquote class="quote">
        <div class="stars" aria-label="${rating} stars">${stars(rating)}</div>
        <p>"${escapeHtml(text)}"</p>
        <b>— ${author}</b>
      </blockquote>`;
    }).join('');

    document.querySelector('[data-reviews-attribution]')?.classList.add('is-visible');
  }

  function updateSummary(place) {
    const summary = document.querySelector('[data-reviews-summary]');
    if (!summary || !place.rating) return;
    const count = place.userRatingCount;
    summary.textContent = count
      ? `${place.rating.toFixed(1)} · ${count} Google reviews`
      : `${place.rating.toFixed(1)} on Google`;
  }

  async function fetchReviews() {
    const { Place } = await google.maps.importLibrary('places');
    const place = new Place({ id: PLACE_ID });
    await place.fetchFields({
      fields: ['displayName', 'rating', 'userRatingCount', 'reviews'],
    });

    if (place.reviews?.length) {
      renderReviews(place.reviews);
      updateSummary(place);
    }
  }

  async function loadMapsAndReviews(apiKey) {
    if (!window.google?.maps?.importLibrary) {
      const script = document.createElement('script');
      script.textContent = `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await(a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({key:"${apiKey}",v:"weekly"});`;
      document.head.appendChild(script);

      for (let i = 0; i < 50; i += 1) {
        if (window.google?.maps?.importLibrary) break;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    if (window.google?.maps?.importLibrary) {
      await fetchReviews();
    }
  }

  const apiKey = window.NVB_CONFIG?.googleMapsApiKey
    || window.NVB_CONFIG?.googlePlacesApiKey;
  if (apiKey && !String(apiKey).includes('YOUR_')) {
    loadMapsAndReviews(apiKey).catch(() => {});
  }
})();
