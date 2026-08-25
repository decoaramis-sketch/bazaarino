const products = [
  { name: 'Samsung Galaxy S25 Ultra', cat: 'موبایل', price: '۶۹,۹۰۰,۰۰۰', old: '۷۳,۵۰۰,۰۰۰', discount: '۵٪', seller: 'تکنولند', rating: '۴.۸', type: 'phone' },
  { name: 'MacBook Air M3 15-inch', cat: 'لپ‌تاپ', price: '۸۹,۸۰۰,۰۰۰', old: '۹۴,۰۰۰,۰۰۰', discount: '۴٪', seller: 'اپل‌سنتر', rating: '۴.۹', type: 'laptop' },
  { name: 'Sony WH-1000XM5', cat: 'هدفون', price: '۱۹,۴۰۰,۰۰۰', old: '۲۱,۰۰۰,۰۰۰', discount: '۸٪', seller: 'صوت‌مارکت', rating: '۴.۷', type: 'headset' },
  { name: 'PlayStation 5 Slim', cat: 'گیمینگ', price: '۳۸,۹۰۰,۰۰۰', old: '۴۱,۰۰۰,۰۰۰', discount: '۵٪', seller: 'گیم‌سنتر', rating: '۴.۹', type: 'console' },
  { name: 'iPhone 15 Pro 256GB', cat: 'موبایل', price: '۵۸,۷۰۰,۰۰۰', old: '۶۱,۰۰۰,۰۰۰', discount: '۴٪', seller: 'دیجیتال‌پلاس', rating: '۴.۸', type: 'phone' },
  { name: 'ASUS Zenbook 14 OLED', cat: 'لپ‌تاپ', price: '۷۲,۳۰۰,۰۰۰', old: '۷۷,۰۰۰,۰۰۰', discount: '۶٪', seller: 'نوت‌بوک‌چی', rating: '۴.۶', type: 'laptop' },
  { name: 'JBL Live 770NC', cat: 'هدفون', price: '۸,۹۰۰,۰۰۰', old: '۱۰,۲۰۰,۰۰۰', discount: '۱۳٪', seller: 'های‌تک', rating: '۴.۷', type: 'headset' },
  { name: 'Xbox Series X', cat: 'گیمینگ', price: '۴۳,۵۰۰,۰۰۰', old: '۴۶,۰۰۰,۰۰۰', discount: '۵٪', seller: 'گیم‌سنتر', rating: '۴.۸', type: 'console' },
];

const CART_KEY = 'kalapida:cartCount';
const MAX_SELL_NAME_LENGTH = 80;
const PRODUCT_TYPES = new Set(['phone', 'laptop', 'headset', 'console']);
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const grid = document.getElementById('productGrid');

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function parseLocalizedNumber(value) {
  const normalized = String(value ?? '')
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/[^0-9.-]/g, '');
  const number = Number.parseFloat(normalized);
  return Number.isFinite(number) ? number : 0;
}

function safeSortProducts(list, mode) {
  const source = Array.isArray(list) ? [...list] : [];
  if (mode === 'price') return source.sort((a, b) => parseLocalizedNumber(a.price) - parseLocalizedNumber(b.price));
  if (mode === 'discount') return source.sort((a, b) => parseLocalizedNumber(b.discount) - parseLocalizedNumber(a.discount));
  if (mode === 'rating') return source.sort((a, b) => parseLocalizedNumber(b.rating) - parseLocalizedNumber(a.rating));
  return source;
}

function safeCartCount(value) {
  const number = Number.parseInt(value, 10);
  return Number.isSafeInteger(number) && number >= 0 && number <= 999 ? number : 0;
}

function loadCartCount(storage = window.localStorage) {
  try {
    return safeCartCount(storage.getItem(CART_KEY));
  } catch {
    return 0;
  }
}

function saveCartCount(count, storage = window.localStorage) {
  try {
    storage.setItem(CART_KEY, String(safeCartCount(count)));
  } catch {
    // Storage can be unavailable in private or embedded contexts; UI still works for this session.
  }
}

function createProductCard(product) {
  const article = document.createElement('article');
  article.className = 'product';

  const heart = document.createElement('button');
  heart.className = 'heart';
  heart.type = 'button';
  heart.dataset.action = 'toggle-fav';
  heart.setAttribute('aria-label', `افزودن ${product.name} به علاقه‌مندی‌ها`);
  heart.textContent = '♡';

  const discount = document.createElement('span');
  discount.className = 'discount';
  discount.textContent = `${product.discount} تخفیف`;

  const visual = document.createElement('div');
  visual.className = 'product-visual';
  const visualShape = document.createElement('div');
  const safeType = PRODUCT_TYPES.has(product.type) ? product.type : 'phone';
  visualShape.className = `prod-${safeType}`;
  visual.appendChild(visualShape);

  const info = document.createElement('div');
  info.className = 'product-info';
  const title = document.createElement('h3');
  title.textContent = product.name;
  const seller = document.createElement('div');
  seller.className = 'seller';
  const sellerName = document.createElement('span');
  sellerName.textContent = `فروشنده: ${product.seller}`;
  const rating = document.createElement('span');
  rating.className = 'rating';
  rating.textContent = `★ ${product.rating}`;
  seller.append(sellerName, rating);
  const priceRow = document.createElement('div');
  priceRow.className = 'price-row';
  const price = document.createElement('div');
  price.className = 'price';
  const priceValue = document.createElement('b');
  priceValue.textContent = product.price;
  const priceCurrency = document.createElement('small');
  priceCurrency.textContent = 'تومان';
  price.append(priceValue, priceCurrency);
  priceRow.appendChild(price);
  info.append(title, seller, priceRow);

  const add = document.createElement('button');
  add.className = 'add';
  add.type = 'button';
  add.dataset.action = 'add-cart';
  add.dataset.productName = product.name;
  add.setAttribute('aria-label', `افزودن ${product.name} به سبد خرید`);
  add.textContent = '＋';
  priceRow.appendChild(add);

  article.append(heart, discount, visual, info);
  return article;
}

