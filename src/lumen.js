const CORE_PRODUCTS = [
  {
    id: 'focus-pack',
    name: 'Gói Tập trung',
    eyebrow: 'NĂNG SUẤT',
    description: 'Bộ công cụ lập kế hoạch tuần gọn gàng để làm việc bình tĩnh và sắc bén hơn.',
    price: 89000,
    tag: 'Phổ biến',
    visual: '01',
    tone: 'warm'
  },
  {
    id: 'signal-pack',
    name: 'Gói Tín hiệu',
    eyebrow: 'SÁNG TẠO',
    description: 'Bộ khởi đầu trực quan giúp ý tưởng của bạn trở nên rõ ràng và thuyết phục.',
    price: 149000,
    tag: 'Mới',
    visual: '02',
    tone: 'blue'
  },
  {
    id: 'studio-pack',
    name: 'Gói Studio',
    eyebrow: 'HỆ THỐNG',
    description: 'Bộ công cụ gọn nhẹ giúp biến ý tưởng thô thành hệ thống hoàn chỉnh.',
    price: 249000,
    tag: 'Đáng giá nhất',
    visual: '03',
    tone: 'green'
  },
  {
    id: 'archive-pack',
    name: 'Gói Lưu trữ',
    eyebrow: 'THAM KHẢO',
    description: 'Thư viện chọn lọc gồm prompt, mẫu quy trình và checklist.',
    price: 319000,
    tag: 'Có giới hạn',
    visual: '04',
    tone: 'purple'
  }
];

const ADDITIONAL_PACK_THEMES = [
  { slug: 'tap-trung', label: 'Tập trung', eyebrow: 'NĂNG SUẤT', tone: 'warm', tag: 'Phổ biến', description: 'Bộ công cụ giúp sắp xếp công việc và giữ nhịp làm việc rõ ràng.' },
  { slug: 'tin-hieu', label: 'Tín hiệu', eyebrow: 'SÁNG TẠO', tone: 'blue', tag: 'Mới', description: 'Bộ tài nguyên trực quan giúp phát triển và trình bày ý tưởng.' },
  { slug: 'studio', label: 'Studio', eyebrow: 'HỆ THỐNG', tone: 'green', tag: 'Đáng giá', description: 'Bộ khung gọn nhẹ để biến ý tưởng thành quy trình có thể dùng ngay.' },
  { slug: 'luu-tru', label: 'Lưu trữ', eyebrow: 'THAM KHẢO', tone: 'purple', tag: 'Giới hạn', description: 'Thư viện chọn lọc giúp tra cứu nhanh và xây dựng nền tảng lâu dài.' }
];

const ADDITIONAL_PRODUCTS = Array.from({ length: 96 }, (_, index) => {
  const theme = ADDITIONAL_PACK_THEMES[index % ADDITIONAL_PACK_THEMES.length];
  const edition = Math.floor(index / ADDITIONAL_PACK_THEMES.length) + 1;
  const sequence = index + CORE_PRODUCTS.length + 1;
  return {
    id: `${theme.slug}-${edition}-pack`,
    name: `Gói ${theme.label} ${String(edition).padStart(2, '0')}`,
    eyebrow: theme.eyebrow,
    description: `${theme.description} Phiên bản ${edition} được thiết kế cho nhu cầu sử dụng linh hoạt.`,
    price: 69000 + (index * 7000),
    tag: edition % 6 === 0 ? 'Nổi bật' : edition % 3 === 0 ? 'Mới' : theme.tag,
    visual: String(sequence).padStart(2, '0'),
    tone: theme.tone
  };
});

export const PRODUCTS = [...CORE_PRODUCTS, ...ADDITIONAL_PRODUCTS];

export const getEnv = (bindings, key, fallback = '') => bindings?.[key] || fallback;
export const now = () => new Date().toISOString();
export const currency = (bindings) => getEnv(bindings, 'WEB_CURRENCY', 'VND');

const PAY2S_ALIASES = {
  PAY2S_ACCESS_KEY: ['ACCESS_KEY'],
  PAY2S_SECRET_KEY: ['SECRET_KEY'],
  PAY2S_PARTNER_CODE: ['PARTNER_CODE'],
  PAY2S_API_BASE_URL: ['API_TAO_GIAO_DICH'],
  PAY2S_BANK_ACCOUNTS: ['BANK_ACCOUNTS', 'STK_BANK_ACCOUNTS']
};

