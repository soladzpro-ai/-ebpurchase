import { getDashboard, getSession, json } from '../../src/lumen.js';

export async function onRequestGet({ request, env }) {
  const user = await getSession(request, env);
  if (!user) return json(401, { error: 'AUTH_REQUIRED', message: 'Vui lòng đăng nhập bằng Google trước.' });
  try {
    return json(200, { user, ...(await getDashboard(env, user.googleId)) });
  } catch (error) {
    return json(500, { error: 'DASHBOARD_FAILED', message: error.message });
  }
}
