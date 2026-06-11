/* GopherCon Israel 2026 — interactivity */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initMobileMenu();
    initScrollSpy();
    initReveal();
    initCountdown();
  });

  /* --- sticky nav shadow on scroll --- */
  function initNav() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- mobile drawer --- */
  function initMobileMenu() {
    var toggle = document.querySelector(".mobile-menu-toggle");
    var menu = document.querySelector(".nav-menu");
    if (!toggle || !menu) return;

    var backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);

    var setOpen = function (open) {
      toggle.classList.toggle("active", open);
      menu.classList.toggle("active", open);
      backdrop.classList.toggle("active", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("active"));
    });
    backdrop.addEventListener("click", function () { setOpen(false); });
    menu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* --- scrollspy highlights current section in nav --- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    if (!links.length) return;
    var map = {};
    var sections = [];
    links.forEach(function (link) {
      var id = (link.getAttribute("href") || "").replace("#", "");
      var el = id && document.getElementById(id);
      if (el) { map[id] = link; sections.push(el); }
    });
    if (!sections.length) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var active = map[entry.target.id];
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* --- scroll reveal --- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add("in"); }, Math.min(i * 80, 240));
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* --- countdown --- */
  function initCountdown() {
    var root = document.getElementById("countdown");
    if (!root) return;
    var target = new Date(root.getAttribute("data-target")).getTime();
    if (isNaN(target)) return;

    var elDays = root.querySelector("[data-days]");
    var elHours = root.querySelector("[data-hours]");
    var elMins = root.querySelector("[data-mins]");
    var elSecs = root.querySelector("[data-secs]");
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };

    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        elDays.textContent = "00"; elHours.textContent = "00";
        elMins.textContent = "00"; elSecs.textContent = "00";
        return;
      }
      var s = Math.floor(diff / 1000);
      elDays.textContent = Math.floor(s / 86400);
      elHours.textContent = pad(Math.floor((s % 86400) / 3600));
      elMins.textContent = pad(Math.floor((s % 3600) / 60));
      elSecs.textContent = pad(s % 60);
    };
    tick();
    setInterval(tick, 1000);
  }
})();
