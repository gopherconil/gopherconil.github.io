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

  /* --- mailto: → small "Gmail / Outlook / Default / Copy" chooser ---
     mailto only works when the OS has a registered mail handler; many browser
     users (Gmail-in-a-tab, no native client) get nothing on click. Instead of
     forcing one provider, pop a tiny menu next to the link so the user picks
     their own webmail, their native app, or just copies the address.
     No-JS users still get the plain mailto href. */
  function initMailLinks() {
    var links = document.querySelectorAll('a[href^="mailto:"]');
    if (!links.length) return;

    var menu = buildMailMenu();
    var addr = "";

    function parse(href) {
      var rest = href.slice("mailto:".length);
      var qi = rest.indexOf("?");
      var to = decodeURIComponent(qi === -1 ? rest : rest.slice(0, qi));
      var params = new URLSearchParams(qi === -1 ? "" : rest.slice(qi + 1));
      return { to: to, su: params.get("subject") || "", body: params.get("body") || "" };
    }

    function place(trigger) {
      menu.hidden = false; // make measurable
      var r = trigger.getBoundingClientRect();
      var mw = menu.offsetWidth, mh = menu.offsetHeight;
      var vw = document.documentElement.clientWidth;
      var vh = document.documentElement.clientHeight;
      var left = Math.min(Math.max(12, r.left), vw - mw - 12);
      var top = r.bottom + 8;
      if (top + mh > vh - 12) top = Math.max(12, r.top - mh - 8); // flip above
      menu.style.left = left + "px";
      menu.style.top = top + "px";
    }

    function close() { menu.hidden = true; }

    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var m = parse(a.getAttribute("href"));
        addr = m.to;
        var enc = encodeURIComponent;
        var q = (k, v) => (v ? "&" + k + "=" + enc(v) : "");
        menu.querySelector('[data-action="gmail"]').href =
          "https://mail.google.com/mail/?view=cm&fs=1&to=" + enc(m.to) + q("su", m.su) + q("body", m.body);
        menu.querySelector('[data-action="outlook"]').href =
          "https://outlook.office.com/mail/deeplink/compose?to=" + enc(m.to) + q("subject", m.su) + q("body", m.body);
        menu.querySelector('[data-action="default"]').href = a.getAttribute("href");
        menu.querySelector(".mail-menu-addr").textContent = m.to;
        var copyLabel = menu.querySelector('[data-action="copy"] .mail-menu-label');
        copyLabel.textContent = "Copy address";
        place(a);
        menu.hidden = false;
      });
    });

    menu.addEventListener("click", function (e) {
      var item = e.target.closest(".mail-menu-item");
      if (!item) return;
      if (item.getAttribute("data-action") === "copy") {
        e.preventDefault();
        copyText(addr);
        item.querySelector(".mail-menu-label").textContent = "Copied!";
        setTimeout(close, 900);
        return;
      }
      setTimeout(close, 0); // gmail / outlook / default: navigate then close
    });

    document.addEventListener("click", function (e) {
      if (menu.hidden) return;
      if (menu.contains(e.target)) return;
      if (e.target.closest && e.target.closest('a[href^="mailto:"]')) return;
      close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, { passive: true });
  }

  function buildMailMenu() {
    var env = '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 6h18v12H3z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3.5 7l8.5 6 8.5-6"/>';
    var clip = '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 5h8v3H8z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M16 6h3v15H5V6h3"/>';
    var ico = function (d) { return '<svg class="mail-menu-ico" viewBox="0 0 24 24" aria-hidden="true">' + d + "</svg>"; };
    var m = document.createElement("div");
    m.className = "mail-menu";
    m.setAttribute("role", "menu");
    m.hidden = true;
    m.innerHTML =
      '<p class="mail-menu-head">Email <span class="mail-menu-addr"></span></p>' +
      '<a class="mail-menu-item" role="menuitem" data-action="gmail" target="_blank" rel="noopener">' + ico(env) + '<span class="mail-menu-label">Gmail</span></a>' +
      '<a class="mail-menu-item" role="menuitem" data-action="outlook" target="_blank" rel="noopener">' + ico(env) + '<span class="mail-menu-label">Outlook</span></a>' +
      '<a class="mail-menu-item" role="menuitem" data-action="default">' + ico(env) + '<span class="mail-menu-label">Default mail app</span></a>' +
      '<button type="button" class="mail-menu-item" role="menuitem" data-action="copy">' + ico(clip) + '<span class="mail-menu-label">Copy address</span></button>';
    document.body.appendChild(m);
    return m;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
    }
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