function createEmptyState() {
  const empty = document.createElement('p');
  empty.className = 'empty-state';
  empty.textContent = 'کالایی با این معیار پیدا نشد.';
  return empty;
}

function render(list = products) {
  if (!grid) return;
  if (!Array.isArray(list) || list.length === 0) {
    grid.replaceChildren(createEmptyState());
    return;
  }
  grid.replaceChildren(...list.map(createProductCard));
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function openSidePanel() {
  document.getElementById('sidebar')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('show');
}

function closeSidePanel() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
}

function filterCat(cat, trigger) {
  render(products.filter((product) => product.cat === cat));
  scrollToId('products');
  document.querySelectorAll('.cat').forEach((button) => button.classList.remove('active'));
  trigger?.classList.add('active');
}

function currentVisibleProducts() {
  const q = normalizeText(document.getElementById('search')?.value).toLocaleLowerCase('fa-IR');
  if (!q) return products;
  return products.filter((product) => `${product.name} ${product.cat} ${product.seller}`.toLocaleLowerCase('fa-IR').includes(q));
}

function doSearch() {
  render(currentVisibleProducts());
  scrollToId('products');
}

function sortProducts(mode, trigger) {
  render(safeSortProducts(currentVisibleProducts(), mode));
  document.querySelectorAll('.filter').forEach((button) => button.classList.remove('active'));
  trigger?.classList.add('active');
  scrollToId('products');
}

function updateCartCount(count) {
  const safeCount = safeCartCount(count);
  const cartCount = document.getElementById('cartCount');
  if (cartCount) cartCount.textContent = String(safeCount);
  saveCartCount(safeCount);
}

function addCart(name) {
  updateCartCount(loadCartCount() + 1);
  toast(`«${normalizeText(name)}» به سبد اضافه شد`);
}

function toggleFav(button) {
  const isFavorite = button.textContent !== '♥';
  button.textContent = isFavorite ? '♥' : '♡';
  button.style.color = isFavorite ? '#e5092f' : '';
  button.setAttribute('aria-pressed', String(isFavorite));
}

function openSell() {
  document.getElementById('sellModal')?.classList.add('show');
  document.getElementById('sellName')?.focus();
}

function closeSell() {
  document.getElementById('sellModal')?.classList.remove('show');
}

function validateSellName(value) {
  const name = normalizeText(value);
  if (!name) return { valid: false, message: 'نام کالا را وارد کنید.' };
  if (name.length > MAX_SELL_NAME_LENGTH) return { valid: false, message: 'نام کالا بیش از حد طولانی است.' };
  return { valid: true, name };
}

function submitSell() {
  const input = document.getElementById('sellName');
  const validation = validateSellName(input?.value);
  if (!validation.valid) {
    toast(validation.message);
    input?.focus();
    return false;
  }
  closeSell();
  toast(`آگهی «${validation.name}» برای ثبت آماده شد`);
  return true;
}

function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    Object.assign(t.style, { position: 'fixed', bottom: '85px', left: '50%', transform: 'translateX(-50%)', background: '#17171b', color: '#fff', padding: '12px 18px', borderRadius: '13px', fontSize: '11px', zIndex: 80, boxShadow: '0 15px 35px rgba(0,0,0,.2)' });
    document.body.appendChild(t);
  }
  t.textContent = normalizeText(msg);
  t.style.opacity = '1';
  clearTimeout(window.tt);
  window.tt = setTimeout(() => {
    t.style.opacity = '0';
  }, 2200);
}

function handleDocumentClick(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const { action } = target.dataset;
  if (action === 'scroll') scrollToId(target.dataset.target);
  if (action === 'open-sell') openSell();
  if (action === 'close-sell') closeSell();
  if (action === 'search') doSearch();
  if (action === 'open-side') openSidePanel();
  if (action === 'close-side') closeSidePanel();
  if (action === 'filter-cat') filterCat(target.dataset.cat, target);
  if (action === 'add-cart') addCart(target.dataset.productName);
  if (action === 'toggle-fav') toggleFav(target);
  if (action === 'submit-sell') submitSell();
  if (action === 'sort-products') sortProducts(target.dataset.sort, target);
}

function init() {
  render();
  updateCartCount(loadCartCount());
  document.addEventListener('click', handleDocumentClick);
  document.getElementById('overlay')?.addEventListener('click', closeSidePanel);
  document.getElementById('search')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.getElementById('search')?.focus();
    }
    if (e.key === 'Escape') {
      closeSell();
      closeSidePanel();
    }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

window.kalapida = { products, render, doSearch, filterCat, addCart, validateSellName, loadCartCount, safeCartCount, normalizeText, parseLocalizedNumber, safeSortProducts };
