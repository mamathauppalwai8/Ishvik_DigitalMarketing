/* ==========================================================================
   ISHVIK DIGITAL MARKETING — form.js
   Client-side validation for the contact form. On success the composed
   message is handed to WhatsApp (primary) — no data is stored on this site.
   Edit CONTACT targets below if the details ever change.
   ========================================================================== */

(function () {
  "use strict";

  var CONTACT = {
    whatsapp: "918317640267",
    email: "ishvik1319@gmail.com"
  };

  var form = document.getElementById("contact-form");
  if (!form) return;

  var toast = function (msg) { if (window.showToast) window.showToast(msg); };

  function setError(field, invalid) {
    field.classList.toggle("is-invalid", invalid);
  }

  function validators() {
    var name = document.getElementById("cf-name");
    var phone = document.getElementById("cf-phone");
    var email = document.getElementById("cf-email");
    var message = document.getElementById("cf-message");

    var checks = [
      { el: name, ok: Boolean(name.value.trim()) },
      { el: phone, ok: /^[+]?[\d\s\-()]{8,18}$/.test(phone.value.trim()) },
      { el: email, ok: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) },
      { el: message, ok: Boolean(message.value.trim()) }
    ];

    var firstBad = null;
    checks.forEach(function (c) {
      setError(c.el.parentElement, !c.ok);
      if (!c.ok && !firstBad) firstBad = c.el;
    });
    return firstBad;
  }

  function composeMessage() {
    var name = document.getElementById("cf-name").value.trim();
    var phone = document.getElementById("cf-phone").value.trim();
    var email = document.getElementById("cf-email").value.trim();
    var service = document.getElementById("cf-service").value;
    var message = document.getElementById("cf-message").value.trim();

    var lines = [
      "Hello Ishvik Digital Marketing,",
      "",
      message,
      "",
      "— " + name,
      "Phone/WhatsApp: " + phone,
      "Email: " + email
    ];
    if (service) lines.splice(lines.length - 4, 0, "Service: " + service);
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = validators();
    if (firstBad) {
      firstBad.focus();
      toast("Please complete the highlighted fields.");
      return;
    }

    var text = encodeURIComponent(composeMessage());
    var url = "https://wa.me/" + CONTACT.whatsapp + "?text=" + text;
    window.open(url, "_blank", "noopener");

    form.reset();
    toast("Opening WhatsApp with your message. We'll reply shortly.");
  });

  // Clear an error as soon as the user corrects the field
  form.querySelectorAll("input, textarea, select").forEach(function (input) {
    input.addEventListener("input", function () {
      setError(input.parentElement, false);
    });
  });
})();