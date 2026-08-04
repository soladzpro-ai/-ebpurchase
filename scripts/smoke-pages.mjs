import { spawn } from 'node:child_process';
import path from 'node:path';

const projectRoot = process.cwd();
const port = 8798;
const baseUrl = `http://localhost:${port}`;
const wrapper = path.join(projectRoot, 'scripts', 'run-wrangler.mjs');
const localWranglerRoot = path.join(projectRoot, '.wrangler');
const child = spawn(process.execPath, [wrapper, 'pages', 'dev', 'public', '--port', String(port), '--show-interactive-dev-session', 'false', '--log-level', 'error'], {
  cwd: projectRoot,
  env: { ...process.env, XDG_CONFIG_HOME: path.join(localWranglerRoot, 'config'), XDG_CACHE_HOME: path.join(localWranglerRoot, 'cache') },
  stdio: ['ignore', 'pipe', 'pipe']
});

let ready = false;
let lastError = '';
try {
  for (let attempt = 0; attempt < 45; attempt += 1) {
    try {
      const [page, addFundsPage, transactionsPage, depositsPage, config, me] = await Promise.all([
        fetch(`${baseUrl}/`),
        fetch(`${baseUrl}/add-funds`),
        fetch(`${baseUrl}/transactions`),
        fetch(`${baseUrl}/deposits`),
        fetch(`${baseUrl}/api/config`),
        fetch(`${baseUrl}/api/me`)
      ]);
      const configBody = await config.json().catch(() => ({}));
      const productCount = Array.isArray(configBody.products) ? configBody.products.length : 0;
      if (page.status === 200 && addFundsPage.status === 200 && transactionsPage.status === 200 && depositsPage.status === 200 && config.status === 200 && productCount === 100 && me.status === 401) {
        console.log(`PAGES_LOCAL_SMOKE_OK page=${page.status} addFunds=${addFundsPage.status} transactions=${transactionsPage.status} deposits=${depositsPage.status} products=${productCount} me=${me.status}`);
        ready = true;
        break;
      }
      lastError = `unexpected statuses page=${page.status} addFunds=${addFundsPage.status} transactions=${transactionsPage.status} deposits=${depositsPage.status} config=${config.status} products=${productCount} me=${me.status}`;
    } catch (error) {
      lastError = error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
} finally {
  child.kill('SIGTERM');
}

if (!ready) {
  const stderr = await new Promise((resolve) => {
    let output = '';
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.on('close', () => resolve(output));
    setTimeout(() => resolve(output), 1500);
  });
  console.error(`PAGES_LOCAL_SMOKE_FAILED ${lastError}${stderr ? `\n${stderr}` : ''}`);
  process.exit(1);
}
