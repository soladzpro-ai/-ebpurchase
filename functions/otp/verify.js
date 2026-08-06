// Endpoint xác thực OTP — độc lập, không đụng backend hiện có
import { verifyOtp } from './store.js';

export async function onRequestPost({ request }) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const code = String(body.code || '').trim();

    if (!email || !code) {
      return new Response(JSON.stringify({ ok: false, error: 'MISSING_FIELDS' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = verifyOtp(email, code);
    if (result.ok) {
      return new Response(JSON.stringify({ ok: true, message: 'Xác thực thành công.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let status = 400;
    if (result.error === 'COOLDOWN' || result.error === 'TOO_MANY_ATTEMPTS') status = 429;
    if (result.error === 'EXPIRED') status = 410;

    return new Response(JSON.stringify(result), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: 'SERVER_ERROR', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}