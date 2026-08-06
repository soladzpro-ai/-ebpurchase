// Endpoint gửi lại mã OTP — độc lập, không đụng backend hiện có
import { generateOtp, storeOtp } from './store.js';

const RESEND_API_TOKEN = '';

export async function onRequestPost({ request, env }) {
  const RESEND_API_TOKEN = env.RESEND_API_TOKEN || "";
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'INVALID_EMAIL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const code = generateOtp();
    const result = storeOtp(email, code);
    if (result.cooldown) {
      return new Response(JSON.stringify({ ok: false, error: 'COOLDOWN', remainingMs: result.remainingMs }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Chuột shop <onboarding@resend.dev>',
        to: [email],
        subject: 'Mã xác nhận mới — Chuột shop',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4dc; border-radius: 12px;">
            <h2 style="color: #10110f; margin: 0 0 12px;">Chuột shop — Mã xác nhận mới</h2>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">Bạn đã yêu cầu gửi lại mã xác nhận. Mã mới của bạn là:</p>
            <div style="background: #f7f7f3; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10110f;">${code}</span>
            </div>
            <p style="color: #999; font-size: 12px; line-height: 1.6;">Mã có hiệu lực trong 5 phút. Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">© 2026 Chuột shop</p>
          </div>
        `
      })
    });

    const resendData = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'SEND_FAILED', message: resendData.message || 'Không gửi được email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true, message: 'Mã xác nhận mới đã gửi tới email của bạn.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: 'SERVER_ERROR', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
