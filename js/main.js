/* mohitupawar.com
   The sky follows your reading: morning at the cover, night at the last page.
   The sky itself is tied to scroll position; only the clouds drift and the
   stars twinkle on their own, slowly. */

(function () {
  "use strict";

  var root = document.documentElement;
  var q = function (s) { return document.querySelector(s); };

  var layers = {
    noon: q(".sky__noon"),
    dusk: q(".sky__dusk"),
    night: q(".sky__night"),
    stars: q(".sky__stars")
  };
  var orb = q(".sky__orb");
  var clouds = document.querySelectorAll(".sky__cloud");
  var clock = q(".clock__time");
  var themeColor = document.querySelector('meta[name="theme-color"]');

  // 0 → 1 between a and b, eased
  function smooth(a, b, x) {
    var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function formatTime(minutes) {
    var m = Math.round(minutes / 5) * 5;
    var h = Math.floor(m / 60);
    var mm = m % 60;
    var suffix = h >= 12 ? "pm" : "am";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + (mm < 10 ? "0" : "") + mm + " " + suffix;
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var meteor = q(".sky__meteor");
  var meteorShown = false;
  var ticking = false;
  var lastT = -1;
  var lastLabel = "";
  var lastTheme = "";
  var maxScroll = 1;
  var vw = window.innerWidth;
  var vh = window.innerHeight;

  // measure once, and again only when the page or window changes size
  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    maxScroll = Math.max(1, root.scrollHeight - vh);
    lastT = -1;
    request();
  }

  function paint() {
    ticking = false;
    var t = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    t = Math.round(t * 1000) / 1000;
    if (t === lastT) return;
    lastT = t;

    layers.noon.style.opacity = smooth(0.08, 0.35, t);
    layers.dusk.style.opacity = smooth(0.45, 0.72, t);
    layers.night.style.opacity = smooth(0.7, 0.93, t);
    layers.stars.style.opacity = smooth(0.8, 1, t);

    // the sun climbs, then sinks; after dusk the moon takes its place
    var isMoon = t > 0.77;
    var y, x, o;
    if (!isMoon) {
      var p = t / 0.77;
      y = vh * (0.34 - Math.sin(Math.PI * Math.min(p, 1) * 0.85) * 0.26 + Math.max(0, p - 0.6) * 0.9);
      x = -p * vw * 0.08;
      o = 1 - smooth(0.6, 0.75, t);
    } else {
      y = vh * 0.1;
      x = -vw * 0.02;
      o = smooth(0.8, 0.92, t);
    }
    orb.classList.toggle("is-moon", isMoon);
    orb.style.opacity = o;
    orb.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";

    var cloudFade = 1 - smooth(0.55, 0.8, t);
    for (var i = 0; i < clouds.length; i++) {
      var dir = i % 2 === 0 ? 1 : -1;
      clouds[i].style.opacity = cloudFade;
      clouds[i].style.transform = "translate3d(" + (dir * t * 140).toFixed(1) + "px,0,0)";
    }

    // 7:00 am at the cover, 10:30 pm at the end
    var label = formatTime(420 + t * (1350 - 420));
    if (label !== lastLabel) {
      clock.textContent = label;
      lastLabel = label;
    }

    var theme = t < 0.35 ? "#CFE3FF" : t < 0.7 ? "#8DB8F2" : t < 0.88 ? "#6C7FD8" : "#141A47";
    if (themeColor && theme !== lastTheme) {
      themeColor.setAttribute("content", theme);
      lastTheme = theme;
    }

    // reach the last page and one shooting star crosses the sky, once
    if (!meteorShown && !reduce && meteor && t > 0.97) {
      meteorShown = true;
      meteor.classList.add("is-falling");
    }
  }

  // phones: wake the clock while scrolling, let it rest after
  var clockTag = q(".clock");
  var restTimer;
  function wakeClock() {
    clockTag.classList.add("is-awake");
    clearTimeout(restTimer);
    restTimer = setTimeout(function () { clockTag.classList.remove("is-awake"); }, 1400);
  }

  function request(e) {
    if (e && e.type === "scroll") wakeClock();
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(paint);
    }
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", measure);
  if ("ResizeObserver" in window) {
    new ResizeObserver(measure).observe(document.body);
  } else {
    window.addEventListener("load", measure);
  }
  measure();

  /* ribbon: mark the page you're on */
  var ribbonLinks = document.querySelectorAll(".ribbon a");
  if ("IntersectionObserver" in window && ribbonLinks.length) {
    var byId = {};
    ribbonLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        ribbonLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    document.querySelectorAll(".page[id]").forEach(function (p) { io.observe(p); });
  }

  /* copy email */
  var copyBtn = q(".mail__copy");
  var status = q(".mail__status");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      var done = function () {
        copyBtn.textContent = "Copied";
        status.textContent = "Email address copied.";
        setTimeout(function () {
          copyBtn.textContent = "Copy email";
          status.textContent = "";
        }, 2600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {
          status.textContent = "Couldn't copy. Select the address above instead.";
        });
      } else {
        status.textContent = "Couldn't copy. Select the address above instead.";
      }
    });
  }


  /* photos develop like a polaroid the first time you see them */
  var developing = document.querySelectorAll(".develop");
  if (reduce || !("IntersectionObserver" in window)) {
    developing.forEach(function (el) { el.classList.add("is-developed"); });
  } else {
    var dev = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-developed");
        dev.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    developing.forEach(function (el) { dev.observe(el); });
  }

  /* lightbox for the polaroids */
  var box = q(".lightbox");
  var boxImg = q(".lightbox__img");
  var boxCap = q(".lightbox__caption");
  var openers = Array.prototype.slice.call(document.querySelectorAll(".snap__open"));
  var current = 0;
  var returnFocus = null;

  function showPhoto(i) {
    current = (i + openers.length) % openers.length;
    var img = openers[current].querySelector("img");
    var cap = openers[current].parentNode.querySelector("figcaption");
    boxImg.classList.remove("is-shown");
    boxImg.onload = function () { boxImg.classList.add("is-shown"); };
    boxImg.src = img.getAttribute("src");
    boxImg.alt = img.alt;
    if (boxImg.complete) boxImg.classList.add("is-shown");
    boxCap.textContent = cap ? cap.textContent : "";
  }

  if (box && typeof box.showModal === "function") {
    openers.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        returnFocus = btn;
        showPhoto(i);
        box.showModal();
      });
    });
    q(".lightbox__close").addEventListener("click", function () { box.close(); });
    q(".lightbox__prev").addEventListener("click", function () { showPhoto(current - 1); });
    q(".lightbox__next").addEventListener("click", function () { showPhoto(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") showPhoto(current + 1);
      if (e.key === "ArrowLeft") showPhoto(current - 1);
    });
    box.addEventListener("close", function () { if (returnFocus) returnFocus.focus(); });
  }
})();
