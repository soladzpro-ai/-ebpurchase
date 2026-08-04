import { getEnv, randomId, redirect, secureCookies, serializeCookie } from '../../src/lumen.js';

export function onRequestGet({ request, env }) {
  if (!getEnv(env, 'GOOGLE_CLIENT_ID') || !getEnv(env, 'GOOGLE_CLIENT_SECRET')) return redirect('/?auth_error=google_not_configured');
  const state = randomId('STATE');
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({ client_id: getEnv(env, 'GOOGLE_CLIENT_ID'), redirect_uri: getEnv(env, 'GOOGLE_REDIRECT_URI', `${origin}/auth/google/callback`), response_type: 'code', scope: 'openid email profile', access_type: 'online', state });
  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, [serializeCookie('oauth_state', state, { sameSite: 'Lax', maxAge: 600, secure: secureCookies(request) })]);
}
