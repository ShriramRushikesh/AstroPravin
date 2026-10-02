import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const serverDir = path.resolve(rootDir, 'server');
const viteScript = path.resolve(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

// 1. Clean any stale zombie processes on ports 5173 and 5002
function freePort(port) {
  try {
    const stdout = execSync(`lsof -ti :${port}`, { encoding: 'utf-8' }).trim();
    if (stdout) {
      const pids = stdout.split('\n').map(p => Number(p.trim())).filter(Boolean);
      for (const pid of pids) {
        if (pid !== process.pid && pid !== process.ppid) {
          try { process.kill(pid, 'SIGKILL'); } catch (e) {}
        }
      }
    }
  } catch (e) {
    // Port is free
  }
}

freePort(5173);
freePort(5002);

console.log(`
==================================================
✨ Starting AstroPravin Full-Stack Application...
🌐 Frontend Website:  http://127.0.0.1:5173
💍 Matrimony Portal:  http://127.0.0.1:5173/matrimony
🛍️ Astro Store:       http://127.0.0.1:5173/store
📊 Admin CRM:         http://127.0.0.1:5173/admin
🚀 Backend API:       http://127.0.0.1:5002/api
💳 Razorpay Gateway:  LIVE (CONFIGURED)
==================================================
💡 KEEP THIS TERMINAL OPEN while using the site!
💡 Do NOT press Ctrl+C until you want to stop the app.
==================================================
`);

// 2. Launch Frontend on 5173 (Instant Vite HMR Dev Server with clearScreen disabled)
const vite = spawn('node', [viteScript, '--host', '127.0.0.1', '--port', '5173', '--clearScreen', 'false'], {
  cwd: rootDir,
  stdio: ['ignore', 'inherit', 'inherit'],
});

// 3. Launch Backend on 5002
const server = spawn('node', ['run_server.js'], {
  cwd: serverDir,
  stdio: ['ignore', 'inherit', 'inherit'],
  env: { ...process.env, PORT: '5002' },
});

vite.on('error', (err) => {
  console.error('❌ Frontend Vite error:', err);
});

server.on('error', (err) => {
  console.error('❌ Backend server error:', err);
});

function cleanup() {
  console.log('\n🛑 Stopping AstroPravin servers...');
  try { vite.kill('SIGINT'); } catch (e) {}
  try { server.kill('SIGINT'); } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
