/* ================================================
   PORTFOLIO — main.js
   ================================================ */

'use strict';

/* ------------------------------------------------
   1. PAGE LOADER
   ------------------------------------------------ */
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 900);
});


/* ------------------------------------------------
   2. THEME TOGGLE (dark / light + localStorage)
   ------------------------------------------------ */
(function initTheme() {
  const html   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  const saved  = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
})();


/* ------------------------------------------------
   3. SCROLL PROGRESS BAR
   ------------------------------------------------ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = maxScroll > 0 ? (scrolled / maxScroll * 100) + '%' : '0%';
  }, { passive: true });
})();


/* ------------------------------------------------
   4. NAVBAR — scroll shrink + active link
   ------------------------------------------------ */
(function initNavbar() {
  const header  = document.getElementById('header');
  const links   = document.querySelectorAll('.nav-item-link');
  const sections = document.querySelectorAll('main section[id]');
  const toggler = document.getElementById('navToggler');
  const collapse = document.getElementById('navMenu');

  // Shrink on scroll
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link on scroll via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -30% 0px' });

  sections.forEach(s => observer.observe(s));

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // Update toggler aria-expanded for hamburger animation
  if (toggler && collapse) {
    collapse.addEventListener('show.bs.collapse', () => toggler.setAttribute('aria-expanded', 'true'));
    collapse.addEventListener('hide.bs.collapse', () => toggler.setAttribute('aria-expanded', 'false'));
  }
})();


/* ------------------------------------------------
   5. TYPEWRITER EFFECT
   ------------------------------------------------ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words   = ['Full Stack Developer', 'Frontend Developer', 'UI/UX Designer', 'JavaScript Dev'];
  let wordIdx   = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    const current = words[wordIdx];

    if (paused) return;

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; type(); }, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting  = false;
        wordIdx   = (wordIdx + 1) % words.length;
      }
    }

    setTimeout(type, deleting ? 55 : 90);
  }

  setTimeout(type, 800);
})();


/* ------------------------------------------------
   6. HERO CANVAS — particle network
   ------------------------------------------------ */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles, animId;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function getColor() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? { dot: '91,77,232', line: '91,77,232' }
      : { dot: '124,106,255', line: '0,212,255' };
  }

  function createParticles() {
    const count = Math.min(Math.floor(w * h / 12000), 80);
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 2 + 1
    }));
  }

  let mouseX = -9999, mouseY = -9999;
  canvas.closest('section').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const color = getColor();
    const connectDist = 130;
    const mouseDist   = 160;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.dot},0.5)`;
      ctx.fill();
    });

    particles.forEach((a, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectDist) {
          const alpha = (1 - dist / connectDist) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${color.line},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Mouse interaction
      const mdx = a.x - mouseX, mdy = a.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < mouseDist) {
        const alpha = (1 - mdist / mouseDist) * 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(${color.dot},${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    createParticles();
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(start, 200);
  }, { passive: true });

  start();
})();


/* ------------------------------------------------
   7. SCROLL REVEAL (IntersectionObserver)
   ------------------------------------------------ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));

  // Hero elements animate immediately
  document.querySelectorAll('.hero-content > *, .hero-photo-wrap').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.12 + 0.1}s`;
    el.classList.add('auto');
  });
})();


/* ------------------------------------------------
   8. SKILL BARS — animate on scroll
   ------------------------------------------------ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar    = entry.target;
        const target = bar.getAttribute('data-width') || '0';
        bar.style.width = target + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ------------------------------------------------
   9. HOBBY CARDS — flip on click (mobile friendly)
   ------------------------------------------------ */
(function initHobbyCards() {
  const cards = document.querySelectorAll('.hobby-card');
  cards.forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
})();


/* ------------------------------------------------
   10. CUSTOM CURSOR
   ------------------------------------------------ */
(function initCursor() {
  const dot   = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  if (!dot || !trail) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  (function animateCursor() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    dot.style.left   = tx + 'px';
    dot.style.top    = ty + 'px';
    trail.style.left = cx + 'px';
    trail.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  })();

  // Expand on interactive elements
  document.querySelectorAll('a, button, .skill-card, .project-card, .hobby-card, .exp-card').forEach(el => {
    el.addEventListener('mouseenter', () => trail.classList.add('expanded'));
    el.addEventListener('mouseleave', () => trail.classList.remove('expanded'));
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity   = '0';
    trail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity   = '1';
    trail.style.opacity = '1';
  });
})();


/* ------------------------------------------------
   11. GSAP scroll animations (cards entrance)
   ------------------------------------------------ */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Stagger project cards
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      y: 50,
      opacity: 0,
      duration: 0.6,
      delay: i % 3 * 0.12,
      ease: 'power2.out'
    });
  });

  // Stagger exp cards
  gsap.utils.toArray('.exp-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      y: 40,
      opacity: 0,
      duration: 0.55,
      delay: i * 0.15,
      ease: 'power2.out'
    });
  });

  // Timeline items slide in
  gsap.utils.toArray('.timeline-card').forEach(card => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  });
})();


/* ------------------------------------------------
   12. SMOOTH SCROLL for anchor links
   ------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('header')?.offsetHeight || 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
