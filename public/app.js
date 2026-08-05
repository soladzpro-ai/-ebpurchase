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
  ['Workspace', 'Khu vá»±c lÃ m viá»‡c'], ['Home', 'Trang chá»§'], ['Add funds', 'Náº¡p tiá»n'], ['Shop', 'Cá»­a hÃ ng'],
  ['Transactions', 'Giao dá»‹ch'], ['Deposits', 'Lá»‹ch sá»­ náº¡p'], ['Protected balance', 'Sá»‘ dÆ° Ä‘Æ°á»£c báº£o vá»‡'],
  ['Encrypted at rest', 'MÃ£ hÃ³a khi lÆ°u trá»¯'], ['Guest mode', 'Cháº¿ Ä‘á»™ khÃ¡ch'], ['Sign in to activate', 'ÄÄƒng nháº­p Ä‘á»ƒ kÃ­ch hoáº¡t'],
  ['Web balance', 'Sá»‘ dÆ° web'], ['Balance', 'Sá»‘ dÆ°'], ['Account menu', 'Menu tÃ i khoáº£n'], ['Open menu', 'Má»Ÿ menu'],
  ['Notifications', 'ThÃ´ng bÃ¡o'], ['Overview', 'Tá»•ng quan'], ['Tuesday Â· 04 August 2026', 'Thá»© Ba Â· 04 thÃ¡ng 08, 2026'],
  ['Your wallet, in one place.', 'VÃ­ web cá»§a báº¡n, á»Ÿ má»™t nÆ¡i.'], ['A considered balance for the things worth bringing home.', 'Quáº£n lÃ½ sá»‘ dÆ° Ä‘á»ƒ mua nhá»¯ng mÃ³n Ä‘á»“ báº¡n yÃªu thÃ­ch.'],
  ['Preview mode', 'Cháº¿ Ä‘á»™ xem thá»­'], ['Continue with Google', 'Tiáº¿p tá»¥c vá»›i Google'], ['Spend thoughtfully', 'Mua sáº¯m cÃ³ chá»§ Ä‘Ã­ch'],
  ['Shop the collection', 'KhÃ¡m phÃ¡ sáº£n pháº©m'], ['4 packages Â· digital delivery', '4 gÃ³i Â· giao hÃ ng ká»¹ thuáº­t sá»‘'], ['packages Â· digital delivery', 'gÃ³i Â· giao hÃ ng ká»¹ thuáº­t sá»‘'],
  ['Your ledger', 'Sá»• giao dá»‹ch'], ['Transaction history', 'Lá»‹ch sá»­ giao dá»‹ch'], ['View all', 'Xem táº¥t cáº£'],
  ['Pay2S records', 'Lá»‹ch sá»­ Pay2S'], ['Deposit history', 'Lá»‹ch sá»­ náº¡p tiá»n'], ['Last 8 deposits', '8 láº§n náº¡p gáº§n nháº¥t'],
  ['Security', 'Báº£o máº­t'], ['Terms', 'Äiá»u khoáº£n'], ['Support', 'Há»— trá»£'], ['Fund', 'Náº¡p tiá»n'], ['History', 'Giao dá»‹ch'],
  ['Pay2S transfer', 'Chuyá»ƒn tiá»n Pay2S'], ['How much do you want to add?', 'Báº¡n muá»‘n náº¡p bao nhiÃªu?'],
  ['Your payment opens securely with Pay2S. Your Chuá»™t shop balance updates only after the payment notification is verified.', 'Thanh toÃ¡n sáº½ má»Ÿ an toÃ n qua Pay2S. Sá»‘ dÆ° Chuá»™t shop chá»‰ cáº­p nháº­t sau khi xÃ¡c minh thÃ´ng bÃ¡o thanh toÃ¡n.'],
  ['Amount', 'Sá»‘ tiá»n'], ['Continue to Pay2S', 'Tiáº¿p tá»¥c Ä‘áº¿n Pay2S'], ['Secure handoff Â· no card details stored here', 'Káº¿t ná»‘i an toÃ n Â· khÃ´ng lÆ°u thÃ´ng tin tháº» táº¡i Ä‘Ã¢y'],
  ['Payment ready', 'Thanh toÃ¡n Ä‘Ã£ sáºµn sÃ ng'], ['Scan to add funds', 'QuÃ©t Ä‘á»ƒ náº¡p tiá»n'], ['Open your banking app and scan this code.', 'Má»Ÿ á»©ng dá»¥ng ngÃ¢n hÃ ng vÃ  quÃ©t mÃ£ nÃ y.'],
  ["I'll check my balance", 'TÃ´i Ä‘Ã£ kiá»ƒm tra sá»‘ dÆ°'], ['Iâ€™ll check my balance', 'TÃ´i Ä‘Ã£ kiá»ƒm tra sá»‘ dÆ°'], ['Wallet / Add funds', 'VÃ­ web / Náº¡p tiá»n'], ['Top up your web balance.', 'Náº¡p thÃªm vÃ o sá»‘ dÆ° web.'],
  ['Choose a package and complete the secure Pay2S handoff.', 'Chá»n má»™t má»‡nh giÃ¡ vÃ  hoÃ n táº¥t thanh toÃ¡n an toÃ n qua Pay2S.'],
  ['Move money in', 'Náº¡p tiá»n vÃ o'], ['Custom amount', 'Sá»‘ tiá»n tÃ¹y chá»n'], ['Quick test', 'DÃ¹ng thá»­ nhanh'], ['Small start', 'Báº¯t Ä‘áº§u nhá»'],
  ['Quick top-up', 'Náº¡p nhanh'], ['Everyday add', 'Náº¡p háº±ng ngÃ y'], ['Light start', 'Khá»Ÿi Ä‘áº§u nháº¹'], ['Most selected', 'ÄÆ°á»£c chá»n nhiá»u nháº¥t'],
  ['Build your balance', 'TÄƒng sá»‘ dÆ°'], ['More room to shop', 'Mua sáº¯m thoáº£i mÃ¡i hÆ¡n'], ['Settle in', 'Náº¡p dÃ¹ng dÃ i háº¡n'],
  ['Wallet / Transactions', 'VÃ­ web / Giao dá»‹ch'], ['Transaction history.', 'Lá»‹ch sá»­ giao dá»‹ch.'],
  ['A clear record of deposits and purchases made with your web balance.', 'Theo dÃµi rÃµ rÃ ng cÃ¡c láº§n náº¡p vÃ  mua báº±ng sá»‘ dÆ° web.'],
  ['All transactions', 'Táº¥t cáº£ giao dá»‹ch'], ['Sanity ledger', 'Sá»• lÆ°u trÃªn Sanity'], ['Wallet / Deposits', 'VÃ­ web / Náº¡p tiá»n'],
  ['Deposit history.', 'Lá»‹ch sá»­ náº¡p tiá»n.'], ['Track every Pay2S top-up and its confirmation status.', 'Theo dÃµi tá»«ng láº§n náº¡p Pay2S vÃ  tráº¡ng thÃ¡i xÃ¡c nháº­n.'],
  ['All deposits', 'Táº¥t cáº£ láº§n náº¡p'], ['Add funds', 'Náº¡p tiá»n']
]);

