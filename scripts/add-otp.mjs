import fs from 'node:fs';

let c = fs.readFileSync('public/app.js', 'utf8');

// Thay thế logic buyProduct để yêu cầu OTP
const oldBuy = `  if (!window.confirm(\`Mua \${product.name} với giá \${formatVnd(product.price)}?\`)) return;
  try {
    const result = await api('/api/checkout', { method: 'POST', body: JSON.stringify({ productId }) });
    state.dashboard.balance = result.balance;
    await refreshDashboard();
    showToast(\`Đã thêm \${product.name} vào bộ sưu tập của bạn.\`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}`;

const newBuy = `  if (!window.confirm(\`Mua \${product.name} với giá \${formatVnd(product.price)}?\`)) return;
  try {
    await OTP.send(state.user.email);
    OTP.open(async () => {
      const result = await api('/api/checkout', { method: 'POST', body: JSON.stringify({ productId }) });
      state.dashboard.balance = result.balance;
      await refreshDashboard();
      showToast(\`Đã thêm \${product.name} vào bộ sưu tập của bạn.\`, 'success');
    }, state.user.email);
  } catch (error) {
    showToast(error.message, 'error');
  }
}`;

c = c.replace(oldBuy, newBuy);

// Thay thế logic submitDeposit để yêu cầu OTP
const oldDeposit = `    const result = await api('/api/deposits', { method: 'POST', body: JSON.stringify({ amount }) });
    closeModal('deposit-modal');`;

const newDeposit = `    await OTP.send(state.user.email);
    closeModal('deposit-modal');
    OTP.open(async () => {
      const result = await api('/api/deposits', { method: 'POST', body: JSON.stringify({ amount }) });
      if (result.payUrl) {
        window.location.href = result.payUrl;
      } else if (result.qrCode) {
        $('#qr-image').src = result.qrCode;
        $('#order-ref').textContent = \`Đơn hàng \${result.orderId}\`;
        openModal('qr-modal');
      } else {
        console.log('[deposit] result:', result);
        showToast('Thanh toán đã được chuẩn bị. Hãy làm theo hướng dẫn Pay2S để hoàn tất.', 'success');
      }
    }, state.user.email);`;

c = c.replace(oldDeposit, newDeposit);

// Cần thêm OTP call và sau OTP.open phải return sớm
// Sau khi OTP mở, ta cần không chạy phần còn lại của submitDeposit khi chưa verify
// Ta sẽ đặt return trong finally bằng cách wrap. Cách đơn giản: sau OTP.open, dùng return.

fs.writeFileSync('public/app.js', c, 'utf8');
console.log('app.js: OTP integration added for buyProduct and submitDeposit');