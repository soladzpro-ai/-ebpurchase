import { getSession, json, readJson, startDeposit } from '../../src/lumen.js';

export async function onRequestPost({ request, env }) {
  const session = await getSession(request, env);
  if (!session) return json(401, { error: 'AUTH_REQUIRED', message: 'Vui lòng đăng nhập bằng Google trước.' });
  try {
    const body = await readJson(request);
    return json(201, await startDeposit(env, session, Number(body.amount), request));
  } catch (error) {
    return json(error.statusCode || 400, { error: 'DEPOSIT_FAILED', message: error.message });
  }
}
