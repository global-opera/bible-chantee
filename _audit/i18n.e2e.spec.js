const { test, expect } = require('@playwright/test');

test('lecteur.html loads without JS execution errors', async ({ page }) => {
  console.log('🔍 E2E TEST LOADED FROM:', __filename);
  console.log('🔍 TEST VERSION: DIAGNOSTIC - log all failed resources');

  const jsExecutionErrors = [];
  const consoleErrors = [];
  const failedResources = [];

  page.on('pageerror', (err) => {
    console.log('PAGE ERROR:', err.message);
    jsExecutionErrors.push(String(err));
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  // DIAGNOSTIC: Log all failed requests with full URL
  page.on('requestfailed', (request) => {
    const url = request.url();
    const errorText = request.failure()?.errorText || 'unknown error';
    console.log('REQUEST FAILED:', url, '→', errorText);
    failedResources.push(url);
  });

  await page.goto('http://127.0.0.1:4177/lecteur.html?lang=EN', { waitUntil: 'load' });
  console.log('🔍 Page loaded');
  console.log('🔍 Failed resources:', failedResources.length === 0 ? 'NONE' : failedResources.join(', '));

  const all = [...jsExecutionErrors, ...consoleErrors];
  if (all.length) console.log('🔍 JS Execution Errors:', all);

  expect(all, 'JS execution errors detected:\n' + all.join('\n')).toEqual([]);
});
