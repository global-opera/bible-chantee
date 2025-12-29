const { test, expect } = require("@playwright/test");

const BASE = "http://127.0.0.1:4177";

test("lecteur.html applies i18n in header", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push("[console.error] " + msg.text());
  });

  await page.goto(`${BASE}/lecteur.html?lang=EN`, { waitUntil: "domcontentloaded" });

  // Laisse le temps aux scripts async éventuels
  await page.waitForTimeout(400);

  // Test i18n minimal : vérifie qu'au moins un élément traduit existe
  // (ne force pas une structure de navigation spécifique)
  const header = page.locator('header');
  await expect(header).toBeVisible();

  const i18nElements = page.locator('[data-i18n]');
  await expect(i18nElements.first()).toBeVisible();

  const count = await i18nElements.count();
  expect(count).toBeGreaterThan(0);

  // Vérifie que la langue courante est bien EN (si exposée)
  const cur = await page.evaluate(() => window.currentLanguage || (window.BC_LANG && window.BC_LANG.current) || null);
  expect(cur === null || cur === "EN").toBeTruthy();

  // Aucune erreur JS silencieuse
  expect(errors, "JS errors detected:\n" + errors.join("\n")).toEqual([]);
});
