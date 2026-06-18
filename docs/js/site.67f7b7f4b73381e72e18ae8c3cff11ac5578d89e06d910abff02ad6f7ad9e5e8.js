/* GopherCon Israel 2026 — interactivity */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initScrollSpy();
    initReveal();
    initCountdown();
    initShare();
    initMailLinks();
  });

  /* --- mailto: → Gmail compose in a new tab ---
     mailto only works when the OS has a default mail handler; many browser
     users (Gmail-in-a-tab, no native client) get nothing. Open a pre-filled
     Gmail compose window instead, and fall back to the native mailto only if
     the popup is blocked. No-JS users still get the plain mailto href. */
  function initMailLinks() {
    var links = document.querySelectorAll('a[href^="mailto:"]');
    if (!links.length) return;
    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href") || "";
        var rest = href.slice("mailto:".length);
        var qi = rest.indexOf("?");
        var to = decodeURIComponent(qi === -1 ? rest : rest.slice(0, qi));
        var params = new URLSearchParams(qi === -1 ? "" : rest.slice(qi + 1));
        var su = params.get("subject") || "";
        var body = params.get("body") || "";
        var gmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" +
          encodeURIComponent(to) +
          (su ? "&su=" + encodeURIComponent(su) : "") +
          (body ? "&body=" + encodeURIComponent(body) : "");
        var win = window.open(gmail, "_blank", "noopener");
        // Only suppress the native mailto when Gmail actually opened;
        // if the popup was blocked, let mailto fire as the fallback.
        if (win) e.preventDefault();
      });
    });
  }

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

  /* --- share: native share sheet + copy link + toast --- */
  function initShare() {
    var card = document.querySelector(".share-card");
    var toast = document.getElementById("share-toast");
    var toastTimer;
    var showToast = function (msg) {
      if (!toast) return;
      if (msg) toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
    };

    // native share (mobile) — reveal only when supported
    if (card && navigator.share) {
      var nativeBtn = card.querySelector(".share-native");
      if (nativeBtn) {
        nativeBtn.hidden = false;
        nativeBtn.addEventListener("click", function () {
          navigator.share({
            title: card.getAttribute("data-share-title") || document.title,
            text: card.getAttribute("data-share-text") || "",
            url: card.getAttribute("data-share-url") || location.href
          }).catch(function () { /* user cancelled */ });
        });
      }
    }

    // copy link
    var copyBtn = document.querySelector(".s-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var url = copyBtn.getAttribute("data-copy") || location.href;
        var done = function () {
          copyBtn.classList.add("copied");
          showToast("Link copied to clipboard");
          setTimeout(function () { copyBtn.classList.remove("copied"); }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done).catch(fallback);
        } else {
          fallback();
        }
        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = url;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (e) { /* noop */ }
          document.body.removeChild(ta);
        }
      });
    }
  }
})();
