const { test, expect } = require('@playwright/test');

console.log('🔍 E2E TEST LOADED FROM:', __filename);
console.log('🔍 TEST VERSION: i18n-contract (lang var + optional data-i18n)');

test('lecteur.html applies i18n (minimal contract)', async ({ page }) => {
  await page.goto('http://127.0.0.1:4177/lecteur.html?lang=EN', { waitUntil: 'domcontentloaded' });

  // 1) Contract: language variable must be set (varies by page)
  await page.waitForFunction(() => {
    const v =
      window.currentLanguage ||
      (window.BC_LANG && (window.BC_LANG.current || window.BC_LANG.lang)) ||
      window.BC_CURRENT_LANG;
    return !!v;
  }, null, { timeout: 5000 });

  const lang = await page.evaluate(() => {
    return (
      window.currentLanguage ||
      (window.BC_LANG && (window.BC_LANG.current || window.BC_LANG.lang)) ||
      window.BC_CURRENT_LANG ||
      ''
    ).toString();
  });

  console.log('🔍 LANG DETECTED:', lang);
  expect(lang.toUpperCase()).toBe('EN');

  // 2) If the page uses data-i18n attributes, ensure at least one is visible.
  const i18nLocator = page.locator('[data-i18n], [data-i18n-html], [data-i18n-placeholder]');
  const count = await i18nLocator.count();
  console.log('🔍 DATA-I18N ELEMENT COUNT:', count);

  if (count > 0) {
    await expect(i18nLocator.first()).toBeVisible();
  } else {
    console.log('⚠️ No [data-i18n*] elements found on lecteur.html (ok: page may render i18n differently).');
  }
});
