const state = {
  config: { currency: 'VND', products: [] },
  user: null,
  dashboard: { balance: 0, transactions: [], deposits: [], purchases: [], storageConfigured: false }
};

const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bag: '<path d="M5 8.5h14l-1 11H6l-1-11Z"/><path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9"/>',
  activity: '<path d="M4 13h3l2-6 3 11 2-6h6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  shield: '<path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  download: '<path d="M12 4v10M8 11l4 4 4-4M5 20h14"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/>',
  google: '<path d="M21.3 12.2c0-.7-.1-1.5-.2-2.2H12v4.2h5.2a4.5 4.5 0 0 1-1.9 3v2.5h3.2c1.9-1.7 2.8-4.1 2.8-7.5Z" fill="currentColor" stroke="none"/><path d="M12 21.5c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 21.5Z" fill="currentColor" stroke="none" opacity=".76"/><path d="M6.4 13.3a6 6 0 0 1 0-2.6V8.1H3.1a10 10 0 0 0 0 7.8l3.3-2.6Z" fill="currentColor" stroke="none" opacity=".55"/><path d="M12 6.5c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 3.5 14.7 2.5 12 2.5a10 10 0 0 0-8.9 5.6l3.3 2.6C7.2 8.3 9.4 6.5 12 6.5Z" fill="currentColor" stroke="none" opacity=".9"/>',
  logout: '<path d="M14 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3M10 12h10M17 8l4 4-4 4"/>'
};