const ATTRIBUTE_TRANSLATIONS = new Map([
  ['Primary navigation', 'Äiá»u hÆ°á»›ng chÃ­nh'], ['Chuá»™t shop home', 'Trang chá»§ Chuá»™t shop'], ['Notifications', 'ThÃ´ng bÃ¡o'],
  ['Web balance', 'Sá»‘ dÆ° web'], ['Account menu', 'Menu tÃ i khoáº£n'], ['Open menu', 'Má»Ÿ menu'], ['Close', 'ÄÃ³ng'],
  ['Pay2S payment QR code', 'MÃ£ QR thanh toÃ¡n Pay2S']
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
  if (text === 'Pay2S wallet deposit') return 'Náº¡p tiá»n qua Pay2S';
  const purchased = text.match(/^Purchased (.+)$/);
  if (purchased) {
    const productNames = { 'Focus Pack': 'GÃ³i Táº­p trung', 'Signal Pack': 'GÃ³i TÃ­n hiá»‡u', 'Studio Pack': 'GÃ³i Studio', 'Archive Pack': 'GÃ³i LÆ°u trá»¯' };
    return `ÄÃ£ mua ${productNames[purchased[1]] || purchased[1]}`;
  }
  return text;
}

function relativeDate(value) {
  if (!value) return 'Äang chá»';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Gáº§n Ä‘Ã¢y';
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 2) return 'Vá»«a xong';
  if (minutes < 60) return `${minutes} phÃºt trÆ°á»›c`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giá» trÆ°á»›c`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days} ngÃ y trÆ°á»›c` : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function api(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || 'ÄÃ£ xáº£y ra lá»—i.');
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
        <div class="product-bottom"><span class="product-price">${formatVnd(product.price)}</span><button class="buy-button" type="button" data-buy="${product.id}">Mua gÃ³i ${icon('arrow-up-right')}</button></div>
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
    list.innerHTML = '<div class="empty-state"><strong>Sá»• giao dá»‹ch cá»§a báº¡n lÃ  riÃªng tÆ°.</strong>HÃ£y Ä‘Äƒng nháº­p Ä‘á»ƒ xem lá»‹ch sá»­ náº¡p vÃ  mua hÃ ng.</div>';
    return;
  }
  if (!transactions.length) {
    list.innerHTML = '<div class="empty-state"><strong>ChÆ°a cÃ³ giao dá»‹ch nÃ o.</strong>Láº§n náº¡p Ä‘áº§u tiÃªn sáº½ hiá»ƒn thá»‹ sau khi Pay2S xÃ¡c nháº­n.</div>';
    return;
  }
  list.innerHTML = transactions.map((transaction) => {
    const positive = Number(transaction.amount) >= 0;
    const provider = transaction.provider === 'pay2s' ? 'Pay2S' : (transaction.provider || 'Chuá»™t shop');
    return `<div class="activity-row"><span class="activity-icon ${positive ? '' : 'purchase'}">${icon(positive ? 'download' : 'bag')}</span><span class="activity-copy"><strong>${translateLedgerText(transaction.description || (positive ? 'Náº¡p tiá»n vÃ o vÃ­' : 'Mua gÃ³i'))}</strong><small>${relativeDate(transaction.createdAt)} Â· ${provider}</small></span><span class="activity-amount ${positive ? 'positive' : 'negative'}">${positive ? '+' : ''}${formatVnd(transaction.amount)}</span></div>`;
  }).join('');
}

