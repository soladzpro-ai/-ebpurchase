import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const wranglerEntry = path.join(projectRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const localWranglerRoot = path.join(projectRoot, '.wrangler');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

loadDotEnv(path.join(projectRoot, '.env'));

const child = spawn(process.execPath, [wranglerEntry, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env: {
    ...process.env,
    XDG_CONFIG_HOME: path.join(localWranglerRoot, 'config'),
    XDG_CACHE_HOME: path.join(localWranglerRoot, 'cache')
  },
  shell: false,
  stdio: 'inherit'
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => child.kill(signal));
}

child.on('error', (error) => {
  console.error(`Could not start Wrangler: ${error.message}`);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
