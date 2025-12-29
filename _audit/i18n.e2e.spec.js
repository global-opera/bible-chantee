const { test, expect } = require('@playwright/test');

test('lecteur.html loads without JS execution errors', async ({ page }) => {
  console.log('🔍 E2E TEST LOADED FROM:', __filename);
  console.log('🔍 TEST VERSION: smoke-test (ignore 404 resource console errors)');

  const jsExecutionErrors = [];
  const consoleErrors = [];

  page.on('pageerror', (err) => {
    jsExecutionErrors.push(String(err));
  });

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;

    const text = msg.text() || '';

    // Ignore common browser "resource failed" noise (404 assets, favicon, etc.)
    if (/Failed to load resource/i.test(text)) return;
    if (/the server responded with a status of 404/i.test(text)) return;
    if (/net::ERR_/i.test(text)) return;

    consoleErrors.push(`[console.error] ${text}`);
  });

  await page.goto('http://127.0.0.1:4177/lecteur.html?lang=EN', { waitUntil: 'load' });
  console.log('🔍 Page loaded successfully');

  const all = [...jsExecutionErrors, ...consoleErrors];
  if (all.length) console.log('🔍 JS Execution Errors:', all);

  expect(all, 'JS execution errors detected:\n' + all.join('\n')).toEqual([]);
});