const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.grid}</svg>`;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const on = (selector, event, handler) => $(selector)?.addEventListener(event, handler);

const UI_TRANSLATIONS = new Map([
  ['Workspace', 'Khu vực làm việc'], ['Home', 'Trang chủ'], ['Add funds', 'Nạp tiền'], ['Shop', 'Cửa hàng'],
  ['Transactions', 'Giao dịch'], ['Deposits', 'Lịch sử nạp'], ['Protected balance', 'Số dư được bảo vệ'],
  ['Encrypted at rest', 'Mã hóa khi lưu trữ'], ['Guest mode', 'Chế độ khách'], ['Sign in to activate', 'Đăng nhập để kích hoạt'],
  ['Web balance', 'Số dư web'], ['Balance', 'Số dư'], ['Account menu', 'Menu tài khoản'], ['Open menu', 'Mở menu'],
  ['Notifications', 'Thông báo'], ['Overview', 'Tổng quan'], ['Tuesday · 04 August 2026', 'Thứ Ba · 04 tháng 08, 2026'],
  ['Your wallet, in one place.', 'Ví web của bạn, ở một nơi.'], ['A considered balance for the things worth bringing home.', 'Quản lý số dư để mua những món đồ bạn yêu thích.'],
  ['Preview mode', 'Chế độ xem thử'], ['Continue with Google', 'Tiếp tục với Google'], ['Spend thoughtfully', 'Mua sắm có chủ đích'],
  ['Shop the collection', 'Khám phá sản phẩm'], ['4 packages · digital delivery', '4 gói · giao hàng kỹ thuật số'], ['packages · digital delivery', 'gói · giao hàng kỹ thuật số'],
  ['Your ledger', 'Sổ giao dịch'], ['Transaction history', 'Lịch sử giao dịch'], ['View all', 'Xem tất cả'],
  ['Pay2S records', 'Lịch sử Pay2S'], ['Deposit history', 'Lịch sử nạp tiền'], ['Last 8 deposits', '8 lần nạp gần nhất'],
  ['Security', 'Bảo mật'], ['Terms', 'Điều khoản'], ['Support', 'Hỗ trợ'], ['Fund', 'Nạp tiền'], ['History', 'Giao dịch'],
  ['Pay2S transfer', 'Chuyển tiền Pay2S'], ['How much do you want to add?', 'Bạn muốn nạp bao nhiêu?'],
  ['Your payment opens securely with Pay2S. Your Chuột shop balance updates only after the payment notification is verified.', 'Thanh toán sẽ mở an toàn qua Pay2S. Số dư Chuột shop chỉ cập nhật sau khi xác minh thông báo thanh toán.'],
  ['Amount', 'Số tiền'], ['Continue to Pay2S', 'Tiếp tục đến Pay2S'], ['Secure handoff · no card details stored here', 'Kết nối an toàn · không lưu thông tin thẻ tại đây'],
  ['Payment ready', 'Thanh toán đã sẵn sàng'], ['Scan to add funds', 'Quét để nạp tiền'], ['Open your banking app and scan this code.', 'Mở ứng dụng ngân hàng và quét mã này.'],
  ["I'll check my balance", 'Tôi đã kiểm tra số dư'], ['I’ll check my balance', 'Tôi đã kiểm tra số dư'], ['Wallet / Add funds', 'Ví web / Nạp tiền'], ['Top up your web balance.', 'Nạp thêm vào số dư web.'],
  ['Choose a package and complete the secure Pay2S handoff.', 'Chọn một mệnh giá và hoàn tất thanh toán an toàn qua Pay2S.'],
  ['Move money in', 'Nạp tiền vào'], ['Custom amount', 'Số tiền tùy chọn'], ['Quick test', 'Dùng thử nhanh'], ['Small start', 'Bắt đầu nhỏ'],
  ['Quick top-up', 'Nạp nhanh'], ['Everyday add', 'Nạp hằng ngày'], ['Light start', 'Khởi đầu nhẹ'], ['Most selected', 'Được chọn nhiều nhất'],
  ['Build your balance', 'Tăng số dư'], ['More room to shop', 'Mua sắm thoải mái hơn'], ['Settle in', 'Nạp dùng dài hạn'],
  ['Wallet / Transactions', 'Ví web / Giao dịch'], ['Transaction history.', 'Lịch sử giao dịch.'],
  ['A clear record of deposits and purchases made with your web balance.', 'Theo dõi rõ ràng các lần nạp và mua bằng số dư web.'],
  ['All transactions', 'Tất cả giao dịch'], ['Sanity ledger', 'Sổ lưu trên Sanity'], ['Wallet / Deposits', 'Ví web / Nạp tiền'],
  ['Deposit history.', 'Lịch sử nạp tiền.'], ['Track every Pay2S top-up and its confirmation status.', 'Theo dõi từng lần nạp Pay2S và trạng thái xác nhận.'],
  ['All deposits', 'Tất cả lần nạp'], ['Add funds', 'Nạp tiền']
]);

const ATTRIBUTE_TRANSLATIONS = new Map([
  ['Primary navigation', 'Điều hướng chính'], ['Chuột shop home', 'Trang chủ Chuột shop'], ['Notifications', 'Thông báo'],
  ['Web balance', 'Số dư web'], ['Account menu', 'Menu tài khoản'], ['Open menu', 'Mở menu'], ['Close', 'Đóng'],
  ['Pay2S payment QR code', 'Mã QR thanh toán Pay2S']
]);

function translateStaticContent() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const value = node.nodeValue.trim();
    const translation = UI_TRANSLATIONS.get(value);
    if (translation) node.nodeValue = node.nodeValue.replace(value, translation);
  }
  document.querySelectorAll('[aria-label], [alt]').forEach((element) => {
    for (const attribute of ['aria-label', 'alt']) {
      const value = element.getAttribute(attribute);
      const translation = ATTRIBUTE_TRANSLATIONS.get(value);
      if (translation) element.setAttribute(attribute, translation);
    }
  });
}

function hydrateIcons() {
  $$('[data-icon]').forEach((element) => {
    const name = [...element.classList].find((className) => className.startsWith('icon-'))?.slice(5) || element.dataset.icon;
    element.innerHTML = icon(name);
  });
}

function formatVnd(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function translateLedgerText(value) {
  const text = String(value || '');
  if (text === 'Pay2S wallet deposit') return 'Nạp tiền qua Pay2S';
  const purchased = text.match(/^Purchased (.+)$/);
  if (purchased) {
    const productNames = { 'Focus Pack': 'Gói Tập trung', 'Signal Pack': 'Gói Tín hiệu', 'Studio Pack': 'Gói Studio', 'Archive Pack': 'Gói Lưu trữ' };
    return `Đã mua ${productNames[purchased[1]] || purchased[1]}`;
  }
  return text;
}

function relativeDate(value) {
  if (!value) return 'Đang chờ';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Gần đây';
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 2) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days} ngày trước` : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function api(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || 'Đã xảy ra lỗi.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

function showToast(message, type = '') {
  const region = $('#toast-region');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  region.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4800);
}

