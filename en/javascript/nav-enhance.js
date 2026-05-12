(function () {
  'use strict';

  var CONSENT_KEY = 'dd_cookie_consent';

  // ── Inject shared CSS ──────────────────────────────────────────────────────
  var css = [
    /* language switcher */
    'nav .lang-switch a{color:rgba(255,255,255,.5);font-size:.78rem;font-weight:700;letter-spacing:1px;padding:5px 11px;border:1px solid rgba(255,255,255,.18);border-radius:8px;transition:all .2s;white-space:nowrap;text-decoration:none}',
    'nav .lang-switch a:hover{color:#fff;border-color:rgba(255,255,255,.45);background:rgba(255,255,255,.07)}',
    '@media(max-width:900px){nav ul .lang-switch{order:9;margin-left:auto}}',

    /* active nav link */
    'nav ul .items a.active{color:#fff;background:rgba(255,255,255,.08)}',

    /* scroll fade-in */
    '.scroll-fade{opacity:0;transform:translateY(26px);transition:opacity .55s ease,transform .55s ease}',
    '.scroll-fade--in{opacity:1;transform:none}',

    /* cookie banner */
    '#dd-cookie{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#141414;border-top:1px solid #282828;padding:16px 40px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}',
    '#dd-cookie p{flex:1;min-width:220px;font-size:.83rem;color:#aaa;line-height:1.5}',
    '#dd-cookie a{color:#e82127;text-decoration:none}',
    '#dd-cookie a:hover{text-decoration:underline}',
    '.dd-cookie-btns{display:flex;gap:10px;flex-shrink:0}',
    '.dd-btn-accept{padding:9px 22px;background:#e82127;color:#fff;border:none;border-radius:100px;font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer;transition:opacity .2s}',
    '.dd-btn-accept:hover{opacity:.85}',
    '.dd-btn-decline{padding:9px 22px;background:transparent;color:#888;border:1px solid #333;border-radius:100px;font-family:inherit;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s}',
    '.dd-btn-decline:hover{color:#fff;border-color:#555}',
    '@media(max-width:600px){#dd-cookie{padding:16px 20px}.dd-cookie-btns{width:100%}.dd-btn-accept,.dd-btn-decline{flex:1;text-align:center}}',

    /* youtube consent placeholder */
    '.yt-placeholder{position:absolute;inset:0;background:#0d0d0d;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;cursor:pointer}',
    '.yt-placeholder svg{width:56px;height:56px;opacity:.6}',
    '.yt-placeholder p{font-size:.8rem;color:#666;text-align:center;max-width:200px;line-height:1.5}',
    '.yt-placeholder:hover svg{opacity:.9}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── Language switcher ──────────────────────────────────────────────────────
  function initLangSwitch() {
    var html = document.documentElement;
    var altHref = html.getAttribute('data-alt-href');
    if (!altHref) return;

    var lang = html.getAttribute('lang') || '';
    var label = lang === 'de' ? 'EN' : 'DE';

    var nav = document.querySelector('nav ul');
    if (!nav) return;

    var li = document.createElement('li');
    li.className = 'lang-switch';
    li.innerHTML = '<a href="' + altHref + '">' + label + '</a>';

    var btn = nav.querySelector('.btn');
    btn ? nav.insertBefore(li, btn) : nav.appendChild(li);
  }

  // ── Active nav link ────────────────────────────────────────────────────────
  function initActiveNav() {
    var path = window.location.pathname;
    document.querySelectorAll('nav ul .items:not(.back):not(.lang-switch) a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var dir = href.substring(0, href.lastIndexOf('/') + 1);
      var isTopLevel = dir === '/de/' || dir === '/en/' || dir === '/';
      if (href === path || (!isTopLevel && path.startsWith(dir))) {
        a.classList.add('active');
      }
    });
  }

  // ── Scroll fade-in ─────────────────────────────────────────────────────────
  function initScrollFade() {
    if (!('IntersectionObserver' in window)) return;

    var sel = [
      '.card', '.lifestyle-card', '.event-card', '.city-card',
      '.tip', '.content-card', '.water-card', '.imprint-section',
      '.contact-card'
    ].join(',');

    var els = Array.from(document.querySelectorAll(sel));
    if (!els.length) return;

    var seen = new WeakMap();
    els.forEach(function (el) {
      el.classList.add('scroll-fade');
      var parent = el.parentElement;
      if (!parent) return;
      var idx = seen.has(parent) ? seen.get(parent) : 0;
      seen.set(parent, idx + 1);
      if (idx > 0) el.style.transitionDelay = (idx * 90) + 'ms';
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('scroll-fade--in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    els.forEach(function (el) { obs.observe(el); });
  }

  // ── YouTube consent ────────────────────────────────────────────────────────
  var lang = document.documentElement.getAttribute('lang') || 'de';
  var i18n = {
    placeholder: lang === 'de'
      ? 'Klicken um YouTube-Video zu laden'
      : 'Click to load YouTube video',
    banner: lang === 'de'
      ? 'Diese Website nutzt YouTube-Embeds und Google Fonts. Dabei werden Daten an Google übermittelt. <a href="/de/datenschutz.html">Mehr erfahren</a>'
      : 'This website uses YouTube embeds and Google Fonts, which transfer data to Google. <a href="/en/datenschutz.html">Learn more</a>',
    accept: lang === 'de' ? 'Akzeptieren' : 'Accept',
    decline: lang === 'de' ? 'Ablehnen' : 'Decline'
  };

  function activateYoutube() {
    document.querySelectorAll('iframe[data-yt-src]').forEach(function (iframe) {
      iframe.src = iframe.getAttribute('data-yt-src');
      iframe.removeAttribute('data-yt-src');
    });
    document.querySelectorAll('.yt-placeholder').forEach(function (el) {
      el.remove();
    });
  }

  function blockYoutube() {
    document.querySelectorAll('iframe[src*="youtube.com/embed"]').forEach(function (iframe) {
      var src = iframe.src;
      iframe.setAttribute('data-yt-src', src);
      iframe.src = 'about:blank';

      var wrap = iframe.closest('.media-wrap');
      if (!wrap) return;

      var placeholder = document.createElement('div');
      placeholder.className = 'yt-placeholder';
      placeholder.innerHTML =
        '<svg viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M66.5 7.5C65.7 4.7 63.5 2.5 60.7 1.7 55.4 0 34 0 34 0S12.6 0 7.3 1.7C4.5 2.5 2.3 4.7 1.5 7.5 0 12.8 0 24 0 24s0 11.2 1.5 16.5c.8 2.8 3 5 5.8 5.8C12.6 48 34 48 34 48s21.4 0 26.7-1.7c2.8-.8 5-3 5.8-5.8C68 35.2 68 24 68 24s0-11.2-1.5-16.5z" fill="#e82127"/>' +
        '<path d="M27 34l18-10-18-10v20z" fill="#fff"/>' +
        '</svg>' +
        '<p>' + i18n.placeholder + '</p>';

      placeholder.addEventListener('click', function () {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        activateYoutube();
        var banner = document.getElementById('dd-cookie');
        if (banner) banner.remove();
      });

      wrap.appendChild(placeholder);
    });
  }

  function showCookieBanner() {
    var banner = document.createElement('div');
    banner.id = 'dd-cookie';
    banner.innerHTML =
      '<p>' + i18n.banner + '</p>' +
      '<div class="dd-cookie-btns">' +
      '<button class="dd-btn-decline">' + i18n.decline + '</button>' +
      '<button class="dd-btn-accept">' + i18n.accept + '</button>' +
      '</div>';

    banner.querySelector('.dd-btn-accept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      activateYoutube();
      banner.remove();
    });
    banner.querySelector('.dd-btn-decline').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'declined');
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  function initCookieConsent() {
    var hasYoutube = document.querySelector('iframe[src*="youtube.com/embed"]');
    if (!hasYoutube) return;

    var consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') return; // already accepted, iframes load normally

    blockYoutube();
    if (consent !== 'declined') showCookieBanner();
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCookieConsent();
      initLangSwitch();
      initActiveNav();
      initScrollFade();
    });
  } else {
    initCookieConsent();
    initLangSwitch();
    initActiveNav();
    initScrollFade();
  }
})();