function pay2sEnv(bindings, key, fallback = '') {
  const direct = getEnv(bindings, key);
  if (direct) return direct;
  for (const alias of PAY2S_ALIASES[key] || []) {
    const value = getEnv(bindings, alias);
    if (value) return value;
  }
  return fallback;
}

export function randomId(prefix) {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const random = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `${prefix}${Date.now().toString(36).toUpperCase()}${random}`;
}

function encodeBase64Url(value) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(normalized);
  return new Uint8Array([...binary].map((character) => character.charCodeAt(0)));
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function safeEqual(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
}

function sessionSecret(bindings) {
  return getEnv(bindings, 'SESSION_SECRET', 'local-only-session-secret');
}

export async function encodeSession(bindings, user) {
  const payload = encodeBase64Url(JSON.stringify({ ...user, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 }));
  return `${payload}.${await hmac(sessionSecret(bindings), payload)}`;
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.get('Cookie') || '').split(';').map((part) => {
    const index = part.indexOf('=');
    if (index < 0) return ['', ''];
    try { return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())]; } catch { return ['', '']; }
  }).filter(([key]) => key));
}

export async function getSession(request, bindings) {
  const token = parseCookies(request).lumen_session;
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, await hmac(sessionSecret(bindings), payload))) return null;
  try {
    const value = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
    return value.exp && value.exp > Date.now() ? value : null;
  } catch {
    return null;
  }
}

export function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/'];
  if (options.httpOnly !== false) parts.push('HttpOnly');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  if (options.maxAge != null) parts.push(`Max-Age=${options.maxAge}`);
  if (options.secure) parts.push('Secure');
  return parts.join('; ');
}

export function json(status, payload, extraHeaders = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  for (const [key, value] of Object.entries(extraHeaders)) {
    if (key.toLowerCase() === 'set-cookie' && Array.isArray(value)) value.forEach((cookie) => headers.append('Set-Cookie', cookie));
    else headers.set(key, value);
  }
  return new Response(JSON.stringify(payload), { status, headers });
}

export function redirect(location, cookies = []) {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store' });
  cookies.forEach((cookie) => headers.append('Set-Cookie', cookie));
  return new Response(null, { status: 302, headers });
}

export async function readJson(request) {
  try { return await request.json(); } catch { throw new Error('Dữ liệu JSON không hợp lệ.'); }
}

export function appOrigin(request, bindings) {
  return getEnv(bindings, 'APP_URL', new URL(request.url).origin).replace(/\/$/, '');
}

export function requireSession(request, bindings) {
  return getSession(request, bindings);
}

export const sanityConfigured = (bindings) => Boolean(getEnv(bindings, 'SANITY_PROJECT_ID') && getEnv(bindings, 'SANITY_DATASET', 'production') && getEnv(bindings, 'SANITY_API_TOKEN'));

function sanityUrl(bindings, kind) {
  const projectId = getEnv(bindings, 'SANITY_PROJECT_ID');
  const dataset = getEnv(bindings, 'SANITY_DATASET', 'production');
  const version = getEnv(bindings, 'SANITY_API_VERSION', '2025-01-01');
  return `https://${projectId}.api.sanity.io/v${version}/data/${kind}/${dataset}`;
}

