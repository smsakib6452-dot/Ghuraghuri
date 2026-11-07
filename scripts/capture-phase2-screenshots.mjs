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
  console.log('Starting Next.js production server on port 3000...');
  const server = spawn('npx.cmd', ['next', 'start', '-p', '3000'], { shell: true, stdio: 'ignore' });

  let chrome = null;
  let cdp = null;

  try {
    await waitForServer('http://localhost:3000/');
    console.log('Next.js is up on http://localhost:3000/');

    console.log('Starting headless Chrome...');
    const userProfile = resolve('temp-chrome-profile-phase2');
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

    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const targetWsUrl = `ws://127.0.0.1:9222/devtools/page/${targetId}`;
    const pageCdp = new CDPClient(targetWsUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('Runtime.enable');

    mkdirSync('screenshots', { recursive: true });
    if (!existsSync(ARTIFACT_DIR)) mkdirSync(ARTIFACT_DIR, { recursive: true });

    // Set mobile viewport 390x844
    console.log('\n--- Configuring 390px Mobile Viewport ---');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    const targets = [
      {
        url: 'http://localhost:3000/destinations/dayamoyee-temple-jamalpur',
        filename: 'dayamoyee-temple-jamalpur-commons-390.png',
        waitMs: 3000,
        desc: 'Dayamoyee Temple Jamalpur detail page with hero and photo caption'
      },
      {
        url: 'http://localhost:3000/destinations',
        filename: 'destinations-directory-commons-390.png',
        waitMs: 3000,
        desc: 'Destinations directory page 1 with updated authentic thumbnails'
      },
      {
        url: 'http://localhost:3000/credits',
        filename: 'credits-page-390.png',
        waitMs: 3000,
        desc: 'Dedicated Image Credits & Licensing page'
      },
      {
        url: 'http://localhost:3000/credits',
        filename: 'credits-table-390.png',
        waitMs: 2000,
        scroll: 650,
        desc: 'Credits table view on mobile'
      }
    ];

    for (const t of targets) {
      console.log(`Navigating to ${t.url} ...`);
      await pageCdp.send('Page.navigate', { url: t.url });
      await new Promise((r) => setTimeout(r, t.waitMs));

      if (t.scroll) {
        await pageCdp.send('Runtime.evaluate', {
          expression: `window.scrollTo(0, ${t.scroll});`
        });
        await new Promise((r) => setTimeout(r, 1000));
      }

      const { data } = await pageCdp.send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(resolve('screenshots', t.filename), Buffer.from(data, 'base64'));
      writeFileSync(resolve(ARTIFACT_DIR, t.filename), Buffer.from(data, 'base64'));
      console.log(`Saved screenshot: ${t.filename} (${t.desc})`);
    }

    console.log('\nAll 3 verification screenshots captured successfully!');
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
