/* v2-foto: progressive enhancement only. Without JS the two photos sit side by side. */
(function () {
  document.querySelectorAll('[data-compare]').forEach(function (fig) {
    var stage = fig.querySelector('.compare__stage');
    var control = fig.querySelector('.compare__control');
    var range = fig.querySelector('[data-compare-range]');
    if (!stage || !control || !range) return;

    // Put the (invisible) native range input over the photo: pointer, touch and keyboard all work natively.
    stage.appendChild(control);
    control.style.position = 'absolute';
    control.style.inset = '0';
    control.style.height = 'auto';
    range.style.height = '100%';
    range.setAttribute('aria-valuetext', 'копія відкрита на 50%');

    function set(v) {
      stage.style.setProperty('--pos', v + '%');
      range.setAttribute('aria-valuetext', 'копія відкрита на ' + (100 - v) + '%');
    }
    range.addEventListener('input', function () { set(range.value); });
    range.addEventListener('focus', function () { fig.classList.add('is-focus'); });
    range.addEventListener('blur', function () { fig.classList.remove('is-focus'); });
    set(range.value);

    // One gentle hint sweep when the slider first comes into view (skipped for reduced motion).
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    var touched = false;
    range.addEventListener('pointerdown', function () { touched = true; }, { once: true });
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var start = null, from = 50;
      function step(t) {
        if (touched) return;
        if (start === null) start = t;
        var p = Math.min((t - start) / 1600, 1);
        var v = from + Math.sin(p * Math.PI * 2) * 18 * (1 - p);
        range.value = Math.round(v); set(range.value);
        if (p < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, 1200);
    }, { threshold: 0.6 });
    io.observe(stage);
  });
  /* placeholder links must not jump to top */
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
