import { checkout, getSession, json, readJson } from '../../src/lumen.js';

export async function onRequestPost({ request, env }) {
  const session = await getSession(request, env);
  if (!session) return json(401, { error: 'AUTH_REQUIRED', message: 'Vui lòng đăng nhập bằng Google trước.' });
  try {
    const body = await readJson(request);
    return json(201, await checkout(env, session, body.productId));
  } catch (error) {
    return json(error.statusCode || 400, { error: 'CHECKOUT_FAILED', message: error.message });
  }
}
