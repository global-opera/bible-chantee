const { test, expect } = require('@playwright/test');

console.log('🧪 SMOKE_TEST_ACTIVE');
console.log('🧪 TEST VERSION: smoke-test (ignore 404 resources)');

test('lecteur.html loads without JS execution errors', async ({ page }) => {
  const errors = [];

  page.on('pageerror', err => {
    errors.push(`[pageerror] ${err.message}`);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();

      // IGNORER les erreurs réseau classiques (favicon, assets, etc.)
      if (
        text.includes('Failed to load resource') ||
        text.includes('404') ||
        text.includes('Not Found')
      ) {
        return;
      }

      errors.push(`[console.error] ${text}`);
    }
  });

  await page.goto('http://127.0.0.1:4177/lecteur.html?lang=EN', {
    waitUntil: 'load'
  });

  console.log('✅ Page loaded');

  if (errors.length > 0) {
    console.error('❌ JS execution errors detected:\n' + errors.join('\n'));
  }

  expect(errors).toEqual([]);
});
