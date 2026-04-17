/**
 * Fingal Glass Centre — App.js
 * Lenis smooth scroll + GSAP ScrollTrigger animations
 */

/* ── Lenis Smooth Scroll ──────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
});

gsap.registerPlugin(ScrollTrigger);

// Wire Lenis to GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Wire Lenis scroll to ScrollTrigger
lenis.on('scroll', () => {
  ScrollTrigger.update();
});

/* ── Navigation ───────────────────────────────────────────────── */
const nav      = document.getElementById('nav');
const burger   = document.getElementById('burger');
const mobileNav  = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

// Scrolled state
ScrollTrigger.create({
  start: 'top -80px',
  onEnter:     () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

// Burger toggle
burger.addEventListener('click', () => {
  mobileNav.classList.add('open');
  lenis.stop();
});
mobileClose.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  lenis.start();
});
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    lenis.start();
  });
});

/* ── Hero Entrance ────────────────────────────────────────────── */
const heroTL = gsap.timeline({ delay: 0.15 });

// Badge
heroTL.from('.emergency-badge', {
  opacity: 0,
  y: 20,
  duration: 0.6,
  ease: 'power3.out',
});

// Title lines — clip reveal
document.querySelectorAll('.ht-line').forEach((line, i) => {
  const inner = document.createElement('span');
  inner.style.cssText = 'display:block;will-change:transform';
  inner.innerHTML = line.innerHTML;
  line.innerHTML = '';
  line.style.overflow = 'hidden';
  line.appendChild(inner);

  heroTL.from(inner, {
    y: '110%',
    duration: 0.9,
    ease: 'power4.out',
  }, i === 0 ? '-=0.35' : '-=0.65');
});

// Sub + actions + phones
heroTL
  .from('.hero-sub',    { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.5')
  .from('.hero-actions', { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out' }, '-=0.5')
  .from('.hero-phones',  { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out' }, '-=0.4');

// Hero visual
heroTL
  .from('.glass-grid',        { opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out' }, '-=0.9')
  .from('.badge-years',        { opacity: 0, x: 30, y: -30, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
  .from('.badge-gen',          { opacity: 0, x: -30, y: 30, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4');

/* ── Glass pane shimmer ──────────────────────────────────────── */
gsap.to('.glass-pane--1', { opacity: 0.6, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0 });
gsap.to('.glass-pane--2', { opacity: 0.5, duration: 3,   repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8 });
gsap.to('.glass-pane--3', { opacity: 0.6, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 });
gsap.to('.glass-pane--4', { opacity: 0.5, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 });

/* ── Scroll Reveal Helper ─────────────────────────────────────── */
function revealOnScroll(selector, props, options = {}) {
  document.querySelectorAll(selector).forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, ...props.from },
      {
        opacity: 1,
        ...props.to,
        duration:  options.duration  || 0.85,
        ease:      options.ease      || 'power3.out',
        delay:     (options.stagger  || 0) * i,
        scrollTrigger: {
          trigger:  el,
          start:    options.start || 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ── Section reveals ──────────────────────────────────────────── */

// Fade up (default)
revealOnScroll('[data-reveal="fade"]',
  { from: { y: 32 }, to: { y: 0 } },
  { duration: 0.9 }
);

// Scale in (cards)
revealOnScroll('[data-reveal="scale"]',
  { from: { y: 40, scale: 0.96 }, to: { y: 0, scale: 1 } },
  { duration: 0.8, stagger: 0.08 }
);

// Slide from left
revealOnScroll('[data-reveal="left"]',
  { from: { x: -60 }, to: { x: 0 } },
  { duration: 0.9 }
);

// Slide from right
revealOnScroll('[data-reveal="right"]',
  { from: { x: 60 }, to: { x: 0 } },
  { duration: 0.9 }
);

// Rise from bottom (testimonials)
revealOnScroll('[data-reveal="bottom"]',
  { from: { y: 50 }, to: { y: 0 } },
  { duration: 0.85, stagger: 0.1 }
);

/* ── Counter Animations ───────────────────────────────────────── */
document.querySelectorAll('.counter').forEach(counter => {
  const target   = parseFloat(counter.dataset.target);
  const decimals = parseInt(counter.dataset.decimals || 0);

  ScrollTrigger.create({
    trigger: counter,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        { val: 0 },
        { val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () {
            counter.textContent = this.targets()[0].val.toFixed(decimals);
          }
        }
      );
    },
  });
});

/* ── Smooth anchor scrolling ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80 });
  });
});

/* ── Area tags staggered reveal ──────────────────────────────── */
const areaTags = document.querySelectorAll('.area-tag');
if (areaTags.length) {
  ScrollTrigger.create({
    trigger: '.areas-tags',
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.from(areaTags, {
        opacity: 0,
        y: 16,
        scale: 0.9,
        stagger: 0.06,
        duration: 0.5,
        ease: 'back.out(1.4)',
      });
    },
  });
}
