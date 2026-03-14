// ============================================
// GETSYBUY GIFT - MAIN SCRIPT
// ============================================

'use strict';

// ---- STATE ----
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'All Gifts';
let searchQuery = '';
let supabaseReady = false;

// ---- DOM REFS ----
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  initCursor();
  initNav();full script.js do
  initHeroAnimations();
  initScrollAnimations();
  initMobileMenu();
  await initProducts();
  initSearch();
  initParticles();
});

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .product-card, .whatsapp-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });

  // Hide on mobile
  if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
  }
}

// ============================================
// NAV SCROLL BEHAVIOR
// ============================================
function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ============================================
// HERO ANIMATIONS (GSAP)
// ============================================
function initHeroAnimations() {
  if (typeof gsap === 'undefined') {
    // Fallback if GSAP doesn't load
    document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-cta').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const tl = gsap.timeline({ delay: 0.2 });

  tl.to('.hero-badge', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  })
  .to('.hero-title', {
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.4')
  .to('.hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6')
  .to('.hero-cta', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')
  .to('.scroll-indicator', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.2');
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Staggered card animations
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Will apply to dynamically created cards too, so we use MutationObserver
  const productsGridEl = document.getElementById('productsGrid');
  if (productsGridEl) {
    const mutObs = new MutationObserver(() => {
      productsGridEl.querySelectorAll('.product-card').forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.4s, box-shadow 0.4s';
        cardObserver.observe(card);
      });
    });
    mutObs.observe(productsGridEl, { childList: true });
  }
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ============================================
// PRODUCTS - INIT
// ============================================
async function initProducts() {
  showLoading();

  try {
    // Check if Supabase is configured
    if (typeof supabaseClient !== 'undefined' &&
        !SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      supabaseReady = true;
      allProducts = await ProductsAPI.getAll();
      // Subscribe to realtime updates
      ProductsAPI.subscribe(handleRealtimeChange);
    } else {
      // Use demo products
      allProducts = [...DEMO_PRODUCTS];
    }
  } catch (err) {
    console.warn('Supabase not configured, using demo products:', err.message);
    allProducts = [...DEMO_PRODUCTS];
  }

  filteredProducts = [...allProducts];
  renderProducts(filteredProducts);
  initFilters();
}

// Realtime change handler
function handleRealtimeChange(payload) {
  const { eventType, new: newRecord, old: oldRecord } = payload;

  if (eventType === 'INSERT') {
    allProducts.unshift(newRecord);
    showToast('New product added!', 'success');
  } else if (eventType === 'DELETE') {
    allProducts = allProducts.filter(p => p.id !== oldRecord.id);
    showToast('Product removed', 'info');
  } else if (eventType === 'UPDATE') {
    const idx = allProducts.findIndex(p => p.id === newRecord.id);
    if (idx !== -1) allProducts[idx] = newRecord;
    showToast('Product updated', 'info');
  }

  applyFilters();
}

// ============================================
// PRODUCT RENDERING
// ============================================
function renderProducts(products) {
  if (!productsGrid) return;

  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="products-empty">
        <h3>No gifts found</h3>
        <p>Try a different category or search term</p>
      </div>`;
    return;
  }

  productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
  const stars = generateStars(product.rating || 4.5);
  const price = product.price || '';

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-wrap">
        <img
          src="${escapeHtml(product.image)}"
          alt="${escapeHtml(product.name)}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop'"
        />
        <span class="product-category-tag">${escapeHtml(product.category)}</span>
        <div class="product-overlay"></div>
      </div>
      <div class="product-body">
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        ${price ? `<div class="product-price">${escapeHtml(price)}</div>` : ''}
        <div class="product-stars">
          ${stars}
          <span class="rating-num">${(product.rating || 4.5).toFixed(1)}</span>
        </div>
        <a
          href="${escapeHtml(product.affiliate)}"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="btn-amazon"
          onclick="trackClick('${escapeHtml(product.id)}', '${escapeHtml(product.name)}')"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3L4 14h7v7l9-11h-7z"/>
          </svg>
          View on Amazon
        </a>
      </div>
    </div>`;
}

function generateStars(rating) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return '★'.repeat(full) +
    (hasHalf ? '⯨' : '') +
    '<span class="star empty">' + '★'.repeat(empty) + '</span>';
}

function showLoading() {
  if (!productsGrid) return;
  productsGrid.innerHTML = `
    <div class="products-loading">
      <div class="loader-ring"></div>
      <span class="loader-text">CURATING GIFTS</span>
    </div>`;
}

// ============================================
// FILTERS
// ============================================
function initFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

function applyFilters() {
  let result = [...allProducts];

  if (currentCategory !== 'All Gifts') {
    result = result.filter(p => p.category === currentCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  filteredProducts = result;
  renderProducts(filteredProducts);
}

// ============================================
// SEARCH
// ============================================
function initSearch() {
  if (!searchInput) return;

  let debounceTimer;

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      applyFilters();
      showSearchDropdown(searchQuery);
    }, 250);
  });

  searchInput.addEventListener('focus', () => {
    if (searchQuery) showSearchDropdown(searchQuery);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) {
      hideSearchDropdown();
    }
  });
}

function showSearchDropdown(query) {
  if (!searchResults || !query.trim()) {
    hideSearchDropdown();
    return;
  }

  const q = query.toLowerCase();
  const results = allProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.category || '').toLowerCase().includes(q)
  ).slice(0, 5);

  if (results.length === 0) {
    hideSearchDropdown();
    return;
  }

  searchResults.innerHTML = results.map(p => `
    <div class="search-result-item" onclick="selectSearchResult('${p.id}', '${escapeHtml(p.category)}')">
      <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"
           onerror="this.src='https://placehold.co/44x44/111/gold?text=G'">
      <div class="search-result-info">
        <h4>${escapeHtml(p.name)}</h4>
        <span>${escapeHtml(p.category)}</span>
      </div>
    </div>
  `).join('');

  searchResults.classList.add('active');
}

function hideSearchDropdown() {
  if (searchResults) searchResults.classList.remove('active');
}

function selectSearchResult(id, category) {
  hideSearchDropdown();
  // Scroll to product
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.borderColor = 'var(--gold)';
    card.style.boxShadow = 'var(--shadow-gold)';
    setTimeout(() => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }, 2000);
  }
}

// ============================================
// AFFILIATE TRACKING
// ============================================
function trackClick(productId, productName) {
  console.log(`Affiliate click: ${productName} (${productId})`);
  // Add your analytics tracking here
}

// ============================================
// PARTICLE BACKGROUND
// ============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.gold = Math.random() > 0.7;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(201, 168, 76, ${this.opacity})`
        : `rgba(255, 255, 255, ${this.opacity * 0.5})`;
      ctx.fill();
    }
  }

  function initParticlesArray() {
    particles = [];
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201, 168, 76, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  resize();
  initParticlesArray();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticlesArray();
  });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✓', error: '✕', info: '✦' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================
// UTILITIES
// ============================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
