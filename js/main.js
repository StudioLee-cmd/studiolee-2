/* ============================================================
   DASH STUDIO TEMPLATE — MAIN.JS
   Handles: Lenis smooth scroll, GSAP ScrollTrigger animations,
   section reveals, accordion, header scroll state, mobile menu,
   cookie banner, and page hero animations.
   ============================================================ */

// --- LENIS SMOOTH SCROLL ---
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// --- HEADER SCROLL STATE ---
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.scroll() > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    },
  });
}

// --- HERO ANIMATION ---
function initHero() {
  const lines = document.querySelectorAll('.hero-title .line-inner');
  const subtitle = document.querySelector('.hero-subtitle');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');

  // Reveal hero lines with stagger
  if (lines.length) {
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('revealed'), 300 + i * 150);
    });
  }

  // Reveal subtitle
  if (subtitle) {
    setTimeout(() => subtitle.classList.add('revealed'), 300 + lines.length * 150 + 200);
  }

  // Reveal scroll indicator
  if (scrollIndicator) {
    setTimeout(() => scrollIndicator.classList.add('revealed'), 300 + lines.length * 150 + 500);
  }
}

// --- SECTION REVEALS ON SCROLL ---
function initSectionReveals() {
  const revealEls = document.querySelectorAll('.section-reveal, .case-study, .team-photo, .news-card');

  revealEls.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        // Stagger siblings
        const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(
          (child) => child.classList.contains(el.classList[0])
        ) : [];
        const siblingIndex = siblings.indexOf(el);
        const delay = siblingIndex >= 0 ? (siblingIndex % 3) * 80 : 0;

        setTimeout(() => el.classList.add('revealed'), delay);
      },
    });
  });
}

// --- BRANDS ACCORDION ---
function initAccordion() {
  const items = document.querySelectorAll('.brand-item');

  items.forEach((item) => {
    const header = item.querySelector('.brand-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others
      items.forEach((other) => {
        if (other !== item) other.classList.remove('is-open');
      });

      // Toggle current
      item.classList.toggle('is-open', !isOpen);
    });
  });
}

// --- MOBILE MENU ---
function initMobileMenu() {
  const btn = document.querySelector('.menu-btn');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('is-open');
    menu.classList.toggle('is-open');
    btn.classList.toggle('is-open');

    if (lenis) {
      isOpen ? lenis.start() : lenis.stop();
    }
  });

  // Close on link click
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      if (lenis) lenis.start();
    });
  });

  // Close on backdrop click
  const backdrop = menu.querySelector('.mobile-menu-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      if (lenis) lenis.start();
    });
  }
}

// --- COOKIE BANNER ---
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  // Check if already accepted/declined
  if (localStorage.getItem('cookies-choice')) {
    banner.remove();
    return;
  }

  // Show after short delay
  setTimeout(() => banner.classList.add('visible'), 1500);

  banner.querySelectorAll('.cookie-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.action;
      localStorage.setItem('cookies-choice', choice);
      banner.classList.remove('visible');
      banner.classList.add('hidden');
      setTimeout(() => banner.remove(), 600);
    });
  });
}

// --- PAGE HERO ANIMATIONS (sub-pages) ---
function initPageHero() {
  const heroTitle = document.querySelector('.page-hero-title');
  const heroDesc = document.querySelector('.page-hero-desc');

  if (heroTitle) {
    setTimeout(() => heroTitle.classList.add('revealed'), 200);
  }

  if (heroDesc) {
    setTimeout(() => heroDesc.classList.add('revealed'), 200);
  }
}

// --- WORK / BLOG CARD REVEALS ---
function initCardReveals() {
  const cards = document.querySelectorAll('.work-card, .blog-card');

  cards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const siblings = card.parentElement ? Array.from(card.parentElement.children) : [];
        const idx = siblings.indexOf(card);
        setTimeout(() => card.classList.add('visible'), (idx % 3) * 100);
      },
    });
  });
}

// --- FILTERS (work + blog page) ---
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('[data-category]');
  if (!filterBtns.length) return;

  function applyFilter(filter) {
    filterBtns.forEach((b) => {
      b.classList.toggle('active', b.dataset.filter === filter);
    });

    items.forEach((item) => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        setTimeout(() => item.classList.add('visible'), 50);
      } else {
        item.classList.remove('visible');
        setTimeout(() => (item.style.display = 'none'), 500);
      }
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });
}

// --- CONTACT FORM ANIMATIONS ---
function initContactForm() {
  const groups = document.querySelectorAll('.form-group');
  groups.forEach((group, i) => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(20px)';

    ScrollTrigger.create({
      trigger: group,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        setTimeout(() => {
          group.style.transition = 'all 0.6s ease-out';
          group.style.opacity = '1';
          group.style.transform = 'translateY(0)';
        }, i * 80);
      },
    });
  });
}

// --- FAQ ACCORDION ---
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach((other) => {
        if (other !== item) other.classList.remove('is-open');
      });
      item.classList.toggle('is-open', !isOpen);
    });
  });
}

// --- MARQUEE DUPLICATION ---
function initMarquee() {
  const marquees = document.querySelectorAll('.marquee-inner');
  marquees.forEach((m) => {
    const content = m.innerHTML;
    m.innerHTML = content + content;
  });
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  initLenis();
  initHeader();
  initHero();
  initSectionReveals();
  initAccordion();
  initMobileMenu();
  initCookieBanner();
  initPageHero();
  initCardReveals();
  initFilters();
  initContactForm();
  initFaq();
  initMarquee();
});

// Refresh ScrollTrigger on resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
