import { getSession, json } from '../../src/lumen.js';

export async function onRequestGet({ request, env }) {
  const user = await getSession(request, env);
  return user ? json(200, { user }) : json(401, { error: 'AUTH_REQUIRED' });
}
