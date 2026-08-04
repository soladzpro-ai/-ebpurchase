import { json, readJson, settlePay2sPayload, verifyPay2sIpnSignature } from '../../../src/lumen.js';

export async function onRequestPost({ request, env }) {
  try {
    const payload = await readJson(request);
    if (!(await verifyPay2sIpnSignature(env, payload))) return json(401, { success: false, error: 'Invalid Pay2S signature.' });
    return json(200, { success: true, settled: await settlePay2sPayload(env, payload) });
  } catch (error) {
    console.error('[pay2s ipn]', error.message);
    return json(500, { success: false, error: error.message });
  }
}
