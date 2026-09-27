/* ==========================================================================
   ISHVIK DIGITAL MARKETING — animations.js
   Hero canvas (gold light trails + silver particles), scroll reveals,
   approach journey line, dashboard triggers, parallax, media-strip drag.
   ========================================================================== */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     SCROLL REVEALS
     ------------------------------------------------------------------ */
  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (reducedMotion) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     TRIGGERS for dashboard / measurement visuals (draw-on-view)
     ------------------------------------------------------------------ */
  function initVisualTriggers() {
    var targets = document.querySelectorAll(".mini-dash, .measure-card");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     HERO CANVAS — gold light trails, silver dust, faint glow points
     ------------------------------------------------------------------ */
  function initHeroCanvas() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;

    var GOLD = [212, 167, 44];
    var GOLD_BRIGHT = [245, 200, 76];
    var GOLD_DEEP = [143, 103, 21];
    var SILVER = [201, 201, 201];

    var dust = [];
    var streaks = [];
    var tints = [];

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makeDust() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: rand(0.5, 1.9),
        base: Math.random() > 0.72 ? SILVER : (Math.random() > 0.65 ? GOLD_BRIGHT : GOLD),
        vy: rand(-0.12, -0.34),
        vx: rand(-0.12, 0.12),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.4, 1.2)
      };
    }

    function makeStreak() {
      var gold = Math.random() > 0.25;
      var color = gold ? (Math.random() > 0.5 ? GOLD_BRIGHT : GOLD) : SILVER;
      return {
        x: rand(0, W),
        y: rand(0, H * 0.6),
        len: rand(70, 190),
        angle: rand(-0.5, -0.08) - Math.PI / 2,
        speed: rand(0.5, 1.1),
        color: color,
        alpha: rand(0.10, 0.28),
        w: rand(1, 1.8)
      };
    }

    function makeTint() {
      return {
        x: rand(0, W),
        y: rand(0, H),
        r: rand(120, 300),
        color: Math.random() > 0.5 ? GOLD_DEEP : GOLD,
        alpha: rand(0.02, 0.06)
      };
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var dustN = Math.round((W * H) / 14000);
      while (dust.length < dustN) dust.push(makeDust());
      while (streaks.length < 8) streaks.push(makeStreak());
      while (tints.length < 6) tints.push(makeTint());
    }

    function step(now) {
      if (reducedMotion) return;
      ctx.clearRect(0, 0, W, H);

      // Soft tint glows
      for (var i = 0; i < tints.length; i++) {
        var g = tints[i];
        var rad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        rad.addColorStop(0, "rgba(" + g.color[0] + "," + g.color[1] + "," + g.color[2] + "," + g.alpha + ")");
        rad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = rad;
        ctx.fillRect(g.x - g.r, g.y - g.r, g.r * 2, g.r * 2);
      }

      // Gold / silver dust
      for (var d = 0; d < dust.length; d++) {
        var p = dust[d];
        p.x += p.vx + Math.sin(now * 0.0004 + p.phase) * 0.12;
        p.y += p.vy;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        if (p.x < -6) p.x = W + 6;
        if (p.x > W + 6) p.x = -6;
        var tw = 0.55 + 0.45 * Math.sin(now * 0.0012 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.base[0] + "," + p.base[1] + "," + p.base[2] + "," + (0.4 * tw).toFixed(3) + ")";
        ctx.fill();
      }

      // Light trails (streaks)
      for (var s = 0; s < streaks.length; s++) {
        var st = streaks[s];
        st.x += Math.cos(st.angle) * st.speed;
        st.y += Math.sin(st.angle) * st.speed;
        if (st.y < -st.len || st.x < -st.len || st.x > W + st.len) streaks[s] = makeStreak();

        var grad = ctx.createLinearGradient(
          st.x - Math.cos(st.angle) * st.len * 0.8,
          st.y - Math.sin(st.angle) * st.len * 0.8,
          st.x + Math.cos(st.angle) * st.len * 0.2,
          st.y + Math.sin(st.angle) * st.len * 0.2
        );
        grad.addColorStop(0, "rgba(" + st.color[0] + "," + st.color[1] + "," + st.color[2] + ",0)");
        grad.addColorStop(1, "rgba(" + st.color[0] + "," + st.color[1] + "," + st.color[2] + "," + st.alpha + ")");
        ctx.strokeStyle = grad;
        ctx.lineWidth = st.w;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(st.x - Math.cos(st.angle) * st.len, st.y - Math.sin(st.angle) * st.len);
        ctx.lineTo(st.x, st.y);
        ctx.stroke();
      }

      requestAnimationFrame(step);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    if (!reducedMotion) requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------
     MOUSE GLOW — soft gold radial following the cursor
     ------------------------------------------------------------------ */
  function initMouseGlow() {
    var glow = document.getElementById("mouse-glow");
    if (!glow) return;
    if (window.matchMedia("(pointer: coarse)").matches || reducedMotion) return;

    var tx = window.innerWidth / 2, ty = window.innerHeight / 3;
    var x = tx, y = ty;

    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
    }, { passive: true });

    (function loop() {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      glow.style.transform = "translate(" + (x - 260) + "px," + (y - 260) + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------------
     PARALLAX — hero content drifts slower than scroll + mouse sway
     ------------------------------------------------------------------ */
  function initParallax() {
    var hero = document.querySelector(".hero");
    var content = document.querySelector(".hero-content");
    if (!hero || !content || reducedMotion) return;

    var vh = window.innerHeight;

    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y > vh * 1.2) return;
      var p = y / vh;
      content.style.transform = "translateY(" + (p * 70) + "px)";
      content.style.opacity = Math.max(1 - p * 1.25, 0);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     APPROACH — gold journey line fills and steps light up on scroll
     ------------------------------------------------------------------ */
  function initApproachJourney() {
    var wrap = document.querySelector(".approach-journey");
    var fill = document.getElementById("journey-fill");
    var steps = document.querySelectorAll(".step");
    if (!wrap || !fill || !steps.length) return;

    var vh = window.innerHeight;

    function onScroll() {
      var rect = wrap.getBoundingClientRect();
      var span = rect.bottom - rect.top;
      var progress = (vh * 0.6 - rect.top) / span;
      progress = Math.max(0, Math.min(1, progress));
      fill.style.height = (progress * 100) + "%";

      var reachedLine = rect.top + vh * 0.72;
      steps.forEach(function (step) {
        var r = step.getBoundingClientRect();
        var center = r.top + r.height / 2;
        step.classList.toggle("is-reached", center <= reachedLine);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     MEDIA STRIP — drag to scroll
     ------------------------------------------------------------------ */
  function initStripDrag() {
    var strip = document.getElementById("media-strip");
    if (!strip || window.matchMedia("(pointer: coarse)").matches) return;

    var down = false, startX = 0, startScroll = 0, moved = 0;

    strip.addEventListener("pointerdown", function (e) {
      down = true; moved = 0;
      startX = e.clientX; startScroll = strip.scrollLeft;
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      strip.scrollLeft = startScroll - dx;
    });
    ["pointerup", "pointercancel"].forEach(function (t) {
      strip.addEventListener(t, function () { down = false; });
    });
    // Prevent click-through right after a drag
    strip.addEventListener("click", function (e) {
      if (moved > 8) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initReveals();
    initVisualTriggers();
    initHeroCanvas();
    initMouseGlow();
    initParallax();
    initApproachJourney();
    initStripDrag();
  });
})();