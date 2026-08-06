// Hệ thống OTP độc lập — KHÔNG đụng vào backend hiện có
// Lưu OTP trong global Map (hoạt động trong cùng isolate của Worker)

const otpStore = new Map();

export function getOtpStore() {
  return otpStore;
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function storeOtp(email, code) {
  const now = Date.now();
  const existing = otpStore.get(email);
  if (existing && existing.cooldownUntil > now) {
    return { cooldown: true, remainingMs: existing.cooldownUntil - now };
  }
  otpStore.set(email, {
    code,
    createdAt: now,
    attempts: 0,
    cooldownUntil: 0,
    lastSentAt: now
  });
  return { cooldown: false };
}

export function verifyOtp(email, code) {
  const record = otpStore.get(email);
  if (!record) return { ok: false, error: 'OTP_NOT_FOUND' };
  const now = Date.now();
  if (record.cooldownUntil > now) {
    return { ok: false, error: 'COOLDOWN', remainingMs: record.cooldownUntil - now };
  }
  if (now - record.createdAt > 5 * 60 * 1000) {
    otpStore.delete(email);
    return { ok: false, error: 'EXPIRED' };
  }
  if (record.attempts >= 3) {
    record.cooldownUntil = now + 10 * 60 * 1000;
    record.attempts = 0;
    return { ok: false, error: 'TOO_MANY_ATTEMPTS', remainingMs: 10 * 60 * 1000 };
  }
  if (record.code !== code) {
    record.attempts += 1;
    return { ok: false, error: 'WRONG_CODE', attemptsLeft: 3 - record.attempts };
  }
  otpStore.delete(email);
  return { ok: true };
}

export function resendOtp(email) {
  const record = otpStore.get(email);
  const now = Date.now();
  if (record && record.cooldownUntil > now) {
    return { cooldown: true, remainingMs: record.cooldownUntil - now };
  }
  const code = generateOtp();
  otpStore.set(email, {
    code,
    createdAt: now,
    attempts: 0,
    cooldownUntil: 0,
    lastSentAt: now
  });
  return { cooldown: false, code };
}