function renderDepositHistory() {
  const list = $('#deposit-list');
  if (!list) return;
  const deposits = state.dashboard.deposits || [];
  if (!state.user) {
    list.innerHTML = '<div class="empty-state"><strong>Lá»‹ch sá»­ náº¡p tiá»n lÃ  riÃªng tÆ°.</strong>HÃ£y Ä‘Äƒng nháº­p Ä‘á»ƒ xem cÃ¡c láº§n náº¡p Pay2S.</div>';
    return;
  }
  if (!deposits.length) {
    list.innerHTML = '<div class="empty-state"><strong>ChÆ°a cÃ³ láº§n náº¡p nÃ o.</strong>CÃ¡c láº§n náº¡p Pay2S sáº½ xuáº¥t hiá»‡n á»Ÿ Ä‘Ã¢y sau khi Ä‘Æ°á»£c táº¡o.</div>';
    return;
  }
  list.innerHTML = deposits.map((deposit) => {
    const status = String(deposit.status || 'pending').toLowerCase();
    const statusLabel = status === 'paid' ? 'ÄÃ£ thanh toÃ¡n' : status === 'failed' ? 'Tháº¥t báº¡i' : 'Äang chá»';
    const statusIcon = status === 'paid' ? 'shield' : status === 'failed' ? 'x' : 'clock';
    return `<div class="deposit-row"><span class="deposit-icon ${status}">${icon(statusIcon)}</span><span class="deposit-copy"><strong>${formatVnd(deposit.amount)}</strong><small>${deposit.orderId || 'Láº§n náº¡p Pay2S'} Â· ${relativeDate(deposit.paidAt || deposit.createdAt)}</small></span><span class="deposit-status ${status}">${statusLabel}</span></div>`;
  }).join('');
}

