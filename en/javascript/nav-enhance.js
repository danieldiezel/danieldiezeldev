(function () {
  'use strict';

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
    '.scroll-fade--in{opacity:1;transform:none}'
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
      '.tip', '.content-card', '.water-card', '.imprint-section'
    ].join(',');

    var els = Array.from(document.querySelectorAll(sel));
    if (!els.length) return;

    // stagger siblings within the same parent
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initLangSwitch();
      initActiveNav();
      initScrollFade();
    });
  } else {
    initLangSwitch();
    initActiveNav();
    initScrollFade();
  }
})();
