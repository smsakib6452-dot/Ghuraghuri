import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\78cb261c-b681-48c2-9830-338a61f6e0c5';

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 0;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolvePromise, rejectPromise) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolvePromise();
      this.ws.onerror = (err) => rejectPromise(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { res, rej } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) rej(msg.error);
          else res(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = ++this.id;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} not ready`);
}

async function getWsEndpoint(port = 9222) {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('Chrome remote debugging endpoint not ready');
}

async function main() {
  console.log('Starting Next.js production server...');
  const server = spawn('npx.cmd', ['next', 'start', '-p', '3000'], { shell: true, stdio: 'ignore' });

  let chrome = null;
  let cdp = null;

  try {
    await waitForServer('http://localhost:3000/');
    console.log('Next.js is up on http://localhost:3000/');

    console.log('Starting headless Chrome...');
    const userProfile = resolve('temp-chrome-profile');
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--no-sandbox',
      '--remote-debugging-port=9222',
      `--user-data-dir=${userProfile}`,
      'about:blank'
    ], { stdio: 'ignore' });

    const wsUrl = await getWsEndpoint(9222);
    console.log('Connecting CDP to', wsUrl);
    cdp = new CDPClient(wsUrl);
    await cdp.connect();

    // Create a new target/page
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const targetWsUrl = `ws://127.0.0.1:9222/devtools/page/${targetId}`;
    const pageCdp = new CDPClient(targetWsUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('Runtime.enable');

    // Ensure output directories
    mkdirSync('screenshots', { recursive: true });
    if (!existsSync(ARTIFACT_DIR)) mkdirSync(ARTIFACT_DIR, { recursive: true });

    // 1. DESKTOP 1440px
    console.log('\n--- Capturing 1440px Desktop Screenshots ---');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await pageCdp.send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise((r) => setTimeout(r, 3000));

    // Pause the slideshow so it doesn't auto-rotate during capture
    await pageCdp.send('Runtime.evaluate', {
      expression: `
        const pauseBtn = document.querySelector('button[aria-label*="Pause"]');
        if (pauseBtn) pauseBtn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 500));

    for (let slideIdx = 0; slideIdx < 3; slideIdx++) {
      console.log(`Setting to Slide ${slideIdx + 1} at 1440px...`);
      const res = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const dots = Array.from(document.querySelectorAll('button')).filter(b => (b.getAttribute('aria-label') || '').startsWith('Slide'));
          if (dots[${slideIdx}]) {
            dots[${slideIdx}].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            return { clicked: true, count: dots.length, label: dots[${slideIdx}].getAttribute('aria-label') };
          }
          return { clicked: false, count: dots.length };
        })()`,
        returnByValue: true
      });
      console.log('Click result:', res.result?.value);
      // Wait for image load and smooth crossfade
      await new Promise((r) => setTimeout(r, 2000));

      const { data } = await pageCdp.send('Page.captureScreenshot', { format: 'png' });
      const filename = `hero-1440-slide-${slideIdx + 1}.png`;
      writeFileSync(resolve('screenshots', filename), Buffer.from(data, 'base64'));
      writeFileSync(resolve(ARTIFACT_DIR, filename), Buffer.from(data, 'base64'));
      console.log(`Saved: ${filename}`);
    }

    // 2. MOBILE 390px
    console.log('\n--- Capturing 390px Mobile Screenshots ---');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise((r) => setTimeout(r, 1000));

    for (let slideIdx = 0; slideIdx < 3; slideIdx++) {
      console.log(`Setting to Slide ${slideIdx + 1} at 390px...`);
      const res = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const dots = Array.from(document.querySelectorAll('button')).filter(b => (b.getAttribute('aria-label') || '').startsWith('Slide'));
          if (dots[${slideIdx}]) {
            dots[${slideIdx}].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            return { clicked: true, count: dots.length, label: dots[${slideIdx}].getAttribute('aria-label') };
          }
          return { clicked: false, count: dots.length };
        })()`,
        returnByValue: true
      });
      console.log('Click result:', res.result?.value);
      await new Promise((r) => setTimeout(r, 2000));

      const { data } = await pageCdp.send('Page.captureScreenshot', { format: 'png' });
      const filename = `hero-390-slide-${slideIdx + 1}.png`;
      writeFileSync(resolve('screenshots', filename), Buffer.from(data, 'base64'));
      writeFileSync(resolve(ARTIFACT_DIR, filename), Buffer.from(data, 'base64'));
      console.log(`Saved: ${filename}`);
    }

    console.log('\nAll 6 screenshots captured successfully!');
  } finally {
    if (cdp) cdp.close();
    if (chrome && chrome.pid) {
      try { spawn('taskkill', ['/pid', chrome.pid.toString(), '/f', '/t'], { shell: true }); } catch {}
    }
    if (server && server.pid) {
      try { spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t'], { shell: true }); } catch {}
    }
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
