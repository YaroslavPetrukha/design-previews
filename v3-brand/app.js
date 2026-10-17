// v3-brand: progressive enhancement only. The page works fully without this file.
(function () {
  "use strict";

  // 1. Hide the mobile dock when the form or the final CTA is on screen (it would duplicate them).
  var dock = document.querySelector(".dock");
  var targets = [document.getElementById("rozrakhunok"), document.getElementById("final")].filter(Boolean);
  if (dock && "IntersectionObserver" in window && targets.length) {
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
      dock.classList.toggle("is-hidden", visible.size > 0);
    }, { threshold: 0.15 });
    targets.forEach(function (t) { io.observe(t); });
  }

  // 2. Links to pages that do not exist yet must not jump to the top.
  document.querySelectorAll('a[href="#"][data-placeholder]').forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  // 3. Prototype form: no endpoint yet. Validate the contact field and say so honestly.
  var form = document.querySelector(".form");
  if (form) {
    var status = form.querySelector(".form__status");
    var contact = form.querySelector("#f-contact");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!contact.value.trim()) {
        contact.setAttribute("aria-invalid", "true");
        status.textContent = "Вкажіть Telegram, Viber або телефон, щоб ми могли надіслати ціну.";
        contact.focus();
        return;
      }
      contact.removeAttribute("aria-invalid");
      status.textContent = "Прототип: заявку не надіслано. На робочому сайті тут буде підтвердження і номер заявки.";
    });
  }
})();
