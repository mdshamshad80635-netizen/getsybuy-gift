// ============================================
// GETSYBUY GIFT - ADMIN PANEL SCRIPT
// ============================================

'use strict';

// ---- CONFIG ----
// Change this password before deploying!
const ADMIN_PASSWORD_HASH = 'getsybuy2024admin'; // Store hashed in production
const SESSION_KEY = 'getsybuy_admin_session';

// ---- STATE ----
let adminProducts = [];
let editingId = null;

// ---- DOM REFS ----
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const productsList = document.getElementById('productsList');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const statsTotal = document.getElementById('statsTotal');
const searchAdmin = document.getElementById('searchAdmin');

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  initLoginForm();
  initModal();
  initAdminCursor();
});

// ============================================
// AUTH
// ============================================
function checkSession() {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session === btoa(ADMIN_PASSWORD_HASH)) {
    showDashboard();
  } else {
    showLogin();
  }
}

function initLoginForm() {
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = passwordInput.value.trim();
    const btn = loginForm.querySelector('button[type="submit"]');

    btn.textContent = 'Verifying...';
    btn.disabled = true;

    // Simulate slight delay for security
    await new Promise(r => setTimeout(r, 600));

    if (password === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, btoa(ADMIN_PASSWORD_HASH));
      loginError.style.display = 'none';
      btn.textContent = '✓ Access Granted';
      btn.style.background = '#22c55e';
      setTimeout(showDashboard, 800);
    } else {
      loginError.style.display = 'flex';
      loginError.textContent = 'Incorrect password. Please try again.';
      btn.textContent = 'Login';
      btn.disabled = false;
      passwordInput.value = '';
      passwordInput.focus();
      // Shake animation
      loginForm.closest('.login-card').classList.add('shake');
      setTimeout(() => loginForm.closest('.login-card').classList.remove('shake'), 500);
    }
  });

  // Toggle password visibility
  const toggleBtn = document.getElementById('togglePassword');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      toggleBtn.textContent = type === 'password' ? '👁' : '👁‍🗨';
    });
  }
}

function showLogin() {
  if (loginScreen) loginScreen.style.display = 'flex';
  if (dashboardScreen) dashboardScreen.style.display = 'none';
}

function showDashboard() {
  if (loginScreen) loginScreen.style.display = 'none';
  if (dashboardScreen) dashboardScreen.style.display = 'flex';
  loadAdminProducts();
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
  if (passwordInput) passwordInput.value = '';
  showAdminToast('Logged out successfully', 'info');
}

// ============================================
// PRODUCTS LOAD
// ============================================
async function loadAdminProducts(filter = '') {
  showAdminLoading();

  try {
    if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      adminProducts = filter
        ? await ProductsAPI.search(filter)
        : await ProductsAPI.getAll();
    } else {
      adminProducts = [...DEMO_PRODUCTS];
    }
  } catch (err) {
    console.error('Error loading products:', err);
    adminProducts = [...DEMO_PRODUCTS];
    showAdminToast('Using demo data (Supabase not configured)', 'warning');
  }

  renderAdminProducts(adminProducts);
  updateStats();
}

function updateStats() {
  if (statsTotal) statsTotal.textContent = adminProducts.length;

  // Category breakdown
  const cats = {};
  adminProducts.forEach(p => {
    cats[p.category] = (cats[p.category] || 0) + 1;
  });

  const catStatsEl = document.getElementById('statsCats');
  if (catStatsEl) {
    catStatsEl.innerHTML = Object.entries(cats)
      .map(([cat, count]) => `<span>${cat}: <strong>${count}</strong></span>`)
      .join('');
  }
}

function showAdminLoading() {
  if (!productsList) return;
  productsList.innerHTML = `
    <div class="admin-loading">
      <div class="admin-loader"></div>
      <span>Loading products...</span>
    </div>`;
}

