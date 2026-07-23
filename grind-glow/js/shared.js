/* =============================================================
   Grind & Glow — shared behaviors
   ============================================================= */

(function () {
  'use strict';

  const prefersHover = window.matchMedia('(hover: hover)').matches;

  /* ---------- Custom cursor ---------- */
  if (prefersHover) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    ring.innerHTML = '<span class="cursor-label"></span>';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    const label = ring.querySelector('.cursor-label');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function tick() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('[data-cursor], a, button');
      if (!el) return;
      ring.classList.add('is-hover');
      const l = el.getAttribute('data-cursor');
      label.textContent = l || '';
    });
    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('[data-cursor], a, button');
      if (!el) return;
      ring.classList.remove('is-hover');
      label.textContent = '';
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ---------- Split-text ---------- */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const mask = document.createElement('span');
      mask.className = 'split-mask';
      const word = document.createElement('span');
      word.className = 'split-word';
      word.style.transitionDelay = `${i * 70}ms`;
      word.textContent = w;
      mask.appendChild(word);
      el.appendChild(mask);
      el.appendChild(document.createTextNode(' '));
    });
  });

  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-split');
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('[data-split]').forEach((el) => splitObserver.observe(el));

  /* ---------- Reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Parallax ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length) {
    function onScroll() {
      parallaxEls.forEach((el) => {
        const rate = parseFloat(el.getAttribute('data-parallax')) || 0;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - window.innerHeight / 2) * rate * 0.1;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Marquee duplication for seamless loop ---------- */
  document.querySelectorAll('.marquee__track').forEach((track) => {
    const html = track.innerHTML;
    track.innerHTML = html + html;
  });

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((i) => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Sticky step counter ---------- */
  const counter = document.querySelector('[data-step-counter]');
  if (counter) {
    const steps = document.querySelectorAll('[data-step]');
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const n = entry.target.getAttribute('data-step');
          counter.textContent = `${n}/${String(steps.length).padStart(2, '0')}`;
        }
      });
    }, { threshold: 0.55 });
    steps.forEach((s) => stepObserver.observe(s));
  }
})();