async function sanityRequest(bindings, kind, options = {}) {
  if (!sanityConfigured(bindings)) throw new Error('Sanity chưa được cấu hình. Hãy thêm SANITY_PROJECT_ID, SANITY_DATASET và SANITY_API_TOKEN.');
  const response = await fetch(sanityUrl(bindings, kind), {
    method: options.method || 'GET',
    headers: { Authorization: `Bearer ${getEnv(bindings, 'SANITY_API_TOKEN')}`, 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Yêu cầu Sanity thất bại (${response.status})`);
  return data;
}

async function sanityQuery(bindings, query, params = {}) {
  const url = new URL(sanityUrl(bindings, 'query'));
  url.searchParams.set('query', query);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${getEnv(bindings, 'SANITY_API_TOKEN')}` } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Truy vấn Sanity thất bại (${response.status})`);
  return data.result;
}

async function sanityMutate(bindings, mutations) {
  return sanityRequest(bindings, 'mutate', { method: 'POST', body: { mutations } });
}

function userDocumentId(googleId) {
  return `lumen-user-${googleId}`;
}

export async function upsertUser(bindings, user) {
  if (!sanityConfigured(bindings)) return;
  const id = userDocumentId(user.googleId);
  const timestamp = now();
  await sanityMutate(bindings, [
    { createIfNotExists: { _id: id, _type: 'lumenUser', googleId: user.googleId, balance: 0, currency: currency(bindings), createdAt: timestamp } },
    { patch: { id, set: { googleId: user.googleId, authProvider: 'google', email: user.email, emailVerified: Boolean(user.emailVerified), name: user.name, picture: user.picture || '', lastLoginAt: timestamp, updatedAt: timestamp } } }
  ]);
}

async function getUserRecord(bindings, googleId) {
  if (!sanityConfigured(bindings)) return { _id: userDocumentId(googleId), balance: 0, currency: currency(bindings) };
  return (await sanityQuery(bindings, '*[_type == "lumenUser" && googleId == $googleId][0]', { googleId })) || { _id: userDocumentId(googleId), balance: 0, currency: currency(bindings) };
}

export async function getDashboard(bindings, googleId) {
  const fallback = { balance: 0, transactions: [], deposits: [], purchases: [], storageConfigured: sanityConfigured(bindings) };
  if (!sanityConfigured(bindings)) return fallback;
  const userId = userDocumentId(googleId);
  const [user, transactions, deposits, purchases] = await Promise.all([
    getUserRecord(bindings, googleId),
    sanityQuery(bindings, '*[_type == "lumenTransaction" && userId == $userId] | order(createdAt desc)[0...8]', { userId }),
    sanityQuery(bindings, '*[_type == "lumenDeposit" && userId == $googleId] | order(createdAt desc)[0...8]{ _id, orderId, amount, currency, status, provider, createdAt, paidAt, failureReason }', { googleId }),
    sanityQuery(bindings, '*[_type == "lumenPurchase" && userId == $userId] | order(createdAt desc)[0...8]', { userId })
  ]);
  return { balance: Number(user?.balance || 0), transactions: transactions || [], deposits: deposits || [], purchases: purchases || [], storageConfigured: true };
}

function parseBankAccounts(bindings) {
  return pay2sEnv(bindings, 'PAY2S_BANK_ACCOUNTS').split(/\r?\n|,/).map((line) => {
    const [accountNumber, bankId] = line.trim().split('|').map((value) => value?.trim());
    return accountNumber && bankId ? { account_number: accountNumber, bank_id: bankId } : null;
  }).filter(Boolean);
}

export const pay2sConfigured = (bindings) => Boolean(pay2sEnv(bindings, 'PAY2S_ACCESS_KEY') && pay2sEnv(bindings, 'PAY2S_SECRET_KEY') && pay2sEnv(bindings, 'PAY2S_PARTNER_CODE') && parseBankAccounts(bindings).length);

function pay2sPaymentUrl(bindings) {
  const configuredUrl = pay2sEnv(bindings, 'PAY2S_API_BASE_URL', 'https://payment.pay2s.vn').replace(/\/$/, '');
  return configuredUrl.endsWith('/v1/gateway/api/create') ? configuredUrl : `${configuredUrl}/v1/gateway/api/create`;
}

async function createPay2sPayment(bindings, { amount, orderId, request }) {
  if (!pay2sConfigured(bindings)) throw new Error('Pay2S chưa được cấu hình. Hãy thêm access key, secret key, partner code và tài khoản ngân hàng.');
  const requestId = randomId('REQ');
  const requestType = getEnv(bindings, 'PAY2S_REQUEST_TYPE', 'pay2s');
  const bankAccounts = parseBankAccounts(bindings);
  const origin = appOrigin(request, bindings);
  const redirectUrl = getEnv(bindings, 'PAY2S_REDIRECT_URL', `${origin}/?payment=return`);
  const ipnUrl = getEnv(bindings, 'PAY2S_IPN_URL', `${origin}/api/pay2s/ipn`);
  const orderInfo = `CHUOTSHOP${orderId}`.replace(/[^A-Za-z0-9]/g, '').slice(0, 32);
  const amountText = String(amount);
  const rawHash = `accessKey=${pay2sEnv(bindings, 'PAY2S_ACCESS_KEY')}&amount=${amountText}&bankAccounts=Array&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${pay2sEnv(bindings, 'PAY2S_PARTNER_CODE')}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = await hmac(pay2sEnv(bindings, 'PAY2S_SECRET_KEY'), rawHash);
  const payload = { accessKey: pay2sEnv(bindings, 'PAY2S_ACCESS_KEY'), partnerCode: pay2sEnv(bindings, 'PAY2S_PARTNER_CODE'), partnerName: getEnv(bindings, 'PAY2S_PARTNER_NAME', 'Ví Chuột shop'), requestId, amount, orderId, orderInfo, orderType: requestType, bankAccounts, redirectUrl, ipnUrl, requestType, signature };
  const response = await fetch(pay2sPaymentUrl(bindings), { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, body: JSON.stringify(payload) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || (data.resultCode != null && Number(data.resultCode) !== 0)) throw new Error(data.message || `Pay2S từ chối thanh toán (${response.status})`);
  return data;
}

function getPay2sToken(request) {
  return (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
}

function extractOrderId(value) {
  const match = String(value || '').toUpperCase().match(/DEP[A-Z0-9]+/);
  return match ? match[0] : '';
}

function extractTransactionList(payload) {
  if (Array.isArray(payload?.transactions)) return payload.transactions;
  if (Array.isArray(payload?.data?.transactions)) return payload.data.transactions;
  if (payload?.data && typeof payload.data === 'object') return [payload.data];
  return [payload];
}

export async function verifyPay2sIpnSignature(bindings, payload) {
  const received = payload.m2signature || payload.signature || '';
  if (!received || !pay2sEnv(bindings, 'PAY2S_SECRET_KEY')) return false;
  if (payload.partnerCode && payload.partnerCode !== pay2sEnv(bindings, 'PAY2S_PARTNER_CODE')) return false;
  const rawHash = [
    `accessKey=${pay2sEnv(bindings, 'PAY2S_ACCESS_KEY')}`,
    `amount=${payload.amount ?? ''}`,
    `extraData=${payload.extraData ?? ''}`,
    `message=${payload.message ?? ''}`,
    `orderId=${payload.orderId ?? ''}`,
    `orderInfo=${payload.orderInfo ?? ''}`,
    `orderType=${payload.orderType ?? ''}`,
    `partnerCode=${payload.partnerCode ?? ''}`,
    `payType=${payload.payType ?? ''}`,
    `requestId=${payload.requestId ?? ''}`,
    `responseTime=${payload.responseTime ?? ''}`,
    `resultCode=${payload.resultCode ?? ''}`,
    `transId=${payload.transId ?? ''}`
  ].join('&');
  return safeEqual(String(received).toLowerCase(), await hmac(pay2sEnv(bindings, 'PAY2S_SECRET_KEY'), rawHash));
}

export async function settlePay2sPayload(bindings, payload) {
  if (!sanityConfigured(bindings)) throw new Error('Cần cấu hình Sanity trước khi cộng tiền vào ví.');
  const settled = [];
  for (const transaction of extractTransactionList(payload)) {
    const transferType = String(transaction.transferType || transaction.type || payload.transferType || 'IN').toUpperCase();
    const resultCode = transaction.resultCode ?? payload.resultCode;
    if (transferType === 'OUT' || (resultCode != null && Number(resultCode) !== 0)) continue;
    const orderId = transaction.orderId || transaction.order_id || payload.orderId || extractOrderId(transaction.content || transaction.description || '');
    const amount = Number(transaction.transferAmount || transaction.amount || payload.amount || 0);
    if (!orderId || !Number.isInteger(amount) || amount <= 0) continue;
    const deposit = await sanityQuery(bindings, '*[_type == "lumenDeposit" && orderId == $orderId][0]', { orderId });
    if (!deposit || deposit.status === 'paid') continue;
    if (Number(deposit.amount) !== amount) {
      console.log(`[pay2s] amount adjusted for ${orderId}: expected ${deposit.amount}, received ${amount} — using actual received amount`);
    }
    const ledgerId = `lumen-ledger-${orderId}`;
    const existingLedger = await sanityQuery(bindings, '*[_type == "lumenTransaction" && _id == $ledgerId][0]._id', { ledgerId });
    if (existingLedger) continue;
    const paidAt = now();
    await sanityMutate(bindings, [
      { patch: { id: deposit._id, set: { status: 'paid', paidAt, providerData: transaction } } },
      { patch: { id: userDocumentId(deposit.userId), inc: { balance: amount }, set: { updatedAt: paidAt } } },
      { createIfNotExists: { _id: ledgerId, _type: 'lumenTransaction', userId: deposit.userId, kind: 'deposit', amount, currency: currency(bindings), description: 'Nạp tiền qua Pay2S', orderId, provider: 'pay2s', createdAt: paidAt } }
    ]);
    settled.push({ orderId, amount });
  }
  return settled;
}

export async function startDeposit(bindings, session, amount, request) {
  if (!sanityConfigured(bindings)) throw new Error('Sanity chưa được cấu hình. Hãy thêm các biến môi trường Sanity trước.');
  if (!pay2sConfigured(bindings)) throw new Error('Pay2S chưa được cấu hình. Hãy thêm các biến môi trường Pay2S trước.');
  if (!Number.isInteger(amount) || amount < 1000 || amount > 50000000) throw new Error('Số tiền phải từ 1.000 đến 50.000.000 VND.');
  await upsertUser(bindings, session);
  const orderId = randomId('DEP');
  const depositId = `lumen-deposit-${orderId}`;
  await sanityMutate(bindings, [{ create: { _id: depositId, _type: 'lumenDeposit', userId: session.googleId, orderId, amount, currency: currency(bindings), status: 'pending', provider: 'pay2s', createdAt: now() } }]);
  try {
    const payment = await createPay2sPayment(bindings, { amount, orderId, request });
    await sanityMutate(bindings, [{ patch: { id: depositId, set: { providerData: payment } } }]);
    console.log('[pay2s] payment response:', JSON.stringify(payment));
    return { orderId, payUrl: payment.payUrl || payment.paymentUrl || payment.payUrlWeb || payment.checkoutUrl || payment.url || payment.redirectUrl || null, qrCode: payment.qrList?.[0]?.qrCode || payment.qrCode || payment.qr || null, rawPayment: payment };
  } catch (error) {
    await sanityMutate(bindings, [{ patch: { id: depositId, set: { status: 'failed', failureReason: error.message, updatedAt: now() } } }]).catch(() => {});
    throw error;
  }
}

export async function checkout(bindings, session, productId) {
  if (!sanityConfigured(bindings)) throw new Error('Sanity chưa được cấu hình. Hãy thêm các biến môi trường Sanity trước.');
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) throw new Error('Không tìm thấy sản phẩm.');
  const user = await getUserRecord(bindings, session.googleId);
  if (Number(user.balance || 0) < product.price) {
    const error = new Error('Số dư web không đủ cho gói này.');
    error.statusCode = 402;
    throw error;
  }
  const purchaseId = randomId('PUR');
  const userId = userDocumentId(session.googleId);
  const createdAt = now();
  await sanityMutate(bindings, [
    { patch: { id: userId, dec: { balance: product.price }, set: { updatedAt: createdAt } } },
    { create: { _id: `lumen-purchase-${purchaseId}`, _type: 'lumenPurchase', userId: session.googleId, productId: product.id, productName: product.name, amount: product.price, currency: currency(bindings), purchaseId, createdAt } },
    { create: { _id: `lumen-ledger-${purchaseId}`, _type: 'lumenTransaction', userId: session.googleId, kind: 'purchase', amount: -product.price, currency: currency(bindings), description: `Đã mua ${product.name}`, purchaseId, createdAt } }
  ]);
  return { purchaseId, product, balance: Number(user.balance) - product.price };
}

export async function exchangeGoogleCode(bindings, code, request) {
  const origin = appOrigin(request, bindings);
  const redirectUri = getEnv(bindings, 'GOOGLE_REDIRECT_URI', `${origin}/auth/google/callback`);
  const tokenBody = new URLSearchParams({
    code: code || '',
    client_id: getEnv(bindings, 'GOOGLE_CLIENT_ID'),
    client_secret: getEnv(bindings, 'GOOGLE_CLIENT_SECRET'),
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  }).toString();
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenBody
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error(data.error_description || data.error || `Trao đổi mã Google thất bại (${response.status}).`);
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${data.access_token}` } });
  const user = await userResponse.json().catch(() => ({}));
  if (!userResponse.ok || !user.sub) throw new Error('Không thể tải hồ sơ người dùng Google.');
  return { googleId: user.sub, email: user.email || '', emailVerified: Boolean(user.email_verified), name: user.name || user.email || 'Thành viên Chuột shop', picture: user.picture || '' };
}

export function secureCookies(request) {
  return new URL(request.url).protocol === 'https:';
}