// ============================================
// RENDER ADMIN TABLE
// ============================================
function renderAdminProducts(products) {
  if (!productsList) return;

  if (products.length === 0) {
    productsList.innerHTML = `
      <div class="admin-empty">
        <span>📦</span>
        <h3>No products found</h3>
        <p>Add your first product using the button above</p>
      </div>`;
    return;
  }

  productsList.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Rating</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => renderAdminRow(p)).join('')}
      </tbody>
    </table>`;
}

function renderAdminRow(product) {
  return `
    <tr data-id="${product.id}">
      <td>
        <div class="product-row-info">
          <img src="${escapeHtml(product.image)}"
               alt="${escapeHtml(product.name)}"
               onerror="this.src='https://placehold.co/48x48/111/gold?text=G'">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <small><a href="${escapeHtml(product.affiliate)}" target="_blank" rel="noopener">Amazon Link ↗</a></small>
          </div>
        </div>
      </td>
      <td><span class="cat-badge">${escapeHtml(product.category)}</span></td>
      <td><span class="rating-badge">⭐ ${(product.rating || 4.5).toFixed(1)}</span></td>
      <td>${product.price ? escapeHtml(product.price) : '—'}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openEditModal('${product.id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteProduct('${product.id}', '${escapeHtml(product.name)}')">🗑️ Delete</button>
        </div>
      </td>
    </tr>`;
}

// ============================================
// SEARCH
// ============================================
if (searchAdmin) {
  let debounce;
  searchAdmin.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      loadAdminProducts(searchAdmin.value.trim());
    }, 300);
  });
}

// ============================================
// MODAL - ADD/EDIT PRODUCT
// ============================================
function initModal() {
  // Close on backdrop click
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) closeModal();
    });
  }

  // Form submit
  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }

  // Image URL preview
  const imageInput = document.getElementById('fieldImage');
  const imagePreview = document.getElementById('imagePreview');
  if (imageInput && imagePreview) {
    imageInput.addEventListener('input', () => {
      const url = imageInput.value.trim();
      if (url) {
        imagePreview.src = url;
        imagePreview.style.display = 'block';
        imagePreview.onerror = () => { imagePreview.style.display = 'none'; };
      } else {
        imagePreview.style.display = 'none';
      }
    });
  }
}

function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('submitBtn').textContent = 'Add Product';
  productForm.reset();
  const imagePreview = document.getElementById('imagePreview');
  if (imagePreview) imagePreview.style.display = 'none';
  openModal();
}

function openEditModal(id) {
  const product = adminProducts.find(p => p.id == id);
  if (!product) return;

  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('submitBtn').textContent = 'Save Changes';

  // Populate form
  document.getElementById('fieldName').value = product.name || '';
  document.getElementById('fieldImage').value = product.image || '';
  document.getElementById('fieldAffiliate').value = product.affiliate || '';
  document.getElementById('fieldCategory').value = product.category || 'All Gifts';
  document.getElementById('fieldRating').value = product.rating || 4.5;
  document.getElementById('fieldPrice').value = product.price || '';
  document.getElementById('fieldDescription').value = product.description || '';

  // Show image preview
  const imagePreview = document.getElementById('imagePreview');
  if (imagePreview && product.image) {
    imagePreview.src = product.image;
    imagePreview.style.display = 'block';
  }

  openModal();
}

function openModal() {
  if (productModal) {
    productModal.style.display = 'flex';
    setTimeout(() => productModal.classList.add('open'), 10);
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (productModal) {
    productModal.classList.remove('open');
    setTimeout(() => {
      productModal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

// ============================================
// FORM SUBMIT - ADD/EDIT
// ============================================
async function handleProductSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  const productData = {
    name: document.getElementById('fieldName').value.trim(),
    image: document.getElementById('fieldImage').value.trim(),
    affiliate: document.getElementById('fieldAffiliate').value.trim(),
    category: document.getElementById('fieldCategory').value,
    rating: parseFloat(document.getElementById('fieldRating').value) || 4.5,
    price: document.getElementById('fieldPrice').value.trim(),
    description: document.getElementById('fieldDescription').value.trim(),
  };

  // Validate
  if (!productData.name || !productData.image || !productData.affiliate) {
    showAdminToast('Please fill in all required fields', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = editingId ? 'Save Changes' : 'Add Product';
    return;
  }

  try {
    if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      if (editingId) {
        await ProductsAPI.update(editingId, productData);
        showAdminToast('Product updated successfully!', 'success');
      } else {
        await ProductsAPI.add(productData);
        showAdminToast('Product added successfully!', 'success');
      }
    } else {
      // Demo mode: update local array
      if (editingId) {
        const idx = adminProducts.findIndex(p => p.id == editingId);
        if (idx !== -1) adminProducts[idx] = { ...adminProducts[idx], ...productData };
        showAdminToast('Product updated (demo mode)', 'success');
      } else {
        adminProducts.unshift({ id: 'demo-' + Date.now(), ...productData });
        showAdminToast('Product added (demo mode - configure Supabase to persist)', 'success');
      }
    }

    closeModal();
    await loadAdminProducts(searchAdmin?.value || '');

  } catch (err) {
    console.error('Error saving product:', err);
    showAdminToast('Error: ' + err.message, 'error');
  }

  submitBtn.disabled = false;
  submitBtn.textContent = editingId ? 'Save Changes' : 'Add Product';
}

// ============================================
// DELETE PRODUCT
// ============================================
async function deleteProduct(id, name) {
  if (!confirm(`Delete "${name}"?\n\nThis action cannot be undone.`)) return;

  try {
    if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      await ProductsAPI.delete(id);
    } else {
      adminProducts = adminProducts.filter(p => p.id != id);
    }
    showAdminToast(`"${name}" deleted`, 'success');
    await loadAdminProducts(searchAdmin?.value || '');
  } catch (err) {
    showAdminToast('Error deleting: ' + err.message, 'error');
  }
}

// ============================================
// ADMIN CURSOR (subtle)
// ============================================
function initAdminCursor() {
  // Admin panel uses default cursor
  document.body.style.cursor = 'default';
}

// ============================================
// TOAST
// ============================================
function showAdminToast(message, type = 'info') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;

  const icons = { success: '✓', error: '✕', info: '✦', warning: '⚠' };
  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    info: 'var(--gold)',
    warning: '#f59e0b'
  };

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.style.borderLeftColor = colors[type] || colors.info;
  toast.innerHTML = `
    <span style="color:${colors[type] || colors.info}">${icons[type] || '✦'}</span>
    <span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================
// UTILITY
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
