// Hệ thống OTP độc lập — frontend, không đụng backend hiện có
// Chặn thanh toán bằng mã xác nhận gửi qua email Google

const OTP = {
  pendingAction: null,
  email: '',
  attempts: 0,
  cooldownUntil: 0,

  async send(email) {
    const res = await fetch('/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.error === 'COOLDOWN') {
        this.cooldownUntil = Date.now() + (data.remainingMs || 600000);
        throw new Error(`Vui lòng chờ ${Math.ceil((data.remainingMs || 600000) / 60000)} phút trước khi gửi lại mã.`);
      }
      throw new Error(data.message || data.error || 'Không gửi được mã xác nhận.');
    }
    return data;
  },

  async verify(email, code) {
    const res = await fetch('/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.error === 'COOLDOWN' || data.error === 'TOO_MANY_ATTEMPTS') {
        this.cooldownUntil = Date.now() + (data.remainingMs || 600000);
        throw new Error('Bạn đã nhập sai quá 3 lần. Vui lòng chờ 10 phút rồi thử lại.');
      }
      if (data.error === 'EXPIRED') throw new Error('Mã xác nhận đã hết hạn. Vui lòng gửi lại mã.');
      if (data.error === 'WRONG_CODE') throw new Error(`Mã xác nhận sai. Còn ${data.attemptsLeft || 0} lần thử.`);
      throw new Error(data.message || data.error || 'Xác thực thất bại.');
    }
    return data;
  },

  async resend(email) {
    const res = await fetch('/otp/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.error === 'COOLDOWN') {
        this.cooldownUntil = Date.now() + (data.remainingMs || 600000);
        throw new Error(`Vui lòng chờ ${Math.ceil((data.remainingMs || 600000) / 60000)} phút trước khi gửi lại mã.`);
      }
      throw new Error(data.message || data.error || 'Không gửi lại được mã.');
    }
    return data;
  },

  open(action, email) {
    this.pendingAction = action;
    this.email = email || '';
    this.attempts = 0;
    const modal = document.getElementById('otp-modal');
    const error = document.getElementById('otp-error');
    const code = document.getElementById('otp-code');
    if (error) error.style.display = 'none';
    if (code) code.value = '';
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      setTimeout(() => code && code.focus(), 120);
    }
  },

  close() {
    const modal = document.getElementById('otp-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    this.pendingAction = null;
  },

  showError(message) {
    const error = document.getElementById('otp-error');
    if (error) {
      error.textContent = message;
      error.style.display = 'block';
    }
  },

  async submit(code) {
    if (!this.email) {
      this.showError('Không có email xác thực.');
      return;
    }
    try {
      await this.verify(this.email, code);
      this.close();
      const action = this.pendingAction;
      this.pendingAction = null;
      if (action) await action();
    } catch (error) {
      this.showError(error.message);
    }
  }
};

// Bind events khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('otp-form');
  const resendBtn = document.getElementById('otp-resend');
  const cancelBtn = document.getElementById('otp-cancel');
  const closeBtn = document.getElementById('close-otp');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('otp-code');
      if (code) OTP.submit(code.value.trim());
    });
  }
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      try {
        await OTP.resend(OTP.email);
        OTP.showError('');
        const error = document.getElementById('otp-error');
        if (error) error.style.display = 'none';
        const code = document.getElementById('otp-code');
        if (code) code.value = '';
        alert('Mã xác nhận mới đã gửi tới email của bạn.');
      } catch (error) {
        OTP.showError(error.message);
      }
    });
  }
  if (cancelBtn) cancelBtn.addEventListener('click', () => OTP.close());
  if (closeBtn) closeBtn.addEventListener('click', () => OTP.close());
});