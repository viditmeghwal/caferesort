/* ============================================
   Grind & Glow — shared interactions
   Custom cursor, reveals, split text, parallax
   ============================================ */

(function () {
  "use strict";

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------- Custom cursor ------------- */
  if (!isTouch) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);

    let dx = -100, dy = -100;
    let rx = -100, ry = -100;
    let tx = -100, ty = -100;

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      dx = tx;
      dy = ty;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
    });

    const animate = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    const hoverables = document.querySelectorAll(
      "a, button, [data-cursor], input, textarea, .card--service, .marquee__item, .chip"
    );
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const label = el.getAttribute("data-cursor");
        if (label) {
          ring.classList.add("is-label");
          ring.textContent = label;
        } else {
          ring.classList.add("is-hover");
        }
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("is-hover", "is-label");
        ring.textContent = "";
      });
    });

    window.addEventListener("mouseleave", () => {
      dot.style.opacity = ring.style.opacity = "0";
    });
    window.addEventListener("mouseenter", () => {
      dot.style.opacity = ring.style.opacity = "1";
    });
  }

  /* ------------- Split text (per-word) ------------- */
  const splitTargets = document.querySelectorAll("[data-split]");
  splitTargets.forEach((el) => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words
      .map((w) => `<span class="word"><span>${w}</span></span>`)
      .join(" ");

    // Stagger child spans
    el.querySelectorAll(".word > span").forEach((span, i) => {
      span.style.transitionDelay = `${i * 50}ms`;
    });
  });

  /* ------------- Reveal on scroll ------------- */
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll(".reveal, [data-split]").forEach((el) => io.observe(el));
  } else {
    document
      .querySelectorAll(".reveal, [data-split]")
      .forEach((el) => el.classList.add("is-in"));
  }

  /* ------------- Parallax ------------- */
  if (!prefersReduced) {
    const parallaxEls = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
      el,
      speed: parseFloat(el.getAttribute("data-parallax")) || 0,
    }));

    if (parallaxEls.length) {
      let ticking = false;
      const update = () => {
        const viewCenter = window.scrollY + window.innerHeight / 2;
        parallaxEls.forEach(({ el, speed }) => {
          const rect = el.getBoundingClientRect();
          const elCenter = rect.top + window.scrollY + rect.height / 2;
          const delta = viewCenter - elCenter;
          el.style.transform = `translate3d(0, ${(-delta * speed).toFixed(1)}px, 0)`;
        });
        ticking = false;
      };
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
          }
        },
        { passive: true }
      );
      update();
    }
  }

  /* ------------- Count-up numbers ------------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-count"));
          const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const prefix = el.getAttribute("data-prefix") || "";
          const duration = parseInt(el.getAttribute("data-duration") || "1600", 10);
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent = prefix + val.toFixed(decimals) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ------------- Sticky step counter (how-it-works) ------------- */
  const stepCounter = document.querySelector("[data-step-counter]");
  const steps = document.querySelectorAll("[data-step]");
  if (stepCounter && steps.length && "IntersectionObserver" in window) {
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const n = entry.target.getAttribute("data-step");
            stepCounter.textContent = String(n).padStart(2, "0");
          }
        });
      },
      { threshold: 0.5 }
    );
    steps.forEach((s) => sio.observe(s));
  }

  /* ------------- FAQ accordion ------------- */
  document.querySelectorAll(".faq__item").forEach((item) => {
    const btn = item.querySelector(".faq__q");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ------------- Hero time (local clock in header) ------------- */
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      clock.textContent = `${h}:${m} IST`;
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ------------- Current year ------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
