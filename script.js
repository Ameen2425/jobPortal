
/* ================================================
   HIREHUB - Premium Job Portal | script.js
   ================================================ */

'use strict';

// =============================================
// 1. LOADING SCREEN
// =============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('fade-out');
    setTimeout(() => { if (loader) loader.remove(); }, 500);
    initAOS();
    startCounters();
  }, 1800);
});

// =============================================
// 2. AOS INITIALIZATION
// =============================================
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic',
    });
  }
}

// =============================================
// 3. PAGE ROUTING (Single-Page Navigation)
// =============================================
const pages = ['home', 'login', 'register', 'jobs', 'job-detail', 'company-detail'];

function showPage(pageId) {
  // Hide all pages
  pages.forEach(id => {
    const el = document.getElementById(`page-${id}`);
    if (el) el.classList.remove('active');
  });

  // Show target page
  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateActiveNavLink(pageId);
    updateFooterVisibility(pageId);

    // Reinit AOS on page change
    setTimeout(() => {
      if (typeof AOS !== 'undefined') AOS.refresh();
    }, 100);
  }
}

function updateActiveNavLink(pageId) {
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const map = {
    'home': 0,
    'jobs': 1,
    'company-detail': 2,
    'job-detail': 1,
    'login': -1,
    'register': -1,
  };
  const idx = map[pageId];
  if (idx >= 0) {
    const links = document.querySelectorAll('#navbar .nav-menu .nav-link');
    if (links[idx]) links[idx].classList.add('active');
  }
}

function updateFooterVisibility(pageId) {
  const footer = document.getElementById('main-footer');
  if (!footer) return;
  const noFooter = ['login', 'register'];
  footer.style.display = noFooter.includes(pageId) ? 'none' : 'block';
}

function scrollToSection(id) {
  showPage('home');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 400);
}

// =============================================
// 4. NAVBAR
// =============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }
  updateScrollProgress();
  updateScrollTop();
});

// =============================================
// 5. MOBILE MENU
// =============================================
function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobileMenu();
  }
});

// =============================================
// 6. SCROLL PROGRESS BAR
// =============================================
function updateScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = progress + '%';
}

// =============================================
// 7. SCROLL TO TOP
// =============================================
function updateScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

// =============================================
// 8. ANIMATED COUNTERS
// =============================================
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;

  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target')) || 0;
  const originalText = el.textContent;
  const suffix = originalText.replace(/[\d.]/g, '');
  const duration = 2000;
  const step = 16;
  const steps = duration / step;
  let current = 0;

  const timer = setInterval(() => {
    current += target / steps;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    const display = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
    el.textContent = display + suffix;
  }, step);
}

