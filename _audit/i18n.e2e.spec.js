const { test, expect } = require('@playwright/test');

test('lecteur.html loads without JS execution errors', async ({ page }) => {
  const jsErrors = [];

  // Catch uncaught JavaScript exceptions
  page.on('pageerror', (err) => {
    jsErrors.push(`[pageerror] ${err.message}`);
  });

  // Catch failed resource requests (missing files)
  page.on('requestfailed', (request) => {
    jsErrors.push(`[requestfailed] ${request.url()}`);
  });

  await page.goto('http://127.0.0.1:4177/lecteur.html?lang=EN', { waitUntil: 'load' });

  // Only fail if there are actual JS execution errors or missing critical resources
  expect(jsErrors, 'JS errors detected:\n' + jsErrors.join('\n')).toEqual([]);
});
