/* ==========================================================================
   ISHVIK DIGITAL MARKETING — main.js
   Logo, preloader, navigation, mobile menu, active links, service pillars,
   FAQ accordion, insights filters, DX carousel, counters, toast, year.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     LOGO — single source of truth.
     The Ishvik brand identity is rendered here as an inline SVG. To use a
     real logo file instead, place it at:
         assets/logo/ishvik-logo.png
     and flip `USE_LOGO_FILE` to true below. No other change is needed —
     the logo updates automatically in the navbar, loader, mobile menu
     and footer.
     ------------------------------------------------------------------ */
  const LOGO = {
    USE_LOGO_FILE: true,
    FILE_PATH: "assets/logo/ishvik-mark.png",
    ALT: "Ishvik Digital Marketing"
  };

  let logoSvgUid = 0;

  function logoSvg() {
    const uid = "ig" + ++logoSvgUid;
    return (
      '<svg class="brand-logo" viewBox="0 0 316 74" role="img" aria-label="' + LOGO.ALT + '" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<linearGradient id="gl' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#8F6715"/>' +
            '<stop offset="0.32" stop-color="#D4A72C"/>' +
            '<stop offset="0.55" stop-color="#F5C84C"/>' +
            '<stop offset="0.78" stop-color="#D4A72C"/>' +
            '<stop offset="1" stop-color="#8F6715"/>' +
          '</linearGradient>' +
          '<linearGradient id="sv' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#8f8f8f"/>' +
            '<stop offset="0.5" stop-color="#E8E8E8"/>' +
            '<stop offset="1" stop-color="#777777"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<rect x="1" y="1" width="72" height="72" rx="16" fill="#050505"/>' +
        '<rect x="1" y="1" width="72" height="72" rx="16" fill="none" stroke="url(#gl' + uid + ')" stroke-width="1.6"/>' +
        '<rect x="7" y="7" width="60" height="60" rx="11" fill="none" stroke="rgba(212,167,44,0.4)" stroke-width="1"/>' +
        '<text x="37" y="50" font-family="Georgia,serif" font-size="40" font-weight="700" text-anchor="middle" fill="url(#gl' + uid + ')">I</text>' +
        '<circle cx="52" cy="20" r="2.4" fill="#C9C9C9"/>' +
        '<rect x="20" y="60" width="34" height="2" rx="1" fill="rgba(201,201,201,0.55)"/>' +
        '<text x="86" y="42" font-family="Cinzel,Georgia,serif" font-size="26" font-weight="700" letter-spacing="4" fill="url(#gl' + uid + ')" text-transform="uppercase">ISHVIK</text>' +
        '<text x="87" y="60" font-family="Manrope,system-ui,sans-serif" font-size="8.5" font-weight="700" letter-spacing="4.4" fill="url(#sv' + uid + ')" text-transform="uppercase">DIGITAL MARKETING</text>' +
        '<path d="M86 67 H282" stroke="url(#gl' + uid + ')" stroke-width="1" opacity="0.55"/>' +
        '<line x1="290" y1="37" x2="300" y2="37" stroke="#D4A72C" stroke-width="2.4" stroke-linecap="round" opacity="0.9"/>' +
      '</svg>'
    );
  }

  function renderLogo(container, height) {
    if (!container) return;
    var svg = logoSvg();
    container.classList.add("brand-logo-slot");

    function injectSVG() { container.innerHTML = svg; }

    if (LOGO.USE_LOGO_FILE) {
      var img = new Image();
      img.onload = function () {
        container.innerHTML = "";
        img.className = "brand-logo-img";
        img.alt = LOGO.ALT;
        container.appendChild(img);
      };
      img.onerror = injectSVG;
      img.src = LOGO.FILE_PATH;
    } else {
      injectSVG();
    }

    if (height) container.style.setProperty("--logo-h", height + "px");
  }

  function initLogo() {
    document.querySelectorAll("[data-logo]").forEach(function (el) {
      renderLogo(el);
    });
    renderLogo(document.getElementById("preloader-logo"), 92);
  }

  /* ------------------------------------------------------------------
     PRELOADER
     ------------------------------------------------------------------ */
  function initPreloader() {
    var pre = document.getElementById("preloader");
    if (!pre) return;
    var shown = Date.now();
    function hide() {
      var elapsed = Date.now() - shown;
      var wait = Math.max(0, 900 - elapsed);
      setTimeout(function () {
        pre.classList.add("is-done");
      }, wait);
    }
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide);
    setTimeout(function () { if (!pre.classList.contains("is-done")) pre.classList.add("is-done"); }, 6000);
  }

  /* ------------------------------------------------------------------
     NAVBAR — scrolled state, mobile menu, body scroll lock
     ------------------------------------------------------------------ */
  function initNavbar() {
    var navbar = document.getElementById("navbar");
    var burger = document.getElementById("burger");
    var closeBtn = document.getElementById("burger-close");
    var mobileMenu = document.getElementById("mobile-menu");
    if (!navbar || !mobileMenu || !burger) return;

    var isOpen = false;

    function onScroll() {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setMenu(open) {
      isOpen = Boolean(open);
      mobileMenu.classList.toggle("is-open", isOpen);
      mobileMenu.setAttribute("aria-hidden", String(!isOpen));
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("no-scroll", isOpen);
      burger.classList.toggle("is-open", isOpen);
      if (closeBtn) closeBtn.classList.toggle("is-open", isOpen);
    }

    function openMenu() { setMenu(true); }
    function closeMenu() { setMenu(false); }

    burger.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    document.addEventListener("click", function (e) {
      if (isOpen && !mobileMenu.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });

    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     ACTIVE NAV LINK (scroll spy)
     ------------------------------------------------------------------ */
  function initActiveNav() {
    var sections = [
      "home", "about", "services", "approach", "work", "insights", "contact"
    ];
    var linkMap = {};
    document.querySelectorAll(".nav-link").forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      linkMap[id] = link;
    });

    function setActive(id) {
      var mLink = linkMap[id];
      var mobileLinks = document.querySelectorAll(".mob-link");
      document.querySelectorAll(".nav-link").forEach(function (l) { l.classList.remove("active"); });
      mobileLinks.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("href") === "#" + id);
      });
      if (mLink) mLink.classList.add("active");
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  /* ------------------------------------------------------------------
     SERVICE PILLARS — toggle (accordion on phones, expand on desktop)
     ------------------------------------------------------------------ */
  function initPillars() {
    document.querySelectorAll(".service-pillar").forEach(function (pillar) {
      var head = pillar.querySelector(".pillar-head");
      if (!head) return;
      function toggle() {
        var open = pillar.classList.toggle("is-open");
        head.setAttribute("aria-expanded", String(open));
      }
      head.addEventListener("click", toggle);
      head.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
  }

  /* ------------------------------------------------------------------
     FAQ — single-open, smoothly animated accordion
     ------------------------------------------------------------------ */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    function setHeight(item, force) {
      var p = item.querySelector("p");
      if (!p) return;
      if (item.open) {
        p.style.maxHeight = (p.scrollHeight + 30) + "px";
      } else {
        p.style.maxHeight = "0px";
      }
    }

    items.forEach(function (item) {
      var summary = item.querySelector("summary");
      if (!summary) return;
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        var willOpen = !item.open;
        items.forEach(function (other) {
          if (other !== item && other.open) {
            other.open = false;
            setHeight(other, 0);
          }
        });
        if (willOpen) {
          item.open = true;
          setHeight(item);
        } else {
          item.open = false;
          setHeight(item, 0);
        }
      });
    });

    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        items.forEach(function (item) { if (item.open) setHeight(item); });
      }, 150);
    });
  }

  /* ------------------------------------------------------------------
     INSIGHTS — category filter
     ------------------------------------------------------------------ */
  function initInsightsFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".blog-card");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var f = btn.dataset.filter;
        cards.forEach(function (card) {
          var show = f === "all" || card.dataset.cat === f;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     DX CAROUSEL — digital experience showcase
     ------------------------------------------------------------------ */
  function initDx() {
    var track = document.querySelector(".dx-track");
    var prev = document.getElementById("dx-prev");
    var next = document.getElementById("dx-next");
    var items = document.querySelectorAll(".dx-item");
    if (!track || !items.length) return;
    var index = 0;
    var count = track.children.length;

    function go(i) {
      index = (i + count) % count;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      items.forEach(function (it, k) { it.classList.toggle("is-active", k === index); });
    }
    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });
    items.forEach(function (it, k) {
      it.addEventListener("click", function () { go(k); });
    });

    // Clean autoplay that stops when the user interacts
    var auto = setInterval(function () { go(index + 1); }, 6000);
    var stage = document.querySelector(".dx-stage");
    ["mouseenter", "touchstart", "focusin"].forEach(function (evt) {
      if (stage) stage.addEventListener(evt, function () { clearInterval(auto); }, { passive: true });
    });
  }

  /* ------------------------------------------------------------------
     COUNTERS — animated metrics (generic sample values)
     ------------------------------------------------------------------ */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.dataset.count);
      var decimals = parseInt(el.dataset.decimals || "0", 10);
      var suffix = el.dataset.suffix || "";
      var prefix = el.dataset.prefix || "";
      var duration = 1600;
      var start = null;

      function fmt(n) { return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); }
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + fmt(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ------------------------------------------------------------------
     TOAST
     ------------------------------------------------------------------ */
  function initToast() {
    var toast = document.getElementById("toast");
    if (!toast) return;
    var t;
    window.showToast = function (msg) {
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(t);
      t = setTimeout(function () { toast.classList.remove("show"); }, 3200);
    };
    document.querySelectorAll("[data-toast]").forEach(function (el) {
      el.addEventListener("click", function () { window.showToast(el.dataset.toast); });
    });
  }

  /* ------------------------------------------------------------------
     TO-TOP + FOOTER YEAR
     ------------------------------------------------------------------ */
  function initMisc() {
    var toTop = document.getElementById("to-top");
    if (toTop) {
      window.addEventListener("scroll", function () {
        toTop.classList.toggle("show", window.scrollY > 700);
      }, { passive: true });
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initLogo();
    initPreloader();
    initNavbar();
    initActiveNav();
    initPillars();
    initFaq();
    initInsightsFilter();
    initDx();
    // reveals + counters are handled by animations.js
    initCounters();
    initToast();
    initMisc();
  });
})();