// =============================================
// 9. TYPING EFFECT
// =============================================
const words = ['Dream Job', 'Perfect Career', 'Next Chapter', 'Ideal Role', 'Best Opportunity'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeEffect() {
  if (!typingEl) return;

  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

// Start typing after loading
setTimeout(typeEffect, 2500);

// =============================================
// 10. TESTIMONIALS SLIDER
// =============================================
let currentSlide = 0;
let totalSlides = 0;
let autoSlideTimer;

function initSlider() {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('slider-dots');
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');
  totalSlides = Math.ceil(cards.length / getSlidesPerView());

  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }

  goToSlide(0);
  startAutoSlide();
}

function getSlidesPerView() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  const track = document.getElementById('testimonials-track');
  if (!track) return;

  const slideWidth = 100 / getSlidesPerView();
  const offset = currentSlide * getSlidesPerView() * slideWidth;
  track.style.transform = `translateX(-${offset}%)`;

  document.querySelectorAll('.slider-dots .dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  goToSlide(currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1);
  restartAutoSlide();
}

function prevSlide() {
  goToSlide(currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1);
  restartAutoSlide();
}

function startAutoSlide() {
  autoSlideTimer = setInterval(nextSlide, 5000);
}

function restartAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

window.addEventListener('resize', () => {
  initSlider();
});

// Initialize slider after page load
setTimeout(initSlider, 2000);

// =============================================
// 11. SAVE JOB TOGGLE
// =============================================
function toggleSave(btn) {
  btn.classList.toggle('saved');
  const isSaved = btn.classList.contains('saved');
  showToast(isSaved ? 'Job saved to your list! 💾' : 'Job removed from saved list');
}

// =============================================
// 12. TOAST NOTIFICATION
// =============================================
let toastTimer;

function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-message');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// =============================================
// 13. JOBS SEARCH & FILTER
// =============================================
function filterJobs() {
  const input = document.getElementById('jobs-search-input');
  const locationFilter = document.getElementById('location-filter');
  const cards = document.querySelectorAll('#jobs-list .job-list-card');

  if (!input || !cards.length) return;

  const query = input ? input.value.toLowerCase() : '';
  const location = locationFilter ? locationFilter.value.toLowerCase() : '';

  let visibleCount = 0;
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesLocation = !location || text.includes(location);

    if (matchesQuery && matchesLocation) {
      card.style.display = 'grid';
      card.style.animation = 'slideInUp 0.3s ease';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const countEl = document.querySelector('.jobs-count span');
  if (countEl) {
    countEl.textContent = visibleCount.toLocaleString();
  }
}

function clearFilters() {
  const input = document.getElementById('jobs-search-input');
  const location = document.getElementById('location-filter');
  const checkboxes = document.querySelectorAll('.filter-item input[type="checkbox"]');

  if (input) input.value = '';
  if (location) location.value = '';
  checkboxes.forEach(cb => cb.checked = false);

  filterJobs();
  showToast('Filters cleared');
}

// =============================================
// 14. SALARY SLIDER
// =============================================
function updateSalaryLabel(value) {
  const label = document.getElementById('salary-value');
  if (label) label.textContent = `$${value}K`;
}

// =============================================
// 15. PASSWORD TOGGLE
// =============================================
function togglePassword(inputId, toggleBtn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  // Swap icon
  toggleBtn.innerHTML = isPassword
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

// =============================================
// 16. AUTH FORM SUBMISSIONS
// =============================================
function loginSubmit(e) {
  e.preventDefault();
  showToast('Welcome back to HireHub! 🎉');
  setTimeout(() => showPage('home'), 1000);
}

function registerSubmit(e) {
  e.preventDefault();
  showToast('Account created successfully! 🚀 Welcome to HireHub!');
  setTimeout(() => showPage('home'), 1500);
}

// =============================================
// 17. NEWSLETTER SUBSCRIPTION
// =============================================
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('🎉 You\'re subscribed! Watch for daily job alerts in your inbox.');
  e.target.reset();
}

// =============================================
// 18. COMPANY TABS
// =============================================
function setTab(tab) {
  document.querySelectorAll('.company-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
}

// =============================================
// 19. PAGINATION
// =============================================
document.querySelectorAll('.page-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// =============================================
// 20. SEARCH BAR HERO — Enter Key
// =============================================
const heroSearchInput = document.getElementById('hero-search-input');
if (heroSearchInput) {
  heroSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      showPage('jobs');
      setTimeout(() => {
        const jobsInput = document.getElementById('jobs-search-input');
        if (jobsInput) {
          jobsInput.value = heroSearchInput.value;
          filterJobs();
        }
      }, 300);
    }
  });
}

// =============================================
// 21. SMOOTH CATEGORY / TAG CLICKS
// =============================================
document.querySelectorAll('.category-card, .tag').forEach(el => {
  el.addEventListener('click', function () {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => this.style.transform = '', 150);
  });
});

// =============================================
// 22. KEYBOARD NAVIGATION
// =============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

// =============================================
// 23. JOB CARD HOVER EFFECTS
// =============================================
document.querySelectorAll('.job-card, .job-list-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.zIndex = '10';
  });
  card.addEventListener('mouseleave', function () {
    this.style.zIndex = '';
  });
});

// =============================================
// 24. INTERSECTION OBSERVER FOR ANIMATIONS
// =============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, observerOptions);

document.querySelectorAll('.chart-bar').forEach(bar => {
  bar.style.animationPlayState = 'paused';
  observer.observe(bar);
});

// =============================================
// 25. INIT ON DOM READY
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Show home page by default
  showPage('home');

  // Add hover ripple effect to buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
  document.head.appendChild(style);

  // Smooth link transitions for nav items
  document.querySelectorAll('.nav-link').forEach(link => {
    link.style.cursor = 'pointer';
  });

  console.log('%c💼 HireHub Premium Job Portal', 'font-size:18px;font-weight:bold;color:#4f46e5;background:#eef2ff;padding:8px 16px;border-radius:8px');
  console.log('%cBuilt with HTML5, CSS3 & Vanilla JavaScript', 'color:#64748b;font-size:12px');
});

// =============================================
// 26. PERFORMANCE: Lazy-load images
// =============================================
if ('IntersectionObserver' in window) {
  const lazyImgs = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImgs.forEach(img => imgObserver.observe(img));
}

// =============================================
// 27. DARK MODE (Accessibility Toggle — future ready)
// =============================================
// Dark mode is reserved for future implementation
// Users can toggle via system preferences

// =============================================
// 28. PREVENT FORM RE-SUBMIT ON REFRESH
// =============================================
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// End of script.js
