const { test, expect } = require('@playwright/test');

console.log('🔍 E2E TEST LOADED FROM:', __filename);
console.log('🔍 TEST VERSION: smoke-test (page loads + no JS errors)');

test('lecteur.html loads without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('[console.error] ' + msg.text());
  });

  await page.goto('http://127.0.0.1:4177/lecteur.html?lang=EN', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  console.log('🔍 Page loaded successfully');
  console.log('🔍 JS Errors:', errors.length === 0 ? 'NONE ✅' : errors.join(', '));

  // Contract: page must load without JavaScript errors
  expect(errors, 'JS errors detected:\n' + errors.join('\n')).toEqual([]);
});
