import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // wait 500ms
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not become ready`);
}

async function runLighthouse(url, runIndex) {
  const outputPath = resolve(`lh-report-temp-${runIndex}.json`);
  const args = [
    'lighthouse',
    url,
    '--form-factor=mobile',
    '--only-categories=performance',
    '--output=json',
    `--output-path=${outputPath}`,
    '--chrome-flags=--headless=new --no-sandbox',
    '--quiet'
  ];

  await new Promise((resolvePromise, rejectPromise) => {
    const proc = spawn('npx.cmd', args, { stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`Lighthouse exited with code ${code}`));
    });
  });

  const data = JSON.parse(readFileSync(outputPath, 'utf8'));
  try { unlinkSync(outputPath); } catch {}

  const perfScore = Math.round((data.categories.performance?.score || 0) * 100);
  const lcpAudit = data.audits['largest-contentful-paint'] || {};
  const lcpMs = Math.round(lcpAudit.numericValue || 0);
  const lcpDisplay = lcpAudit.displayValue || `${(lcpMs / 1000).toFixed(1)} s`;

  const totalBytes = data.audits['total-byte-weight']?.numericValue || 0;
  const transferKb = Math.round(totalBytes / 1024);

  return {
    run: runIndex,
    performance: perfScore,
    lcpMs,
    lcpDisplay,
    transferKb,
    data
  };
}

async function main() {
  const label = process.argv[2] || 'run';
  console.log(`=== Starting Next.js Production Server for Lighthouse [${label}] ===`);
  
  const server = spawn('npx.cmd', ['next', 'start', '-p', '3000'], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer('http://localhost:3000/');
    console.log('Server is ready on http://localhost:3000/');

    const runs = [];
    for (let i = 1; i <= 3; i++) {
      console.log(`Running Lighthouse mobile audit ${i}/3...`);
      const result = await runLighthouse('http://localhost:3000/', i);
      console.log(`Run ${i}: Score=${result.performance}, LCP=${result.lcpDisplay} (${result.lcpMs}ms), Transfer=${result.transferKb} KB`);
      runs.push(result);
    }

    // Sort by performance score to pick median
    runs.sort((a, b) => a.performance - b.performance || a.lcpMs - b.lcpMs);
    const median = runs[1];

    const summary = {
      label,
      runs: runs.map(r => ({ run: r.run, performance: r.performance, lcpDisplay: r.lcpDisplay, lcpMs: r.lcpMs, transferKb: r.transferKb })),
      median: {
        performance: median.performance,
        lcpDisplay: median.lcpDisplay,
        lcpMs: median.lcpMs,
        transferKb: median.transferKb
      }
    };

    console.log('\n=== Lighthouse 3-Run Median Result ===');
    console.log(JSON.stringify(summary, null, 2));

    writeFileSync(`lh-results-${label}.json`, JSON.stringify(summary, null, 2), 'utf8');
  } finally {
    console.log('Shutting down server...');
    // Kill child process tree on Windows
    if (server.pid) {
      try {
        spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t'], { shell: true });
      } catch {}
    }
  }
}

main().catch(err => {
  console.error('Lighthouse runner failed:', err);
  process.exit(1);
});

