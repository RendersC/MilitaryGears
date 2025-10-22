// Data
const PRODUCTS = [
  {
    id: 1,
    title: 'Tactical Backpack Pro',
    price: 129.99,
    img: 'assets/item1.jpg',
    description: 'Military-grade tactical backpack with MOLLE system',
    category: 'backpacks'
  },
  {
    id: 2,
    title: 'Combat Boots Elite',
    price: 189.99,
    img: 'assets/item2.jpg',
    description: 'Waterproof tactical boots with reinforced toe',
    category: 'footwear'
  },
  {
    id: 3,
    title: 'Tactical Vest',
    price: 149.99,
    img: 'assets/item3.jpg',
    description: 'Adjustable tactical vest with multiple pouches',
    category: 'vests'
  },
  {
    id: 4,
    title: 'Night Vision Goggles',
    price: 299.99,
    img: 'assets/item4.jpg',
    description: 'Gen 3 night vision goggles for tactical operations',
    category: 'optics'
  }
];

// Utilities
const $ = sel => document.querySelector(sel);
const $all = sel => Array.from(document.querySelectorAll(sel));

// Theme toggle
const themeToggle = $('#themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? 'Light' : 'Dark';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Navigation
function showSection(id) {
  const sections = ['home', 'catalog', 'about'];
  sections.forEach(section => {
    $(`#${section}`).classList.toggle('hidden', section !== id);
  });
  
  if (id === 'catalog') {
    renderCatalog();
  }
}

// Add navigation listeners
document.querySelector('nav').addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  
  e.preventDefault();
  const section = link.getAttribute('href').substring(1);
  showSection(section);
});

// Catalog rendering
function renderCatalog() {
  const catalogGrid = document.querySelector('.catalog-grid');
  if (!catalogGrid) return;

  catalogGrid.innerHTML = PRODUCTS.map(product => `
    <div class="catalog-item" data-id="${product.id}">
      <img src="${product.img}" alt="${product.title}" 
           onerror="this.src='assets/placeholder.jpg'">
      <div class="item-details">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <div class="item-footer">
          <span class="price">$${product.price}</span>
          <button class="btn" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Cart functionality
let cart = [];

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    showNotification(`Added ${product.title} to cart`);
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Sound effects
const audio = new Audio('sounds/preview.mp3');
$('#soundBtn')?.addEventListener('click', () => {
  audio.currentTime = 0;
  audio.play().catch(err => console.log('Audio playback failed:', err));
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', savedTheme === 'dark');
  themeToggle.textContent = savedTheme === 'dark' ? 'Light' : 'Dark';
  
  // Show initial section
  showSection('home');
});