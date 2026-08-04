import { json, secureCookies, serializeCookie } from '../../src/lumen.js';

export function onRequestPost({ request }) {
  return json(200, { ok: true }, { 'Set-Cookie': serializeCookie('lumen_session', '', { sameSite: 'Lax', maxAge: 0, secure: secureCookies(request) }) });
}