function renderState() {
  const user = state.user;
  const firstName = user?.name?.split(' ')[0] || '';
  $('#top-balance-value').textContent = formatVnd(state.dashboard.balance);
  if (!['add-funds', 'transactions', 'deposits'].includes(document.body.dataset.page)) {
    $('#greeting').textContent = user ? `ChÃ o má»«ng trá»Ÿ láº¡i, ${firstName}.` : 'VÃ­ web cá»§a báº¡n, á»Ÿ má»™t nÆ¡i.';
    $('#intro-copy').textContent = 'Quáº£n lÃ½ sá»‘ dÆ° Ä‘á»ƒ mua nhá»¯ng mÃ³n Ä‘á»“ báº¡n yÃªu thÃ­ch.';
  }
  $('#sidebar-name').textContent = user?.name || 'Cháº¿ Ä‘á»™ khÃ¡ch';
  $('#sidebar-email').textContent = user?.email || 'ÄÄƒng nháº­p Ä‘á»ƒ kÃ­ch hoáº¡t';
  $('#auth-label').textContent = user ? 'ÄÄƒng xuáº¥t' : 'Tiáº¿p tá»¥c vá»›i Google';
  $('#auth-button').querySelector('[data-icon]').innerHTML = icon(user ? 'logout' : 'google');
  setAvatar($('#top-avatar'), user);
  setAvatar($('#sidebar-avatar'), user);
  const status = $('#connection-status');
  status.innerHTML = `<span class="status-dot ${user ? '' : 'offline'}"></span>${user ? 'TÃ i khoáº£n Ä‘Ã£ káº¿t ná»‘i' : 'Cháº¿ Ä‘á»™ xem thá»­'}`;
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
    showToast('HÃ£y Ä‘Äƒng nháº­p báº±ng Google Ä‘á»ƒ kÃ­ch hoáº¡t vÃ­ Chuá»™t shop.', 'error');
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
    showToast('HÃ£y Ä‘Äƒng nháº­p báº±ng Google Ä‘á»ƒ mua gÃ³i.', 'error');
    return;
  }
  const product = state.config.products.find((item) => item.id === productId);
  if (!product) return;
  if (Number(state.dashboard.balance) < Number(product.price)) {
    showToast('Sá»‘ dÆ° web chÆ°a Ä‘á»§ cho gÃ³i nÃ y.', 'error');
    openDeposit(500000);
    return;
  }
  if (!window.confirm(`Mua ${product.name} vá»›i giÃ¡ ${formatVnd(product.price)}?`)) return;
  try {
    const result = await api('/api/checkout', { method: 'POST', body: JSON.stringify({ productId }) });
    state.dashboard.balance = result.balance;
    await refreshDashboard();
    showToast(`ÄÃ£ thÃªm ${product.name} vÃ o bá»™ sÆ°u táº­p cá»§a báº¡n.`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function submitDeposit(event) {
  event.preventDefault();
  const amount = Number($('#deposit-amount').value);
  if (!Number.isInteger(amount) || amount < 1000 || amount > 50000000) {
    showToast('Chá»n sá»‘ tiá»n tá»« â‚«1k Ä‘áº¿n â‚«50m.', 'error');
    return;
  }
  const button = $('#deposit-form button[type="submit"]');
  button.disabled = true;
  button.innerHTML = '<span>Äang chuáº©n bá»‹ káº¿t ná»‘i thanh toÃ¡n an toÃ nâ€¦</span>';
  try {
    const result = await api('/api/deposits', { method: 'POST', body: JSON.stringify({ amount }) });
    closeModal('deposit-modal');
    if (result.payUrl) {
      window.location.href = result.payUrl;
    } else if (result.qrCode) {
      $('#qr-image').src = result.qrCode;
      $('#order-ref').textContent = `ÄÆ¡n hÃ ng ${result.orderId}`;
      openModal('qr-modal');
    } else {
      showToast('Thanh toÃ¡n Ä‘Ã£ Ä‘Æ°á»£c chuáº©n bá»‹. HÃ£y lÃ m theo hÆ°á»›ng dáº«n Pay2S Ä‘á»ƒ hoÃ n táº¥t.', 'success');
    }
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    button.disabled = false;
    button.innerHTML = `<span>Tiáº¿p tá»¥c Ä‘áº¿n Pay2S</span>${icon('arrow-up-right')}`;
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
    showToast('Báº¡n Ä‘Ã£ Ä‘Äƒng xuáº¥t.');
}

function signIn() {
  if (!state.config.googleConfigured) {
    showToast('HÃ£y thÃªm GOOGLE_CLIENT_ID vÃ  GOOGLE_CLIENT_SECRET vÃ o .env trÆ°á»›c.', 'error');
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
  $('.mobile-menu').addEventListener('click', () => showToast('DÃ¹ng thanh Ä‘iá»u hÆ°á»›ng bÃªn dÆ°á»›i Ä‘á»ƒ di chuyá»ƒn trong Chuá»™t shop.'));
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
  if (params.get('auth') === 'success') showToast('ChÃ o má»«ng báº¡n Ä‘áº¿n vá»›i Chuá»™t shop.', 'success');
  if (params.get('auth_error')) {
    const authError = params.get('auth_error');
    const knownErrors = {
      google_not_configured: 'Google OAuth chÆ°a Ä‘Æ°á»£c cáº¥u hÃ¬nh.',
      invalid_state: 'PhiÃªn Ä‘Äƒng nháº­p Google Ä‘Ã£ háº¿t háº¡n. Vui lÃ²ng thá»­ láº¡i.',
      access_denied: 'Báº¡n Ä‘Ã£ há»§y Ä‘Äƒng nháº­p Google.'
    };
    showToast(knownErrors[authError] || `ÄÄƒng nháº­p Google tháº¥t báº¡i: ${authError}`, 'error');
  }
  if (params.get('payment') === 'return') showToast('ÄÃ£ quay láº¡i tá»« trang thanh toÃ¡n. Sá»‘ dÆ° sáº½ cáº­p nháº­t sau khi Pay2S xÃ¡c nháº­n giao dá»‹ch.', 'success');
  if (params.has('auth') || params.has('auth_error') || params.has('payment')) window.history.replaceState({}, '', window.location.pathname);
}

init();