function initials(name) {
  return (name || 'L').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function setAvatar(element, user) {
  if (!element) return;
  element.textContent = initials(user?.name || 'L');
  if (user?.picture) {
    element.style.backgroundImage = `url("${user.picture}")`;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
    element.style.color = 'transparent';
  } else {
    element.style.backgroundImage = '';
    element.style.color = '';
  }
}

function renderProducts() {
  const products = state.config.products || [];
  $$('[data-product-count]').forEach((element) => { element.textContent = String(products.length); });
  const grid = $('#product-grid');
  if (!grid) return;
  grid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-visual ${product.tone}"><span class="product-number">${product.visual}</span><span class="product-tag">${product.tag}</span></div>
      <div class="product-content">
        <p class="eyebrow">${product.eyebrow}</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom"><span class="product-price">${formatVnd(product.price)}</span><button class="buy-button" type="button" data-buy="${product.id}">Mua gói ${icon('arrow-up-right')}</button></div>
      </div>
    </article>
  `).join('');
  $$('[data-buy]').forEach((button) => button.addEventListener('click', () => buyProduct(button.dataset.buy)));
  hydrateIcons();
}

function renderActivity() {
  const list = $('#activity-list');
  if (!list) return;
  const transactions = state.dashboard.transactions || [];
  if (!state.user) {
    list.innerHTML = '<div class="empty-state"><strong>Sổ giao dịch của bạn là riêng tư.</strong>Hãy đăng nhập để xem lịch sử nạp và mua hàng.</div>';
    return;
  }
  if (!transactions.length) {
    list.innerHTML = '<div class="empty-state"><strong>Chưa có giao dịch nào.</strong>Lần nạp đầu tiên sẽ hiển thị sau khi Pay2S xác nhận.</div>';
    return;
  }
  list.innerHTML = transactions.map((transaction) => {
    const positive = Number(transaction.amount) >= 0;
    const provider = transaction.provider === 'pay2s' ? 'Pay2S' : (transaction.provider || 'Chuột shop');
    return `<div class="activity-row"><span class="activity-icon ${positive ? '' : 'purchase'}">${icon(positive ? 'download' : 'bag')}</span><span class="activity-copy"><strong>${translateLedgerText(transaction.description || (positive ? 'Nạp tiền vào ví' : 'Mua gói'))}</strong><small>${relativeDate(transaction.createdAt)} · ${provider}</small></span><span class="activity-amount ${positive ? 'positive' : 'negative'}">${positive ? '+' : ''}${formatVnd(transaction.amount)}</span></div>`;
  }).join('');
}

function renderDepositHistory() {
  const list = $('#deposit-list');
  if (!list) return;
  const deposits = state.dashboard.deposits || [];
  if (!state.user) {
    list.innerHTML = '<div class="empty-state"><strong>Lịch sử nạp tiền là riêng tư.</strong>Hãy đăng nhập để xem các lần nạp Pay2S.</div>';
    return;
  }
  if (!deposits.length) {
    list.innerHTML = '<div class="empty-state"><strong>Chưa có lần nạp nào.</strong>Các lần nạp Pay2S sẽ xuất hiện ở đây sau khi được tạo.</div>';
    return;
  }
  list.innerHTML = deposits.map((deposit) => {
    const status = String(deposit.status || 'pending').toLowerCase();
    const statusLabel = status === 'paid' ? 'Đã thanh toán' : status === 'failed' ? 'Thất bại' : 'Đang chờ';
    const statusIcon = status === 'paid' ? 'shield' : status === 'failed' ? 'x' : 'clock';
    return `<div class="deposit-row"><span class="deposit-icon ${status}">${icon(statusIcon)}</span><span class="deposit-copy"><strong>${formatVnd(deposit.amount)}</strong><small>${deposit.orderId || 'Lần nạp Pay2S'} · ${relativeDate(deposit.paidAt || deposit.createdAt)}</small></span><span class="deposit-status ${status}">${statusLabel}</span></div>`;
  }).join('');
}

function renderState() {
  const user = state.user;
  const firstName = user?.name?.split(' ')[0] || '';
  $('#top-balance-value').textContent = formatVnd(state.dashboard.balance);
  if (!['add-funds', 'transactions', 'deposits'].includes(document.body.dataset.page)) {
    $('#greeting').textContent = user ? `Chào mừng trở lại, ${firstName}.` : 'Ví web của bạn, ở một nơi.';
    $('#intro-copy').textContent = 'Quản lý số dư để mua những món đồ bạn yêu thích.';
  }
  $('#sidebar-name').textContent = user?.name || 'Chế độ khách';
  $('#sidebar-email').textContent = user?.email || 'Đăng nhập để kích hoạt';
  $('#auth-label').textContent = user ? 'Đăng xuất' : 'Tiếp tục với Google';
  $('#auth-button').querySelector('[data-icon]').innerHTML = icon(user ? 'logout' : 'google');
  setAvatar($('#top-avatar'), user);
  setAvatar($('#sidebar-avatar'), user);
  const status = $('#connection-status');
  status.innerHTML = `<span class="status-dot ${user ? '' : 'offline'}"></span>${user ? 'Tài khoản đã kết nối' : 'Chế độ xem thử'}`;
  renderActivity();
  renderDepositHistory();
  hydrateIcons();
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function requireAuthAction(action) {
  if (!state.user) {
    showToast('Hãy đăng nhập bằng Google để kích hoạt ví Chuột shop.', 'error');
    return;
  }
  action();
}

function openDeposit(amount = '') {
  requireAuthAction(() => {
    $('#deposit-amount').value = amount || '';
    openModal('deposit-modal');
    window.setTimeout(() => $('#deposit-amount').focus(), 120);
  });
}

async function buyProduct(productId) {
  if (!state.user) {
    showToast('Hãy đăng nhập bằng Google để mua gói.', 'error');
    return;
  }
  const product = state.config.products.find((item) => item.id === productId);
  if (!product) return;
  if (Number(state.dashboard.balance) < Number(product.price)) {
    showToast('Số dư web chưa đủ cho gói này.', 'error');
    openDeposit(500000);
    return;
  }
  if (!window.confirm(`Mua ${product.name} với giá ${formatVnd(product.price)}?`)) return;
  try {
    const result = await api('/api/checkout', { method: 'POST', body: JSON.stringify({ productId }) });
    state.dashboard.balance = result.balance;
    await refreshDashboard();
    showToast(`Đã thêm ${product.name} vào bộ sưu tập của bạn.`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function submitDeposit(event) {
  event.preventDefault();
  const amount = Number($('#deposit-amount').value);
  if (!Number.isInteger(amount) || amount < 1000 || amount > 50000000) {
    showToast('Chọn số tiền từ ₫1k đến ₫50m.', 'error');
    return;
  }
  const button = $('#deposit-form button[type="submit"]');
  button.disabled = true;
  button.innerHTML = '<span>Đang chuẩn bị kết nối thanh toán an toàn…</span>';
  try {
    const result = await api('/api/deposits', { method: 'POST', body: JSON.stringify({ amount }) });
    closeModal('deposit-modal');
    if (result.payUrl) {
      window.location.href = result.payUrl;
    } else if (result.qrCode) {
      $('#qr-image').src = result.qrCode;
      $('#order-ref').textContent = `Đơn hàng ${result.orderId}`;
      openModal('qr-modal');
    } else {
      showToast('Thanh toán đã được chuẩn bị. Hãy làm theo hướng dẫn Pay2S để hoàn tất.', 'success');
    }
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    button.disabled = false;
    button.innerHTML = `<span>Tiếp tục đến Pay2S</span>${icon('arrow-up-right')}`;
  }
}

async function refreshDashboard() {
  if (!state.user) return;
  try {
    const dashboard = await api('/api/dashboard');
    state.user = dashboard.user || state.user;
    state.dashboard = dashboard;
    renderState();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function logout() {
  await api('/auth/logout', { method: 'POST' }).catch(() => {});
  state.user = null;
  state.dashboard = { balance: 0, transactions: [], deposits: [], purchases: [], storageConfigured: false };
  renderState();
    showToast('Bạn đã đăng xuất.');
}

function signIn() {
  if (!state.config.googleConfigured) {
    showToast('Hãy thêm GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET vào .env trước.', 'error');
    return;
  }
  window.location.href = '/auth/google';
}

function bindEvents() {
  on('#auth-button', 'click', () => state.user ? logout() : signIn());
  on('#sidebar-profile', 'click', () => state.user ? logout() : signIn());
  on('#top-avatar', 'click', () => state.user ? logout() : signIn());
  on('#open-deposit', 'click', () => openDeposit());
  $$('.fund-card').forEach((button) => button.addEventListener('click', () => openDeposit(button.dataset.amount)));
  $$('.modal-backdrop').forEach((backdrop) => backdrop.addEventListener('click', (event) => { if (event.target === backdrop) closeModal(backdrop.id); }));
  on('#close-deposit', 'click', () => closeModal('deposit-modal'));
  on('#close-qr', 'click', () => closeModal('qr-modal'));
  on('#qr-done', 'click', async () => { closeModal('qr-modal'); await refreshDashboard(); });
  on('#deposit-form', 'submit', submitDeposit);
  $$('[data-modal-amount]').forEach((button) => button.addEventListener('click', () => { $('#deposit-amount').value = button.dataset.modalAmount; }));
  on('#view-activity', 'click', () => { window.location.href = '/transactions.html'; });
  $('.mobile-menu').addEventListener('click', () => showToast('Dùng thanh điều hướng bên dưới để di chuyển trong Chuột shop.'));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeModal('deposit-modal'); closeModal('qr-modal'); } });
}

async function init() {
  translateStaticContent();
  hydrateIcons();
  bindEvents();
  const config = await api('/api/config').catch(() => ({ currency: 'VND', products: [] }));
  state.config = config;
  renderProducts();
  const me = await api('/api/me').catch(() => null);
  if (me?.user) {
    state.user = me.user;
    await refreshDashboard();
  }
  renderState();
  const params = new URLSearchParams(window.location.search);
  if (params.get('auth') === 'success') showToast('Chào mừng bạn đến với Chuột shop.', 'success');
  if (params.get('auth_error')) {
    const authError = params.get('auth_error');
    const knownErrors = {
      google_not_configured: 'Google OAuth chưa được cấu hình.',
      invalid_state: 'Phiên đăng nhập Google đã hết hạn. Vui lòng thử lại.',
      access_denied: 'Bạn đã hủy đăng nhập Google.'
    };
    showToast(knownErrors[authError] || `Đăng nhập Google thất bại: ${authError}`, 'error');
  }
  if (params.get('payment') === 'return') showToast('Đã quay lại từ trang thanh toán. Số dư sẽ cập nhật sau khi Pay2S xác nhận giao dịch.', 'success');
  if (params.has('auth') || params.has('auth_error') || params.has('payment')) window.history.replaceState({}, '', window.location.pathname);
}

init();
