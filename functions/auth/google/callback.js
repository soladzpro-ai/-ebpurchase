import { encodeSession, exchangeGoogleCode, getSession, getEnv, redirect, secureCookies, serializeCookie, upsertUser } from '../../../src/lumen.js';

function cookies(request) {
  return Object.fromEntries((request.headers.get('Cookie') || '').split(';').map((part) => {
    const index = part.indexOf('=');
    if (index < 0) return ['', ''];
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';
  const storedState = cookies(request).oauth_state || '';
  if (!state || state !== storedState) return redirect('/?auth_error=invalid_state');
  if (url.searchParams.get('error')) return redirect(`/?auth_error=${encodeURIComponent(url.searchParams.get('error'))}`);
  let user;
  try {
    user = await exchangeGoogleCode(env, url.searchParams.get('code'), request);
  } catch (error) {
    console.error('[google oauth token exchange]', error.message);
    return redirect(`/?auth_error=${encodeURIComponent(`Trao đổi mã Google thất bại: ${error.message}`)}`);
  }
  try {
    await upsertUser(env, user);
    return redirect('/?auth=success', [
      serializeCookie('oauth_state', '', { sameSite: 'Lax', maxAge: 0, secure: secureCookies(request) }),
      serializeCookie('lumen_session', await encodeSession(env, user), { sameSite: 'Lax', maxAge: 60 * 60 * 24 * 14, secure: secureCookies(request) })
    ]);
  } catch (error) {
    console.error('[google oauth sanity sync]', error.message);
    return redirect(`/?auth_error=${encodeURIComponent(`Đồng bộ người dùng với Sanity thất bại: ${error.message}`)}`);
  }
}
