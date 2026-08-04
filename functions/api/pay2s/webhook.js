import { getEnv, json, readJson, settlePay2sPayload } from '../../../src/lumen.js';

export async function onRequestPost({ request, env }) {
  const configuredToken = getEnv(env, 'PAY2S_WEBHOOK_TOKEN');
  const receivedToken = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (configuredToken && receivedToken !== configuredToken) return json(401, { success: false, error: 'Invalid webhook token.' });
  try {
    return json(200, { success: true, settled: await settlePay2sPayload(env, await readJson(request)) });
  } catch (error) {
    console.error('[pay2s webhook]', error.message);
    return json(500, { success: false, error: error.message });
  }
}
