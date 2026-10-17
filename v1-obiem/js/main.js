/* v1 «Об'єм» — small always-on script (no dependencies).
   1) theme toggle, 2) mobile action bar, 3) prototype form, 4) chapter state + HUD,
   5) lazy start of the 3D scene (three.js + GSAP bundle) after first paint. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;

  /* ---------- 1. theme ---------- */
  var themeBtns = d.querySelectorAll('[data-theme-set]');
  function applyTheme(t) {
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
    else root.removeAttribute('data-theme');
    themeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-set') === (t || 'system'))); });
    try { if (t === 'system') localStorage.removeItem('obiem-theme'); else localStorage.setItem('obiem-theme', t); } catch (e) {}
    d.dispatchEvent(new CustomEvent('obiem:theme'));
  }
  var current = root.getAttribute('data-theme') || 'system';
  themeBtns.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-set') === current));
    b.addEventListener('click', function () { applyTheme(b.getAttribute('data-theme-set')); });
  });
  if (window.matchMedia) {
    var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (mqDark.addEventListener) mqDark.addEventListener('change', function () { d.dispatchEvent(new CustomEvent('obiem:theme')); });
  }

  /* ---------- 2. mobile action bar: shows when hero actions are off-screen ---------- */
  var bar = d.querySelector('[data-bar]');
  var heroActions = d.querySelector('.ch--hero .actions');
  var finalCta = d.querySelector('.cta');
  if (bar && heroActions && 'IntersectionObserver' in window) {
    var heroVisible = true, ctaVisible = false;
    var sync = function () { bar.classList.toggle('is-on', !heroVisible && !ctaVisible); };
    new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting || es[0].boundingClientRect.top > 0; sync(); }).observe(heroActions);
    if (finalCta) new IntersectionObserver(function (es) { ctaVisible = es[0].isIntersecting; sync(); }).observe(finalCta);
  }

  /* ---------- 3. prototype form ---------- */
  var form = d.querySelector('[data-proto-form]');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = form.querySelector('[data-form-status]');
    if (s) s.textContent = 'Це прототип: заявка нікуди не відправлена. Канал отримання заявок підключимо перед запуском.';
  });
  /* placeholder links must not jump to top */
  d.querySelectorAll('a[href="#"][data-placeholder]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ---------- 4. chapters: active state + HUD (works with or without WebGL) ---------- */
  var chapters = [].slice.call(d.querySelectorAll('.ch[data-ch]'));
  var hud = d.querySelector('[data-hud]');
  var rails = d.querySelectorAll('[data-rail]');
  var HUD_TEXT = ['Деталь', '01 · Файл, фото або опис', '02 · Розміри, маса, ціна', '03 · Друк і перевірка', '04 · Отримання'];
  var active = -1;
  function setChapter(n) {
    if (n === active) return;
    active = n;
    chapters.forEach(function (c) { c.classList.toggle('is-active', +c.getAttribute('data-ch') === n); });
    rails.forEach(function (r) { r.classList.toggle('is-on', +r.getAttribute('data-rail') <= n); });
    if (hud && n !== 3) hud.textContent = HUD_TEXT[n] || '';
    window.__obiemChapter = n;
    d.dispatchEvent(new CustomEvent('obiem:chapter', { detail: n }));
  }
  if ('IntersectionObserver' in window && chapters.length) {
    /* a chapter is "active" while it crosses the line at 55% of the viewport */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setChapter(+e.target.getAttribute('data-ch')); });
    }, { rootMargin: '-55% 0px -44% 0px' });
    chapters.forEach(function (c) { io.observe(c); });
  }
  setChapter(0);

  /* ---------- 5. lazy 3D ---------- */
  var stage = d.querySelector('[data-stage]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function webglOK() {
    try {
      var c = d.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }
  var params = new URLSearchParams(location.search);
  function boot() {
    if (!stage || reduce || params.has('poster-only') || !webglOK()) return; /* poster stays */
    var s = d.createElement('script');
    s.src = 'js/scene.min.js';
    s.async = true;
    d.body.appendChild(s);
  }
  function later() {
    if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 1500 });
    else setTimeout(boot, 400);
  }
  if (d.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
})();
