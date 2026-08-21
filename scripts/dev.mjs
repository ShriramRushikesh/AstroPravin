import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const serverDir = path.resolve(rootDir, 'server');
const viteBin = path.resolve(rootDir, 'node_modules', '.bin', 'vite');

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

// 2. Build if dist is missing
if (!fs.existsSync(path.resolve(rootDir, 'dist', 'index.html'))) {
  console.log('📦 Building AstroPravin bundle for first run...');
  try {
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  } catch (e) {}
}

console.log('\n==================================================');
console.log('✨ AstroPravin Application Running');
console.log('🌐 Matrimony Portal: http://127.0.0.1:5173/matrimony');
console.log('🌐 Main Website:     http://127.0.0.1:5173');
console.log('📊 Admin CRM:        http://127.0.0.1:5173/admin');
console.log('🚀 Backend API:      http://127.0.0.1:5002/api');
console.log('💡 Keep this terminal window open while using the site');
console.log('==================================================\n');

// 3. Launch Frontend on 5173 (Instant 0-delay response)
const vite = spawn(viteBin, ['preview', '--host', '127.0.0.1', '--port', '5173'], {
  cwd: rootDir,
  stdio: 'inherit',
});

// 4. Launch Backend on 5002
const server = spawn('node', ['dist/main.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  env: { ...process.env, PORT: '5002' },
});

function cleanup() {
  console.log('\n🛑 Stopping AstroPravin servers...');
  try { vite.kill('SIGINT'); } catch (e) {}
  try { server.kill('SIGINT'); } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
